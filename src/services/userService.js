import api from './api';

export const getMyPosts = async () => {
    const response = await api.get('/posts/me');
    return response.data;
};

export const getLikedPosts = async () => {
  const response = await api.get('/users/me/liked-posts');
  return response.data;
};

export const getNotifications = async () => {
    const response = await api.get('/notifications/me');
    return response.data;
};


export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/users/me/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getMe = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

export const getMyPostStats = async () => {
    const response = await api.get('/users/me/post-stats');
    return response.data;
};
export const updateUsername = async (newUsername) => {
    console.log("Sending PUT request to update username:", newUsername); 
    
    const response = await api.put('/users/me/username', { displayName: newUsername });
    return response.data;
};

export const updateUser = async (updatedData) => {
    const response = await api.put('/users/me', updatedData);
    return response.data;
};
export const markNotificationAsRead = (notificationId) => {
    return api.post(`/notifications/${notificationId}/read`);
};