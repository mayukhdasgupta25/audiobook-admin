import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import SolidIcon from '../../../components/common/SolidIcon';
import Button from '../../../components/common/Button';

function LandingHero() {
  const navigate = useNavigate();

  return (
    <section className="landing-hero">
      <div className="landing-hero-content">
        <span className="marketing-badge">
          <SolidIcon icon={Users} size={14} />
          Built for audiobook publishers &amp; partners
        </span>
        <h1 className="landing-hero-title">
          Publish and grow your{' '}
          <span className="text-gradient">audiobook</span> catalog
        </h1>
        <p className="landing-hero-subtitle">
          Manage titles, chapters, metadata, and audience insights in one place.
          Reach more listeners with a platform built for quality audio publishing.
        </p>
        <div className="landing-hero-actions">
          <Button
            size="large"
            className="landing-cta-btn"
            onClick={() => navigate('/partner/register')}
          >
            Become a Partner
            <span className="landing-cta-arrow" aria-hidden="true">
              <ArrowRight size={16} />
            </span>
          </Button>
          <button
            type="button"
            className="landing-text-link"
            onClick={() => navigate('/login')}
          >
            Already a Partner? <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="landing-hero-preview" aria-hidden="true">
        <div className="preview-dashboard marketing-card">
          <div className="preview-sidebar">
            <div className="preview-sidebar-item preview-sidebar-item--active" />
            <div className="preview-sidebar-item" />
            <div className="preview-sidebar-item" />
            <div className="preview-sidebar-item" />
            <div className="preview-sidebar-item" />
          </div>
          <div className="preview-main">
            <div className="preview-header">
              <div className="preview-header-text" />
              <div className="preview-header-btn" />
            </div>
            <div className="preview-stats">
              <div className="preview-stat-card" />
              <div className="preview-stat-card" />
              <div className="preview-stat-card" />
              <div className="preview-stat-card" />
            </div>
            <div className="preview-charts">
              <div className="preview-chart preview-chart--large" />
              <div className="preview-chart preview-chart--small" />
            </div>
            <div className="preview-pipeline">
              <div className="preview-pipeline-step" />
              <div className="preview-pipeline-step" />
              <div className="preview-pipeline-step" />
              <div className="preview-pipeline-step" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingHero;
