import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, GraduationCap, MapPin, Edit3, Trash2, Camera, Github, Globe, Linkedin, Check } from 'lucide-react';
import Button from '../../components/common/Button';
import { motion } from 'motion/react';
import { apiService } from '../../services/api';

const ProfilePage: React.FC = () => {
  const { user, updateUser, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user!);
  const [isSaving, setIsSaving] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { profile, user: mappedUser } = await apiService.profiles.getCurrentProfile();
        setProfileId(profile.id);
        setEditedUser(mappedUser);
      } catch (error) {
        console.error(error);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    if (!profileId) return;
    await apiService.profiles.update(profileId, {
      full_name: editedUser.fullName,
      major: editedUser.major,
      study_year: editedUser.studyYear,
      bio: editedUser.bio,
      skills: editedUser.skills,
      interests: editedUser.interests,
      preferred_role: editedUser.preferredRole,
    });
    updateUser(editedUser);
    await refreshProfile();
    setIsEditing(false);
    setIsSaving(false);
  };

  if (!user) return null;

  return (
    <div className="section-container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-12">
          {/* Banner */}
          <div className="h-48 md:h-64 rounded-[40px] bg-gradient-to-r from-indigo-600 to-indigo-900 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          </div>
          
          {/* Profile Header Block */}
          <div className="px-8 -mt-20 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              <div className="relative group">
                <img 
                  src={user.avatarUrl} 
                  alt="Profile" 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] border-8 border-white shadow-2xl bg-white"
                />
                <button className="absolute bottom-2 right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="pb-2">
                <h1 className="heading-display text-3xl md:text-5xl text-slate-950">{user.fullName}</h1>
                <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  {user.major} · Study year {user.studyYear}
                </p>
              </div>
            </div>
            
            <div className="pb-2">
              <Button 
                variant={isEditing ? 'primary' : 'outline'} 
                className="gap-2 px-8"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                isLoading={isSaving}
              >
                {isEditing ? <><Check className="w-5 h-5" /> Save Profile</> : <><Edit3 className="w-5 h-5" /> Edit Profile</>}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-6 border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail className="w-5 h-5 text-primary/60" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin className="w-5 h-5 text-primary/60" />
                  <span>University Campus</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Social Presence</h3>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 bg-slate-50"><Github className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 bg-slate-50"><Linkedin className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 bg-slate-50"><Globe className="w-5 h-5" /></Button>
              </div>
            </div>
          </div>

          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            <div className="glass-card rounded-[32px] p-8 border-slate-100">
              <h3 className="heading-display text-2xl text-slate-900 mb-6">About Me</h3>
              {isEditing ? (
                <textarea 
                  value={editedUser.bio}
                  onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                  className="w-full h-32 p-4 rounded-2xl bg-slate-50 border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              ) : (
                <p className="text-slate-600 leading-relaxed text-lg">
                  {user.bio || "No bio added yet. Tell people about your interests and goals!"}
                </p>
              )}
            </div>

            <div className="glass-card rounded-[32px] p-8 border-slate-100">
              <h3 className="heading-display text-2xl text-slate-900 mb-6">My Skills</h3>
              <div className="flex flex-wrap gap-3">
                {user.skills.map((skill, i) => (
                  <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-xl flex items-center gap-2">
                    {skill}
                    {isEditing && <Trash2 className="w-3 h-3 hover:text-red-500 cursor-pointer" />}
                  </span>
                ))}
                {isEditing ? (
                  <button className="px-4 py-2 border-2 border-dashed border-indigo-200 text-indigo-400 rounded-xl text-sm font-bold hover:bg-indigo-50 hover:border-indigo-400 transition-all">
                    + Add Skill
                  </button>
                ) : (
                  user.skills.length === 0 && <p className="text-slate-400 italic">No skills added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
