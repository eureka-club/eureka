import { AddBackOfficesSlidersForm } from "@/src/components/AddBackOfficesSlidersForm";
import { NextPage } from "next";
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import AnimatedIMGCarousel from "@/src/AnimatedIMGCarousel";

interface Props{}
const AddBOSliders:NextPage<Props>=()=>{
     
    return <SimpleLayout title={'Admin Panel'}>
        <AnimatedIMGCarousel/>
        <AddBackOfficesSlidersForm/>
    </SimpleLayout>
    
}
export default AddBOSliders;