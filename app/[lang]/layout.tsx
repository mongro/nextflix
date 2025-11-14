import { ReactNode } from "react";
import { i18n } from "@/i18n-config";
import "swiper/swiper.css";
import "@/styles/globals.css";
import {
  assertValidLocale,
  getDictionary,
} from "@/i18n/dictionaries/getDictionary";
import DictionaryProvider from "./_components/dictionary-provider";
import ReactQueryProvider from "./(app)/_components/react-query-provider";

//export const revalidate = 600000;

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
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
    <html lang={params.lang} className="dark">
      <head />
      <body>
        <ReactQueryProvider>
          <DictionaryProvider dictionary={dictionary} lang={params.lang}>
            {children}
          </DictionaryProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
