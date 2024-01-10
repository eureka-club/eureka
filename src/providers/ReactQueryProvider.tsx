'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactElement, useState } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function ReactQueryProvider({ children }:{children:ReactElement}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            // notifyOnChangeProps: 'tracked',
          },
        },
      }),
  );  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}