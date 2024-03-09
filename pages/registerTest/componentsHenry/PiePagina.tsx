import React from "react";
import DehazeIcon from '@mui/icons-material/Dehaze';
import HomeIcon from '@mui/icons-material/Home';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PeopleIcon from '@mui/icons-material/People';
import { AppBar, Button, Drawer, Toolbar, IconButton, Typography,Box,ImageListItem } from "@mui/material";
import Link from "next/link";
import InstagramIcon from '@mui/icons-material/Instagram';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import DescriptionIcon from '@mui/icons-material/Description';
import Stack from "@mui/material";




const pie = [{
    title: "POLITICA DE PRIVACIDAD ", path:"https://www.eureka.club/policy", icon: <DescriptionIcon sx={{ color: "white", padding: 0.5 }}/>

},
{
    title: "	CONTACTO: hola@eureka.club ", path: "http://hola@eureka.club/", icon: <MarkAsUnreadIcon sx={{ color: "white", padding: 0.5 }} />

},
{
    title: "INSTAGRAM " , path: "https://www.instagram.com/momentoeureka/", icon: <InstagramIcon sx={{ color: "white", padding: 0.5 }} />

},

]

export default function PiePagina() {
    return (
      <>
       
         
        {
          
            pie.map(item=>(
              
             
              <Button sx={{marginTop:0, color:"white"}} color="inherit" key={item.title} component={Link} href={item.path}  >{item.icon}{item.title}</Button>
            ))
          
            
          }
        
      </>
    );
  }