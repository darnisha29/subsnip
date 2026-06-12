import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]",
      h2: "text-xl font-semibold tracking-tight text-foreground sm:text-2xl",
      h3: "text-lg font-semibold text-foreground",
      h4: "text-base font-semibold text-foreground",
      lead: "text-base leading-7 text-muted-foreground",
      body: "text-base leading-7 text-foreground",
      small: "text-sm leading-6 text-muted-foreground",
      caption: "text-xs text-tertiary",
      error: "text-sm leading-5 text-destructive",
      // For text nested inside another Typography: adds no size/color so the
      // parent variant's styles flow through.
      inherit: "",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type TypographyVariant = NonNullable<
  VariantProps<typeof typographyVariants>["variant"]
>;

const variantElements: Record<TypographyVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  lead: "p",
  body: "p",
  small: "p",
  caption: "span",
  error: "p",
  inherit: "span",
};

type TypographyProps<T extends React.ElementType> = {
  as?: T;
  variant?: TypographyVariant;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "variant">;

export const Typography = <T extends React.ElementType = "p">({
  as,
  variant = "body",
  className,
  ...props
}: TypographyProps<T>) => {
  const Component: React.ElementType = as ?? variantElements[variant];

  return (
    <Component
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  );
};
