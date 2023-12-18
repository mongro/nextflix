import { ReactNode, Suspense } from "react";
import ReactQueryWrapper from "../reactQueryWrapper";
import ModalWrapper from "../ModalProvider";
import Header from "../Header";
import { i18n } from "../../i18n-config";
import "swiper/swiper.min.css";
import "../../styles/globals.css";
import { getDictionary } from "../dictionaries/getDictionary";
import DictionaryProvider from "../DictionaryProvider";
import FramerWrapper from "../FramerWrapper";

export const revalidate = 60;

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
interface Props {
  children?: ReactNode;
  params: { lang: "en" | "de" };
  searchParams: { [key: string]: string | undefined };
}

export default async function RootLayout({ children, params }: Props) {
  const dictionary = await getDictionary(params.lang);
  console.log("render root");

  return (
    <html lang={params.lang}>
      <head />
      <body>
        <FramerWrapper>
          <DictionaryProvider dictionary={dictionary} lang={params.lang}>
            <Header dictionary={dictionary.header} lang={params.lang} />
            <ReactQueryWrapper>
              <Suspense>
                <ModalWrapper>{children}</ModalWrapper>
              </Suspense>
            </ReactQueryWrapper>
          </DictionaryProvider>
        </FramerWrapper>
      </body>
    </html>
  );
}
