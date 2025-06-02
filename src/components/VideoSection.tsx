
import { Play } from "lucide-react";

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
              {/* Video Preview Container */}
              <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 aspect-video flex items-center justify-center">
                {/* Video Thumbnail/Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20"></div>
                
                {/* Play Button */}
                <a 
                  href="https://www.canva.com/design/DAGpJt_RJJ4/BmqGyRKbmD1QJ3LtDldYZQ/watch"
                  rel="noopener noreferrer"
                  className="relative z-10 group"
                >
                  <div className="bg-white/90 hover:bg-white rounded-full p-6 shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                    <Play className="w-16 h-16 text-purple-600 ml-1" fill="currentColor" />
                  </div>
                </a>

                {/* Video Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="text-2xl font-bold bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    🌟 Educational Products Showcase
                  </h4>
                </div>
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
