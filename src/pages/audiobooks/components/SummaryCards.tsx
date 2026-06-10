import {
  BookOpen,
  Calendar,
  FileText,
  Radio,
  Users,
} from 'lucide-react';
import SolidIcon from '../../../components/common/SolidIcon';
import { audiobookSummaryStats } from '../../../content/marketingContent';
import '../../../styles/pages/audiobooks/components/SummaryCards.css';

interface SummaryCardsProps {
  totalTitles?: number;
}

function SummaryCards({ totalTitles }: SummaryCardsProps) {
  const cards = [
    {
      label: 'Total Titles',
      value: totalTitles?.toString() ?? '128',
      subtext: 'All time',
      icon: BookOpen,
      color: 'purple',
    },
    {
      label: 'Live',
      value: audiobookSummaryStats.live.value,
      subtext: audiobookSummaryStats.live.subtext,
      icon: Radio,
      color: 'green',
    },
    {
      label: 'Scheduled',
      value: audiobookSummaryStats.scheduled.value,
      subtext: audiobookSummaryStats.scheduled.subtext,
      icon: Calendar,
      color: 'orange',
    },
    {
      label: 'Drafts',
      value: audiobookSummaryStats.drafts.value,
      subtext: audiobookSummaryStats.drafts.subtext,
      icon: FileText,
      color: 'blue',
    },
    {
      label: 'Total Listeners',
      value: audiobookSummaryStats.listeners.value,
      subtext: audiobookSummaryStats.listeners.subtext,
      icon: Users,
      color: 'pink',
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="summary-card marketing-card">
            <div className={`summary-card-icon summary-card-icon--${card.color}`}>
              <SolidIcon icon={Icon} size={20} />
            </div>
            <div>
              <p className="summary-card-label">{card.label}</p>
              <p className="summary-card-value">{card.value}</p>
              <p className="summary-card-subtext">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SummaryCards;
