import React, { useCallback, useState } from "react";
import { TMDBVideosProps } from '@/types/work';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const fallbakImgURL = `https://${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/Image-not-found.webp`

interface Props {
    video: TMDBVideosProps
    callback: Function;
}

const VideoCard: React.FC<Props> = (Props) => {

    const video = Props.video;
    const { callback } = Props;

    const handleSelect = useCallback((work: TMDBVideosProps) => {
        callback(work);
    }, [callback]);

    return (
        <>
            <section className='p-2 w-100 d-flex d-lg-none '>
                <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', minWidth: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', px: 5, mt: 4 }}>
                        <CardMedia className="cursor-pointer" onClick={() => handleSelect(video)}
                            component="img"
                            sx={{ width: 200 }}
                            image={(video.poster_path) ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${video.poster_path}` : fallbakImgURL}
                            alt="Live from space album cover"
                        />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h6">
                                {(video.title.length > 25) ? `${video.title.slice(0, 30)}...` : video.title}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {video.release_date} - ({video.original_language})

                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {(video.overview.length > 250) ? `${video.overview.slice(0, 250)}...` : video.overview}
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>
            </section>
            <section className='p-2 w-50 d-none d-lg-flex'>
                <Card variant="outlined" sx={{ display: 'flex', height: 250, minWidth: '100%' }}>
                    <CardMedia className="cursor-pointer" onClick={() => handleSelect(video)}
                        component="img"
                        sx={{ width: 200 }}
                        image={(video.poster_path) ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${video.poster_path}` : fallbakImgURL}
                        alt="Live from space album cover"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h6">
                                {(video.title.length > 25) ? `${video.title.slice(0, 30)}...` : video.title}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {video.release_date} - ({video.original_language})

                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {(video.overview.length > 250) ? `${video.overview.slice(0, 250)}...` : video.overview}
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>
            </section>
        </>

    );
};

export default VideoCard;