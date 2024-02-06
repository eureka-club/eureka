// import { NextApiRequest, NextApiResponse } from 'next';
// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import { Form } from 'multiparty';
// import { Session, FileUpload, Languages } from '../../../src/types';
// import getApiHandler from '../../../src/lib/getApiHandler';
// import { find, findWithoutLangRestrict, remove, updateFromServerFields } from '../../../src/facades/work';
// import { createFromServerFields as editionCreateFromServerFields } from '@/src/facades/edition';
// import { prisma } from '@/src/lib/prisma';
// import { storeUpload } from '@/src/facades/fileUpload';
// import { cors, middleware } from '@/src/lib/cors';
// import { Edition, Prisma, Work } from '@prisma/client';
// import { CreateEditionPayload, CreateEditionServerPayload } from '@/src/types/edition';
// import { WorkDetail } from '@/src/types/work';
// import { BAD_REQUEST, MISSING_FIELD, NOT_FOUND, SERVER_ERROR, UNAUTHORIZED } from '@/src/response_codes';
// import { getSession } from 'next-auth/react';
// import { getServerSession } from "next-auth/next"
// import { NextRequest, NextResponse } from 'next/server';
// import auth_config from 'auth_config';
// // import redis from '../../../src/lib/redis';
// // export const config = {
// //   api: {
// //     bodyParser: false,
// //   },
// // };

// dayjs.extend(utc);
// // export const GET = async (req:NextRequest): Promise<any> => {debugger;
// //   // const session = await getSession({req});
// //   const session = await getServerSession(auth_config('fr'));
// //   // if (session == null) {
// //   //   res.status(200).json({ error: 'Unauthorized', work: null });
// //   //   return;
// //   // }
// //   // const { id, lang: l } = req.query;
// //   // const language = l ? Languages[l.toString()] : null;
// //   let language = 'fr'

// //   const idNum = 338;
 

// //   try {
// //     let work = null;debugger;
// //     work = await find(idNum);
// //     // else work = await findWithoutLangRestrict(idNum);
// //     if (work == null) {
// //       return NextResponse.json({error:NOT_FOUND});
// //     }
// //     if(language){
// //       const cycle = await prisma.cycle.findFirst({
// //         where:{
// //           works:{
// //             some:{id:work.id}
// //           }
// //         },
// //         select:{creatorId:true,participants:{select:{id:true}}}
// //       })
// //       let q1 = cycle && (cycle.creatorId==session?.user.id || cycle.participants.findIndex(p=>p.id==session?.user.id)>-1);
// //       if(work.language==language || q1)return NextResponse.json(work);
// //       else return NextResponse.json({error:NOT_FOUND})
// //     }
// //     // let currentUserIsFav = false;
// //     // let currentUserRating = 0;
// //     // let ratingAVG = 0;

// //     let ratingCount = work._count.ratings;
// //     const ratingAVG = work.ratings.reduce((p, c) => c.qty + p, 0) / ratingCount;
// //     // if(session){
// //     //     let r  = work.ratings.find(r=>r.userId==session.user.id)
// //     //     if(r)currentUserRating = r.qty;
// //     //     currentUserIsFav = work.favs.findIndex(f=>f.id==session.user.id) > -1
// //     // }
// //     // work.currentUserRating = currentUserRating;
// //     work.ratingAVG = ratingAVG;
// //     // work.currentUserIsFav = currentUserIsFav;
// //     return NextResponse.json(work);
// //   } catch (exc) {
// //     console.error(exc); // eslint-disable-line no-console
// //     return NextResponse.json({ error: SERVER_ERROR });
// //   } finally {
// //     //prisma.$disconnect();
// //   }
// // }

// // export default getApiHandler()
// //   .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
// //     const session = await getSession({req});

// //     if (session == null || !session.user.roles.includes('admin')) {
// //       return res.status(200).json({ status: UNAUTHORIZED, error: UNAUTHORIZED });
// //     }

// //     const { id, lang: l } = req.query;
// //     const language = l ? Languages[l.toString()] : null;

// //     if (typeof id !== 'string') {
// //       return res.status(200).json({ error: MISSING_FIELD('id') });
// //     }

// //     const idNum = parseInt(id, 10);
// //     if (!Number.isInteger(idNum)) {
// //       return res.status(200).json({ error: MISSING_FIELD('id') });
// //     }

// //     try {
// //       let work = null;
// //       if (language) work = await find(idNum, language);
// //       else work = await findWithoutLangRestrict(idNum);

// //       if (work == null) {
// //         res.status(404).end();
// //         return;
// //       }

// //       await remove(idNum);
// //       // await redis.flushall();
// //       res.status(200).json({ status: 'OK' });
// //     } catch (exc) {
// //       console.error(exc); // eslint-disable-line no-console
// //       res.status(500).json({ status: SERVER_ERROR, error: SERVER_ERROR });
// //     } finally {
// //       //prisma.$disconnect();
// //     }
// //   })
// //   .get<NextApiRequest, NextApiResponse>(async (req:NextApiRequest, res): Promise<any> => {debugger;
// //     // const session = await getSession({req});
// //     const session = await auth(req,res);
// //     // if (session == null) {
// //     //   res.status(200).json({ error: 'Unauthorized', work: null });
// //     //   return;
// //     // }
// //     const { id, lang: l } = req.query;
// //     const language = l ? Languages[l.toString()] : null;

