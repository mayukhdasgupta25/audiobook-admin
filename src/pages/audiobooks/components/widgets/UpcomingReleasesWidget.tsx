import { upcomingReleases } from '../../../../content/marketingContent';
import '../../../../styles/pages/audiobooks/components/widgets/Widgets.css';

function UpcomingReleasesWidget() {
  return (
    <div className="audiobook-widget marketing-card">
      <h3 className="audiobook-widget-title">Upcoming Releases</h3>
      <ul className="audiobook-widget-list">
        {upcomingReleases.map(release => (
          <li key={release.title} className="audiobook-widget-item">
            <div>
              <p className="audiobook-widget-item-title">{release.title}</p>
              <p className="audiobook-widget-item-meta">{release.date}</p>
            </div>
            <span className="audiobook-widget-badge">
              in {release.daysUntil} days
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UpcomingReleasesWidget;
