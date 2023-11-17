import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Privacy and Policy",
  description: "NoteHub privacy and policy",
};

const TeamsAndConditionsLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <main>{children}</main>;
};

export default TeamsAndConditionsLayout;