// //     if (typeof id !== 'string') {
// //       res.status(404).end();
// //       return;
// //     }

// //     const idNum = parseInt(id, 10);
// //     if (!Number.isInteger(idNum)) {
// //       res.status(404).end();
// //       return;
// //     }

// //     try {
// //       let work = null;debugger;
// //       work = await find(idNum);
// //       // else work = await findWithoutLangRestrict(idNum);
// //       if (work == null) {
// //         return res.status(200).json(null);
// //       }
// //       if(language){
// //         const cycle = await prisma.cycle.findFirst({
// //           where:{
// //             works:{
// //               some:{id:work.id}
// //             }
// //           },
// //           select:{creatorId:true,participants:{select:{id:true}}}
// //         })
// //         let q1 = cycle && (cycle.creatorId==session?.user.id || cycle.participants.findIndex(p=>p.id==session?.user.id)>-1);
// //         if(work.language==language || q1)return res.status(200).json(work);
// //         else return res.status(200).json({error:NOT_FOUND})
// //       }
// //       // let currentUserIsFav = false;
// //       // let currentUserRating = 0;
// //       // let ratingAVG = 0;

// //       let ratingCount = work._count.ratings;
// //       const ratingAVG = work.ratings.reduce((p, c) => c.qty + p, 0) / ratingCount;
// //       // if(session){
// //       //     let r  = work.ratings.find(r=>r.userId==session.user.id)
// //       //     if(r)currentUserRating = r.qty;
// //       //     currentUserIsFav = work.favs.findIndex(f=>f.id==session.user.id) > -1
// //       // }
// //       // work.currentUserRating = currentUserRating;
// //       work.ratingAVG = ratingAVG;
// //       // work.currentUserIsFav = currentUserIsFav;
// //       res.status(200).json(work);
// //     } catch (exc) {
// //       console.error(exc); // eslint-disable-line no-console
// //       res.status(500).json({ status: SERVER_ERROR, error: SERVER_ERROR });
// //     } finally {
// //       //prisma.$disconnect();
// //     }
// //   })
// //   .patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
// //     const session = await getServerSession(req);

// //     if (session == null || !session.user.roles.includes('admin')) {
// //       return res.status(401).json({ error: UNAUTHORIZED });
// //     }

// //     new Form().parse(req, async (err, fields, files) => {
// //       if (err != null) {
// //         console.error(err); // eslint-disable-line no-console
// //         res.status(500).json({ error: SERVER_ERROR });
// //         return;
// //       }
// //       if (fields.publicationYear) fields.publicationYear = dayjs(`${fields.publicationYear}`, 'YYYY').utc().format();
// //       const now = dayjs().utc();

// //       const { id: id_ } = fields;
// //       const id = parseInt(id_, 10);
// //       if (!Number.isInteger(id)) {
// //         return res.status(200).json({ status: 'OK', work: null });
// //       }
// //       let editionsIds: { id: number }[] = [];

// //       const worksToSaveAsEdition: WorkDetail[] = fields.editions?.length
// //         ? JSON.parse(fields.editions[0])
// //         : undefined;

// //       const coverImage: FileUpload = files?.cover != null ? files.cover[0] : null;
// //       try {
// //         if (worksToSaveAsEdition?.length) {
// //           const editions = worksToSaveAsEdition.reduce((p, c) => {
// //             const edition: CreateEditionServerPayload = {
// //               title: c.title,
// //               language: c.language,
// //               isbn: c.isbn!,
// //               contentText: c.contentText!,
// //               publicationYear: c.publicationYear!,
// //               countryOfOrigin: c.countryOfOrigin!,
// //               ToCheck: false,
// //               length: c.language,
// //               workId: id,
// //               createdAt: now.toDate(),
// //               creatorId: c.creatorId,
// //               updatedAt: now.toDate(),
// //               localImages: c.localImages.map((l) => ({ id: l.id })),
// //             };
// //             p.push(edition);
// //             return p;
// //           }, [] as CreateEditionServerPayload[]);

// //           let removeOldWorks: Promise<Work>[] = [];
// //           worksToSaveAsEdition.forEach((w) => {
// //             removeOldWorks.push(remove(w.id));
// //           });

// //           await Promise.all(removeOldWorks);

// //           let saveEditions: Promise<Edition>[] = [];
// //           editions.forEach((e) => {
// //             saveEditions.push(editionCreateFromServerFields(e));
// //           });

// //           const editionsSaved = await Promise.all(saveEditions);
// //           editionsIds = editionsSaved.map(({ id }) => ({ id }));
// //         }

// //         const uploadData = coverImage ? await storeUpload(coverImage) : null;

// //         delete fields.id;
// //         delete fields.localImages;
// //         delete fields.favs;
// //         delete fields.ratings;
// //         delete fields.posts;
// //         delete fields._count;
// //         delete fields.readOrWatchedWorks;

// //         const fieldsA = { ...fields };
// //         const work = await updateFromServerFields(fieldsA, uploadData, id, editionsIds);
// //         // await redis.flushall();
// //         res.status(200).json({ work });
// //       } catch (exc) {
// //         console.error(exc); // eslint-disable-line no-console
// //         res.status(500).json({ error: SERVER_ERROR });
// //       } finally {
// //         //prisma.$disconnect();
// //       }
// //     });
// //   });

export default {}