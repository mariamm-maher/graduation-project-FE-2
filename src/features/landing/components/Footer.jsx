import { motion } from 'framer-motion'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  Heart
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Campaign Planner', href: '#campaign-planner' },
      { name: 'Analytics', href: '#analytics' },
      { name: 'Collaboration', href: '#collaboration' },
      { name: 'Communication', href: '#communication' },
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#careers' },
      { name: 'Blog', href: '#blog' },
      { name: 'Press', href: '#press' },
      { name: 'Partners', href: '#partners' },
    ],
    resources: [
      { name: 'Help Center', href: '#help' },
      { name: 'Documentation', href: '#docs' },
      { name: 'API Reference', href: '#api' },
      { name: 'Community', href: '#community' },
      { name: 'Tutorials', href: '#tutorials' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'GDPR', href: '#gdpr' },
      { name: 'Licenses', href: '#licenses' },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-400' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-400' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-500' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-500' },
  ]

  return (
    <footer className="relative bg-linear-to-b from-gray-900 to-black border-t border-white/5 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-[120px] opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(116,92,180,0.5) 0%, transparent 70%)',
            top: '-10%',
            left: '10%',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-[120px] opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(193,182,253,0.5) 0%, transparent 70%)',
            bottom: '-10%',
            right: '10%',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-bold bg-linear-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent mb-4">
                AdSphere
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Transform your social media presence with AI-powered tools. 
                Built for creators, marketers, and agencies who demand excellence.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <a href="mailto:hello@adsphere.com" className="flex items-center gap-3 text-gray-400 hover:text-purple-300 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-purple-400/10 flex items-center justify-center group-hover:bg-purple-400/20 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm">hello@adsphere.com</span>
                </a>
                <a href="tel:+1234567890" className="flex items-center gap-3 text-gray-400 hover:text-purple-300 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-purple-400/10 flex items-center justify-center group-hover:bg-purple-400/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm">+1 (234) 567-890</span>
                </a>
                <div className="flex items-start gap-3 text-gray-400">
                  <div className="w-8 h-8 rounded-lg bg-purple-400/10 flex items-center justify-center mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm">123 Marketing Street<br/>San Francisco, CA 94102</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 ${social.color} border border-white/10 hover:border-purple-400/30 transition-all duration-300`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-12 border-t border-white/5"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Stay Updated</h3>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for the latest features and marketing tips
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-400 to-purple-300 text-white font-semibold shadow-[0_0_20px_rgba(167,139,250,0.4)] hover:shadow-[0_0_30px_rgba(167,139,250,0.6)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm flex items-center gap-2"
            >
              © {currentYear} AdSphere. Made with 
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              in San Francisco
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex gap-6 text-sm"
            >
              <a href="#privacy" className="text-gray-400 hover:text-[#745CB4] transition-colors">
                Privacy
              </a>
              <a href="#terms" className="text-gray-400 hover:text-[#745CB4] transition-colors">
                Terms
              </a>
              <a href="#cookies" className="text-gray-400 hover:text-[#745CB4] transition-colors">
                Cookies
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
