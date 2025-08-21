import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, FileText, HelpCircle, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { IECDataViewer } from '@/components/IECDataViewer';
import AddArticle from './AddArticle';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  steps: { title: string; content: string }[];
  category: string;
}

export default function KnowledgeBase() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'electoral_system', name: 'Electoral System' },
    { id: 'iec_processes', name: 'IEC Processes' },
    { id: 'party_agents', name: 'Party Agents' },
    { id: 'voter_registration', name: 'Voter Registration' },
    { id: 'compliance', name: 'Compliance' }
  ];

  const fetchKnowledgeContent = useCallback(async () => {
    try {
      const { data: articlesData } = await supabase.functions.invoke('knowledge-api/articles', {
        body: { category: selectedCategory === 'all' ? null : selectedCategory }
      });
      
      const { data: guidesData } = await supabase.functions.invoke('knowledge-api/guides');
      
      setArticles(articlesData || []);
      setGuides(guidesData || []);
    } catch (error) {
      console.error('Error fetching knowledge content:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchKnowledgeContent();
  }, [fetchKnowledgeContent]);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGuides = guides.filter(guide =>
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <div className="flex gap-2">
          <AddArticle onArticleAdded={fetchKnowledgeContent} />
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Offline Sync
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="guides">Interactive Guides</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="iec-data">IEC Data</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          {loading ? (
            <div>Loading articles...</div>
          ) : (
            <div className="grid gap-4">
              {filteredArticles.map(article => (
                <Card key={article.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          {article.title}
                        </CardTitle>
                        <CardDescription>
                          {new Date(article.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{article.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      {article.content.substring(0, 200)}...
                    </p>
                    <div className="flex gap-2">
                      {article.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          <div className="grid gap-4">
            {filteredGuides.map(guide => (
              <Card key={guide.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    {guide.title}
                  </CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {guide.steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="text-sm">{step.title}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-4" size="sm">
                    Start Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Electoral Act of 1998
                </CardTitle>
                <CardDescription>Official electoral legislation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge>Legal Document</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="iec-data" className="space-y-4">
          <IECDataViewer />
        </TabsContent>

        <TabsContent value="ai-assistant" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Knowledge Assistant</CardTitle>
              <CardDescription>
                Ask questions about electoral processes, IEC guidelines, and party procedures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input placeholder="Ask a question about electoral processes..." />
                <Button>Ask AI Assistant</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}