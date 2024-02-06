import { CycleDetail, CycleSumary } from "../types/cycle";
import { useQuery } from "@tanstack/react-query";

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

  interface Options {
    staleTime?: number;
    enabled?: boolean;
  }

  export const useCyclePrice = (product_id:string,options?: Options)=>{
    const { staleTime, enabled } = options || {
      staleTime: 1000 * 60 * 60,
      enabled: true,
    };
    return useQuery<Type>({
      queryKey:['CYCLE-PRICE', product_id],
      queryFn: () => getPrices(product_id!),
      staleTime,
      enabled,
      retry:3
    });
  }
