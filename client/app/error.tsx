"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex justify-center items-center flex-col mt-8 md:mt-16">
      <h2 className="text-3xl md:text-5xl">Something went wrong!</h2>
      <Image
        src={"/no-records.png"}
        alt="No Records"
        width={300}
        height={300}
      />
      <Button size={"lg"} className="text-xl" onClick={() => reset()}>
        Try again
      </Button>
      <Link className="mt-4 underline" href={"/"}>
        Back To Home Page
      </Link>
    </div>
  );
}
