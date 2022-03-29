// import classNames from 'classnames';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
// import { setCookie } from 'nookies';
import { FunctionComponent, useState, useMemo } from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { AsyncTypeahead, Menu, MenuItem, TypeaheadResult } from 'react-bootstrap-typeahead';

import { AiOutlineSearch } from 'react-icons/ai';
// import Fuse from 'fuse.js';
import { useQueryClient } from 'react-query';
import { LocalImage, Work } from '@prisma/client';
import CycleTypeaheadSearchItem from './cycle/TypeaheadSearchItem';
import WorkTypeaheadSearchItem from './work/TypeaheadSearchItem';
import PostTypeaheadSearchItem from './post/TypeaheadSearchItem';
// import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL } from '../constants';
import {
  // Session,
  SearchResult,
  isCycleMosaicItem,
  isWorkMosaicItem,
  isPostMosaicItem
} from '../types';

import globalSearchEngineAtom from '../atoms/searchEngine';
import styles from './SearchEngine.module.css';
import { CycleMosaicItem } from '../types/cycle';
// import { WorkMosaicItem } from '../types/work';
// import { WorkMosaicItem } from '../types/work';
// import { CycleMosaicItem } from '../types/cycle';
import { PostMosaicItem } from '../types/post';
import { WorkMosaicItem } from '../types/work';
import useItems from '@/src/useItems'
import { debounce } from 'lodash';

