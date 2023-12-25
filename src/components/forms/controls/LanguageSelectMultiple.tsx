import { FunctionComponent, useState, useEffect, ChangeEvent } from 'react';
//import FormControl from 'react-bootstrap/FormControl';
import { Chip, Button as ButtonMui, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
import Image from 'next/image';
import { useDictContext } from '@/src/hooks/useDictContext';
import { t } from '@/src/get-dictionary';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
type Props = {
  defaultValue?: string[];
  label?: string;
  onSelectLanguage: (string: string[]) => void;

};
const LanguageSelectMultiple: FunctionComponent<Props> = ({ defaultValue, label, onSelectLanguage }) => {
  const { dict } = useDictContext();
  const [language, setLanguage] = useState<string[]>([]);

  // const languages = [
  //   { title: t(dict, 'hereLinkSPA'), value: 'spanish' },
  //   { title: t(dict, 'hereLinkENG'), value: 'english' },
  //   { title: t(dict, 'hereLinkFR'),  value: 'french' },
  //   { title: t(dict, 'hereLinkPORT'), value: 'portuguese'}]
  const languages = ['spanish', 'english', 'french', 'portuguese']
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  useEffect(() => {
    if (defaultValue?.join(',').length) {
      setLanguage(defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  function handlerSelectLanguage(ev: any, value: string[]) {
    ev.preventDefault();
    setLanguage(value);
    onSelectLanguage(value as unknown as string[]);
    onSelectLanguage(value as string[]);
  }

  return (
    <Autocomplete
      key='language-multiple'
      multiple
      fullWidth
      size='small'
      id="select-language"
      options={languages}
      disableCloseOnSelect
      onChange={(ev, newValue) => handlerSelectLanguage(ev, newValue)}
      value={language}
      renderOption={(props, option, { selected }) => {
        return (
          <li {...props} key={`${option}-li`}>
            <Checkbox
              icon={icon}
              key={option}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {t(dict, option as string)}
          </li>
        )
      }}
      renderTags={(tagValue, getTagProps) => {
        return tagValue.map((option, index) => (
          <Chip size='small' {...getTagProps({ index })} key={`${option}-chip`}  label={t(dict, option as string)} />
        ))
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
        />

      )}
    />


    // <FormControl size="small" fullWidth>
    //   <InputLabel className='' id="select-language">{label}</InputLabel>
    //   <Select
    //     variant="outlined"
    //     multiple
    //     labelId="select-language"
    //     name="Language"
    //     size='small'
    //     id="select-language"
    //     label={label}
    //     onChange={handlerSelectLanguage}
    //     value={language  as unknown as string} 
    //   >
    //     <MenuItem value={'spanish'}>{t(dict,'hereLinkSPA')}</MenuItem>
    //     <MenuItem value={'english'}>{t(dict,'hereLinkENG')}</MenuItem>
    //     <MenuItem value={'french'}>{t(dict,'hereLinkFR')}</MenuItem>
    //     <MenuItem value={'portuguese'}>{t(dict,'hereLinkPORT')}</MenuItem>

    //   </Select>
    // </FormControl>

  );
};

export default LanguageSelectMultiple;
