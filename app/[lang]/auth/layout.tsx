import { ReactNode } from "react";
import { Footer } from "../_components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signUpAnonym } from "@/lib/auth/actions";
import { SignUpAnonym } from "@/components/auth/sign-up-anonym";

interface Props {
  children?: ReactNode;
}

export default async function Layout(props: Props) {
  const { children } = props;

  return (
    <div className="flex flex-col gap-4 h-screen justify-center items-center w-full">
      <div className="w-full">{children}</div>
      <SignUpAnonym />
      <div className="grow flex justify-center items-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/">Back to Homepage</Link>
        </Button>
      </div>
      <Footer />
    </div>
  );
}
