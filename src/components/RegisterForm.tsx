import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Alert, Container, Paper } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const validationSchema = Yup.object({
  email: Yup.string().email('Nieprawidłowy email').required('Email jest wymagany'),
  password: Yup.string().min(6, 'Hasło musi mieć min. 6 znaków').required('Hasło jest wymagane'),
  firstName: Yup.string().required('Imię jest wymagane'),
  lastName: Yup.string().required('Nazwisko jest wymagane'),
});

const RegisterForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError(null);
      setSuccess(null);
      try {
        const result = await registerUser(values.email, values.password, values.firstName, values.lastName);
        setSuccess(`Rejestracja udana! Twoja rola: ${result.role}`);
        setTimeout(() => navigate('/panel'), 1000);
      } catch (e: any) {
        setError(e.message || 'Błąd rejestracji');
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={4} sx={{ p: 4, width: '100%' }}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Typography variant="h4" align="center" gutterBottom>
            Rejestracja
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            margin="normal"
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Hasło"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            margin="normal"
          />
          <TextField
            fullWidth
            id="firstName"
            name="firstName"
            label="Imię"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
            margin="normal"
          />
          <TextField
            fullWidth
            id="lastName"
            name="lastName"
            label="Nazwisko"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
            margin="normal"
          />
          <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 2, mb: 1 }}>
            Zarejestruj się
          </Button>
          <Typography align="center" sx={{ mt: 2 }}>
            Masz już konto? <Link to="/logowanie">Zaloguj się</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterForm; 