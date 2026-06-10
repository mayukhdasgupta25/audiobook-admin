import { BarChart3, Shield, TrendingUp, Users } from 'lucide-react';
import type { PartnerType } from '../../../types/partner';
import {
  individualRegisterFeatures,
  partnerRegisterFeatures,
  partnerRegisterStatCards,
} from '../../../content/marketingContent';
import '../../../styles/shared/marketing.css';
import '../../../styles/pages/login/Login.css';

const featureIconMap = {
  users: Users,
  chart: BarChart3,
  shield: Shield,
};

interface PartnerRegisterMarketingPanelProps {
  partnerType?: PartnerType | null;
}

function PartnerRegisterMarketingPanel({
  partnerType = null,
}: PartnerRegisterMarketingPanelProps) {
  const isIndividual = partnerType === 'individual';
  const features = isIndividual
    ? individualRegisterFeatures
    : partnerRegisterFeatures;

  return (
    <aside className="partner-register-marketing login-marketing">
      <div className="login-marketing-content">
        <h1 className="login-marketing-title">
          Start publishing with{' '}
          <span className="text-gradient">confidence</span>
        </h1>
        <p className="login-marketing-subtitle">
          {isIndividual
            ? 'Set up your personal partner account and get everything you need to publish, manage, and grow your audience.'
            : 'Set up your partner account and get everything you need to publish, manage, and grow your audiobook catalog.'}
        </p>

        <div className="login-stat-cards partner-register-stat-cards">
          {partnerRegisterStatCards.map(card => (
            <div
              key={card.title}
              className={`login-stat-card login-stat-card--${card.variant}`}
            >
              <p className="login-stat-card-title">{card.title}</p>
              <p className="login-stat-card-value">{card.value}</p>
              {card.trend && (
                <span className="marketing-stat-trend">{card.trend}</span>
              )}
              {card.variant === 'catalog' && (
                <div className="login-stat-sparkline" aria-hidden="true">
                  <TrendingUp size={40} />
                </div>
              )}
            </div>
          ))}
        </div>

        <ul className="login-feature-list">
          {features.map(feature => {
            const Icon = featureIconMap[feature.icon];
            return (
              <li key={feature.title} className="login-feature-item">
                <div
                  className={`login-feature-icon login-feature-icon--${feature.icon}`}
                >
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

export default PartnerRegisterMarketingPanel;
