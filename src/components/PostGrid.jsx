import React from 'react';
import { Grid, Pagination, Box } from '@mui/material';
import PostCard from './PostCard';

const PostGrid = ({ posts, totalPages, page, onPageChange, paginationColor = 'primary' }) => {
    return (
        <>
            <Grid container spacing={4}>
                {posts.map((post) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                        <PostCard post={post} />
                    </Grid>
                ))}
            </Grid>
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={onPageChange}
                        variant="outlined"
                        color={paginationColor}
                    />
                </Box>
            )}
        </>
    );
};

export default PostGrid;