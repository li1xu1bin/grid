import { PlaceHolderImages } from './placeholder-images';
import type { Character } from './types';

const characterNames = [
  'Aether', 'Lumine', 'Venti', 'Zhongli', 'Raiden', 'Nahida', 'Furina', 'Klee', 'Albedo', 'Ganyu', 'Hu Tao', 'Yelan'
];

export const characters: Character[] = PlaceHolderImages
  .filter(img => img.id.startsWith('char'))
  .map((img, index) => ({
    id: img.id,
    name: characterNames[index] || `Character ${index + 1}`,
    avatarUrl: img.imageUrl,
  }));
