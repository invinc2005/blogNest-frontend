import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostById, updatePost } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { 
    Container, Box, Typography, TextField, Button, CircularProgress, Alert, 
    Paper, ToggleButtonGroup, ToggleButton 
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const EditPostPage = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageOption, setImageOption] = useState('url');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { showSnackbar } = useAuth();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postData = await getPostById(id);
                setTitle(postData.title);
                setContent(postData.content);
                if (postData.imageUrl) {
                    setImageUrl(postData.imageUrl);
                    setImageOption('url');
                } else {
                    setImageOption('none');
                }
            } catch (err) {
                setError('Could not load post data.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleImageOptionChange = (event, newOption) => {
        if (newOption !== null) {
            setImageOption(newOption);
            setImageUrl('');
            setImageFile(null);
        }
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
        } else {
            postData.imageUrl = ''; 
        }

        try {
            const updatedPost = await updatePost(id, postData);

        console.log("Data received after update:", updatedPost); 
            showSnackbar("Post updated successfully!", "success");
            navigate(`/posts/${id}`);
        } catch (err) {
            setError('Failed to update post. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Edit Your Post
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                <TextField label="Title" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
                
                <Typography sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>Post Image</Typography>
                <ToggleButtonGroup value={imageOption} exclusive onChange={handleImageOptionChange} sx={{ mb: 2 }}>
                    <ToggleButton value="url" aria-label="image url"><LinkIcon /> URL</ToggleButton>
                    <ToggleButton value="upload" aria-label="upload image"><ImageIcon /> Upload</ToggleButton>
                    <ToggleButton value="none" aria-label="no image"><ImageNotSupportedIcon /> None</ToggleButton>
                </ToggleButtonGroup>

                {imageOption === 'url' && (
                    <TextField label="Image URL" fullWidth value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} sx={{ mb: 2 }} />
                )}

                {imageOption === 'upload' && (
                    <Button variant="contained" component="label" sx={{ mb: 2 }}>
                        Choose New File
                        <input type="file" hidden onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" />
                    </Button>
                )}
                {imageFile && <Typography sx={{ mb: 2 }}>Selected: {imageFile.name}</Typography>}
                
                <TextField label="Content" fullWidth required multiline rows={15} value={content} onChange={(e) => setContent(e.target.value)} sx={{ mb: 2 }} />
                
                <Button type="submit" variant="contained" color="primary" disabled={loading} size="large">
                    {loading ? <CircularProgress size={24} /> : 'Update Post'}
                </Button>
            </Paper>
        </Container>
    );
};

export default EditPostPage;