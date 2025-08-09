import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';
import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Alert, 
    Paper, 
    Avatar, 
    Grid, 
    Skeleton, 
    Snackbar,
    Link
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AuthImage from '../assets/auth-image.jpg'; 
import BookTwoToneIcon from '@mui/icons-material/BookTwoTone';
import ThemeToggleButton from '../components/ThemeToggleButton'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login: authLogin, theme } = useAuth();

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
    try {
        const response = await login(email, password);
        authLogin(response.data);
        navigate('/');
    } catch (err) {
        if (err.response && err.response.data) {
            setError(err.response.data.message || err.response.data);
        } else {
            setError('Login failed. An unknown error occurred.');
        }
    } finally {
        setLoading(false);
    }
    };

    const blogTitleColor = theme.palette.mode === 'dark' ? 'white' : 'black';

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <Box sx={{ position: 'absolute', top: 16, right: 16 ,zIndex: 10 }}>
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
            >
            </Grid>

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
                    position: 'relative',
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
                        Sign In
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                        {loading ? (
                            <Box sx={{ width: '100%' }}>
                                <Skeleton variant="rectangular" height={56} sx={{ mb: 3 }} />
                                <Skeleton variant="rectangular" height={56} />
                                <Skeleton variant="rectangular" height={56} sx={{ mt: 3, mb: 2 }} />
                            </Box>
                        ) : (
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
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    Sign In
                                </Button>
                            </>
                        )}
                        <Grid container justifyContent="flex-end">
                            <Grid> 
                                <Link component={RouterLink} to="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default LoginPage;