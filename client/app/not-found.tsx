import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center flex-col mt-8 md:mt-16">
      <h2 className="text-3xl md:text-5xl">Page Not Found</h2>
      <Image
        src={"/not_found.png"}
        alt="page not found image"
        width={300}
        height={300}
      />
      <Link className="mt-4 underline" href="/">
        Return Home
      </Link>
    </div>
  );
}
