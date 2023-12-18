"use client";
import { CookiesProvider } from "react-cookie";

interface Props {
  children: React.ReactNode;
}

function CookiesWrapper({ children }: Props) {
  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      {children}
    </CookiesProvider>
  );
}

export default CookiesWrapper;
