// "use client"

// import { BiArrowBack } from 'react-icons/bi';
// import { useRouter, useSearchParams } from 'next/navigation';

// import { ButtonGroup, Button, Alert } from 'react-bootstrap';

// import SearchTab from '@/src/components/SearchTab';
// import { t } from '@/src/get-dictionary';
// import { FC } from 'react';
// import { useDictContext } from '@/src/hooks/useDictContext';

// const topics = [
//   'gender-feminisms',
//   'technology',
//   'environment',
//   'racism-discrimination',
//   'wellness-sports',
//   'social issues',
//   'politics-economics',
//   'philosophy',
//   'migrants-refugees',
//   'introspection',
//   'sciences',
//   'arts-culture',
//   'history',
// ];

// interface Props {
//   hasCycles: boolean;
//   hasPosts: boolean;
//   hasWorks: boolean;
// }
// const Search: FC<Props> = ({ hasCycles, hasPosts, hasWorks}) => {
// //   const { t } = useTranslation('common');
//   const {dict,langs} = useDictContext();
//   const router = useRouter();

//   const searchParams = useSearchParams()
//   const q = searchParams.get('q')
  
//   let qLabel = q?.toString();
//   if (qLabel && qLabel.match(':')) qLabel = q as string;

// //   const onTermKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
// //     if (e.code == 'Enter') {
// //       router.push(`/search?q=${e.currentTarget.value}`);
// //     }
// //   };

//   const isEurekaTopic = (t: string) => {
//     if (topics.includes(t!.toString())) return true;
//     return false;
//   };

//   return (
//     <>
//         <ButtonGroup className="mb-1">
//           <Button variant="primary text-white" onClick={() => router.back()} size="sm">
//             <BiArrowBack />
//           </Button>
//         </ButtonGroup>
//         {/* <SearchInput className="" /> */}
//         <>
//           {qLabel ? <h1 className="text-secondary fw-bold mb-2">
//             {t(dict,'Results about')}: {qLabel && `"${isEurekaTopic(qLabel) ? t(dict,'topics:' + qLabel) : qLabel}"`}
//           </h1> : ''}
//         </>
//         {hasCycles || hasPosts || hasWorks ? (
//           <div className="d-flex flex-column justify-content-center">
//             <SearchTab {...{ hasCycles, hasPosts, hasWorks }} />
//           </div>
//         ) : (
//           <>
//             <Alert className="mt-4" variant="primary">
//               <Alert.Heading>{t(dict,'ResultsNotFound')}</Alert.Heading>
//             </Alert>
//           </>
//         )}
//     </>
//   );
// };


// export default Search;
export default {}
