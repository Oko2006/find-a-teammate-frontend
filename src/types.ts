/**
 * FindATeammate Types
 */

export type ProjectStatus = 'open' | 'closed' | 'ongoing';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  skills: string[];
  avatarUrl?: string;
  major: string;
  graduationYear: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creator?: User;
  tags: string[];
  requiredSkills: string[];
  status: ProjectStatus;
  createdAt: string;
  memberCount: number;
  maxMembers: number;
}

export interface Application {
  id: string;
  projectId: string;
  userId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  projectId?: string; // Optional: associated with a project thread
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'application' | 'message' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AIPlanResult {
  title: string;
  steps: {
    title: string;
    description: string;
    suggestedRoles: string[];
  }[];
  timelineRecommendations: string;
}
