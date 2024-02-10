import { GetServerSideProps } from "next";
import {findAll as findAllCycles} from '@/src/facades/cycle'
import {findAll as findAllWoks} from '@/src/facades/work'
import {findAll as findAllPosts} from '@/src/facades/post'
import { PostDetail } from "@/src/types/post";
import { Session } from "@/src/types";
import { getSession } from "next-auth/react";

const {NEXT_PUBLIC_WEBAPP_URL:origin}=process.env;
const languages = [
  // ['es','es-ES'],
  ['en','en-US'],
  ['fr','fr-FR'],
  ['pt','pt-BR'],
]
const dateFormat = (date:Date,locale:string) => new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'long'}).format(date)

const generateCyclesMap = async ()=>{
  const cycles = await findAllCycles(null,{})
  return cycles.map(c=>{
    return languages.map(l=>{
      return `<url>
    <loc>${`${origin}/${l[0]}/cycle/${c.id}`}</loc>
    <lastmod>${dateFormat(c.updatedAt,l[1])}</lastmod>
    <priority>1</priority>
   </url>`
    }).join('')
  }).join('')
}

const generateWorksMap = async (locale:string, session:Session|null)=>{
  const works = await findAllWoks(locale,session)
  return works.map(w=>{
    return languages.map(l=>{
      return `<url>
        <loc>${`${origin}/${l[0]}/work/${w.id}`}</loc>
        <lastmod>${dateFormat(w.updatedAt,l[1])}</lastmod>
        <priority>0.9</priority>
      </url>`
    }).join('')
  }).join('')
}

const generatePostsMap = async ()=>{
  const posts = await findAllPosts(null,{})
  const getParentData  = (p:PostDetail)=>{
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
      if(parent){
        languages.forEach(l=>{
          res.push(`<url>
          <loc>${`${origin}/${l[0]}/${parent[0]}/${parent[1]}/post/${p.id}`}</loc>
          <lastmod>${dateFormat(p.updatedAt,l[1])}</lastmod>
          <priority>0.8</priority>
        </url>`)
        })
      }
      return res;
    },[]).join('')
  }

  const generateHomePage = ()=>{
    return `
      <url>
        <loc>${origin!}</loc>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
      </url>
    `;
  }

  const generateStaticPages = ()=>{
    const staticPages = ['manifest','about','aboutUs','policy'] 
    return languages.map(l=>{
      return staticPages.map(sp=>{
        return `
          <url>
              <loc>${origin!}/${l[0]}/${sp}</loc>
              <priority>0.9</priority>
            </url>
        `
      }).join('')
    }).join('')
  }

const generateSiteMap = async (locale:string,session:Session|null) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${generateHomePage()}
  ${generateStaticPages()}
  ${await generateCyclesMap()}
  ${await generateWorksMap(locale,session)}
  ${await generatePostsMap()}
  </urlset>
  `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const  getServerSideProps:GetServerSideProps = async (ctx)=> {
  const {req,res} = ctx;
  const session=await getSession({req});
  const sitemap = await generateSiteMap(ctx?.locale??"es",session);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;