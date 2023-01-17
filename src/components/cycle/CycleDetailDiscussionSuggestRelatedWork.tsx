import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { MouseEvent, FunctionComponent, useState, useRef } from 'react';

import { Button, Col, Row, Form } from 'react-bootstrap';
import { DropdownItemProps } from 'react-bootstrap/DropdownItem';

// import { BsCheck } from 'react-icons/bs';
// import { ImCancelCircle } from 'react-icons/im';
import { useMutation, useQueryClient } from 'react-query';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useAtom } from 'jotai';
import { Cycle, Work } from '@prisma/client';
import styles from './CycleDetailDiscussionSuggestRelatedWork.module.css';
// import { Session } from '../../types';
import { WorkMosaicItem } from '../../types/work';
import { CycleMosaicItem } from '../../types/cycle';
import useWorks from '@/src/useWorks';
import globalModalsAtom from '../../atoms/globalModals';
// import ImageFileSelect from '../forms/controls/ImageFileSelect';
// import TagsInputTypeAhead from '../forms/controls/TagsInputTypeAhead';
// import stylesImageFileSelect from '../forms/CreatePostForm.module.css';

import WorkTypeaheadSearchItem from '../work/TypeaheadSearchItem';

// import styles from './CycleDetailDiscussionCreateEurekaForm.module.css';

interface Props {
  cycle: CycleMosaicItem;
}

const CycleDetailDiscussionCreateEurekaForm: FunctionComponent<Props> = ({ cycle }) => {
  const queryClient = useQueryClient();
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const typeaheadRef = useRef<AsyncTypeahead<WorkMosaicItem>>(null);
  const [isWorkSearchLoading, setIsWorkSearchLoading] = useState(false);
  const [workSearchResults, setWorkSearchResults] = useState<WorkMosaicItem[]>([]);
  const [workSearchHighlightedOption, setWorkSearchHighlightedOption] = useState<WorkMosaicItem | null>(null);
  // const [selectedWorksForCycle, setSelectedWorksForCycle] = useState<WorkMosaicItem[]>([]);
  const [includedWorksIds, setIncludedWorksIds] = useState<number[]>();
  const {data:session} = useSession();
  const { t } = useTranslation('cycleDetail');

  // const [newEurekaImageFile, setNewEurekaImageFile] = useState<File | null>(null);
  // const { data: topics } = useTopics();
  // const [eurekaTopics, setEurekaTopics] = useState<string[]>([]);
  // const [newEureka, setNewEureka] = useState({
  //   selectedCycleId: cycle.id,
  //   selectedWorkId: 0,
  //   title: '',
  //   image: null,
  //   language: cycle.languages,
  //   contentText: '',
  //   isPublic: cycle.isPublic,
  //   topics: eurekaTopics,
  // });

  // const clearCreateEurekaForm = () => {
  //   setEurekaTopics(() => []);
  //   setNewEurekaImageFile(null);
  //   setNewEureka((res) => ({
  //     ...res,
  //     title: '',
  //     image: null,
  //     contentText: '',
  //     topics: eurekaTopics,
  //   }));
  // };

  const { mutate: addWorkToCycle, isLoading: isAddingWorkToCycle } = useMutation(
    async (): Promise<Cycle | null> => {debugger;
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
    {
      onMutate: async () => {
        const cacheKey = ['CYCLE', `${cycle.id}`];
        // await queryClient.cancelQueries(cacheKey);
        const previewsItems = queryClient.getQueryData<CycleMosaicItem[]>(cacheKey);
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
        if (context) queryClient.invalidateQueries(context.cacheKey);
        queryClient.invalidateQueries(['WORKS',JSON.stringify({where:{cycles: { some: { id: cycle?.id } } }})])
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

  const handleSearchWorkSelect = (selected: WorkMosaicItem[]): void => {
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
              placeholder={t('Select work')}
              ref={typeaheadRef}
              isLoading={isWorkSearchLoading}
              labelKey={(res) => `${res.title}`}
              minLength={2}
              onSearch={handleSearchWork}
              options={data?.works||[]}
              onChange={handleSearchWorkSelect}
              renderMenuItemChildren={(work) => <WorkTypeaheadSearchItem work={work} />}
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
            {t('Suggest work')}
          </Button>
        </Col>
      </Form>
      {session?.user.roles.includes('admin') && (
        <Row>
          <Col>
            <h5 className={styles.addWorkInfo}>
              <em>{t("Didn't find the work you were looking for? You can add it to our library!")}</em>
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
              {t('Create work')}
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export default CycleDetailDiscussionCreateEurekaForm;
