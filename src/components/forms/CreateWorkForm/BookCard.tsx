import React, { useCallback, useState } from "react";
import { GoogleBooksProps } from '@/types/work';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const fallbakImgURL = `https://${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/Image-not-found.webp`

interface Props {
    book: GoogleBooksProps,
    callback: Function;
}

const BookCard: React.FC<Props> = (Props) => {

    const { id, volumeInfo, saleInfo } = Props.book;
    const { callback } = Props;

    const handleSelect = useCallback((work: GoogleBooksProps) => {
        callback(work);
    }, [callback]);

    return (
        <>
            <section className='p-2 w-100 d-flex d-lg-none '>
                <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', minWidth: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', px: 5, mt: 4 }}>
                        <CardMedia className="cursor-pointer" onClick={() => handleSelect(Props.book)}
                            component="img"
                            sx={{ width: 200 }}
                            image={(volumeInfo.imageLinks) ? volumeInfo.imageLinks.thumbnail : fallbakImgURL}
                            alt="Live from space album cover"
                        />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            {volumeInfo.title !== undefined &&
                                <Typography component="div" variant="h6">
                                    {(volumeInfo.title.length > 25) ? `${volumeInfo.title.slice(0, 30)}...` : volumeInfo.title}
                                </Typography>}
                            {volumeInfo.authors !== undefined &&
                                volumeInfo.authors.map((author) => {
                                    return <Typography key={`${author}_${id}`} variant="subtitle1" color="text.secondary" component="div">
                                        {author}
                                    </Typography>;
                                })}

                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {volumeInfo.publishedDate} - ({volumeInfo.language})
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {volumeInfo.publisher}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {(volumeInfo.description) ? (volumeInfo.description.length > 150) ? `${volumeInfo.description.slice(0, 150)}...` : volumeInfo.description : ""}
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>
            </section>
            <section className='p-2 w-50 d-none d-lg-flex'>
                <Card variant="outlined" sx={{ display: 'flex', height: 250, minWidth: '100%' }}>
                    <CardMedia className="cursor-pointer" onClick={() => handleSelect(Props.book)}
                        component="img"
                        sx={{ width: 175 }}
                        image={(volumeInfo.imageLinks) ? volumeInfo.imageLinks.thumbnail : fallbakImgURL}
                        alt="Live from space album cover"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            {volumeInfo.title !== undefined &&

                                <Typography component="div" variant="h6">
                                    {(volumeInfo.title.length > 25) ? `${volumeInfo.title.slice(0, 30)}...` : volumeInfo.title}
                                </Typography>}
                            {volumeInfo.authors !== undefined &&
                                volumeInfo.authors.map((author) => {
                                    return <Typography key={`${author}_${id}`} variant="subtitle1" color="text.secondary" component="div">
                                        {author}
                                    </Typography>;
                                })}

                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {volumeInfo.publishedDate} - ({volumeInfo.language})
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {volumeInfo.publisher}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {(volumeInfo.description) ? (volumeInfo.description.length > 150) ? `${volumeInfo.description.slice(0, 150)}...` : volumeInfo.description : ""}
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>
            </section>
        </>

    );
};

export default BookCard;