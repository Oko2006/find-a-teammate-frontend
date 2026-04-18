/**
 * FindATeammate Types
 */

export type ProjectStatus = 'open' | 'closed';

export interface Profile {
  id: number;
  user: number;
  full_name: string;
  major: string;
  study_year: string;
  bio: string;
  skills: string[];
  interests: string[];
  preferred_role: string;
  profile_picture?: string | null;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  major: string;
  studyYear: string;
  bio: string;
  skills: string[];
  interests: string[];
  preferredRole: string;
  avatarUrl?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  required_skills: string[];
  team_size_needed: number;
  status: ProjectStatus;
  course_name?: string;
  course_section?: string;
  created_by: string;
  created_at: string;
}

export interface Application {
  id: number;
  project: number;
  applicant: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface DirectThread {
  id: number;
  participants: number[];
  unique_key: string;
  created_at: string;
}

export interface DirectMessage {
  id: number;
  thread: number;
  sender: string;
  body: string;
  created_at: string;
}

export interface Notification {
  id: number;
  user: number;
  actor: string | null;
  notification_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface PlannerResult {
  project_plan: {
    overview: string;
    milestones: string[];
  };
  task_breakdown: {
    task: string;
    owner_role: string;
    order: number;
  }[];
  timeline: Record<string, string>;
  suggested_roles: string[];
  raw_input: string;
}
