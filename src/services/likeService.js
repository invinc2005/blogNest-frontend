import api from './api';

export const likePost = (postId) => {
  return api.post(`/posts/${postId}/like`);
};

export const unlikePost = (postId) => {
  return api.delete(`/posts/${postId}/like`);
};