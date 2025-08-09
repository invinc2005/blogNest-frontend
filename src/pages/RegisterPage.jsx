import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register, login as loginService } from '../services/authService';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Avatar,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Link
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AuthImage from '../assets/auth-image.jpg';
import BookTwoToneIcon from '@mui/icons-material/BookTwoTone';
import ThemeToggleButton from '../components/ThemeToggleButton'; 
import { useTheme } from '@mui/material/styles';
const steps = ['Account Details', 'Choose Username'];

const RegisterPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin ,theme,showSnackbar  } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const isStepOneValid = email.trim() !== '' && password.trim() !== '';
  const isStepTwoValid = username.trim() !== '';
    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleNext = () => {
        setError('');
        if (activeStep === 0) {
            if (!validateEmail(email)) {
                setError("Please enter a valid email address.");
                return;
            }
            if (password.length < 6) {
                setError("Password must be at least 6 characters long.");
                return;
            }
        }
        setActiveStep((prev) => prev + 1);
    };
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStepTwoValid) {
        setError("Please choose a username.");
        return;
    }
    if (username.trim().length < 3) {
            setError("Username must be at least 3 characters long.");
            return;
        }

    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
      const loginResponse = await loginService(email, password);
      authLogin(loginResponse.data);
      navigate('/');
    } catch (err) {
      setError('Failed to register. The email or username may already be taken.');
    } finally {
      setLoading(false);
    }
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
          </>
        );
      case 1:
        return (
          <TextField
            margin="normal"
            required
            fullWidth
            name="username"
            label="Username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        );
      default:
        return 'Unknown step';
    }
  }
      const blogTitleColor = theme.palette.mode === 'dark' ? 'white' : 'black';

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <ThemeToggleButton />
      </Box>
      <Grid
        size={{ xs: false, sm: 4, md: 7 }}
        sx={{
          position: 'relative',
          backgroundImage: `url(${AuthImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid 
        size={{ xs: 12, sm: 8, md: 5 }} 
        component={Paper} 
        elevation={6} 
        square
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <Typography 
                    variant="h3" 
                    component={Link} 
                    to="/"
                    sx={{ 
                        flexGrow: 1, 
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        fontFamily: 'monospace',
                        color: 'inherit'
                    }}
                >
                    <BookTwoToneIcon sx={{ mr: 1.5 }} />
                    <span style={{ color: blogTitleColor }}>Blog</span>
                    <span style={{ 
                        color: theme.palette.mode === 'dark' ? 'black' : 'white', 
                        WebkitTextStroke: `2px ${blogTitleColor}`,
                        paintOrder: ' fill'
                    }}>
                        Nest
                    </span>
                </Typography>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box sx={{ width: '100%', mt: 3 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box component="form" noValidate onSubmit={activeStep === steps.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
              {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
              
              {getStepContent(activeStep)}
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || (activeStep === 0 && !isStepOneValid) || (activeStep === 1 && !isStepTwoValid)}
                >
                  {loading ? 'Submitting...' : (activeStep === steps.length - 1 ? 'Sign Up' : 'Next')}
                </Button>
              </Box>
            </Box>
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Grid>
                <Link component={RouterLink} to="/login" variant="body2">
                  {"Already have an account? Sign in"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;