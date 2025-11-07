import { LoginForm } from "@/components/auth/login-form";
import RightSideImage from "@/components/auth/right-side-image";
import BackToHome from "@/components/back-to-home";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <BackToHome />
        <div className="flex flex-1 justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      <RightSideImage />
    </div>
  );
}
