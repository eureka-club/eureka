import { FC } from "react";
import MosaicItemCycle from '../cycle/MosaicItem';
import MosaicItemPost from '../post/MosaicItem';
import MosaicItemWork from '../work/MosaicItem';
// import MosaicUserItem from '../user/MosaicItem';

import { PostDetail } from '../../types/post';
import { isCycleMosaicItem, isWorkMosaicItem, isPostMosaicItem, isUserMosaicItem } from '../../types';
import { GenericMosaicItemProps } from "./types";
import { WorkSumary } from "@/src/types/work";

const GenericMosaicItem:FC<GenericMosaicItemProps> = ({
      item,
      showSocialInteraction = true,
      cacheKey,
      customMosaicStyle,
      size,
      userMosaicDetailed
    }) => {
    if (isCycleMosaicItem(item)) {
      return (
        // <CycleContext.Provider key={`cycle-${item.id}`} value={{ cycle: item as CycleDetail }}>
          <MosaicItemCycle detailed cacheKey={cacheKey} cycle={item} cycleId={item.id} showSocialInteraction={showSocialInteraction} showButtonLabels={false} size={size}/>
        // </CycleContext.Provider>
      );
    }
    else if (isPostMosaicItem(item) || (item && item.type == 'post')) {
      const it: PostDetail = item as PostDetail;
      return <MosaicItemPost cacheKey={cacheKey} key={`post-${it.id}`} post={it} postId={it.id} size={size} />;
    }
    else if (isWorkMosaicItem(item)) {
      const item_ = item as WorkSumary;
      return (
        <MosaicItemWork
          showSocialInteraction={showSocialInteraction}
          showButtonLabels={false}
          work={item_}
          workId={item_.id}
          style={customMosaicStyle}
          size={size}
        />
      );
    }
    // if (isUserMosaicItem(item)) {
    //   return <MosaicUserItem user={item} key={`user-${item.id}`} showSocialInteraction={false} MosaicDetailed={userMosaicDetailed} />;
    // }
    return <></>;
  };
  export default GenericMosaicItem
  