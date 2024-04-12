import { Paper, Stack } from "@mui/material"

interface Props{
    imgsSrc:string[]
}
const AnimatedIMGCarousel = ({imgsSrc}:Props)=>{
    return <Paper>
            <Stack 
            sx={{overflow:'scroll'}}
            direction={'row'} spacing={1} 
            >
            {
                imgsSrc?.length 
                ? imgsSrc.map((src,idx)=><img key={`imgaic-${idx}`} width={171} src={src}/>)
                : <></>
            }
            </Stack>
        </Paper>
}
export default AnimatedIMGCarousel;