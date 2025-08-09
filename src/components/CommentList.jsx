import React, { useState, useEffect } from 'react';
import { getCommentsByPostId, deleteComment, updateComment } from '../services/commentService';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, CircularProgress, Divider, IconButton, TextField, Button, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from './ConfirmationDialog';
import { resolveImageUrl } from '../utils/urlUtils';


const formatTimestamp = (dateString, isEdited = false) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-IN', options); 
    return `${formattedDate} ${isEdited ? '(edited)' : ''}`;
};

const CommentList = ({ postId }) => {
    const { user, showSnackbar } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const data = await getCommentsByPostId(postId);
            setComments(data);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);
    
    const handleDeleteClick = (commentId) => {
        setCommentToDelete(commentId);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setCommentToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteComment(postId, commentToDelete);
            showSnackbar("Comment deleted successfully!", "success");
            setComments(prevComments => prevComments.filter(comment => comment.id !== commentToDelete));
        } catch (error) {
            console.error("Failed to delete comment", error);
            showSnackbar("You are not authorized to delete this comment.", "error");
        } finally {
            handleDialogClose();
        }
    };
    const handleEditClick = (comment) => {
        setEditingCommentId(comment.id);
        setEditText(comment.content);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditText('');
    };

    const handleSaveEdit = async (commentId) => {
        try {
            const updatedComment = await updateComment(postId, commentId, editText);
            setEditingCommentId(null);
            showSnackbar("Comment updated successfully!", "success");
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === commentId ? updatedComment : comment
                )
            );
        } catch (error) {
            console.error("Failed to update comment", error);
            showSnackbar("Failed to update comment.", "error");
        }
    };

    if (loading) return <CircularProgress />;
    if (comments.length === 0) return <Typography>No comments yet.</Typography>;

    return (
        <>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {comments.map((comment, index) => {
                    const isOwner = user && user.email === comment.authorEmail;
                    const isEditing = editingCommentId === comment.id;
                    const timestamp = formatTimestamp(
                        comment.edited ? comment.updatedAt : comment.createdAt,
                        comment.edited
                    );
                    return (
                        <React.Fragment key={comment.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
    <Avatar src={resolveImageUrl(comment.authorProfilePicture)}>
        {comment.authorUsername.charAt(0).toUpperCase()}
    </Avatar>
</ListItemAvatar>
                                
                                {isEditing ? (
                                    <Box sx={{ width: '100%' }}>
                                        <TextField fullWidth multiline variant="outlined" value={editText} onChange={(e) => setEditText(e.target.value)} />
                                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                            <Button size="small" variant="contained" onClick={() => handleSaveEdit(comment.id)}>Save</Button>
                                            <Button size="small" variant="text" onClick={handleCancelEdit}>Cancel</Button>
                                        </Stack>
                                    </Box>
                                ) : ( 
                                    <>
                                        <ListItemText
                                            secondaryTypographyProps={{ component: 'div' }} 
                                            primary={<Typography component="span" variant="body1" sx={{ fontWeight: 'bold' }}>{comment.authorUsername}</Typography>}
                                            secondary={
                                                <>
                                                    <Typography variant="body2" color="text.primary" component="span">{comment.content}</Typography>
                                                    <Typography variant="caption" color="text.secondary" component="div">{timestamp}</Typography>
                                                </>
                                            }
                                        />
                                        {isOwner && (
                                            <Box>
                                                <IconButton onClick={() => handleEditClick(comment)} size="small">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteClick(comment.id)} size="small">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </>
                                )}
                            </ListItem>
                            {index < comments.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                    );
                })}
            </List>
            <ConfirmationDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                onConfirm={handleConfirmDelete}
                title="Delete Comment?"
                message="Are you sure you want to permanently delete this comment?"
            />
        </>
    );
};

export default CommentList;