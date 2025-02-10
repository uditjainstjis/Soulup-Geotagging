import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Effective Date: 9th Feb 2025</p>
        
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-6">
            This Privacy Policy ("Policy") describes how SoulUp (property of Auriga Connect Pvt. Ltd.) 
            ("Company," "we," "us," or "our") collects, uses, and protects information obtained from 
            users ("you," "your") when accessing and using our website and services. By accessing or 
            using our website, you agree to the terms of this Policy.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect and process the following categories of information when you use our website:
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.1 Account Information</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2">
                We use Google Authenticator for secure login. No personal identifiers, such as names, 
                phone numbers, or photographs, are collected during the account creation process.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.2 User-Provided Data</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2">
                <span className="font-semibold">Location Data:</span> Approximate location provided 
                voluntarily by the user.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Demographic Data:</span> Age and gender as voluntarily 
                provided by the user.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Emotional Information:</span> Descriptions of emotional 
                challenges voluntarily shared by the user.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.3 Automatically Collected Data</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2">
                Limited technical information related to login sessions may be collected to enhance 
                security and platform integrity.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use of Information</h2>
            <ul className='mb-4'>We use the collected information strictly for the following purposes:</ul>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2">
                <span className="font-semibold">Display on Public Map:</span> Location, age, gender, 
                and emotional challenge information may be anonymously displayed on a public map 
                accessible only to other authenticated users.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Anonymity:</span> No personal identifiers are 
                associated with the displayed information.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Platform Functionality:</span> Data is used solely to 
                enable user interactions on the platform in a secure and anonymous manner.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Legal Basis for Processing</h2>
            <p className="text-gray-700 mb-4">
              We process personal information based on your consent when you voluntarily provide data 
              for use on the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, lease, or disclose your personal information to third parties for any 
              marketing or analytical purposes. The only exception is the use of Google Authenticator 
              for secure login.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement and maintain appropriate technical and organizational security measures to 
              protect user information, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2">
                <span className="font-semibold">Secure Authentication:</span> Google Authenticator 
                ensures secure access to accounts.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Encryption:</span> Data is encrypted in transit and at 
                rest to prevent unauthorized access.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. User Anonymity</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2">
                All data displayed on the public map is anonymous and does not directly identify any user.
              </li>
              <li className="mb-2">
                We encourage users to avoid including personally identifiable information when sharing 
                emotional challenges.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain data only as long as necessary to provide our services or as required by 
              applicable legal and regulatory obligations. Users may request deletion of their account 
              and associated data by contacting us at{' '}
              <a href="mailto:connect@soulup.in" className="text-blue-600 hover:text-blue-800">
                connect@soulup.in
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">By using the website, you agree to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2">
                <span className="font-semibold">Maintain Anonymity:</span> Avoid submitting personally 
                identifiable information in descriptions of emotional challenges.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Respect Other Users:</span> Interact respectfully 
                without violating the privacy rights of others.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our services are not intended for individuals under the age of 13. We do not knowingly 
              collect or process information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Data Subject Rights</h2>
            <p className="text-gray-700 mb-4">
              Subject to applicable laws, you may have the following rights regarding your personal 
              information:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2">
                <span className="font-semibold">Access:</span> Request access to the information we 
                hold about you.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Correction:</span> Request correction of inaccurate or 
                incomplete information.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Data Deletion:</span> Request the deletion of your 
                information.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Objection:</span> Object to the processing of your 
                information under certain circumstances.
              </li>
            </ul>
            <p className="text-gray-700 mb-4">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:connect@soulup.in" className="text-blue-600 hover:text-blue-800">
                connect@soulup.in
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Updates to this Policy</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify this Policy at any time. If material changes are made, we 
              will provide notice to users and update the effective date accordingly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span>{' '}
              <a href="mailto:connect@soulup.in" className="text-blue-600 hover:text-blue-800">
                connect@soulup.in
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;