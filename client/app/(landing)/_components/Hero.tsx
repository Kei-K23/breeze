import Image from "next/image";

const Hero = () => {
  return (
    <div className="mt-6 flex justify-between items-center gap-8">
      <Image src={"/heroImage.png"} alt="hero image" width={300} height={300} />
    </div>
  );
};

export default Hero;
