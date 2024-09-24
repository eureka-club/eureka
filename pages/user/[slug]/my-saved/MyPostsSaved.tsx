import Masonry from "@mui/lab/Masonry"
import MosaicItem from '@/src/components/post/MosaicItem'
import { Box } from "@mui/material"

const MyPostsSaved = ({favPosts}:{favPosts:{id:number}[]})=>{
    return  <Masonry columns={{xs:1,sm:3,md:3,lg:4}} spacing={1}>
    {
    favPosts.map(p=>
      <Box key={p.id}>
        <MosaicItem postId={p.id} sx={{
          'img':{
            width:'100%',
            height:'auto',
          }
        }} />
      </Box>
    )??<></>}
    </Masonry>
  }
export default MyPostsSaved;  