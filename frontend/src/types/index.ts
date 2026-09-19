export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
}

export type JobType = "full_time" | "part_time" | "internship" | "contract";
export type Experience = "fresher" | "1_2" | "3_5" | "6_9" | "10_plus";
export type SalaryPeriod = "hour" | "day" | "week" | "month" | "year";

export interface Job {
  id: number;
  title: string;
  company_name: string;
  location: string;
  description: string;
  requirements: string;
  salary: number;
  salary_period: SalaryPeriod;
  job_type: JobType;
  experience: Experience;
  created_at: string;
  is_open: boolean;
}

export interface PaginatedJobs {
  count: number;
  next: string | null;
  previous: string | null;
  results: Job[];
}

export interface CandidateJob extends Job {
  is_applied: boolean;
}

export interface RecruiterApplication {
  id: number;
  status: "APPLIED" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "HIRED";
  status_note: string;
  applied_at: string;
  job_title: string;
  company_name: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone_number: string;
  candidate_experience: number;
  resume_url: string | null;
}

export interface PaginatedResults<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
