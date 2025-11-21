"use client";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { useState } from "react";
import { signUpAnonym } from "@/lib/auth/actions";

export function SignUpAnonym() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const handleClick = async () => {
    setIsLoading(true);
    const success = await signUpAnonym();
    setIsLoading(false);
    if (success) {
      queryClient.refetchQueries({ queryKey: ["session"] });
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 border-2 mt-2 p-6">
      <p>
        Create an anonym account without providing any data. Just for one time
        use.{" "}
      </p>
      <div>
        <Button onClick={handleClick} disabled={isLoading}>
          {isLoading && <Spinner />}
          Try it
        </Button>
      </div>
    </div>
  );
}
