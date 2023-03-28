import { atom } from 'jotai';

interface GlobalModalType {
  createPostModalOpened?: boolean;
  createWorkModalOpened?: boolean;
  editWorkModalOpened?: boolean;
  editPostModalOpened?: boolean;
  editPostId?:number;
  cacheKey?:string[];
  editCycleModalOpened?: boolean;
  editUserModalOpened?: boolean;
  signInModalOpened?: boolean;
  showToast: {
    type?: string;
    title: string;
    message: string;
    show: boolean;
    autohide?: boolean;
  };
  show:boolean;
  content:JSX.Element|null
}
const o: GlobalModalType = {
  createPostModalOpened: false,
  createWorkModalOpened: false,
  editWorkModalOpened: false,
  editPostModalOpened: false,
  editCycleModalOpened: false,
  editUserModalOpened: false,
  signInModalOpened: false,
  cacheKey:undefined,
  showToast: {
    type: 'info',
    title: '',
    message: '',
    show: false,
    autohide: true,
  },
  show:false,
  content:null
};
export default atom(o);
