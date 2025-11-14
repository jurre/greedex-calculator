"use client";

import { Card } from "@/components/ui/card";
import { Participant } from "@/lib/types";
import { Trophy, Leaf } from 'lucide-react';
import { cn } from "@/lib/utils/index";

interface LeaderboardProps {
  participants: Participant[];
}

export function Leaderboard({ participants }: LeaderboardProps) {
  // Sort by lowest CO₂ (most sustainable)
  const sortedParticipants = [...participants].sort((a, b) => a.totalCO2 - b.totalCO2);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-500/20 to-emerald-500/20 px-6 py-4 border-b border-primary/20">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-teal-400" />
          <h2 className="text-2xl font-bold text-foreground">Sustainability Champions</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Ranked by lowest CO₂ emissions</p>
      </div>
      
      <div className="divide-y divide-border/50">
        {sortedParticipants.map((participant, index) => {
          const isTopThree = index < 3;
          const medals = ["🥇", "🥈", "🥉"];
          
          return (
            <div
              key={participant.id}
              className={cn(
                "px-6 py-4 transition-all duration-300 hover:bg-accent/50",
                isTopThree && "bg-gradient-to-r from-teal-500/5 to-emerald-500/5"
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                    {isTopThree ? (
                      <span className="text-2xl">{medals[index]}</span>
                    ) : (
                      <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate">{participant.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
                        {participant.country}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {participant.activities.length} {participant.activities.length === 1 ? "journey" : "journeys"}
                    </p>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-2 justify-end">
                    <Leaf className="h-4 w-4 text-emerald-400" />
                    <span className="text-2xl font-bold text-teal-400">
                      {participant.totalCO2.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">kg CO₂</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
