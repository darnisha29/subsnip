import { AppSidebar } from "@/components/layout/AppSidebar";

const PrivateLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <AppSidebar />
      {/* Bottom padding clears the fixed mobile rail; it is static on desktop. */}
      <div className="flex flex-1 flex-col pb-16 md:pb-0">{children}</div>
    </div>
  );
};

export default PrivateLayout;
