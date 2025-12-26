
import React, { useState } from 'react';
import { generatePlanFromIdea } from '../services/geminiService';
import { Task, TaskStatus, Priority } from '../types';

interface AssistantProps {
  onTasksGenerated: (newTasks: Task[]) => void;
}

const Assistant: React.FC<AssistantProps> = ({ onTasksGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    const result = await generatePlanFromIdea(prompt);
    setGeneratedTasks(result);
    setIsGenerating(false);
  };

  const handleApply = () => {
    const tasks: Task[] = generatedTasks.map((t, i) => ({
      ...t,
      id: `gen-${Date.now()}-${i}`,
      subTasks: [],
      assignee: 'AI',
    }));
    onTasksGenerated(tasks);
    setGeneratedTasks([]);
    setPrompt('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-2 text-indigo-600">
           <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Nexus AI Planner</h2>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">Describe your project idea, and let NexusPM generate a structured project plan with tasks, priorities, and deadlines in seconds.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Help me plan a marketing launch for a new organic skincare line targetting Gen Z..."
          className="w-full h-32 p-4 text-lg border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-0 resize-none transition-all placeholder:text-slate-300"
        ></textarea>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-200"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generating Plan...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 14 7-7 7 7"/><path d="M12 7v14"/></svg>
                Generate Tasks
              </>
            )}
          </button>
        </div>
      </div>

      {generatedTasks.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Suggested Project Plan</h3>
              <button 
                onClick={handleApply}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-100"
              >
                Apply to Board
              </button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedTasks.map((task, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                  <div className="flex justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${task.priority === 'High' ? 'bg-rose-100 text-rose-700' : task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {task.priority}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{task.dueDate}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg mb-1">{task.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{task.description}</p>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default Assistant;
