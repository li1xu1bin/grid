import type { Team } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function TeamCard({ team }: { team: Team }) {
  return (
    <div className="inline-block animate-in fade-in-0 zoom-in-95 duration-300">
      <Card className="w-[380px] bg-card border-primary/50">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-accent">
            Score: {team.score}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-around items-start p-4">
          {team.members.map((member) => (
            <div key={member.character.id} className="flex flex-col items-center space-y-2 text-center w-24">
              <div className="relative">
                <Image
                  src={member.character.avatarUrl}
                  alt={member.character.name}
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-primary object-cover"
                  data-ai-hint="character portrait"
                />
                <Badge variant="secondary" className="absolute -top-1 -right-1 text-primary-foreground bg-primary">
                  {`C${member.chain}`}
                </Badge>
              </div>
              <p className="text-sm font-medium text-card-foreground truncate w-full">{member.character.name}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
