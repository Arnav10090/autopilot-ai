interface Props {
  taskPlan: {
    modules: {
      module_name: string;
      tasks: {
        task_name: string;
        estimate_days: number;
        depends_on: string[];
      }[];
    }[];
  };
}

export default function TaskPlanView({ taskPlan }: Props) {
  return (
    <section className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Execution Plan</h2>

      <div className="space-y-8">
        {taskPlan.modules.map((module, i) => (
          <div key={i} className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {module.module_name}
            </h3>
            <div className="space-y-3">
              {module.tasks.map((task, j) => (
                <div
                  key={j}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        {task.task_name}
                      </div>
                      {task.depends_on.length > 0 && (
                        <div className="text-sm text-gray-500">
                          Depends on: {task.depends_on.join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {task.estimate_days} {task.estimate_days === 1 ? "day" : "days"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}