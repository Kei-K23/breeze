import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Register",
  description: "New user! register here to use NoteHub",
};

const RegisterLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default RegisterLayout;
