import { NextPage } from 'next';
import {GetServerSideProps} from 'next';
import Head from "next/head";
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { Session } from '@/src/types';
import { dehydrate,QueryClient } from 'react-query';
import {getbackOfficeData} from '@/src/useBackOffice'
import { getFeaturedEurekas } from '@/src/useFeaturedEurekas';
import {getInterestedCycles} from '@/src/useInterestedCycles';
import { featuredWorksWhere, getFeaturedWorks } from '@/src/useFeaturedWorks';
import { getHyvorComments } from '@/src/useHyvorComments';
import { getFeaturedUsers } from '@/src/useFeaturedUsers';
import HomeSingIn from '@/src/components/HomeSingIn';
import { UserSumary } from '@/src/types/UserSumary';
import { getUserSumary } from '@/src/useUserSumary';
import React from 'react';
import { getNotifications } from '@/src/useNotifications';
import MosaicItem from '@/src/components/MosaicItem';
import { MosaicsGrid } from '@/src/components/MosaicsGrid';
import { Grid, Typography } from '@mui/material';

interface Props{
  session: Session;
  language:string;
}
// interface PropsGeneric<T>{
//   data:T[],
//   render:(value:T)=>JSX.Element
// }

const IndexPage: NextPage<Props> = ({session}) => {
  const { t } = useTranslation('common');

  return (
    <>
     
     
      <SimpleLayout  title={t('browserTitleWelcome')}>
         <Grid container gap={3} paddingTop={3} justifyContent={'center'}>
          <Typography variant="h2" fontSize={'3rem'}>large</Typography>
          <MosaicItem img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2Ff4%2Ff48972d8742cafe72f9b023f48966413d5d9447994a9b18cc02b940fcf02cddd.webp&w=2048&q=75"/>
          <MosaicItem img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2F66%2F667b35d5688c08a63e8686fae133cfb1f5bc9aa97a86ea269704e7a4664a1813.webp&w=2048&q=75"/>
          <MosaicItem img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2F08%2F08c0ff3443d5a93807dc866a6dcb3b2eb6d97e886adebbbb7602ab4db319084d.jpg&w=2048&q=75"/>
          {/* <MosaicItem img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2F26%2F27a439fef4d5032868dfe13bfad17d6ced4c499ffa9707974ee6178332805099.png&w=2048&q=75"/>
          <MosaicItem img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2Fe1%2Fe1f0708fbcdd911ff4abfbbefcea348d83f8644cb68806d103e76fd730757c3f.webp&w=2048&q=75"/> */}
         </Grid>

         <Grid container gap={3} paddingTop={3} justifyContent={'center'}>
          <Typography variant="h2" fontSize={'2rem'}>medium</Typography>
          <MosaicItem size='medium' img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2Ff4%2Ff48972d8742cafe72f9b023f48966413d5d9447994a9b18cc02b940fcf02cddd.webp&w=2048&q=75"/>
          <MosaicItem size='medium' img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2F66%2F667b35d5688c08a63e8686fae133cfb1f5bc9aa97a86ea269704e7a4664a1813.webp&w=2048&q=75"/>
          <MosaicItem size='medium' img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2F08%2F08c0ff3443d5a93807dc866a6dcb3b2eb6d97e886adebbbb7602ab4db319084d.jpg&w=2048&q=75"/>
          {/* <MosaicItem size='medium' img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2F26%2F27a439fef4d5032868dfe13bfad17d6ced4c499ffa9707974ee6178332805099.png&w=2048&q=75"/>
          <MosaicItem size='medium' img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2Fe1%2Fe1f0708fbcdd911ff4abfbbefcea348d83f8644cb68806d103e76fd730757c3f.webp&w=2048&q=75"/> */}
         </Grid>

         <Grid container gap={3} paddingTop={3} justifyContent={'center'}>
          <Typography variant="h2" fontSize={'1rem'}>small</Typography>
          <MosaicItem size='small' img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2Ff4%2Ff48972d8742cafe72f9b023f48966413d5d9447994a9b18cc02b940fcf02cddd.webp&w=2048&q=75"/>
          <MosaicItem size='small' img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2F66%2F667b35d5688c08a63e8686fae133cfb1f5bc9aa97a86ea269704e7a4664a1813.webp&w=2048&q=75"/>
          <MosaicItem size='small' img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2F08%2F08c0ff3443d5a93807dc866a6dcb3b2eb6d97e886adebbbb7602ab4db319084d.jpg&w=2048&q=75"/>
          {/* <MosaicItem size='small' img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2F26%2F27a439fef4d5032868dfe13bfad17d6ced4c499ffa9707974ee6178332805099.png&w=2048&q=75"/>
          <MosaicItem size='small' img="http://localhost:3000/_next/image?url=https%3A%2F%2Feurekastagingassets.azureedge.net%2Fpublic-assets%2Fe1%2Fe1f0708fbcdd911ff4abfbbefcea348d83f8644cb68806d103e76fd730757c3f.webp&w=2048&q=75"/> */}
         </Grid>
      </SimpleLayout>
    </>
  );
};

export default IndexPage;
