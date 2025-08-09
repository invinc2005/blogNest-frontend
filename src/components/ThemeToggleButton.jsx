import React from 'react';
import { useAuth } from '../context/AuthContext';
import { IconButton, Tooltip } from '@mui/material';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import LightModeTwoToneIcon from '@mui/icons-material/LightModeTwoTone';

const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useAuth();

    return (
        <Tooltip title="Toggle theme">
            <IconButton onClick={toggleTheme} color="inherit">
                {theme.palette.mode === 'dark' ? <LightModeTwoToneIcon /> : <DarkModeTwoToneIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggleButton;