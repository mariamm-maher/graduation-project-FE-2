import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { 
  Shield, FileText, Cookie, Lock, FileCheck, 
  ArrowLeft, ExternalLink, Download 
} from 'lucide-react';

const sections = [
  { id: 'privacy', label: 'Privacy Policy', icon: Shield },
  { id: 'terms', label: 'Terms of Service', icon: FileText },
  { id: 'cookies', label: 'Cookie Policy', icon: Cookie },
  { id: 'gdpr', label: 'GDPR Compliance', icon: Lock },
  { id: 'licenses', label: 'Licenses', icon: FileCheck },
];

function LegalPage() {
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

  const lastUpdated = 'January 1, 2025';

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

      {/* Header */}
      <div className="py-12 px-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Legal Information</h1>
          <p className="text-gray-400">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Privacy Policy */}
      <section id="privacy" className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#745CB4]/20 border border-[#745CB4]/30 mb-6">
            <Shield className="w-4 h-4 text-[#C1B6FD]" />
            <span className="text-sm text-[#C1B6FD]">Privacy Policy</span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-invert max-w-none"
          >
            <h2 className="text-2xl font-bold mb-4">Your Privacy Matters</h2>
            <p className="text-gray-400 mb-6">
              AdSphere is committed to protecting your personal data. This Privacy Policy explains 
              how we collect, use, and safeguard your information when you use our platform.
            </p>

            <div className="space-y-6">
              {[
                { 
                  title: 'Information We Collect', 
                  content: 'Account information (name, email, company), profile data, campaign content, usage analytics, and communication records between users.' 
                },
                { 
                  title: 'How We Use Your Data', 
                  content: 'To provide platform services, match influencers with campaigns, generate AI recommendations, process payments, and improve user experience.' 
                },
                { 
                  title: 'Data Sharing', 
                  content: 'We share data only with: (1) other users as necessary for collaborations, (2) service providers, (3) when legally required.' 
                },
                { 
                  title: 'Your Rights', 
                  content: 'Access, correction, deletion, portability, and restriction of processing. Contact privacy@adsphere.com to exercise these rights.' 
                },
              ].map((item, i) => (
                <div key={item.title} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terms of Service */}
      <section id="terms" className="py-16 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#745CB4]/20 border border-[#745CB4]/30 mb-6">
            <FileText className="w-4 h-4 text-[#C1B6FD]" />
            <span className="text-sm text-[#C1B6FD]">Terms of Service</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
            <p className="text-gray-400 mb-6">
              By accessing or using AdSphere, you agree to be bound by these Terms of Service.
            </p>

            <div className="space-y-6">
              {[
                { 
                  title: 'Account Terms', 
                  content: 'You must be 18 years or older. You are responsible for maintaining account security. One account per user unless authorized.' 
                },
                { 
                  title: 'Platform Rules', 
                  content: 'Users must provide accurate information. No spam, fraudulent campaigns, or harassment. We reserve the right to suspend violating accounts.' 
                },
                { 
                  title: 'Payment Terms', 
                  content: 'Subscription fees are charged monthly. Refunds issued at our discretion. Influencer payments processed through platform escrow.' 
                },
                { 
                  title: 'Intellectual Property', 
                  content: 'Users retain ownership of their content. Platform grants license to display content for operational purposes. AI-generated content is user-owned.' 
                },
                { 
                  title: 'Limitation of Liability', 
                  content: 'Platform provided as-is. We are not liable for: campaign performance, influencer actions, or third-party service interruptions.' 
                },
              ].map((item, i) => (
                <div key={item.title} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="font-semibold mb-2">{i + 1}. {item.title}</h3>
                  <p className="text-sm text-gray-400">{item.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cookie Policy */}
      <section id="cookies" className="py-16 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#745CB4]/20 border border-[#745CB4]/30 mb-6">
            <Cookie className="w-4 h-4 text-[#C1B6FD]" />
            <span className="text-sm text-[#C1B6FD]">Cookie Policy</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">Cookie Policy</h2>
            <p className="text-gray-400 mb-6">
              We use cookies to enhance your experience and analyze platform usage.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { type: 'Essential', desc: 'Required for platform functionality. Cannot be disabled.', required: true },
                { type: 'Analytics', desc: 'Help us understand how users interact with the platform.', required: false },
                { type: 'Preferences', desc: 'Remember your settings and customization choices.', required: false },
                { type: 'Marketing', desc: 'Used for targeted advertising and promotional content.', required: false },
              ].map((cookie, i) => (
                <div key={cookie.type} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{cookie.type}</h3>
                    {cookie.required ? (
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">Required</span>
                    ) : (
                      <span className="text-xs bg-[#745CB4]/20 text-[#C1B6FD] px-2 py-1 rounded">Optional</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{cookie.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* GDPR */}
      <section id="gdpr" className="py-16 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#745CB4]/20 border border-[#745CB4]/30 mb-6">
            <Lock className="w-4 h-4 text-[#C1B6FD]" />
            <span className="text-sm text-[#C1B6FD]">GDPR Compliance</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">GDPR Compliance</h2>
            <p className="text-gray-400 mb-6">
              AdSphere is fully compliant with the General Data Protection Regulation (GDPR) 
              for all EU users.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { 
                  title: 'Data Controller', 
                  content: 'AdSphere Inc.\n123 Marketing Street\nSan Francisco, CA 94102\nprivacy@adsphere.com' 
                },
                { 
                  title: 'Your GDPR Rights', 
                  content: '• Right to access\n• Right to rectification\n• Right to erasure\n• Right to restrict processing\n• Right to data portability\n• Right to object' 
                },
                { 
                  title: 'Data Processing', 
                  content: 'Lawful basis: Contract performance, legitimate interests, and consent. Data retention: 2 years after account closure.' 
                },
                { 
                  title: 'International Transfers', 
                  content: 'Data may be transferred to the US. We use Standard Contractual Clauses to ensure adequate protection.' 
                },
              ].map((item, i) => (
                <div key={item.title} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 whitespace-pre-line">{item.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[#745CB4]/10 border border-[#745CB4]/30">
              <p className="text-sm">
                <strong>Data Protection Officer:</strong>{' '}
                <a href="mailto:dpo@adsphere.com" className="text-[#C1B6FD] hover:underline">
                  dpo@adsphere.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Licenses */}
      <section id="licenses" className="py-16 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#745CB4]/20 border border-[#745CB4]/30 mb-6">
            <FileCheck className="w-4 h-4 text-[#C1B6FD]" />
            <span className="text-sm text-[#C1B6FD]">Licenses</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">Open Source Licenses</h2>
            <p className="text-gray-400 mb-6">
              AdSphere uses the following open source software. We thank the maintainers of these projects.
            </p>

            <div className="space-y-3">
              {[
                { name: 'React', license: 'MIT', url: 'https://reactjs.org' },
                { name: 'Tailwind CSS', license: 'MIT', url: 'https://tailwindcss.com' },
                { name: 'Framer Motion', license: 'MIT', url: 'https://www.framer.com/motion' },
                { name: 'Lucide React', license: 'ISC', url: 'https://lucide.dev' },
                { name: 'Zustand', license: 'MIT', url: 'https://github.com/pmndrs/zustand' },
                { name: 'Axios', license: 'MIT', url: 'https://axios-http.com' },
                { name: 'Sequelize', license: 'MIT', url: 'https://sequelize.org' },
                { name: 'Express.js', license: 'MIT', url: 'https://expressjs.com' },
              ].map((lib, i) => (
                <div 
                  key={lib.name} 
                  className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{lib.name}</span>
                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">{lib.license}</span>
                  </div>
                  <a 
                    href={lib.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Full License Text</h3>
                  <p className="text-sm text-gray-400">Download complete third-party license documentation</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#745CB4]/20 text-[#C1B6FD] hover:bg-[#745CB4]/30 transition-colors">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center text-gray-400 text-sm">
          <p>Questions about our legal policies? Contact us at{' '}
            <a href="mailto:legal@adsphere.com" className="text-[#C1B6FD] hover:underline">
              legal@adsphere.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LegalPage;
