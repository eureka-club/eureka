import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { PrismaClient, Prisma, User } from '@prisma/client';

const prismaRemote = new PrismaClient({
  datasources: {
    db: {
      url: "sqlserver://eureka-staging-database-server.database.windows.net:1433;database=eureka-staging;user=EurekaDatabaseAdmin@eureka-staging-database-server;password=ZxZQ2j1UwAlfaOnr^0f_0Q4Z_9b5t~0nsGXr",
      // url:"sqlserver://eureka-database-server.database.windows.net:1433;database=eureka-production;user=EurekaDatabaseAdmin@eureka-database-server;password=bvV^B8KAX-eg.qV~DjN0REmLK^38_VUj53Pn"
    },
  },
});

const prismaLocal = new PrismaClient(/* {
  datasources: {
    db: {
      url: "mysql://root:123@localhost:3306/Eureka"
    },
  },
  
} */);

async function main() {
  let transactions = [prismaLocal.$queryRaw(Prisma.sql`USE Eureka;`)];
  
  /***User***/
  const users = await prismaRemote.user.findMany();
  users.forEach((user) => {
    transactions.push(
      prismaLocal.$queryRaw(Prisma.sql`
      SET IDENTITY_INSERT dbo.users ON;
      INSERT INTO dbo.users(id,name,email,email_verified,image,roles,
        created_at,updated_at,tags,country_of_origin,about_me,dashboard_type) 
      VALUES(${user.id},${user.name},${user.email},${user.emailVerified || ''},${user.image},${user.roles},
        ${user.createdAt},${user.updatedAt},${user.tags},${user.countryOfOrigin},${user.aboutMe},${user.dashboardType});
      SET IDENTITY_INSERT dbo.users OFF;`)); 
  });

  /***Account***/
  const accounts = await prismaRemote.account.findMany();
  accounts.forEach((a) => {
    transactions.push(
      prismaLocal.$queryRaw(Prisma.sql`
      SET IDENTITY_INSERT dbo.accounts ON;
      INSERT INTO dbo.accounts(id,user_id,provider_type,provider_id,
        provider_account_id,created_at,updated_at) 
      VALUES(${a.id},${a.userId},${a.type},${a.provider},
        ${a.providerAccountId},${a.createdAt},${a.updatedAt});
      SET IDENTITY_INSERT dbo.accounts OFF;`)); 
  });

  /***Session***/
  const sessions = await prismaRemote.session.findMany();
  sessions.forEach((s) => {
    transactions.push(
      prismaLocal.$queryRaw(Prisma.sql`
      SET IDENTITY_INSERT dbo.sessions ON;
      INSERT INTO dbo.sessions(id,user_id,expires,session_token,
        created_at,updated_at) 
      VALUES(${s.id},${s.userId},${s.expires || ''},${s.sessionToken},
        ${s.createdAt},${s.updatedAt});
      SET IDENTITY_INSERT dbo.sessions OFF;`)); 
  });

  /***VerificationRequest***/
  const verification_requests = await prismaRemote.verificationRequest.findMany();
  verification_requests.forEach((v) => {
    transactions.push(
      prismaLocal.$queryRaw(Prisma.sql`
      SET IDENTITY_INSERT dbo.verification_requests ON;
      INSERT INTO dbo.verification_requests(id,identifier,token,expires,created_at,updated_at) 
      VALUES(${v.id},${v.identifier},${v.token},${v.expires || ''},${v.createdAt},${v.updatedAt});
      SET IDENTITY_INSERT dbo.verification_requests OFF;`)); 
  });

  /***LocalImage***/
  const local_images = await prismaRemote.localImage.findMany();
  local_images.forEach((l) => {
    transactions.push(
      prismaLocal.$queryRaw(Prisma.sql`
      SET IDENTITY_INSERT dbo.local_images ON;
      INSERT INTO dbo.local_images(id,original_filename,stored_file,mime_type,content_hash,
        created_at,updated_at) 
      VALUES(${l.id},${l.originalFilename},${l.storedFile || ''},${l.mimeType},${l.contentHash},
        ${l.createdAt},${l.updatedAt});
      SET IDENTITY_INSERT dbo.local_images OFF;`)); 
  });

  /***Cycle***/
  const cycles = await prismaRemote.cycle.findMany();
  cycles.forEach((c) => {
    transactions.push(
      prismaLocal.$queryRaw(Prisma.sql`
      SET IDENTITY_INSERT dbo.cycles ON;
      INSERT INTO dbo.cycles(id,creator_id,title,languages,content_text,start_date,end_date,
        tags,country_of_origin,topics,access,created_at,updated_at) 
      VALUES(${c.id},${c.creatorId},${c.title},${c.languages},${c.contentText},${c.startDate || ''},
        ${c.endDate || ''},${c.tags},${c.countryOfOrigin},${c.topics},${c.access},
        ${c.createdAt},${c.updatedAt});
      SET IDENTITY_INSERT dbo.cycles OFF;`)); 
  });

  /***_CycleToLocalImage***/
  const _CycleToLocalImage = await prismaRemote.cycle.findMany({
    select: {
      id:true,
      localImages: {
        select: { id: true },
      },
    }
  });  
  _CycleToLocalImage.forEach((c) => {
    transactions.push(
      prismaLocal.$queryRaw(Prisma.sql`
      INSERT INTO dbo._CycleToLocalImage(A,B) 
      VALUES(${c.id},${c.localImages[0].id});
      `)); 
  });

  /***Work***/
  const WORKS = await prismaRemote.work.findMany({
    include: {
      terms: {
        select: { id: true },
      },
      readOrWatcheds: {
        select: { id: true}
      }
    }
  });
  WORKS.forEach((w) => {
    transactions.push(
      prismaLocal.$queryRaw(Prisma.sql`
      SET IDENTITY_INSERT dbo.works ON;
      INSERT INTO dbo.works(id,type,title,content_text,author,author_gender,
        author_race,link,publication_year,country_of_origin,length,tags,creator_id,
        country_of_origin2,topics,created_at,updated_at) 
      VALUES(${w.id},${w.type},${w.title},${w.contentText},${w.author},${w.authorGender},
        ${w.authorRace},${w.link},${w.publicationYear || ''},${w.countryOfOrigin},${w.length},
        ${w.tags},${w.creatorId},${w.countryOfOrigin2},${w.topics},
        ${w.createdAt},${w.updatedAt});
      SET IDENTITY_INSERT dbo.works OFF;`)); 
  });

  /***_CycleToWork***/
  const _CycleToWork = await prismaRemote.cycle.findMany({
    select: {
      id:true,
      works: {
        select: { id: true },
      },
    }
  });  
  _CycleToWork.forEach((c) => {
    for (let w of c.works) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo._CycleToWork(A,B) 
        VALUES(${c.id},${w.id});
        `));       
    }
  });

  /***_LocalImageToWork***/
  const _LocalImageToWork = await prismaRemote.localImage.findMany({
    select: {
      id:true,
      works: {
        select: { id: true },
      },
    }
  });  
  _LocalImageToWork.forEach((c) => {
    for (let w of c.works) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo._LocalImageToWork(A,B) 
        VALUES(${c.id},${w.id});
        `));       
    }
  });

  /***RatingOnWork***/
  const userRatingOnWork = await prismaRemote.user.findMany({
    select: {
      id:true,
      ratingWorks: true,
    }
  });  
  userRatingOnWork.forEach((c) => {
    for (let w of c.ratingWorks) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        SET IDENTITY_INSERT dbo.ratingOnWorkId ON;
        INSERT INTO dbo.ratingOnWorkId(id,userId,workId,qty,created_at,updated_at) 
        VALUES(${w.ratingOnWorkId},${c.id},${w.workId},${w.qty},${w.createdAt},${w.updatedAt});
        SET IDENTITY_INSERT dbo.ratingOnWorkId OFF;
      `));       
    }
  });

  /***RatingOnCycle***/
  const userRatingOnCycle = await prismaRemote.user.findMany({
    select: {
      id:true,
      ratingCycles: true,
    }
  });  
  userRatingOnCycle.forEach((c) => {
    for (let w of c.ratingCycles) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        SET IDENTITY_INSERT dbo.ratingOnCycleId ON;
        INSERT INTO dbo.ratingOnCycleId(id,userId,cycleId,qty,created_at,updated_at) 
        VALUES(${w.ratingOnCycleId},${c.id},${w.cycleId},${w.qty},${w.createdAt},${w.updatedAt});
        SET IDENTITY_INSERT dbo.ratingOnCycleId OFF;
      `));       
    }
  });

  /***Post***/
  const POSTS = await prismaRemote.post.findMany({
    include: {
      terms:{select:{id:true}}
    }
  });  
  POSTS.forEach((c) => {
    transactions.push(
      prismaLocal.$queryRaw(Prisma.sql`
      SET IDENTITY_INSERT dbo.posts ON;
      INSERT INTO dbo.posts(id,creator_id,language,content_text,is_public,title,
        topics,tags,created_at,updated_at) 
      VALUES(${c.id},${c.creatorId},${c.language},${c.contentText},${c.isPublic},${c.title},${c.topics},${c.tags},${c.createdAt},${c.updatedAt});
      SET IDENTITY_INSERT dbo.posts OFF;
    `));      
    
  });

  /***Comment***/
  const comments = await prismaRemote.comment.findMany();  
  comments.forEach((c) => {
    transactions.push(
      prismaLocal.$queryRaw(Prisma.sql`
      SET IDENTITY_INSERT dbo.comments ON;
      INSERT INTO dbo.comments(id,creator_id,content_text,cycle_id,work_id,commentId,post_id,status,
        created_at,updated_at) 
      VALUES(${c.id},${c.creatorId},${c.contentText},${c.cycleId},${c.workId},${c.commentId},${c.postId},${c.status},
  ${c.createdAt},${c.updatedAt});
      SET IDENTITY_INSERT dbo.comments OFF;
    `));      
    
  });

  /***_LocalImageToPost***/
  const _LocalImageToPost = await prismaRemote.post.findMany({
    select: {
      id:true,
      localImages: {
        select: { id: true },
      },
    }
  });  
  _LocalImageToPost.forEach((p) => {
    for (let i of p.localImages) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo._LocalImageToPost(A,B) 
        VALUES(${i.id},${p.id});
        `));       
    }
  });

  /***Guideline***/
  const guidelines = await prismaRemote.guideline.findMany();  
  guidelines.forEach((c) => {
    transactions.push(
      prismaLocal.$queryRaw(Prisma.sql`
      SET IDENTITY_INSERT dbo.guidelines ON;
      INSERT INTO dbo.guidelines(id,cycle_id,title,content_text,created_at,updated_at) 
      VALUES(${c.id},${c.cycleId},${c.title},${c.contentText},${c.createdAt},${c.updatedAt});
      SET IDENTITY_INSERT dbo.guidelines OFF;
    `));      
    
  });

  /***_PostToWork***/
  const _PostToWork = await prismaRemote.post.findMany({
    select: {
      id:true,
      works: {
        select: { id: true },
      },
    }
  });  
  _PostToWork.forEach((c) => {
    for (let w of c.works) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo._PostToWork(A,B) 
        VALUES(${c.id},${w.id});
        `));       
    }
  });

  /***_CycleToPost***/
  const _CycleToPost = await prismaRemote.cycle.findMany({
    select: {
      id:true,
      posts: {
        select: { id: true },
      },
    }
  });  
  _CycleToPost.forEach((c) => {
    for (let w of c.posts) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo._CycleToPost(A,B) 
        VALUES(${c.id},${w.id});
        `));       
    }
  });

  /***CycleWork***/
  const CycleWork = await prismaRemote.cycleWork.findMany();  
  CycleWork.forEach((c) => {
    transactions.push(
      prismaLocal.$queryRaw(Prisma.sql`
      SET IDENTITY_INSERT dbo.CycleWork ON;
      INSERT INTO dbo.CycleWork(id,cycleId,workId,start_date,end_date) 
      VALUES(${c.id},${c.cycleId},${c.workId},${c.startDate},${c.endDate});
      SET IDENTITY_INSERT dbo.CycleWork OFF;
    `));   
  });

  /***_CycleToParticipant***/
  const _CycleToParticipant = await prismaRemote.cycle.findMany({
    select: {
      id:true,
      participants: {
        select: { id: true },
      },
    }
  });  
  _CycleToParticipant.forEach((c) => {
    for (let w of c.participants) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo._CycleToParticipant(A,B) 
        VALUES(${c.id},${w.id});
        `));       
    }
  });

  /***CycleComplementaryMaterial***/
  const cycle_complementary_materials = await prismaRemote.cycleComplementaryMaterial.findMany();  
  cycle_complementary_materials.forEach((c) => {
    transactions.push(
      prismaLocal.$queryRaw(Prisma.sql`
      SET IDENTITY_INSERT dbo.cycle_complementary_materials ON;
      INSERT INTO dbo.cycle_complementary_materials(id,cycle_id,title,author,publication_name,
        link,original_filename,stored_file,mime_type,content_hash,created_at,updated_at) 
      VALUES(${c.id},${c.cycleId},${c.title},${c.author},${c.publicationDate || ''},${c.link},${c.originalFilename},${c.storedFile},${c.mimeType},${c.contentHash},${c.createdAt},${c.updatedAt});
      SET IDENTITY_INSERT dbo.cycle_complementary_materials OFF;
    `));   
  });

  
  /***_CycleToLikes***/
  const _CycleToLikes = await prismaRemote.cycle.findMany({
    select: {
      id:true,
      likes: {
        select: { id: true },
      },
    }
  });  
  _CycleToLikes.forEach((c) => {
    for (let w of c.likes) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo._CycleToLikes(A,B) 
        VALUES(${c.id},${w.id});
        `));       
    }
  });

  
  /***_CycleToFavs***/
  const _CycleToFavs = await prismaRemote.cycle.findMany({
    select: {
      id:true,
      favs: {
        select: { id: true },
      },
    }
  });  
  _CycleToFavs.forEach((c) => {
    for (let w of c.favs) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo._CycleToFavs(A,B) 
        VALUES(${c.id},${w.id});
        `));       
    }
  });

  /***_WorkToLikes***/
  const _WorkToLikes = await prismaRemote.work.findMany({
    select: {
      id:true,
      likes: {
        select: { id: true },
      },
    }
  });  
  _WorkToLikes.forEach((c) => {
    for (let w of c.likes) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo._WorkToLikes(A,B) 
        VALUES(${w.id},${c.id});
        `));       
    }
  });

  /***_WorkToFavs***/
  const _WorkToFavs = await prismaRemote.work.findMany({
    select: {
      id:true,
      favs: {
        select: { id: true },
      },
    }
  });  
  _WorkToFavs.forEach((c) => {
    for (let w of c.favs) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo._WorkToFavs(A,B) 
        VALUES(${w.id},${c.id});
        `));       
    }
  });

    /***_PostToLikes***/
  const _PostToLikes = await prismaRemote.post.findMany({
    select: {
      id:true,
      likes: {
        select: { id: true },
      },
    }
  });  
  _PostToLikes.forEach((c) => {
    for (let w of c.likes) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo._PostToLikes(A,B) 
        VALUES(${c.id},${w.id});
        `));       
    }
  });

  /***_PostToFavs***/
  const _PostToFavs = await prismaRemote.post.findMany({
    select: {
      id:true,
      favs: {
        select: { id: true },
      },
    }
  });  
  _PostToFavs.forEach((c) => {
    for (let w of c.favs) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo._PostToFavs(A,B) 
        VALUES(${c.id},${w.id});
        `));       
    }
  });

  /***Taxonomy***/
  const taxonomies = await prismaRemote.taxonomy.findMany();  
  taxonomies.forEach((c) => {
    transactions.push(
      prismaLocal.$queryRaw(Prisma.sql`
      SET IDENTITY_INSERT dbo.taxonomies ON;
      INSERT INTO dbo.taxonomies(id,creator_id,label,code,content_text,
        weight,created_at,updated_at) 
      VALUES(${c.id},${c.creatorId},${c.label},${c.code},${c.description},${c.weight},${c.createdAt},${c.updatedAt});
      SET IDENTITY_INSERT dbo.taxonomies OFF;
    `));   
  });

  /***Terms***/
  const terms = await prismaRemote.term.findMany();  
  terms.forEach((c) => {
    transactions.push(
      prismaLocal.$queryRaw(Prisma.sql`
      SET IDENTITY_INSERT dbo.terms ON;
      INSERT INTO dbo.terms(id,parent_id,creator_id,label,code,content_text,
        weight,taxonomy_code,created_at,updated_at) 
      VALUES(${c.id},${c.parentId},${c.creatorId},${c.label},${c.code},${c.description},${c.weight},${c.taxonomyCode},${c.createdAt},${c.updatedAt});
      SET IDENTITY_INSERT dbo.terms OFF;
    `));   
  });

  /***_TaxonomyTermWork***/
   
  WORKS.forEach((w) => {
    for (let t of w.terms) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo._TaxonomyTermWork(A,B) 
        VALUES(${t.id},${w.id});
        `));       
    }
  });
  
  /***_TaxonomyTermCycle***/
  const _TaxonomyTermCycle = await prismaRemote.cycle.findMany({
    select: {
      id:true,
      terms: {
        select: { id: true },
      },
    }
  });  
  _TaxonomyTermCycle.forEach((c) => {
    for (let t of c.terms) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo._TaxonomyTermCycle(A,B) 
        VALUES(${c.id},${t.id});
        `));       
    }
  });

  /***_TaxonomyTermPost***/
  POSTS.forEach((p) => {
    for (let t of p.terms) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo._TaxonomyTermPost(A,B) 
        VALUES(${p.id},${t.id});
        `));       
    }
  });

  /***_WorkReadOrWatched */
  WORKS.forEach((w) => {
    for (let u of w.readOrWatcheds) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo._WorkReadOrWatched(A,B) 
        VALUES(${u.id},${w.id});
        `));       
    }
  });

  /***__UserFollows***/
  const __UserFollows = await prismaRemote.user.findMany({
    select: {
      id:true,
      followedBy: {
        select: { id: true },
      },
    }
  });  
  __UserFollows.forEach((u) => {
    for (let f of u.followedBy) {
      transactions.push(
        prismaLocal.$queryRaw(Prisma.sql`
        INSERT INTO dbo.__UserFollows(A,B) 
        VALUES(${u.id},${f.id});
        `));       
    }
  });

