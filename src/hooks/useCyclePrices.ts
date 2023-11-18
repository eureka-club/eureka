import { CycleMosaicItem } from "../types/cycle";
import { useQuery } from "react-query";

interface Type{
    price:number;currency:string
}
export const getPrices = async (product_id:string):Promise<Type> => {
    let price = -1;  
    let currency = '';
    if(product_id){
      const fr = await fetch(`/api/stripe/${product_id}/prices`);
      if(fr.ok){
        const {prices:{data}} = await fr.json();
        if((data as [])?.length ){
          price = data[0]['unit_amount']/100;
          currency = `${data[0]['currency']}`.toUpperCase();
        }   
      }
    }
    return {price,currency};
  }

  export const useCyclePrice = (cycle?:CycleMosaicItem)=>{
    return useQuery<Type>(['CYCLE-PRICE', cycle?.product_id], () => getPrices(cycle?.product_id!), {
        staleTime: 1000 * 60 * 60,
      });
  }
