"use client"

// import { getCsrfToken, getSession } from 'next-auth/react';
// import { GetServerSideProps } from 'next';
import Link from 'next/link'

import { useDictContext } from '@/src/hooks/useDictContext';

interface Props {
}
export default function EmailVerify({}: Props) {
  const {t,dict}=useDictContext();
  return <>
      <p>{t(dict,'text')}</p>
      <Link className="btn btn-primary text-white"  href="/">
        {t(dict,'goToHomepage')}
      </Link>
  </>;
}