import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getLikedPosts, getMe } from '../services/userService';
import {createTheme} from '@mui/material/styles';
import { useMemo } from 'react';
import { Snackbar,Alert,Slide } from '@mui/material';
import { getNotifications } from '../services/userService'; 

const AuthContext = createContext(null);
const avatarColors = ['#ff5722', '#ffc107', '#4caf50', '#2196f3', '#9c27b0'];


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [likedPostIds, setLikedPostIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarInfo, setSnackbarInfo] = useState({ message: '', severity: 'success' });
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
        try {
        console.log("FETCHING NOTIFICATIONS...");
            const data = await getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Could not fetch notifications", error);
        }
    };
    const showSnackbar = (message, severity = 'success') => {
        setSnackbarInfo({ message, severity });
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const closeSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

   const avatarBorderColor = useMemo(() => {
        return avatarColors[Math.floor(Math.random() * avatarColors.length)];
    }, [user]);
  const toggleTheme = () => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('themeMode', newMode);
            return newMode;
        });
    };
    
    const theme = useMemo(() => createTheme({
        palette: {
            mode,
        },
    }), [mode]);
  const fetchLikedPosts = async () => {
    try {
      const likedPostsData = await getLikedPosts();
      const ids = new Set(likedPostsData.map(post => post.id));
      setLikedPostIds(ids);
    } catch (error) {
      console.error("Could not fetch liked posts", error);
    }
  };


useEffect(() => {
    const initializeAuth = async () => {
      const tokenInStorage = localStorage.getItem('token');
      if (tokenInStorage) {
        try {
          const userData = await getMe();
          setUser(userData);
          setToken(tokenInStorage);
          await fetchLikedPosts();
          await fetchNotifications();
        } catch (error) {
          console.error("Session expired or invalid", error);
          logout(); 
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    initializeAuth();
}, []);

  const login = (authData) => {
    const { token, user: userData } = authData;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
    fetchLikedPosts();
    fetchNotifications();
    showSnackbar("Login Successful!","success");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setLikedPostIds(new Set());
    localStorage.removeItem('token');
  };

  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({ ...prevUser, ...updatedUserData }));
  };

  const isAuthenticated = !!token;

  const handleLike = (postId) => setLikedPostIds(prev => new Set(prev).add(postId));
  const handleUnlike = (postId) => {
    setLikedPostIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
  };

  if (loading) {
    return null;
  }
  const value = {
        user, 
        token,
        isAuthenticated, 
        loading, 
        login, 
        logout, 
        likedPostIds, 
        handleLike, 
        handleUnlike, 
        updateUser,
        theme,      
        toggleTheme,
        avatarBorderColor,
        showSnackbar,
        notifications,
        setNotifications ,
        fetchNotifications,
    };
  return (
        <AuthContext.Provider value={value}>
            {children}
            <Snackbar
                key={snackbarInfo.message} 
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={(props) => <Slide {...props} direction="down" />}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbarInfo.severity} 
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarInfo.message}
                </Alert>
            </Snackbar>
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
  return useContext(AuthContext);
};