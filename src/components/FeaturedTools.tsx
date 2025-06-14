import React from 'react';
import { Sparkles } from 'lucide-react';
import { Presentation, FileUser, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedTools = () => {
  const tools = [
    {
      id: 1,
      title: "PPT Generator",
      description: "AI-powered presentation creation",
      icon: Presentation,
      path: "/ppt-generator",
      gradient: "from-blue-600 to-purple-600"
    },
    {
      id: 2,
      title: "Resume Builder", 
      description: "Professional resume creation",
      icon: FileUser,
      path: "/resume-builder",
      gradient: "from-green-600 to-blue-600"
    },
    {
      id: 3,
      title: "Report Generator",
      description: "Comprehensive report writing", 
      icon: FileText,
      path: "/report-generator",
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  return (
    <section id="tools" className="py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-white">
          Featured AI Tools <Sparkles className="inline-block text-green-400 w-6 h-6 ml-2 align-top" />
        </h2>
        <p className="text-gray-400 mb-12">
          Explore our suite of AI-powered tools designed to boost your productivity and creativity.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Link to={tool.path} key={tool.id} className="relative overflow-hidden rounded-lg shadow-lg hover-glow">
              <div className={`absolute inset-0 bg-gradient-to-r ${tool.gradient} opacity-20`}></div>
              <div className="relative p-6">
                <tool.icon className="w-8 h-8 mb-4 text-white" />
                <h3 className="text-xl font-semibold mb-2 text-white">{tool.title}</h3>
                <p className="text-gray-300">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTools;
