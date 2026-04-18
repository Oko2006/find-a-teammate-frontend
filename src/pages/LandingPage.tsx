import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, Rocket, Zap, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button';
import logo from '../assets/logo.png';
import wordmark from '../assets/wordmark.png';

const LandingPage: React.FC = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-50 rounded-full blur-[120px] opacity-60 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-amber-50 rounded-full blur-[100px] opacity-40 -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="section-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <img
                src={logo}
                alt="FindATeammate logo"
                className="w-12 h-12 rounded-2xl shadow-main"
              />
              <img
                src={wordmark}
                alt="FindATeammate"
                className="h-7 sm:h-8"
              />
            </div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-light text-primary text-xs font-bold uppercase tracking-widest mb-6">
              Exclusive for University Students
            </span>
            <h1 className="heading-display text-5xl md:text-7xl text-text-main mb-8 leading-[1.1]">
              Find your <span className="text-secondary italic">perfect</span> <br /> 
              project teammates.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-muted mb-12 font-medium">
              Stop settling for random groups. Connect with students who share your passion, skills, and work ethic for class projects, hackathons, and ventures.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="px-10">Get Started for Free</Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline" size="lg" className="px-10">Browse Projects</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className="py-24 bg-white relative">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Rocket, title: 'Hackathons', desc: 'Find specialized developers or designers to crush your next week-end build.' },
              { icon: Zap, title: 'Class Projects', desc: "Don't get stuck with slackers. Find teammates who actually want an A+." },
              { icon: Users, title: 'Startup Ideas', desc: 'Met your future co-founder? Start building that world-changing app today.' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[--radius-lg] border border-border hover:border-primary/20 hover:bg-background transition-all group glass-card"
              >
                <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-primary w-7 h-7" />
                </div>
                <h3 className="heading-display text-2xl text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Call to Action */}
      <section className="py-24 section-container">
        <div className="bg-gradient-to-br from-primary to-[#7C3AED] rounded-[--radius-lg] p-8 md:p-16 relative overflow-hidden text-center text-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Zap className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="heading-display text-white text-4xl md:text-5xl mb-6">Built-in AI Planner</h2>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Not sure how to structure your project? Our AI analyzes your idea and generates a step-by-step development roadmap instantly.
            </p>
            <Link to="/planner">
              <span className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-[--radius-md] font-bold hover:bg-white/90 transition-colors shadow-lg">
                Try the AI Planner <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
