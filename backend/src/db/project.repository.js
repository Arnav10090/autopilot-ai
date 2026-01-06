import { pool } from "./index.js";
import { v4 as uuidv4 } from "uuid";

export async function saveProject(input, output) {
  const client = await pool.connect();
  const projectId = uuidv4();

  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO projects
       (id, project_description, team_size, deadline, skill_level, constraints, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        projectId,
        input.project_description,
        input.team_size,
        input.deadline,
        input.skill_level,
        input.constraints,
        output.status
      ]
    );

    await client.query(
      `INSERT INTO project_outputs
       (id, project_id, requirements, tech_stack, task_plan, risks)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        uuidv4(),
        projectId,
        output.requirements,
        output.tech_stack || null,
        output.task_plan || null,
        output.risks || null
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
      p.status,
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

