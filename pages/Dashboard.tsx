import React from 'react';
import { Link } from 'react-router-dom';
import { store } from '../services/mockStore';
import { Play, TrendingUp, GitFork, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const projects = store.getProjects();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Projects</h1>
          <p className="text-zinc-400">Manage your viral fractal creations.</p>
        </div>
        <Link 
          to="/studio" 
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Play size={18} fill="currentColor" />
          Create New Flow
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10">
            <div className="relative aspect-video bg-zinc-800 overflow-hidden">
              <img 
                src={project.thumbnailUrl} 
                alt={project.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Play size={24} fill="white" className="ml-1" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-xs font-mono text-zinc-300">
                0:15
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="text-lg font-semibold text-zinc-100 mb-1 truncate">{project.title}</h3>
              <p className="text-sm text-zinc-500 mb-4 line-clamp-1">{project.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                 <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <div className="flex items-center gap-1.5" title="Virality Score">
                       <TrendingUp size={14} className={project.viralityScore > 80 ? "text-green-500" : "text-yellow-500"} />
                       <span className="font-mono">{project.viralityScore}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <GitFork size={14} />
                       <span>{project.remixes}</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                   <Clock size={12} />
                   <span>{project.createdAt}</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
