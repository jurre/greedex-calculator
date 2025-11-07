import RightSideImage from "@/components/auth/right-side-image";
import { SignupForm } from "@/components/auth/signup-form";
import BackToHome from "@/components/back-to-home";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <BackToHome />
        <div className="flex flex-1 justify-center">
          <div className="w-full max-w-md">
            <SignupForm />
          </div>
        </div>
      </div>
      <RightSideImage />
    </div>
  );
}
