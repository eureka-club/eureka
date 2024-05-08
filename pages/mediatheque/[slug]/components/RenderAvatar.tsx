import { useSession } from "next-auth/react";
import { SyntheticEvent } from "react";
import LocalImageComponent from '@/src/components/LocalImage';

const RenderAvatar = () => {
    const{data:session}=useSession();
    const user=session?.user;

    const avatarError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = '/img/default-avatar.png';
    };

    if (user) {
      if (!user?.photos || !user?.photos.length)
        return (
          <img
            onError={avatarError}
            className="avatar"
            src={user.image || '/img/default-avatar.png'}
            alt={user.name || ''}
          />
        );
      return (
        <>
          <div className="d-flex d-md-none mb-2">
            <LocalImageComponent
              className="rounded rounded-circle"
              /* className='avatar' */ width={65}
              height={65}
              filePath={`users-photos/${user.photos[0].storedFile}`}
              alt={user.name || ''}
            />
          </div>
          <div className="d-none d-md-flex">
            <LocalImageComponent
              className="rounded rounded-circle"
              /* className='avatar' */ width={160}
              height={160}
              filePath={`users-photos/${user.photos[0].storedFile}`}
              alt={user.name || ''}
            />
          </div>
        </>
      );
    }
    return <></>;
};
export default RenderAvatar; 