import Navbar from "@/components/navbar";

const LandingPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full">
      <Navbar
        iconLink="/"
        name={"my name"}
        email={"my email"}
        image={"my image"}
      />
      <main>{children}</main>
    </div>
  );
};

export default LandingPageLayout;
