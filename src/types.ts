export type EmergencyNumber = '190' | '192' | '193' | '197' | '153' | '181';

export interface EmergencyService {
  number: EmergencyNumber;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  primaryColor: string; // Tailwind color class
  accentBg: string;
  iconName: string;
  examples: string[];
  whenToCall: string[];
  whenNotToCall: string;
  notRecommendedFor: string[];
}

export interface FirstAidGuide {
  id: string;
  title: string;
  subtitle: string;
  emergencyNumber: EmergencyNumber;
  icon: string;
  image: string;
  imageCaption: string;
  videoQueryTitle: string;
  videoSearchUrl: string;
  criticalRule: string;
  steps: string[];
  whatNotToDo: string[];
  warningNote?: string;
}

export interface LimitationCase {
  id: string;
  title: string;
  description: string;
  correctAlternative: string;
  operatesCase: {
    title: string;
    description: string;
    image: string;
    imageCaption: string;
    badgeText: string;
  };
  doesNotOperateCase: {
    title: string;
    description: string;
    image: string;
    imageCaption: string;
    badgeText: string;
  };
}

export interface ChecklistData {
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  referencePoint: string;
  lat?: number;
  lng?: number;
  situation: string;
  isConscious: 'sim' | 'nao' | 'parcial' | 'desconhecido';
  isBreathing: 'sim' | 'nao' | 'dificuldade' | 'desconhecido';
  hasPulse: 'sim' | 'nao' | 'fraco' | 'desconhecido';
  heavyBleeding: 'sim' | 'nao' | 'moderado' | 'desconhecido';
  victimAge: string;
  healthHistory: string;
  contactName: string;
  contactPhone: string;
  selectedService: EmergencyNumber;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  suggestedService?: EmergencyNumber;
  quickActions?: Array<{ label: string; action: string }>;
}
