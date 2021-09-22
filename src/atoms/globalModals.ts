import { atom } from 'jotai';

export default atom({
  createPostModalOpened: false,
  createWorkModalOpened: false,
  editWorkModalOpened: false,
  editPostModalOpened: false,
  editCycleModalOpened: false,
  editUserModalOpened: false,
  signInModalOpened: false,
  showToast: {
    type: 'info',
    title: '',
    message: '',
    show: false,
    autohide: true,
  },
});
