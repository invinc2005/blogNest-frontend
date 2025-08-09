import React from 'react';
import { Box, SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PostActionsSpeedDial = ({ postId, onDeleteClick }) => {
    const navigate = useNavigate();

    const actions = [
        { icon: <EditIcon />, name: 'Edit', handleClick: () => navigate(`/edit-post/${postId}`) },
        { icon: <DeleteIcon />, name: 'Delete', handleClick: onDeleteClick },
    ];

    return (
        <Box sx={{ position: 'fixed', bottom: 32, right: 32 }}>
            <SpeedDial
                ariaLabel="Post Actions"
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={action.handleClick}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
};

export default PostActionsSpeedDial;