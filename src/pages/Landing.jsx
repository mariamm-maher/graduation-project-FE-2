import Navbar from '../features/landing/components/Navbar'
import Hero from '../features/landing/components/Hero'
import Features from '../features/landing/components/Features'
import CampaignPlanner from '../features/landing/components/CampaignPlanner'
import CollaborationBoard from '../features/landing/components/CollaborationBoard'
import CommunicationSystem from '../features/landing/components/CommunicationSystem'
import AnalyticsDashboard from '../features/landing/components/AnalyticsDashboard'
import Footer from '../features/landing/components/Footer'
import ScrollProgress from '../components/ui/ScrollProgress'

function Landing() {
  return (
    <div className="App bg-gradient-to-b from-[#000000] via-[#05060F] to-[#1e1632] min-h-screen text-white">
      <Navbar />
      <ScrollProgress />
      <Hero />
      <Features />
      <CampaignPlanner />
      <CollaborationBoard />
      <CommunicationSystem />
      {/* <AnalyticsDashboard /> */}
      <Footer />
    </div>
  )
}

export default Landing
