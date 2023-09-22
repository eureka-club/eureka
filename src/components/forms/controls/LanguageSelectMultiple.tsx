import { FunctionComponent, useState, useEffect, ChangeEvent } from 'react';
//import FormControl from 'react-bootstrap/FormControl';
import { SelectChangeEvent, Button as ButtonMui, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Box, Chip,ListItemText, Checkbox } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';


type Props = {
  defaultValue?: string[];
  label?: string;
  onSelectLanguage: (string: string[]) => void;

};
const LanguageSelectMultiple: FunctionComponent<Props> = ({ defaultValue, label, onSelectLanguage }) => {

  const { t } = useTranslation('common');
  const [language, setLanguage] = useState<string[]>([]);

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
    // console.log(value,'valuevaluevalue')
    setLanguage(// On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,);
    onSelectLanguage(value as unknown as string[]);
  }

  

  return (
    <FormControl size="small" fullWidth>
      <InputLabel className='' id="select-language">{label}</InputLabel>
      <Select
        variant="outlined"
        multiple
        labelId="select-language"
        name="Language"
        size='small'
        id="select-language"
        label={label}
        onChange={handlerSelectLanguage}
        value={language as unknown as string}
        //renderValue={(language) => (language as unknown as []).join(', ')}
        renderValue={(language) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(language as unknown as []).map((value) => (
              <Chip size="small" key={value} label={t(`${value}`)} />
            ))}
          </Box>
        )}

      >
        <MenuItem value={'spanish'}>
          <Checkbox checked={language.includes('spanish')} />
          <ListItemText primary={t('hereLinkSPA')} />
        </MenuItem>
        <MenuItem value={'english'}>
          <Checkbox checked={language.includes('english')} />
          <ListItemText primary={t('hereLinkENG')} />
        </MenuItem>
        <MenuItem value={'french'}>
          <Checkbox checked={language.includes('french')} />
          <ListItemText primary={t('hereLinkFR')} />
        </MenuItem>
        <MenuItem value={'portuguese'}>
          <Checkbox checked={language.includes('portuguese')} />
          <ListItemText primary={t('hereLinkPORT')} />
        </MenuItem>
      </Select>
    </FormControl>

  );
};

export default LanguageSelectMultiple;
