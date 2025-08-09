  import React, { useState, useEffect } from 'react';
  import { getTrendingPosts } from '../services/postService';
  import { Box, Typography, Grid, CircularProgress, Pagination } from '@mui/material';
  import PostCard from './PostCard';
  import PostCardSkeleton from './PostCardSkeleton'; 
  import TrendingUpSharpIcon from '@mui/icons-material/TrendingUpSharp';

  const TrendingPosts = ({ onLikeUpdate }) => {
      const [posts, setPosts] = useState([]);
      const [page, setPage] = useState(1);
      const [totalPages, setTotalPages] = useState(0);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
          const fetchTrending = async () => {
              setLoading(true);
              try {
                  await new Promise(resolve => setTimeout(resolve, 500)); 
                  const data = await getTrendingPosts(page - 1, 3); 
                  setPosts(data.content);
                  setTotalPages(data.totalPages);
              } catch (error) {
                  console.error("Failed to fetch trending posts", error);
              } finally {
                  setLoading(false);
              }
          };
          fetchTrending();
      }, [page]);

      if (posts.length === 0 && !loading) {
          return null; 
      }

      return (
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpSharpIcon sx={{ mr: 1, fontSize: 'inherit' }} /> 
                  Trending Posts 
              </Typography>
        <Grid container spacing={4}>
          {loading ? (
            Array.from(new Array(3)).map((item, index) => (
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

  export default TrendingPosts;