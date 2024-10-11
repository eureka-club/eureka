import { FC } from "react";
import MosaicItemCycle from '../cycle/MosaicItem';
import MosaicItemPost from '../post/MosaicItem';
import MosaicItemWork from '../work/MosaicItem';
import { PostSumary } from '../../types/post';
import { isCycleMosaicItem, isWorkMosaicItem, isPostMosaicItem } from '../../types';
import { GenericMosaicItemProps } from "./types";
import { WorkSumary } from "@/src/types/work";

const GenericMosaicItem:FC<GenericMosaicItemProps> = ({
      item,
      showSocialInteraction = true,
      cacheKey,
      customMosaicStyle,
      size,
      userMosaicDetailed,
      ...others
    }) => {
    if (isCycleMosaicItem(item)) {
      return (
        // <CycleContext.Provider key={`cycle-${item.id}`} value={{ cycle: item as CycleDetail }}>
          <MosaicItemCycle cycleId={item.id} size={size} {...others} />
        // </CycleContext.Provider>
      );
    }
    else if (isPostMosaicItem(item) || (item && item.type == 'post')) {
      const it = item as PostSumary;
      return <MosaicItemPost  key={`post-${it.id}`}  postId={it.id} size={size} {...others} />;
    }
    else if (isWorkMosaicItem(item)) {
      const item_ = item as WorkSumary;
      return (
        <MosaicItemWork
          workId={item_.id}
          style={customMosaicStyle}
          size={size}
          {...others}
        />
      );
    }
    // if (isUserMosaicItem(item)) {
    //   return <MosaicUserItem user={item} key={`user-${item.id}`} showSocialInteraction={false} MosaicDetailed={userMosaicDetailed} />;
    // }
    return <></>;
  };
  export default GenericMosaicItem
  