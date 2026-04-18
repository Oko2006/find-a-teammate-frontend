import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';

interface MatchResult {
  id: number;
  title: string;
  description: string;
  category: string;
  required_skills: string[];
  team_size_needed: number;
  status: string;
  course_name?: string;
  course_section?: string;
  score: number;
  reasons: string[];
}

const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const { data } = await apiService.matching.recommendedProjects();
        const results = data.results ? data.results : data;
        setMatches(results);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <div className="section-container py-12">
      <div className="mb-8">
        <h1 className="heading-display text-3xl text-slate-900 mb-2">Recommended Projects</h1>
        <p className="text-slate-500">Based on your profile skills, major, and study year.</p>
      </div>

      {isLoading ? (
        <div className="text-slate-500">Loading matches...</div>
      ) : matches.length === 0 ? (
        <div className="text-slate-500">No matches yet. Update your profile skills to improve recommendations.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match) => (
            <div key={match.id} className="p-6 rounded-3xl border border-slate-100 bg-white shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-slate-900 text-lg">{match.title}</h2>
                <span className="text-xs font-bold text-emerald-600">Score: {match.score}</span>
              </div>
              <p className="text-slate-600 text-sm mb-4">{match.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {match.required_skills.map((skill) => (
                  <span key={skill} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
              <ul className="text-xs text-slate-500 list-disc ml-4 space-y-1">
                {match.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
