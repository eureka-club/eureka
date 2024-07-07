import * as React from 'react';
import Card, { CardProps, CardTypeMap } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, IconButton, IconButtonOwnProps, IconButtonProps } from '@mui/material';
import { v4 } from 'uuid';


interface MosaicItemActionsProps{
    children?:React.ReactNode
}
export const  MosaicItemActions:React.FC<MosaicItemActionsProps>=({children})=>{
    return <CardActions>
    {children??<></>}
    </CardActions>;
}
interface Props extends CardProps{
    img:string;
    size?:'small'|'medium'|'large';
    alt?:string;
    children?:React.ReactNode;
}
export const  MosaicItem:React.FC<Props> = ({img,size:s='large',alt,children,...others})=>{
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
  const footerHeight=children?'50px':'0px';

  return (
    <Card sx={{width,height}} id={miid} {...others}>
      <CardActionArea>
        <style jsx global>{`
            #${miid} .MuiCardActionArea-root{
                width:${width}px!important;
                height:calc(${height}px - ${footerHeight})!important;
            }
        `}</style>
        <CardMedia
            className='mosaicItemImg'
            component="img"
            image={img}
            alt={alt??'-'}
            sx={{
                width,
                height:`calc(${height}px - ${footerHeight})`,
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
      {children??<></>}
    </Card>
  );
}
export default MosaicItem;