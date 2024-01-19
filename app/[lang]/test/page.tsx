import { getCycleSumary } from "@/src/actions/cycle/getCycleSumary";
import MosaicItem from "@/src/components/cycle/MosaicItem";
import Layout from "@/src/components/layout/Layout";
import { getDictionary } from "@/src/get-dictionary";
import { Locale } from "i18n-config";


interface Props {
    params: { lang: Locale }
}
export default async function({params:{lang}}:Props){
    const cycle = await getCycleSumary(27);

    const dictionary = await getDictionary(lang);

    const dict: Record<string, string> = {
        ...dictionary['aboutUs'],
        ...dictionary['meta'], ...dictionary['common'],
        ...dictionary['topics'], ...dictionary['navbar'],
        ...dictionary['signInForm'], ...dictionary['countries'], ...dictionary['profile'],
    }

    if(cycle)
        return <Layout dict={dict}>
         <MosaicItem cycle={cycle} cycleId={cycle.id}/>
        </Layout>

    else return <p>...</p>
}