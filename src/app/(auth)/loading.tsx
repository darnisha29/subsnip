import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <main
      role="status"
      aria-label="Loading"
      className="flex min-h-dvh items-center justify-center bg-background"
    >
      <LoaderCircle
        aria-hidden="true"
        className="size-7 animate-spin text-primary"
      />
    </main>
  );
};

export default Loading;
