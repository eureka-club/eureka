import CycleDetailHeader from "./component/CycleDetailHeader"
import Layout from "@/src/components/layout/Layout";
import { getDictionary } from "@/src/get-dictionary";
import { useParams } from "next/navigation";
import { Locale } from "@/i18n-config";
import { Button, Grid } from "@mui/material";
import CycleNavigation from "./component/CycleNavigation";

export default async function layout({
    children, // will be a page or nested layout
    params
  }: {
    children: React.ReactNode,
    params:{lang:Locale,id:string}
  }) {
    const {lang,id}=params;
    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = { ...dictionary['aboutUs'],
     ...dictionary['meta'], ...dictionary['common'], 
     ...dictionary['topics'],...dictionary['navbar'],
     ...dictionary['signInForm'],
     ...dictionary['cycleDetail'],
      ...dictionary['createPostForm'] 
    }

    return (
        <Layout dict={dict} showFooter={false}>
            <section className="container" style={{margin:'152px 0'}}>
              <CycleDetailHeader/>
              <CycleNavigation/>
              {children}
            </section>
        </Layout>
    )
  }