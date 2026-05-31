import { useState, useEffect, useMemo, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Swords,
  Shield,
  Calendar,
  Clock,
  Plus,
  Trash2,
  ListRestart,
  Sparkles,
  AlertTriangle,
  Frown,
  Trophy,
  History,
  X,
  PlusCircle,
  HelpCircle,
  Info,
  Flame,
  CheckCircle,
  Play
} from 'lucide-react';
import { Task, PlayerStats, HistoryEvent, MONSTERS } from './types';
import { MonsterArt } from './components/MonsterArt';

export default function App() {
  // ----------------------------------------------------
  // LocalStorage / Initial States
  // ----------------------------------------------------
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('dungeon_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default starter tasks relative to now to make preview interactive immediately
    const now = new Date();
    return [
      {
        id: 'starter-1',
        name: 'Drink a big chalice of water',
        difficulty: 1,
        createdAt: now.toISOString(),
        deadline: new Date(now.getTime() + 15 * 60 * 1000).toISOString(), // 15 mins
        completed: false,
        completedAt: null,
        failed: false,
      },
      {
        id: 'starter-2',
        name: 'Complete coding homework challenge',
        difficulty: 5,
        createdAt: now.toISOString(),
        deadline: new Date(now.getTime() + 50 * 60 * 1000).toISOString(), // 50 mins (Warning state!)
        completed: false,
        completedAt: null,
        failed: false,
      },
      {
        id: 'starter-3',
        name: 'Slay the ultimate design review preparation',
        difficulty: 10,
        createdAt: now.toISOString(),
        deadline: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 1 day
        completed: false,
        completedAt: null,
        failed: false,
      }
    ];
  });

  const [stats, setStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem('dungeon_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      level: 1,
      exp: 0,
      nextExpGoal: 100
    };
  });

  const [history, setHistory] = useState<HistoryEvent[]>(() => {
    const saved = localStorage.getItem('dungeon_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'hist-1',
        taskName: 'Create a stunning gamified web application',
        difficulty: 9,
        monsterName: 'Ancient Demon',
        status: 'victory',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        expGained: 9
      }
    ];
  });

  // ----------------------------------------------------
  // Form State
  // ----------------------------------------------------
  const [taskName, setTaskName] = useState('');
  const [difficulty, setDifficulty] = useState(5);
  
  // Create reasonable default dates for task form picker
  const [dateStr, setDateStr] = useState(() => {
    const d = new Date(Date.now() + 2 * 3600 * 1000); // 2 hours from now
    return d.toISOString().split('T')[0];
  });
  const [timeStr, setTimeStr] = useState(() => {
    const d = new Date(Date.now() + 2 * 3600 * 1000); // 2 hours from now
    const hrs = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${hrs}:${mins}`;
  });

  // Tab state
  const [currentTab, setCurrentTab] = useState<'active' | 'history'>('active');

  // Interactive custom notifications & celebrations state
  const [celebration, setCelebration] = useState<{
    show: boolean;
    taskName: string;
    xpGained: number;
    monsterName: string;
    monsterLevel: number;
    message: string;
  } | null>(null);

  const [levelUpMessage, setLevelUpMessage] = useState<{
    show: boolean;
    oldLevel: number;
    newLevel: number;
    newGoal: number;
  } | null>(null);

  // Time ticker to force updates in countdowns and detect dynamic state
  const [tick, setTick] = useState(0);

  // Sound effects fallback using Web Audio API! Fun synth tunes
  const playVictorySound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (freq: number, start: number, duration: number, type: OscillatorType = 'triangle') => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.start(start);
        osc.stop(start + duration);
      };
      // Chiptune chord
      playTone(523.25, ctx.currentTime, 0.15); // C5
      playTone(659.25, ctx.currentTime + 0.12, 0.15); // E5
      playTone(783.99, ctx.currentTime + 0.24, 0.15); // G5
      playTone(1046.50, ctx.currentTime + 0.36, 0.4); // C6
    } catch (_) {}
  };

  const playLevelUpSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      
      const t = ctx.currentTime;
      osc.frequency.setValueAtTime(392.00, t); // G4
      osc.frequency.setValueAtTime(523.25, t + 0.1); // C5
      osc.frequency.setValueAtTime(659.25, t + 0.2); // E5
      osc.frequency.setValueAtTime(783.99, t + 0.3); // G5
      osc.frequency.setValueAtTime(1046.50, t + 0.4); // C6
      osc.frequency.setValueAtTime(1318.51, t + 0.5); // E6
      
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.82);
      osc.start(t);
      osc.stop(t + 0.85);
    } catch (_) {}
  };

  const playFailSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.start(start);
        osc.stop(start + duration);
      };
      playTone(220.00, ctx.currentTime, 0.3); // A3
      playTone(196.00, ctx.currentTime + 0.25, 0.3); // G3
      playTone(164.81, ctx.currentTime + 0.5, 0.5); // E3
    } catch (_) {}
  };

  // ----------------------------------------------------
  // Persistent Save
  // ----------------------------------------------------
  useEffect(() => {
    localStorage.setItem('dungeon_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('dungeon_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('dungeon_history', JSON.stringify(history));
  }, [history]);

  // ----------------------------------------------------
  // Game Tick Engine & Active Status Detection
  // ----------------------------------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      let hasUpdates = false;

      const updatedTasks = tasks.map((t) => {
        if (!t.completed && !t.failed) {
          const deadlineTime = new Date(t.deadline).getTime();
          if (deadlineTime < now) {
            hasUpdates = true;
            playFailSound();
            return { ...t, failed: true };
          }
        }
        return t;
      });

      if (hasUpdates) {
        setTasks(updatedTasks);
      }

      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [tasks]);

  // Determine current active theme state
  // Check failed tasks: if ANY incomplete target has transitioned to failed, trigger global failure screen!
  const hasIncompleteFailedTask = useMemo(() => {
    return tasks.some((t) => !t.completed && t.failed);
  }, [tasks]);

  // Get active incomplete non-failed tasks
  const activeIncompleteTasks = useMemo(() => {
    return tasks.filter((t) => !t.completed && !t.failed);
  }, [tasks]);

  // Find the most urgent deadline among current active tasks
  const mostUrgentTask = useMemo(() => {
    if (activeIncompleteTasks.length === 0) return null;
    return [...activeIncompleteTasks].sort((a, b) => {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    })[0];
  }, [activeIncompleteTasks]);

  // Calculate dynamic status details
  const timeState = useMemo(() => {
    if (hasIncompleteFailedTask) return 'FAILURE';
    if (!mostUrgentTask) return 'SAFE';

    const now = new Date().getTime();
    const deadlineTime = new Date(mostUrgentTask.deadline).getTime();
    const secondsRemaining = (deadlineTime - now) / 1000;

    if (secondsRemaining <= 0) return 'FAILURE';
    if (secondsRemaining < 300) return 'CRITICAL'; // 5 minutes
    if (secondsRemaining < 3600) return 'WARNING'; // 1 hour
    return 'SAFE';
  }, [hasIncompleteFailedTask, mostUrgentTask, tick]);

  // Helper remaining display string
  const formatCountdown = (isoString: string) => {
    const totalSecs = Math.floor((new Date(isoString).getTime() - Date.now()) / 1000);
    if (totalSecs <= 0) return '00:00:00';
    
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  // Helper date display format
  const formatDateDisplay = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ----------------------------------------------------
  // Actions
  // ----------------------------------------------------
  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    // Combine Date and Time picker safely
    const customDeadline = new Date(`${dateStr}T${timeStr}:00`);
    
    // Check if user set the time in the past
    if (customDeadline.getTime() <= Date.now()) {
      alert("⚠️ Deadlines cannot exist in the past! Cast your magic further into the path of time.");
      return;
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: taskName,
      difficulty: difficulty,
      createdAt: new Date().toISOString(),
      deadline: customDeadline.toISOString(),
      completed: false,
      completedAt: null,
      failed: false
    };

    setTasks((prev) => [newTask, ...prev]);
    setTaskName('');
    setDifficulty(5);
  };

  // Quick deadline shortcuts helper
  const applyQuickDeadline = (minutes: number) => {
    const d = new Date(Date.now() + minutes * 60 * 1000);
    setDateStr(d.toISOString().split('T')[0]);
    const hrs = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    setTimeStr(`${hrs}:${mins}`);
  };

  const handleCompleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const matchedMonster = MONSTERS[task.difficulty] || MONSTERS[1];
    
    // Mark task as complete
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: true, completedAt: new Date().toISOString() }
          : t
      )
    );

    // Calculate level & experience gains
    const expGained = task.difficulty;
    let newExp = stats.exp + expGained;
    let currentLevel = stats.level;
    let currentGoal = stats.nextExpGoal;
    let didLevelUp = false;

    while (newExp >= currentGoal) {
      didLevelUp = true;
      newExp -= currentGoal;
      currentLevel += 1;
      currentGoal *= 2; // EXP Double System as requested
    }

    setStats({
      level: currentLevel,
      exp: newExp,
      nextExpGoal: currentGoal
    });

    // Write to history chronicle
    const newHistoryEvent: HistoryEvent = {
      id: `hist-${Date.now()}`,
      taskName: task.name,
      difficulty: task.difficulty,
      monsterName: matchedMonster.name,
      status: 'victory',
      timestamp: new Date().toISOString(),
      expGained: expGained
    };
    setHistory((prev) => [newHistoryEvent, ...prev]);

    // Cheer phrases
    const victoryPhrases = [
      "Good job! Your legendary focus continues to pierce the veil of destiny.",
      "I'm proud of you! That creature stood absolutely no chance against your willpower.",
      "Quest cleared! Collect your bounty and claim your peace.",
      "You defeated the monster! Guild halls shall sing of this spectacular deed.",
      "Another victory! Procrastination retreats back into its gloomy shadow.",
      "Keep going, hero! There are more horizons to conquer.",
    ];
    const randomPhrase = victoryPhrases[Math.floor(Math.random() * victoryPhrases.length)];

    playVictorySound();

    // Trigger visual overlay popups
    setCelebration({
      show: true,
      taskName: task.name,
      xpGained: expGained,
      monsterName: matchedMonster.name,
      monsterLevel: matchedMonster.level,
      message: randomPhrase
    });

    if (didLevelUp) {
      setTimeout(() => {
        playLevelUpSound();
        setLevelUpMessage({
          show: true,
          oldLevel: stats.level,
          newLevel: currentLevel,
          newGoal: currentGoal
        });
      }, 1800);
    }
  };

  // Rescue/Log escape for failed quests to clear atmosphere burden of failure
  const handleAcknowledgeFailure = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const matchedMonster = MONSTERS[task.difficulty] || MONSTERS[1];

    // Remove task from active pile
    setTasks((prev) => prev.filter((t) => t.id !== id));

    // Log the failed escape to history
    const failedHistory: HistoryEvent = {
      id: `hist-${Date.now()}`,
      taskName: task.name,
      difficulty: task.difficulty,
      monsterName: matchedMonster.name,
      status: 'failed',
      timestamp: new Date().toISOString()
    };
    setHistory((prev) => [failedHistory, ...prev]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearHistory = () => {
    if (confirm("📜 Clear the chronicle? Your historic accomplishments and fallen monsters will be lost to time.")) {
      setHistory([]);
    }
  };

  // Calculate stats ratios for UI bar
  const expPercentage = Math.min(100, Math.floor((stats.exp / stats.nextExpGoal) * 100));

  // Determine ambient background colors and text colors based on state
  const themeStyles = useMemo(() => {
    switch (timeState) {
      case 'FAILURE':
        return {
          bg: "bg-slate-900",
          gradient: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 via-slate-900 to-slate-950",
          textHeader: "text-slate-100",
          textSubtitle: "text-slate-400",
          cardBorder: "border-slate-800/80 bg-slate-900/60 shadow-inner",
          containerText: "text-slate-200",
          badgeColor: "bg-slate-800 border bg-slate-800/50 border-slate-700 text-slate-300",
          alertLabel: "🛡️ A monster has slipped from its chains! Accept the chronicle of escape to reset your perimeter."
        };
      case 'CRITICAL':
        return {
          bg: "bg-stone-950",
          gradient: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/40 via-stone-950 to-stone-950",
          textHeader: "text-rose-100",
          textSubtitle: "text-rose-400/80 animate-pulse",
          cardBorder: "border-red-900/60 bg-stone-900/40 shadow shadow-red-500/20",
          containerText: "text-rose-200",
          badgeColor: "bg-red-950 border border-red-700 text-red-100 animate-pulse",
          alertLabel: "🚨 EMERGENCY: Deadlines are critically low! Strike immediately!"
        };
      case 'WARNING':
        return {
          bg: "bg-amber-50/20",
          gradient: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/40 via-white to-slate-50",
          textHeader: "text-amber-900",
          textSubtitle: "text-amber-700/80",
          cardBorder: "border-amber-200 bg-amber-50/20 shadow-sm",
          containerText: "text-amber-950",
          badgeColor: "bg-amber-100 border border-amber-300 text-amber-800",
          alertLabel: "⚠️ WARNING: Monstrous activity is growing restive! Prepare your shield."
        };
      case 'SAFE':
      default:
        return {
          bg: "bg-slate-50",
          gradient: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-white to-slate-50",
          textHeader: "text-slate-900",
          textSubtitle: "text-slate-600",
          cardBorder: "border-slate-200 bg-white shadow-sm",
          containerText: "text-slate-800",
          badgeColor: "bg-blue-50 border border-blue-200 text-blue-800",
          alertLabel: ""
        };
    }
  }, [timeState]);

  // Preview target monster info based on interactive form difficulty slider
  const selectedMonsterPreview = MONSTERS[difficulty] || MONSTERS[1];

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${themeStyles.bg} flex flex-col relative overflow-hidden font-sans`}>
      
      {/* ----------------------------------------------------
          Visual Environmental Weather Elements
         ---------------------------------------------------- */}
      {/* Background radial gradient overlay */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${themeStyles.gradient} z-0`} />

      {/* Failure Rain & Tear Drop VFX */}
      {timeState === 'FAILURE' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-30">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xl select-none"
              initial={{ y: -50, x: `${Math.random() * 100}%` }}
              animate={{ y: '110vh' }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 5
              }}
            >
              {i % 3 === 0 ? '💧' : i % 3 === 1 ? '😢' : '🍂'}
            </motion.div>
          ))}
        </div>
      )}

      {/* Critical Floating Ash Ember VFX */}
      {timeState === 'CRITICAL' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-40">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-sm select-none"
              initial={{ y: '110vh', x: `${Math.random() * 100}%` }}
              animate={{ y: -50, x: `${Math.random() * 100}%` }}
              transition={{
                duration: 5 + Math.random() * 4,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 3
              }}
            >
              🔥
            </motion.div>
          ))}
        </div>
      )}

      {/* Victory Sparkle floating backgrounds */}
      {timeState === 'SAFE' && activeIncompleteTasks.length === 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-25">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-lg select-none"
              initial={{ y: '100%', x: `${Math.random() * 100}%` }}
              animate={{ y: '-10%', rotate: 360 }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 5
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}

      {/* MAIN LAYOUT WRAPPER */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 py-8 flex-1 flex flex-col justify-start">
        
        {/* APPLET HEADER */}
        <header className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-6 border-slate-300/40">
          <div>
            <h1 id="app-title" className={`text-3xl font-extrabold tracking-tight ${themeStyles.textHeader} transition-colors duration-1000 flex items-center justify-center sm:justify-start gap-2`}>
              <span>⚔️</span> Anti-Procrastination Dungeon
            </h1>
            <p className={`text-sm mt-1 font-medium max-w-xl ${themeStyles.textSubtitle} transition-colors duration-1000`}>
              Turn your tasks into interactive fantasy monsters and defeat them before they conquer your life.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex justify-center gap-2 text-xs font-mono">
            {timeState === 'CRITICAL' && (
              <span className="px-3 py-1 bg-red-950 text-red-200 border border-red-700 rounded-full animate-bounce flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <Flame size={12} className="text-red-400 animate-pulse" /> Critical state
              </span>
            )}
            {timeState === 'FAILURE' && (
              <span className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-600 rounded-full flex items-center gap-1.5 font-medium uppercase">
                <Frown size={12} className="text-slate-400" /> Melancholic weather
              </span>
            )}
            {timeState === 'WARNING' && (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full flex items-center gap-1.5 font-medium uppercase">
                <AlertTriangle size={12} className="text-amber-600 animate-pulse" /> Danger nearby
              </span>
            )}
            {timeState === 'SAFE' && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full flex items-center gap-1.5 font-medium uppercase shadow-xs">
                🛡️ Safe perimeter
              </span>
            )}
          </div>
        </header>

        {/* TOP LEVEL GLOBAL NOTIFICATION BAR */}
        {themeStyles.alertLabel && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-3 rounded-lg text-xs font-semibold flex items-center gap-2 border shadow-sm transition-all duration-700 ${
              timeState === 'FAILURE'
                ? 'bg-slate-900 border-slate-700 text-slate-300'
                : 'bg-red-950/70 border-red-800/80 text-rose-100 animate-pulse'
            }`}
          >
            <AlertTriangle size={15} className={timeState === 'FAILURE' ? 'text-slate-400' : 'text-red-400'} />
            <span>{themeStyles.alertLabel}</span>
          </motion.div>
        )}

        {/* MAIN BODY GRID */}
        <div id="main-content-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SECTION: STATS & ADDS (4 COLS) */}
          <div className="col-span-1 lg:col-span-5 space-y-6">
            
            {/* PLAYER PROGRESS BOARD PANEL */}
            <section id="player-progress-section" className={`p-5 rounded-2xl border transition-all duration-700 ${themeStyles.cardBorder} flex flex-col gap-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md border border-amber-300">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">Hero Status</span>
                    <h3 className={`text-lg font-bold font-mono tracking-tight leading-tight ${timeState === 'FAILURE' ? 'text-slate-200' : 'text-slate-800'}`}>
                      Level {stats.level} Warrior
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    Total Level: {stats.level}
                  </span>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="space-y-1.5 mt-2">
                <div className="flex justify-between text-xs font-mono font-medium">
                  <span className="text-slate-400">EXP Progress</span>
                  <span className={timeState === 'FAILURE' ? 'text-slate-300' : 'text-slate-700'}>
                    {stats.exp} / {stats.nextExpGoal} <span className="text-xs font-bold text-amber-500">({expPercentage}%)</span>
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-[2px] shadow-inner">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 shadow"
                    initial={{ width: 0 }}
                    animate={{ width: `${expPercentage}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* TOTAL ACCOMPLISHMENTS QUICK LOG */}
              <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-300/20 text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-100/50 dark:bg-slate-800/40">
                  <div className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                    {history.filter(h => h.status === 'victory').length}
                  </div>
                  <div className="text-[10px] text-slate-800 dark:text-slate-100 font-extrabold leading-tight">Quests Cleared</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-100/50 dark:bg-slate-800/40">
                  <div className="font-extrabold text-lg text-amber-600 dark:text-amber-400">
                    {tasks.filter(t => !t.completed && !t.failed).length}
                  </div>
                  <div className="text-[10px] text-slate-800 dark:text-slate-100 font-extrabold leading-tight">Active Foes</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-100/50 dark:bg-slate-800/40">
                  <div className="font-extrabold text-lg text-rose-600 dark:text-rose-400">
                    {history.filter(h => h.status === 'failed').length}
                  </div>
                  <div className="text-[10px] text-slate-800 dark:text-slate-100 font-extrabold leading-tight">Fled Monsters</div>
                </div>
              </div>
            </section>

            {/* FORGE A NEW QUEST (CREATION PANEL) */}
            <section id="quest-creation-section" className={`p-5 rounded-2xl border transition-all duration-700 ${themeStyles.cardBorder}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-xs">
                  <PlusCircle size={16} />
                </div>
                <h3 className={`text-base font-bold ${timeState === 'FAILURE' ? 'text-slate-100' : 'text-slate-800'}`}>
                  Summon a Foe (New Task)
                </h3>
              </div>

              <form onSubmit={handleAddTask} className="space-y-4">
                
                {/* Name */}
                <div>
                  <label id="task-name-label" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Quest Name (Task Title)
                  </label>
                  <input
                    type="text"
                    required
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="e.g. Read Physics Chapter 3..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-extrabold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Difficulty Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Difficulty Level (Monster Scale)
                    </label>
                    <span className="font-mono text-xs font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                      Level {difficulty}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Interactive Monster Preview Bubble */}
                <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-16 h-16 flex-shrink-0 bg-white/80 dark:bg-slate-900/60 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800">
                    <MonsterArt difficulty={difficulty} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate">
                        {selectedMonsterPreview.name}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded text-slate-500">
                        Lv.{selectedMonsterPreview.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 dark:text-slate-250 font-semibold leading-tight mt-0.5 mt-1 line-clamp-2">
                      {selectedMonsterPreview.description}
                    </p>
                  </div>
                </div>

                {/* Deadline Pickers */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
                    Monster Strike Hour (Deadline Date & Time)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Calendar size={14} className="absolute left-3 top-3 text-sky-500 dark:text-sky-400" />
                      <input
                        type="date"
                        required
                        value={dateStr}
                        onChange={(e) => setDateStr(e.target.value)}
                        className="w-full pl-9 pr-2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-extrabold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="relative">
                      <Clock size={14} className="absolute left-3 top-3 text-sky-500 dark:text-sky-400" />
                      <input
                        type="time"
                        required
                        value={timeStr}
                        onChange={(e) => setTimeStr(e.target.value)}
                        className="w-full pl-9 pr-2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-extrabold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div>
                  <span className="block text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400 mb-1">Quick Magic Time Shortcuts</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyQuickDeadline(5)}
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      🧪 5 Min (Emergency Test)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyQuickDeadline(30)}
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      ⏳ 30 Min (Soon)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyQuickDeadline(180)}
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      📖 3 Hours
                    </button>
                    <button
                      type="button"
                      onClick={() => applyQuickDeadline(1440)}
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      💤 Tomorrow
                    </button>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
                >
                  <Plus size={16} /> Forge Quest Contract
                </button>
              </form>
            </section>
          </div>

          {/* RIGHT SECTION: QUEST CARDS BOARD Area (7 COLS) */}
          <div className="col-span-1 lg:col-span-7 flex flex-col space-y-4">
            
            {/* TABS SELECTOR */}
            <div className="flex bg-slate-200/60 dark:bg-slate-800/40 p-1.5 rounded-xl self-start w-full border border-slate-300/20">
              <button
                onClick={() => setCurrentTab('active')}
                className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  currentTab === 'active'
                    ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-sky-300 font-extrabold shadow-xs border border-blue-200/40 dark:border-sky-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-sky-300'
                }`}
              >
                <Swords size={13} /> Active Quests ({activeIncompleteTasks.length + tasks.filter(t => !t.completed && t.failed).length})
              </button>
              <button
                onClick={() => setCurrentTab('history')}
                className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  currentTab === 'history'
                    ? 'bg-white dark:bg-slate-700 text-[#74d4ff] dark:text-[#74d4ff] font-extrabold shadow-xs border border-blue-200/40 dark:border-sky-500/30'
                    : 'text-[#74d4ff] hover:opacity-80'
                }`}
              >
                <History size={13} /> Chronicles Log ({history.length})
              </button>
            </div>

            {/* TAB VIEWPORTS */}
            <AnimatePresence mode="wait">
              {currentTab === 'active' ? (
                <motion.div
                  key="active-quests"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Empty state view */}
                  {tasks.length === 0 && (
                    <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center gap-3">
                      <div className="text-4xl text-slate-300">🏰</div>
                      <div>
                        <h4 className="font-bold text-slate-700 dark:text-slate-300">Your Dungeon is Clean!</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                          No monsters exist of procrastinated deeds. Fill in the summons forge at left to invoke an active task.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Render Quest Cards */}
                  {tasks.map((task) => {
                    // Match difficulty config info
                    const matchedMonster = MONSTERS[task.difficulty] || MONSTERS[1];
                    
                    // Live remaining time detection
                    const isFailed = task.failed;
                    const totalSecsLeft = Math.floor((new Date(task.deadline).getTime() - Date.now()) / 1000);
                    const isUrgentCritical = !task.completed && !isFailed && totalSecsLeft < 300;
                    const isUrgentWarning = !task.completed && !isFailed && totalSecsLeft < 3600;

                    // Style factors matching context
                    let cardBackground = "bg-white dark:bg-slate-900 border-slate-200 shadow-sm";
                    let warningTextLabel = "";
                    let customProgressBorder = "border-slate-200";

                    if (task.completed) {
                      cardBackground = "bg-slate-100/50 dark:bg-slate-800/10 border-slate-200/50 opacity-60";
                    } else if (isFailed) {
                      cardBackground = "bg-slate-900/85 border-slate-800 shadow-inner ring-1 ring-slate-800/60";
                    } else if (isUrgentCritical) {
                      cardBackground = "bg-stone-900/90 border-red-900 ring-2 ring-red-500/20";
                      warningTextLabel = "⚠️ Urgent! Wakeful state near!";
                      customProgressBorder = "border-red-900";
                    } else if (isUrgentWarning) {
                      cardBackground = "bg-amber-50/20 border-amber-300 ring-1 ring-amber-400/10";
                      warningTextLabel = "⚠️ Restive activity starting!";
                      customProgressBorder = "border-amber-300";
                    }

                    return (
                      <motion.div
                        layout
                        id={`quest-${task.id}`}
                        key={task.id}
                        className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 transition-all duration-500 relative overflow-hidden ${cardBackground}`}
                      >
                        {/* Red danger pulsing effect for critical elements */}
                        {isUrgentCritical && (
                          <div className="absolute inset-0 bg-red-500/5 pulse-red-vfx pointer-events-none" />
                        )}

                        {/* MONSTER GRAPHICS BLOCK */}
                        <div className="w-full md:w-32 flex-shrink-0 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100/40 dark:bg-slate-900/30 border border-slate-200/40 relative">
                          <MonsterArt difficulty={task.difficulty} isDefeated={task.completed} />
                          <span className={`text-[10px] font-mono font-black uppercase mt-1 ${
                            task.difficulty >= 5 ? 'text-[#982c3f] dark:text-[#982c3f]' : 'text-[#1ad380] dark:text-[#1ad380]'
                          }`}>
                            Lv.{matchedMonster.level} • {matchedMonster.name}
                          </span>
                        </div>

                        {/* QUEST DETAILS CONTENT */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            {/* Quest Badge header */}
                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                task.completed
                                  ? 'bg-slate-200 text-slate-600'
                                  : isFailed
                                  ? 'bg-slate-900 border border-slate-700 text-slate-400'
                                  : isUrgentCritical
                                  ? 'bg-red-950 text-red-200 border border-red-800'
                                  : isUrgentWarning
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}>
                                {isFailed ? '💥 Fled' : task.completed ? '🏆 Conquered' : '⚔️ Active Quest'}
                              </span>

                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900 text-sky-600 dark:text-sky-300 flex items-center gap-1 font-bold">
                                <Sparkles size={8} className="text-sky-500 animate-pulse" /> Reward: +{task.difficulty} EXP
                              </span>

                              {warningTextLabel && (
                                <span className="text-[10px] font-extrabold text-red-500 dark:text-red-400 animate-pulse flex items-center gap-1 ml-auto">
                                  {warningTextLabel}
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h4 className={`text-base leading-snug break-words transition-colors duration-500 ${
                              task.completed 
                                ? 'line-through text-slate-400 dark:text-slate-500 font-medium' 
                                : isFailed
                                ? (task.difficulty <= 4 
                                    ? 'text-emerald-400 font-bold' 
                                    : task.difficulty <= 7 
                                    ? 'text-amber-400 font-extrabold' 
                                    : 'text-sky-300 font-black')
                                : isUrgentCritical
                                ? 'text-rose-400 dark:text-rose-300 font-black animate-pulse'
                                : isUrgentWarning
                                ? 'text-amber-800 dark:text-amber-300 font-extrabold'
                                : (task.difficulty <= 4
                                    ? 'text-emerald-800 dark:text-emerald-300 font-bold'
                                    : task.difficulty <= 7
                                    ? 'text-amber-800 dark:text-amber-400 font-extrabold'
                                    : 'text-sky-900 dark:text-sky-300 font-black')
                            }`}>
                              {task.name}
                            </h4>

                            {/* Monster Bio snippet */}
                            <p className="text-[11px] text-slate-500 dark:text-sky-200/70 italic font-serif leading-normal mt-1 border-l-2 border-slate-300/20 pl-2">
                              &quot;{matchedMonster.description}&quot;
                            </p>
                          </div>

                          {/* TIMELINE COUNTDOWNS AND ACTIONS ROW */}
                          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 font-mono">
                            
                            {/* Time Remaining blocks */}
                            <div className="flex items-center gap-4 text-xs">
                              {/* Strike Moment */}
                              <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-wider text-sky-600 dark:text-sky-300 font-bold flex items-center gap-1">
                                  <Calendar size={9} className="text-sky-500" /> Strike Time
                                </span>
                                <span className="text-[11px] font-extrabold text-sky-700 dark:text-sky-200 leading-none mt-1">
                                  {formatDateDisplay(task.deadline)}
                                </span>
                              </div>

                              {/* Live counter */}
                              {!task.completed && (
                                <div className="flex flex-col">
                                  <span className="text-[9px] uppercase tracking-wider text-sky-600 dark:text-sky-300 font-bold flex items-center gap-1">
                                    <Clock size={9} className="text-sky-500 animate-pulse" /> Banish Window
                                  </span>
                                  {isFailed ? (
                                    <span className="text-xs font-bold text-rose-500 mt-1 uppercase">
                                      Escaped (Failed)
                                    </span>
                                  ) : (
                                    <span className={`text-[13px] font-extrabold leading-none mt-1 ${
                                      isUrgentCritical
                                        ? 'text-red-500 text-lg animate-pulse'
                                        : isUrgentWarning
                                        ? 'text-amber-500'
                                        : 'text-sky-600 dark:text-sky-400 font-black'
                                    }`}>
                                      {formatCountdown(task.deadline)}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* ACTION BUTTON CONTROL AREA */}
                            <div className="flex items-center gap-2">
                              {/* Victory Conquest button for active keys */}
                              {!task.completed && !isFailed && (
                                <button
                                  onClick={() => handleCompleteTask(task.id)}
                                  className="py-1.5 px-3 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white font-bold rounded-lg text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  Complete Quest
                                </button>
                              )}

                              {/* Recover Fail Reset button */}
                              {isFailed && (
                                <button
                                  onClick={() => handleAcknowledgeFailure(task.id)}
                                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-lg text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1 border border-slate-700"
                                >
                                  Log Escape (Retry)
                                </button>
                              )}

                              {/* Hapus button - always available for any task state under Active Quests */}
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/45 dark:text-rose-400 border border-rose-200 dark:border-rose-900 font-extrabold rounded-lg text-xs shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-1"
                                title="Hapus quest"
                              >
                                <Trash2 size={12} />
                                <span>Hapus</span>
                              </button>
                            </div>

                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="chronicle-history"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-900 dark:text-sky-300 uppercase font-mono font-black">Chronicle Logs (Fallen Heroes & Foes)</span>
                    {history.length > 0 && (
                      <button
                        onClick={handleClearHistory}
                        className="text-xs hover:text-red-500 text-sky-600 dark:text-sky-300 flex items-center gap-1 cursor-pointer transition-colors font-bold"
                      >
                        <Trash2 size={12} className="text-sky-500" /> Clear Chronicled Logs
                      </button>
                    )}
                  </div>

                  {/* Empty state chronicle view */}
                  {history.length === 0 && (
                    <div className="p-10 text-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center gap-3 bg-white/50 dark:bg-slate-900/10">
                      <div className="text-3xl">🖋️</div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">Chronicle is Empty</h4>
                        <p className="text-xs text-slate-500 dark:text-sky-200/60 max-w-sm mx-auto mt-1">
                          No quests have been completed or lost yet in this run. Take forward your blade and write your epic!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Render historical logs */}
                  {history.map((h) => {
                    const isVictory = h.status === 'victory';
                    return (
                      <div
                        key={h.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all duration-300 ${
                          isVictory
                            ? 'bg-emerald-50/40 border-emerald-100 text-emerald-950 dark:text-emerald-100'
                            : 'bg-rose-50/10 border-rose-950/20 text-rose-300 bg-slate-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{isVictory ? '🏆' : '💀'}</span>
                          <div>
                            <div className="font-bold text-[13px] leading-snug">
                              {h.taskName}
                            </div>
                            <div className="text-[10px] text-sky-700 dark:text-sky-200 mt-0.5 flex items-center gap-1 font-mono font-bold">
                              <span>Foe: {h.monsterName} (Lv.{h.difficulty})</span>
                              <span>•</span>
                              <span>{h.status === 'victory' ? 'Banish' : 'Escaped'} on {new Date(h.timestamp).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Gained EXP */}
                        {isVictory && h.expGained && (
                          <div className="font-mono font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-center">
                            +{h.expGained} XP
                          </div>
                        )}
                        {!isVictory && (
                          <div className="font-mono font-medium bg-red-955 text-red-300 border border-red-900/60 px-2 py-0.5 rounded text-center">
                            FLED
                          </div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>

      {/* FOOTER COZY BRAND INFO */}
      <footer className="mt-auto py-8 text-center text-xs text-slate-400/60 border-t border-slate-350/10 mb-2">
        <p>⚔️ Guild Master Chronicles • Anti-Procrastination Dungeon • Safe Workspace Ambient</p>
      </footer>

      {/* ----------------------------------------------------
          CELEBRATION OVERLAY SYSTEM (MODALS)
         ---------------------------------------------------- */}
      {/* 1. QUEST CLEARED/VICTORY CELEBRATION MODAL */}
      <AnimatePresence>
        {celebration?.show && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-hidden">
            
            {/* Visual celebration emoji rain falling down */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
              {[...Array(12)].map((_, i) => {
                const emojis = ['✨', '🌟', '🎉', '⚔️', '🏆', '🔥'];
                const emoji = emojis[i % emojis.length];
                const xPos = `${(i * 100) / 12 + Math.random() * 4}%`;
                const duration = 4.5 + Math.random() * 3;
                const delay = Math.random() * 3;
                return (
                  <motion.div
                    key={i}
                    className="absolute text-[35vh] md:text-[45vh] select-none leading-none pointer-events-none"
                    initial={{
                      x: xPos,
                      y: '-55vh',
                      rotate: Math.random() * 360,
                    }}
                    animate={{
                      y: '125vh',
                      rotate: Math.random() * 360 + 180,
                    }}
                    transition={{
                      duration: duration,
                      delay: delay,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                    style={{
                      opacity: 0.25,
                    }}
                  >
                    {emoji}
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl relative"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Trophy size={40} className="text-white animate-bounce" />
              </div>

              <div className="mt-12 space-y-4">
                <div>
                  <h3 className="text-2xl font-black text-amber-550 tracking-tight">Quest Cleared!</h3>
                  <span className="text-[10px] font-mono font-extrabold uppercase bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full mt-1.5 inline-block">
                    Defeated {celebration.monsterName} (Lv.{celebration.monsterLevel})
                  </span>
                </div>

                {/* Micro Preview Defeated monster */}
                <div className="w-24 h-24 rounded-2xl bg-neutral-100 dark:bg-slate-800 mx-auto flex items-center justify-center p-2 border border-slate-200">
                  <MonsterArt difficulty={celebration.monsterLevel} isDefeated={true} />
                </div>

                <div>
                  <p className="text-xs font-serif italic text-slate-500 leading-relaxed px-2">
                    &quot;{celebration.message}&quot;
                  </p>
                  
                  <div className="text-sm font-bold mt-4 font-mono text-emerald-600 flex items-center justify-center gap-1.5 animate-pulse">
                    <span>✨ Reward Claimed:</span>
                    <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded text-emerald-800">
                      +{celebration.xpGained} EXP
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setCelebration(null)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Collect Bounties & Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. PLAYER LEVEL-UP MODAL OVERLAY */}
      <AnimatePresence>
        {levelUpMessage?.show && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-hidden">
            
            {/* Visual gold crown rain falling down */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
              {[...Array(12)].map((_, i) => {
                const xPos = `${(i * 100) / 12 + Math.random() * 4}%`;
                const duration = 5 + Math.random() * 3.5;
                const delay = Math.random() * 3.5;
                return (
                  <motion.div
                    key={i}
                    className="absolute text-[35vh] md:text-[45vh] select-none leading-none pointer-events-none"
                    initial={{
                      x: xPos,
                      y: '-55vh',
                      rotate: Math.random() * 360,
                    }}
                    animate={{
                      y: '125vh',
                      rotate: Math.random() * 360 + 180,
                    }}
                    transition={{
                      duration: duration,
                      delay: delay,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                    style={{
                      opacity: 0.3,
                    }}
                  >
                    👑
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0, scaleY: 0.5 }}
              animate={{ scale: 1, opacity: 1, scaleY: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-amber-500 to-yellow-600 border-4 border-amber-300 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl relative"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-4xl">
                👑
              </div>

              <div className="space-y-4 pt-4 text-white">
                <div>
                  <h3 className="text-3xl font-black tracking-tight leading-none uppercase drop-shadow-sm">Level Up!</h3>
                  <p className="text-xs font-medium text-amber-100 mt-1">Your core intelligence and focus have crossed boundaries.</p>
                </div>

                <div className="flex justify-center items-center gap-6 py-4 bg-white/10 rounded-2xl">
                  <div className="text-center">
                    <span className="block text-[10px] text-amber-200 font-mono font-bold uppercase">Old Power</span>
                    <span className="text-2xl font-black font-mono">Lv.{levelUpMessage.oldLevel}</span>
                  </div>
                  <div className="text-2xl text-amber-200 animate-pulse">➡️</div>
                  <div className="text-center">
                    <span className="block text-[10px] text-amber-200 font-mono font-bold uppercase">New Power</span>
                    <span className="text-3xl font-black font-mono text-yellow-100 animate-bounce">{levelUpMessage.newLevel}</span>
                  </div>
                </div>

                <p className="text-xs text-amber-100 leading-normal px-4">
                  🗝️ High intelligence triggers high expectations. Your next advancement target has doubled to <span className="font-bold font-mono text-white underline">{levelUpMessage.newGoal} EXP</span> as requested.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setLevelUpMessage(null)}
                    className="w-full py-2.5 bg-white text-amber-900 font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-neutral-50 transition-colors cursor-pointer shadow"
                  >
                    Claim New Power!
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
