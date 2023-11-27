"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { LogInIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Separator from "./Separator";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import GetGoogleOAuthURL from "@/lib/getGoogleOAuthURL";
import GetGithubOAuthURL from "@/lib/getGithubOAuthURL";

const loginForm = z.object({
  name: z.string().min(3, {
    message: "name must be at least 3 character",
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 character",
  }),
});

export default function LoginDialog() {
  const NEXT_ROOT_URL = process.env.NEXT_ROOT_URL;

  const router = useRouter();

  const form = useForm<z.infer<typeof loginForm>>({
    resolver: zodResolver(loginForm),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  async function onSubmit(value: z.infer<typeof loginForm>) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/auth/login`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: value.name,
            password: value.password,
          }),
          credentials: "include",
          next: {
            revalidate: 0,
          },
        }
      );
      const data = await res.json();

      if (res.ok && res.status == 200 && data.success) {
        toast.success(data.message);
        router.push(`/dashboard`);
        return;
      } else {
        return toast.error(data.error);
      }
    } catch (e: any) {
      return toast.error(e.message);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <span className="text-lg">Login To Breeze</span>
          <LogInIcon className="ml-2 h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Login To Breeze</DialogTitle>
          <DialogDescription className="text-md">
            Login in to Breeze with your desire methods
          </DialogDescription>
          <DialogDescription>
            <Link className="text-blue-400 underline" href={"/register"}>
              New user? register here
            </Link>
          </DialogDescription>
        </DialogHeader>

        <GetGoogleOAuthURL />

        <Separator />

        <GetGithubOAuthURL />

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g foo"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="e.g password123"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Login</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
