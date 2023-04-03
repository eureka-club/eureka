import React, { FunctionComponent,FormEvent, useCallback, useState } from 'react';
import { TextField } from '@mui/material';
import Button from 'react-bootstrap/Button';
import useTranslation from 'next-translate/useTranslation';
import toast from 'react-hot-toast'

interface Props {
    callback: Function;
}

const SearchWorkInput: FunctionComponent<Props> = ({ callback }) => {
    const { t } = useTranslation('createWorkForm');
    const [isEmpty, setIsEmpty] = useState(false);
    const [searchValue, setSearchValue] = useState('');


    const handleSearch = useCallback((event: FormEvent) => {
        event.preventDefault();
        if (!searchValue) {
            setIsEmpty(true);
            toast.error('Title required');
            return;
        }
        setIsEmpty(false);
        callback(searchValue);

    }, [searchValue, callback]);


    return (
        <div className="d-flex flex-row" >
            <TextField id="searchTitle" className="w-100" label={t('titleFieldLabel')}
                variant="outlined" size="small" 
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                type="text"
                placeholder={
                    isEmpty
                        ? "The field cannot be empty"
                        : "Search a book"
                }
            >
            </TextField>
            <Button
                className={`ms-2 btn-eureka`}
                onClick={(e)=> handleSearch(e)}
                style={{ width: '20%', height: '2.5em' }}
            >
                {'Search'}
            </Button>
        </div>
    )
}

export default SearchWorkInput;