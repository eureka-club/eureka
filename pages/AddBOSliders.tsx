import AddSliderForm from "pages/back-office/Banner/AddSliderForm";
import { NextPage } from "next";
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
// import AnimatedIMGCarousel from "pages/registerTest/componets/AnimatedIMGCarousel";

interface Props{}
const AddBOSliders:NextPage<Props>=()=>{
     
    return <SimpleLayout title={'Admin Panel'}>
        {/* <AnimatedIMGCarousel/> */}
        <AddSliderForm/>
    </SimpleLayout>
    
}
export default AddBOSliders;