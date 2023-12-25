"use client"

// import React, { useState, FunctionComponent,useEffect } from 'react';
// import { Tab, Tabs} from 'react-bootstrap';

// import SearchTabWorks from './SearchTabWorks';
// import SearchTabPosts from './SearchTabPosts';
// import SearchTabCycles from './SearchTabCycles';
// import { t } from '../get-dictionary';
// import { useDictContext } from '../hooks/useDictContext';
// import { useSearchParams } from 'next/navigation';

// interface Props{
//   hasCycles:boolean;
//   hasPosts:boolean;
//   hasWorks:boolean;


// }

// const SearchTab: FunctionComponent<Props> = ({hasCycles,hasPosts,hasWorks}) => {
//   const query = useSearchParams();
//   const {dict}=useDictContext()

//   const [key, setKey] = useState<string>('cycles');

//   useEffect(()=>{
//     setKey(
//       hasCycles 
//       ? 'cycles'
//       : hasPosts ? 'posts' : 'works'
//     )
//   },[hasCycles,hasPosts,hasWorks]);

//   // const renderTab = (k:string)=>{
//   //   switch(k){
//   //     case 'posts':
//   //       return <SearchTabPosts />
//   //     case 'works':
//   //         return <SearchTabWorks />
//   //     case 'cycles':
//   //       return <SearchTabCycles />
//   //   }
//   //   return ''
//   // }

//   return <div>
//     {/* language=CSS */}
//     <style jsx global>
//                   {`
//                     .nav-tabs .nav-item.show .nav-link,
//                     .nav-tabs .nav-link.active,
//                     .nav-tabs .nav-link:hover {
//                       background-color: var(--bs-primary);
//                       color: white !important;
//                       border: none !important;
//                       border-bottom: solid 2px var(--bs-primary) !important;
//                     }
//                     .nav-tabs {
//                       border: none !important;
//                       border-bottom: solid 1px var(--bs-primary) !important;
//                     }
//                     .nav-link{
//                         color:var(--bs-primary)
//                     }
//                   `}
//                 </style>

//         {query.get('x')
//           ? <Tabs  
//               defaultActiveKey={key}
//               activeKey={key}
//               onSelect={(k) => setKey(k!)}
//               className="mt-5"
//             >

//               {hasCycles ? <Tab eventKey="cycles" data-cy="tab-cycles" title={t(dict,'cycles')}  className={`cursor-pointer`}>
//                 <SearchTabCycles/>
//               </Tab> : <></>}
//               {hasPosts ? <Tab eventKey="posts" data-cy="tab-posts" title={t(dict,'posts')} className={`cursor-pointer`}>
//                 <SearchTabPosts/>
//               </Tab> : <></>}
//               {hasWorks ? <Tab eventKey="works" data-cy="tab-works" title={t(dict,'works')} className={`cursor-pointer`}>
//                 <SearchTabWorks />
//               </Tab>:<></>}
//             </Tabs>
//           :<></>
//         }
//   </div>
// };
// export default SearchTab;


import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Button } from '@mui/material';
import { useSearchParams } from 'next/navigation';

function samePageLinkNavigation(
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
) {
  if (
    event.defaultPrevented ||
    event.button !== 0 || // ignore everything but left-click
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  ) {
    return false;
  }
  return true;
}

interface LinkTabProps {
  label?: string;
  href?: string;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        // Routing libraries handle this, you can remove the onClick handle when using them.
        if (samePageLinkNavigation(event)) {
          event.preventDefault();
        }
      }}
      {...props}
    />
  );
}
interface Props {
  value: number;
}
export default function SearchTab(props: Props) {
  const [value, setValue] = React.useState(props.value);
  const searchParams = useSearchParams();
  const q = searchParams.toString();

  return (

    <Box sx={{ width: '100%' }} className="d-flex gap-1 justify-content-center justify-content-sm-start">
      <Button className="mx-31" variant="outlined" disabled={value == 0} href={`/search/cycle?${q}`}>Cycle</Button>
      <Button className="mx-31" variant="outlined" disabled={value == 1} href={`/search/post?${q}`}>Posts</Button>
      <Button className="mx-31" variant="outlined" disabled={value == 2} href={`/search/work?${q}`}>Works</Button>
    </Box>
  );
}
