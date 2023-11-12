import { userTypes } from "./constant";

export interface Conversation {
  content: string;
  id: string | number;
  date: Date;
  type: (typeof userTypes)[keyof typeof userTypes];
  loading?: boolean;
  voiceImageKey?: string;
}

export type User = {
  email?: string;
  image?: string;
  name?: string;
};

export interface COUNTRY_DATA {
  countryCode: string;
  countryName: string;
  locale?: string;
  language?: string;
}

export interface VOICE_COUNTRY_DATA extends COUNTRY_DATA {
  voice: string;
}

export type VoiceData = {
  // key country-gender: cn-female
  [key: string]: VOICE_COUNTRY_DATA;
};
