import { Project, FractalMode } from './types';

export const PLACEHOLDER_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Neon Drift - Infinite Loop',
    description: 'A recursive drift through the neon city.',
    thumbnailUrl: 'https://picsum.photos/400/225?random=1',
    videoUrl: PLACEHOLDER_VIDEOS[0],
    createdAt: '2 hrs ago',
    views: 12400,
    remixes: 45,
    viralityScore: 88,
    author: 'CyberArtist_99',
    fractalMode: FractalMode.RecursivePiP
  },
  {
    id: '2',
    title: 'Coffee Pour Echo',
    description: 'Morning vibes with a time-delay echo effect.',
    thumbnailUrl: 'https://picsum.photos/400/225?random=2',
    videoUrl: PLACEHOLDER_VIDEOS[1],
    createdAt: '5 hrs ago',
    views: 8900,
    remixes: 12,
    viralityScore: 72,
    author: 'BaristaFlow',
    fractalMode: FractalMode.TimeEcho
  },
  {
    id: '3',
    title: 'Urban Grid Glitch',
    description: 'City lights broken into a recursive grid.',
    thumbnailUrl: 'https://picsum.photos/400/225?random=3',
    videoUrl: PLACEHOLDER_VIDEOS[2],
    createdAt: '1 day ago',
    views: 45000,
    remixes: 156,
    viralityScore: 94,
    author: 'GlitchMaster',
    fractalMode: FractalMode.GridRemix
  }
];

export const VIDEO_GENERATION_PROMPTS = [
  "A cyberpunk city with neon lights reflecting in rain puddles, cinematic 4k",
  "Slow motion ink dropping into water, swirling colors, abstract macro",
  "A futuristic drone flying through a recursive tunnel of mirrors"
];
