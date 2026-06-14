import LandingHeader from './components/LandingHeader';
import LandingHero from './components/LandingHero';
import LandingStatsBar from './components/LandingStatsBar';
import LandingFeatures from './components/LandingFeatures';
import LandingFooter from './components/LandingFooter';
import '../../styles/shared/marketing.css';
import '../../styles/pages/landing/Landing.css';

function Landing() {
  return (
    <div className="landing-page">
      <LandingHeader />
      <section className="landing-hero-zone">
        <div className="landing-hero-zone-bg" aria-hidden="true" />
        <div className="landing-hero-zone-inner">
          <LandingHero />
          <LandingStatsBar />
        </div>
      </section>
      <main className="landing-main">
        <LandingFeatures />
      </main>
      <LandingFooter />
    </div>
  );
}

export default Landing;
