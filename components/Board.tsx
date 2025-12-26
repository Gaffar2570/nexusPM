
import React, { useState } from 'react';
import { Task, TaskStatus, Priority, Client } from '../types';
import { getTaskBreakdown } from '../services/geminiService';

interface BoardProps {
  tasks: Task[];
  clients: Client[];
  onUpdateTask: (task: Task) => void;
  onAddTask: () => void;
  selectedClientId: string | null;
  filterToday: boolean;
}

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const colors = {
    [Priority.LOW]: 'bg-emerald-100 text-emerald-700',
    [Priority.MEDIUM]: 'bg-amber-100 text-amber-700',
    [Priority.HIGH]: 'bg-rose-100 text-rose-700'
  };
  return <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${colors[priority]}`}>{priority}</span>;
};

const Board: React.FC<BoardProps> = ({ tasks, clients, onUpdateTask, onAddTask, selectedClientId, filterToday }) => {
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  const columns = [
    { title: 'To Do', status: TaskStatus.TODO, color: 'bg-slate-400' },
    { title: 'In Progress', status: TaskStatus.IN_PROGRESS, color: 'bg-indigo-500' },
    { title: 'Review', status: TaskStatus.REVIEW, color: 'bg-amber-500' },
    { title: 'Done', status: TaskStatus.DONE, color: 'bg-emerald-500' }
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter(task => {
    const clientMatch = !selectedClientId || task.clientId === selectedClientId;
    const dateMatch = !filterToday || task.dueDate === todayStr;
    return clientMatch && dateMatch;
  });

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    onUpdateTask({ ...task, status: newStatus });
  };

  const handleAIExpand = async (task: Task) => {
    setLoadingAI(task.id);
    const suggestedSubtasks = await getTaskBreakdown(task.title, task.description);
    if (suggestedSubtasks.length > 0) {
      const newSubTasks = suggestedSubtasks.map((s: any, idx: number) => ({
        id: `${task.id}-sub-${idx}`,
        title: s.title,
        completed: false
      }));
      onUpdateTask({ ...task, subTasks: [...task.subTasks, ...newSubTasks] });
    }
    setLoadingAI(null);
  };

  const toggleSubtask = (task: Task, subId: string) => {
    const updatedSubTasks = task.subTasks.map(s => 
      s.id === subId ? { ...s, completed: !s.completed } : s
    );
    onUpdateTask({ ...task, subTasks: updatedSubTasks });
  };

  return (
    <div className="flex gap-6 min-h-[calc(100vh-200px)] overflow-x-auto pb-6 custom-scrollbar">
      {columns.map(column => {
        const columnTasks = filteredTasks.filter(t => t.status === column.status);
        return (
          <div key={column.status} className="flex-shrink-0 w-80 flex flex-col">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${column.color}`}></div>
                <h3 className="font-bold text-slate-700 text-sm tracking-tight">{column.title}</h3>
                <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
              {column.status === TaskStatus.TODO && (
                <button onClick={onAddTask} className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
              )}
            </div>

            <div className="flex-1 space-y-4 bg-slate-50/50 rounded-2xl p-2 min-h-[100px] border border-transparent hover:border-slate-100 transition-colors">
              {columnTasks.map(task => {
                const client = clients.find(c => c.id === task.clientId);
                const isOverdue = task.dueDate < todayStr && task.status !== TaskStatus.DONE;
                
                return (
                  <div key={task.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        <PriorityBadge priority={task.priority} />
                        {client && (
                          <span 
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider"
                            style={{ borderColor: `${client.color}40`, color: client.color, backgroundColor: `${client.color}10` }}
                          >
                            {client.name}
                          </span>
                        )}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button onClick={() => {
                            const statuses = Object.values(TaskStatus);
                            const currentIndex = statuses.indexOf(task.status);
                            if (currentIndex < statuses.length - 1) handleStatusChange(task, statuses[currentIndex + 1]);
                        }} className="p-1 text-slate-400 hover:text-indigo-600 rounded bg-slate-50">
                           <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-slate-900 mb-1 leading-snug">{task.title}</h4>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
                    
                    {task.subTasks.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          <span>Progress</span>
                          <span>{Math.round((task.subTasks.filter(s => s.completed).length / task.subTasks.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full transition-all duration-500" 
                            style={{ width: `${(task.subTasks.filter(s => s.completed).length / task.subTasks.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-1">
                      <div className="flex items-center gap-2">
                        <img src={`https://picsum.photos/seed/${task.assignee}/24/24`} className="w-6 h-6 rounded-full border border-slate-100" alt="Assignee" />
                        <button 
                          onClick={() => handleAIExpand(task)}
                          disabled={loadingAI === task.id}
                          className="p-1 text-indigo-500 hover:bg-indigo-50 rounded transition-colors"
                        >
                          {loadingAI === task.id ? (
                            <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                          )}
                        </button>
                      </div>
                      
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold ${isOverdue ? 'text-rose-600 bg-rose-50' : 'text-slate-400 bg-slate-50'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {task.dueDate === todayStr ? 'Today' : new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Board;
