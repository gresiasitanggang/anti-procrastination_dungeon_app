export interface Task {
  id: string;
  name: string;
  difficulty: number; // 1-10
  deadline: string; // ISO string
  createdAt: string; // ISO string
  completed: boolean;
  completedAt: string | null;
  failed: boolean; // if deadline passed and not completed
}

export interface PlayerStats {
  level: number;
  exp: number;
  nextExpGoal: number;
}

export interface HistoryEvent {
  id: string;
  taskName: string;
  difficulty: number;
  monsterName: string;
  status: 'victory' | 'failed';
  timestamp: string;
  expGained?: number;
}

export interface MonsterConfig {
  level: number;
  name: string;
  color: string;
  gradient: string;
  icon: string;
  description: string;
}

export const MONSTERS: Record<number, MonsterConfig> = {
  1: {
    level: 1,
    name: 'Tiny Slime',
    color: 'text-emerald-500',
    gradient: 'from-emerald-400 to-green-600',
    icon: '✨',
    description: 'A bouncy little droplet of jelly. It looks more friendly than threatening!',
  },
  2: {
    level: 2,
    name: 'Forest Slime',
    color: 'text-teal-500',
    gradient: 'from-teal-400 to-emerald-600',
    icon: '☘️',
    description: 'Slightly larger, smelling faintly of pine. Found bouncing around mossy logs.',
  },
  3: {
    level: 3,
    name: 'Goblin Scout',
    color: 'text-lime-500',
    gradient: 'from-yellow-400 to-lime-600',
    icon: '👁️',
    description: 'Armed with a magnifying glass and a wooden dagger. Keeps an eye out for slacking adventurers.',
  },
  4: {
    level: 4,
    name: 'Goblin Warrior',
    color: 'text-amber-600',
    gradient: 'from-amber-400 to-amber-700',
    icon: '🛡️',
    description: 'Clad in makeshift bucket armor. He wields a heavy stick with fierce determination.',
  },
  5: {
    level: 5,
    name: 'Skeleton Knight',
    color: 'text-slate-400',
    gradient: 'from-slate-400 to-slate-600',
    icon: '💀',
    description: 'Clatters with every step. Wears a slightly rusty knight helmet and carries a iron shield.',
  },
  6: {
    level: 6,
    name: 'Orc Captain',
    color: 'text-orange-600',
    gradient: 'from-orange-400 to-red-600',
    icon: '🪓',
    description: 'A battle-worn chieftain with a booming voice and a cute iron axe.',
  },
  7: {
    level: 7,
    name: 'Shadow Beast',
    color: 'text-indigo-500',
    gradient: 'from-indigo-500 to-purple-800',
    icon: '🌌',
    description: 'Formed from concentrated night-time social-media scrolling. Spooky but surprisingly soft.',
  },
  8: {
    level: 8,
    name: 'Dark Sorcerer',
    color: 'text-fuchsia-600',
    gradient: 'from-fuchsia-400 to-violet-800',
    icon: '🔮',
    description: 'Weaves complex illusions of "I have plenty of time left." Do not fall for his distraction spells!',
  },
  9: {
    level: 9,
    name: 'Ancient Demon',
    color: 'text-rose-600',
    gradient: 'from-rose-500 to-red-950',
    icon: '😈',
    description: 'Summoned by an unresolved pile of work. Grumbles deeply and emits warm, lazy embers.',
  },
  10: {
    level: 10,
    name: 'Legendary Dragon',
    color: 'text-red-500',
    gradient: 'from-yellow-550 via-red-500 to-rose-900',
    icon: '🐉',
    description: 'The absolute ruler of procrastination. Its breath halts progress; defeating it is the ultimate victory!',
  },
};
