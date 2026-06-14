import { ArrowRight, BarChart3, Library, Users } from 'lucide-react';
import SolidIcon from '../../../components/common/SolidIcon';
import { landingFeatures } from '../../../content/marketingContent';

const iconMap = {
  library: Library,
  chart: BarChart3,
  users: Users,
};

function LandingFeatures() {
  return (
    <section id="features" className="landing-features">
      {landingFeatures.map(feature => {
        const Icon = iconMap[feature.icon];
        return (
          <article key={feature.title} className="landing-feature-card marketing-card">
            <div className="landing-feature-icon">
              <SolidIcon icon={Icon} size={24} />
            </div>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
            <a href="#features" className="landing-feature-link">
              Learn more <ArrowRight size={14} />
            </a>
          </article>
        );
      })}
    </section>
  );
}

export default LandingFeatures;
