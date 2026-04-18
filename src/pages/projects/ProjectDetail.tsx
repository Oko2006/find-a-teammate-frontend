import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService, mockUsers } from '../../services/api';
import { Project, User } from '../../types';
import { 
  Users, 
  Calendar, 
  MapPin, 
  ArrowLeft, 
  Star, 
  Send, 
  UserPlus, 
  Share2,
  CheckCircle,
  MessageCircle
} from 'lucide-react';
import Button from '../../components/common/Button';
import { motion } from 'motion/react';
import { formatDate } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const { data } = await apiService.getProject(id);
        setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleApply = async () => {
    setIsApplying(true);
    // Simulate application process
    await new Promise(r => setTimeout(r, 1500));
    setHasApplied(true);
    setIsApplying(false);
  };

  if (isLoading) return <div className="section-container py-20 text-center text-slate-500">Loading project details...</div>;
  if (!project) return <div className="section-container py-20 text-center">Project not found.</div>;

  return (
    <div className="section-container py-12">
      <Link to="/projects" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-semibold mb-8 transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-lg">
                  {tag}
                </span>
              ))}
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-lg">
                Verified Team
              </span>
            </div>
            
            <h1 className="heading-display text-4xl md:text-5xl text-slate-950 mb-6">{project.title}</h1>
            
            <div className="flex flex-wrap gap-6 text-slate-500 text-sm font-medium mb-10 pb-10 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>{project.memberCount} / {project.maxMembers} Members</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Posted {formatDate(project.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span>High Engagement</span>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="heading-display text-2xl text-slate-900 mb-4">About the Project</h3>
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
              
              <h3 className="heading-display text-2xl text-slate-900 mt-10 mb-4">What we're looking for</h3>
              <ul className="space-y-4">
                {project.requiredSkills.map((skill, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">{skill} Expert:</span>
                      <p className="text-sm">Someone who can handle {skill} development and contribute to core architecture decisions.</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Action Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-[32px] p-8 border-indigo-100 sticky top-24"
          >
            {hasApplied ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">Application Sent!</h3>
                <p className="text-slate-500 text-sm mb-6">The project manager has been notified. You can message them directly too.</p>
                <Link to="/messages">
                  <Button variant="outline" className="w-full gap-2">
                    <MessageCircle className="w-5 h-5" /> Open Messages
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-xl text-slate-900 mb-6">Interested in joining?</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Status</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md font-bold text-[10px] uppercase">Recruiting</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Open Spots</span>
                    <span className="font-bold text-slate-900">{project.maxMembers - project.memberCount} remaining</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full py-4 text-md flex items-center gap-2" 
                    onClick={handleApply}
                    isLoading={isApplying}
                  >
                    <UserPlus className="w-5 h-5" /> Apply to Project
                  </Button>
                  <Button variant="outline" className="w-full py-4 text-md flex items-center gap-2">
                    <Share2 className="w-5 h-5" /> Share this Project
                  </Button>
                </div>
              </>
            )}
          </motion.div>

          {/* Project Manager */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Project Lead</h4>
            <div className="flex items-center gap-4">
              <img 
                src={project.creator?.avatarUrl || `https://ui-avatars.com/api/?name=${project.creator?.firstName}+${project.creator?.lastName}`}
                className="w-12 h-12 rounded-full border-2 border-white shadow-soft"
                alt="Lead"
              />
              <div>
                <Link to={`/profile/${project.creatorId}`} className="font-bold text-slate-900 hover:text-primary transition-colors">
                  {project.creator?.firstName} {project.creator?.lastName}
                </Link>
                <p className="text-xs text-slate-500">{project.creator?.major}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
