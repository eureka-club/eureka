import Masonry from "@mui/lab/Masonry"
import MosaicItem from '@/src/components/cycle/MosaicItem'
import { Box } from "@mui/material"

const MyCyclesSaved = ({favCycles}:{favCycles:{id:number}[]})=>{
    return <Masonry columns={{xs:1,sm:3,md:3,lg:4}} spacing={1}>
    {
      favCycles?.map(c=><Box key={c.id}>
        <MosaicItem  cycleId={c.id} />
      </Box>)!
    }
  </Masonry>
  }

export default MyCyclesSaved