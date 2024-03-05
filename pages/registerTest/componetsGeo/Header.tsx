import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1, paddingBottom:'8rem' }}>
      <AppBar position="fixed" elevation={0} style={{background:'#F2F2F2'}}>
        <Toolbar>
            <img style={{height:'75px'}} src="/Design_20sem_20nome_20-_202023-12-20T130202.881-min.webp"/>
        </Toolbar>
      </AppBar>
    </Box>
  );
}