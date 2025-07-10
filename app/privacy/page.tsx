export default function PrivacyPolicy() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">We value your privacy. Your feedback is collected anonymously and is only used to help us improve our restaurant services. We do not sell or share your personal information with third parties. Any data collected is securely stored and only accessible to authorized staff for analysis and improvement purposes.</p>
      <ul className="list-disc pl-6 mb-4">
        <li>No personal data is required to submit feedback.</li>
        <li>If you provide contact information for rewards, it is only used for that purpose.</li>
        <li>All data is stored securely and access is restricted.</li>
        <li>You may contact us at any time to request deletion of your data.</li>
      </ul>
      <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
    </main>
  )
} 