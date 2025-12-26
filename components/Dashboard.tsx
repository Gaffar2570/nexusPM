
import React, { useMemo, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Task, TaskStatus } from '../types';
import { getProjectSummary } from '../services/geminiService';

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const [aiSummary, setAiSummary] = useState<string>("Analyzing project status...");
  const [isSummarizing, setIsSummarizing] = useState(false);

  const stats = useMemo(() => {
    const statusData = Object.values(TaskStatus).map(status => ({
      name: status,
      value: tasks.filter(t => t.status === status).length
    }));

    const priorityData = [
      { name: 'High', value: tasks.filter(t => t.priority === 'High').length, color: '#f43f5e' },
      { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length, color: '#f59e0b' },
      { name: 'Low', value: tasks.filter(t => t.priority === 'Low').length, color: '#10b981' }
    ];

    const completed = tasks.filter(t => t.status === TaskStatus.DONE).length;
    const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

    return { statusData, priorityData, completionRate, total: tasks.length };
  }, [tasks]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (tasks.length === 0) return;
      setIsSummarizing(true);
      const summary = await getProjectSummary(tasks);
      setAiSummary(summary || "No summary available.");
      setIsSummarizing(false);
    };
    fetchSummary();
  }, [tasks]);

  const COLORS = ['#94a3b8', '#6366f1', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Tasks</p>
          <h3 className="text-3xl font-bold text-slate-900">{stats.total}</h3>
          <div className="mt-2 text-xs text-emerald-600 font-medium">↑ 12% from last week</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Completion Rate</p>
          <h3 className="text-3xl font-bold text-slate-900">{stats.completionRate}%</h3>
          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full" style={{ width: `${stats.completionRate}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Active Blocks</p>
          <h3 className="text-3xl font-bold text-slate-900">{tasks.filter(t => t.priority === 'High' && t.status !== TaskStatus.DONE).length}</h3>
          <div className="mt-2 text-xs text-rose-600 font-medium italic">Requires attention</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Team Velocity</p>
          <h3 className="text-3xl font-bold text-slate-900">4.2</h3>
          <div className="mt-2 text-xs text-slate-400 font-medium">Tasks / Day avg.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Task Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Priority Mix</h3>
          <div className="h-64 flex flex-col items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.priorityData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
             <div className="flex gap-4 mt-4">
                {stats.priorityData.map(p => (
                   <div key={p.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></div>
                      <span className="text-xs font-medium text-slate-600">{p.name}</span>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-48 h-48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-indigo-500/30 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-indigo-400/20">Gemini Intelligence</span>
            {isSummarizing && <div className="w-3 h-3 border-2 border-indigo-200 border-t-transparent rounded-full animate-spin"></div>}
          </div>
          <h3 className="text-2xl font-bold mb-4">Project Health Summary</h3>
          <div className="text-indigo-100 prose prose-invert max-w-none">
            {aiSummary.split('\n').map((line, i) => (
              <p key={i} className="mb-2 last:mb-0 leading-relaxed opacity-90">{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
