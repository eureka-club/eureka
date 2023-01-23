import { GetServerSideProps } from "next";
import {findAll as findAllCycles} from '@/src/facades/cycle'
import {findAll as findAllWoks} from '@/src/facades/work'
import {findAll as findAllPosts} from '@/src/facades/post'
import { PostMosaicItem } from "@/src/types/post";

const {NEXT_PUBLIC_WEBAPP_URL:origin}=process.env;

const generateCyclesMap = async ()=>{
  const cycles = await findAllCycles({
    select:{id:true,title:true,contentText:true}
  })
  return cycles.map(c=>`<url>
    <loc>${`${origin}/cycle/${c.id}`}</loc>
  </url>`).join('')
}

const generateWorksMap = async ()=>{
  const works = await findAllWoks({
    select:{id:true,title:true,contentText:true}
  })
  return works.map(w=>`<url>
    <loc>${`${origin}/work/${w.id}`}</loc>
  </url>`).join('')
}

const generatePostsMap = async ()=>{
  const posts = await findAllPosts({
    select:{id:true,title:true,contentText:true,cycles:{select:{id:true}},works:{select:{id:true}}}
  })
  const getParentData  = (p:PostMosaicItem)=>{
    if(p.cycles.length){
      return ['cycle',p.cycles[0].id] 
    } 
    else if(p.works.length){
      return ['work',p.works[0].id]
    }
    return undefined
  }
    return posts.reduce<string[]>((res,p)=>{
      const parent = getParentData(p)
      if(parent)
        res.push(`<url>
        <loc>${`${origin}/${parent[0]}/${parent[1]}/post/${p.id}`}</loc>
      </url>`)
      return res;
    },[]).join('')

  }


const generateSiteMap = async () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>${origin!}</loc>
     </url>
     ${await generateCyclesMap()}
     ${await generateWorksMap()}
     ${await generatePostsMap()}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const  getServerSideProps:GetServerSideProps = async (ctx)=> {
  const {res} = ctx;
  const sitemap = await generateSiteMap();

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;