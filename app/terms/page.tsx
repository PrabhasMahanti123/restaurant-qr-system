export default function TermsOfService() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">By using our feedback system, you agree to the following terms:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Feedback should be honest and respectful.</li>
        <li>Abusive or inappropriate content will not be tolerated and may be removed.</li>
        <li>Participation in rewards is optional and subject to fair use.</li>
        <li>We reserve the right to update these terms at any time.</li>
      </ul>
      <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
    </main>
  )
} 