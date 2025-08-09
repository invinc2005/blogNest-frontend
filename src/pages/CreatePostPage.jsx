import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/postService';
import { 
    Container, Box, Typography, TextField, Button, CircularProgress, Alert, 
    Paper, ToggleButtonGroup, ToggleButton 
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageOption, setImageOption] = useState('url'); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleImageOptionChange = (event, newOption) => {
        if (newOption !== null) {
            setImageOption(newOption);
            // Clear other options' data
            setImageUrl('');
            setImageFile(null);
        }
    };

    const handleFileChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const postData = { title, content };
        if (imageOption === 'url') {
            postData.imageUrl = imageUrl;
        } else if (imageOption === 'upload') {
            postData.imageFile = imageFile;
        }

        try {
            const newPost = await createPost(postData);
            navigate(`/posts/${newPost.id}`);
        } catch (err) {
            setError('Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Create a New Post
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                <TextField
                    label="Title"
                    fullWidth
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Typography sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>Post Image</Typography>
                <ToggleButtonGroup
                    value={imageOption}
                    exclusive
                    onChange={handleImageOptionChange}
                    aria-label="image option"
                    sx={{ mb: 2 }}
                >
                    <ToggleButton value="url" aria-label="image url"><LinkIcon /> URL</ToggleButton>
                    <ToggleButton value="upload" aria-label="upload image"><ImageIcon /> Upload</ToggleButton>
                    <ToggleButton value="none" aria-label="no image"><ImageNotSupportedIcon /> None</ToggleButton>
                </ToggleButtonGroup>

                {imageOption === 'url' && (
                    <TextField
                        label="Image URL"
                        fullWidth
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                )}

                {imageOption === 'upload' && (
                    <Button variant="contained" component="label" sx={{ mb: 2 }}>
                        Choose File
                        <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                    </Button>
                )}
                {imageFile && <Typography sx={{ mb: 2 }}>Selected: {imageFile.name}</Typography>}
                
                <TextField
                    label="Content"
                    fullWidth
                    required
                    multiline
                    rows={15}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    sx={{ mb: 2 }}
                />
                
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    size="large"
                >
                    {loading ? <CircularProgress size={24} /> : 'Publish Post'}
                </Button>
            </Paper>
        </Container>
    );
};

export default CreatePostPage;