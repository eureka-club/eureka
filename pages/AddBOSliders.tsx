import { AddBackOfficesSlidersForm } from "@/src/components/AddBackOfficesSlidersForm";
import { NextPage } from "next";
import SimpleLayout from '@/src/components/layouts/SimpleLayout';

interface Props{}
const AddBOSliders:NextPage<Props>=()=>{
     
    return <SimpleLayout title={'Admin Panel'}>
        <AddBackOfficesSlidersForm/>
    </SimpleLayout>
    
}
export default AddBOSliders;