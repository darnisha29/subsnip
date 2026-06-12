import { Typography } from "@/components/common/Typography";
import { Separator } from "@/components/ui/separator";

interface AuthDividerProps {
  label: string;
}

export const AuthDivider = ({ label }: AuthDividerProps) => {
  return (
    <div aria-hidden="true" className="relative flex h-5 items-center">
      <Separator className="absolute inset-x-0 top-1/2" />
      <Typography
        as="span"
        variant="small"
        className="relative mx-auto bg-card px-2"
      >
        {label}
      </Typography>
    </div>
  );
};
