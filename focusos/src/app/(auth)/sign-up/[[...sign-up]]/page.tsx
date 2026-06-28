import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function SignUpPage() {
  return (
    <div className="flex justify-center px-4">
      <SignUp
        forceRedirectUrl="/onboarding"
        signInUrl="/sign-in"
      />
    </div>
  );
}
