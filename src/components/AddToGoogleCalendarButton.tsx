import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Meeting } from '../models/Meeting';
import { Button } from '@mui/material';

interface Props {
  meeting: Meeting;
}

const AddToGoogleCalendarButton: React.FC<Props> = ({ meeting }) => {
  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar.events',
    onSuccess: async (tokenResponse) => {
      try {
        await axios.post(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          {
            summary: meeting.title,
            description: meeting.description,
            start: { dateTime: `${meeting.date}T${meeting.startTime}:00` },
            end: { dateTime: `${meeting.date}T${meeting.endTime}:00` },
          },
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        alert('Wydarzenie dodane do Google Kalendarza!');
      } catch (e) {
        alert('Błąd podczas dodawania do Google Kalendarza');
      }
    },
  });

  return (
    <Button variant="outlined" color="success" onClick={() => login()}>
      Dodaj do Kalendarza Google
    </Button>
  );
};

export default AddToGoogleCalendarButton; 