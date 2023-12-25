import auth_config from "@/auth_config";
import { INVALID_FIELD, MISSING_FIELD, NOT_FOUND, SERVER_ERROR, UNAUTHORIZED } from "@/src/api_codes";
import { storeUpload } from "@/src/facades/fileUpload";
import { create } from "@/src/facades/notification";
import { createFromServerFields,updateFromServerFields, find, remove } from "@/src/facades/post";
import getLocale from "@/src/getLocale";
import { FileUpload } from "@/src/types";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { storeDeleteFile } from '@/src/facades/fileUpload';
import { EditPostServerFields } from "@/src/types/post";
import { NextApiRequest } from "next";

interface GetProps{
    params:{id:string}
}
export const GET = async (req:NextRequest,props:GetProps) => {
    const locale = getLocale(req);
    const session = await getServerSession(auth_config(locale)); 

    const {id} = props.params;
    if (!id) {
      return NextResponse.json({error:MISSING_FIELD('id')});
    }

    const idNum = parseInt(id, 10);
    if (!Number.isInteger(idNum)) {
      return NextResponse.json({error:INVALID_FIELD('id')});
    }

    try {
      const post = await find(idNum);
      if (post == null) {
        return NextResponse.json({ post: null });
      }
      let currentUserIsFav = false;
      if (session) currentUserIsFav = post.favs.findIndex((f) => f.id == session?.user.id) > -1;
      post.currentUserIsFav = currentUserIsFav;
      post.type = 'post';
      return NextResponse.json({ post });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ status: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
}
interface DeleteProps{
  params:{
    id:number;
  }
}
export const DELETE = async (req:NextRequest, props:DeleteProps) => {
  
  try {
    const locale = getLocale(req);
    const session = await getServerSession(auth_config(locale));
    if(!session)
      return NextResponse.json({error:UNAUTHORIZED});

    let { id } = props.params;
  
    const idNum = parseInt(id.toString(), 10);
    if (isNaN(idNum)) {
      return NextResponse.json({error:INVALID_FIELD('ID')});
    }
    const post = await find(idNum);
    if (post == null) {
      return NextResponse.json({error:NOT_FOUND});
    }

    if (post.localImages && post.localImages.length) {
      await storeDeleteFile(post.localImages[0].storedFile);
    }
    await remove(post);
    return NextResponse.json({data:post});
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ error: SERVER_ERROR });
  } finally {
    //prisma.$disconnect();
  }
}
interface PatchProps{
  params:{
    id:string;
  }
}
export const PATCH  = async (req:NextRequest, props:PatchProps): Promise<any> => {

  try {
      const locale = getLocale(req);
      const session = await getServerSession(auth_config(locale));
    
      if (session == null) {
        return NextResponse.json({ error: UNAUTHORIZED });
      }
      
      const {id:id_} = props.params;
      const id = +id_;
      if(isNaN(id)){
        return NextResponse.json({error:INVALID_FIELD('ID')});
      }
    
      const post = await find(id);
      if (!post) return NextResponse.json({ error: NOT_FOUND });
      if (post?.creatorId !== session.user.id) return NextResponse.json({ error: UNAUTHORIZED });
    
      const data = await req.formData();
      const cover:File = data.get('image') as File;
      const uploadData = cover ? await storeUpload(cover) : null;
      if(post.localImages.length>0){
        await storeDeleteFile(post.localImages[0].storedFile);
      }
      
      data.delete('image');
    
      let fieldsA: Partial<EditPostServerFields>={};
          for(let [k,v] of Array.from(data))
            fieldsA={...fieldsA,[k]:v};
      delete fieldsA.id;
      const r = await updateFromServerFields(fieldsA as EditPostServerFields, uploadData, id);
      
      return NextResponse.json({ data: r });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
};

export const dynamic = 'force-dynamic'
export const revalidate = 60*60 
