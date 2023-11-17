import Link from "next/link";
import React from "react";

const PrivacyAndPolicy = () => {
  return (
    <div className="p-8 sm:px-16 md:px-24 ">
      <h1 className="text-3xl mb-4">Privacy Policy for NoteHub</h1>
      <p className="text-xl">
        Welcome to NoteHub! This Privacy Policy is designed to help you
        understand how NoteHub collects, uses, and safeguards your personal
        information. We respect your privacy and are committed to protecting
        your data. By using NoteHub, you agree to the terms outlined in this
        Privacy Policy. If you do not agree with these terms, please refrain
        from using our services.
      </p>

      <h2 className="text-2xl m-4">1. Information We Collect</h2>

      <p className="text-xl">
        1.1 Personal Information When you sign up for NoteHub, we collect
        personal information such as your name, email address, and any other
        information you choose to provide. We use this information to create and
        manage your account, personalize your experience, and communicate with
        you about our services.
        <br />
        1.2 Usage Information We may collect information about how you interact
        with NoteHub, including the pages you visit, the features you use, and
        the time spent on the platform. This helps us improve our services and
        tailor them to your preferences.
        <br />
        1.3 Device and Browser Information We may collect information about the
        device and browser you use to access NoteHub, such as your IP address,
        device type, and browser type. This information helps us ensure
        compatibility and enhance your user experience.
      </p>

      <h2 className="text-2xl m-4">2. How We Use Your Information</h2>

      <p className="text-xl">
        2.1 Providing and Improving Services We use the collected information to
        provide and enhance NoteHub&apos;s features, personalize content, and
        improve user experience.
        <br />
        2.2 Communication We may send you emails or notifications related to
        your account, updates, and promotional materials. You can opt out of
        promotional communications at any time.
        <br />
        2.3 Analytics We use analytics tools to analyze user behavior and
        improve our services. This may involve sharing aggregated and anonymized
        data with third-party service providers.
      </p>

      <h2 className="text-2xl m-4">3. How We Share Your Information</h2>

      <p className="text-xl">
        3.1 Third-Party Service Providers We may share your information with
        trusted third-party service providers to assist us in delivering and
        improving our services. These providers are bound by confidentiality
        agreements and are not allowed to use your information for any purpose
        other than providing services to NoteHub.
        <br />
        3.2 Legal Compliance We may disclose your information if required by law
        or in response to a valid legal request.
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
          Thank you for choosing NoteHub!
        </h2>
        <Link className="mt-4 underline " href={"/"}>
          Back To Home Page
        </Link>
      </div>
    </div>
  );
};

export default PrivacyAndPolicy;
