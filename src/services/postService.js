import api from './api';


export const getPosts = async (page = 0, size = 6) => {
  const response = await api.get(`/posts?page=${page}&size=${size}&sort=createdAt,desc`);
  return response.data;
};

export const getPostById = async (postId) => {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
};

export const createPost = async (postData) => {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);

    if (postData.imageFile) {
        formData.append('imageFile', postData.imageFile);
    } else if (postData.imageUrl) {
        formData.append('imageUrl', postData.imageUrl);
    }

    const response = await api.post('/posts', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
export const updatePost = async (postId, postData) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('content', postData.content);

  if (postData.imageFile) {
    formData.append('imageFile', postData.imageFile);
  } else {
    formData.append('imageUrl', postData.imageUrl || '');
  }

  const response = await api.put(`/posts/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};


export const deletePost = async (postId) => {
  return await api.delete(`/posts/${postId}`);
};


export const getTrendingPosts = async (page = 0, size = 5) => {
    const response = await api.get(`/posts/trending?page=${page}&size=${size}`);
    return response.data;
};