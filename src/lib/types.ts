export interface Character {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface TeamMember {
  character: Character;
  chain: number;
}

export interface Team {
  id: string;
  members: TeamMember[];
  score: number;
}
