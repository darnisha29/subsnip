import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";

// Brand-adjacent palette; the initial is tinted by a stable hash of the name so
// each service keeps a consistent colour across renders.
const PALETTE = ["#534ab7", "#d85a30", "#3b6d11", "#7c74d9", "#2aabee"];

const colorFor = (name: string): string => {
  const sum = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
};

interface SubscriptionAvatarProps {
  name: string;
  className?: string;
}

export const SubscriptionAvatar = ({
  name,
  className,
}: SubscriptionAvatarProps) => {
  return (
    <Typography
      as="span"
      aria-hidden="true"
      style={{ color: colorFor(name) }}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-sm font-bold ring-1 ring-border",
        className,
      )}
    >
      {name.charAt(0).toUpperCase()}
    </Typography>
  );
};
