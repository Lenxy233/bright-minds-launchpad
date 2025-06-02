
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
              <div style={{
                position: 'relative',
                width: '100%',
                height: 0,
                paddingTop: '56.2500%',
                paddingBottom: 0,
                boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)',
                marginTop: '1.6em',
                marginBottom: '0.9em',
                overflow: 'hidden',
                borderRadius: '8px',
                willChange: 'transform'
              }}>
                <iframe
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    border: 'none',
                    padding: 0,
                    margin: 0
                  }}
                  src="https://www.canva.com/design/DAGpJt_RJJ4/BmqGyRKbmD1QJ3LtDldYZQ/view?embed"
                  allowFullScreen
                  allow="fullscreen"
                  title="Educational Products Showcase Video"
                />
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-gray-600 text-lg bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 inline-block shadow-lg border-2 border-purple-300">
                🔊 <strong>Click to play with sound</strong> and discover the magic of our educational resources! ✨
              </p>
              <div className="mt-4">
                <a 
                  href="https://www.canva.com/design/DAGpJt_RJJ4/BmqGyRKbmD1QJ3LtDldYZQ/watch" 
                  target="_blank" 
                  rel="noopener"
                  className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
                >
                  Educational Products Showcase by Sandra Kwarko
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
