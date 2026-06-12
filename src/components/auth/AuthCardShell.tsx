import { AppLogo } from "@/components/common/AppLogo";
import { Card, CardContent } from "@/components/ui/card";

interface AuthCardShellProps {
  children: React.ReactNode;
}

// Simple centered card for standalone auth utility screens (password reset
// etc.) — no step indicator, no split showcase.
export const AuthCardShell = ({ children }: AuthCardShellProps) => {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-linear-to-b from-background to-surface-tint px-4 py-10 sm:px-6">
      <div className="flex w-full max-w-md flex-col gap-6">
        <AppLogo />
        <Card className="gap-0 py-0 shadow-[0_16px_50px_rgba(83,74,183,0.1)] ring-border">
          <CardContent className="flex flex-col gap-6 p-6 duration-500 animate-in fade-in slide-in-from-bottom-2 sm:p-8">
            {children}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
