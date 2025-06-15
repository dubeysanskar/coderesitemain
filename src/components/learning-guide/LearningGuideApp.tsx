
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, ArrowLeft, X } from 'lucide-react';

const roleBased = [
  "Frontend", "Backend", "DevOps", "Full Stack", "AI Engineer", "Data Scientist", 
  "Android", "iOS", "PostgreSQL DBA", "Blockchain", "QA", "Software Architect", 
  "Cyber Security", "UX Design", "Game Developer", "Technical Writer", 
  "MLOps", "Product Manager", "Engineering Manager", "Developer Relations"
];

const skillBased = [
  "SQL", "Computer Science", "React", "Vue", "Angular", "JavaScript", 
  "NodeJS", "TypeScript", "Python", "System Design", "API Design", "ASP.NET Core", 
  "Java", "C++", "Flutter", "Springboot", "Golang", "Rust", "GraphQL", 
  "Design and Architecture", "Design System", "React Native", "AWS", 
  "Code Review", "Docker", "Kubernetes", "Linux", "MongoDB", "Prompt Engineering", 
  "Terraform", "Data Structures and Algorithms", "Git", "GitHub", "Redis", 
  "PHP", "Cloudflare", "AI Agents", "AI"
];

export function LearningGuideApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);

  const getImagePath = (title: string) => {
    const fileName = title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/&/g, '')
      .replace(/\./g, '')
      .replace(/\+/g, 'plus');
    return `/roadmaps/${fileName}.png`;
  };

  const handleDownload = (title: string) => {
    const link = document.createElement('a');
    link.href = getImagePath(title);
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-roadmap.png`;
    link.click();
  };

  const handleRoadmapClick = (title: string) => {
    setSelectedRoadmap(title);
  };

  const handleBackToHome = () => {
    setSelectedRoadmap(null);
    setSearchTerm('');
  };

  const filteredRoadmaps = useMemo(() => {
    let allRoadmaps = [
      ...roleBased.map(role => ({ title: role, category: 'role' as const })),
      ...skillBased.map(skill => ({ title: skill, category: 'skill' as const }))
    ];

    if (activeTab === 'roles') {
      allRoadmaps = allRoadmaps.filter(item => item.category === 'role');
    } else if (activeTab === 'skills') {
      allRoadmaps = allRoadmaps.filter(item => item.category === 'skill');
    }

    if (searchTerm) {
      allRoadmaps = allRoadmaps.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allRoadmaps;
  }, [searchTerm, activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredRoadmaps.length > 0) {
      setSelectedRoadmap(filteredRoadmaps[0].title);
    }
  };

  // Image viewer component
  if (selectedRoadmap) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/60 backdrop-blur-sm rounded-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{selectedRoadmap} Roadmap</h2>
            <Button
              onClick={() => setSelectedRoadmap(null)}
              className="bg-white text-black hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mb-6 text-center">
            <img 
              src={getImagePath(selectedRoadmap)}
              alt={`${selectedRoadmap} Roadmap`}
              className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop`;
              }}
            />
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={handleBackToHome}
              className="bg-white text-black hover:bg-gray-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Button 
              onClick={() => handleDownload(selectedRoadmap)}
              className="bg-green-500 text-black hover:bg-green-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Image
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Learning Guide
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Discover comprehensive roadmaps for various roles and skills in tech. 
          Find your path and start your learning journey today.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search for roles or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/40 border-white/20 text-white placeholder-gray-400"
          />
        </form>
      </motion.div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-black/40">
          <TabsTrigger value="all" className="text-white data-[state=active]:bg-green-600 data-[state=active]:text-black">
            All ({roleBased.length + skillBased.length})
          </TabsTrigger>
          <TabsTrigger value="roles" className="text-white data-[state=active]:bg-green-600 data-[state=active]:text-black">
            Roles ({roleBased.length})
          </TabsTrigger>
          <TabsTrigger value="skills" className="text-white data-[state=active]:bg-green-600 data-[state=active]:text-black">
            Skills ({skillBased.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {filteredRoadmaps.map((roadmap) => (
              <Button
                key={`${roadmap.category}-${roadmap.title}`}
                onClick={() => handleRoadmapClick(roadmap.title)}
                className="bg-white text-black hover:bg-gray-200 h-auto py-3 px-2 text-sm font-medium"
              >
                {roadmap.title}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {filteredRoadmaps.map((roadmap) => (
              <Button
                key={`${roadmap.category}-${roadmap.title}`}
                onClick={() => handleRoadmapClick(roadmap.title)}
                className="bg-white text-black hover:bg-gray-200 h-auto py-3 px-2 text-sm font-medium"
              >
                {roadmap.title}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {filteredRoadmaps.map((roadmap) => (
              <Button
                key={`${roadmap.category}-${roadmap.title}`}
                onClick={() => handleRoadmapClick(roadmap.title)}
                className="bg-white text-black hover:bg-gray-200 h-auto py-3 px-2 text-sm font-medium"
              >
                {roadmap.title}
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredRoadmaps.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-400 text-lg">
            No roadmaps found for "{searchTerm}". Try a different search term.
          </p>
        </motion.div>
      )}
    </div>
  );
}
