import usePosts, { getPosts } from './usePosts';
import useBackOffice from '@/src/useBackOffice';

//TODO ver de usar como  el detalle de las obrasss buscar eurekas de una  sola obra

const featuredWorksPostsWhere = (id: number) => ({
  take:4,
  where: {
    works: {
      some: {
        id: id,
      },
    },
  },
});

const useFeaturedWorksPostsImages = (id: number) => {
  const { data: bo } = useBackOffice();

  const { data: dataFeaturedWorksPosts } = usePosts(featuredWorksPostsWhere(id), { enabled: !!id });

  let images: any[] = [];
  if (dataFeaturedWorksPosts && dataFeaturedWorksPosts.posts.length) {
    images = dataFeaturedWorksPosts.posts.map((x) => ({id:x.id,storedFile:x.localImages[0].storedFile}));
  }
  return { data: images };
};

export default useFeaturedWorksPostsImages;
