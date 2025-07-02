import React from 'react';
import { Button, TextField, Box, Typography, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Meeting } from '../models/Meeting';
import dayjs from 'dayjs';

interface MeetingFormProps {
  initialValues: Omit<Meeting, 'id' | 'createdBy'>;
  onSubmit: (values: Omit<Meeting, 'id' | 'createdBy'>) => void;
  isEdit?: boolean;
  overlapError?: string;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Tytuł jest wymagany'),
  description: Yup.string().required('Opis jest wymagany'),
  date: Yup.string()
    .required('Data jest wymagana')
    .test('is-not-past', 'Data nie może być w przeszłości', value => {
      if (!value) return false;
      return dayjs(value).startOf('day').valueOf() >= dayjs().startOf('day').valueOf();
    }),
  startTime: Yup.string().required('Godzina rozpoczęcia jest wymagana'),
  endTime: Yup.string()
    .required('Godzina zakończenia jest wymagana')
    .test('is-after-start', 'Godzina zakończenia musi być po rozpoczęciu', function (value) {
      const { startTime } = this.parent;
      return !startTime || !value || value > startTime;
    }),
  participants: Yup.string()
    .required('Podaj co najmniej jeden adres email')
    .test('is-valid-emails', 'Podaj poprawne adresy email oddzielone przecinkami', value => {
      if (!value) return false;
      return value.split(',').every(email =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      );
    }),
  status: Yup.string().oneOf(['scheduled', 'canceled']).required('Status jest wymagany'),
});

const MeetingForm: React.FC<MeetingFormProps> = ({ initialValues, onSubmit, isEdit, overlapError }) => {
  const formik = useFormik({
    initialValues: {
      ...initialValues,
      participants: initialValues.participants.join(', '),
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit({
        ...values,
        participants: values.participants.split(',').map((p) => p.trim()),
      });
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" mb={2}>{isEdit ? 'Edytuj rezerwację' : 'Dodaj rezerwację'}</Typography>
      <TextField
        fullWidth
        id="title"
        name="title"
        label="Tytuł spotkania"
        value={formik.values.title}
        onChange={formik.handleChange}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
        margin="normal"
      />
      <TextField
        fullWidth
        id="description"
        name="description"
        label="Opis spotkania"
        value={formik.values.description}
        onChange={formik.handleChange}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
        margin="normal"
      />
      <TextField
        fullWidth
        id="date"
        name="date"
        label="Data spotkania"
        type="date"
        value={formik.values.date}
        onChange={formik.handleChange}
        error={formik.touched.date && Boolean(formik.errors.date)}
        helperText={formik.touched.date && formik.errors.date}
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        id="startTime"
        name="startTime"
        label="Godzina rozpoczęcia"
        type="time"
        value={formik.values.startTime}
        onChange={e => {
          const value = e.target.value;
          formik.setFieldValue('startTime', value);
          // Automatyczna zmiana endTime na +1h
          const [h, m] = value.split(':');
          const end = dayjs().hour(Number(h)).minute(Number(m)).add(1, 'hour').format('HH:mm');
          formik.setFieldValue('endTime', end);
        }}
        error={formik.touched.startTime && Boolean(formik.errors.startTime)}
        helperText={formik.touched.startTime && formik.errors.startTime}
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      {overlapError && (
        <Typography color="error" variant="caption">{overlapError}</Typography>
      )}
      <TextField
        fullWidth
        id="endTime"
        name="endTime"
        label="Godzina zakończenia"
        type="time"
        value={formik.values.endTime}
        onChange={formik.handleChange}
        error={formik.touched.endTime && Boolean(formik.errors.endTime)}
        helperText={formik.touched.endTime && formik.errors.endTime}
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        id="participants"
        name="participants"
        label="Uczestnicy (adresy email, oddzielone przecinkami)"
        value={formik.values.participants}
        onChange={formik.handleChange}
        error={formik.touched.participants && Boolean(formik.errors.participants)}
        helperText={formik.touched.participants && formik.errors.participants}
        margin="normal"
      />
      <TextField
        select
        fullWidth
        id="status"
        name="status"
        label="Status"
        value={formik.values.status}
        onChange={formik.handleChange}
        error={formik.touched.status && Boolean(formik.errors.status)}
        helperText={formik.touched.status && formik.errors.status}
        margin="normal"
      >
        <MenuItem value="scheduled">Zaplanowane</MenuItem>
        <MenuItem value="canceled">Odwołane</MenuItem>
      </TextField>
      <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
        {isEdit ? 'Zapisz zmiany' : 'Dodaj rezerwację'}
      </Button>
    </Box>
  );
};

export default MeetingForm; 