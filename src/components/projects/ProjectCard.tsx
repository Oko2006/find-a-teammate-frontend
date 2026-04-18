import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { Users, Clock, ArrowUpRight } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { motion } from 'motion/react';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link 
        to={`/projects/${project.id}`}
        className="block bg-surface rounded-[--radius-lg] border border-border overflow-hidden shadow-main hover:border-primary/50 transition-all active:scale-[0.98]"
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-primary-light text-primary text-[11px] font-bold uppercase rounded-[4px]">
                  {tag}
                </span>
              ))}
            </div>
            <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <h3 className="heading-display text-[16px] font-bold text-text-main mb-2">
            {project.title}
          </h3>
          <p className="text-sm text-text-muted line-clamp-2 mb-4 leading-relaxed">
            {project.description}
          </p>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills.slice(0, 3).map(skill => (
                <span key={skill} className="text-[10px] bg-background px-2 py-0.5 rounded-full text-slate-600 font-medium">
                  {skill}
                </span>
              ))}
            </div>
            <button className="text-primary text-xs font-bold hover:underline">Apply</button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
