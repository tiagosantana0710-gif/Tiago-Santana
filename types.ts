
export enum AppView {
  HOME = 'home',
  PRAYERS = 'prayers',
  ROSARIES = 'rosaries',
  CALENDAR = 'calendar',
  JOURNAL = 'journal',
  ABOUT = 'about',
  PRAYER_DETAIL = 'prayer_detail',
  ROSARY_GUIDE = 'rosary_guide'
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  linkedPrayerId?: string;
}

export interface Prayer {
  id: string;
  title: string;
  category: string;
  content: string;
  explanation: string;
  latinVersion?: string;
}

export interface RosaryStep {
  title: string;
  description: string;
  image?: string;
  prayer?: string;
}

export interface Rosary {
  id: string;
  title: string;
  description: string;
  steps: RosaryStep[];
  image: string;
}

export interface LiturgicalDay {
  date: Date;
  title: string;
  color: 'green' | 'red' | 'white' | 'purple' | 'rose';
  rank: string;
}
