import { BookOpen, Palette, Music, Calculator, Globe, Heart, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const KindergartenCurriculumSection = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const curriculumAreas = [
    {
      icon: BookOpen,
      title: "Language & Literacy",
      description: "Alphabet tracing, numbers practice, and coloring activities",
      color: "from-blue-400 to-blue-600",
      subtopics: [
        { name: "A - Z Tracing & Coloring", link: "/alphabet-az-tracing" },
        { name: "Alphabet Tracing & Coloring", link: "/alphabet-tracing" },
        { name: "Fruit Drawing & Coloring", link: "/fruit-drawing" },
        { name: "Letter Recognition", link: "#" },
        { name: "Phonics Practice", link: "#" }
      ]
    },
    {
      icon: Calculator,
      title: "Math & Numbers",
      description: "Counting, shapes, patterns, and early math concepts",
      color: "from-green-400 to-green-600",
      subtopics: [
        { name: "Numbers Tracing", link: "/numbers-tracing" },
        { name: "Counting Activities", link: "#" },
        { name: "Shape Recognition", link: "#" },
        { name: "Pattern Practice", link: "#" }
      ]
    },
    {
      icon: Palette,
      title: "Arts & Crafts",
      description: "Creative expression through drawing, painting, and crafts",
      color: "from-purple-400 to-purple-600",
      subtopics: [
        { name: "Scissors Cutting", link: "/scissors-cutting" },
        { name: "Drawing & Coloring", link: "#" },
        { name: "Paper Crafts", link: "#" }
      ]
    },
    {
      icon: Music,
      title: "Music & Movement",
      description: "Songs, rhythms, and physical activities for development",
      color: "from-pink-400 to-pink-600",
      subtopics: [
        { name: "Rhythm Activities", link: "#" },
        { name: "Movement Games", link: "#" },
        { name: "Singing & Songs", link: "#" }
      ]
    },
    {
      icon: Globe,
      title: "Science & Discovery",
      description: "Hands-on experiments and exploration activities",
      color: "from-orange-400 to-orange-600",
      subtopics: [
        { name: "Nature Exploration", link: "#" },
        { name: "Simple Experiments", link: "#" },
        { name: "Weather & Seasons", link: "#" }
      ]
    },
    {
      icon: Heart,
      title: "Social & Emotional",
      description: "Building relationships, empathy, and self-awareness",
      color: "from-red-400 to-red-600",
      subtopics: [
        { name: "Feelings & Emotions", link: "#" },
        { name: "Friendship Activities", link: "#" },
        { name: "Sharing & Caring", link: "#" }
      ]
    }
  ];

  return (
    <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🎓 Kindergarten Curriculum Resources
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive learning materials covering all essential areas of kindergarten development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {curriculumAreas.map((area, index) => {
            const Icon = area.icon;
            const isExpanded = selectedTopic === area.title;
            return (
              <div key={index} className="relative">
                <div
                  onClick={() => setSelectedTopic(isExpanded ? null : area.title)}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-4 border-transparent hover:border-primary/20 cursor-pointer"
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${area.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {area.description}
                  </p>
                </div>
                
                {isExpanded && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border-2 border-primary/20 p-4 z-10 animate-in fade-in slide-in-from-top-2">
                    <h4 className="font-semibold text-gray-800 mb-3">Select an activity:</h4>
                    <div className="space-y-2">
                      {area.subtopics.map((subtopic, subIndex) => (
                        <button
                          key={subIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (subtopic.link !== "#") navigate(subtopic.link);
                          }}
                          disabled={subtopic.link === "#"}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                        >
                          <span className="text-gray-700">{subtopic.name}</span>
                          <ChevronRight className="w-4 h-4 text-primary" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 font-semibold">
            ✨ All resources are printable, easy-to-use, and aligned with kindergarten standards
          </p>
        </div>
      </div>
    </section>
  );
};

export default KindergartenCurriculumSection;
