import React from 'react';
import { Box, SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateIcon from '@mui/icons-material/Create';
import DashboardIcon from '@mui/icons-material/Dashboard';

const CreatePostButton = () => {
    const { isAuthenticated } = useAuth();

    const actions = [
        { icon: <CreateIcon />, name: 'Create Post', to: '/create-post' },
        { icon: <DashboardIcon />, name: 'Dashboard', to: '/dashboard' },
    ];

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Box sx={{ height: 190, transform: 'translateZ(0px)', position: 'fixed', bottom: 16, right: 16 }}>
            <SpeedDial
                ariaLabel="SpeedDial for post actions"
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        component={Link}
                        to={action.to}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
};

export default CreatePostButton;