// const { NEXT_PUBLIC_SITE_NAME: siteName } = process.env;
interface Props {
  className?: string;
}
const SearchEngine: FunctionComponent<Props> = ({ className = ''}) => {
  const [q, setQ] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  // const [session] = useSession() as [Session | null | undefined, boolean];
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation('searchEngine');

  // const [isSearchResultsLoading, setIsSearchResultsLoading] = useState(false);
  //const [searchResults, setSearchResults] = useState<SearchResult[]>();


  const {data:searchResults,isLoading:isSearchResultsLoading} = useItems(q,undefined,{enabled:!!q})
  
  const handleSearchWorkOrCycle = (t:string)=>{
    setQ(t);
  }
  
  const handleSearchWorkOrCycleDebounced = useMemo(()=>debounce(handleSearchWorkOrCycle,800),[])

  // const handleSearchWorkOrCycle = async (query: string) => {
  //   // setIsSearchResultsLoading(true);
  //   setQ(()=>query);
  //   setGlobalSearchEngineState({ ...globalSearchEngineState, q: ''});
  //   //const res = await fetch(`/api/searchEngine?q=${query}`);

  //   // const responseWork = await (await fetch(`/api/work/?q=${query}`)).json();
  //   // const responseCycle = await (await fetch(`/api/cycle/?q=${query}`)).json();
  //   // const responsePost = await (await fetch(`/api/post/?q=${query}`)).json();
  //   // const items: SearchResult[] = [
  //   //   ...((responseWork && responseWork.data) || []),
  //   //   ...((responseCycle && responseCycle.data) || []).map((i: CycleMosaicItem) => ({
  //   //     ...i,
  //   //     type: 'cycle',
  //   //   })),
  //   //   ...((responsePost && responsePost.data) || []).map((i: PostMosaicItem) => ({
  //   //     ...i,
  //   //     type: 'post',
  //   //   })),
  //   // ].sort((f, s) => {
  //   //   const fCD = dayjs(f.createdAt);
  //   //   const sCD = dayjs(s.createdAt);
  //   //   if (fCD.isAfter(sCD)) return -1;
  //   //   if (fCD.isSame(sCD)) return 0;
  //   //   return 1;
  //   // });;

  //   // setSearchResults(items);

    
    
  // };

  const handleSelectItem = (selected: SearchResult[]): void => {
    const searchResult = selected[0];
    if (searchResult != null) {
      const map: { [index: string]: string } = {
        movie: 'work',
        documentary: 'work',
        book: 'work',
        'fiction-book': 'work',
        cycle: 'cycle',
        post: 'post',
      };
      if ('type' in searchResult && searchResult.type) router.push(`/${map[searchResult.type]}/${searchResult.id}`);
    }
  };
  
  const onItemsFound = async () => {
    if(isSearchResultsLoading || !searchResults?.length)return;
    //queryClient.setQueryData(["ITEMS", q], searchResults);
    router.push(`/search?q=${q}`);
    
    /* let where= '';
    setGlobalSearchEngineState((res) => ({ ...res, show: true, where: '', itemsFound: [] }));
    
    if (!router.route.match('search')) {
      if (q) {
        where = encodeURIComponent(
          JSON.stringify({
            OR: [
              { title: { contains: q } },
              { contentText: { contains: q } },
            ],
          }),
        );
        setGlobalSearchEngineState((res) => ({ ...res, where }));
      }
      router.push('/search');
    } else if (q) {
      where = encodeURIComponent(
        JSON.stringify({
          OR: [
            { title: { contains: q } },
            { contentText: { contains: q } },
          ],
        }),
      );
      setGlobalSearchEngineState((res) => {
        
        const r = { ...res, where };
        return r;
      });
    } */
  };

  const labelKeyFn = (res: SearchResult) => {
     if ('title' in res)
      return `${res.title}`;
    return `${res.name}`;
  };

  const renderMenuItems = (results:TypeaheadResult<SearchResult>[])=>{
    const resultsWithOutPosts = results.filter(item=>item.type!=='post')
    
    return resultsWithOutPosts.slice(0,3).map((item, index) => (
      <MenuItem key={`${item.id}`} option={item} position={index}>
        {/* <Highlighter search={props.text}>{item}</Highlighter> */}
        {(isCycleMosaicItem(item) && (
          <CycleTypeaheadSearchItem cycle={item as CycleMosaicItem} />
        )) ||
          (isWorkMosaicItem(item) && (
            <WorkTypeaheadSearchItem work={item as WorkMosaicItem} />
          )) ||
          (isPostMosaicItem(item) && (
            <PostTypeaheadSearchItem post={item as PostMosaicItem} />
          ))
        }
      </MenuItem>
    ))
  }

  return (
    <div className={`${styles.container} ${className}`} data-cy="search-engine">
      <Form.Group>
        <InputGroup>
          {/* language=CSS */}
          <style jsx global>{`
            .rbt-input {
              border: solid #f5f5f5 1px !important;
              background: #f5f5f5;
            }
            .dropdown-menu {
              padding: 0 !important;
            }
          `}</style>
          <AsyncTypeahead
            id="create-post--search-work-or-cycle"
            // Bypass client-side filtering. Results are already filtered by the search endpoint
            filterBy={() => true}
            
            inputProps={{ required: true }}
            placeholder={t('Search')}
            isLoading={isSearchResultsLoading}
            labelKey={labelKeyFn}
            minLength={4}
            onSearch={handleSearchWorkOrCycleDebounced}
            options={searchResults||[]}
            onChange={handleSelectItem}
            ignoreDiacritics
            // renderMenuItemChildren={(searchResult) => {
            //   if (isCycleMosaicItem(searchResult)) {
            //     return <CycleTypeaheadSearchItem cycle={searchResult} />;
            //   }
            //   if (isWorkMosaicItem(searchResult)) {
            //     return <WorkTypeaheadSearchItem work={searchResult} />;
            //   }

            //   return null;
            // }}
            renderMenu={(results, menuProps) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
                <Menu {...menuProps}>
                  {renderMenuItems(results)}
                  {(results.length && (
                    // <Link href={`/search?q=${q}`} passHref>
                    //   <Button variant="light" className={styles.seeAllResults}>
                    //   <a>
                    //   {t('See all results')}
                    //   </a>
                    //   </Button>
                    // </Link>
                    // <MenuItem position={results.length} option={t('See all results')}>
                    // </MenuItem>                    
                    <a onClick={onItemsFound} className="cursor-pointer text-center d-block bg-light p-2" role="presentation">{t('See all results')}</a>
                    )) ||
                    ''}
                </Menu>
            )}
          />
          <InputGroup.Text className="text-white  cursor-pointer bg-primary">
            <Button 
            size="sm" 
            variant="link" 
            className="p-0 text-white text-decoration-none"
            onClick={onItemsFound}
            disabled={isSearchResultsLoading || !searchResults?.length}
            >
              
                <AiOutlineSearch />
              </Button>
            
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>

      {/* <Col>
          <Form>
            <Form.Group className={styles.formGroup}>
              <Form.Check inline type="checkbox" label="Cycles" onChange={(e) => handlerComboxesChange(e, 'cycle')} />
            </Form.Group>
            <Form.Group className={styles.formGroup}>
              <Form.Check inline type="checkbox" label="Eurekas" onChange={(e) => handlerComboxesChange(e, 'post')} />
            </Form.Group>
            <Form.Group className={styles.formGroup}>
              <Form.Check
                inline
                type="checkbox"
                label="Films"
                onChange={(e) => handlerComboxesChange(e, 'work-movie')}
              />
            </Form.Group>

            <Form.Group className={styles.formGroup} controlId="checkboxes">
              <Form.Check
                inline
                type="checkbox"
                label="Books"
                onChange={(e) => handlerComboxesChange(e, 'work-book')}
              />
            </Form.Group>
            <Form.Group className={styles.formGroup} controlId="checkboxes">
              <Form.Check
                inline
                type="checkbox"
                label="Fiction Books"
                onChange={(e) => handlerComboxesChange(e, 'work-fiction-book')}
              />
            </Form.Group>
          </Form>
        </Col> */}
    </div>
  );
};

export default SearchEngine;
