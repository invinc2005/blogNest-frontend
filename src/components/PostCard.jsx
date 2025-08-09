import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, CardActions, Button, IconButton, Box, Avatar, CardMedia, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import AutoStoriesSharpIcon from '@mui/icons-material/AutoStoriesSharp';
import MessageSharpIcon from '@mui/icons-material/MessageSharp';
import { useAuth } from '../context/AuthContext';
import { resolveImageUrl } from '../utils/urlUtils';

const PostCard = ({ post }) => {
    const { showSnackbar } = useAuth();
    const [imageLoading, setImageLoading] = useState(true);

    if (!post) {
        return null;
    }

    const handleShare = () => {
        const url = `${window.location.origin}/posts/${post.id}`;
        navigator.clipboard.writeText(url);
        showSnackbar("Link copied to clipboard!", "info");
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    const subheaderText = `${formatDate(post.isEdited ? post.updatedAt : post.createdAt)} ${post.isEdited ? '(edited)' : ''}`;
    const snippet = post.content?.length > 100 ? `${post.content.substring(0, 100)}...` : post.content;
    const authorName = post.authorUsername || "Unknown Author";

    return (
        <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            border: '1px solid',
            borderColor: 'divider'
        }}>
            <CardHeader
                avatar={
                    <Avatar 
                        src={resolveImageUrl(post.authorProfilePicture)}
                        sx={{ bgcolor: 'secondary.main' }}
                    >
                        {authorName.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={authorName}
                subheader={subheaderText}
            />
            {post.imageUrl && (
                <Box sx={{ overflow: 'hidden' }}>
                    {imageLoading && <Skeleton sx={{ height: 200 }} animation="wave" variant="rectangular" />}
                    <CardMedia
                        component="img"
                        height="200"
                        image={resolveImageUrl(post.imageUrl)}
                        alt={post.title}
                        onLoad={() => setImageLoading(false)}
                        sx={{
                            display: imageLoading ? 'none' : 'block',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': { transform: 'scale(1.1)' },
                        }}
                    />
                </Box>
            )}
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">{post.title}</Typography>
                <Typography variant="body2" color="text.secondary">{snippet}</Typography>
            </CardContent>
            <CardActions sx={{ 
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                pt: 0  }}>
                <Button size="small" component={Link} to={`/posts/${post.id}`} startIcon={<AutoStoriesSharpIcon />}>
                    Read More
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FavoriteIcon sx={{ color: 'action.disabled', mr: 0.5, fontSize: '1rem' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1.5 }}>
                        {post.likeCount}
                    </Typography>
                    
                    <MessageSharpIcon sx={{ color: 'action.disabled', mr: 0.5, fontSize: '1rem' }} />
                    <Typography variant="body2" color="text.secondary">
                        {post.commentCount}
                    </Typography>
                    
                    <IconButton aria-label="share" onClick={handleShare} sx={{ ml: 1 }} size="small">
                        <ShareIcon />
                    </IconButton>
                </Box>
            </CardActions>
        </Card>
    );
};

export default PostCard;