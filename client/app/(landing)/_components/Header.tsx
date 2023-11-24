import LoginDialog from "./LoginDialog";

const Header = () => {
  const contentForHeroSection = [
    {
      title: "🚀 Instant Connectivity",
      description:
        "Connect instantly with friends, colleagues, or clients across the globe. Say goodbye to delays and embrace swift, real-time conversations.",
    },
    {
      title: "🌐 Global Reach, Local Feel",
      description:
        "From anywhere, at any time, experience a local touch within global conversations. Breeze ensures your chats feel personal, no matter the distance.",
    },
    {
      title: "🛡️ Secure and Reliable",
      description:
        "Trust in our robust security measures. Your privacy and data protection are our top priorities, ensuring worry-free conversations.",
    },
  ];

  return (
    <>
      <h1 className="tracking-wide max-w-4xl text-center text-2xl md:text-4xl xl:text-5xl font-semibold">
        Welcome to <span className="font-extrabold underline"> Breeze</span>:{" "}
        <span> Where Conversations Soar</span>
      </h1>
      <h2 className="tracking-wide max-w-3xl text-center text-xl md:text-3xl xl:text-4xl font-semibold">
        <span className="text-sky-500">Engage</span>,{" "}
        <span className="text-purple-500">Link</span>, and{" "}
        <span className="text-red-500">Thrive</span> in{" "}
        <span className="text-green-500">Real-Time</span>.
      </h2>

      <h2 className="tracking-wide max-w-3xl text-center text-xl md:text-3xl xl:text-4xl font-semibold">
        Experience the Difference
      </h2>

      <div className="mt-5 grid grid-cols-1 md:mx-7 md:grid-cols-2 lg:mx-10 lg:grid-cols-3 lg:max-w-[1200px]  gap-4">
        {contentForHeroSection.map((content, index) => (
          <div
            key={index}
            className="border dark:border-slate-800 border-slate-300 p-4 cursor-pointer hover:shadow-lg dark:hover:shadow-slate-900 hover:shadow-slate-300"
          >
            <h3 className="text-center mb-2 text-xl">{content.title}</h3>
            <p>{content.description}</p>
          </div>
        ))}
      </div>

      <LoginDialog />
    </>
  );
};

export default Header;
