import React, { useState, useEffect } from 'react';
import { getNotifications } from '../../services/userService';
import { List, ListItem, ListItemText, ListItemIcon, CircularProgress, Typography, Box, Paper } from '@mui/material';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (notifications.length === 0) {
    return <Typography>You have no new notifications.</Typography>;
  }

  return (
    <Paper>
      <List>
        {notifications.map((notification) => (
          <ListItem key={notification.id}>
            <ListItemIcon>
              <CircleNotificationsIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={notification.message}
              secondary={notification.createdAt}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default NotificationsList;