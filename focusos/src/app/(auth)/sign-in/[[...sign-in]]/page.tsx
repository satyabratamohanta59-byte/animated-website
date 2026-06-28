import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <div className="flex justify-center px-4">
      <SignIn
        forceRedirectUrl="/app/dashboard"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
