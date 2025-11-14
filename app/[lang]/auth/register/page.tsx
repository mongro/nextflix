"use client";

import { SignUpForm } from "@/components/auth/register-form";
import { Card } from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <div className="mt-12 mx-auto max-w-md px-4">
      <Card>
        <SignUpForm />
      </Card>
    </div>
  );
}
