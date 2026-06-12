import { cn } from "@/lib/utils";

const tones = {
  plum: "bg-pill text-pill-foreground",
  telegram: "bg-telegram-tint text-telegram",
  success: "bg-success-tint text-success",
} as const;

interface IconBlockProps {
  tone?: keyof typeof tones;
  children: React.ReactNode;
}

// 56px rounded icon tile centered above onboarding step titles. Tone signals
// the step's mood: plum = decision, telegram = handoff, success = completion.
export const IconBlock = ({ tone = "plum", children }: IconBlockProps) => {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mx-auto flex size-14 items-center justify-center rounded-[14px]",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
};
