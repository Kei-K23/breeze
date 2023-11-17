import Link from "next/link";

const TeamsAndConditions = () => {
  return (
    <div className="p-8 sm:px-16 md:px-24 ">
      <h1 className="text-3xl mb-4">Teams and Conditions for NoteHub</h1>
      <p className="text-xl">
        Welcome to NoteHub! These Terms and Conditions outline the rules and
        regulations for the use of NoteHub&apos;s website.
        <br />
        By accessing this website, we assume you accept these terms and
        conditions in full. Do not continue to use NoteHub&apos;s website if you
        do not accept all of the terms and conditions stated on this page.
      </p>

      <h2 className="text-2xl m-4">1. The Basics</h2>

      <p className="text-xl">
        1.1 Agreement: By using NoteHub, you agree to be bound by these Terms
        and Conditions.
        <br />
        1.2 Updates: We may update or change these Terms and Conditions from
        time to time. Please review this page regularly to stay informed of any
        changes.
      </p>

      <h2 className="text-2xl m-4">2. Use of Services</h2>

      <p className="text-xl">
        2.1 Access: You must be at least 18 years old or have the consent of a
        legal guardian to use NoteHub.
        <br />
        2.2 Account: You are responsible for maintaining the confidentiality of
        your account and password. Notify us immediately of any unauthorized use
        of your account.
        <br />
        2.3 User Content: Any content you upload to NoteHub remains yours.
        However, by uploading content, you grant NoteHub a non-exclusive,
        worldwide, royalty-free license to use, display, and reproduce the
        content.
      </p>

      <h2 className="text-2xl m-4">3. Prohibited Actions</h2>

      <p className="text-xl">
        3.1 Illegal Use: You may not use NoteHub for any illegal or unauthorized
        purpose.
        <br />
        3.2 Abuse: Do not engage in any activity that may interfere with or
        disrupt the services provided by NoteHub.
        <br />
        3.3 Harmful Content: You may not upload, post, or transmit any content
        that is harmful, offensive, or violates the rights of others.
      </p>

      <h2 className="text-2xl m-4">4. Intellectual Property</h2>

      <p className="text-xl">
        4.1 Ownership: NoteHub and its original content, features, and
        functionality are owned by NoteHub and are protected by international
        copyright, trademark, patent, trade secret, and other intellectual
        property or proprietary rights laws.
        <br />
        4.2 Trademarks: All trademarks reproduced on this website that is not
        the property of, or licensed to, the operator is acknowledged on the
        website.
      </p>
      <h2 className="text-2xl m-4">5. Limitation of Liability</h2>

      <p className="text-xl">
        5.1 Use at Your Own Risk: The use of NoteHub is at your sole risk. We
        shall not be liable for any direct, indirect, incidental, special,
        consequential, or punitive damages arising out of the use or inability
        to use NoteHub.
      </p>
      <h2 className="text-2xl m-4">6. Termination</h2>

      <p className="text-xl">
        6.1 Termination: We reserve the right to terminate or suspend your
        account and access to NoteHub at our sole discretion, without prior
        notice, for any reason, including a breach of these Terms and
        Conditions.
      </p>
      <h2 className="text-2xl m-4">7. Governing Law</h2>

      <p className="text-xl">
        7.1 Jurisdiction: These terms and conditions are governed by and
        construed in accordance with the laws of [Your Jurisdiction], and you
        irrevocably submit to the exclusive jurisdiction of the courts in that
        state or location.
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

export default TeamsAndConditions;
