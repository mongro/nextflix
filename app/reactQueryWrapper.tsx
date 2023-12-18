"use client";
import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 60 * 24 * 10, //10days
    },
    mutations: {
      retry: 2,
    },
  },
};

const queryClient = new QueryClient(queryClientConfig);

function reactQueryWrapper({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default reactQueryWrapper;
