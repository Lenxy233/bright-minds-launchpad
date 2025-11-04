
const BundleDetails = () => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
      <h3 className="text-xl font-bold text-purple-800 mb-4">Bundle Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-purple-700">Kids Curriculum Bundle</h4>
          <p className="text-gray-600 mt-2">Educational activities and lesson plans</p>
          <p className="font-bold text-purple-600 mt-2">$19.99</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-purple-700">Video Bundle</h4>
          <p className="text-gray-600 mt-2">Video tutorials and training content</p>
          <p className="font-bold text-purple-600 mt-2">$19.99</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-purple-700">Animation Video Bundle</h4>
          <p className="text-gray-600 mt-2">Animated videos for content creation</p>
          <p className="font-bold text-purple-600 mt-2">$19.99</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-purple-700">BMA Bundle</h4>
          <p className="text-gray-600 mt-2">Complete Bright Minds Academy resources</p>
          <p className="font-bold text-purple-600 mt-2">$19.99</p>
        </div>
      </div>
    </div>
  );
};

export default BundleDetails;
