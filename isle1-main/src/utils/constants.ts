import { TaskCategory, TaskPriority } from '../types/task';

export const CATEGORY_CONFIG: Record<TaskCategory, { label: string; color: string }> = {
  video: { label: '视频创作', color: '#3498DB' },
  writing: { label: '文案创作', color: '#2ECC71' },
  event: { label: '活动组织', color: '#9B59B6' },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bgColor: string; textColor: string }> = {
  high: { label: '高', color: '#E74C3C', bgColor: '#E74C3C', textColor: '#FFFFFF' },
  medium: { label: '中', color: '#F39C12', bgColor: '#F39C12', textColor: '#000000' },
  low: { label: '低', color: '#27AE60', bgColor: '#27AE60', textColor: '#FFFFFF' },
};
