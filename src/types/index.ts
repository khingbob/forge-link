export type ResultStatus = 'pending' | 'accepted' | 'rejected' | 'cant_reach';
export type SearchStatus = 'active' | 'finished';
export type CollabType = 'online' | 'offline' | 'both';

export const INDUSTRIES = [
  'Manufacturing AI',
  'Industrial IoT',
  'Advanced Materials',
  'Robotics & Automation',
  'Sealing Technology',
  'Electronics / Sensors',
  'Green Manufacturing',
  'Predictive Maintenance',
  'Supply Chain Tech',
  'Additive Manufacturing',
  'Heavy Machinery',
  'Aerospace Components',
  'Chemical Engineering',
  'Energy Systems',
  'Composite Materials',
  'Automation & Control',
  'Quality Inspection',
  'Other',
] as const;

export interface CompanyProfile {
  id: string;
  companyName: string;
  industry: string;
  description: string;
  registeredAt: string;
}

export interface ReasoningStep {
  id: string;
  step: number;
  title: string;
  body: string;
}

export interface SearchResult {
  id: string;
  companyName: string;
  description: string;
  fitExplanation: string;
  industry: string;
  website: string;
  contact: string;
  status: ResultStatus;
  agreedCallDate: string | null;
}

export interface Search {
  id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  numberOfResults: number;
  collaborationType: CollabType;
  status: SearchStatus;
  results: SearchResult[];
  reasoningTrace: ReasoningStep[];
  createdAt: string;
}

export interface NewSearchFormData {
  description: string;
  industry: string;
  location: string;
  numberOfResults: number;
  collaborationType: CollabType;
}
