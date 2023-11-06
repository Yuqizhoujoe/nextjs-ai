import { userTypes } from "./constant";

export interface Conversation {
  content: string;
  id: string | number;
  date: Date;
  type: (typeof userTypes)[keyof typeof userTypes];
  loading?: boolean;
}
