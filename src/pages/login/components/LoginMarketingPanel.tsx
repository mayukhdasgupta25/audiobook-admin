import {
  BarChart3,
  Headphones,
  Lock,
  Shield,
  TrendingUp,
} from 'lucide-react';
import Logo from '../../../components/common/Logo';
import { loginFeatures, loginStatCards } from '../../../content/marketingContent';

const featureIconMap = {
  shield: Shield,
  chart: BarChart3,
  lock: Lock,
};

function LoginMarketingPanel() {
  return (
    <aside className="login-marketing">
      <Logo />
      <div className="login-marketing-content">
        <h1 className="login-marketing-title">
          Power your audiobook <span className="text-gradient">impact</span>
        </h1>
        <p className="login-marketing-subtitle">
          Manage your catalog, engage listeners, and grow your audience—all in
          one place.
        </p>

        <div className="login-stat-cards">
          {loginStatCards.map(card => (
            <div
              key={card.title}
              className={`login-stat-card login-stat-card--${card.variant}`}
            >
              <p className="login-stat-card-title">{card.title}</p>
              <p className="login-stat-card-value">{card.value}</p>
              {card.subtitle && (
                <p className="login-stat-card-subtitle">{card.subtitle}</p>
              )}
              {card.trend && (
                <span className="marketing-stat-trend">{card.trend}</span>
              )}
              {card.variant === 'catalog' && (
                <div className="login-stat-sparkline" aria-hidden="true">
                  <TrendingUp size={40} className="login-stat-sparkline-icon" />
                </div>
              )}
              {card.variant === 'listeners' && (
                <Headphones size={20} className="login-stat-card-icon" />
              )}
            </div>
          ))}
        </div>

        <ul className="login-feature-list">
          {loginFeatures.map(feature => {
            const Icon = featureIconMap[feature.icon];
            return (
              <li key={feature.title} className="login-feature-item">
                <div className={`login-feature-icon login-feature-icon--${feature.icon}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="login-feature-title">{feature.title}</p>
                  <p className="login-feature-desc">{feature.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

export default LoginMarketingPanel;
