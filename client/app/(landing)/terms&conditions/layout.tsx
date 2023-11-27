import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Privacy and Policy",
  description: "Breeze privacy and policy",
};

const TermsAndConditionsLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <main>{children}</main>;
};

export default TermsAndConditionsLayout;
