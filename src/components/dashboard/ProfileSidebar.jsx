import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Paper, Box, Avatar, Typography, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { resolveImageUrl } from '../../utils/urlUtils';
import ProfileSettingsDialog from './ProfileSettingsDialog';

const ProfileSidebar = ({ postCount }) => {
    const { user } = useAuth();
    const [settingsOpen, setSettingsOpen] = useState(false);

    const displayPostCount = postCount !== undefined ? postCount : '...';

    return (
        <>
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    height: '100%',
                    justifyContent: 'center' 
                }}
            >
                <Box sx={{ position: 'relative', width: 'fit-content' }}>
                    <Avatar
                        src={resolveImageUrl(user?.profilePictureUrl)}
                        sx={{ width: 120, height: 120, mb: 2, border: '4px solid', borderColor: 'primary.main' }}
                    >
                        {user?.displayName?.charAt(0).toUpperCase()}
                    </Avatar>
                    <IconButton
                        aria-label="settings"
                        onClick={() => setSettingsOpen(true)}
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            bgcolor: 'background.paper',
                        }}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {user?.displayName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {user?.email}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Posts: {displayPostCount}
                </Typography>
            </Paper>
            <ProfileSettingsDialog 
                open={settingsOpen} 
                onClose={() => setSettingsOpen(false)} 
            />
        </>
    );
};

export default ProfileSidebar;