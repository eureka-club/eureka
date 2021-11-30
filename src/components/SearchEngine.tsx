// import classNames from 'classnames';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
// import { setCookie } from 'nookies';
import { FunctionComponent, useState } from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { AsyncTypeahead, Menu, MenuItem } from 'react-bootstrap-typeahead';

import { AiOutlineSearch } from 'react-icons/ai';
// import Fuse from 'fuse.js';
import { useQueryClient } from 'react-query';
import { LocalImage, Work } from '@prisma/client';
import CycleTypeaheadSearchItem from './cycle/TypeaheadSearchItem';
import WorkTypeaheadSearchItem from './work/TypeaheadSearchItem';

// import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL } from '../constants';
import {
  // Session,
  SearchResult,
  isCycleMosaicItem,
  isWorkMosaicItem,
} from '../types';

import globalSearchEngineAtom from '../atoms/searchEngine';
import styles from './SearchEngine.module.css';
import { CycleMosaicItem } from '../types/cycle';
// import { WorkMosaicItem } from '../types/work';
// import { WorkMosaicItem } from '../types/work';
// import { CycleMosaicItem } from '../types/cycle';
import { PostMosaicItem } from '../types/post';
import { WorkMosaicItem } from '../types/work';


// const { NEXT_PUBLIC_SITE_NAME: siteName } = process.env;
interface Props {
  className?: string;
}
const SearchEngine: FunctionComponent<Props> = ({ className = ''}) => {
  const [q, setQ] = useState<string>('');
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  // const [session] = useSession() as [Session | null | undefined, boolean];
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation('searchEngine');

  const [isSearchWorkOrCycleLoading, setIsSearchWorkOrCycleLoading] = useState(false);
  const [searchWorkOrCycleResults, setSearchWorkOrCycleResults] = useState<SearchResult[]>([]);

  const handleSearchWorkOrCycle = async (query: string) => {
    setSearchWorkOrCycleResults([]);

    setIsSearchWorkOrCycleLoading(true);
    
    setQ(query);
    const responseWork = await (await fetch(`/api/work/?q=${query}`)).json();
    const responseCycle = await (await fetch(`/api/cycle/?q=${query}`)).json();
    const responsePost = await (await fetch(`/api/post/?q=${query}`)).json();
    const items: SearchResult[] = [
      ...((responseWork && responseWork.data) || []),
      ...((responseCycle && responseCycle.data) || []).map((i: CycleMosaicItem) => ({
        ...i,
        type: 'cycle',
      })),
      ...((responsePost && responsePost.data) || []).map((i: PostMosaicItem) => ({
        ...i,
        type: 'post',
      })),
    ].sort((f, s) => {
      const fCD = dayjs(f.createdAt);
      const sCD = dayjs(s.createdAt);
      if (fCD.isAfter(sCD)) return -1;
      if (fCD.isSame(sCD)) return 0;
      return 1;
    });;

    setSearchWorkOrCycleResults(items);
    setIsSearchWorkOrCycleLoading(false);
    setGlobalSearchEngineState({ ...globalSearchEngineState, q: ''});
    
  };

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
  
  const onItemsFound = async () => {debugger;
    queryClient.setQueryData(["ITEMS", q], searchWorkOrCycleResults);
    if(globalSearchEngineState.itemsFound){
      router.push(`/search?q=${q}`);
    }
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
        debugger;
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

  return (
    <div className={`${styles.container} ${className}`}>
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
            maxResults={2}
            inputProps={{ required: true }}
            placeholder={t('Search')}
            isLoading={isSearchWorkOrCycleLoading}
            labelKey={labelKeyFn}
            minLength={5}
            onSearch={handleSearchWorkOrCycle}
            options={searchWorkOrCycleResults}
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
                {results.map((item, index) => (
                  <MenuItem key={`${item.id}`} option={item} position={index}>
                    {/* <Highlighter search={props.text}>{item}</Highlighter> */}
                    {(isCycleMosaicItem(results[index]) && (
                      <CycleTypeaheadSearchItem cycle={results[index] as CycleMosaicItem} />
                    )) ||
                      (isWorkMosaicItem(results[index]) && (
                        <WorkTypeaheadSearchItem work={results[index] as WorkMosaicItem} />
                      ))}
                  </MenuItem>
                ))}
                {(results.length && (
                  // <Link href={`/search?q=${q}`} passHref>
                  //   <Button variant="light" className={styles.seeAllResults}>
                  //   <a>
                  //   {t('See all results')}
                  //   </a>
                  //   </Button>
                  // </Link>
                  // <MenuItem position={results.length} option={t('See all results')}>
                    <a onClick={onItemsFound} className="cursor-pointer text-center d-block bg-light p-2" role="presentation">{t('See all results')}</a>
                  // </MenuItem>
                )) ||
                  t('Not found')}
              </Menu>
            )}
          />
          <InputGroup.Text className="text-white  cursor-pointer bg-primary">
            <Link href={`/search?q=${q}`}>
              <a className="text-white" onClick={onItemsFound} role="presentation">
                <AiOutlineSearch />
              </a>
            </Link>
            
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
