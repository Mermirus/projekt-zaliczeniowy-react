export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  startTime: string; // hh:mm
  endTime: string; // hh:mm
  participants: string[]; // adresy email
  createdBy: string; // id użytkownika
  status: 'scheduled' | 'canceled';
} 