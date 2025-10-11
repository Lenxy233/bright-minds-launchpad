import { BookOpen, Palette, Music, Calculator, Globe, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const KindergartenCurriculumSection = () => {
  const navigate = useNavigate();
  
  const curriculumAreas = [
    {
      icon: BookOpen,
      title: "Language & Literacy",
      description: "Alphabet tracing, numbers practice, and coloring activities",
      color: "from-blue-400 to-blue-600",
      link: "/alphabet-tracing"
    },
    {
      icon: Calculator,
      title: "Math & Numbers",
      description: "Counting, shapes, patterns, and early math concepts",
      color: "from-green-400 to-green-600"
    },
    {
      icon: Palette,
      title: "Arts & Crafts",
      description: "Creative expression through drawing, painting, and crafts",
      color: "from-purple-400 to-purple-600",
      link: "/scissors-cutting"
    },
    {
      icon: Music,
      title: "Music & Movement",
      description: "Songs, rhythms, and physical activities for development",
      color: "from-pink-400 to-pink-600"
    },
    {
      icon: Globe,
      title: "Science & Discovery",
      description: "Hands-on experiments and exploration activities",
      color: "from-orange-400 to-orange-600"
    },
    {
      icon: Heart,
      title: "Social & Emotional",
      description: "Building relationships, empathy, and self-awareness",
      color: "from-red-400 to-red-600"
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
            return (
              <div
                key={index}
                onClick={() => area.link && navigate(area.link)}
                className={`group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-4 border-transparent hover:border-primary/20 ${area.link ? 'cursor-pointer' : ''}`}
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
