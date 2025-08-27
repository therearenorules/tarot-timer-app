import React, { useState } from 'react';
import { Timer } from './components/Timer';
import { Spreads } from './components/Spreads';
import { Journal } from './components/Journal';
import { Settings } from './components/Settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Clock, Layout, BookOpen, Settings as SettingsIcon } from './components/ui/icons';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 max-w-md">
        <Tabs defaultValue="timer" className="w-full">
          <div className="mb-20">
            <TabsContent value="timer" className="mt-0">
              <Timer />
            </TabsContent>
            <TabsContent value="spreads" className="mt-0">
              <Spreads />
            </TabsContent>
            <TabsContent value="journal" className="mt-0">
              <Journal />
            </TabsContent>
            <TabsContent value="settings" className="mt-0">
              <Settings />
            </TabsContent>
          </div>
          
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
            <TabsList className="grid w-full grid-cols-4 bg-transparent border-none rounded-none h-auto p-0">
              <TabsTrigger 
                value="timer" 
                className="flex flex-col items-center gap-1 p-3 data-[state=active]:text-primary text-muted-foreground rounded-none bg-transparent border-none"
              >
                <Clock className="h-6 w-6" />
                <span className="text-xs">타이머</span>
              </TabsTrigger>
              <TabsTrigger 
                value="spreads" 
                className="flex flex-col items-center gap-1 p-3 data-[state=active]:text-primary text-muted-foreground rounded-none bg-transparent border-none"
              >
                <Layout className="h-6 w-6" />
                <span className="text-xs">스프레드</span>
              </TabsTrigger>
              <TabsTrigger 
                value="journal" 
                className="flex flex-col items-center gap-1 p-3 data-[state=active]:text-primary text-muted-foreground rounded-none bg-transparent border-none"
              >
                <BookOpen className="h-6 w-6" />
                <span className="text-xs">일기</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex flex-col items-center gap-1 p-3 data-[state=active]:text-primary text-muted-foreground rounded-none bg-transparent border-none"
              >
                <SettingsIcon className="h-6 w-6" />
                <span className="text-xs">설정</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>
    </div>
  );
}