import {
  assertValidLocale,
  getDictionary,
} from "@/i18n/dictionaries/getDictionary";
import { ReactNode } from "react";
import Header from "./header";

//export const revalidate = 60;
interface Props {
  children?: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function RootLayout(props: Props) {
  const params = await props.params;

  const { children } = props;

  assertValidLocale(params.lang);
  const dictionary = await getDictionary(params.lang);

  return (
    <>
      <Header lang={params.lang} dictionary={dictionary.header} />
      <div className="mx-auto mt-16 w-5/6 max-w-3xl">{children}</div>
    </>
  );
}
