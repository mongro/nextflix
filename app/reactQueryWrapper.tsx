"use client";
import {
  isServer,
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

function makeQueryClient() {
  return new QueryClient(queryClientConfig);
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

const queryClient = new QueryClient(queryClientConfig);

console.log(queryClient, "queryClientWrapper");

function reactQueryWrapper({ children }: Props) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default reactQueryWrapper;
