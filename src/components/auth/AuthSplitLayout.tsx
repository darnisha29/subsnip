interface AuthSplitLayoutProps {
  form: React.ReactNode;
  showcase: React.ReactNode;
}

// Full-bleed 50/50 auth shell: product showcase on the warm background half,
// form on the white half. Stacks showcase-first on mobile.
export const AuthSplitLayout = ({ form, showcase }: AuthSplitLayoutProps) => {
  return (
    <main className="min-h-dvh lg:grid lg:grid-cols-2">
      <section
        aria-label="Product overview"
        className="flex bg-background px-5 py-10 sm:px-8 lg:min-h-dvh lg:items-center lg:px-12 xl:px-16"
      >
        <div className="mx-auto w-full max-w-xl">{showcase}</div>
      </section>
      <section
        aria-label="Sign up"
        className="flex border-t border-border bg-card px-5 py-10 sm:px-8 lg:min-h-dvh lg:items-center lg:border-t-0 lg:border-l lg:px-12 xl:px-16"
      >
        <div className="mx-auto w-full max-w-md">{form}</div>
      </section>
    </main>
  );
};
