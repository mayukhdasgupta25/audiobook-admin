import { TrendingUp } from 'lucide-react';
import '../../../../styles/pages/audiobooks/components/widgets/Widgets.css';

function PerformanceSnapshotWidget() {
  return (
    <div className="audiobook-widget marketing-card">
      <h3 className="audiobook-widget-title">Performance Snapshot</h3>
      <p className="audiobook-widget-period">Last 30 days</p>
      <div className="performance-sparkline" aria-hidden="true">
        <svg viewBox="0 0 200 60" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            points="0,50 30,45 60,35 90,30 120,25 150,15 180,10 200,5"
          />
        </svg>
      </div>
      <div className="performance-metrics">
        <div>
          <p className="performance-label">Listening Hours</p>
          <p className="performance-value">
            92.1K <span className="marketing-stat-trend">↑ 22%</span>
          </p>
        </div>
        <div>
          <p className="performance-label">Completion Rate</p>
          <p className="performance-value">
            68% <span className="marketing-stat-trend">↑ 6%</span>
          </p>
        </div>
      </div>
      <div className="performance-trend-icon">
        <TrendingUp size={16} />
      </div>
    </div>
  );
}

export default PerformanceSnapshotWidget;
