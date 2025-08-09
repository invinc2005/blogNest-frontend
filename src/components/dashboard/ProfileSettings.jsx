import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadProfilePicture } from '../../services/userService';
import { Box, Typography, Button, Avatar, CircularProgress, Alert } from '@mui/material';

const ProfileSettings = () => {
    const { user, updateUser } = useAuth(); 
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
        const updatedUser = await uploadProfilePicture(selectedFile);
        updateUser({ profilePictureUrl: updatedUser.profilePictureUrl });
        setSuccess('Profile picture updated successfully!');
    } catch (err) {
        console.error("Upload failed. Full error object:", err);
        if (err.response) {
            console.error("Backend responded with:", err.response.data);
            console.error("Status code:", err.response.status);
            setError(`Upload failed: ${err.response.data.message || 'Server error'}`);
        } else if (err.request) {
            console.error("No response received from server:", err.request);
            setError('Upload failed: The server is not responding.');
        } else {
            console.error('Error setting up request:', err.message);
            setError('Upload failed. Please check your network connection.');
        }
    } finally {
        setLoading(false);
    }
};

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Profile Picture</Typography>
            <Avatar src={`http://localhost:8080${user?.profilePictureUrl}`} sx={{ width: 100, height: 100, mb: 2 }} />
            <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
                <Button variant="contained" component="span">
                    Choose Image
                </Button>
            </label>
            {selectedFile && <Typography sx={{ my: 1 }}>{selectedFile.name}</Typography>}
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={!selectedFile || loading}
                sx={{ ml: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : 'Upload'}
            </Button>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </Box>
    );
};

export default ProfileSettings;