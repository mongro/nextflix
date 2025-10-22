import { ReactNode, Suspense } from "react";
import ReactQueryWrapper from "../reactQueryWrapper";
import ModalWrapper from "../ModalProvider";
import Header from "../Header";
import { i18n } from "../../i18n-config";
import "swiper/swiper.min.css";
import "../../styles/globals.css";
import {
  assertValidLocale,
  getDictionary,
} from "../dictionaries/getDictionary";
import DictionaryProvider from "../DictionaryProvider";
import FramerWrapper from "../FramerWrapper";
import { NuqsAdapter } from "nuqs/adapters/next/app";

//export const revalidate = 60;

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
        <FramerWrapper>
          <NuqsAdapter>
            <DictionaryProvider dictionary={dictionary} lang={params.lang}>
              <ReactQueryWrapper>
                <Suspense>
                  <Header dictionary={dictionary.header} lang={params.lang} />
                </Suspense>
                <ModalWrapper>{children}</ModalWrapper>
              </ReactQueryWrapper>
            </DictionaryProvider>
          </NuqsAdapter>
        </FramerWrapper>
      </body>
    </html>
  );
}
