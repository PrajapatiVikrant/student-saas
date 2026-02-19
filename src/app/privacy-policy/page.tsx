export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Privacy Policy
        </h1>

        <p className="text-gray-600 mb-8">
          Last Updated: February 2026
        </p>

        <div className="space-y-10 text-gray-700 leading-relaxed">
          
          {/* Intro */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              1. Introduction
            </h2>
            <p>
              Welcome to <strong>InstituteERP</strong>, a school and coaching management
              platform powered by <strong>CodeFlame Technology</strong>.
              This Privacy Policy explains how we collect, use, store, and protect
              your personal information when you use our services.
            </p>

            <p className="mt-3">
              This Privacy Policy applies to all portals of InstituteERP, including:
              <strong> Admin Portal</strong>, <strong>Teacher Portal</strong>, and{" "}
              <strong>Parent Portal</strong>.
            </p>
          </section>

          {/* Data we collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              2. Information We Collect
            </h2>
            <p>
              We may collect the following types of information depending on the portal
              and features used:
            </p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Personal Details:</strong> Name, phone number, email, student details,
                guardian details.
              </li>
              <li>
                <strong>Academic Information:</strong> class/section, attendance, marks,
                results, timetable, homework.
              </li>
              <li>
                <strong>Fee & Payment Information:</strong> fee status, transaction details,
                payment receipts (payment is processed securely through payment gateways).
              </li>
              <li>
                <strong>Device & Technical Data:</strong> IP address, browser type, device type,
                app logs, and usage analytics.
              </li>
            </ul>
          </section>

          {/* How we use */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              3. How We Use Your Information
            </h2>
            <p>
              We use the collected information to:
            </p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Provide and improve our services across all portals.</li>
              <li>Manage attendance, student records, and academic progress.</li>
              <li>Generate reports, fee receipts, and performance insights.</li>
              <li>Enable communication between school, teachers, and parents.</li>
              <li>Provide customer support and resolve issues.</li>
              <li>Maintain security and prevent fraud or misuse.</li>
            </ul>
          </section>

          {/* Payments */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              4. Payments & Subscriptions
            </h2>
            <p>
              InstituteERP supports payment functionality for:
            </p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>School Fee Payments:</strong> Parents may pay school fees through the Parent Portal.
              </li>
              <li>
                <strong>Subscription Payments:</strong> Schools may pay for subscription plans or services.
              </li>
            </ul>

            <p className="mt-3">
              Payments are processed through trusted third-party payment gateways such as{" "}
              <strong>Razorpay</strong>. We do not store sensitive card or UPI credentials.
              Payment-related data like transaction ID and payment status may be stored for
              record and receipt purposes.
            </p>

            <p className="mt-3">
              Note: Currently, Admin and Teacher portal access may be provided free of cost,
              but subscription charges may be applied in the future.
            </p>
          </section>

          {/* Data sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              5. Sharing of Information
            </h2>
            <p>
              We do not sell or rent your personal information. However, we may share information:
            </p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                With the respective school/organization using InstituteERP.
              </li>
              <li>
                With third-party services like payment gateways (Razorpay) for payment processing.
              </li>
              <li>
                If required by law, legal process, or government request.
              </li>
              <li>
                To protect our rights, users, and platform security.
              </li>
            </ul>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              6. Data Security
            </h2>
            <p>
              We implement reasonable technical and organizational security measures
              to protect your personal information against unauthorized access, loss,
              misuse, or alteration.
            </p>

            <p className="mt-3">
              However, no system is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Data retention */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              7. Data Retention
            </h2>
            <p>
              We retain user data as long as it is required for service operations,
              school records, legal compliance, or subscription management.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              8. Cookies & Tracking
            </h2>
            <p>
              InstituteERP may use cookies or similar technologies to improve user experience,
              maintain sessions, and analyze usage trends.
            </p>
          </section>

          {/* Children */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              9. Children’s Privacy
            </h2>
            <p>
              Our platform may store student data provided by schools/parents. We collect
              student information only for educational and administrative purposes.
              Parents and schools are responsible for ensuring accuracy of student information.
            </p>
          </section>

          {/* User rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              10. Your Rights
            </h2>
            <p>
              You may request access, correction, or deletion of your personal information
              by contacting us. Some data may be retained for legal or school record purposes.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              11. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Updates will be posted
              on this page with the updated date.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              12. Contact Us
            </h2>

            <p>
              If you have any questions about this Privacy Policy, you can contact us:
            </p>

            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-5">
              <p>
                <strong>Company:</strong> CodeFlame Technology
              </p>
              <p>
                <strong>Address:</strong> Ghaziabad, Uttar Pradesh - 201102, India
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:contact@codeflametechnology.com"
                  className="text-blue-600 hover:underline"
                >
                  contact@codeflametechnology.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong> +91 9149209580, +91 7678110578
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href="https://codeflametechnology.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://codeflametechnology.com
                </a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
