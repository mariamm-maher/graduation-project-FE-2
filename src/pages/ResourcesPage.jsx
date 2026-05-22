import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { 
  HelpCircle, FileText, Code, Users, BookOpen, 
  ArrowRight, Search, MessageCircle, ExternalLink 
} from 'lucide-react';

const sections = [
  { id: 'help', label: 'Help Center', icon: HelpCircle },
  { id: 'docs', label: 'Documentation', icon: FileText },
  { id: 'api', label: 'API Reference', icon: Code },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'tutorials', label: 'Tutorials', icon: BookOpen },
];

function ResourcesPage() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-[#C1B6FD] to-[#745CB4] bg-clip-text text-transparent">
              AdSphere
            </Link>
            <div className="flex gap-6 text-sm">
              {sections.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="py-16 px-6 text-center border-b border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-4">Resources & Support</h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Everything you need to get the most out of AdSphere
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#745CB4]/50"
            />
          </div>
        </motion.div>
      </div>

      {/* Help Center */}
      <section id="help" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#745CB4]/20 border border-[#745CB4]/30 mb-6">
            <HelpCircle className="w-4 h-4 text-[#C1B6FD]" />
            <span className="text-sm text-[#C1B6FD]">Help Center</span>
          </div>
          <h2 className="text-3xl font-bold mb-6">How Can We Help?</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Getting Started', desc: 'Learn the basics of campaign creation and management' },
              { title: 'Account Setup', desc: 'Configure your profile and preferences' },
              { title: 'Campaign Management', desc: 'Create, publish, and track your campaigns' },
              { title: 'Influencer Collaboration', desc: 'Send requests, manage contracts, and communicate' },
              { title: 'Analytics & Reporting', desc: 'Understand your campaign performance metrics' },
              { title: 'Billing & Payments', desc: 'Manage subscriptions and payment methods' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#745CB4]/30 transition-colors cursor-pointer group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-[#C1B6FD] transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-xl bg-[#745CB4]/10 border border-[#745CB4]/30">
            <div className="flex items-center gap-4">
              <MessageCircle className="w-8 h-8 text-[#C1B6FD]" />
              <div>
                <h3 className="font-semibold">Still need help?</h3>
                <p className="text-sm text-gray-400">Contact our support team for personalized assistance</p>
              </div>
              <button className="ml-auto px-4 py-2 rounded-lg bg-[#745CB4] text-white hover:bg-[#634a9c] transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation */}
      <section id="docs" className="py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#745CB4]/20 border border-[#745CB4]/30 mb-6">
            <FileText className="w-4 h-4 text-[#C1B6FD]" />
            <span className="text-sm text-[#C1B6FD]">Documentation</span>
          </div>
          <h2 className="text-3xl font-bold mb-6">Platform Documentation</h2>

          <div className="space-y-4">
            {[
              { title: 'Owner Guide', desc: 'Complete guide for campaign owners', pages: '24 pages' },
              { title: 'Influencer Guide', desc: 'Getting started as an influencer', pages: '18 pages' },
              { title: 'Campaign Creation', desc: 'AI-powered campaign workflows', pages: '12 pages' },
              { title: 'Collaboration Workflows', desc: 'Managing partnerships end-to-end', pages: '15 pages' },
              { title: 'Contract Management', desc: 'Digital contracts and signatures', pages: '8 pages' },
            ].map((doc, i) => (
              <motion.div
                key={doc.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-[#745CB4]/30 transition-colors"
              >
                <div>
                  <h3 className="font-semibold">{doc.title}</h3>
                  <p className="text-sm text-gray-400">{doc.desc}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">{doc.pages}</span>
                  <button className="flex items-center gap-2 text-[#C1B6FD] hover:text-white transition-colors">
                    Read <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section id="api" className="py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#745CB4]/20 border border-[#745CB4]/30 mb-6">
            <Code className="w-4 h-4 text-[#C1B6FD]" />
            <span className="text-sm text-[#C1B6FD]">API Reference</span>
          </div>
          <h2 className="text-3xl font-bold mb-6">Developer API</h2>
          <p className="text-gray-400 mb-8">
            Build custom integrations with our REST API. Access campaigns, collaborations, and analytics programmatically.
          </p>

          <div className="p-6 rounded-xl bg-[#0f0f15] border border-white/10 font-mono text-sm overflow-x-auto">
            <div className="flex items-center gap-2 mb-4 text-gray-500">
              <span className="text-green-400">GET</span>
              <span>/api/v1/campaigns</span>
            </div>
            <pre className="text-gray-300">
{`{
  "success": true,
  "data": {
    "campaigns": [...],
    "pagination": {...}
  }
}`}
            </pre>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Authentication', desc: 'OAuth 2.0 & API Keys' },
              { label: 'Rate Limits', desc: '1000 requests/hour' },
              { label: 'Webhooks', desc: 'Real-time event notifications' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 text-center"
              >
                <div className="font-semibold">{item.label}</div>
                <div className="text-sm text-gray-400">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section id="community" className="py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#745CB4]/20 border border-[#745CB4]/30 mb-6">
            <Users className="w-4 h-4 text-[#C1B6FD]" />
            <span className="text-sm text-[#C1B6FD]">Community</span>
          </div>
          <h2 className="text-3xl font-bold mb-6">Join the Community</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Discord Server', desc: 'Live chat with 5,000+ marketers', members: '5,000+' },
              { title: 'Forum', desc: 'Ask questions and share strategies', members: '2,500+' },
              { title: 'LinkedIn Group', desc: 'Professional networking', members: '3,200+' },
              { title: 'Monthly Webinars', desc: 'Expert-led training sessions', members: 'Live' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#745CB4]/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <span className="text-xs text-[#C1B6FD] bg-[#745CB4]/20 px-2 py-1 rounded">{item.members}</span>
                </div>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorials */}
      <section id="tutorials" className="py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#745CB4]/20 border border-[#745CB4]/30 mb-6">
            <BookOpen className="w-4 h-4 text-[#C1B6FD]" />
            <span className="text-sm text-[#C1B6FD]">Tutorials</span>
          </div>
          <h2 className="text-3xl font-bold mb-6">Video Tutorials</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Create Your First Campaign', duration: '5:32', level: 'Beginner' },
              { title: 'AI Campaign Generation Deep Dive', duration: '12:45', level: 'Intermediate' },
              { title: 'Managing Influencer Collaborations', duration: '8:20', level: 'Intermediate' },
              { title: 'Analytics & Performance Tracking', duration: '6:15', level: 'Beginner' },
              { title: 'Contract Templates & Workflows', duration: '10:00', level: 'Advanced' },
              { title: 'Integration with Social Platforms', duration: '7:45', level: 'Intermediate' },
            ].map((video, i) => (
              <motion.div
                key={video.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 hover:border-[#745CB4]/30 transition-colors cursor-pointer"
              >
                <div className="w-24 h-16 rounded-lg bg-[#745CB4]/20 flex items-center justify-center">
                  <span className="text-xs text-[#C1B6FD]">▶</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{video.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>{video.duration}</span>
                    <span>•</span>
                    <span className="text-[#C1B6FD]">{video.level}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center text-gray-400">
          <p>Can't find what you're looking for? <a href="mailto:support@adsphere.com" className="text-[#C1B6FD] hover:underline">Contact our team</a></p>
        </div>
      </footer>
    </div>
  );
}

export default ResourcesPage;
