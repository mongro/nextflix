import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

let lastValidPage = "/"; // fallback

export function useLastValidPage(excludedPath: string) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.includes(excludedPath)) {
      lastValidPage = pathname;
    }
  }, [pathname, excludedPath]);

  return lastValidPage;
}
