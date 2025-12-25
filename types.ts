export enum FractalMode {
  None = 'None',
  RecursivePiP = 'Recursive PiP',
  Kaleidoscope = 'Kaleidoscope',
  TimeEcho = 'Time Echo',
  GridRemix = 'Grid Remix'
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  createdAt: string;
  views: number;
  remixes: number;
  viralityScore: number;
  author: string;
  fractalMode: FractalMode;
}

export interface ViralAnalysis {
  score: number;
  feedback: string;
  suggestions: string[];
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}
