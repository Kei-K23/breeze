import { buttonVariants } from "@/components/ui/button";
import { getCurrentYear } from "@/lib/dateFormatter";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex py-4 px-10 justify-between items-center w-full">
      <div className="hidden md:block">
        <Link href={"/"} className="flex  items-center gap-3">
          <span className="underline font-bold text-lg">Breeze</span>
          <Image
            src={"/breezeIcon.png"}
            alt="breeze icon"
            width={30}
            height={30}
          />
        </Link>
        <div>© {getCurrentYear()} Breeze. All rights reserved.</div>
        <div>
          Create with 💙 by{" "}
          <Link
            className="underline text-sky-500"
            href={"https://github.com/Kei-K23"}
            target="_blank"
          >
            Kei-K23
          </Link>{" "}
        </div>
      </div>
      <div className="w-full md:w-auto flex justify-between items-center gap-4">
        <Link
          href={"/privacy&policy"}
          className={buttonVariants({ variant: "ghost" })}
        >
          Privacy & Policy
        </Link>
        <Link
          href={"/terms&conditions"}
          className={buttonVariants({ variant: "ghost" })}
        >
          Teams & Conditions
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
