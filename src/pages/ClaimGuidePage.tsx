export function ClaimGuidePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Token Claim Guide
        </h2>
        <p className="text-gray-600">
          This guide will walk you through the process of claiming your vested tokens from the Hedgey vesting portal.
        </p>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Content Coming Soon
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Detailed instructions for claiming your tokens from the Hedgey vesting portal will be added here shortly.
          </p>
        </div>
      </div>

      {/* FAQ Placeholder */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Frequently Asked Questions
        </h3>
        <p className="text-gray-500">
          FAQ section will be added here.
        </p>
      </div>
    </div>
  );
}
