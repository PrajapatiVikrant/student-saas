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
              This Privacy Policy applies to the InstituteERP platform including the
              <strong> Admin Portal</strong>, <strong>Teacher Portal</strong>, and the{" "}
              <strong>Parent Portal mobile application available on Android devices</strong>.
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
                <strong>Personal Details:</strong> Name, phone number, email,
                student details, guardian details.
              </li>

              <li>
                <strong>Academic Information:</strong> Class/section, attendance,
                marks, results, timetable, homework.
              </li>

              <li>
                <strong>Fee & Payment Information:</strong> Fee status,
                transaction details, payment receipts.
              </li>

              <li>
                <strong>Device & Technical Data:</strong> IP address, browser type,
                device type, app logs, usage analytics, and push notification tokens
                used for sending important alerts.
              </li>
            </ul>
          </section>

          {/* Notifications */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              3. Notifications
            </h2>

            <p>
              InstituteERP may send push notifications through services such as
              Firebase Cloud Messaging (FCM) to deliver important updates
              including:
            </p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Attendance updates</li>
              <li>Homework notifications</li>
              <li>School announcements</li>
              <li>Fee reminders</li>
              <li>Important academic alerts</li>
            </ul>

            <p className="mt-3">
              These notifications help parents stay informed about student
              activities and school communications.
            </p>
          </section>

          {/* How we use */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              4. How We Use Your Information
            </h2>

            <p>We use the collected information to:</p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Provide and improve our services.</li>
              <li>Manage attendance and student records.</li>
              <li>Track academic progress and performance.</li>
              <li>Generate reports and fee receipts.</li>
              <li>Enable communication between school, teachers, and parents.</li>
              <li>Provide customer support.</li>
              <li>Maintain platform security.</li>
            </ul>
          </section>

          {/* Payments */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              5. Payments & Subscriptions
            </h2>

            <p>
              InstituteERP supports payment functionality for:
            </p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>School Fee Payments:</strong> Parents may pay school fees
                through the Parent Portal.
              </li>

              <li>
                <strong>Subscription Payments:</strong> Schools may subscribe to
                premium services provided by InstituteERP.
              </li>
            </ul>

            <p className="mt-3">
              Payments are processed through trusted third-party payment gateways
              such as <strong>Razorpay</strong>. We do not store sensitive card,
              banking, or UPI credentials.
            </p>

            <p className="mt-3">
              Only transaction related information such as transaction ID,
              payment status, and receipts may be stored for record purposes.
            </p>
          </section>

          {/* Data sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              6. Sharing of Information
            </h2>

            <p>
              We do not sell or rent personal information. Information may be
              shared in the following cases:
            </p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>With the respective school using InstituteERP.</li>
              <li>With payment gateway providers for payment processing.</li>
              <li>If required by law or legal authorities.</li>
              <li>To protect the security of the platform and its users.</li>
            </ul>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              7. Data Security
            </h2>

            <p>
              We implement reasonable technical and organizational measures
              to protect user data against unauthorized access, loss,
              or misuse.
            </p>

            <p className="mt-3">
              However, no internet-based system can guarantee absolute security.
            </p>
          </section>

          {/* Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              8. Data Retention
            </h2>

            <p>
              We retain user data only as long as necessary for service
              operations, school record management, legal compliance,
              and subscription management.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              9. Cookies & Tracking
            </h2>

            <p>
              InstituteERP may use cookies and similar technologies to
              improve user experience, maintain login sessions,
              and analyze usage trends.
            </p>
          </section>

          {/* Children */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              10. Children’s Privacy
            </h2>

            <p>
              The platform may store student data provided by schools or
              parents. Student information is used strictly for educational
              and administrative purposes.
            </p>
          </section>

          {/* Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              11. Your Rights
            </h2>

            <p>
              Users may request access, correction, or deletion of their
              personal data by contacting us.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              12. Changes to This Privacy Policy
            </h2>

            <p>
              We may update this policy occasionally. Updated versions will
              always be posted on this page.
            </p>
          </section>

          {/* Parent portal clarification */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              13. Parent Portal Mobile Application
            </h2>

            <p>
              The Parent Portal mobile application allows parents to access
              student information shared by their school through the
              Institute ERP platform.
            </p>

            <p className="mt-3">
              Parent accounts are not created directly by users. Accounts are
              created by the school administration and login credentials are
              provided to parents by the respective school.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              14. Contact Us
            </h2>

            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-5">
              <p>
                <strong>Company:</strong> CodeFlame Technology
              </p>

              <p>
                <strong>Address:</strong> Ground Floor, Office No. G6, A-82, Sector 4, Noida,
                Uttar Pradesh - 201102, India
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
                  href="https://www.codeflametechnology.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://www.codeflametechnology.com
                </a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}