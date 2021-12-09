// import { Cycle } from '@prisma/client';
import { Post } from '@prisma/client';
import { FunctionComponent } from 'react';
// import Spinner from 'react-bootstrap/Spinner';
// import { useQuery } from 'react-query';
import dayjs from 'dayjs'
import { CycleMosaicItem } from '../../types/cycle';
import { PostMosaicItem } from '../../types/post';
import Mosaic from '../Mosaic';

interface Props {
  cycle: CycleMosaicItem;
  display?: 'h' | 'v';
  showComments?: boolean;
  cacheKey: [string, string];
}

const PostsMosaic: FunctionComponent<Props> = ({ cycle, display, showComments, cacheKey }) => {
  // const { isLoading, isSuccess, data } = useQuery<PostMosaicItem[]>(
  //   ['posts.mosaic.cycle', cycle.id],
  //   async ({ queryKey: [, cycleId] }) => {
  //     const whereQP = encodeURIComponent(JSON.stringify({ cycles: { some: { id: cycleId } } }));
  //     const includeQP = encodeURIComponent(JSON.stringify({ creator: true, localImages: true, works: true }));
  //     const res = await fetch(`/api/search/posts?where=${whereQP}&include=${includeQP}`);

  //     return res.json();
  //   },
  // );
  const render = () => {
    // const res: Post[] = [];
    // const worksPost = cycle.posts.reduce((p, c) => {
    //   if (c.works.length) {
    //     const work = c.works[0];
    //     const idx = cycle.works.findIndex((w) => w.id === work.id);
    //     if (idx > -1) p.push(c);
    //   }
    //   return p;
    // }, res);
    // const cyclePosts = cycle.posts.filter((p) => !p.works.length);
    const orderedPosts = cycle.posts.sort((f, s) => {
      const fCD = dayjs(f.createdAt);
      const sCD = dayjs(s.createdAt);
      if (fCD.isAfter(sCD)) return -1;
      if (fCD.isSame(sCD)) return 0;
      return 1;
    });
    return (
      <>
        <Mosaic
          display={display}
          stack={orderedPosts as PostMosaicItem[]}
          postsLinksTo={cycle}
          showComments={showComments}
          cacheKey={cacheKey}
        />
        {/* <Mosaic
          display={display}
          stack={worksPost.sort((p, c) => (p.id > c.id && -1) || 1) as PostMosaicItem[]}
          // postsLinksTo={cycle}
          showComments={showComments}
          cacheKey={cacheKey}
        /> */}
      </>
    );
  };
  return (
    <>
      {/* {isLoading && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )} */}
      {render() || null}
    </>
  );
};

export default PostsMosaic;
