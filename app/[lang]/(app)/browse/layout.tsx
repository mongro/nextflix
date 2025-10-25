import { ReactNode } from "react";
import { Locale } from "@/i18n-config";
import Browse from "./Browse";

interface Props {
  children?: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function Layout(props: Props) {
  const params = await props.params;

  const { children } = props;

  return (
    <div>
      {children}
      <Browse lang={params.lang as Locale} />
    </div>
  );
}
