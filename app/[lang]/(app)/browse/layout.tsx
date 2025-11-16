import { ReactNode } from "react";
import { Locale } from "@/i18n-config";
import Browse from "./browse";
import { Metadata, ResolvingMetadata } from "next";
import {
  assertValidLocale,
  getDictionary,
} from "@/i18n/dictionaries/getDictionary";

interface Props {
  children?: ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  assertValidLocale(lang);
  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.meta.titleHome,
    description: dictionary.meta.description,
  };
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
