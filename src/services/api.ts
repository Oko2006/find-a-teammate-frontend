import axios from 'axios';
import { Project, User, Message, Notification, Application, AIPlanResult } from '../types';

// In a real app, this would be your Django API base URL
const BASE_URL = (import.meta as any).env.VITE_API_URL || 'https://api.findateammate.edu';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for JWT handling
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Mock Data for development
 */
export const mockUsers: User[] = [
  {
    id: 'u1',
    username: 'jdoe',
    email: 'jdoe@university.edu',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'CS junior interested in AI and Web Dev. Love building things from scratch.',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    major: 'Computer Science',
    graduationYear: 2027,
    avatarUrl: 'https://picsum.photos/seed/u1/200',
  },
  {
    id: 'u2',
    username: 'asmith',
    email: 'asmith@university.edu',
    firstName: 'Alice',
    lastName: 'Smith',
    bio: 'Design student focused on UI/UX. Looking for technical partners for a startup idea.',
    skills: ['Figma', 'UI Design', 'Prototyping'],
    major: 'Graphic Design',
    graduationYear: 2026,
    avatarUrl: 'https://picsum.photos/seed/u2/200',
  },
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    title: 'AI Study Assistant',
    description: 'A platform that uses LLMs to help students summarize lectures and generate quizzes. Looking for frontend and backend devs.',
    creatorId: 'u1',
    tags: ['AI', 'Education', 'Web'],
    requiredSkills: ['React', 'Python', 'FastAPI'],
    status: 'open',
    createdAt: new Date().toISOString(),
    memberCount: 1,
    maxMembers: 4,
  },
  {
    id: 'p2',
    title: 'Campus Food Rescue',
    description: 'App to connect campus dining halls with students in need to reduce food waste. Need mobile developers.',
    creatorId: 'u2',
    tags: ['Social Impact', 'Mobile', 'Sustainability'],
    requiredSkills: ['React Native', 'Firebase'],
    status: 'open',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    memberCount: 2,
    maxMembers: 5,
  },
  {
    id: 'p3',
    title: 'CodeConnect Hackathon',
    description: 'Building a matchmaking tool for hackathon participants. Already have a basic design.',
    creatorId: 'u1',
    tags: ['Tools', 'Hackathon'],
    requiredSkills: ['React', 'PostgreSQL'],
    status: 'open',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    memberCount: 1,
    maxMembers: 3,
  },
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: 'u2',
    recipientId: 'u1',
    content: 'Hey John! I saw your AI Study Assistant project. I would love to join as a designer.',
    createdAt: new Date().toISOString(),
    isRead: false,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    title: 'New Application',
    content: 'Alice Smith applied to join AI Study Assistant',
    type: 'application',
    isRead: false,
    createdAt: new Date().toISOString(),
    link: '/projects/p1',
  },
];

/**
 * Mock API Endpoints
 */
export const apiService = {
  // Projects
  getProjects: async (params?: any) => {
    await new Promise(r => setTimeout(r, 800)); // Simulate network lag
    return { data: mockProjects };
  },
  getProject: async (id: string) => {
    await new Promise(r => setTimeout(r, 500));
    const project = mockProjects.find(p => p.id === id);
    if (!project) throw new Error('Project not found');
    return { data: { ...project, creator: mockUsers.find(u => u.id === project.creatorId) } };
  },
  
  // Auth
  login: async (credentials: any) => {
    await new Promise(r => setTimeout(r, 1000));
    return { data: { token: 'mock-jwt-token', user: mockUsers[0] } };
  },
  
  // Messages
  getMessages: async () => {
    await new Promise(r => setTimeout(r, 500));
    return { data: mockMessages };
  },
  
  // Profile
  getProfile: async (id: string) => {
    await new Promise(r => setTimeout(r, 500));
    return { data: mockUsers.find(u => u.id === id) || mockUsers[0] };
  },
};
