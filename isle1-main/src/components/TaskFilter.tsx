import { FilterOptions, TaskCategory, TaskPriority } from '../types/task';
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '../utils/constants';

interface TaskFilterProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export default function TaskFilter({ filters, onFilterChange }: TaskFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">筛选</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          分类
        </label>
        <select
          value={filters.category || 'all'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              category: e.target.value === 'all' ? 'all' : (e.target.value as TaskCategory),
            })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">全部分类</option>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          优先级
        </label>
        <select
          value={filters.priority || 'all'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              priority: e.target.value === 'all' ? 'all' : (e.target.value as TaskPriority),
            })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">全部优先级</option>
          {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}优先级
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          状态
        </label>
        <select
          value={filters.status || 'all'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              status: e.target.value as FilterOptions['status'],
            })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">全部任务</option>
          <option value="active">未完成</option>
          <option value="completed">已完成</option>
        </select>
      </div>
    </div>
  );
}
