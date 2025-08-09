import React, { useState, useEffect } from 'react';
import { Grid, Pagination, Typography, Box } from '@mui/material';
import { getPosts } from '../services/postService';
import PostCard from './PostCard';
import PostCardSkeleton from './PostCardSkeleton'; 
import AccessTimeIcon from '@mui/icons-material/AccessTime'; 


const LatestPosts = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setTimeout(async () => {
        try {
          const data = await getPosts(page - 1, 6);
          setPosts(data.content);
          setTotalPages(data.totalPages);
        } catch (error) {
          console.error("Failed to fetch posts", error);
        } finally {
          setLoading(false);
        }
      }, 500); // 0.5 second delay
    };
    fetchPosts();
  }, [page]);

  return (
    <Box sx={{ mt: 6 }}>
       <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon sx={{ mr: 1, fontSize: 'inherit' }} /> 
                Latest Posts
            </Typography>
      <Grid container spacing={4}>
        {loading ? (
          Array.from(new Array(6)).map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <PostCardSkeleton />
            </Grid>
          ))
        ) : (
          posts.map((post) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
              <PostCard post={post} />
            </Grid>
          ))
        )}
      </Grid>
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            variant="outlined"
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default LatestPosts;