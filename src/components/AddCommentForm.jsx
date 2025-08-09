import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { addComment } from '../services/commentService';

const AddCommentForm = ({ postId, onCommentAdded }) => {
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    try {
      const newComment = await addComment(postId, content);
      onCommentAdded(newComment);
      setContent('');
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Typography>
        Please <Link to="/login">login</Link> to add a comment.
      </Typography>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField label="Add a comment" multiline rows={3} fullWidth value={content} onChange={(e) => setContent(e.target.value)} variant="outlined" />
      <Button type="submit" variant="contained" sx={{ mt: 1 }}>
        Post Comment
      </Button>
    </Box>
  );
};

export default AddCommentForm;