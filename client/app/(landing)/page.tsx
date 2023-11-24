import Footer from "./_components/Footer";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
export default function LadingPage() {
  return (
    <div className="h-full pt-10 flex justify-center items-center flex-col gap-4 px-5 py-8">
      <Header />
      <Hero />
      <Footer />
    </div>
  );
}
