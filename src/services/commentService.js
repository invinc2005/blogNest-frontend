import api from './api';

export const getCommentsByPostId = async (postId) => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data; 
};

export const addComment = async (postId, content) => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data; 
};

export const updateComment = async (postId, commentId, content) => {
    const response = await api.put(`/posts/${postId}/comments/${commentId}`, { content });
    return response.data; 
};

export const deleteComment = async (postId, commentId) => {
    const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data; 
};