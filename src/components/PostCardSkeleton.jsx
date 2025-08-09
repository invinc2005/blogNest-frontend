import React from 'react';
import { Card, CardHeader, CardContent, Skeleton } from '@mui/material';

const PostCardSkeleton = () => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader
                avatar={
                    <Skeleton animation="wave" variant="circular" width={40} height={40} />
                }
                title={
                    <Skeleton
                        animation="wave"
                        height={10}
                        width="80%"
                        style={{ marginBottom: 6 }}
                    />
                }
                subheader={<Skeleton animation="wave" height={10} width="40%" />}
            />
            <CardContent>
                <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={10} width="80%" />
                <Skeleton animation="wave" height={10} width="80%" />
                <Skeleton animation="wave" height={10} width="80%" />
                <Skeleton animation="wave" height={10} width="80%" />
            </CardContent>
        </Card>
    );
};

export default PostCardSkeleton;