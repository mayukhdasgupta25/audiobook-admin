export const landingStats = [
  {
    value: '250+',
    label: 'Partner organizations',
    icon: 'users' as const,
  },
  {
    value: '12K+',
    label: 'Audiobooks published',
    icon: 'book' as const,
  },
  {
    value: '10M+',
    label: 'Listeners reached',
    icon: 'headphones' as const,
  },
  {
    value: '98%',
    label: 'Partner satisfaction',
    icon: 'star' as const,
  },
];

export const loginStatCards = [
  {
    title: 'Listeners',
    value: '45.6K',
    trend: '↑ 18%',
    variant: 'listeners' as const,
  },
  {
    title: 'Catalog Overview',
    value: '128',
    subtitle: 'Total Titles',
    trend: '↑ 12%',
    variant: 'catalog' as const,
  },
  {
    title: 'Listening Hours',
    value: '92.1K',
    trend: '↑ 22%',
    variant: 'hours' as const,
  },
  {
    title: 'Published',
    value: '103',
    subtitle: 'titles',
    variant: 'published' as const,
  },
  {
    title: 'Active Listeners',
    value: '10M+',
    variant: 'active' as const,
  },
];

export const loginFeatures = [
  {
    title: 'Built for partners',
    description: 'Purpose-built tools for audiobook publishers',
    icon: 'shield' as const,
  },
  {
    title: 'Data that drives growth',
    description: 'Actionable insights to grow your audience',
    icon: 'chart' as const,
  },
  {
    title: 'Secure & reliable',
    description: 'Enterprise-grade security for your catalog',
    icon: 'lock' as const,
  },
];

export const landingFeatures = [
  {
    title: 'Catalog management',
    description:
      'Organize audiobooks, chapters, and metadata so your library stays consistent and easy to browse.',
    icon: 'library' as const,
  },
  {
    title: 'Audience insights',
    description:
      'Understand how listeners engage with your content and make data-informed publishing decisions.',
    icon: 'chart' as const,
  },
  {
    title: 'Partner publishing',
    description:
      'Onboard your team, manage releases, and publish under your brand with clear roles and access.',
    icon: 'users' as const,
  },
];

export const audiobookSummaryStats = {
  live: { value: '74', subtext: '57.8% of total' },
  scheduled: { value: '12', subtext: 'Upcoming' },
  drafts: { value: '9', subtext: 'In progress' },
  listeners: { value: '45.6K', subtext: '↑ 18% vs last 30 days' },
};

export const upcomingReleases = [
  { title: 'Mindful Minutes', date: 'May 22, 2026', daysUntil: 14 },
  { title: 'The Art of Focus', date: 'Jun 5, 2026', daysUntil: 28 },
  { title: 'Stories Untold', date: 'Jun 18, 2026', daysUntil: 41 },
];

export const partnerRegisterFeatures = [
  {
    title: 'Collaborate as a team',
    description:
      'Invite teammates, assign roles, and manage your catalog together.',
    icon: 'users' as const,
  },
  {
    title: 'Track what matters',
    description:
      'Access real-time analytics to understand your performance and audience.',
    icon: 'chart' as const,
  },
  {
    title: 'Publish with confidence',
    description:
      'Enterprise-grade security to keep your content and data safe.',
    icon: 'shield' as const,
  },
];

export const partnerRegisterStatCards = [
  {
    title: 'Total Titles',
    value: '128',
    trend: '↑ 12%',
    variant: 'catalog' as const,
  },
  {
    title: 'Listening Hours',
    value: '92.1K',
    trend: '↑ 22%',
    variant: 'hours' as const,
  },
  {
    title: 'Active Listeners',
    value: '10M+',
    variant: 'active' as const,
  },
];

export const individualRegisterFeatures = [
  {
    title: 'Build your personal brand',
    description:
      'Create a professional presence and showcase your work with confidence.',
    icon: 'users' as const,
  },
  {
    title: 'Track your audience',
    description:
      'Access real-time insights to understand and grow your listeners.',
    icon: 'chart' as const,
  },
  {
    title: 'Publish with confidence',
    description:
      'Enterprise-grade tools to keep your content and data safe.',
    icon: 'shield' as const,
  },
];

export const TEAM_SIZE_OPTIONS = [
  { value: '1-10' as const, label: '1-10' },
  { value: '11-50' as const, label: '11-50' },
  { value: '51-200' as const, label: '51-200' },
  { value: '200+' as const, label: '200+' },
];

export const ORGANIZATION_GENRE_OPTIONS = [
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'drama', label: 'Drama' },
  { value: 'romance', label: 'Romance' },
  { value: 'horror', label: 'Horror' },
] as const;

export const recentActivity = [
  { text: 'Mindful Minutes went live', time: '2 hours ago' },
  { text: 'Chapter 3 added to Deep Work', time: '5 hours ago' },
  { text: 'The Art of Focus scheduled', time: 'Yesterday' },
  { text: 'Metadata updated for 3 titles', time: '2 days ago' },
];
