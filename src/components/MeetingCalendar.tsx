import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendar.css';
import { Meeting } from '../models/Meeting';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import dayjs from 'dayjs';

interface MeetingCalendarProps {
  meetings: Meeting[];
}

const MeetingCalendar: React.FC<MeetingCalendarProps> = ({ meetings }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { isDarkMode } = useTheme();

  const meetingsByDate = (date: Date) => {
    const d = dayjs(date).format('YYYY-MM-DD');
    return meetings.filter(m => dayjs(m.date).format('YYYY-MM-DD') === d);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <Box sx={{ width: '100%' }} data-theme={isDarkMode ? 'dark' : 'light'}>
        <Calendar
          onClickDay={setSelectedDate}
          tileContent={({ date, view }) => {
            if (view === 'month' && meetingsByDate(date).length > 0) {
              return <span style={{ color: isDarkMode ? '#90caf9' : 'green', fontWeight: 'bold' }}>•</span>;
            }
            return null;
          }}
        />
      </Box>
      {selectedDate && (
        <Box mt={2} sx={{ width: '100%' }}>
          <Typography variant="h6" align="center">Rezerwacje na {selectedDate.toLocaleDateString()}</Typography>
          <List>
            {meetingsByDate(selectedDate).map(meeting => (
              <ListItem key={meeting.id} divider>
                <ListItemText
                  primary={meeting.title + ' (' + meeting.startTime + '-' + meeting.endTime + ')'}
                  secondary={meeting.description + ' | Uczestnicy: ' + meeting.participants.join(', ')}
                />
              </ListItem>
            ))}
            {meetingsByDate(selectedDate).length === 0 && (
              <ListItem><ListItemText primary="Brak rezerwacji na ten dzień" /></ListItem>
            )}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default MeetingCalendar; 