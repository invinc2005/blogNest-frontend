// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Container, Grid } from '@mui/material';
import MyPostsList from '../components/dashboard/MyPostsList';
import LikedPostsList from '../components/dashboard/LikedPostsList';
import ProfileSidebar from '../components/dashboard/ProfileSidebar';
import PostChart from '../components/dashboard/PostChart';
import { useAuth } from '../context/AuthContext';
import { getMyPostStats } from '../services/userService';
import ProfileSettingsDialog from '../components/dashboard/ProfileSettingsDialog';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
};

const DashboardPage = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [postCount, setPostCount] = useState(0);
    const { user } = useAuth();

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const handleOpenSettingsModal = () => {
        console.log("Settings modal is being opened.");
        setIsSettingsModalOpen(true);
    };

    const handleCloseSettingsModal = () => {
        setIsSettingsModalOpen(false);
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const statsData = await getMyPostStats();
                const totalPosts = statsData.reduce((sum, month) => sum + month.postCount, 0);
                setPostCount(totalPosts);
            } catch (error) {
                console.error("Failed to fetch post stats for Dashboard", error);
            }
        };
        fetchStats();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Container sx={{ my: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Dashboard
            </Typography>
            <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
                <Grid size = {{xs : 12 , md :4}} >
                    <ProfileSidebar
                        postCount={postCount}
                        onOpenSettings={handleOpenSettingsModal}
                    />
                </Grid>
                <Grid size = {{xs : 12 , md :8}}>
                    <PostChart />
                </Grid>
                <Grid  size = {{xs : 12 }} sx={{ mt: 4 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="dashboard tabs">
                            <Tab label="My Posts" />
                            <Tab label="Liked Posts" />
                        </Tabs>
                    </Box>
                    <TabPanel value={tabIndex} index={0}>
                        <MyPostsList />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1}>
                        <LikedPostsList />
                    </TabPanel>
                </Grid>
            </Grid>
            <ProfileSettingsDialog
                open={isSettingsModalOpen}
                onClose={handleCloseSettingsModal}
            />
        </Container>
    );
};

export default DashboardPage;