'use client'

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import { queryClient } from "@/utils/api/query"

export function KolQueryClientProvider({
    children,
  }: {
    children: React.ReactElement
  }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
      </QueryClientProvider>
    )
  }
