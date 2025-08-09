import React, { useState, useEffect } from 'react';
import { getMyPosts } from '../../services/userService';
import { Grid, CircularProgress, Typography, Box, Button } from '@mui/material';
import PostCard from '../PostCard';
import PostCardSkeleton from '../PostCardSkeleton'; 
import { Link } from 'react-router-dom';

const MyPostsList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 500));
                const data = await getMyPosts();
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch user posts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const numberOfSkeletons = 3; 

    if (!loading && posts.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                    You haven't created any posts yet.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Start sharing your thoughts with the world!
                </Typography>
                <Button variant="contained" component={Link} to="/create-post">
                    Create Your First Post
                </Button>
            </Box>
        );
    }

    return (
        <Grid container spacing={4}>
            {loading ? (
                Array.from(new Array(numberOfSkeletons)).map((_, index) => (
                    <Grid      size = {{xs : 12,md : 4,sm:6}} key={index}>
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

export default MyPostsList;