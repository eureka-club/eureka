import { useQuery } from "react-query";

interface Type{
  one_time:{
    amount:number;
    currency:string;
  },
  recurring:{
    amount:number;
    currency:string;
  }
}
export const getStripePrices = async (product_id:string):Promise<Type|null> => {
    if(product_id){
      const fr = await fetch(`/api/stripe/${product_id}/prices`);
      if(fr.ok){
        const {prices:{data}} = await fr.json();
        return data.reduce((p:any,c:any)=>{
          p[c.type]={
            amount:c.unit_amount/100,
            currency:c.currency,
          }
          return p;
        },{
          
        })
      }
    }
    return null;
  }

  export const useCycleStripePrice = (product_id:string)=>{
    return useQuery<Type|null>(['CYCLE-STRIPE-PRICE', product_id], () => getStripePrices(product_id!), {
        staleTime: 1000 * 60 * 60,
      });
  }
