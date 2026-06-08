import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { getAppName } from '../../utils/config';
import '../../styles/pages/landing/Landing.css';

function getProductDisplayName(): string {
  const name = getAppName();
  const stripped = name.replace(/\s*Admin\s*/i, '').trim();
  return stripped || 'Audiobook';
}

function Landing() {
  const navigate = useNavigate();
  const productName = getProductDisplayName();

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-header-inner">
          <span className="landing-logo">{productName}</span>
          <Link to="/login" className="landing-header-link">
            Already a Partner?
          </Link>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <h1 className="landing-hero-title">
            Publish and grow your audiobook catalog
          </h1>
          <p className="landing-hero-subtitle">
            {productName} helps partners manage titles, chapters, and audience
            insights in one place. Reach more listeners with a platform built
            for quality audio publishing.
          </p>
          <div className="landing-hero-actions">
            <Button size="large" onClick={() => navigate('/partner/register')}>
              Become a Partner
            </Button>
            <Link to="/login" className="landing-partner-link">
              Already a Partner?
            </Link>
          </div>
        </section>

        <section className="landing-features">
          <article className="landing-feature-card">
            <h2>Catalog management</h2>
            <p>
              Organize audiobooks, chapters, and metadata so your library stays
              consistent and easy to browse.
            </p>
          </article>
          <article className="landing-feature-card">
            <h2>Audience insights</h2>
            <p>
              Understand how listeners engage with your content and make
              data-informed publishing decisions.
            </p>
          </article>
          <article className="landing-feature-card">
            <h2>Partner publishing</h2>
            <p>
              Onboard your organization, invite team members, and publish under
              your brand with clear roles and access.
            </p>
          </article>
        </section>
      </main>

      <footer className="landing-footer">
        <p>
          &copy; {new Date().getFullYear()} {productName}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Landing;
