import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Sparkles, CheckCircle2, UserPlus, Calendar } from 'lucide-react';
import Button from '../../components/common/Button';
import { generateProjectPlan } from '../../services/aiPlannerService';
import { PlannerResult } from '../../types';
import { cn } from '../../lib/utils';

const AIPlannerPage: React.FC = () => {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PlannerResult | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const plan = await generateProjectPlan(description, file || undefined);
      setResult(plan);
    } catch (err) {
      setError('Failed to generate plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="section-container py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="text-amber-500 w-8 h-8" />
          </div>
          <h1 className="heading-display text-4xl mb-4">AI Project Planner</h1>
          <p className="text-slate-500 text-lg">
            Have a project idea but don't know where to start? <br />
            Our AI will break it down into actionable phases and required roles.
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-[--radius-lg] p-8 mb-12 text-white shadow-lg">
          <div className="mb-6">
            <label className="block text-sm font-bold opacity-90 mb-2 uppercase tracking-tight">Project Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., A mobile app for students to trade textbooks locally at university..."
              className="w-full h-40 p-4 rounded-[--radius-md] bg-white/10 border-2 border-white/20 focus:border-white/40 transition-all resize-none outline-none text-white placeholder:text-white/50"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <label className="w-full md:w-auto border-2 border-dashed border-white/30 rounded-[--radius-md] py-4 px-8 text-center text-sm cursor-pointer hover:bg-white/5 transition-colors">
              <input
                type="file"
                accept=".txt,.pdf,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              {file ? `Selected: ${file.name}` : 'Drop files here or click to browse'}
            </label>
            <Button 
              size="lg" 
              className="w-full md:w-auto bg-white text-primary hover:bg-white/90"
              onClick={handleGenerate}
              isLoading={isGenerating}
              disabled={!description.trim()}
            >
              <Sparkles className="w-5 h-5 mr-2" /> Generate Roadmap
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center mb-8 border border-red-100">
            {error}
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 pb-20"
            >
              <div className="text-center">
                <h2 className="heading-display text-3xl text-primary mb-2">{result.project_plan.overview}</h2>
                <div className="flex items-center justify-center gap-2 text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm italic">{Object.values(result.timeline).join(' · ')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {result.task_breakdown.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 group"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-600/20 relative z-10">
                        {i + 1}
                      </div>
                      {i !== result.steps.length - 1 && (
                        <div className="w-0.5 grow bg-indigo-100 my-2" />
                      )}
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft flex-grow mb-6 transition-all group-hover:border-primary/20">
                      <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
                        {step.task}
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-slate-600 mb-4 leading-relaxed">Owner role: {step.owner_role}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {result.suggested_roles.map(role => (
                          <span key={role} className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">
                            <UserPlus className="w-3 h-3" />
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline" onClick={() => setResult(null)}>
                  Clear and Start Over
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIPlannerPage;
