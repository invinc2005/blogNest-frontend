import React, { useState, useEffect } from 'react';
import { getMyPostStats } from '../../services/userService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';

const PostChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const statsData = await getMyPostStats();
                // Reverse the data so the oldest month is on the left
                setData(statsData.reverse());
            } catch (error) {
                console.error("Failed to fetch post stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Your Monthly Posts
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="postCount" fill="#8884d8" name="Posts" />
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default PostChart;