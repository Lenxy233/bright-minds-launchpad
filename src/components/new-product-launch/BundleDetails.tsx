
const BundleDetails = () => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
      <h3 className="text-xl font-bold text-purple-800 mb-4">Bundle Details</h3>
      <div className="flex justify-center">
        <div className="bg-white rounded-lg p-6 shadow-sm max-w-md w-full">
          <h4 className="font-semibold text-purple-700 text-lg">BMA Bundle</h4>
          <p className="text-gray-600 mt-2">Complete Bright Minds Academy resources including educational activities, lesson plans, videos, and animations</p>
          <p className="font-bold text-purple-600 mt-3 text-xl">$39.00</p>
        </div>
      </div>
    </div>
  );
};

export default BundleDetails;