/***Notification***/
const Notification = await prismaRemote.notification.findMany();  
Notification.forEach((c) => {
  transactions.push(
    prismaLocal.$queryRaw(Prisma.sql`
    SET IDENTITY_INSERT dbo.Notification ON;
    INSERT INTO dbo.Notification(id,fromUserId,contextURL,message,created_at,updated_at) 
    VALUES(${c.id},${c.fromUserId},${c.contextURL},${c.message},${c.createdAt},${c.updatedAt});
    SET IDENTITY_INSERT dbo.Notification OFF;
  `));   
});

/***NotificationsOnUsers***/
const NotificationsOnUsers = await prismaRemote.notificationsOnUsers.findMany();  
NotificationsOnUsers.forEach((c) => {
  transactions.push(
    prismaLocal.$queryRaw(Prisma.sql`    
    INSERT INTO dbo.NotificationsOnUsers(userId,notificationId,viewed) 
    VALUES(${c.userId},${c.notificationId},${c.viewed});    
  `));   
});

/***UserCustomData***/
const UserCustomData = await prismaRemote.userCustomData.findMany();  
UserCustomData.forEach((c) => {
  transactions.push(
    prismaLocal.$queryRaw(Prisma.sql`
    SET IDENTITY_INSERT dbo.UserCustomData ON;
    INSERT INTO dbo.UserCustomData(id,name,password,identifier) 
    VALUES(${c.id},${c.name},${c.password},${c.identifier});
    SET IDENTITY_INSERT dbo.UserCustomData OFF;
  `));   
});


  try {
    await prismaLocal.$transaction(transactions);
  } catch (error) {
    console.error(error);
  } finally {
    prismaLocal.$disconnect();
  }
  console.log('DONE!');
}
 
if(true){
  console.log('running main')
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => {
      prismaRemote.$disconnect();
      prismaLocal.$disconnect();
    });
}
