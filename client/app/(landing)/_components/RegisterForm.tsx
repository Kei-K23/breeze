"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

const registerForm = z
  .object({
    name: z.string().min(3, {
      message: "name must be at least 3 character",
    }),
    email: z.string().email(),
    password: z.string().min(6, {
      message: "password must be at least 6 character",
    }),
    confirm_password: z.string().min(6, {
      message: "confirm password must be at least 6 character",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "confirm password does not match with password",
    path: ["confirm_password"],
  });

const RegisterFrom = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerForm>>({
    resolver: zodResolver(registerForm),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(value: z.infer<typeof registerForm>) {
    try {
      const res = await fetch("http://localhost:8090/api/users", {
        method: "POST",
        body: JSON.stringify({
          email: value.email,
          name: value.name,
          password: value.password,
          confirm_password: value.confirm_password,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        console.log(data);
        toast.success("Successfully register");
        return router.push("/");
      } else {
        toast.error(data.error);
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  }
  return (
    <div className="w-[90%] md:w-[70%] lg:w-[55%] xl:w-[45%] h-full  mt-10 mb-5 pb-10  mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="e.g foo" {...field} required />
                </FormControl>
                <FormDescription>
                  This is your account display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g foo@example.com"
                    {...field}
                    required
                  />
                </FormControl>
                <FormDescription>This is your email.</FormDescription>
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
                  <Input placeholder="e.g password123" {...field} required />
                </FormControl>
                <FormDescription>This is your password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="e.g password123" {...field} required />
                </FormControl>
                <FormDescription>
                  This is your confirm password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Register </Button>
        </form>
      </Form>
      <div className="flex justify-center items-center mt-8 underline text-lg">
        <Link href="/" className="text-center ">
          Back to landing page
        </Link>
      </div>
    </div>
  );
};

export default RegisterFrom;
