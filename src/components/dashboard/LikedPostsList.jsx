import React, { useState, useEffect } from 'react';
import { getLikedPosts } from '../../services/userService';
import { Grid, CircularProgress, Typography, Box, Button } from '@mui/material';
import PostCard from '../PostCard';
import PostCardSkeleton from '../PostCardSkeleton'; 
import { Link } from 'react-router-dom';

const LikedPostsList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikedPosts = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 500));
                const data = await getLikedPosts();
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch liked posts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLikedPosts();
    }, []);
    
    const numberOfSkeletons = 3; 

    if (!loading && posts.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                    You haven't liked any posts yet.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Explore posts and show some love!
                </Typography>
                <Button variant="contained" component={Link} to="/">
                    Explore Posts
                </Button>
            </Box>
        );
    }

    return (
        <Grid container spacing={4}>
            {loading ? (
                Array.from(new Array(numberOfSkeletons)).map((_, index) => (
                    <Grid size = {{xs : 12,md : 4,sm:6}} key={index}>
                        <PostCardSkeleton />
                    </Grid>
                ))
            ) : (
                posts.map((post) => (
                    <Grid  key={post.id} size = {{xs : 12,md : 4,sm:6}}>
                        <PostCard post={post} />
                    </Grid>
                ))
            )}
        </Grid>
    );
};

export default LikedPostsList;