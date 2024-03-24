import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup, FormGroupProps } from '@mui/material';

type FilterMediathequeProps =  {

} & FormGroupProps

const useFilterMediatheque = ()=>{
  const [filtersChecked, setFiltersChecked] = useState<Record<string, boolean>>({
    movie: true,
    book: true,
    cycle:true,
    post:true,
  });

  const FilterMediatheque = (props:FilterMediathequeProps) => {
    const { t } = useTranslation('searchEngine');
  
    const handlerComboxesChangeType = (e: ChangeEvent<HTMLInputElement>, type: string) => {
      e.stopPropagation();
      switch(e.currentTarget.name){
        case 'cycle':
          setFiltersChecked(res=>({...res,cycle:e.currentTarget.checked}))
          break;
        case 'post':
          setFiltersChecked(res=>({...res,post:e.currentTarget.checked}))
          break;
        case 'movie':
          setFiltersChecked(res=>({...res,movie:e.currentTarget.checked}))
          break;
        case 'book':
          setFiltersChecked(res=>({...res,book:e.currentTarget.checked}))
          break;
      } 
    };
  
    return <FormGroup row {...props}>
    <FormControlLabel label={t('Cycles')} control={
      <Checkbox name='cycle' checked={filtersChecked.cycle} onChange={(e) => handlerComboxesChangeType(e, 'cycle')}/>
    }/>
    <FormControlLabel label={t('Eurekas')} control={
      <Checkbox name='post' checked={filtersChecked.post} onChange={(e) => handlerComboxesChangeType(e, 'post')}/>
    }/>
    <FormControlLabel label={t('Films')} control={
      <Checkbox name='movie' checked={filtersChecked.movie} onChange={(e) => handlerComboxesChangeType(e, 'movie')}/>
    }/>
    <FormControlLabel label={t('Books')} control={
      <Checkbox name='book' checked={filtersChecked.book} onChange={(e) => handlerComboxesChangeType(e, 'book')}/>
    }/>
  </FormGroup>
  };
  return {FilterMediatheque,filtersChecked}
}
export default useFilterMediatheque;
