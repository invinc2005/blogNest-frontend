export const resolveImageUrl = (path) => {
  if (!path) {
    return undefined;
  }
  
  if (path.startsWith('http')) {
    return path;
  }

  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return `${BACKEND_URL}${path}`;
};