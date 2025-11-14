"use client";

import { Card } from "@/components/ui/card";
import { ProjectStats } from "@/lib/types";
import { Users, Leaf, TreePine, TrendingDown } from 'lucide-react';

interface StatsOverviewProps {
  stats: ProjectStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-teal-500/20 to-teal-500/5 border-teal-500/30 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Participants</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalParticipants}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-teal-500/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-teal-400" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total CO₂</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalCO2.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">kg emissions</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average CO₂</p>
              <p className="text-3xl font-bold text-foreground">{stats.averageCO2.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">kg per person</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Trees to Plant</p>
              <p className="text-3xl font-bold text-foreground">{stats.treesNeeded}</p>
              <p className="text-xs text-muted-foreground">to offset</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <TreePine className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
