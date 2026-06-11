import { BookOpen, Headphones, Star, Users } from 'lucide-react';
import SolidIcon from '../../../components/common/SolidIcon';
import { landingStats } from '../../../content/marketingContent';

const iconMap = {
  users: Users,
  book: BookOpen,
  headphones: Headphones,
  star: Star,
};

function LandingStatsBar() {
  return (
    <section className="landing-stats-bar marketing-card">
      {landingStats.map(stat => {
        const Icon = iconMap[stat.icon];
        return (
          <div key={stat.label} className="landing-stat-item">
            <div className={`landing-stat-icon landing-stat-icon--${stat.icon}`}>
              <SolidIcon icon={Icon} size={22} />
            </div>
            <div>
              <p className="landing-stat-value">{stat.value}</p>
              <p className="landing-stat-label">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default LandingStatsBar;
