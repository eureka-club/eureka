import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { UserLanguages } from '@/src/types';
import { useState, FormEvent, useEffect, useCallback, ChangeEvent, EventHandler } from 'react';
import { QueryClient, dehydrate, useMutation, useQueryClient } from 'react-query';
import { backOfficePayload } from '@/src/types/backoffice';
import useBackOffice from '@/src/useBackOffice';
// import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import LocalImageComponent from '@/src/components/LocalImage';
import { getWorksDetail } from '@/src/useWorksDetail';
import useWorks from '@/src/useWorksDetail';
import { Edition, Work } from '@prisma/client';
import { Session } from '@/src/types';
import dayjs from 'dayjs';
import { DATE_FORMAT_ONLY_YEAR, WEBAPP_URL } from '@/src/constants';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Image from 'next/image';
import {
  TabPane,
  TabContent,
  TabContainer,
  Col,
  Spinner,
  Nav,
  NavItem,
  NavLink,
  Form,
  Popover,
  OverlayTrigger,
  //Table,

} from 'react-bootstrap';
import { FiTrash2 } from 'react-icons/fi';
import styles from './back-office.module.css'
import CropImageFileSelect from '@/components/forms/controls/CropImageFileSelect';
import toast from 'react-hot-toast'
import axios from 'axios';
import MosaicItem from '@/src/components/work/MosaicItem';
import { debounce } from 'lodash';
import {
  Box, Fab, Paper, TextField, Typography, Button, ButtonGroup, CircularProgress, Table, TableBody,
  TableFooter, TablePagination, TableCell, TableContainer, TableHead, TableRow, Drawer, IconButton, Divider, Modal, Dialog, DialogContent, Stack, Icon
} from '@mui/material';
import PaginationActions from '@/src/components/common/MUITablePaginationActions';
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { EditWorkClientPayload, WorkDetail, WorkSumary } from '@/src/types/work';
import { EditionMosaicItem } from '@/src/types/edition';

import { FaSave } from 'react-icons/fa';
import useUpdateWork from '@/src/hooks/mutations/useUpdateWork';
import { error } from 'node:console';
import { IoAddCircle, IoClose, IoPencil, IoSave, IoTrash } from 'react-icons/io5';
import { AddBackOfficesSlidersForm } from '@/src/components/AddBackOfficesSlidersForm';
const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;
interface Props {
  notFound?: boolean;
  session: Session

}

interface backOfficeClearSliderPayload {
  originalName?: string
}
const drawerWidth = 500;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

export const WorkToCheckWhere = () => ({
  where: {
    ToCheck: true,
  }
})

