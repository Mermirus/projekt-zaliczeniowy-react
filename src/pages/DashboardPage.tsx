import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Container, Paper, IconButton } from '@mui/material';
import MeetingList from '../components/MeetingList';
import MeetingCalendar from '../components/MeetingCalendar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { subscribeMeetings } from '../services/meetingService';
import { Meeting } from '../models/Meeting';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const DashboardPage: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeMeetings(user.uid, role === 'admin', setMeetings);
      return () => unsubscribe();
    }
  }, [user, role]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Panel główny</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={toggleTheme} color="inherit">
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Button variant="outlined" color="secondary" onClick={logout}>
              Wyloguj się
            </Button>
          </Box>
        </Box>
        <MeetingCalendar meetings={meetings} />
        <Box mt={4}>
          <MeetingList />
        </Box>
      </Paper>
    </Container>
  );
};

export default DashboardPage; 