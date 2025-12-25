import React, { useState, useEffect } from 'react';
import { 
  Wand2, Upload, Layers, PlayCircle, BarChart3, 
  Share2, ChevronRight, Loader2, Sparkles, RefreshCw
} from 'lucide-react';
import { analyzeVirality, generateCreativePrompt } from '../services/geminiService';
import FractalPlayer from '../components/FractalPlayer';
import { FractalMode, ViralAnalysis } from '../types';
import { PLACEHOLDER_VIDEOS, VIDEO_GENERATION_PROMPTS } from '../constants';
import { store } from '../services/mockStore';
import { useNavigate } from 'react-router-dom';

const Studio: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [step, setStep] = useState<number>(1);
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [baseVideoUrl, setBaseVideoUrl] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<FractalMode>(FractalMode.None);
  const [analysis, setAnalysis] = useState<ViralAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handlers
  const handleAutoPrompt = async () => {
    setIsGenerating(true);
    const newPrompt = await generateCreativePrompt();
    setPrompt(newPrompt);
    setIsGenerating(false);
  };

  const handleGenerateVideo = () => {
    if (!prompt) return;
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      const randomVideo = PLACEHOLDER_VIDEOS[Math.floor(Math.random() * PLACEHOLDER_VIDEOS.length)];
      setBaseVideoUrl(randomVideo);
      setIsGenerating(false);
      setStep(2);
      setIsPlaying(true);
    }, 2500);
  };

  const handleApplyFractal = (mode: FractalMode) => {
    setSelectedMode(mode);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeVirality(
      prompt || "Uploaded Video",
      "A generated fractal video",
      selectedMode
    );
    setAnalysis(result);
    setIsAnalyzing(false);
    setStep(3);
  };

  const handleSaveProject = () => {
    store.addProject({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      title: prompt ? prompt.slice(0, 30) + "..." : "Untitled Fractal",
      description: prompt || "Remixed fractal video",
      thumbnailUrl: "https://picsum.photos/400/225",
      videoUrl: baseVideoUrl,
      createdAt: "Just now",
      views: 0,
      remixes: 0,
      viralityScore: analysis?.score || 0,
      author: "Me",
      fractalMode: selectedMode
    });
    navigate('/');
  };

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] md:h-screen flex flex-col md:flex-row overflow-hidden bg-black">
      
      {/* LEFT PANEL: CONTROLS */}
      <div className="w-full md:w-[400px] flex-shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full overflow-y-auto z-10">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-2">
            <Sparkles size={20} className="text-indigo-400" />
            Studio
          </h2>
          <div className="flex gap-2 mt-4 text-xs font-mono">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`flex-1 h-1 rounded-full ${step >= i ? 'bg-indigo-500' : 'bg-zinc-800'}`} 
              />
            ))}
          </div>
        </div>

        <div className="p-6 space-y-8 flex-1">
          
          {/* STEP 1: INPUT */}
          <div className={step !== 1 ? 'opacity-50 pointer-events-none' : ''}>
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
                  <Upload size={16} /> Source
               </h3>
               <button 
                  onClick={handleAutoPrompt}
                  disabled={isGenerating}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Wand2 size={12} /> Auto-Prompt
               </button>
            </div>
            
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your viral video idea... (e.g. 'Cyberpunk glitch city in rain')"
              className="w-full h-32 bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all"
            />
            
            <button
              onClick={handleGenerateVideo}
              disabled={!prompt || isGenerating}
              className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <><Loader2 className="animate-spin" size={18} /> Generating...</>
              ) : (
                <><Sparkles size={18} /> Generate Base Clip</>
              )}
            </button>
          </div>

          {/* STEP 2: FRACTAL ENGINE */}
          <div className={`transition-all duration-500 ${step < 2 ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
            <h3 className="font-semibold text-zinc-100 flex items-center gap-2 mb-4">
              <Layers size={16} /> Fractal Engine
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { mode: FractalMode.RecursivePiP, label: "Recursive PiP" },
                { mode: FractalMode.Kaleidoscope, label: "Kaleidoscope" },
                { mode: FractalMode.GridRemix, label: "Grid Glitch" },
                { mode: FractalMode.TimeEcho, label: "Time Echo" },
              ].map((effect) => (
                <button
                  key={effect.mode}
                  onClick={() => handleApplyFractal(effect.mode)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedMode === effect.mode
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {effect.label}
                </button>
              ))}
            </div>

            {step === 2 && (
              <button
                onClick={handleAnalyze}
                disabled={selectedMode === FractalMode.None || isAnalyzing}
                className="mt-6 w-full bg-zinc-100 hover:bg-white text-black py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <><Loader2 className="animate-spin" size={18} /> Analyzing Virality...</>
                ) : (
                  <><BarChart3 size={18} /> Analyze & Finalize</>
                )}
              </button>
            )}
          </div>

          {/* STEP 3: RESULTS */}
          {step === 3 && analysis && (
             <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700 animate-in slide-in-from-bottom-5 fade-in duration-500">
                <div className="flex items-center justify-between mb-3">
                   <h3 className="font-semibold text-zinc-200">Viral Potential</h3>
                   <span className={`text-2xl font-bold ${analysis.score > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {analysis.score}/100
                   </span>
                </div>
                <p className="text-xs text-zinc-400 mb-3">{analysis.feedback}</p>
                <div className="space-y-2">
                   {analysis.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                         <ChevronRight size={12} className="mt-0.5 text-indigo-400 shrink-0" />
                         <span>{s}</span>
                      </div>
                   ))}
                </div>
                <button 
                  onClick={handleSaveProject}
                  className="mt-4 w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-medium text-sm"
                >
                   Publish to Feed
                </button>
             </div>
          )}

        </div>
      </div>

      {/* RIGHT PANEL: PREVIEW */}
      <div className="flex-1 bg-black relative flex items-center justify-center p-4 md:p-10">
        
        {/* Main Player Area */}
        <div className="relative w-full max-w-[400px] md:max-w-[500px] aspect-[9/16] bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-zinc-800">
          {baseVideoUrl ? (
            <FractalPlayer 
               videoUrl={baseVideoUrl} 
               mode={selectedMode} 
               isPlaying={isPlaying}
               className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center">
                 <PlayCircle size={32} />
              </div>
              <p className="text-sm">Preview will appear here</p>
            </div>
          )}

          {/* Player Controls (Overlay) */}
          {baseVideoUrl && (
             <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-center gap-6">
                   <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                   >
                      {isPlaying ? (
                        <div className="w-4 h-4 bg-black rounded-sm" />
                      ) : (
                        <PlayCircle size={20} fill="black" />
                      )}
                   </button>
                   <button 
                      onClick={() => {
                        setStep(1);
                        setBaseVideoUrl("");
                        setPrompt("");
                        setSelectedMode(FractalMode.None);
                        setAnalysis(null);
                      }}
                      className="p-3 bg-zinc-800 text-white rounded-full hover:bg-zinc-700 transition-colors"
                      title="Reset"
                   >
                      <RefreshCw size={18} />
                   </button>
                </div>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Studio;
