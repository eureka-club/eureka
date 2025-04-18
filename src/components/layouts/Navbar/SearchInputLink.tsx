import { Stack } from "@mui/material";
import MenuAction from "./MenuAction";
import SearchIcon from '@mui/icons-material/Search';
import SearchInput from "../../SearchInput";
// import useTranslation from "next-translate/useTranslation";


export const SearchInputLink = () => {
  // const { t } = useTranslation('navbar');
  
  return <MenuAction key='SearchInputLink' label={
    <Stack justifyContent={'center'} alignItems={'center'}>
       <SearchIcon sx={{fontSize:'2rem'}}/> 
    </Stack>
  }
  >
    <SearchInput/>
  </MenuAction>;
};