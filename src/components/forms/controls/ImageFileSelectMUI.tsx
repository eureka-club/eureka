import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import { TextField, FormControl } from '@mui/material';
import { Form } from 'react-bootstrap';
import { ChangeEvent, FunctionComponent, MouseEvent, ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { useDictContext } from '@/src/hooks/useDictContext';




interface Props {
  aceptedFileTypes: string;
  children: (imagePreview: string | null) => ReactNode;
  file: File | null;
  setFile: (file: File | null) => void;
  //required: boolean;
  //className?: string;
}

const ImageFileSelectMUI: FunctionComponent<Props> = ({
  aceptedFileTypes,
  children,
  file,
  setFile,
  //required,
  //className,
}) => {
  const { t, dict } = useDictContext();
  const coverInputRef = useRef<HTMLInputElement>() as RefObject<HTMLInputElement>;
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleTriggerClick = (ev: MouseEvent) => {
    coverInputRef.current?.click();
  };

  const handleFileInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { files } = ev.currentTarget;

    if (files == null || files[0] == null) {
      setFile(null);
      return;
    }

    setFile(files[0]);
  };

  

  useEffect(() => {
    if (file == null) {
      setImagePreview(null);
      return;
    }
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [file, setFile]);

  return (<>
    <Form.Control  //Tuve q tomar el form control de boostrap
      type="file"
      accept={aceptedFileTypes}
      onChange={handleFileInputChange}
      ref={coverInputRef}
      //required={required}
      className={`d-none`}
    />
    <TextField
      className="w-100"
      type="buttton"
      variant="outlined"
      size="small"
      label={`*${t(dict,'createWorkForm:imageCoverFieldLabel')}`}
      onClick={handleTriggerClick}
      value={(file) ? file.name : ""}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
              {children(imagePreview)}
          </InputAdornment>
        ),
      }}
    />
  </>
  );
};

export default ImageFileSelectMUI;





