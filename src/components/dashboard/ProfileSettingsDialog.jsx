import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, Tabs, Tab, Box,
    TextField, Button, Typography, Stack, IconButton,
    CircularProgress, Alert, Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useAuth } from '../../context/AuthContext';
import { uploadProfilePicture, updateUsername } from '../../services/userService';
import { resolveImageUrl } from '../../utils/urlUtils';

const TabPanel = (props) => {
    const { children, value, index } = props;
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box>{children}</Box>}
        </div>
    );
};

const ProfileSettingsDialog = ({ open, onClose }) => {
    const { user, updateUser, showSnackbar } = useAuth();
    const [tabIndex, setTabIndex] = useState(0);
    const [newUsername, setNewUsername] = useState('');
    const [loadingUsername, setLoadingUsername] = useState(false);
    const [loadingPicture, setLoadingPicture] = useState(false);

    useEffect(() => {
        if (open && user) {
            setNewUsername(user.displayName || '');
        }
    }, [open, user]);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleUsernameChange = async () => {
        if (newUsername === user.displayName) {
            showSnackbar("This is already your username.", "info");
            return;
        }
        setLoadingUsername(true);
        try {
            const updatedUserDto = await updateUsername(newUsername);
            updateUser(updatedUserDto);
            showSnackbar('Username updated successfully!', 'success');
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data || 'Failed to update username.';
            showSnackbar(errorMessage, 'error');
        } finally {
            setLoadingUsername(false);
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoadingPicture(true);
        try {
            const updatedUserDto = await uploadProfilePicture(file);
            updateUser(updatedUserDto);
            showSnackbar('Profile picture updated successfully!', 'success');
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to upload.';
            showSnackbar(errorMessage, 'error');
        } finally {
            setLoadingPicture(false);
        }
    };
    
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Edit Profile
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                        '&:hover': {
                            color: 'error.main',
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="profile settings tabs" variant="fullWidth">
                    <Tab icon={<AccountCircleIcon />} label="Change Username" />
                    <Tab icon={<PhotoCameraIcon />} label="Change Profile Picture" />
                </Tabs>
            </Box>
            <DialogContent sx={{ pt: 2, pb: 3, px: 3 }}>
                <TabPanel value={tabIndex} index={0}>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Enter a new username. This will be publicly visible.
                        </Typography>
                        <TextField
                            fullWidth
                            label="New Username"
                            variant="outlined"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button 
                                variant="contained" 
                                onClick={handleUsernameChange}
                                disabled={loadingUsername}
                            >
                                {loadingUsername ? <CircularProgress size={24} /> : 'Save Username'}
                            </Button>
                        </Box>
                    </Stack>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <Stack spacing={2} alignItems="center" sx={{ pt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Your current profile picture:
                        </Typography>
                        <Avatar src={resolveImageUrl(user?.profilePictureUrl)} sx={{ width: 100, height: 100 }} />
                        <Button variant="contained" component="label" disabled={loadingPicture}>
                            {loadingPicture ? <CircularProgress size={24} /> : 'Upload New Photo'}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                    </Stack>
                </TabPanel>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileSettingsDialog;