import { useState } from 'react';
import { Trash2, AlertCircle, Minus, ArrowDown, Calendar } from 'lucide-react';
import { Task, TaskCategory, TaskPriority } from '../types/task';
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '../utils/constants';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string, category: TaskCategory, priority: TaskPriority, dueDate?: string) => void;
}

export default function TaskCard({ task, onToggleComplete, onDelete, onUpdate }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');

  const handleSave = () => {
    if (!editContent.trim()) return;
    onUpdate(task.id, editContent.trim(), editCategory, editPriority, editDueDate || undefined);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(task.content);
    setEditCategory(task.category);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
    setIsEditing(false);
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={16} />;
      case 'medium':
        return <Minus size={16} />;
      case 'low':
        return <ArrowDown size={16} />;
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const isDueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-4 transition-all hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] task-card">
        <div className="space-y-3">
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as TaskCategory)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}优先级
                </option>
              ))}
            </select>
          </div>
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              保存
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-4 transition-all hover:bg-gray-50 hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] task-card">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="mt-1 w-5 h-5 cursor-pointer accent-blue-600"
        />

        <div className="flex-1 min-w-0">
          <div
            onClick={() => !task.completed && setIsEditing(true)}
            className={`cursor-pointer ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
          >
            {task.content}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: CATEGORY_CONFIG[task.category].color }}
            >
              {CATEGORY_CONFIG[task.category].label}
            </span>

            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: PRIORITY_CONFIG[task.priority].bgColor,
                color: PRIORITY_CONFIG[task.priority].textColor,
              }}
            >
              {getPriorityIcon(task.priority)}
              {PRIORITY_CONFIG[task.priority].label}
            </span>

            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  isOverdue
                    ? 'bg-red-100 text-red-800'
                    : isDueToday
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <Calendar size={12} />
                {new Date(task.dueDate).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded active:scale-95 transform"
          aria-label="删除任务"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
