
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done'
}

export interface Client {
  id: string;
  name: string;
  color: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  assignee: string;
  subTasks: SubTask[];
  clientId?: string; // Optional for general tasks
  aiAssistance?: string;
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  highPriorityCount: number;
  overdueCount: number;
}
