import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Container, Paper, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import MeetingList from '../components/MeetingList';
import MeetingCalendar from '../components/MeetingCalendar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { subscribeMeetings } from '../services/meetingService';
import { Meeting } from '../models/Meeting';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AddIcon from '@mui/icons-material/Add';
import MeetingForm from '../components/MeetingForm';
import dayjs from 'dayjs';

const DashboardPage: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [open, setOpen] = useState(false);
  const [editMeeting, setEditMeeting] = useState<Meeting | null>(null);
  const [overlapError, setOverlapError] = useState<string | null>(null);

  const defaultMeeting: Omit<Meeting, 'id' | 'createdBy'> = {
    title: '',
    description: '',
    date: dayjs().format('YYYY-MM-DD'),
    startTime: dayjs().format('HH:00'),
    endTime: dayjs().add(1, 'hour').format('HH:00'),
    participants: [],
    status: 'scheduled',
  };

  useEffect(() => {
    if (user && user.email && user.uid) {
      const unsubscribe = subscribeMeetings(user.uid, user.email, role === 'admin', setMeetings);
      return () => unsubscribe();
    }
  }, [user, role]);

  const handleAdd = () => {
    setEditMeeting(null);
    setOverlapError(null);
    setOpen(true);
  };

  const handleFormSubmit = async (values: any) => {
    // Sprawdź kolizje godzinowe
    const isOverlapping = meetings.some(m =>
      m.date === values.date &&
      (
        (values.startTime < m.endTime && values.endTime > m.startTime)
      ) &&
      (!editMeeting || m.id !== editMeeting.id)
    );
    if (isOverlapping) {
      setOverlapError('W tym czasie istnieje już inne spotkanie!');
      return;
    }
    setOverlapError(null);
    // Dodaj lub edytuj spotkanie
    // ... tutaj możesz dodać logikę dodawania/edycji ...
    setOpen(false);
  };

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
        <MeetingCalendar meetings={meetings} onAdd={handleAdd} />
        <Box>
          <MeetingList onAdd={handleAdd} />
        </Box>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>{editMeeting ? 'Edytuj rezerwację' : 'Dodaj rezerwację'}</DialogTitle>
          <DialogContent>
            <MeetingForm
              initialValues={editMeeting || defaultMeeting}
              onSubmit={handleFormSubmit}
              isEdit={!!editMeeting}
              overlapError={overlapError ?? undefined}
            />
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default DashboardPage; 