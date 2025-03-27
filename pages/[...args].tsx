import {NextPage} from 'next'
import React from 'react'
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import useTranslation from 'next-translate/useTranslation';
import { Alert, Box } from '@mui/material';

 const Error:NextPage = ()=>{
     const {t} = useTranslation('common')
     return <SimpleLayout title={t('Bad Request')}>
        <Box sx={{display:'flex',height:'70vh',flexDirection:'column'}}>
            <Alert color='error'>{t('Bad Request')}</Alert>
            <Box sx={{flex:1}}/>
        </Box>
     </SimpleLayout>
 }
 export default Error;