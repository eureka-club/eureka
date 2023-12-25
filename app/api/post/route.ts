import {prisma} from '@/src/lib/prisma'
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import auth_config from '@/auth_config';
import { getServerSession } from 'next-auth';
import { INVALID_FIELD, SERVER_ERROR, UNAUTHORIZED } from '@/src/api_codes';
import getLocale from '@/src/getLocale';
import { storeUpload } from '@/src/facades/fileUpload';
import { createFromServerFields, findAll } from '@/src/facades/post';
import { CreatePostServerFields } from '@/src/types/post';
import { create } from '@/src/facades/notification';
import { LANGUAGES } from '@/src/constants';

export const GET = async (req:NextRequest) => {
  try {
    const { searchParams } =     new URL(req.url)
    const p = searchParams.get('props');
    const q = searchParams.get('q');
 
    // const language = searchParams.get('lang')!;
    const locale = getLocale(req);

    const props:Prisma.PostFindManyArgs = p ? JSON.parse(decodeURIComponent(p.toString())):{};
    let {where,take,cursor,skip,select} = props;
    const session = await getServerSession(auth_config(locale));
   
    if (typeof q === 'string') {
      const terms = q.split(" ");
      where = {
        OR:[
          {
            AND:terms.map(t=>(
              { 
                title: { contains: t } 
              }
            ))
          },
          {
            AND:terms.map(t=>(
              { 
                contentText: { contains: t } 
              }
            ))

          },
          {
            AND:terms.map(t=>(
              { 
                  topics: { contains: t } 
              }
            ))
          },
        ]
      };
    }
    if(where){
      const languages = session?.user.language?.split(',')??[];
      where = {
        ...where,
        ...{
          AND:{
            ...where?.AND,
            OR:[
              {
                cycles:{
                  some:{
                    access:1,
                  }
                }
              },
              {
                cycles:{
                  none:{}
                }
              },
              ... session 
                ? [
                  {
                    cycles:{
                      some:{
                        OR:[
                          {creatorId:session?.user.id},
                          {participants:{some:{id:session?.user.id}}},  
                        ]
                      }
                    }
                  }
                ]
                : []
            ],
            ... {
              ... languages?.length 
                ? {
                  language:{in:languages}
                }
                : {
                  language:{in:[LANGUAGES[locale]]}
                }
            }
          }
        }
      };
    }
      
    let cr = await prisma?.post.aggregate({where,_count:true})
    const total = cr?._count;
    let data = await findAll({select,take,where,skip,cursor});

    data.forEach(p=>{
      p.type='post';
      let currentUserIsFav = false;
      if(session)
        currentUserIsFav = p.favs.findIndex(f=>f.id==session.user.id) > -1
      p.currentUserIsFav = currentUserIsFav;
    })

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
export const POST = async (req:NextRequest) => {
  try {
    const locale = getLocale(req);
    const session = await getServerSession(auth_config(locale));
    if (session == null) {
      return NextResponse.json({errror:UNAUTHORIZED});
    }

    const data = await req.formData();
    if(!data.get('title'))return NextResponse.json({error:INVALID_FIELD('title')});
    if(!data.get('contentText'))return NextResponse.json({error:INVALID_FIELD('contentText')});
    const cover:File = data.get('image') as File;
    if(!cover)return NextResponse.json({error:INVALID_FIELD('image')});
    const uploadData = await storeUpload(cover);
    data.delete('image');

    let fields: Partial<CreatePostServerFields>={};
          for(let [k,v] of Array.from(data)){
            let val:any = v;
            fields={...fields,[k]:val}; 
          }
    if(!fields.language)fields.language=locale;

    const post = await createFromServerFields(fields as CreatePostServerFields, uploadData, session.user.id);

      const notificationToUsers = fields.notificationToUsers 
        ? fields.notificationToUsers[0].split(',').filter((i:string)=>i!='').map((i:string) => +i)
        : null;
      if(notificationToUsers && notificationToUsers.length){
        const notification = await create(
          fields.notificationMessage!,
          fields.notificationContextURL+`/${post.id}`,
          session.user.id,
          fields.notificationToUsers!.split(',').map((i:string) => +i),
        );
        return NextResponse.json({ post, notification });
      }
      return NextResponse.json({ post, notification:null });
  } catch (excp) {
    console.error(excp); // eslint-disable-line no-console
    return NextResponse.json({error:SERVER_ERROR});
  } finally {
    //prisma.$disconnect();
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 60*60 

// export default getApiHandler()
//   .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
//     const session = (await getSession({ req })) as unknown as Session;
//     if (session == null) {
//       res.status(401).json({ status: 'Unauthorized' });
//       return;
//     }
//     try {
//       new Form().parse(req, async (err, fields, files) => {
//         if (err != null) {
//           console.error(err); // eslint-disable-line no-console
//           res.status(500).json({ ok: false, error: 'Server error' });
//           return;
//         }
//         if (files?.image == null) {
//           res.status(422).json({ ok: false, error: 'No image received' });
//           return;
//         }

//         const image: FileUpload = files.image[0];

//         const uploadData = await storeUpload(image);
//         const post = await createFromServerFields(fields, uploadData, session.user.id);
        
//         const notificationToUsers = fields.notificationToUsers 
//           ? fields.notificationToUsers[0].split(',').filter((i:string)=>i!='').map((i:string) => +i)
//           : null;
//         if(notificationToUsers && notificationToUsers.length){
//           const notification = await create(
//             fields.notificationMessage[0],
//             fields.notificationContextURL[0]+`/${post.id}`,
//             session.user.id,
//             fields.notificationToUsers[0].split(',').map((i:string) => +i),
//           );
//           res.status(201).json({ post, notification });
//           return;
//         }
//         res.status(201).json({ post, notification:null });
//       });
//     } catch (excp) {
//       /* const excpMessageTokens = excp.message.match(/\[(\d{3})\] (.*)/);
//       if (excpMessageTokens != null) {
//         res.status(excpMessageTokens[1]).json({ status: 'client error', error: excpMessageTokens[2] });
//         return;
//       }
//  */
//       console.error(excp); // eslint-disable-line no-console
//       res.statusMessage = 'server error';
//       res.status(500).end();
//     } finally {
//       //prisma.$disconnect();
//     }
//   })
//   .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
//     try {
//       const { q = null, props:p="",lang:l } = req.query;
//       const locale = l?.toString();
//       const language = Languages[locale!];

//       const props:Prisma.PostFindManyArgs = p ? JSON.parse(decodeURIComponent(p.toString())):{};
//       let {where:w,take,cursor,skip,select} = props;
//       const session = await getSession({ req });
//       let AND = w?.AND;
//       delete w?.AND;
//       let where:Prisma.PostWhereInput = {...w,AND:{
//         ... AND && {AND},
//         language
//       }}
//       if (typeof q === 'string') {
//         const terms = q.split(" ");
//         where = {
//           OR:[
//             {
//               AND:terms.map(t=>(
//                 { 
//                   title: { contains: t } 
//                 }
//               ))
  
//             },
//             {
//               AND:terms.map(t=>(
//                 { 
//                   contentText: { contains: t } 
//                 }
//               ))
  
//             },
//             {
//               AND:terms.map(t=>(
//                 { 
//                    topics: { contains: t } 
//                 }
//               ))
//             },
//           ]
//         };
//       }
//       const AND = where.AND;
//       delete where.AND;
      
//       if(session){
//         const AND = {
//           OR:[
//             {
//               cycles:{
//                 some:{
//                   OR:[
//                     {access:1},
//                     {creatorId:session?.user.id},
//                     {participants:{some:{id:session?.user.id}}},  
//                   ]
//                 }
//               }
//             },
//             {
//               cycles:{
//                 none:{}
//               }
//             }
//           ],
//           // ... session?.user.language && {language:session?.user.language}
//           language
//         }
//         where = {
//           ...where,
//           ...AND 
//           ? {
//             AND:{
//               ...AND,
//               ...AND
//             }
//           } 
//           : {
//             AND
//           }
          
//         }
//       }
//       else{
//         const AND={
//           OR:[
//             {
//               cycles:{
//                 some:{
//                   access:1,
//                 }
//               }

//             },
//             {
//               cycles:{
//                 none:{}
//               }
//             }
//           ]
//         }
//         where = {...where,
//           ...AND 
//           ? {
//             AND:{
//               ...AND,
//               ...AND
//             }
//           } 
//           : {
//             AND
//           }
          
//         }
//       }

//       let cr = await prisma?.post.aggregate({where,_count:true})
//       const total = cr?._count;
//       let data = await findAll({select,take,where,skip,cursor});

//       data.forEach(p=>{
//         p.type='post';
//         let currentUserIsFav = false;
//         if(session)
//           currentUserIsFav = p.favs.findIndex(f=>f.id==session.user.id) > -1
//         p.currentUserIsFav = currentUserIsFav;
//       })

//       res.status(200).json({ 
//         data, 
//         fetched:data.length,
//         total,
//       });
//     } catch (exc) {
//       console.error(exc); // eslint-disable-line no-console
//       res.status(500).json({ status: 'server error' });
//     } finally {
//       //prisma.$disconnect();
//     }
//   });

