import Masonry from "@mui/lab/Masonry";
import { FC } from "react";
import { Box } from "@mui/material";
import MosaicItem from "./work/MosaicItem";

interface Props{
    works:{id:number}[];
}
export const WorksMosaic:FC<Props> = ({works})=>{
    return <Masonry columns={{xs:1,sm:3,md:3,lg:6}} spacing={1}>
    {works?.map(p=>
      <Box key={p.id}>
        <MosaicItem   
          workId={p.id} 
          sx={{
              'img':{
                width:'100%',
                height:'auto',
              }
            }} 
        />
      </Box>
    )}
  </Masonry>
}