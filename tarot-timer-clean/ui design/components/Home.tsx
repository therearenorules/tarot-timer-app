import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, Star, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const tarotCards = [
  { id: 0, name: "The Fool", meaning: "New beginnings, innocence, spontaneity" },
  { id: 1, name: "The Magician", meaning: "Manifestation, resourcefulness, power" },
  { id: 2, name: "The High Priestess", meaning: "Intuition, sacred knowledge, divine feminine" },
  { id: 3, name: "The Empress", meaning: "Femininity, beauty, nature, abundance" },
  { id: 4, name: "The Emperor", meaning: "Authority, structure, control, fatherhood" },
  { id: 5, name: "The Hierophant", meaning: "Spiritual wisdom, religious beliefs, conformity" },
  { id: 6, name: "The Lovers", meaning: "Love, harmony, relationships, values alignment" },
  { id: 7, name: "The Chariot", meaning: "Control, willpower, success, determination" },
  { id: 8, name: "Strength", meaning: "Inner strength, bravery, compassion, focus" },
  { id: 9, name: "The Hermit", meaning: "Soul searching, introspection, inner guidance" },
  { id: 10, name: "Wheel of Fortune", meaning: "Good luck, karma, life cycles, destiny" },
  { id: 11, name: "Justice", meaning: "Justice, fairness, truth, cause and effect" },
  { id: 12, name: "The Hanged Man", meaning: "Suspension, restriction, letting go" },
  { id: 13, name: "Death", meaning: "Endings, beginnings, change, transformation" },
  { id: 14, name: "Temperance", meaning: "Balance, moderation, patience, purpose" },
  { id: 15, name: "The Devil", meaning: "Shadow self, attachment, addiction, restriction" },
  { id: 16, name: "The Tower", meaning: "Sudden change, upheaval, chaos, revelation" },
  { id: 17, name: "The Star", meaning: "Hope, faith, purpose, renewal, spirituality" },
  { id: 18, name: "The Moon", meaning: "Illusion, fear, anxiety, subconscious, intuition" },
  { id: 19, name: "The Sun", meaning: "Positivity, fun, warmth, success, vitality" },
  { id: 20, name: "Judgement", meaning: "Judgement, rebirth, inner calling, absolution" },
  { id: 21, name: "The World", meaning: "Completion, accomplishment, travel, fulfillment" },
  { id: 22, name: "Ace of Cups", meaning: "New relationships, compassion, creativity" },
  { id: 23, name: "Two of Cups", meaning: "Unified love, partnership, mutual attraction" }
];

export function Home() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentCard, setCurrentCard] = useState(tarotCards[currentHour % tarotCards.length]);
  const [timeUntilNext, setTimeUntilNext] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      
      setCurrentHour(hour);
      setCurrentCard(tarotCards[hour % tarotCards.length]);
      
      const minutesLeft = 59 - minutes;
      const secondsLeft = 59 - seconds;
      setTimeUntilNext(`${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-white/80">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm">Cosmic Guidance</span>
          <Sparkles className="h-5 w-5" />
        </div>
        <h1 className="text-2xl text-white">Hour {currentHour}</h1>
        <p className="text-white/60 text-sm">Your mystical journey continues</p>
      </div>

      {/* Current Hour Card */}
      <Card className="bg-black/30 backdrop-blur-sm border-white/20 p-6">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-32 h-48 rounded-lg overflow-hidden border-2 border-purple-400/50 shadow-lg shadow-purple-500/20">
            <ImageWithFallback
              src={`/assets/tarot-cards/classic-tarot/${currentCard.id.toString().padStart(2, '0')}.jpg`}
              alt={currentCard.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl text-white">{currentCard.name}</h2>
            <p className="text-white/70 text-sm leading-relaxed">{currentCard.meaning}</p>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 text-purple-400" />
            <span className="text-purple-300 text-sm">Next card in {timeUntilNext}</span>
          </div>
        </div>
      </Card>

      {/* Daily Timeline */}
      <Card className="bg-black/30 backdrop-blur-sm border-white/20 p-4">
        <div className="space-y-3">
          <h3 className="text-white flex items-center gap-2">
            <Star className="h-4 w-4" />
            Today's Journey
          </h3>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                className={`aspect-square rounded border text-xs flex items-center justify-center transition-colors ${
                  i === currentHour
                    ? 'bg-purple-600 border-purple-400 text-white'
                    : i < currentHour
                    ? 'bg-purple-900/50 border-purple-700/50 text-purple-300'
                    : 'bg-black/20 border-white/10 text-white/40'
                }`}
              >
                {i}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="bg-black/30 border-white/20 text-white hover:bg-purple-600/30"
        >
          Draw Oracle
        </Button>
        <Button 
          variant="outline" 
          className="bg-black/30 border-white/20 text-white hover:bg-purple-600/30"
        >
          Daily Spread
        </Button>
      </div>
    </div>
  );
}