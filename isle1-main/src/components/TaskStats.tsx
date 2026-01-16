import { Task, TaskCategory, TaskPriority } from '../types/task';
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '../utils/constants';
import { CheckCircle2, ListTodo, Calendar } from 'lucide-react';

interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const dueTodayCount = tasks.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    const today = new Date().toDateString();
    return new Date(t.dueDate).toDateString() === today;
  }).length;

  const categoryStats = Object.keys(CATEGORY_CONFIG).map((category) => ({
    category: category as TaskCategory,
    count: tasks.filter((t) => t.category === category).length,
  }));

  const priorityStats = Object.keys(PRIORITY_CONFIG).map((priority) => ({
    priority: priority as TaskPriority,
    count: tasks.filter((t) => t.priority === priority && !t.completed).length,
  }));

  return (
    <div className="bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">统计</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <ListTodo size={20} />
            <span className="text-sm font-medium">总任务数</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{totalTasks}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <CheckCircle2 size={20} />
            <span className="text-sm font-medium">已完成</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {completedTasks} <span className="text-sm">({completionRate}%)</span>
          </p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <Calendar size={20} />
            <span className="text-sm font-medium">今日到期</span>
          </div>
          <p className="text-2xl font-bold text-yellow-700">{dueTodayCount}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">分类统计</h4>
          <div className="space-y-2">
            {categoryStats.map(({ category, count }) => (
              <div key={category} className="flex items-center justify-between">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: CATEGORY_CONFIG[category].color }}
                >
                  {CATEGORY_CONFIG[category].label}
                </span>
                <span className="text-sm font-medium text-gray-600">{count} 个任务</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">优先级统计（未完成）</h4>
          <div className="space-y-2">
            {priorityStats.map(({ priority, count }) => (
              <div key={priority} className="flex items-center justify-between">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: PRIORITY_CONFIG[priority].bgColor,
                    color: PRIORITY_CONFIG[priority].textColor,
                  }}
                >
                  {PRIORITY_CONFIG[priority].label}优先级
                </span>
                <span className="text-sm font-medium text-gray-600">{count} 个任务</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
