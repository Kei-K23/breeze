import Navbar from "@/components/navbar";

const LandingPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full">
      <Navbar iconLink="/" />
      <main>{children}</main>
    </div>
  );
};

export default LandingPageLayout;
