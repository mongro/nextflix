import tmdbLogo from "@/public/tmdb.svg";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <div className="bg-blue-900 p-2 lg:p-6 mt-8 w-full">
      <div className="flex justify-center gap-4 items-center">
        {" "}
        <p>
          This webite uses the{" "}
          <Link href="https://www.themoviedb.org" className="underline">
            TMDB API
          </Link>{" "}
          but is not endorsed or certified by TMDB.
        </p>
        <Link href="https://www.themoviedb.org">
          <Image src={tmdbLogo} alt="The Movie Database Logo" />
        </Link>
      </div>
    </div>
  );
}
