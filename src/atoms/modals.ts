import { atom } from 'jotai';

interface GlobalModalType {
  show:boolean;
  content:JSX.Element|null
}
const o: GlobalModalType = {
  show:false,
  content:null
};
export default atom(o);
