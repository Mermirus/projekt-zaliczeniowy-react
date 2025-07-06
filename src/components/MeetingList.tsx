import React, { useEffect, useState, useMemo } from 'react';
import { Meeting } from '../models/Meeting';
import { addMeeting, updateMeeting, deleteMeeting, subscribeMeetings } from '../services/meetingService';
import { useAuth } from '../context/AuthContext';
import { Box, IconButton, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MeetingForm from './MeetingForm';
import MeetingFilters from './MeetingFilters';
import AddToGoogleCalendarButton from './AddToGoogleCalendarButton';
import Pagination from '@mui/material/Pagination';
import dayjs from 'dayjs';

const now = dayjs();
const defaultMeeting = {
  title: '',
  description: '',
  date: now.format('YYYY-MM-DD'),
  startTime: now.format('HH:00'),
  endTime: now.add(1, 'hour').format('HH:00'),
  participants: [],
  status: 'scheduled',
};

const PAGE_SIZE = 10;

const MeetingList: React.FC<{ onAdd: () => void }> = () => {
  const { user, role } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [open, setOpen] = useState(false);
  const [editMeeting, setEditMeeting] = useState<Meeting | null>(null);
  const [filters, setFilters] = useState({ date: '', status: '', participant: '', sort: 'date' });
  const [page, setPage] = useState(1);
  const [overlapError, setOverlapError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.email && user.uid) {
      const unsubscribe = subscribeMeetings(user.uid, user.email, role === 'admin', setMeetings);
      return () => unsubscribe();
    }
  }, [user, role]);

  const filteredMeetings = useMemo(() => {
    let filtered = [...meetings];
    if (filters.date) filtered = filtered.filter(m => m.date === filters.date);
    if (filters.status) filtered = filtered.filter(m => m.status === filters.status);
    if (filters.participant) filtered = filtered.filter(m => m.participants.some(p => p.includes(filters.participant)));
    if (filters.sort === 'date') filtered.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
    if (filters.sort === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title));
    return filtered;
  }, [meetings, filters]);

  const paginatedMeetings = filteredMeetings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id: string) => {
    await deleteMeeting(id);
  };

  const handleEdit = (meeting: Meeting) => {
    setEditMeeting(meeting);
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
    if (editMeeting) {
      await updateMeeting(editMeeting.id, values);
    } else {
      await addMeeting({ ...values, createdBy: user?.uid });
    }
    setOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({ date: '', status: '', participant: '', sort: 'date' });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Filtruj spotkania
      </Typography>
      <MeetingFilters filters={filters} onChange={setFilters} onReset={handleResetFilters} />
      <List>
        {paginatedMeetings.map((meeting) => (
          <ListItem key={meeting.id} divider>
            <ListItemText
              primary={meeting.title + ' (' + meeting.date + ' ' + meeting.startTime + '-' + meeting.endTime + ')'}
              secondary={meeting.description + ' | Uczestnicy: ' + meeting.participants.join(', ')}
            />
              <AddToGoogleCalendarButton meeting={meeting} />
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(meeting)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(meeting.id)}>
                <DeleteIcon />
              </IconButton>
          </ListItem>
        ))}
        {filteredMeetings.length === 0 && (
          <ListItem><ListItemText primary="Brak rezerwacji spełniających kryteria" /></ListItem>
        )}
      </List>
      <Pagination
        count={Math.ceil(filteredMeetings.length / PAGE_SIZE)}
        page={page}
        onChange={(_, value) => setPage(value)}
        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
      />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editMeeting ? 'Edytuj rezerwację' : 'Dodaj rezerwację'}</DialogTitle>
        <DialogContent>
          <MeetingForm
            initialValues={editMeeting || { ...defaultMeeting, participants: [], status: 'scheduled' }}
            onSubmit={handleFormSubmit}
            isEdit={!!editMeeting}
            overlapError={overlapError ?? undefined}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MeetingList; 