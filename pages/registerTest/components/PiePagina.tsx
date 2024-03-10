import React from "react";
import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import InstagramIcon from '@mui/icons-material/Instagram';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import DescriptionIcon from '@mui/icons-material/Description';

export default function PiePagina() {
    return (
      <Stack direction={'row'} gap={1} padding={1}>
        <Link href='https://www.eureka.club/policy'>
          <Stack direction={'row'} alignItems={'center'} gap={.5}><DescriptionIcon sx={{color:'white',width:'1rem'}}/> <Typography color="white" variant="caption">POLITICA DE PRIVACIDAD</Typography></Stack>
        </Link>
        <Link href='http://hola@eureka.club/'>
          <Stack direction={'row'} alignItems={'center'} gap={.5}><MarkAsUnreadIcon sx={{color:'white',width:'1rem'}}/> <Typography color="white" variant="caption">CONTACTO: <a style={{cursor:'pointer',color:'white!important'}} href="mailto:hola@eureka.club">hola@eureka.club</a></Typography></Stack>
        </Link>
        <Link href='https://www.instagram.com/momentoeureka/'>
          <Stack direction={'row'} alignItems={'center'} gap={.5}><InstagramIcon sx={{color:'white',width:'1rem'}}/> <Typography color="white" variant="caption">INSTAGRAM</Typography></Stack>
        </Link>
      </Stack>
    );
  }