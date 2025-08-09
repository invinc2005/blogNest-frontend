import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PostAddIcon from '@mui/icons-material/PostAdd';

const EmptyState = ({ title, message, actionText, actionLink }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                minHeight: '40vh',
            }}
        >
            <PostAddIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
                {title}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                {message}
            </Typography>
            {actionText && actionLink && (
                <Button
                    variant="contained"
                    component={Link}
                    to={actionLink}
                >
                    {actionText}
                </Button>
            )}
        </Box>
    );
};

export default EmptyState;