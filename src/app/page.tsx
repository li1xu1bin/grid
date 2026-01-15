"use client";

import { useState } from "react";
import type { Team } from "@/lib/types";
import { AddTeamModal } from "@/components/add-team-modal";
import { TeamCard } from "@/components/team-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);

  const handleAddTeam = (newTeam: Team) => {
    setTeams((prevTeams) => [...prevTeams, newTeam]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 border-b shadow-md">
        <h1 className="text-2xl font-bold text-center text-primary-foreground font-headline">
          Team Builder
        </h1>
      </header>
      <main className="flex-grow p-4 md:p-8 flex flex-col">
        {teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow text-center text-muted-foreground">
            <p className="text-lg mb-2">No teams created yet.</p>
            <p>Click the button below to add your first team!</p>
          </div>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-4 p-4">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </main>
      <div className="fixed bottom-8 right-8 z-50">
        <AddTeamModal onAddTeam={handleAddTeam}>
          <Button
            size="icon"
            className="w-16 h-16 rounded-full shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <PlusCircle className="w-8 h-8" />
            <span className="sr-only">Add Team</span>
          </Button>
        </AddTeamModal>
      </div>
    </div>
  );
}
