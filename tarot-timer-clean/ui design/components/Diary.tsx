import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Calendar, Star, Heart, Brain, Search } from 'lucide-react';
import { Input } from './ui/input';

const diaryEntries = [
  {
    id: 1,
    date: '2025-01-15',
    title: 'Morning Reflection',
    spread: 'Love & Relationships',
    cards: ['The Star', 'Two of Cups', 'The Sun'],
    mood: 'hopeful',
    notes: 'The cards spoke of new beginnings in love. The Star card particularly resonated with my current feelings of hope and renewal.',
    tags: ['love', 'hope', 'new-beginnings']
  },
  {
    id: 2,
    date: '2025-01-14',
    title: 'Career Guidance',
    spread: 'Career Path',
    cards: ['The Magician', 'Ace of Pentacles', 'Ten of Pentacles'],
    mood: 'motivated',
    notes: 'Strong energy around manifesting career goals. The Magician reminds me I have all the tools I need.',
    tags: ['career', 'manifestation', 'goals']
  },
  {
    id: 3,
    date: '2025-01-13',
    title: 'Full Moon Reading',
    spread: 'Spiritual Growth',
    cards: ['The High Priestess', 'The Moon', 'The Hermit'],
    mood: 'introspective',
    notes: 'Deep lunar energy calling for inner reflection and trusting intuition.',
    tags: ['moon', 'intuition', 'spiritual']
  }
];

const moodColors = {
  hopeful: 'bg-blue-600/20 text-blue-400',
  motivated: 'bg-orange-600/20 text-orange-400',
  introspective: 'bg-purple-600/20 text-purple-400',
  peaceful: 'bg-green-600/20 text-green-400',
  curious: 'bg-yellow-600/20 text-yellow-400',
  grateful: 'bg-pink-600/20 text-pink-400'
};

export function Diary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    notes: '',
    mood: 'peaceful',
    tags: ''
  });

  const filteredEntries = diaryEntries.filter(entry => 
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl text-white">Spiritual Diary</h1>
        <p className="text-white/60 text-sm">Track your mystical journey</p>
      </div>

      {/* Search and Add */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/30 border-white/20 text-white placeholder:text-white/40"
          />
        </div>
        <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          
          <DialogContent className="bg-black/90 backdrop-blur-sm border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>New Diary Entry</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white/80">Title</label>
                <Input
                  placeholder="Entry title..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  className="bg-black/30 border-white/20 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-white/80">Reflection</label>
                <Textarea
                  placeholder="What insights did you receive?"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  className="bg-black/30 border-white/20 text-white min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-white/80">Tags (comma separated)</label>
                <Input
                  placeholder="love, intuition, guidance..."
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
                  className="bg-black/30 border-white/20 text-white"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={() => setIsAddingEntry(false)}
                >
                  Save Entry
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingEntry(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Entries */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="bg-black/30 backdrop-blur-sm border-white/20 p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-white">{entry.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Calendar className="h-3 w-3" />
                    {new Date(entry.date).toLocaleDateString()}
                    <span>•</span>
                    <span>{entry.spread}</span>
                  </div>
                </div>
                <Badge className={`${moodColors[entry.mood]} border-0`}>
                  {entry.mood}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {entry.cards.map((card, index) => (
                    <Badge key={index} variant="outline" className="border-purple-400/30 text-purple-300">
                      {card}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-white/70 text-sm leading-relaxed">{entry.notes}</p>
                
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-white/10 text-white/60">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-8 text-white/40">
          <Star className="h-8 w-8 mx-auto mb-2" />
          <p>No entries found. Start your spiritual journey!</p>
        </div>
      )}
    </div>
  );
}