import SignInForm from "@/components/auth/SignInForm";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Suspense fallback={<div>Chargement...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
} 