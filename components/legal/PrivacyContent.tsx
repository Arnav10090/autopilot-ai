export function PrivacyContent() {
  return (
    <div className="prose dark:prose-invert max-w-none space-y-4">
      <p>
        Your privacy is important to us. It is AutoPilot AI's policy to respect your privacy regarding any information we may collect from you across our website.
      </p>

      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-2">1. Information We Collect</h3>
      <p>
        We collect information that you strictly provide to us. We may ask for personal information, such as your:
      </p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Name</li>
        <li>Email</li>
        <li>Phone number</li>
        <li>Payment information</li>
      </ul>

      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-2 mt-4">2. How We Use Information</h3>
      <p>
        We use the information we collect in various ways, including to:
      </p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Provide, operate, and maintain our website</li>
        <li>Improve, personalize, and expand our website</li>
        <li>Understand and analyze how you use our website</li>
        <li>Develop new products, services, features, and functionality</li>
        <li>Send you emails</li>
        <li>Find and prevent fraud</li>
      </ul>

      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-2 mt-4">3. Data Security</h3>
      <p>
        We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
      </p>

      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-2 mt-4">4. Project Data Privacy</h3>
      <p>
        Data processed by our AI agents (Project Descriptions, Requirements, etc.) is treated as confidential. We do not use your proprietary project data to train our public models without your explicit consent.
      </p>
    </div>
  );
}
