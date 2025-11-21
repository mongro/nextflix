import { ReactNode, Suspense } from "react";
import ModalWrapper from "./_components/modal-provider";
import Header from "./_components/header";
import { i18n } from "@/i18n-config";
import {
  assertValidLocale,
  getDictionary,
} from "@/i18n/dictionaries/getDictionary";
import FramerWrapper from "./_components/framer-wrapper";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Footer } from "../_components/footer";

export const revalidate = 3600;

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
interface Props {
  children?: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function Layout(props: Props) {
  const params = await props.params;

  const { children } = props;
  assertValidLocale(params.lang);
  const dictionary = await getDictionary(params.lang);

  return (
    <FramerWrapper>
      <NuqsAdapter>
        <Suspense>
          <Header dictionary={dictionary.header} lang={params.lang} />
        </Suspense>
        <ModalWrapper>{children}</ModalWrapper>
        <Footer />
      </NuqsAdapter>
    </FramerWrapper>
  );
}
