import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Alert, Container, Paper } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const validationSchema = Yup.object({
  email: Yup.string().email('Nieprawidłowy email').required('Email jest wymagany'),
  password: Yup.string().required('Hasło jest wymagane'),
});

const LoginForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError(null);
      try {
        await loginUser(values.email, values.password);
        navigate('/panel');
      } catch (e: any) {
        setError(e.message || 'Błąd logowania');
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={4} sx={{ p: 4, width: '100%' }}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Typography variant="h4" align="center" gutterBottom>
            Logowanie
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
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
          <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 2, mb: 1 }}>
            Zaloguj się
          </Button>
          <Typography align="center" sx={{ mt: 2 }}>
            Nie masz konta? <Link to="/rejestracja">Zarejestruj się</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm; 