import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

export default function SearchInput() {
    const { t } = useTranslation('common');
    const router=useRouter();
    const[term,setterm]=React.useState('');
    const searchAction=()=>{
        router.push(`/search?q=${term}`)
    }
  const onTermKeyUp = (e:React.KeyboardEvent<HTMLInputElement>)=>{
    e.preventDefault();
    if(e.code == 'Enter' || e.code == 'NumpadEnter' ){
        router.push(`/search?q=${e.currentTarget.value}`)
        //   .then((res)=>{setSearching(false);return res})
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{ 
        p: '2px 4px', 
        display: 'flex',
        alignItems: 'center', 
        width: {xs:'350px',lg:'500px'},
      }}
     className='searchInputCmp'
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={t('common:search')}
        inputProps={{ 'aria-label': t('common:search') }}
        onKeyUp={onTermKeyUp}
        value={term}
        onChange={(e)=>setterm(e.currentTarget.value)}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton disabled={!term} color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={searchAction}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
