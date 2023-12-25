import auth_config from "@/auth_config";
import { INVALID_FIELD, MISSING_FIELD, SERVER_ERROR, UNAUTHORIZED } from "@/src/api_codes";
import { find, findWithoutLangRestrict, remove, updateFromServerFields } from "@/src/facades/work";
import getLocale from "@/src/getLocale";
import { CreateEditionServerPayload, EditionMosaicItem } from "@/src/types/edition";
import { EditWorkServerFields, WorkMosaicItem } from "@/src/types/work";
import { Edition, Work } from "@prisma/client";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { createFromServerFields as editionCreateFromServerFields } from '@/src/facades/edition';
import { storeUpload } from "@/src/facades/fileUpload";
import { NextApiRequest } from "next";

interface Props{
    params:{id:number}
}
export const GET = async (req:NextRequest,props:Props)=>{
    const {id} = props.params;
    const idNum = parseInt(id.toString(), 10);
    if (isNaN(idNum)) {
      return NextResponse.json({ error: INVALID_FIELD("ID") });
    }
    const { searchParams } = new URL(req.url)
    const langs = searchParams.get("lang")?.split(',');
    
    if (!idNum) {
      return NextResponse.json({ error: MISSING_FIELD("id") });
    }

    try {
      let work = null;
      if (langs) work = await find(idNum, langs);
      else work = await findWithoutLangRestrict(idNum);
      if (work == null) {
        return NextResponse.json(work);
      }

      let ratingCount = work._count.ratings;
      const ratingAVG = work.ratings.reduce((p, c) => c.qty + p, 0) / ratingCount;
     
      work.ratingAVG = ratingAVG;
      return NextResponse.json(work);
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
}
export const PATCH = async (req:NextRequest,props:Props) => {
  const {id} = props.params;
  if(isNaN(id)){
    return NextResponse.json({error:INVALID_FIELD('ID')});
  }

  const locale = getLocale(req);
  const session = await getServerSession(auth_config(locale));

  if (session == null || !session.user.roles.includes('admin')) {
    return NextResponse.json({ error: UNAUTHORIZED });
  }

  const data = await req.formData();
  const cover:File = data.get('cover') as File;
  //     const uploadData = cover ? await storeUpload(cover) : null;
  //     data.delete('cover');
    
      let fields: Partial<EditWorkServerFields>={id};
          for(let [k,v] of Array.from(data))
            fields={...fields,[k]:v}; 

  // new Form().parse(req, async (err, fields, files) => {
    
    if (fields.publicationYear) fields.publicationYear = dayjs(`${fields.publicationYear}`, 'YYYY').utc().format();
    const now = dayjs().utc();
    
    let editionsIds: { id: number }[] = [];

    const worksToSaveAsEdition: EditionMosaicItem[] = fields.editions?.length
      ? JSON.parse(fields.editions[0])
      : undefined;

    try {
      if (worksToSaveAsEdition?.length) {
        const editions = worksToSaveAsEdition.reduce((p, c) => {
          const edition: CreateEditionServerPayload = {
            title: c.title,
            language: c.language,
            isbn: c.isbn!,
            contentText: c.contentText!,
            publicationYear: c.publicationYear!,
            countryOfOrigin: c.countryOfOrigin!,
            ToCheck: false,
            length: c.language,
            workId: id,
            createdAt: now.toDate(),
            creatorId: c.creatorId,
            updatedAt: now.toDate(),
            localImages: c.localImages.map((l) => ({ id: l.id })),
          };
          p.push(edition);
          return p;
        }, [] as CreateEditionServerPayload[]);

        let removeOldWorks: Promise<any>[] = [];
        worksToSaveAsEdition.forEach((w) => {
          removeOldWorks.push(remove(w.id));
        });

        await Promise.all(removeOldWorks);

        let saveEditions: Promise<Edition>[] = [];
        editions.forEach((e) => {
          saveEditions.push(editionCreateFromServerFields(e));
        });

        const editionsSaved = await Promise.all(saveEditions);
        editionsIds = editionsSaved.map(({ id }) => ({ id }));
      }

      const uploadData = cover ? await storeUpload(cover) : null;

      delete fields.id;
      // delete fields.localImages;
      // delete fields.favs;
      // delete fields.ratings;
      // delete fields.posts;
      // delete fields._count;
      // delete fields.readOrWatchedWorks;

      const fieldsA = { ...fields };
      const work = await updateFromServerFields(fieldsA as EditWorkServerFields, uploadData, id, editionsIds);
      // await redis.flushall();
      return NextResponse.json({ work });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
  };
// })
export const dynamic = "force-dynamic";
export const revalidate = 60*60 