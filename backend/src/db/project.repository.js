import { pool } from "./index.js";

export async function saveProject(input, output, userId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert project with user_id, returning the auto-generated id
    const projectResult = await client.query(
      `INSERT INTO projects
       (user_id, project_description, team_size, deadline, skill_level, constraints, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id`,
      [
        userId,
        input.project_description,
        input.team_size,
        input.deadline,
        input.skill_level,
        input.constraints,
        output.status
      ]
    );

    const projectId = projectResult.rows[0].id;

    // Ensure outputs are stored as JSON strings (or null) to avoid inserting undefined/null objects
    const requirementsValue = output.requirements ? JSON.stringify(output.requirements) : null;
    const techStackValue = output.tech_stack ? JSON.stringify(output.tech_stack) : null;
    const taskPlanValue = output.task_plan ? JSON.stringify(output.task_plan) : null;
    const risksValue = output.risks ? JSON.stringify(output.risks) : null;

    await client.query(
      `INSERT INTO project_outputs
       (project_id, requirements, tech_stack, task_plan, risks)
       VALUES ($1,$2,$3,$4,$5)`,
      [
        projectId,
        requirementsValue,
        techStackValue,
        taskPlanValue,
        risksValue
      ]
    );

    await client.query("COMMIT");
    return projectId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getProjectById(projectId) {
  const { rows } = await pool.query(
    `
    SELECT 
      p.id,
      p.project_description,
      p.team_size,
      p.deadline,
      p.skill_level,
      p.constraints,
      p.status,
      p.created_at,
      o.requirements,
      o.tech_stack,
      o.task_plan,
      o.risks
    FROM projects p
    JOIN project_outputs o ON p.id = o.project_id
    WHERE p.id = $1
    `,
    [projectId]
  );

  return rows[0];
}

export async function getAllProjects(userId) {
  const { rows } = await pool.query(
    `
    SELECT
      p.id,
      p.project_description,
      p.status,
      p.deadline,
      p.skill_level,
      p.team_size,
      p.created_at,
      o.tech_stack
    FROM projects p
    LEFT JOIN project_outputs o ON p.id = o.project_id
    WHERE p.user_id = $1
    ORDER BY p.created_at DESC
    `,
    [userId]
  );

  return rows;
}


export async function getProjectMetrics(startDate, userId) {
  // If userId is provided, filter by user, otherwise global (or null if you want user-specific only)
  // The query should be updated to optionally filter by user_id
  let queryText = `
    SELECT
      COUNT(p.id) as total_projects,
      COUNT(o.id) as total_analyzed,
      COUNT(p.id) FILTER (WHERE p.created_at >= $1) as period_projects
    FROM projects p
    LEFT JOIN project_outputs o ON p.id = o.project_id
    WHERE p.created_at >= $1
  `;
  
  const params = [startDate];
  
  if (userId) {
    queryText += ` AND p.user_id = $2`;
    params.push(userId);
  }

  const { rows } = await pool.query(queryText, params);

  return {
    totalProjects: parseInt(rows[0].period_projects || 0, 10),
    // We can add more complex DB metrics here if needed
  };
}
