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
        <MenuItem value={'spanish'}><Image width={24} height={24} className="m-0" src="/img/lang-flags/es.png" alt="Language flag 'es'" /></MenuItem>
        <MenuItem value={'english'}><Image width={24} height={24} className="m-0" src="/img/lang-flags/en.png" alt="Language flag 'en'" /></MenuItem>
        <MenuItem value={'french'}><Image width={24} height={24} className="m-0" src="/img/lang-flags/fr.png" alt="Language flag 'fr'" /></MenuItem>
        <MenuItem value={'portuguese'}><Image width={24} height={24} className="m-0" src="/img/lang-flags/pt.png" alt="Language flag 'pt'" /></MenuItem>

      </Select>
    </FormControl>

  );
};

export default LanguageSelect;
