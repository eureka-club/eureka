import { ChangeEvent, FunctionComponent, MouseEvent, ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import FormFile from 'react-bootstrap/FormFile';

import styles from './ImageSelectInput.module.css';

interface Props {
  acceptedFileTypes: string;
  children: (imagePreview: string | null) => ReactNode;
  file: File | null;
  setFile: (file: File | null) => void;
  required: boolean;
}

const ImageSelectInput: FunctionComponent<Props> = ({ acceptedFileTypes, children, file, setFile, required }) => {
  const coverInputRef = useRef<HTMLInputElement>() as RefObject<HTMLInputElement>;
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleTriggerClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
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

  return (
    <>
      <FormFile
        accept={acceptedFileTypes}
        className={styles.fileControl}
        onChange={handleFileInputChange}
        ref={coverInputRef}
        required={required}
      />

      <button className={styles.trigger} type="button" onClick={handleTriggerClick}>
        {children(imagePreview)}
      </button>
    </>
  );
};

export default ImageSelectInput;
