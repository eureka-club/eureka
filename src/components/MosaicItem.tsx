import * as React from 'react';
import Card, { CardProps } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { v4 } from 'uuid';

interface Props extends CardProps{
    img:string;
    size?:'small'|'medium'|'large'
}
export const  MosaicItem:React.FC<Props> = ({img,size:s='large',...others})=>{
    let {width,height} = {width:300, height:400};
    let miid = v4();
    switch(s){
        case 'small':
            width = width * .75;
            height = height * .75;
            break;
        case 'medium':
            width = width * .85;
            height = height * .85;
            break;
        default:
            width = width * 1;
            height = height * 1;
            break;
    }
    
  return (
    <Card sx={{width,height}} id={miid} {...others}>
      <CardActionArea>
        <style jsx global>{`
            #${miid} .MuiCardActionArea-root{
                width:${width}px!important;
                height:calc(${height}px - 50px)!important;
                /*background:url(${img});
                backdrop-filter: blur(10px);*/
            }
        `}</style>
        <CardMedia
            className='mosaicItemImg'
            component="img"
            image={img}
            alt="????"
            sx={{
                width,
                height:`calc(${height}px - 50px)`,
                objectFit:'inherit'
            }}
        />
        {/* <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Lizard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent> */}
      </CardActionArea>
      <CardActions>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
export default MosaicItem;