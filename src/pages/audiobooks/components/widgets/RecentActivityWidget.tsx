import { recentActivity } from '../../../../content/marketingContent';
import '../../../../styles/pages/audiobooks/components/widgets/Widgets.css';

function RecentActivityWidget() {
  return (
    <div className="audiobook-widget marketing-card">
      <h3 className="audiobook-widget-title">Recent Activity</h3>
      <ul className="activity-timeline">
        {recentActivity.map((item, index) => (
          <li key={item.text} className="activity-timeline-item">
            <span className="activity-timeline-dot" />
            {index < recentActivity.length - 1 && (
              <span className="activity-timeline-line" />
            )}
            <div>
              <p className="activity-timeline-text">{item.text}</p>
              <p className="activity-timeline-time">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentActivityWidget;
