
const VideoSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-100/60 via-pink-100/60 to-blue-100/60 backdrop-blur-sm relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            🎬 Watch Our Educational Products in Action! 🌟
          </h3>
          <p className="text-xl text-gray-700 bg-white/50 backdrop-blur-sm rounded-2xl p-4 inline-block shadow-lg">
            See how our amazing educational bundle can transform learning! 🚀
          </p>
        </div>

        <div className="flex justify-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-dashed border-purple-300 max-w-4xl">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="text-center p-8">
                <a 
                  href="https://www.canva.com/design/DAGpJt_RJJ4/BmqGyRKbmD1QJ3LtDldYZQ/watch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  🎬 Watch Educational Products Showcase Video 🌟
                </a>
                <p className="text-gray-600 mt-4 text-lg">
                  Click to watch our amazing educational products in action!
                </p>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-gray-600 text-lg bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 inline-block shadow-lg border-2 border-purple-300">
                🔊 <strong>Full video experience</strong> with sound and all features! ✨
              </p>
              <div className="mt-4">
                <span className="text-sm text-gray-500">
                  Educational Products Showcase by Sandra Kwarko
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
