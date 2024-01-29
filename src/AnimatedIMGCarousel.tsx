import { Stack } from "@mui/material"

interface Props{

}
const AnimatedIMGCarousel = ({}:Props)=>{
    return <Stack direction={'row'} spacing={1}>
        <img width={171} src="https://datapopalliance.org/wp-content/uploads/2023/12/3-1.webp" />
        <img width={171} src="https://datapopalliance.org/wp-content/uploads/2023/12/Design-sem-nome-12.webp" />
        <img width={171} src="https://datapopalliance.org/wp-content/uploads/2023/12/2-1.webp" />
        <img width={171} src="https://datapopalliance.org/wp-content/uploads/2023/12/4.webp" />
        <img width={171} src="https://datapopalliance.org/wp-content/uploads/2023/12/5.webp" />
        <img width={171} src="https://datapopalliance.org/wp-content/uploads/2023/12/1-1.webp" />
    </Stack>
}
export default AnimatedIMGCarousel;