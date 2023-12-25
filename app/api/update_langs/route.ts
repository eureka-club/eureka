import {prisma} from '@/src/lib/prisma'
import { Cycle, Post, Prisma, Work } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { SERVER_ERROR, UNAUTHORIZED } from '@/src/api_codes';
import { findAll } from '@/src/facades/post';
import auth_config from '@/auth_config';
import getLocale from '@/src/getLocale';

export const GET = async (req:NextRequest) => {
  try {
    const locale = getLocale(req);
    const session = await getServerSession(auth_config(locale));
    if(session?.user.roles=='admin'){

      const cycles = await prisma.cycle.findMany();
      const cup:Promise<Cycle>[] = [];
      cycles.forEach(cycle=>{
        let languages = cycle.languages;
        languages = languages.replace('english','en');
        languages = languages.replace('spanish','es');
        languages = languages.replace('french','fr');
        languages = languages.replace('portuguese','pt');
        cup.push(prisma.cycle.update({
          where:{id:cycle.id},
          data:{languages}
        }));
      });
      const cyclesUpdated = await Promise.all(cup);

      const works = await prisma.work.findMany();
      const wup:Promise<Work>[] = [];
      works.forEach(work=>{
        let language = work.language;
        language = language.replace('english','en');
        language = language.replace('spanish','es');
        language = language.replace('french','fr');
        language = language.replace('portuguese','pt');
        wup.push(prisma.work.update({
          where:{id:work.id},
          data:{language}
        }));
      });
      const worksUpdated = await Promise.all(wup);

      const posts = await prisma.post.findMany();
      const pup:Promise<Post>[] = [];
      posts.forEach(post=>{
        let language = post.language;
        language = language.replace('english','en');
        language = language.replace('spanish','es');
        language = language.replace('french','fr');
        language = language.replace('portuguese','pt');
        pup.push(prisma.post.update({
          where:{id:post.id},
          data:{language}
        }));
      });
      const postsUpdated = await Promise.all(pup);

      return NextResponse.json({cyclesUpdated,worksUpdated,postsUpdated});
    }

    return NextResponse.json({ error:UNAUTHORIZED});
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ status: SERVER_ERROR });
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

