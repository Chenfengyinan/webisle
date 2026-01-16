export type TaskCategory = 'video' | 'writing' | 'event';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  content: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate?: string;
  completed: boolean;
  createdAt: number;
}

export interface FilterOptions {
  category?: TaskCategory | 'all';
  priority?: TaskPriority | 'all';
  status?: 'all' | 'active' | 'completed';
}
