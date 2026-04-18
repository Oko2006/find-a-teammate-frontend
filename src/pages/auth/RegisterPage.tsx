import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { apiService } from '../../services/api';
import { Mail, Lock, User as UserIcon, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    major: '',
    studyYear: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await apiService.auth.register(formData.email, formData.password, formData.password);
      await login(formData.email, formData.password);
      const { profile } = await apiService.profiles.getCurrentProfile();
      await apiService.profiles.update(profile.id, {
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        major: formData.major,
        study_year: formData.studyYear,
      });
      navigate('/projects');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const majors = [
    'Computer Science',
    'Computer Information Systems',
    'Software Engineering',
    'Data Science & Artificial Intelligence',
    'Cybersecurity',
    'Business Information Technology',
  ];

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full glass-card rounded-[40px] p-10 border-indigo-100"
      >
        <div className="text-center mb-10">
          <div className="bg-indigo-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-indigo">
            <UserIcon className="text-white w-8 h-8" />
          </div>
          <h2 className="heading-display text-3xl text-slate-950 font-bold mb-2">Create Student Account</h2>
          <p className="text-slate-500">Join thousands of students finding teammates daily.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">First Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Last Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">University Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="you@university.edu"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Major / Study Area</label>
            <div className="relative">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.major}
                onChange={(e) => setFormData({...formData, major: e.target.value})}
              >
                <option value="" disabled>Select your major</option>
                {majors.map((major) => (
                  <option key={major} value={major}>{major}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Study Year</label>
            <input
              type="text"
              required
              className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="e.g. 2"
              onChange={(e) => setFormData({...formData, studyYear: e.target.value})}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Min. 8 characters"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="col-span-2">
            <Button type="submit" className="w-full py-4 text-lg" isLoading={isLoading}>
              Create My Account
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
