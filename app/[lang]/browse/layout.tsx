import { ReactNode } from "react";
import { Locale } from "../../../i18n-config";
import Browse from "./Browse";

interface Props {
  children?: ReactNode;
  params: { lang: Locale };
}

export default function Layout({ children, params }: Props) {
  return (
    <div>
      {children}
      <Browse lang={params.lang} />
    </div>
  );
}
