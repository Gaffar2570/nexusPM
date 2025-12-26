
import React from 'react';
import { Client } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'board' | 'dashboard' | 'assistant';
  setActiveTab: (tab: 'board' | 'dashboard' | 'assistant') => void;
  clients: Client[];
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  filterToday: boolean;
  setFilterToday: (val: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  clients, 
  selectedClientId, 
  setSelectedClientId,
  filterToday,
  setFilterToday
}) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">NexusPM</h1>
          </div>
        </div>
        
        <nav className="px-4 space-y-1">
          <button 
            onClick={() => setActiveTab('board')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'board' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            <span className="font-medium text-sm">Task Board</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            <span className="font-medium text-sm">Analytics</span>
          </button>

          <button 
            onClick={() => setActiveTab('assistant')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'assistant' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            <span className="font-medium text-sm">AI Assistant</span>
          </button>
        </nav>

        {/* Clients Section */}
        <div className="mt-8 px-6">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Clients</h3>
          <div className="space-y-1">
            <button 
              onClick={() => setSelectedClientId(null)}
              className={`w-full text-left px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${selectedClientId === null ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              All Clients
            </button>
            {clients.map(client => (
              <button 
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
                className={`w-full flex items-center gap-2 text-left px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${selectedClientId === client.id ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: client.color }}></div>
                {client.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 mt-auto">
          <div className="bg-slate-900 rounded-xl p-4 text-white">
            <h4 className="text-sm font-semibold mb-1">Nexus Pro</h4>
            <p className="text-xs text-slate-400 mb-3">Manage unlimited clients & teams.</p>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2 rounded-lg transition-colors">Upgrade Now</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-white">
        <header className="h-16 border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 bg-white z-20">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-semibold text-slate-800 capitalize">{activeTab}</h2>
            <div className="h-6 w-px bg-slate-200"></div>
            <button 
              onClick={() => setFilterToday(!filterToday)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filterToday ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Focus Today
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <img src="https://picsum.photos/32/32" className="w-8 h-8 rounded-full border border-slate-200" alt="Avatar" />
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