const BackOffice: NextPage<Props> = ({ notFound, session }) => {
  //let { t } = useTranslation('backOffice');
  //TODO
  const t = (s: string) => s;
  const router = useRouter();
  const [tabKey, setTabKey] = useState<string>();
  const [currentSlider, setCurrentSlider] = useState<number>(0);
  const [showCrop, setShowCrop] = useState<boolean>(false);

  const [imageFile1, setImageFile1] = useState<File | null>(null);
  const [imageFile2, setImageFile2] = useState<File | null>(null);
  const [imageFile3, setImageFile3] = useState<File | null>(null);
  const [image1, setImage1] = useState<string | undefined>();
  const [image2, setImage2] = useState<string | undefined>();
  const [image3, setImage3] = useState<string | undefined>();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const queryClient = useQueryClient();
  const { data: bo } = useBackOffice();
  const { data } = useWorks(WorkToCheckWhere(), { cacheKey: 'WORKS', notLangRestrict: true });
  const [works, setWorks] = useState<WorkDetail[]>();
  useEffect(() => {
    if (data?.works) setWorks(data.works);
  }, [data?.works]);

  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { mutate: execUpdateWork, data: UpdateWorkResponse, isLoading: isUpdateWorkLoading, isSuccess: isUpdateWorkSuccess, isError: isUpdateWorkError,
  } = useUpdateWork();

  const [searchWorksFilter, setSearchWorksFilter] = useState('');
  const { data: dataAW } = useWorks({
    where: {
      OR: [
        {
          ToCheck: null,
        },
        {
          ToCheck: false,
        }
      ],
      author: {
        contains: searchWorksFilter
      }
    }
  }, { cacheKey: 'WORKS-ALL', notLangRestrict: true, enabled: !!searchWorksFilter });
  const [allWorks, setAllWorks] = useState<WorkDetail[]>();

  const debounceFn = useCallback(debounce((value: string) => {
    if (value)
      setSearchWorksFilter(value);
  }, 400), [searchWorksFilter]);

  useEffect(() => {
    setAllWorks(dataAW?.works);
    return () => {
      debounceFn.cancel();
    }
  }, [dataAW, searchWorksFilter]);

  function OnFilterWorksChanged(e: ChangeEvent<HTMLInputElement>) {
    debounceFn(e.target.value);
  }
  const handleClose = ()=>{
    setOpenModal(false);
    queryClient.invalidateQueries({queryKey:["BACKOFFICE","1"]});
  }
  const [workDnD, setWorkDnd] = useState<any>();//:-|

  useEffect(() => {
    if (notFound)
      router.push('/');

  }, [notFound]);

  // useEffect(() => {
  //   //console.log(bo,'bo data')
  //   setImage1(undefined);
  //   setImage2(undefined);
  //   setImage3(undefined);

  //   if (bo && bo.sliderImages.length) {
  //     if (bo.SlideImage1 != 'null') {
  //       let storeFile1 = bo.sliderImages.filter(x => x.originalFilename == bo.SlideImage1)[0].storedFile;
  //       setImage1(`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/backoffice/${storeFile1}`);
  //     }
  //     if (bo.SlideImage2 != 'null') {
  //       let storeFile2 = bo.sliderImages.filter(x => x.originalFilename == bo.SlideImage2)[0].storedFile;
  //       setImage2(`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/backoffice/${storeFile2}`);
  //     }
  //     if (bo.SlideImage3 != 'null') {
  //       let storeFile3 = bo.sliderImages.filter(x => x.originalFilename == bo.SlideImage3)[0].storedFile;
  //       setImage3(`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/backoffice/${storeFile3}`);
  //     }
  //   }
  // }, [bo]);


  const handleSubsectionChange = (key: string | null) => {
    if (key != null)
      setTabKey(key);
  };

  const closeCrop = () => {
    setShowCrop(false);
    setCurrentSlider(0);
  };

  const openCrop = (n: number) => {
    setShowCrop(true);
    setCurrentSlider(n);
  };

  // const onGenerateCrop = (photo: File) => {
  //   if (currentSlider == 1) {
  //     setImageFile1(() => photo);
  //     setImage1(URL.createObjectURL(photo));
  //   }
  //   if (currentSlider == 2) {
  //     setImageFile2(() => photo);
  //     setImage2(URL.createObjectURL(photo));
  //   }
  //   if (currentSlider == 3) {
  //     setImageFile3(() => photo);
  //     setImage3(URL.createObjectURL(photo));
  //   }

  //   setShowCrop(false);
  //   setCurrentSlider(0);
  // };

  const {
    mutate: execUpdateBackOffice,
    error: UpdateBackOfficeError,
    isLoading: isLoadingBackOffice,
  } = useMutation(
    async (payload: backOfficePayload) => {
      const formData = new FormData();
      //console.log(payload,'payload')
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const url = `/api/backoffice`;

      const res = await fetch(url, {
        method: 'PATCH',
        //headers: { 'Content-Type': 'application/json' },
        body: formData,
      });
      if (res.ok)
        toast.success(t('Settings') + '  Saved')
      else
        toast.error(res.statusText)
    },
    {
      onMutate: async () => {
        const cacheKey = ['BACKOFFICE', "1"];
        const snapshot = queryClient.getQueryData(cacheKey);
        return { cacheKey, snapshot };
      },
      onSettled: (_backData, error, _variables, context) => {
        if (context) {
          const { cacheKey, snapshot } = context;
          if (error && cacheKey) {
            queryClient.setQueryData(cacheKey, snapshot);
          }
          if (context) queryClient.invalidateQueries(cacheKey);
        }
      },
    },
  );

  const {
    mutate: execClearSlideBackOffice,
    error: ClearSlideBackOffice,
  } = useMutation(
    async (clearSliderPayload: backOfficeClearSliderPayload) => {
      const url = `/api/backoffice/${clearSliderPayload.originalName}`;
      const res = await fetch(url, {
        method: 'delete',
      });
      const data = await res.json();
      if (res.ok)
        toast.success(t('Banner Settings') + '  Saved')
      else
        toast.error(res.statusText)
    },
    {
      onMutate: async () => {
        const cacheKey = ['BACKOFFICE', "1"];
        const snapshot = queryClient.getQueryData(cacheKey);
        return { cacheKey, snapshot };
      },
      onSettled: (_backData, error, _variables, context) => {
        if (context) {
          const { cacheKey, snapshot } = context;
          if (error && cacheKey) {
            queryClient.setQueryData(cacheKey, snapshot);
          }
          if (context) queryClient.invalidateQueries(cacheKey);
        }
      },
    },
  );


  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const form = ev.currentTarget;
    const payload: backOfficePayload = {
      // SlideTitle1: form.TitleSlider1.value,
      // SlideText1: form.TextSlider1.value,
      // SlideImage1: (imageFile1) ? imageFile1.name : null,
      // Image1: imageFile1,
      // SlideTitle2: form.TitleSlider2.value,
      // SlideText2: form.TextSlider2.value,
      // SlideImage2: (imageFile2) ? imageFile2.name : null,
      // Image2: imageFile2,
      // SlideTitle3: form.TitleSlider3.value,
      // SlideText3: form.TextSlider3.value,
      // SlideImage3: (imageFile3) ? imageFile3.name : null,
      // Image3: imageFile3,
      CyclesExplorePage: form.CyclesToShow.value,
      PostExplorePage: form.PostToShow.value,
      FeaturedUsers: form.UsersToShow.value,
      FeaturedWorks: form.WorksToShow.value
    };
    //console.log(payload,"payload")
    await execUpdateBackOffice(payload);
  };


  // const clearSlider = async (n: number) => {

  //   let sliderOriginalName;
  //   if (n == 1)
  //     sliderOriginalName = bo!.SlideImage1;
  //   if (n == 2)
  //     sliderOriginalName = bo!.SlideImage2;
  //   if (n == 3)
  //     sliderOriginalName = bo!.SlideImage3;

  //   //console.log('bo',bo, sliderOriginalName)

  //   const clearSliderPayload: backOfficeClearSliderPayload = {
  //     originalName: sliderOriginalName || undefined
  //   };
  //   //console.log(payload,"payload")
  //   await execClearSlideBackOffice(clearSliderPayload);
  // };

  const removeNotificationsSinceLastMonth = async () => {
    const url = '/api/notification/remove-since-last-month';
    const res = await axios.delete(url);
    if (res.data?.error)
      toast.error(res.data?.error);
    else toast.success(`${res.data?.notifications.count} notifications where deleted`);
  }

  //////Para la administracion de obras///////////////////////////

  const { mutate: execDeleteWork, isSuccess: isDeleteWorkSucces } = useMutation(async (work: Work) => {
    const res = await fetch(`/api/work/${work.id}`, {
      method: 'delete',
    });
    toast.success('Work deleted!!')
    const data = await res.json();

    return data;
  },
    {
      onMutate: async () => {
        const cacheKey = [`WORKS-${JSON.stringify(WorkToCheckWhere())}`];
        const snapshot = queryClient.getQueryData(cacheKey);
        return { cacheKey, snapshot };
      },
      onSettled: (_backData, error, _variables, context) => {
        if (context) {
          const { cacheKey, snapshot } = context;
          if (error && cacheKey) {
            queryClient.setQueryData(cacheKey, snapshot);
          }
          if (context) queryClient.invalidateQueries(cacheKey);
        }
      },
    },
  );

  const { mutate: execRevisionWork, isSuccess: isRevisionWorkSucces } = useMutation(async (work: Work) => {

    const formData = new FormData();

    formData.append('id', work.id.toString());
    formData.append('ToCheck', '0');

    const res = await fetch(`/api/work/${work.id}`, {
      method: "PATCH",
      //headers: { "Content-type": "multipart/form-data" },
      body: formData //JSON.stringify({ id: work.id,ToCheck:false })
    });
    toast.success('Work checked!!')
    const data = await res.json();
    return data;
  },
    {
      onMutate: async () => {
        const cacheKey = [`WORKS-${JSON.stringify(WorkToCheckWhere())}`];
        const snapshot = queryClient.getQueryData(cacheKey);
        return { cacheKey, snapshot };
      },
      onSettled: (_backData, error, _variables, context) => {
        if (context) {
          const { cacheKey, snapshot } = context;
          if (error && cacheKey) {
            queryClient.setQueryData(cacheKey, snapshot);
          }
          if (context) queryClient.invalidateQueries(cacheKey);
        }
      },
    },
  );

  const handleDeleteClick = (work: WorkDetail) => {
    execDeleteWork(work)
  };

  const handleRevisionClick = (work: WorkDetail) => {
    execRevisionWork(work)
  };

  const updateWork = (e: any, payload: EditWorkClientPayload) => {
    execUpdateWork(payload);
    console.log(UpdateWorkResponse, 'UpdateWorkResponse')
    if (UpdateWorkResponse) {
      if (!UpdateWorkResponse.error)
        toast.success(t("Work and editions saved"))
      else
        toast.error(t(UpdateWorkResponse.error))
    }
  }

  useEffect(() => {
    if (isDeleteWorkSucces === true) {
      router.replace(router.asPath);
    }
    if (isRevisionWorkSucces === true) {
      router.replace(router.asPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteWorkSucces, isRevisionWorkSucces]);



  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - works!.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDrawerOpen = () => {
    setOpen(!open);
    setAllWorks([]);

  };

  const handleDrawerClose = () => {
    setOpen(false);
    setAllWorks([]);
  };

  const imgBaseUrl=`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/backoffice/`;

  const OnAddSlide = ()=>{
    setOpenModal(true);
  }

  const OnRemoveSlide = async (id:number)=>{
    const res = await confirm("Are you sure you wanna remove the selected slide?");
    if(res){
      const url = `${WEBAPP_URL}/api/backoffice/slide/${id}/remove`;
      const fr = await fetch(url,{
        method:'DELETE',
      });
      if(fr.ok){
        const res = await fr.json()
        if(res.slide){
          toast.success('done!');
          queryClient.invalidateQueries({queryKey:["BACKOFFICE","1"]});
        }
        else toast.error('error');
      }
    }
  }

  /////////////////////////////////////////////////////////
  return (
    <SimpleLayout title={t('Admin Panel')}>
      <h1 className="text-secondary me-1 mb-4">
        <b>{t('Admin Panel')}</b>
      </h1>
      <TabContainer onSelect={handleSubsectionChange} activeKey={tabKey || 'explorer-page'} transition={false}>
        <style jsx global>
          {`
            .nav-tabs .nav-item.show .nav-link,
            .nav-tabs .nav-link.active,
            .nav-tabs .nav-link:hover {
              background-color: var(--bs-primary);
              color: white !important;
              border: none !important;
              border-bottom: solid 2px var(--bs-primary) !important;
            }
            .nav-tabs {
              border: none !important;
            }
          `}
        </style>

        <Nav variant="tabs" className="scrollNav" fill>
          <NavItem className={`border-primary border-bottom cursor-pointer  ${styles.tabBtn}`}>
            <NavLink eventKey="explorer-page">
              <span className="mb-3">{t('Content administration')}</span>
            </NavLink>
          </NavItem>
          {
            <NavItem className={`border-primary border-bottom cursor-pointer  ${styles.tabBtn}`}>
              <NavLink eventKey="work-administration">
                <span className="mb-3">{`${t("Added works 's revision")} (${works?.length})`}</span>
              </NavLink>
            </NavItem>
          }
          <NavItem className={`border-primary border-bottom cursor-pointer  ${styles.tabBtn}`}>
            <NavLink eventKey="notifications">
              <span className="mb-3">Notifications</span>
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent>
          <TabPane eventKey="explorer-page">
            <h2 className="text-secondary mt-3 mb-3">
              <b>{t('Banner Settings')}</b>
            </h2>
              <Button  size='large' onClick={OnAddSlide}  variant='contained' startIcon={<IoAddCircle/>}>
                Add
              </Button>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                  {
                    bo?.sliders.map(s=>{
                      return <TableRow key={`$tr-slide-${s.id}`}>
                      <TableCell>
                        <img style={{ width: '10em' }} src={`${imgBaseUrl}${s.images[0].storedFile}`} alt="" />
                      </TableCell>
                      <TableCell className="p-0 mx-1 text-wrap fs-5">{s.title}</TableCell>
                      <TableCell>
                        <p className="p-0 mx-1 text-wrap fs-5" dangerouslySetInnerHTML={{ __html: s?.text??'' }}/>
                      </TableCell>
                      <TableCell>
                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                          <Button size='small' color='info' variant='contained' onClick={(e)=>{alert("Todo")}} startIcon={<IoPencil/>}>Edit</Button>
                          <Button size='small' color='warning' variant='contained' onClick={(e)=>OnRemoveSlide(s.id)} startIcon={<IoTrash/>}>Remove</Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>;
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <Form onSubmit={handleSubmit} className={`d-flex flex-column`}>
              {/* <Row className="col-12 px-4 py-2 d-flex flex-column flex-lg-row justify-content-around">
                <Col className="col-12 col-lg-4 mb-4">
                  <h5 className="text-secondary mb-2">
                    <b>{t('Slider 1')}</b>
                  </h5>

                  <Form.Group controlId="TitleSlider1">
                    <Form.Label>{t('Title')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.SlideTitle1 || ''} maxLength={100} />
                  </Form.Group>
                  <Form.Group controlId="TextSlider1">
                    <Form.Label>{t('Text')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.SlideText1 || ''} maxLength={120} />
                  </Form.Group>

                  {!showCrop && currentSlider != 1 && (
                    <div>
                      <Button
                        data-cy="image-load"
                        variant="primary"
                        className="w-50 text-white mt-2  mb-3"
                        onClick={() => openCrop(1)}
                      >
                        {t('Image')}
                      </Button>
                      {bo?.SlideImage1?.length && bo?.SlideImage1 != 'null' && (
                        <Button
                          type="button"
                          title={t('Delete slider')}
                          className={`text-warning p-0 ${styles.sliderDelete}`}
                          onClick={() => clearSlider(1)}
                          variant="link"
                        >
                          <FiTrash2 />
                        </Button>
                      )}
                    </div>
                  )}
                  {showCrop && currentSlider == 1 && (
                    <Row className="d-flex">
                      <div className="w-100 border p-3">
                        <CropImageFileSelect
                          onGenerateCrop={onGenerateCrop}
                          onClose={() => closeCrop()}
                          cropShape="rect"
                          width={352}
                          height={320}
                        />
                      </div>
                    </Row>
                  )}
                  {image1 && (
                    <Row>
                      <img className={styles.Image} src={image1} alt="" />
                    </Row>
                  )}
                </Col>
                <Col className="col-12 col-lg-4 mb-4">
                  <h5 className="text-secondary mb-2">
                    <b>{t('Slider 2')}</b>
                  </h5>
                  <Form.Group controlId="TitleSlider2">
                    <Form.Label>{t('Title')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.SlideTitle2 || ''} maxLength={100} />
                  </Form.Group>
                  <Form.Group controlId="TextSlider2">
                    <Form.Label>{t('Text')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.SlideText2 || ''} maxLength={120} />
                  </Form.Group>

                  {!showCrop && currentSlider != 2 && (
                    <div>
                      <Button
                        data-cy="image-load"
                        variant="primary"
                        className="w-50 text-white mt-2  mb-3"
                        onClick={() => openCrop(2)}
                      >
                        {t('Image')}
                      </Button>
                      {bo?.SlideImage2?.length && bo?.SlideImage2 != 'null' && (
                        <Button
                          type="button"
                          title={t('Delete slider')}
                          className={`text-warning p-0 ${styles.sliderDelete}`}
                          onClick={() => clearSlider(2)}
                          variant="link"
                        >
                          <FiTrash2 />
                        </Button>
                      )}
                    </div>
                  )}
                  {showCrop && currentSlider == 2 && (
                    <Row className="d-flex">
                      <div className="w-100 border p-3">
                        <CropImageFileSelect
                          onGenerateCrop={onGenerateCrop}
                          onClose={() => closeCrop()}
                          cropShape="rect"
                          width={352}
                          height={320}
                        />
                      </div>
                    </Row>
                  )}
                  {image2 && (
                    <Row>
                      <img className={styles.Image} src={image2} alt="" />
                    </Row>
                  )}
                </Col>
                <Col className="col-12 col-lg-4 mb-4">
                  <h5 className="text-secondary mb-2">
                    <b>{t('Slider 3')}</b>
                  </h5>

                  <Form.Group controlId="TitleSlider3">
                    <Form.Label>{t('Title')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.SlideTitle3 || ''} maxLength={100} />
                  </Form.Group>
                  <Form.Group controlId="TextSlider3">
                    <Form.Label>{t('Text')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.SlideText3 || ''} maxLength={120} />
                  </Form.Group>

                  {!showCrop && currentSlider != 3 && (
                    <div className="">
                      <Button
                        data-cy="image-load"
                        variant="primary"
                        className="w-50 text-white mt-2  mb-3"
                        onClick={() => openCrop(3)}
                      >
                        {t('Image')}
                      </Button>
                      {bo?.SlideImage3?.length && bo?.SlideImage3 != 'null' && (
                        <Button
                          type="button"
                          title={t('Delete slider')}
                          className={`text-warning p-0 ${styles.sliderDelete}`}
                          onClick={() => clearSlider(3)}
                          variant="link"
                        >
                          <FiTrash2 />
                        </Button>
                      )}
                    </div>
                  )}
                  {showCrop && currentSlider == 3 && (
                    <Row className="d-flex">
                      <div className="w-100 border p-3">
                        <CropImageFileSelect
                          onGenerateCrop={onGenerateCrop}
                          onClose={() => closeCrop()}
                          cropShape="rect"
                          width={352}
                          height={320}
                        />
                      </div>
                    </Row>
                  )}
                  {image3 && (
                    <Row>
                      <img className={styles.Image} src={image3} alt="" />
                    </Row>
                  )}
                </Col>
              </Row> */}

              <h2 className="text-secondary mt-3 mb-3">
                <b>{t('Content Page')}</b>
              </h2>
              <div className="py-2 d-flex flex-column flex-lg-row justify-content-between">
                <Col className="col-12 col-lg-6 px-2 ">
                  <Form.Group controlId="CyclesToShow">
                    <Form.Label>{t('CyclesToShow')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.CyclesExplorePage || ''} />
                  </Form.Group>
                </Col>
                <Col className="col-12 col-lg-6 px-2">
                  <Form.Group controlId="PostToShow">
                    <Form.Label>{t('PostToShow')}</Form.Label>
                    <Form.Control className="mb-4" type="text" defaultValue={bo?.PostExplorePage || ''} />
                  </Form.Group>
                </Col>
              </div>
              <div className="py-2 d-flex flex-column flex-lg-row justify-content-between">
                <Col className="col-12 col-lg-6 px-2 ">
                  <Form.Group controlId="UsersToShow">
                    <Form.Label>{t('UsersToShow')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.FeaturedUsers || ''} />
                  </Form.Group>
                </Col>
                <Col className="col-12 col-lg-6 px-2 ">
                  <Form.Group controlId="WorksToShow">
                    <Form.Label>{t('WorksToShow')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.FeaturedWorks || ''} />
                  </Form.Group>
                </Col>
              </div>
              <Stack direction={'row'} justifyContent={'right'} gap={3}>
                  <Button variant="outlined" onClick={()=>router.push('/')} size='large' startIcon={<IoClose/>}>
                    {t('Cancel')}
                  </Button>
                  <Button variant="contained" type="submit" size='large' startIcon={<IoSave/>}>
                    {t('Save')}
                    {isLoadingBackOffice && <Spinner animation="grow" variant="info" size="sm" className="ms-1" />}
                  </Button>
              </Stack>
            </Form>

          </TabPane>
        </TabContent>


        <TabContent>
          <TabPane eventKey="work-administration">
            <Box className='mt-4 d-flex flex-row justify-content-start'>
              {/*<h1 className=''>Works for Revision</h1>*/}
              <Button
                variant="contained"
                onClick={handleDrawerOpen}
              >
                Search ours works
              </Button>
            </Box>
            {works ? <div className="row">
              <TableContainer>
                <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>&nbsp;</TableCell>
                      <TableCell align="left">Language</TableCell>
                      <TableCell align="left">Type</TableCell>
                      <TableCell align="left">Title</TableCell>
                      <TableCell align="left">Author</TableCell>
                      <TableCell align="left">Year</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? works.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : works
                    ).map((work) => (
                      <TableRow
                        key={work.id}
                        draggable onDragStart={(e) => {
                          setWorkDnd(work);
                          //e.dataTransfer.setData("work",JSON.stringify(work))
                        }}
                      >
                        <TableCell align="right"> <LocalImageComponent
                          alt="work cover"
                          height={80}
                          filePath={work.localImages[0].storedFile}
                          style={{ marginRight: '1rem' }}
                        /></TableCell>
                        <TableCell align="left"><Image width={24} height={24} className="m-0" src={`/img/lang-flags/${UserLanguages[work.language]}.png`} alt="Language flag 'es'" /></TableCell>
                        <TableCell align="left">{work.type}</TableCell>
                        <TableCell align="left">{work.title}</TableCell>
                        {/* <TableCell align="left">{work.author}</TableCell> */}
                        {/* <TableCell align="left">{work.publicationYear && dayjs(work.publicationYear).format(DATE_FORMAT_ONLY_YEAR)}</TableCell> */}
                        <TableCell align="center"><div className='d-flex flex-row justify-content-center'>
                          <Button variant="text" href={`/work/${work.id}/edit?admin=${true}`} className="ms-2">
                            <FindInPageOutlinedIcon />
                          </Button>

                          <OverlayTrigger
                            trigger="click"
                            placement="bottom"
                            transition={false}
                            rootClose={true}
                            overlay={
                              <Popover id="confirmRevision">
                                <Popover.Body>
                                  <Button variant="outlined" onClick={() => handleRevisionClick(work)} >
                                    confirm Revision!!!
                                  </Button>
                                </Popover.Body>
                              </Popover>
                            }
                          >

                            <Button variant="text" className="ms-2">
                              <CheckCircleOutlineIcon className='text-primary' />
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            trigger="click"
                            placement="bottom"
                            transition={false}
                            rootClose={true}
                            overlay={
                              <Popover id="confirmDelete">
                                <Popover.Body>
                                  <Button variant="outlined" color='warning' onClick={() => handleDeleteClick(work)}>
                                    confirm delete!!!
                                  </Button>
                                </Popover.Body>
                              </Popover>
                            }
                          >
                            <Button variant="text" className="ms-2">
                              <DeleteIcon className='text-primary' />
                            </Button>
                          </OverlayTrigger>
                        </div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter >
                    <TableRow>
                      <TablePagination sx={{ //MuiTablePagination-selectLabel 
                        "& .MuiTablePagination-spacer": {
                          order: 2
                        },
                        "& .MuiTablePagination-selectLabel": {
                          ml: 12
                        },

                      }}
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={12}
                        count={works.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                          inputProps: {
                            'aria-label': 'rows per page',
                          },
                          native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={PaginationActions as any}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
              <Drawer
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  '& .MuiDrawer-paper': {
                    width: drawerWidth,
                  },
                }}
                variant="persistent"
                anchor="right"
                open={open}
              >
                <DrawerHeader>
                  <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                  </IconButton>
                </DrawerHeader>
                <Divider />
                <Paper className='col' elevation={2} style={{ padding: '.5rem' }}>
                  <TextField label="Search books by title" fullWidth onChange={OnFilterWorksChanged} />
                  {allWorks?.map((w, idx) => <Box m={1} key={`aw-${w.id}`} sx={{ display: "flex" }}>
                    <Box sx={{ width: '40%' }}>
                      <MosaicItem work={w as unknown as WorkSumary} workId={w.id} size='sm' linkToWork={false} showCreateEureka={false} />
                    </Box>
                    <Paper
                      sx={{ width: '60%' }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.boxShadow = "0px 0px 7px var(--eureka-green)";
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.style.boxShadow = "";
                      }}

                      onDrop={(e) => {
                        e.currentTarget.style.boxShadow = "";
                        workDnD.ToCheck = false;
                        w.editions.push(workDnD!);
                        setAllWorks(_ => [...allWorks]);
                        setWorks(_ => works.filter(w => w.id != workDnD.id));
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant='h5' m={2} style={{ color: 'var(--eureka-purple)', fontFamily: 'Open Sans, sans-serif' }}>
                          {w.editions.length ? <b>Editions</b> : <b>Drop edition here</b>}
                        </Typography>
                        {
                          w.editions.length
                            ? <>{!isUpdateWorkLoading && <ButtonGroup sx={{ marginRight: '.5rem' }}>
                              <Button
                                style={{
                                  height: '2rem',
                                  background: 'var(--eureka-green)',
                                }}
                                variant="contained"
                                size="small"
                                onClick={(e) => updateWork(e, { ...w })}
                                disabled={isUpdateWorkLoading}
                              >
                                <FaSave />
                              </Button>
                            </ButtonGroup>}
                              {isUpdateWorkLoading && (
                                <CircularProgress
                                  size={30}
                                  sx={{
                                    color: 'var(--eureka-green)',
                                    marginRight: '.5rem',
                                    //margin:'.5rem'
                                  }}
                                />
                              )}
                            </>

                            : <></>
                        }
                      </Box>
                      <Box sx={{ display: "flex", flexWrap: 'wrap', flexDirection: 'column' }} >
                        {w.editions.map((ed: EditionMosaicItem, idx) => <Box key={`edition-${ed.id}`}
                          onDragStart={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'center', marginBottom: 2 }} > {/*style={{ transform: "scale(1)" }}*/}
                            {ed.ToCheck ? <Fab className='ms-1' aria-label="edit" onClick={(e) => {
                              e.preventDefault();
                              let er = w.editions.splice(idx, 1)[0] as unknown as WorkDetail;
                              setAllWorks(_ => [...allWorks]);
                              works.push(er);
                              setWorks(_ => works);
                            }} style={{
                              transform: "scale(.6)", background: 'var(--eureka-purple)'
                            }} disabled={isUpdateWorkLoading}>
                              <DeleteIcon />
                            </Fab> : <Fab className='ms-1' color="secondary" aria-label="edit" onClick={(e) => { // aca llamaria a api borrar edicion directo
                              e.preventDefault();
                            }} style={{ transform: "scale(.6)", background: 'var(--eureka-purple)' }} disabled={isUpdateWorkLoading}>
                              <DeleteIcon />
                            </Fab>}
                            <LocalImageComponent className='mb-3'
                              alt="work cover"
                              height={180}
                              filePath={ed.localImages[0].storedFile}
                            />
                            {/*<MosaicItem workId={ed.id} size='sm' showCreateEureka={false} linkToWork={false} notLangRestrict={true} />*/}
                          </Box>
                        </Box>)}
                      </Box>
                    </Paper>
                  </Box>)}
                </Paper>
              </Drawer>
            </div>
              : <>...</>}

          </TabPane>
        </TabContent>

                            <TabContent>
                              <TabPane eventKey='notifications'>
                                <Box className='mt-4 d-flex flex-row justify-content-start'>
                                  <Button color='warning' variant='contained' className=' my-1' onClick={removeNotificationsSinceLastMonth}>{t('RemoveOldNotifications')}</Button>
                                </Box>
                              </TabPane>
                            </TabContent>

      </TabContainer>


      <Dialog
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogContent>
          <AddBackOfficesSlidersForm/>
        </DialogContent>
      </Dialog>

    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getSession(ctx));
  if (session == null || !session.user.roles.includes('admin')) {
    return { props: { notFound: true } };
  }

  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;
  const qc = new QueryClient();
  const worksData = await getWorksDetail(undefined, WorkToCheckWhere());
  qc.prefetchQuery('list/works', () => worksData);

  return {
    props: {
      session,
      dehydratedState: dehydrate(qc),
    },
  };
};

export default BackOffice;
