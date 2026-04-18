import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Project } from '../../types';
import ProjectCard from '../../components/projects/ProjectCard';
import { Search, Filter, Plus, SlidersHorizontal } from 'lucide-react';
import Button from '../../components/common/Button';
import { motion, AnimatePresence } from 'motion/react';

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'course', 'hackathon', 'startup', 'research', 'other'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await apiService.projects.list();
        const results = data.results ? data.results : data;
        setProjects(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="section-container py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="heading-display text-4xl text-slate-950 mb-2">Explore Projects</h1>
          <p className="text-slate-500">Find the perfect team to join or spark a new collaboration.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Create Project
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by title, skills, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide lg:pb-0">
          <SlidersHorizontal className="text-slate-400 w-5 h-5 min-w-[20px] mr-2" />
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === category 
                ? 'bg-primary text-white shadow-indigo' 
                : 'bg-white border border-slate-200 text-slate-600 hover:border-primary'
              }`}
            >
              {category === 'All' ? 'All' : category.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-[300px] rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {filteredProjects.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-400 mb-2">No projects found</h2>
              <p className="text-slate-400">Try adjusting your search or filters.</p>
              <Button variant="ghost" className="mt-6" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                Clear all filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ProjectsList;
