import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Negotiator from "negotiator";
import { i18n } from "./i18n-config";
import { match } from "@formatjs/intl-localematcher";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

const COOKIE_LOCALE_NAME = "NEXT_LOCALE";
function getLocaleFromCookie(
  requestCookies: RequestCookies,
  locales: string[]
) {
  let locale;
  if (requestCookies) {
    if (requestCookies.has(COOKIE_LOCALE_NAME)) {
      const value = requestCookies.get(COOKIE_LOCALE_NAME)?.value;
      if (value && locales.includes(value)) {
        locale = value;
      }
    }
  }

  return locale;
}

function getLocaleFromHeader(request: NextRequest, locales: string[]) {
  let locale;
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );
  locale = match(languages, locales, i18n.defaultLocale);

  return locale;
}

export function middleware(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;

  if (request.method === "POST") return;
  let redirectPath = "";
  let redirectSearch = search;
  if (searchParams.get("id") && searchParams.get("type")) {
    redirectPath = `/browse/${searchParams.get("type")}/${searchParams.get(
      "id"
    )}`;
    redirectSearch = "";
  }
  const locales = i18n.locales;
  let locale: string | undefined;
  const pathLocale = pathname.split("/")[1];
  if (locales.includes(pathLocale)) {
    locale = pathLocale;
  }

  if (locale) {
    if (redirectPath) {
      return NextResponse.redirect(
        new URL(`/${locale}${redirectPath}${redirectSearch}`, request.url)
      );
    }
    return;
  }
  if (pathname.split("/")[1] === "test") return;
  locale = getLocaleFromCookie(request.cookies, locales);
  if (!locale) {
    locale = getLocaleFromHeader(request, locales);
  }
  if (!locale) {
    locale = i18n.defaultLocale;
  }

  redirectPath = `/${locale}${redirectPath || pathname}`;

  let response = NextResponse.redirect(
    new URL(`${redirectPath}${redirectSearch}`, request.url)
  );

  const hasOutdatedCookie =
    request.cookies.get(COOKIE_LOCALE_NAME)?.value !== locale;

  if (hasOutdatedCookie) {
    response.cookies.set(COOKIE_LOCALE_NAME, locale, {
      sameSite: "strict",
      maxAge: 31536000, // 1 year
    });
  }
  return response;
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
