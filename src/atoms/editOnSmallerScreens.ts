import { atom } from 'jotai';

interface editOnSmallerScreensType {
  value?: boolean;
}
const o: editOnSmallerScreensType = {
  value: false,
};
export default atom(o);
