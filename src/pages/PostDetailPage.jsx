import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById, deletePost } from '../services/postService';
import { likePost, unlikePost } from '../services/likeService';
import { useAuth } from '../context/AuthContext';
import { 
    Container, 
    Box, 
    Typography, 
    CircularProgress, 
    Alert, 
    Paper, 
    IconButton, 
    Avatar,
    Stack, 
    Divider,
    Tooltip,
    Skeleton 
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import PostActionsSpeedDial from '../components/PostActionsSpeedDial';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { resolveImageUrl } from '../utils/urlUtils';
import CommentList from '../components/CommentList';
import AddCommentForm from '../components/AddCommentForm';
import AvatarGroup from '@mui/material/AvatarGroup';
function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}
const PostDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated, likedPostIds, handleLike, handleUnlike, showSnackbar } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [commentUpdateTrigger, setCommentUpdateTrigger] = useState(0);
    const [imageLoading, setImageLoading] = useState(true); 
        console.log("Data being rendered on PostDetailPage:", post);

    useEffect(() => {
        setImageLoading(true);
        const fetchPost = async () => {
            try {
                setLoading(true);
                const data = await getPostById(id);
                setPost(data);
            } catch (err) {
                setError('Could not load post.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    const handleLikeClick = async () => {
        if (!isAuthenticated) {
            showSnackbar("You must be logged in to like a post.", "warning");
            return;
        }
        const isCurrentlyLiked = likedPostIds.has(post.id);
        try {
            if (isCurrentlyLiked) {
                await unlikePost(post.id);
                handleUnlike(post.id);
                setPost(prevPost => ({ ...prevPost, likeCount: prevPost.likeCount - 1 }));
            } else {
                await likePost(post.id);
                handleLike(post.id);
                setPost(prevPost => ({ ...prevPost, likeCount: prevPost.likeCount + 1 }));
            }
        } catch (error) {
            console.error("Error updating like:", error);
            showSnackbar("Failed to update like.", "error");
        }
    };

    const handleShareClick = () => {
        const url = `${window.location.origin}/posts/${id}`;
        navigator.clipboard.writeText(url);
        showSnackbar("Link copied to clipboard!", "info");
    };

    const handleDeleteClick = () => setDialogOpen(true);

    const handleConfirmDelete = async () => {
        try {
            await deletePost(id);
            showSnackbar("Post deleted successfully!", "success");
            navigate('/');
        } catch (error) {
            setError("You are not authorized to delete this post.");
        } finally {
            setDialogOpen(false);
        }
    };
    
    const isOwner = user && post && user.email === post.authorEmail;

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
    if (error) return <Container maxWidth="md" sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
    if (!post) return null;
    
    const isLiked = likedPostIds.has(post.id);

    return (
        <>
            <Container maxWidth="md" sx={{ my: 4 }}>
                <Paper elevation={3} sx={{ overflow: 'hidden' }}>
                    {post.imageUrl && (
                        <Box sx={{ width: '100%', height: { xs: 200, md: 350 } }}>
                            {imageLoading && (
                                <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
                            )}
                            <img
                                src={resolveImageUrl(post.imageUrl)}
                                alt={post.title}
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    display: imageLoading ? 'none' : 'block'
                                }}
                                onLoad={() => setImageLoading(false)}
                            />
                        </Box>
                    )}

                    <Box sx={{ p: { xs: 2, md: 4 } }}>
                        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {post.title}
                        </Typography>
                        <Stack 
                            direction="row" 
                            alignItems="center" 
                            spacing={2} 
                            sx={{ my: 3, color: 'text.secondary' }}
                        >
                            <Avatar sx={{ bgcolor: stringToColor(post.authorUsername) }} src={resolveImageUrl(post.authorProfilePicture)}>
                                {post.authorUsername.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                    {post.authorUsername}
                                </Typography>
                                <Typography variant="caption">
                                    {`Posted on ${formatDate(post.createdAt)} ${post.isEdited ? '(edited)' : ''}`}
                                </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1 }} />
                            {post.likers && post.likers.length > 0 && (
                                <Tooltip title="Liked by">
                                    <AvatarGroup total={post.likeCount} max={4} sx={{ mr: 1 }}>
                                        {post.likers.map(liker => (
                                            <Avatar 
                                                key={liker.displayName}
                                                alt={liker.displayName} 
                                                src={resolveImageUrl(liker.profilePictureUrl)}
                                                sx={{ bgcolor: stringToColor(liker.displayName) }}
                                            >
                                                {liker.displayName.charAt(0).toUpperCase()}
                                            </Avatar>
                                        ))}
                                    </AvatarGroup>
                                </Tooltip>
                            )}
                            {isAuthenticated && (
                                <Tooltip title="Like post">
                                    <IconButton onClick={handleLikeClick}>
                                        {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Typography variant="body1">{post.likeCount}</Typography>
                            <Tooltip title="Share post">
                                <IconButton onClick={handleShareClick}>
                                    <ShareIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        <Divider />
                        <Typography variant="body1" sx={{ mt: 3, fontSize: '1.1rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                            {post.content}
                        </Typography>
                    </Box>
                </Paper>

                <Box sx={{ mt: 5 }}>
                    <Typography variant="h5" gutterBottom>Comments</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <AddCommentForm postId={id} onCommentAdded={() => setCommentUpdateTrigger(p => p + 1)} />
                    <CommentList postId={id} key={commentUpdateTrigger} />
                </Box>
            </Container>

            {isOwner && <PostActionsSpeedDial postId={id} onDeleteClick={handleDeleteClick} />}
            <ConfirmationDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Post?"
                message="Are you sure you want to permanently delete this post?"
            />
        </>
    );
};

export default PostDetailPage;