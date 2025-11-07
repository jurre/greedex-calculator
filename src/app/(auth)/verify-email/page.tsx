import RightSideImage from "@/components/auth/right-side-image";
import { VerifyEmailContent } from "@/components/auth/verify-email-content";

export default function VerifyEmailPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 justify-center">
          <div className="w-full max-w-md">
            <VerifyEmailContent />
          </div>
        </div>
      </div>
      <RightSideImage />
    </div>
  );
}
