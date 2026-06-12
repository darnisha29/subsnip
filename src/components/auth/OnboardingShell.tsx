import { AppLogo } from "@/components/common/AppLogo";
import { StepIndicator } from "@/components/auth/StepIndicator";

interface OnboardingShellProps {
  step: number | "final";
  children: React.ReactNode;
}

// Pattern B onboarding layout: white app bar (logo + step progress) over a
// warm page with centered 460px content.
export const OnboardingShell = ({ step, children }: OnboardingShellProps) => {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6">
        <AppLogo />
        <StepIndicator current={step} />
      </header>
      <main className="flex flex-1 justify-center px-4 py-8 sm:py-12">
        <div className="flex w-full max-w-115 flex-col gap-6 duration-500 animate-in fade-in slide-in-from-bottom-2">
          {children}
        </div>
      </main>
    </div>
  );
};
