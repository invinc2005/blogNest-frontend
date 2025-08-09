import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem, Tooltip, Badge } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { markNotificationAsRead } from '../services/userService';
import BookTwoToneIcon from '@mui/icons-material/BookTwoTone';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import LightModeTwoToneIcon from '@mui/icons-material/LightModeTwoTone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { resolveImageUrl } from '../utils/urlUtils';

const Navbar = () => {
    const { 
        isAuthenticated, 
        logout, 
        user, 
        toggleTheme, 
        theme, 
        avatarBorderColor, 
    } = useAuth();
    
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);
    

    const handleLogout = () => {
        handleCloseUserMenu();
        logout();
        navigate('/login');
    };

    

    const blogTitleColor = theme.palette.mode === 'dark' ? 'white' : 'black';

    return (
        <AppBar 
            position="static"
            sx={{ 
                backgroundColor: 'background.paper',
                color: 'text.primary',
                boxShadow: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Toolbar>
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
                    <BookTwoToneIcon sx={{ mr: 1 }} />
                    <span style={{ color: blogTitleColor }}>Blog</span>
                    <span style={{ 
                        color: theme.palette.mode === 'dark' ? 'black' : 'white', 
                        WebkitTextStroke: `2px ${blogTitleColor}`,
                        paintOrder: ' fill'
                    }}>
                        Nest
                    </span>
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Toggle theme">
                        <IconButton sx={{ mr: 1 }} onClick={toggleTheme} color="inherit">
                            {theme.palette.mode === 'dark' ? <LightModeTwoToneIcon /> : <DarkModeTwoToneIcon />}
                        </IconButton>
                    </Tooltip>
                    
                    {isAuthenticated ? (
                        <>
                            
                            
                            <Typography sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                                Welcome, {user?.displayName || user?.email}
                            </Typography>
                            
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Box
                                            sx={{
                                                borderRadius: '50%',
                                                padding: '2px',
                                                border: '2px solid',
                                                borderColor: avatarBorderColor,
                                            }}
                                        >
                                            <Avatar 
                                                alt={user?.displayName || user?.email} 
                                                src={resolveImageUrl(user?.profilePictureUrl)} 
                                            />
                                        </Box>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    keepMounted
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    
                                    <MenuItem 
                                        onClick={handleLogout}
                                        sx={{
                                            '&:hover': {
                                                color: 'error.main',
                                                backgroundColor: 'rgba(255, 0, 0, 0.08)'
                                            }
                                        }}
                                    >
                                        <Typography textAlign="center">Logout</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </>
                    ) : (
                    null
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;