import { useState, useEffect, useMemo } from 'react';
import { Task, TaskCategory, TaskPriority, FilterOptions } from './types/task';
import { loadTasks, saveTasks } from './utils/taskStorage';
import TaskInput from './components/TaskInput';
import TaskCard from './components/TaskCard';
import TaskFilter from './components/TaskFilter';
import TaskStats from './components/TaskStats';
import Pagination from './components/Pagination';

const ITEMS_PER_PAGE = 6;

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    priority: 'all',
    status: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (content: string, category: TaskCategory, priority: TaskPriority, dueDate?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      content,
      category,
      priority,
      dueDate,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateTask = (
    id: string,
    content: string,
    category: TaskCategory,
    priority: TaskPriority,
    dueDate?: string
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, content, category, priority, dueDate } : task
      )
    );
  };

  const sortedAndFilteredTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (filters.category && filters.category !== 'all' && task.category !== filters.category) {
        return false;
      }
      if (filters.priority && filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }
      if (filters.status === 'active' && task.completed) {
        return false;
      }
      if (filters.status === 'completed' && !task.completed) {
        return false;
      }
      return true;
    });

    const priorityOrder = { high: 0, medium: 1, low: 2 };

    return filtered.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      const aHasDate = !!a.dueDate;
      const bHasDate = !!b.dueDate;

      if (aHasDate && bHasDate) {
        const dateA = new Date(a.dueDate!).getTime();
        const dateB = new Date(b.dueDate!).getTime();
        if (dateA !== dateB) {
          return dateA - dateB;
        }
      } else if (aHasDate && !bHasDate) {
        return -1;
      } else if (!aHasDate && bHasDate) {
        return 1;
      }

      return b.createdAt - a.createdAt;
    });
  }, [tasks, filters]);

  const totalPages = Math.ceil(sortedAndFilteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedAndFilteredTasks.slice(startIndex, endIndex);
  }, [sortedAndFilteredTasks, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    if (sortedAndFilteredTasks.length > 0 && paginatedTasks.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [sortedAndFilteredTasks.length, paginatedTasks.length, currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E3F2FD] to-[#F3E5F5]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
            ISLE编辑家园
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 space-y-6">
            <TaskInput onAddTask={addTask} />
            <TaskFilter filters={filters} onFilterChange={setFilters} />
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-4">
              {sortedAndFilteredTasks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-8 text-center text-gray-500">
                  {tasks.length === 0 ? '暂无任务，开始添加吧！' : '没有符合筛选条件的任务'}
                </div>
              ) : (
                <>
                  {paginatedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={toggleComplete}
                      onDelete={deleteTask}
                      onUpdate={updateTask}
                    />
                  ))}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={sortedAndFilteredTasks.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <TaskStats tasks={tasks} />
        </div>
      </div>
    </div>
  );
}

export default App;
