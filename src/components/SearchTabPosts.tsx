"use client"

import { useState, FunctionComponent } from 'react';
import MosaicItem from '@/src/components/post/MosaicItem'
import useFilterEnginePosts from '@/src/hooks/useFilterEnginePosts';
import { Prisma } from '@prisma/client';
import { PostMosaicItem } from '@/src/types/post';
import { useSearchParams } from 'next/navigation';
import { Grid } from '@mui/material';
interface Props{
  posts:PostMosaicItem[]
}
const SearchTabPosts:FunctionComponent<Props> = ({posts}) => {
  const {FilterEnginePosts,filtersCountries,hasChangedFiltersCountries} = useFilterEnginePosts()

  let postsFiltered = [...posts];

  if(hasChangedFiltersCountries && filtersCountries){
    if(filtersCountries.length){
      postsFiltered = postsFiltered.filter(w=>{
        return w.creator.countryOfOrigin && filtersCountries.includes(w.creator.countryOfOrigin);
      })
    }
  }

  const renderPosts=()=>{
    if(posts)
      return <>
        <FilterEnginePosts/>
        <Grid container className='justify-content-center justify-content-sm-between column-gap-4'>
            {postsFiltered?.map(p=><Grid item  className="mb-5 d-flex justify-content-center  align-items-center" key={p.id} sx={{
              '@media (min-width: 800px)':{
                ':last-child':{marginRight:'auto'}
              }
            }}>
              <MosaicItem post={p} postId={p.id} className="" imageLink={true} cacheKey={['POST',p.id.toString()]} size={'md'}  /></Grid>)}
        </Grid>
      </>
      return <></>
  }

  return renderPosts()
};
export default SearchTabPosts;


// import { useState, FunctionComponent, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { Spinner,Row, Col} from 'react-bootstrap';

// import MosaicItem from '@/src/components/post/MosaicItem'


// import { useInView } from 'react-intersection-observer';
// import { Prisma } from '@prisma/client';
// import { PostMosaicItem } from '@/src/types/post';
// import useFilterEnginePosts from '@/src/hooks/useFilterEnginePosts';
// import usePosts, { getPosts } from '@/src/hooks/usePosts';
// import { useDictContext } from '../hooks/useDictContext';

// const take = 8;
// interface Props{
// }
// const SearchTabPosts:FunctionComponent<Props> = ({}) => {
//   // const { t,lang } = useTranslation('common');
//   const {dict,langs}=useDictContext()
//   const router = useRouter();
//   const terms = router?.query.q?.toString()!.split(" ") || [];
//   const cacheKey = `posts-search-${router?.query.q?.toString()}`
//   const {FilterEnginePosts,filtersCountries} = useFilterEnginePosts()

//   const getProps = ()=>{
//     const res:Prisma.PostWhereInput = {
//       OR:[
//         {
//           AND:terms.map(t=>(
//             { 
//               title: { contains: t } 
//             }
//           ))
  
//         },
//         {
//           AND:terms.map(t=>(
//             { 
//               contentText: { contains: t } 
//             }
//           ))
  
//         },
//         {
//           AND:terms.map(t=>(
//             { 
//                 tags: { contains: t } 
//             }
//           ))
//         },
//         {
//           AND:terms.map(t=>(
//             { 
//                 topics: { contains: t } 
//             }
//           ))
//         }
//       ],
//     }
//     if(filtersCountries && filtersCountries.length){
//       res.AND = {
//         creator:{
//           countryOfOrigin:{
//             in:(filtersCountries as string[])
//           }
//         }
//       }
//     }
//     return res;
//   };

//   const [props,setProps]=useState<Prisma.PostFindManyArgs>({take,where:{...getProps()}})

//   const {data:{total,fetched,posts:c}={total:0,fetched:0,posts:[]}} = usePosts(langs,props,{cacheKey,enabled:!!router.query?.q});
//   const [posts,setPosts] = useState<PostMosaicItem[]>([])
  
//   useEffect(()=>{

//     let props: Prisma.PostWhereInput|undefined = undefined;
//     if(router.query.q && (filtersCountries)){
//       props = getProps();
//     }
//     if(props){
//       setProps(s=>({...s,where:{...props}}))
//     }
//   },[filtersCountries,router.query.q])

//   useEffect(()=>{
//     if(c)setPosts(c)
//   },[c])

//   const [ref, inView] = useInView({
//     triggerOnce: false,
//   });

//   useEffect(()=>{
//     if(posts && inView && posts.length < total){
//       const fi = async ()=>{
//         const {id} = posts.slice(-1)[0]
//         const r = await getPosts(langs,{...props,skip:1,cursor:{id}});
//         setPosts((c: any)=>[...c,...r.posts])
//       }
//       fi()
//     }
//   },[inView])

//   const renderPosts=()=>{
//     if(posts)
//       return       <>

//           <FilterEnginePosts/>
//           <Row>
//               {posts.map(p=><Col xs={12} sm={6} lg={3} xxl={2} className="mb-5 d-flex justify-content-center  align-items-center" key={p.id}>
//                 <MosaicItem post={p} postId={p.id} className="" imageLink={true} cacheKey={['POST',p.id.toString()]} size={'md'} />
//                 </Col>)}
//         </Row>
//         {posts?.length!=total && <Spinner ref={ref} animation="grow" />}
//       </>
//       return <></>
//   }

//   return renderPosts()
// };
// export default SearchTabPosts;