"use client"
import { useSession } from 'next-auth/react';
import { MouseEvent, FunctionComponent, useState, useRef, createRef } from 'react';

import { Button, Col, Row, Form } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useAtom } from 'jotai';
import { Cycle, Work } from '@prisma/client';
import styles from './CycleDetailDiscussionSuggestRelatedWork.module.css';
import { WorkMosaicItem } from '@/src/types/work';
import { CycleDetail } from '@/src/types/cycle';
import useWorks from '@/src/hooks/useWorks';
import globalModalsAtom from '@/src/atoms/globalModals';
import WorkTypeaheadSearchItem from '@/src/components/work/TypeaheadSearchItem';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDictContext } from '@/src/hooks/useDictContext';

import AsyncTypeaheadType from 'react-bootstrap-typeahead/types/core/Typeahead';
import { Option } from 'react-bootstrap-typeahead/types/types';

interface Props {
  cycle: CycleDetail;
}

const CycleDetailDiscussionCreateEurekaForm: FunctionComponent<Props> = ({ cycle }) => {
  const queryClient = useQueryClient();
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const typeaheadRef = createRef<AsyncTypeaheadType>();

  const [isWorkSearchLoading, setIsWorkSearchLoading] = useState(false);
  const [workSearchResults, setWorkSearchResults] = useState<WorkMosaicItem[]>([]);
  const [workSearchHighlightedOption, setWorkSearchHighlightedOption] = useState<WorkMosaicItem | null>(null);
  const [includedWorksIds, setIncludedWorksIds] = useState<number[]>();
  const {data:session} = useSession();
  const{t,dict}=useDictContext();

  const { mutate: addWorkToCycle, isPending: isAddingWorkToCycle } = useMutation(
    {
      mutationFn:async (): Promise<Cycle | null> => {
        const res = await fetch(`/api/cycle/${cycle.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: cycle.id, includedWorksIds }),
        });
  
        const json = await res.json();
        if (json.ok) {
          return {...json,type:'cycle'};
        }
  
        return null;
      },
      onMutate: async () => {
        const cacheKey = ['CYCLE', `${cycle.id}`];
        // await queryClient.cancelQueries(cacheKey);
        const previewsItems = queryClient.getQueryData<CycleDetail[]>(cacheKey);
        // const eureka: Pick<Post, 'title' | 'language' | 'contentText' | 'isPublic'> = newEureka;

        // queryClient.setQueryData<Item[]>(cacheKey, (prev) => prev!.concat(eureka));
        return { previewsItems, cacheKey };
      },
      onSettled: (_eureka, error, _variables, context) => {
        if (error) {
          if (context) {
            queryClient.setQueryData(context.cacheKey, context.previewsItems);
          }
        }
        if (context) queryClient.invalidateQueries({queryKey:context.cacheKey});
        queryClient.invalidateQueries({queryKey:['WORKS',JSON.stringify({where:{cycles: { some: { id: cycle?.id } } }})]})
      },
    },
  );

 
  const [worksFilteredQuery,setWorksFilteredQuery] = useState('')
  
  const {data} = useWorks({
    where:{
      AND:[
        {
          id:{
            notIn:cycle.cycleWorksDates.map(w=>w.workId!)
          }
        },
        {
          OR:[
            {
                title: { contains: worksFilteredQuery } 
            },
            {
                contentText: { contains: worksFilteredQuery } 
            },
          ]
        }
      ]
    },
  })

  const handleSearchWork = async (query: string) => {
    setIsWorkSearchLoading(true);
    setWorksFilteredQuery(query)
    setIsWorkSearchLoading(false);
  };

  const handleSearchWorkHighlightChange = ({
    activeIndex,
    results,
  }: {
    activeIndex: number;
    results: WorkMosaicItem[];
  }) => {
    if (activeIndex !== -1) {
      // wait for component rendering with setTimeout(fn, undefinded)
      setTimeout(() => setWorkSearchHighlightedOption(results[activeIndex]));
    }
  };

  const handleSearchWorkSelect = (selected: Option[]): void => {
    if (selected[0] != null) {
      // setSelectedWorksForCycle([...selectedWorksForCycle, selected[0]]);
      setIncludedWorksIds(() => [(selected[0] as Work).id]);
      // setAddWorkModalOpened(false);
    }
  };

  const handleWorkSearchAppend = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    // if (workSearchHighlightedOption != null) {
    //   setSelectedWorksForCycle([...selectedWorksForCycle, workSearchHighlightedOption]);
    //   // setAddWorkModalOpened(false);
    // }
    addWorkToCycle();
  };

  const handleCreateWorkClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    setGlobalModalsState({ ...globalModalsState, ...{ createWorkModalOpened: true } });
  };

  return (
    <>
      <Form as={Row} className="mb-5">
        <Col sm={{ span: 7 }}>
          <Form.Group controlId="cycle">
            {/* <Form.Label>{t('Select work')}:</Form.Label> */}

            {/* language=CSS */}
            <style jsx global>{`
              .rbt-menu {
                background-color: #d0f7ed;
                min-width: 468px;
              }
            `}</style>
            <AsyncTypeahead
              id="create-cycle--search-work"
              // Bypass client-side filtering. Results are already filtered by the search endpoint
              filterBy={() => true}
              inputProps={{ required: true }}
              placeholder={t(dict,'Select work')}
              ref={typeaheadRef}
              isLoading={isWorkSearchLoading}
              labelKey={(res) => `${(res as {title:string}).title}`}
              minLength={2}
              onSearch={handleSearchWork}
              options={data?.works||[]}
              onChange={handleSearchWorkSelect}
              renderMenuItemChildren={(work) => <WorkTypeaheadSearchItem work={work as WorkMosaicItem} />}
            >
              {/* @ts-ignore*/}
              {handleSearchWorkHighlightChange}
            </AsyncTypeahead>
          </Form.Group>
        </Col>
        <Col sm={{ span: 5 }}>
          <Button
            onClick={handleWorkSearchAppend}
            variant="warning"
            //  block
            type="button"
            className={styles.suggestButton}
          >
            {t(dict,'Suggest work')}
          </Button>
        </Col>
      </Form>
      {session?.user.roles.includes('admin') && (
        <Row>
          <Col>
            <h5 className={styles.addWorkInfo}>
              <em>{t(dict,"Didn't find the work you were looking for? You can add it to our library!")}</em>
            </h5>
          </Col>
          <Col>
            <Button
              onClick={handleCreateWorkClick}
              variant="warning"
              //  block
              type="button"
              className={styles.addButton}
            >
              {t(dict,'Create work')}
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export default CycleDetailDiscussionCreateEurekaForm;
