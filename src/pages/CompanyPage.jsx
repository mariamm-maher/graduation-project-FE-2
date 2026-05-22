import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { 
  Target, Users, Newspaper, Radio, Handshake, 
  ArrowRight, Mail, MapPin, Linkedin, Twitter 
} from 'lucide-react';

const sections = [
  { id: 'about', label: 'About Us', icon: Target },
  { id: 'careers', label: 'Careers', icon: Users },
  { id: 'blog', label: 'Blog', icon: Newspaper },
  { id: 'press', label: 'Press', icon: Radio },
  { id: 'partners', label: 'Partners', icon: Handshake },
];

function CompanyPage() {
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

      {/* About Us Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#745CB4]/20 border border-[#745CB4]/30 mb-6">
              <Target className="w-4 h-4 text-[#C1B6FD]" />
              <span className="text-sm text-[#C1B6FD]">About Us</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Bridging Brands and <span className="text-[#C1B6FD]">Influencers</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              AdSphere is an AI-powered platform that revolutionizes how brands connect with influencers. 
              We streamline campaign creation, collaboration management, and performance tracking 
              through intelligent automation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { number: '10K+', label: 'Active Campaigns' },
              { number: '5K+', label: 'Influencers' },
              { number: '1M+', label: 'Campaign Reach' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center"
              >
                <div className="text-3xl font-bold text-[#C1B6FD] mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section id="careers" className="py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#745CB4]/20 border border-[#745CB4]/30 mb-6">
            <Users className="w-4 h-4 text-[#C1B6FD]" />
            <span className="text-sm text-[#C1B6FD]">Careers</span>
          </div>
          <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
          <p className="text-gray-400 mb-8">
            We're building the future of influencer marketing. Explore opportunities to make an impact.
          </p>

          <div className="space-y-4">
            {[
              { title: 'Senior Full-Stack Developer', location: 'Remote', type: 'Full-time' },
              { title: 'Product Designer', location: 'San Francisco, CA', type: 'Full-time' },
              { title: 'Customer Success Manager', location: 'Remote', type: 'Full-time' },
              { title: 'Marketing Specialist', location: 'New York, NY', type: 'Full-time' },
            ].map((job, i) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-[#745CB4]/30 transition-colors"
              >
                <div>
                  <h3 className="font-semibold mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-400">{job.location} • {job.type}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#745CB4]/20 text-[#C1B6FD] hover:bg-[#745CB4]/30 transition-colors">
                  Apply <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#745CB4]/20 border border-[#745CB4]/30 mb-6">
            <Newspaper className="w-4 h-4 text-[#C1B6FD]" />
            <span className="text-sm text-[#C1B6FD]">Blog</span>
          </div>
          <h2 className="text-3xl font-bold mb-6">Latest Insights</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'The Future of AI in Marketing', date: 'Jan 15, 2025', category: 'AI' },
              { title: 'Maximizing Influencer ROI', date: 'Jan 10, 2025', category: 'Strategy' },
              { title: 'Content Calendar Best Practices', date: 'Jan 5, 2025', category: 'Tips' },
              { title: 'Building Brand-Influencer Partnerships', date: 'Dec 28, 2024', category: 'Guide' },
            ].map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#745CB4]/30 transition-colors cursor-pointer"
              >
                <span className="text-xs text-[#C1B6FD] uppercase tracking-wider">{post.category}</span>
                <h3 className="text-lg font-semibold mt-2 mb-3">{post.title}</h3>
                <p className="text-sm text-gray-400">{post.date}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Press Section */}
      <section id="press" className="py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#745CB4]/20 border border-[#745CB4]/30 mb-6">
            <Radio className="w-4 h-4 text-[#C1B6FD]" />
            <span className="text-sm text-[#C1B6FD]">Press</span>
          </div>
          <h2 className="text-3xl font-bold mb-6">In The News</h2>

          <div className="space-y-4">
            {[
              { outlet: 'TechCrunch', headline: 'AdSphere Raises $10M to Transform Influencer Marketing', date: 'Dec 15, 2024' },
              { outlet: 'Forbes', headline: 'How AI is Revolutionizing Campaign Management', date: 'Nov 20, 2024' },
              { outlet: 'Marketing Week', headline: 'The Rise of Automated Influencer Platforms', date: 'Oct 8, 2024' },
            ].map((item, i) => (
              <motion.div
                key={item.headline}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <span className="text-sm text-[#C1B6FD]">{item.outlet}</span>
                <h3 className="font-semibold mt-1">{item.headline}</h3>
                <p className="text-sm text-gray-400 mt-1">{item.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#745CB4]/20 border border-[#745CB4]/30 mb-6">
            <Handshake className="w-4 h-4 text-[#C1B6FD]" />
            <span className="text-sm text-[#C1B6FD]">Partners</span>
          </div>
          <h2 className="text-3xl font-bold mb-6">Our Partners</h2>
          <p className="text-gray-400 mb-8">
            We collaborate with leading platforms and agencies to deliver comprehensive marketing solutions.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Meta', 'TikTok', 'YouTube', 'Instagram', 'X', 'LinkedIn', 'Snapchat', 'Pinterest'].map((partner, i) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 text-center hover:border-[#745CB4]/30 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-300">{partner}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 mb-4">Get in touch with our team</p>
          <div className="flex items-center justify-center gap-6">
            <a href="mailto:contact@adsphere.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <Mail className="w-4 h-4" /> contact@adsphere.com
            </a>
            <span className="text-gray-600">|</span>
            <span className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4" /> San Francisco, CA
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default CompanyPage;
