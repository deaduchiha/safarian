import { SignInForm } from "./_components/sign-in-form";
import { appName } from "@/lib/shared";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">{appName}</h1>
        <p className="mt-2 text-muted-foreground">برای ادامه وارد شوید</p>
      </div>
      <SignInForm />
    </div>
  );
}
