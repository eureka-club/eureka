import { INVALID_FIELD, MISSING_FIELD, REMOVING_IMG_FAILED, SERVER_ERROR, UNAUTHORIZED } from "@/src/api_codes";
import { createFromServerFields, find, findAll, remove } from "@/src/facades/cycle";
import { Cycle, Prisma } from "@prisma/client";
import {prisma} from '@/src/lib/prisma';
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import auth_config from '@/auth_config';
import getLocale from "@/src/getLocale";
import {storeDeleteFile, storeUpload} from '@/src/facades/fileUpload'
import { CreateCycleServerFields } from "@/src/types/cycle";
import { FileUpload, StoredFileUpload } from "@/src/types";
import { asyncForEach } from "@/src/lib/utils";

export const POST = async (req:NextRequest) => {
  const locale = getLocale(req);
  const session = await getServerSession(auth_config(locale));
  if (session == null || !session.user.roles.includes('admin')) {
    return NextResponse.json({ error: UNAUTHORIZED });
  }

  const data = await req.formData();
  const cover:File = data.get('coverImage') as File;
  data.delete('coverImage');
  const complementaryMaterialsFiles:File[] = data.get('complementaryMaterialsFiles') as unknown as File[];
  data.delete('complementaryMaterialsFiles');

  if (cover == null) {
    return NextResponse.json({ error: MISSING_FIELD('coverImage')});
  }

    try {
      let fieldsP: Partial<CreateCycleServerFields>={};

      for(let [k,v] of Array.from(data)){
        const toParse = ['includedWorksIds','guidelines','cycleWorksDates'];
        if(toParse.includes(k)){
          fieldsP={...fieldsP,[k]:JSON.parse(v.toString())}; 
        }
        else{
          fieldsP={...fieldsP,[k]:v}; 
        }
      }
      let fields = fieldsP as CreateCycleServerFields;

      // const { coverImage, ...complementaryMaterialsFiles } = files;
      const coverImageUploadData = await storeUpload(cover);
      
      let psu:Promise<StoredFileUpload>[] = [];
      const complementaryMaterialsUploadData: Record<string, StoredFileUpload> = {};
      if(complementaryMaterialsFiles?.length){
        complementaryMaterialsFiles?.forEach(f=>{
          psu.push(storeUpload(f));
        });

        const psuRes = await Promise.all(psu);
        
        psuRes.reduce((p,c)=>{
          const idx = Object.keys(p).length;
          p[idx] = c;
          return p;
        },complementaryMaterialsUploadData);
        
      }
      // await asyncForEach(
      //   Object.entries(complementaryMaterialsFiles),
      //   async ([cmIndexName, cmFile]: [string, FileUpload[]]) => {
      //     complementaryMaterialsUploadData[cmIndexName] = await storeUpload(cmFile[0]);
      //   },
      // );
      const cycleWorksDates = fields.cycleWorksDates!.map(
        (cw) => ({
          workId: +cw.workId,
          startDate: cw.startDate && new Date(cw.startDate),
          endDate: cw.endDate && new Date(cw.endDate),
        }),
      );

      const cycle = await createFromServerFields(
        session.user.id,
        fields,
        coverImageUploadData,
        complementaryMaterialsUploadData,
        fields.guidelines,
        cycleWorksDates,
      );
      // await redis.flushall();
      return NextResponse.json(cycle);
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
}
export const GET = async (req:NextRequest) => {
  try {
    //await middleware(req,res,cors)
    
    const { searchParams } = new URL(req.url)
    const p = searchParams.get('props');
    const langs = searchParams.get('lang')?.split(",");
  
    const props:Prisma.CycleFindManyArgs = p ? JSON.parse(decodeURIComponent(p.toString())):{};
    let {where:w,take,cursor,skip} = props;
    let AND = w?.AND;
    delete w?.AND;
    let where = {...w,
      AND:{
        ... AND && {AND},
        ... langs?.length && {
          OR:langs!.map(lang=>({
            languages:{contains:lang}
          }))
        }
      }
    };
    let data = null;
    let cr = await prisma?.cycle.aggregate({where,_count:true})
    const total = cr?._count;
    data = await findAll({take,where,skip,cursor});
  
    data.forEach((c) => {
        c.type ='cycle';
    }); 
    return NextResponse.json({
      data,
      fetched:data.length,
      total,
    });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ status: SERVER_ERROR });
  } finally {
    //prisma.$disconnect();
  }
}
export const PATCH = async (req:NextRequest) => {
    //TODO not update with prisma, /faced/cycle -> update must be used !!!
    const locale = getLocale(req);

    const session = await getServerSession(auth_config(locale));

    if (session == null || !session.user.roles.includes('admin')) {
      return NextResponse.json({ error: UNAUTHORIZED });
    }
    const body = await req.json();
    let data = body;

    const { id, includedWorksIds } = data;

    try {
      let r: Cycle;
      if (includedWorksIds?.length) {
        r = await prisma.cycle.update({
          where: { id },
          data: {
            updatedAt: dayjs().utc().format(),
            works: { connect: includedWorksIds.map((workId: number) => ({ id: workId })) },
            cycleWorksDates: {
              createMany:{
                data:includedWorksIds.map((workId: number) => ({ 
                  workId,
                  startDate: dayjs().utc().format(),
                  endDate: dayjs().utc().format()
                }))
              }
            },
            
          },
        });
      } else {
        data.startDate = dayjs(`${data.startDate}`, 'YYYY').utc().format();
        data.endDate = dayjs(`${data.endDate}`, 'YYYY').utc().format();
        delete data.id;
        data = {
          ...data,
        };
        r = await prisma.cycle.update({ where: { id }, data });
      }
      // await redis.flushall();
      return NextResponse.json({ ...r });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      ////prisma.$disconnect();
    }
};
interface DeleteProps{
  params:{
    id:number
  }
}
export const DELETE  = async (req:NextRequest,props:DeleteProps) => {
  const locale = getLocale(req);
  const session = await getServerSession(auth_config(locale));
  if (session == null || !session.user.roles.includes('admin')) {
    return NextResponse.json({ error: UNAUTHORIZED });
  }
  
  try {
    const { id } = props.params;

    if(!isNaN(id)){
      const cycle = await find(id);
      if(cycle && cycle.localImages.length){
        const rmf = await storeDeleteFile(cycle.localImages[0].storedFile);
        if(!rmf){
          return NextResponse.json({error:REMOVING_IMG_FAILED});
        }
        else {
          let c = await remove(cycle);
          if(c)
            return NextResponse.json({ status: 'OK' });
          else 
            return NextResponse.json({error:"CYCLE_NOT_DELETED"});        
        }
      }
    }
    else
      return NextResponse.json({error:INVALID_FIELD('ID')});
    // await redis.flushall();
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ erros: SERVER_ERROR });
  } finally {
    ////prisma.$disconnect();
  }
}
export const dynamic = 'force-dynamic'
export const revalidate = 60*60 
