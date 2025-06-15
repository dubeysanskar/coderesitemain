
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, ExternalLink } from 'lucide-react';

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

interface RoadmapCardProps {
  title: string;
  category: 'role' | 'skill';
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ title, category }) => {
  const getImagePath = (title: string) => {
    // Convert title to lowercase and replace spaces with hyphens for file names
    const fileName = title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/&/g, '')
      .replace(/\./g, '')
      .replace(/\+/g, 'plus');
    return `/roadmaps/${fileName}.png`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = getImagePath(title);
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-roadmap.png`;
    link.click();
  };

  const handleViewFullSize = () => {
    window.open(getImagePath(title), '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="h-full"
    >
      <Card className="bg-black/40 border-white/20 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300 h-full overflow-hidden">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="relative">
            <img 
              src={getImagePath(title)}
              alt={`${title} Roadmap`}
              className="w-full h-48 object-cover"
              onError={(e) => {
                // Fallback to a placeholder if image doesn't exist
                const target = e.target as HTMLImageElement;
                target.src = `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop`;
              }}
            />
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                category === 'role' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-green-500 text-black'
              }`}>
                {category === 'role' ? 'Role' : 'Skill'}
              </span>
            </div>
          </div>
          
          <div className="p-4 flex-grow flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-gray-300 text-sm mb-4">
                Complete learning roadmap for {title.toLowerCase()} development
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleViewFullSize}
                size="sm"
                className="flex-1 bg-green-500 hover:bg-green-600 text-black font-medium"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button 
                onClick={handleDownload}
                size="sm"
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export function LearningGuideApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search for roles or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/40 border-white/20 text-white placeholder-gray-400"
          />
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-black/40">
          <TabsTrigger value="all" className="text-white data-[state=active]:bg-green-600">
            All ({roleBased.length + skillBased.length})
          </TabsTrigger>
          <TabsTrigger value="roles" className="text-white data-[state=active]:bg-green-600">
            Roles ({roleBased.length})
          </TabsTrigger>
          <TabsTrigger value="skills" className="text-white data-[state=active]:bg-green-600">
            Skills ({skillBased.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRoadmaps.map((roadmap, index) => (
              <RoadmapCard 
                key={`${roadmap.category}-${roadmap.title}`}
                title={roadmap.title}
                category={roadmap.category}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRoadmaps.map((roadmap, index) => (
              <RoadmapCard 
                key={`${roadmap.category}-${roadmap.title}`}
                title={roadmap.title}
                category={roadmap.category}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRoadmaps.map((roadmap, index) => (
              <RoadmapCard 
                key={`${roadmap.category}-${roadmap.title}`}
                title={roadmap.title}
                category={roadmap.category}
              />
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
