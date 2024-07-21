import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
// import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Badge, Box, BoxProps, Button, ButtonProps, Container, Grid, Paper, Stack } from '@mui/material';
import UserAvatar from '../../common/UserAvatar';
import { useOnCommentCreated } from '../../common/useOnCycleCommentCreated';
import HyvorComments from '../../common/HyvorComments';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '../../forms/SignInForm';
interface ExpandMoreProps extends ButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <Button {...other} />;
})(({ theme, expand }) => ({
  // transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  // marginLeft: 'auto',
  // transition: theme.transitions.create('transform', {
  //   duration: theme.transitions.duration.shortest,
  // }),
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

type P = {children?:React.ReactNode} & BoxProps;

const StyledBox = styled((props:P)=>{
  const{children,...others}=props;
 
  return <Box {...others}>
    {children}
  </Box>
        
})(({theme})=>({
  '&':{
    paddingLeft:'1rem',
    borderLeft:`dashed 1px ${theme.palette.primary.light}`,
    position:'relative',
  },
  '&::after':{
    content: `" "`,
    position: 'absolute',
    width: '1rem',
    height: '1rem',
    border: `solid 1px ${theme.palette.primary.light}`,
    borderRadius: '100%',
    backgroundColor: `${theme.palette.primary.light}`,
    top: '-1rem',
    left: '-.5rem',
  }
}))

interface Props extends CardProps {
  cycleId:number;
  title:string;
  description:string;
  subheader?:string;
  image:string;
  alt?:string;
  creatorImage?:string;
  creatorName:string;
  creatorId:string|number;
  creatorPhoto?:string;
} 
export default function MosaicItem(props:Props) {
  const{
    cycleId,
    title,
    subheader,
    description,
    image,
    creatorImage,
    creatorPhoto,
    creatorId,
    creatorName,
    alt
  }=props;

  const [expanded, setExpanded] = React.useState(false);
  const{show}=useModalContext();
  const{dispatch}=useOnCommentCreated(cycleId);
  const{data:session}=useSession();
  const handleExpandClick = () => {
    if(session?.user)
      setExpanded(!expanded);
    else show(<SignInForm/>)
  };
  const img = `https://${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${image}`; 

  return (
    <Card sx={{width:{xs:'auto'}}}>
      <CardHeader
        avatar={
          // <Avatar src={creatorImage} sx={{ bgcolor: red[500] }}>
          // </Avatar>
          <>
            <UserAvatar name={creatorName} userId={creatorId} image={creatorImage} photo={creatorPhoto}/>
          </>
        }
        action={
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            variant="dot"
          >
            <Box sx={{width:25}}>{`${' '}`}</Box>
          </StyledBadge>
        }
        title={title}
        subheader={subheader}
      />
      {/* {
      image
        ? <CardMedia
          component="img"
          height="auto"
          image={image}
          alt={alt}
        />
        : <></>
      } */}
      <CardContent>
        <Grid container spacing={{xs:2}}>
          <Grid item xs={12} sm={5} md={4}>
            <Paper elevation={3} >
              <Link href={`/cycle/${cycleId}`}>
                <img src={img}  width={'100%'} style={{cursor:'pointer'}}/>
              </Link>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={7} md={8}>
            {/* <Box sx={{padding:1,borderLeft:'dashed 1px lightgray'}} dangerouslySetInnerHTML={{__html:description}}/> */}
            <StyledBox dangerouslySetInnerHTML={{__html:description}}/>
          </Grid>
        </Grid>
        
      </CardContent>
      <CardActions>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          Escreva um comentario
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
        <HyvorComments 
              entity='cycle' 
              id={`${cycleId}`} 
              session={session!}  
              OnCommentCreated={(comment)=>dispatch(comment)}
            />
        </CardContent>
      </Collapse>
    </Card>
  );
}
