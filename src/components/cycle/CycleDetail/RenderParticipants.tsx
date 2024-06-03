import { CycleDetail } from "@/src/types/cycle";
import { useCycleParticipants } from "@/src/hooks/useCycleParticipants";
import { Grid } from "@mui/material";
import MosaicItemUser from '@/components/user/MosaicItem'


export const RenderParticipants = ({cycle}:{cycle:CycleDetail})=>{
    const{data:participants}=useCycleParticipants(cycle?.id!
        ,{enabled:!!cycle?.id!}
    );

        if(participants){
            return <Grid container spacing={2}>
                {participants.map(p=><Grid item xs={6} sm={4} md={2} key={p.email}><MosaicItemUser user={p} /></Grid>)}
            </Grid>
        }
        return <></>
      }