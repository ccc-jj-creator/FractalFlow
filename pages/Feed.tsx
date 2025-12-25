import React from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Heart, MessageCircle, Share2, Repeat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Feed: React.FC = () => {
  const navigate = useNavigate();

  const handleRemix = () => {
     navigate('/studio');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto pb-20">
       <h1 className="text-2xl font-bold text-white mb-6 sticky top-0 bg-zinc-950/80 backdrop-blur-md py-4 z-10 border-b border-zinc-800">
         Explore Viral Flows
       </h1>

       <div className="space-y-8">
          {MOCK_PROJECTS.map((project) => (
             <div key={project.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 flex items-center gap-3">
                   <img src={`https://picsum.photos/40/40?random=${project.id}`} className="w-10 h-10 rounded-full" alt="avatar" />
                   <div>
                      <h3 className="font-semibold text-zinc-100">{project.author}</h3>
                      <p className="text-xs text-zinc-500">{project.createdAt} • {project.fractalMode}</p>
                   </div>
                   <button className="ml-auto text-indigo-400 text-sm font-medium hover:text-indigo-300">Follow</button>
                </div>

                <div className="relative aspect-[4/5] bg-black">
                   <video 
                     src={project.videoUrl} 
                     className="w-full h-full object-cover" 
                     loop 
                     muted 
                     playsInline 
                     onMouseOver={e => e.currentTarget.play().catch(() => {})}
                     onMouseOut={e => e.currentTarget.pause()}
                   />
                   <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                      <p className="text-white font-medium mb-1">{project.title}</p>
                      <p className="text-zinc-300 text-sm mb-3">{project.description}</p>
                   </div>
                </div>

                <div className="p-4 flex items-center justify-between border-t border-zinc-800 bg-zinc-900">
                   <div className="flex items-center gap-6">
                      <button className="flex flex-col items-center gap-1 text-zinc-400 hover:text-pink-500 transition-colors">
                         <Heart size={24} />
                         <span className="text-xs font-mono">{project.views >= 1000 ? `${Math.floor(project.views / 1000)}k` : project.views}</span>
                      </button>
                      <button className="flex flex-col items-center gap-1 text-zinc-400 hover:text-blue-400 transition-colors">
                         <MessageCircle size={24} />
                         <span className="text-xs font-mono">{project.remixes}</span>
                      </button>
                   </div>

                   <button 
                      onClick={handleRemix}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-transform active:scale-95"
                   >
                      <Repeat size={16} />
                      Remix This
                   </button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default Feed;
