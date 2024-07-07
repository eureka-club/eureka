import { NextPage } from 'next';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import useTranslation from 'next-translate/useTranslation';
import { Session } from '@/src/types';
import React from 'react';
import MosaicItem, { MosaicItemActions } from '@/src/components/MosaicItem';
import { Grid, IconButton, Rating, Typography } from '@mui/material';
import { CancelRounded, Close, RateReviewSharp, RemoveCircle, Save } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

interface Props{
  session: Session;
  language:string;
}
// interface PropsGeneric<T>{
//   data:T[],
//   render:(value:T)=>JSX.Element
// }

const IndexPage: NextPage<Props> = ({}) => {
  const { t } = useTranslation('common');

  const [value, setValue] = React.useState<number | null>(2);


  return (
    <>
      <SimpleLayout  title={t('browserTitleWelcome')}>
         <Grid container gap={3} paddingTop={3} justifyContent={'center'}>
          <Typography variant="h2" fontSize={'3rem'}>large</Typography>
          <MosaicItem img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2Ff4%2Ff48972d8742cafe72f9b023f48966413d5d9447994a9b18cc02b940fcf02cddd.webp&w=2048&q=75">
              <MosaicItemActions>
                <IconButton color='warning'>
                  <RemoveCircle/>
                </IconButton>
                <IconButton color='secondary'>
                  <CancelRounded/>
                </IconButton>
              </MosaicItemActions>
          </MosaicItem>
          <MosaicItem img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2F66%2F667b35d5688c08a63e8686fae133cfb1f5bc9aa97a86ea269704e7a4664a1813.webp&w=2048&q=75"/>
          <MosaicItem img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2F08%2F08c0ff3443d5a93807dc866a6dcb3b2eb6d97e886adebbbb7602ab4db319084d.jpg&w=2048&q=75">
            <MosaicItemActions>
                <IconButton>
                  <FavoriteIcon />
                </IconButton>
                <IconButton>
                  <ShareIcon />
                </IconButton>
            </MosaicItemActions>
          </MosaicItem>
         </Grid>

         <Grid container gap={3} paddingTop={3} justifyContent={'center'}>
          <Typography variant="h2" fontSize={'2rem'}>medium</Typography>
          <MosaicItem size='medium' img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2Ff4%2Ff48972d8742cafe72f9b023f48966413d5d9447994a9b18cc02b940fcf02cddd.webp&w=2048&q=75"/>
          <MosaicItem size='medium' img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2F66%2F667b35d5688c08a63e8686fae133cfb1f5bc9aa97a86ea269704e7a4664a1813.webp&w=2048&q=75">
            <MosaicItemActions>
              <IconButton color='secondary'>
                <RateReviewSharp/>
              </IconButton>
            </MosaicItemActions>
          </MosaicItem>
          <MosaicItem size='medium' img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2F08%2F08c0ff3443d5a93807dc866a6dcb3b2eb6d97e886adebbbb7602ab4db319084d.jpg&w=2048&q=75"/>
         </Grid>

         <Grid container gap={3} paddingTop={3} justifyContent={'center'}>
          <Typography variant="h2" fontSize={'1rem'}>small</Typography>
          <MosaicItem size='small' img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2Ff4%2Ff48972d8742cafe72f9b023f48966413d5d9447994a9b18cc02b940fcf02cddd.webp&w=2048&q=75">
            <MosaicItemActions>
              <IconButton color="default">
                <Save/>
              </IconButton>
              <IconButton>
                <Close/>
              </IconButton>
            </MosaicItemActions>
          </MosaicItem>
          <MosaicItem size='small' img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2F66%2F667b35d5688c08a63e8686fae133cfb1f5bc9aa97a86ea269704e7a4664a1813.webp&w=2048&q=75">
            <MosaicItemActions>
              <Rating
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              />
            </MosaicItemActions>
          </MosaicItem>
          <MosaicItem size='small' img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2F08%2F08c0ff3443d5a93807dc866a6dcb3b2eb6d97e886adebbbb7602ab4db319084d.jpg&w=2048&q=75"/>
         </Grid>

      </SimpleLayout>
    </>
  );
};

export default IndexPage;
