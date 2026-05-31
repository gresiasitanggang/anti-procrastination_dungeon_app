import { motion } from 'motion/react';

interface MonsterArtProps {
  difficulty: number; // 1-10
  isDefeated?: boolean;
}

export function MonsterArt({ difficulty, isDefeated = false }: MonsterArtProps) {
  // Common dizzy/knocked-out eyes
  const knockedOutEyes = (
    <g className="opacity-80">
      <path d="M -15,-5 L -5,5 M -5,-5 L -15,5" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 5,-5 L 15,5 M 15,-5 L 5,5" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );

  // Helper for generating dynamic monster svgs
  switch (difficulty) {
    case 1: // Tiny Slime: Bouncy emerald jelly
      return (
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full filter drop-shadow-md"
            animate={
              isDefeated
                ? { scaleY: [1, 0.4, 0.8], y: [0, 15, 20], opacity: [1, 0.7, 0.5] }
                : { scaleY: [1, 0.85, 1.05, 1], y: [0, 5, -8, 0] }
            }
            transition={{
              duration: isDefeated ? 1 : 2,
              repeat: isDefeated ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Slime Body */}
            <path
              d="M 15,70 C 15,40 30,25 50,25 C 70,25 85,40 85,70 C 85,82 72,85 50,85 C 28,85 15,82 15,70 Z"
              fill="url(#slime-grad-1)"
              className={isDefeated ? "grayscale opacity-65" : ""}
            />
            {/* Highlights */}
            {!isDefeated && (
              <ellipse cx="35" cy="40" rx="6" ry="3" fill="#ffffff" opacity="0.4" transform="rotate(-15 35 40)" />
            )}
            
            {/* Face Group */}
            <g transform="translate(50, 60)">
              {isDefeated ? (
                knockedOutEyes
              ) : (
                <>
                  {/* Happy Eyes */}
                  <circle cx="-13" cy="-6" r="4.5" fill="#1e293b" />
                  <circle cx="13" cy="-6" r="4.5" fill="#1e293b" />
                  <circle cx="-14" cy="-8" r="1.5" fill="#ffffff" />
                  <circle cx="12" cy="-8" r="1.5" fill="#ffffff" />
                  {/* Blush */}
                  <ellipse cx="-18" cy="1" rx="5" ry="2" fill="#f43f5e" opacity="0.5" />
                  <ellipse cx="18" cy="1" rx="5" ry="2" fill="#f43f5e" opacity="0.5" />
                  {/* Cute Smile */}
                  <path d="M -5,0 Q 0,4 5,0" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </>
              )}
            </g>

            <defs>
              <linearGradient id="slime-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </motion.svg>
          {isDefeated && <span className="absolute text-2xl">💤</span>}
        </div>
      );

    case 2: // Forest Slime: Teal jelly with a little sprout herb on top
      return (
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full filter drop-shadow-md"
            animate={
              isDefeated
                ? { scaleY: [1, 0.4, 0.8], y: [0, 15, 20], opacity: [1, 0.7, 0.5] }
                : { scaleY: [1, 0.88, 1.03, 1], y: [0, 4, -10, 0] }
            }
            transition={{
              duration: isDefeated ? 1 : 1.8,
              repeat: isDefeated ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Sprout Stem */}
            {!isDefeated && (
              <g transform="translate(50, 18)">
                <path d="M 0,10 Q -5,0 -12,-4" stroke="#4ade80" strokeWidth="3" fill="none" />
                <path d="M 0,10 Q 5,2 10,-2" stroke="#4ade80" strokeWidth="3" fill="none" />
                {/* Sprout Leaves */}
                <path d="M -12,-4 C -15,-10 -8,-12 -12,-4" fill="#22c55e" />
                <path d="M 10,-2 C 14,-8 7,-10 10,-2" fill="#22c55e" />
              </g>
            )}

            {/* Slime Body */}
            <path
              d="M 15,70 C 15,38 30,23 50,23 C 70,23 85,38 85,70 C 85,82 72,85 50,85 C 28,85 15,82 15,70 Z"
              fill="url(#slime-grad-2)"
              className={isDefeated ? "grayscale opacity-65" : ""}
            />

            {/* highlights */}
            {!isDefeated && (
              <ellipse cx="33" cy="38" rx="7" ry="3.5" fill="#ffffff" opacity="0.35" transform="rotate(-15 33 38)" />
            )}

            {/* Face */}
            <g transform="translate(50, 58)">
              {isDefeated ? (
                knockedOutEyes
              ) : (
                <>
                  <circle cx="-13" cy="-5" r="5" fill="#0f172a" />
                  <circle cx="13" cy="-5" r="5" fill="#0f172a" />
                  <circle cx="-14" cy="-7" r="1.5" fill="#ffffff" />
                  <circle cx="12" cy="-7" r="1.5" fill="#ffffff" />
                  {/* Blushes */}
                  <ellipse cx="-18" cy="2" rx="6" ry="2.5" fill="#f43f5e" opacity="0.55" />
                  <ellipse cx="18" cy="2" rx="6" ry="2.5" fill="#f43f5e" opacity="0.55" />
                  {/* Surprised happy mouth */}
                  <circle cx="0" cy="2" r="3.5" fill="#0f172a" />
                </>
              )}
            </g>

            <defs>
              <linearGradient id="slime-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
            </defs>
          </motion.svg>
          {isDefeated && <span className="absolute text-2xl">🍃</span>}
        </div>
      );

    case 3: // Goblin Scout: Green goblin head with leaf/yellow goggles and scarf
      return (
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full filter drop-shadow-md"
            animate={
              isDefeated
                ? { rotate: [0, 45, 90], y: [0, 10, 20], opacity: [1, 0.8, 0.4] }
                : { y: [0, -4, 0] }
            }
            transition={{
              duration: isDefeated ? 0.8 : 2.2,
              repeat: isDefeated ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Ears */}
            <path d="M 22,48 C 5,42 8,58 24,54 Z" fill="#84cc16" className={isDefeated ? "grayscale opacity-60" : ""} />
            <path d="M 78,48 C 95,42 92,58 76,54 Z" fill="#84cc16" className={isDefeated ? "grayscale opacity-60" : ""} />
            {/* Ear inner */}
            <path d="M 20,49 C 10,47 12,54 22,52 Z" fill="#f43f5e" opacity="0.3" className={isDefeated ? "grayscale" : ""} />
            <path d="M 80,49 C 90,47 88,54 78,52 Z" fill="#f43f5e" opacity="0.3" className={isDefeated ? "grayscale" : ""} />

            {/* Goblin Head */}
            <ellipse cx="50" cy="52" rx="27" ry="21" fill="#84cc16" className={isDefeated ? "grayscale opacity-65" : ""} />

            {/* Scout Scarf */}
            <path d="M 32,71 C 40,75 60,75 68,71 L 62,82 L 38,82 Z" fill="#f59e0b" className={isDefeated ? "grayscale" : ""} />

            {/* Eyes & Goggles */}
            <g transform="translate(50, 48)">
              {isDefeated ? (
                knockedOutEyes
              ) : (
                <>
                  {/* Cute Eyeglasses/Goggles */}
                  <rect x="-24" y="-8" width="48" height="15" rx="5" fill="#475569" opacity="0.9" />
                  <circle cx="-11" cy="-1" r="7" fill="#f59e0b" stroke="#334155" strokeWidth="2" />
                  <circle cx="11" cy="-1" r="7" fill="#f59e0b" stroke="#334155" strokeWidth="2" />
                  {/* Pupils */}
                  <circle cx="-11" cy="-1" r="3" fill="#1e293b" />
                  <circle cx="11" cy="-1" r="3" fill="#1e293b" />
                  <circle cx="-12" cy="-2" r="1" fill="#ffffff" />
                  <circle cx="10" cy="-2" r="1" fill="#ffffff" />
                  {/* Little tooth sticking up */}
                  <path d="M -5,11 L -2,5 L 1,11 Z" fill="#ffffff" />
                  <path d="M 5,11 L 2,5 L -1,11 Z" fill="#ffffff" />
                  {/* Mouth */}
                  <path d="M -8,8 Q 0,13 8,8" stroke="#1e293b" strokeWidth="2" fill="none" />
                </>
              )}
            </g>
          </motion.svg>
          {isDefeated && <span className="absolute text-2xl">⛺</span>}
        </div>
      );

    case 4: // Goblin Warrior: Green goblin with iron helmet and small wooden club
      return (
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full filter drop-shadow-md"
            animate={
              isDefeated
                ? { rotate: [0, -60, -90], y: [0, 8, 18], opacity: [1, 0.8, 0.4] }
                : { y: [0, -3, 3, 0] }
            }
            transition={{
              duration: isDefeated ? 0.8 : 2.0,
              repeat: isDefeated ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Ears */}
            <path d="M 22,50 C 4,45 6,60 23,56 Z" fill="#65a30d" className={isDefeated ? "grayscale opacity-60" : ""} />
            <path d="M 78,50 C 96,45 94,60 77,56 Z" fill="#65a30d" className={isDefeated ? "grayscale opacity-60" : ""} />

            {/* Club */}
            {!isDefeated && (
              <motion.g
                animate={{ rotate: [-5, 20, -5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "20px 75px" }}
              >
                <path d="M 12,50 L 22,48 L 26,75 L 16,77 Z" fill="#b45309" stroke="#78350f" strokeWidth="1" />
                {/* Spikes on club */}
                <circle cx="11" cy="52" r="2.5" fill="#f59e0b" />
                <circle cx="21" cy="50" r="2.5" fill="#f59e0b" />
                <circle cx="14" cy="62" r="2.5" fill="#f59e0b" />
              </motion.g>
            )}

            {/* Goblin Head */}
            <ellipse cx="50" cy="55" rx="27" ry="21" fill="#65a30d" className={isDefeated ? "grayscale opacity-65" : ""} />

            {/* Warrior Helmet (Bucket shape with nose protector) */}
            <path d="M 23,45 L 77,45 L 72,25 L 28,25 Z" fill="#64748b" className={isDefeated ? "grayscale" : ""} />
            <path d="M 46,45 L 50,56 L 54,45 Z" fill="#475569" className={isDefeated ? "grayscale" : ""} />
            {/* Helmet bolt details */}
            <circle cx="33" cy="30" r="2.5" fill="#94a3b8" />
            <circle cx="67" cy="30" r="2.5" fill="#94a3b8" />

            {/* Face */}
            <g transform="translate(50, 56)">
              {isDefeated ? (
                knockedOutEyes
              ) : (
                <>
                  <circle cx="-11" cy="0" r="4.5" fill="#1e293b" />
                  <circle cx="11" cy="0" r="4.5" fill="#1e293b" />
                  <circle cx="-12" cy="-2" r="1.5" fill="#ffffff" />
                  <circle cx="10" cy="-2" r="1.5" fill="#ffffff" />
                  {/* Warrior serious eyebrows */}
                  <path d="M -16,-5 L -6,-3" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 16,-5 L 6,-3" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Cute fangs */}
                  <path d="M -5,5 L -3,11 L -1,5 Z" fill="#ffffff" />
                  <path d="M 5,5 L 3,11 L 1,5 Z" fill="#ffffff" />
                </>
              )}
            </g>
          </motion.svg>
          {isDefeated && <span className="absolute text-2xl">⚔️</span>}
        </div>
      );

    case 5: // Skeleton Knight: Cute clatter skeleton skull with shiny guard iron helmet
      return (
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full filter drop-shadow-md"
            animate={
              isDefeated
                ? { y: [0, 20], opacity: [1, 0], rotate: 45 }
                : { y: [0, -4, 0], rotate: [-1, 1, -1] }
            }
            transition={{
              duration: isDefeated ? 0.7 : 2.5,
              repeat: isDefeated ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Shield */}
            {!isDefeated && (
              <motion.g
                animate={{ rotate: [-3, 5, -3] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "80px 70px" }}
              >
                <path d="M 70,55 C 70,55 70,78 80,84 C 90,78 90,55 90,55 Z" fill="#dc2626" stroke="#fca5a5" strokeWidth="2" />
                <path d="M 80,55 L 80,84" stroke="#fca5a5" strokeWidth="1.5" />
              </motion.g>
            )}

            {/* Skeleton Head */}
            <rect x="33" y="52" width="34" height="25" rx="10" fill="#f1f5f9" className={isDefeated ? "grayscale opacity-50" : ""} />
            <rect x="42" y="70" width="16" height="12" rx="3" fill="#f1f5f9" className={isDefeated ? "grayscale opacity-50" : ""} />

            {/* Teeth details */}
            <line x1="47" y1="72" x2="47" y2="80" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="53" y1="72" x2="53" y2="80" stroke="#cbd5e1" strokeWidth="2" />

            {/* Golden Rusty Helmet */}
            <path d="M 28,52 L 72,52 L 66,22 C 60,18 40,18 34,22 Z" fill="#475569" className={isDefeated ? "grayscale" : ""} />
            {/* Red plume feather on armor */}
            <path d="M 50,19 C 50,19 45,5 34,9 C 43,12 47,19 50,19 Z" fill="#eb4034" className={isDefeated ? "grayscale" : ""} />
            <circle cx="50" cy="22" r="3" fill="#fbbf24" />

            {/* Helmet Visor Gap */}
            <rect x="34" y="42" width="32" height="6" fill="#1e293b" />

            {/* Eye Sockets */}
            <g transform="translate(50, 60)">
              {isDefeated ? (
                knockedOutEyes
              ) : (
                <>
                  <circle cx="-10" cy="3" r="6" fill="#1e293b" />
                  <circle cx="10" cy="3" r="6" fill="#1e293b" />
                  {/* Cute glowing cyan spirit eyes */}
                  <circle cx="-10" cy="3" r="2.5" fill="#22d3ee" className="animate-pulse" />
                  <circle cx="10" cy="3" r="2.5" fill="#22d3ee" className="animate-pulse" />
                  {/* Nose cavity */}
                  <polygon points="0,9 -3,13 3,13" fill="#1e293b" />
                </>
              )}
            </g>
          </motion.svg>
          {isDefeated && <span className="absolute text-2xl">🏺</span>}
        </div>
      );

    case 6: // Orc Captain: Muscular cute orc with battle helmet and massive dual axe
      return (
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full filter drop-shadow-md"
            animate={
              isDefeated
                ? { y: [0, 15, 20], scale: [1, 0.9, 0.8], opacity: [1, 0.7, 0.3], rotate: [0, -15, -25] }
                : { y: [0, -5, 0] }
            }
            transition={{
              duration: isDefeated ? 0.7 : 1.9,
              repeat: isDefeated ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Axe */}
            {!isDefeated && (
              <motion.g
                animate={{ rotate: [-10, 15, -10] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "85px 75px" }}
              >
                {/* Axe shaft */}
                <rect x="80" y="25" width="4" height="60" rx="2" fill="#78350f" />
                {/* Axe blades */}
                <path d="M 82,30 C 70,25 60,35 78,45 Z" fill="#94a3b8" />
                <path d="M 82,30 C 94,25 104,35 86,45 Z" fill="#94a3b8" />
                <circle cx="82" cy="35" r="2" fill="#e2e8f0" />
              </motion.g>
            )}

            {/* Orc Ears */}
            <path d="M 18,52 C -2,46 -1,60 18,58 Z" fill="#15803d" className={isDefeated ? "grayscale opacity-50" : ""} />
            <path d="M 82,52 C 102,46 101,60 82,58 Z" fill="#15803d" className={isDefeated ? "grayscale opacity-50" : ""} />

            {/* Orc Chubby Head */}
            <ellipse cx="50" cy="56" rx="30" ry="22" fill="#15803d" className={isDefeated ? "grayscale opacity-60" : ""} />

            {/* Horned Helmet */}
            <path d="M 23,48 Q 50,30 77,48 L 74,40 L 26,40 Z" fill="#334155" className={isDefeated ? "grayscale" : ""} />
            {/* Horn Left */}
            <path d="M 27,41 Q 12,23 20,20 Q 25,25 29,38 Z" fill="#f8fafc" className={isDefeated ? "grayscale" : ""} />
            {/* Horn Right */}
            <path d="M 73,41 Q 88,23 80,20 Q 75,25 71,38 Z" fill="#f8fafc" className={isDefeated ? "grayscale" : ""} />

            {/* Orc Face */}
            <g transform="translate(50, 58)">
              {isDefeated ? (
                knockedOutEyes
              ) : (
                <>
                  <circle cx="-12" cy="0" r="5" fill="#0f172a" />
                  <circle cx="12" cy="0" r="5" fill="#0f172a" />
                  <circle cx="-13" cy="-2" r="1.5" fill="#ffffff" />
                  <circle cx="11" cy="-2" r="1.5" fill="#ffffff" />
                  {/* Heavy grumpy eyebrows */}
                  <path d="M -19,-6 L -7,-3" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 19,-6 L 7,-3" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Huge upward tusks */}
                  <path d="M -15,7 Q -11,15 -7,5 L -10,4 Z" fill="#f8fafc" />
                  <path d="M 15,7 Q 11,15 7,5 L 10,4 Z" fill="#f8fafc" />
                  {/* Grumpy mouth line */}
                  <path d="M -3,8 L 3,8" stroke="#0f172a" strokeWidth="2.5" />
                </>
              )}
            </g>
          </motion.svg>
          {isDefeated && <span className="absolute text-2xl">🍖</span>}
        </div>
      );

    case 7: // Shadow Beast: Purple glowing celestial shadow mist with bright pink glowy ears and horns
      return (
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full filter drop-shadow-xl"
            animate={
              isDefeated
                ? { scale: [1, 0], opacity: [1, 0], rotate: 180 }
                : { scale: [1, 1.04, 0.96, 1], rotate: [-2, 2, -2] }
            }
            transition={{
              duration: isDefeated ? 0.6 : 3,
              repeat: isDefeated ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Glowing Aura back */}
            <ellipse cx="50" cy="50" rx="36" ry="32" fill="#a21caf" opacity="0.15" className="animate-ping" />

            {/* Cloud Puff Body */}
            <g className={isDefeated ? "grayscale opacity-50" : ""}>
              <ellipse cx="50" cy="50" rx="30" ry="25" fill="#1e1b4b" />
              <circle cx="30" cy="45" r="16" fill="#1e1b4b" />
              <circle cx="70" cy="45" r="16" fill="#1e1b4b" />
              <circle cx="38" cy="65" r="14" fill="#1e1b4b" />
              <circle cx="62" cy="65" r="14" fill="#1e1b4b" />
            </g>

            {/* Neon Horns */}
            {!isDefeated && (
              <g>
                <path d="M 33,35 Q 22,20 18,22 Q 23,28 32,38 Z" fill="#f43f5e" />
                <path d="M 67,35 Q 78,20 82,22 Q 77,28 68,38 Z" fill="#f43f5e" />
              </g>
            )}

            {/* Face */}
            <g transform="translate(50, 48)">
              {isDefeated ? (
                knockedOutEyes
              ) : (
                <>
                  {/* Glowing pink kitty eyes */}
                  <ellipse cx="-13" cy="2" rx="6.5" ry="4" fill="#f43f5e" />
                  <ellipse cx="13" cy="2" rx="6.5" ry="4" fill="#f43f5e" />
                  {/* White pupil highlights for cuteness */}
                  <circle cx="-13" cy="1" r="2" fill="#ffffff" />
                  <circle cx="13" cy="1" r="2" fill="#ffffff" />
                  {/* Shadow whiskers */}
                  <line x1="-28" y1="12" x2="-20" y2="10" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                  <line x1="28" y1="12" x2="20" y2="10" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                  {/* Snuggly wave mouth */}
                  <path d="M -4,11 Q -2,8 0,11 Q 2,8 4,11" stroke="#f43f5e" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                </>
              )}
            </g>
          </motion.svg>
          {isDefeated && <span className="absolute text-2xl">✨</span>}
        </div>
      );

    case 8: // Dark Sorcerer: Hooded pure fuchsia entity holding glowing energy sphere staff
      return (
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full filter drop-shadow-md"
            animate={
              isDefeated
                ? { y: [0, 10, 20], opacity: [1, 0.6, 0.1], scale: [1, 0.8, 0.5] }
                : { y: [0, -6, 0] }
            }
            transition={{
              duration: isDefeated ? 0.7 : 2.4,
              repeat: isDefeated ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Wizard Staff with Floating Orb */}
            {!isDefeated && (
              <motion.g
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Staff rod */}
                <rect x="76" y="24" width="4" height="60" rx="2" fill="#cbd5e1" />
                {/* Glowing runic sphere container */}
                <circle cx="78" cy="18" r="10" fill="none" stroke="#d946ef" strokeWidth="1.5" />
                {/* Glowing deep purple energy core */}
                <circle cx="78" cy="18" r="6" fill="#f472b6" className="animate-pulse" />
              </motion.g>
            )}

            {/* Sorcerer Hooded Robe */}
            <path d="M 23,85 C 23,55 33,30 50,30 C 67,30 77,55 77,85 Z" fill="#4a044e" className={isDefeated ? "grayscale opacity-50" : ""} />

            {/* Inner Dark Face Area */}
            <ellipse cx="50" cy="52" rx="18" ry="16" fill="#120114" />

            {/* Mysterious Glowing Eyes inside black void */}
            <g transform="translate(50, 51)">
              {isDefeated ? (
                knockedOutEyes
              ) : (
                <>
                  {/* Menacing but clean cute slanted eyes */}
                  <path d="M -15,-2 L -3,3" stroke="#f472b6" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 15,-2 L 3,3" stroke="#f472b6" strokeWidth="4.5" strokeLinecap="round" />
                  {/* Glowing center particles */}
                  <circle cx="-9" cy="0" r="2.5" fill="#ffffff" />
                  <circle cx="9" cy="0" r="2.5" fill="#ffffff" />
                </>
              )}
            </g>

            {/* Runic amulet */}
            <polygon points="50,70 54,78 50,86 46,78" fill="#fbbf24" stroke="#d97706" strokeWidth="1" className={isDefeated ? "grayscale" : ""} />
          </motion.svg>
          {isDefeated && <span className="absolute text-2xl font-mono text-purple-400">⚡</span>}
        </div>
      );

    case 9: // Ancient Demon: Cute bouncy fat red devil with tiny flappable bat wings and spiral horns
      return (
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full filter drop-shadow-xl"
            animate={
              isDefeated
                ? { rotate: [0, 90, 180], scale: [1, 0.7, 0.3], opacity: [1, 0.6, 0.1] }
                : { y: [0, -4, 4, 0] }
            }
            transition={{
              duration: isDefeated ? 0.8 : 2.1,
              repeat: isDefeated ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Bat Wings (Flapping in background) */}
            <g className={isDefeated ? "grayscale opacity-40" : ""}>
              <motion.path
                d="M 23,50 C 1,35 12,20 28,38 Z"
                fill="#1e293b"
                animate={isDefeated ? {} : { rotate: [0, -18, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "28px 38px" }}
              />
              <motion.path
                d="M 77,50 C 99,35 88,20 72,38 Z"
                fill="#1e293b"
                animate={isDefeated ? {} : { rotate: [0, 18, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "72px 38px" }}
              />
            </g>

            {/* Demon Pitchfork */}
            {!isDefeated && (
              <motion.g
                animate={{ rotate: [-8, 12, -8] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "12px 70px" }}
              >
                {/* Handle */}
                <rect x="8" y="28" width="3" height="52" rx="1.5" fill="#1e293b" />
                {/* Fork tip */}
                <path d="M 3,28 L 16,28" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 4,20 L 4,28" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 9,15 L 9,28" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 14,20 L 14,28" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
              </motion.g>
            )}

            {/* Devil body */}
            <ellipse cx="50" cy="56" rx="28" ry="24" fill="#e11d48" className={isDefeated ? "grayscale opacity-60" : ""} />

            {/* Spiral Horns */}
            <path d="M 28,38 Q 12,18 20,13 Q 27,24 33,36 Z" fill="#1e293b" className={isDefeated ? "grayscale" : ""} />
            <path d="M 72,38 Q 88,18 80,13 Q 73,24 67,36 Z" fill="#1e293b" className={isDefeated ? "grayscale" : ""} />

            {/* Face */}
            <g transform="translate(50, 56)">
              {isDefeated ? (
                knockedOutEyes
              ) : (
                <>
                  <circle cx="-11" cy="0" r="5" fill="#1e293b" />
                  <circle cx="11" cy="0" r="5" fill="#1e293b" />
                  {/* Glowing amber pupils */}
                  <circle cx="-10" cy="0" r="2" fill="#fbbf24" />
                  <circle cx="10" cy="0" r="2" fill="#fbbf24" />
                  <circle cx="-11" cy="-1.5" r="0.8" fill="#ffffff" />
                  <circle cx="9" cy="-1.5" r="0.8" fill="#ffffff" />
                  {/* Mischievous warning angry brows */}
                  <path d="M -18,-6 L -6,-2" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 18,-6 L 6,-2" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                  {/* Smug pointed smile */}
                  <path d="M -6,8 Q 0,14 6,8" stroke="#1e293b" strokeWidth="2.5" fill="none" />
                  <path d="M 4,8 L 6,12 L 0,9 Z" fill="#ffffff" />
                </>
              )}
            </g>
          </motion.svg>
          {isDefeated && <span className="absolute text-2xl">🔥</span>}
        </div>
      );

    case 10: // Legendary Dragon: Ultimate procrastination boss! Giant adorable red dragon that flaps wings, breathes fire, has wings, tail, cute scales
    default:
      return (
        <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
          <motion.svg
            viewBox="0 0 120 120"
            className="w-full h-full filter drop-shadow-xl"
            animate={
              isDefeated
                ? { y: [0, 15, 30], scale: [1, 0.7, 0.4], opacity: [1, 0.6, 0], rotate: [0, 45, 90] }
                : { y: [0, -7, 0] }
            }
            transition={{
              duration: isDefeated ? 1.0 : 2.0,
              repeat: isDefeated ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Dragon Tail (bobbing) */}
            <g className={isDefeated ? "grayscale opacity-40" : ""}>
              <motion.path
                d="M 28,85 Q 10,95 8,78 Q 20,70 34,80"
                fill="#b91c1c"
                animate={isDefeated ? {} : { rotate: [0, -10, 10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <polygon points="6,78 1,73 8,68" fill="#f59e0b" />
            </g>

            {/* Dragon Scenic Large Flapping Wings */}
            <g className={isDefeated ? "grayscale opacity-40" : ""}>
              <motion.path
                d="M 40,60 C 10,40 20,-5 42,42 Z"
                fill="#7f1d1d"
                stroke="#b91c1c"
                strokeWidth="1.5"
                animate={isDefeated ? {} : { rotate: [0, -25, 10, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "42px 42px" }}
              />
              <motion.path
                d="M 80,60 C 110,40 100,-5 78,42 Z"
                fill="#7f1d1d"
                stroke="#b91c1c"
                strokeWidth="1.5"
                animate={isDefeated ? {} : { rotate: [0, 25, -10, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "78px 42px" }}
              />
            </g>

            {/* Dragon Body & Chest */}
            <ellipse cx="60" cy="74" rx="26" ry="24" fill="#b91c1c" className={isDefeated ? "grayscale opacity-50" : ""} />
            {/* Golden scales chest */}
            {!isDefeated && (
              <path d="M 48,64 Q 60,61 72,64 C 70,80 50,80 48,64 Z" fill="#eb9834" />
            )}

            {/* Dragon Head */}
            <ellipse cx="60" cy="50" rx="25" ry="19" fill="#dc2626" className={isDefeated ? "grayscale opacity-60" : ""} />

            {/* Epic Horns */}
            <path d="M 43,36 Q 25,12 36,10 Q 45,21 48,34 Z" fill="#fbbf24" className={isDefeated ? "grayscale" : ""} />
            <path d="M 77,36 Q 95,12 84,10 Q 75,21 72,34 Z" fill="#fbbf24" className={isDefeated ? "grayscale" : ""} />

            {/* Spikes on Head */}
            <polygon points="60,31 56,22 64,22" fill="#fbbf24" className={isDefeated ? "grayscale" : ""} />

            {/* Face details */}
            <g transform="translate(60, 48)">
              {isDefeated ? (
                knockedOutEyes
              ) : (
                <>
                  {/* Large adorable anime eyes */}
                  <ellipse cx="-11" cy="-2" rx="6" ry="6" fill="#1e293b" />
                  <ellipse cx="11" cy="-2" rx="6" ry="6" fill="#1e293b" />
                  {/* Glowing friendly yellow pupils */}
                  <ellipse cx="-11" cy="-2" rx="3.5" ry="3.5" fill="#facc15" />
                  <ellipse cx="11" cy="-2" rx="3.5" ry="3.5" fill="#facc15" />
                  {/* Shimmer sparkle */}
                  <circle cx="-12.5" cy="-4" r="1.5" fill="#ffffff" />
                  <circle cx="9.5" cy="-4" r="1.5" fill="#ffffff" />
                  <circle cx="-9.5" cy="-1" r="0.7" fill="#ffffff" />
                  <circle cx="12.5" cy="-1" r="0.7" fill="#ffffff" />

                  {/* Cheek Blush */}
                  <ellipse cx="-15" cy="5" rx="4" ry="1.5" fill="#f43f5e" opacity="0.6" />
                  <ellipse cx="15" cy="5" rx="4" ry="1.5" fill="#f43f5e" opacity="0.6" />

                  {/* Cute snout nostril dots */}
                  <circle cx="-3" cy="7" r="1.5" fill="#7f1d1d" />
                  <circle cx="3" cy="7" r="1.5" fill="#7f1d1d" />

                  {/* Fierce but cute little fangs */}
                  <polygon points="-7,11 -5,16 -3,11" fill="#ffffff" />
                  <polygon points="7,11 5,16 3,11" fill="#ffffff" />
                  
                  {/* Content happy smile expression */}
                  <path d="M -7,9 Q 0,14 7,9" stroke="#7f1d1d" strokeWidth="2" fill="none" />
                </>
              )}
            </g>

            {/* Animated cute tiny flame particles if not defeated */}
            {!isDefeated && (
              <g transform="translate(60, 64)">
                <motion.circle
                  cx="0"
                  cy="5"
                  r="4"
                  fill="#f97316"
                  animate={{ y: [0, 10, 15], x: [-3, 3, -1], opacity: [1, 0.8, 0], scale: [1, 1.4, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.circle
                  cx="-5"
                  cy="7"
                  r="3.2"
                  fill="#ef4444"
                  animate={{ y: [0, 8, 12], x: [1, -4, 2], opacity: [1, 0.7, 0], scale: [1, 1.2, 0.4] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: 0.3 }}
                />
                <motion.circle
                  cx="5"
                  cy="7"
                  r="2.5"
                  fill="#eab308"
                  animate={{ y: [0, 9, 14], x: [-2, 2, -2], opacity: [1, 0.9, 0], scale: [1, 1.3, 0.5] }}
                  transition={{ duration: 1.0, repeat: Infinity, delay: 0.6 }}
                />
              </g>
            )}
          </motion.svg>
          {isDefeated && <span className="absolute text-2xl">🔥</span>}
        </div>
      );
  }
}
