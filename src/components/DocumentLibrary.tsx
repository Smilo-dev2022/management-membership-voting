import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Search, Eye, Calendar, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Document {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  category: string;
  tags: string[];
  uploaded_by: string;
  created_at: string;
  is_offline_available: boolean;
}

export default function DocumentLibrary() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Documents' },
    { id: 'legal', name: 'Legal Documents' },
    { id: 'party_agents', name: 'Party Agent Guides' },
    { id: 'compliance', name: 'Compliance' },
    { id: 'procedures', name: 'Procedures' },
    { id: 'forms', name: 'Forms & Templates' }
  ];

  const mockDocuments: Document[] = [
    {
      id: '1',
      title: 'Electoral Act of 1998',
      description: 'Complete South African Electoral Act legislation',
      file_url: '/documents/electoral-act-1998.pdf',
      file_type: 'PDF',
      category: 'legal',
      tags: ['electoral law', 'legislation', 'official'],
      uploaded_by: 'System Admin',
      created_at: '2024-01-15T10:00:00Z',
      is_offline_available: true
    },
    {
      id: '2',
      title: 'Party Agent Handbook',
      description: 'Official IEC handbook for party agents',
      file_url: '/documents/party-agent-handbook.pdf',
      file_type: 'PDF',
      category: 'party_agents',
      tags: ['party agents', 'handbook', 'iec'],
      uploaded_by: 'IEC Official',
      created_at: '2024-01-20T14:30:00Z',
      is_offline_available: true
    },
    {
      id: '3',
      title: 'Candidate Registration Form',
      description: 'Template for candidate registration submissions',
      file_url: '/documents/candidate-registration-form.pdf',
      file_type: 'PDF',
      category: 'forms',
      tags: ['forms', 'candidates', 'registration'],
      uploaded_by: 'Admin User',
      created_at: '2024-02-01T09:15:00Z',
      is_offline_available: false
    },
    {
      id: '4',
      title: 'Election Timetable 2024',
      description: 'Official election dates and deadlines',
      file_url: '/documents/election-timetable-2024.pdf',
      file_type: 'PDF',
      category: 'procedures',
      tags: ['timetable', 'deadlines', '2024'],
      uploaded_by: 'IEC Official',
      created_at: '2024-02-10T11:00:00Z',
      is_offline_available: true
    },
    {
      id: '5',
      title: 'Party Funding Guidelines',
      description: 'Guidelines for political party funding and disclosure',
      file_url: '/documents/party-funding-guidelines.pdf',
      file_type: 'PDF',
      category: 'compliance',
      tags: ['funding', 'compliance', 'disclosure'],
      uploaded_by: 'Legal Team',
      created_at: '2024-02-15T16:45:00Z',
      is_offline_available: true
    }
  ];

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory]);

  const fetchDocuments = async () => {
    try {
      // Use mock data for now - replace with actual API call
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDownload = async (document: Document) => {
    try {
      // In a real app, this would handle the actual download
      console.log('Downloading document:', document.title);
      
      // For offline availability, you could store in IndexedDB or similar
      if (document.is_offline_available) {
        // Store for offline access
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const handlePreview = (document: Document) => {
    // Open document in new tab for preview
    window.open(document.file_url, '_blank');
  };

  if (loading) {
    return <div>Loading documents...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Document Library</h2>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Sync Offline
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-md min-w-[180px]"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map(document => (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div className="flex gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {document.file_type}
                      </Badge>
                      {document.is_offline_available && (
                        <Badge variant="outline" className="text-xs">
                          Offline
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{document.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {document.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {document.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <User className="w-3 h-3" />
                      <span>{document.uploaded_by}</span>
                      <Calendar className="w-3 h-3 ml-2" />
                      <span>{new Date(document.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handlePreview(document)}>
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" onClick={() => handleDownload(document)}>
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-2">
          {filteredDocuments.map(document => (
            <Card key={document.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-medium">{document.title}</h3>
                      <p className="text-sm text-gray-600">{document.description}</p>
                      <div className="flex gap-2 mt-1">
                        {document.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{document.file_type}</Badge>
                    {document.is_offline_available && (
                      <Badge variant="outline">Offline</Badge>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handlePreview(document)}>
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" onClick={() => handleDownload(document)}>
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No documents found matching your search criteria.
        </div>
      )}
    </div>
  );
}