
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Board from './components/Board';
import Dashboard from './components/Dashboard';
import Assistant from './components/Assistant';
import { Task, TaskStatus, Priority, Client } from './types';

const INITIAL_CLIENTS: Client[] = [
  { id: 'c1', name: 'Acme Corp', color: '#6366f1' },
  { id: 'c2', name: 'Global Tech', color: '#10b981' },
  { id: 'c3', name: 'Design Co', color: '#f59e0b' }
];

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Client Onboarding Pack',
    description: 'Prepare the welcome documentation and contract templates for Acme Corp.',
    status: TaskStatus.DONE,
    priority: Priority.MEDIUM,
    dueDate: new Date().toISOString().split('T')[0],
    assignee: 'Alex',
    subTasks: [
      { id: '1-1', title: 'Draft contract', completed: true },
      { id: '1-2', title: 'Create welcome deck', completed: true }
    ],
    clientId: 'c1'
  },
  {
    id: '2',
    title: 'Q4 Strategy Review',
    description: 'Review performance metrics and plan Q1 milestones for Global Tech.',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    dueDate: new Date().toISOString().split('T')[0],
    assignee: 'Sarah',
    subTasks: [
      { id: '2-1', title: 'Pull analytics reports', completed: true },
      { id: '2-2', title: 'Schedule meeting', completed: false }
    ],
    clientId: 'c2'
  },
  {
    id: '3',
    title: 'Brand Identity Concept',
    description: 'Initial logo sketches and color exploration for the new client.',
    status: TaskStatus.TODO,
    priority: Priority.HIGH,
    dueDate: new Date().toISOString().split('T')[0],
    assignee: 'Sarah',
    subTasks: [],
    clientId: 'c3'
  },
  {
    id: '4',
    title: 'Follow-up Email',
    description: 'Send update to Acme Corp regarding the project timeline.',
    status: TaskStatus.TODO,
    priority: Priority.LOW,
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    assignee: 'John',
    subTasks: [],
    clientId: 'c1'
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'board' | 'dashboard' | 'assistant'>('board');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [filterToday, setFilterToday] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem('nexus_pm_tasks');
    const savedClients = localStorage.getItem('nexus_pm_clients');
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(INITIAL_TASKS);
    }

    if (savedClients) {
      setClients(JSON.parse(savedClients));
    } else {
      setClients(INITIAL_CLIENTS);
    }
  }, []);

  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('nexus_pm_tasks', JSON.stringify(newTasks));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const newTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    updateTasks(newTasks);
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: 'New Client Task',
      description: 'Click to edit description...',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      dueDate: new Date().toISOString().split('T')[0],
      assignee: 'User',
      subTasks: [],
      clientId: selectedClientId || undefined
    };
    updateTasks([newTask, ...tasks]);
  };

  const handleTasksGenerated = (newTasks: Task[]) => {
    const withClient = newTasks.map(t => ({ ...t, clientId: selectedClientId || undefined }));
    updateTasks([...withClient, ...tasks]);
    setActiveTab('board');
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      clients={clients}
      selectedClientId={selectedClientId}
      setSelectedClientId={setSelectedClientId}
      filterToday={filterToday}
      setFilterToday={setFilterToday}
    >
      {activeTab === 'board' && (
        <Board 
          tasks={tasks} 
          clients={clients}
          onUpdateTask={handleUpdateTask} 
          onAddTask={handleAddTask} 
          selectedClientId={selectedClientId}
          filterToday={filterToday}
        />
      )}
      {activeTab === 'dashboard' && <Dashboard tasks={tasks} />}
      {activeTab === 'assistant' && <Assistant onTasksGenerated={handleTasksGenerated} />}
    </Layout>
  );
};

export default App;
