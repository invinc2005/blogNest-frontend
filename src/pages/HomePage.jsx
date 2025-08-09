import React, { useState, useEffect } from 'react';
import { Container, Box, CircularProgress } from '@mui/material';
import TrendingPosts from '../components/TrendingPosts';
import LatestPosts from '../components/LatestPosts';
import EmptyState from '../components/EmptyState'; 
import { getPosts } from '../services/postService'; 

const HomePage = () => {
    const [totalPosts, setTotalPosts] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPosts(0, 1)
            .then(data => {
                setTotalPosts(data.totalElements);
            })
            .catch(err => console.error("Failed to fetch post count", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
    }

    if (totalPosts === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <EmptyState
                    title="Welcome to BlogNest!"
                    message="No posts have been published yet. Why not be the first?"
                    actionText="Create Your First Post"
                    actionLink="/create-post"
                />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <TrendingPosts />
            <LatestPosts />
        </Container>
    );
};

export default HomePage;