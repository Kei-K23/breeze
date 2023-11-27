import Link from "next/link";
import React from "react";

const PrivacyAndPolicy = () => {
  return (
    <div className="p-8 sm:px-16 md:px-24 ">
      <h1 className="text-3xl mb-4">Breeze Chat Application Privacy Policy</h1>
      <p className="text-xl">
        Welcome to Breeze, a real-time chat web application. This Privacy Policy
        outlines how we collect, use, disclose, and protect your information
        when you use our services.
      </p>

      <h2 className="text-2xl m-4">1. Information We Collect</h2>

      <p className="text-xl">
        1.1 Account Information: When you sign up for Breeze, we collect your
        email address, name, and profile picture to create and manage your
        account.
        <br />
        1.2 Text messages exchanged within the app may be stored on our servers
        to enable real-time communication.
        <br />
        1.3 We collect data on how you interact with our app, such as log
        information, device information, and usage patterns.
      </p>

      <h2 className="text-2xl m-4">2. How We Use Your Information</h2>

      <p className="text-xl">
        2.1 Providing and Improving Services We use the collected information to
        provide and enhance Breeze&apos;s features, personalize content, and
        improve user experience.
        <br />
        2.3 Analytics We use analytics tools to analyze user behavior and
        improve our services. This may involve sharing aggregated and anonymized
        data with third-party service providers.
      </p>

      <h2 className="text-2xl m-4">3. How We Share Your Information</h2>

      <p className="text-xl">
        3.1 Third-Party Service Providers We may share your information with
        trusted third-party service providers to assist us in delivering and
        improving our services.
      </p>

      <h2 className="text-2xl m-4">4. Security</h2>

      <p className="text-xl">
        We take reasonable measures to protect your personal information from
        unauthorized access, disclosure, alteration, and destruction. However,
        no method of transmission over the internet or electronic storage is
        completely secure.
      </p>
      <div className="flex justify-center items-center flex-col mt-5">
        <h2 className="text-2xl m-4 text-center font-semibold">
          Thank you for choosing Breeze!
        </h2>
        <Link className="mt-4 underline " href={"/"}>
          Back To Home Page
        </Link>
      </div>
    </div>
  );
};

export default PrivacyAndPolicy;
