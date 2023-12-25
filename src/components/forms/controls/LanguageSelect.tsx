import { FunctionComponent, useState, useEffect } from 'react';
//import FormControl from 'react-bootstrap/FormControl';
import { SelectChangeEvent, Button as ButtonMui, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDictContext } from '@/src/hooks/useDictContext';
import { t } from '@/src/get-dictionary';


type Props = {
  defaultValue?: string | null;
  label?: string;
  onSelectLanguage: (string: string) => void;

};
const LanguageSelect: FunctionComponent<Props> = ({ defaultValue, label, onSelectLanguage }) => {

  // const { t } = useTranslation('common');
  const{dict}=useDictContext()
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
        <MenuItem value='spanish'>{t(dict,'spanish')}</MenuItem>
        <MenuItem value='english'>{t(dict,'english')}</MenuItem>
        <MenuItem value='portuguese'>{t(dict,'portuguese')}</MenuItem>
        <MenuItem value='french'>{t(dict,'french')}</MenuItem>

      </Select>
    </FormControl>

  );
};

export default LanguageSelect;
