import { GraduationCap, Home, ShoppingBag, Sparkles, Flame } from "lucide-react";

const SimplifiedLandingPage = () => {
  const handlePurchase = () => {
    window.location.href = "https://payhip.com/b/Y5eOc";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-pink-300 rounded-full opacity-50 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-300 rounded-full opacity-50 blur-xl"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-blue-300 rounded-full opacity-50 blur-xl"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">✨</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Bright Minds Academy ✨
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2">
              🌍 English
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2">
              🎮 Kids Learning
            </button>
            <button 
              onClick={handlePurchase}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Get Started Now ✨
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full border-2 border-purple-300 shadow-lg">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Super Fun Limited Time Offer - 97% OFF!
              </span>
              <span className="text-2xl">🎊</span>
            </div>
            
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-xl">
              <Flame className="w-5 h-5 text-white" />
              <span className="font-bold text-white text-lg">
                BLACK FRIDAY SPECIAL
              </span>
              <Flame className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Transform Your Child's Learning with Fun Educational Activities!
              </h2>
              <p className="text-xl text-gray-700 mb-8 bg-white/60 backdrop-blur-sm p-6 rounded-2xl">
                Download instantly and watch your kids learn while having fun with our engaging activities and lesson plans.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 rounded-3xl opacity-75 blur-xl"></div>
              <div className="relative bg-gradient-to-br from-pink-200 to-purple-200 p-4 rounded-3xl border-4 border-white shadow-2xl">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg">
                  <span className="font-bold text-white">⭐ Creativity Unleashed! 🎨</span>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&h=400&fit=crop"
                  alt="Kids Learning"
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Perfect For Section */}
        <section className="mb-20 bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
          <h3 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <span className="text-4xl">🎯</span>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Perfect For
            </span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded-2xl border-2 border-blue-300 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
                <h4 className="text-xl font-bold text-gray-800">📚 Teachers</h4>
              </div>
              <p className="text-gray-700">
                Create engaging classroom materials and supplementary resources
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-green-200 p-8 rounded-2xl border-2 border-green-300 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Home className="w-8 h-8 text-green-600" />
                <h4 className="text-xl font-bold text-gray-800">👨‍👩‍👧 Parents</h4>
              </div>
              <p className="text-gray-700">
                Support your child's learning journey at home with fun activities
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-100 to-orange-200 p-8 rounded-2xl border-2 border-orange-300 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <ShoppingBag className="w-8 h-8 text-orange-600" />
                <h4 className="text-xl font-bold text-gray-800">🎨 Book Sellers</h4>
              </div>
              <p className="text-gray-700">
                Expand your inventory with digital educational products
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400 rounded-full opacity-75 blur-2xl"></div>
            <button 
              onClick={handlePurchase}
              className="relative px-16 py-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white text-2xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 flex items-center gap-3"
            >
              <Sparkles className="w-8 h-8" />
              🎯 Get Instant Access Now ✨
              <span className="text-3xl">→</span>
            </button>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-4 text-lg font-semibold text-gray-700 bg-white/60 backdrop-blur-sm px-8 py-4 rounded-full inline-flex">
            <span>✨ One-time payment</span>
            <span>•</span>
            <span>💝 Instant access</span>
            <span>•</span>
            <span>👑 PLR rights included</span>
            <span>🎁</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-200 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 Bright Minds Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SimplifiedLandingPage;
