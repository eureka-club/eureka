import { NextPage } from "next"
import Header from "./header";
import WhyBePartOf from "./why-be-part-of";
import ClubProgramming from "./club-programming/clubProgramming";
import AdFromOurCommunity from "./adFromOurCommunity";
import InvestInYourself from "./investInYourself";
import FAQ from "../components/faq";
import WhatAreYouAaitingFor from "./whatAreYouAaitingFor";
import SubscriptionForm from "./subscriptionForm";
import Footer from "@/src/components/layouts/Footer";

interface Props {}
const Spinardi:NextPage<Props> = ({})=>{
    return <>
        <Header/>
        <WhyBePartOf/>
        <ClubProgramming/>
        <AdFromOurCommunity/>
        <InvestInYourself/>
        <FAQ/>
        <WhatAreYouAaitingFor/>
        <SubscriptionForm/>
        <Footer />
    </>
}
export default Spinardi;