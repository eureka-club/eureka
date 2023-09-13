import { FunctionComponent, useState, useEffect, ChangeEvent } from 'react';
//import FormControl from 'react-bootstrap/FormControl';
import { SelectChangeEvent, Button as ButtonMui, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';


type Props = {
  defaultValue?: string | null;
  label?: string;
  onSelectLanguage: (string: string) => void;

};
const LanguageSelect: FunctionComponent<Props> = ({ defaultValue, label, onSelectLanguage }) => {

  const { t } = useTranslation('common');
  const [language, setLanguage] = useState<string>('');

  useEffect(() => {
    //console.log(defaultValue,'defaultValue')
    if (defaultValue) {
      setLanguage(defaultValue);

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  function handlerSelectLanguage(ev: SelectChangeEvent) {
    ev.preventDefault();
    const { name, value } = ev.target;
    setLanguage(value);
    onSelectLanguage(value);
  }


  return (
    <FormControl size="small" fullWidth>
      <InputLabel className='' id="select-language">{label}</InputLabel>
      <Select
        variant="outlined"
        labelId="select-language"
        name="Language"
        size='small'
        id="select-language"
        label={label}
        onChange={handlerSelectLanguage}
        value={language}
      >
        <MenuItem value={'spanish'}>{t('hereLinkSPA')}</MenuItem>
        <MenuItem value={'english'}>{t('hereLinkENG')}</MenuItem>
        <MenuItem value={'french'}>{t('hereLinkPORT')}</MenuItem>
        <MenuItem value={'portuguese'}>{t('hereLinkFR')}</MenuItem>

      </Select>
    </FormControl>

  );
};

export default LanguageSelect;
