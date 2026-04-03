import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import studentImg from 'figma:asset/8794f3f41a45b4e8ad6ce8671738dca0ad0136ea.png';

// ─── Color Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: '#000000',
  card: '#181818',
  card2: '#1F1F1F',
  lime: '#A8E636',
  lime2: '#C5F243',
  limeDark: '#7ED321',
  gray: '#B0B0B0',
  grayDark: '#3A3A3A',
  white: '#FFFFFF',
  purple: '#9D4EDD',
  pink: '#FF6B6B',
};

// ─── Reusable Glow Box ────────────────────────────────────────────────────────
const Card = ({
  children,
  style = {},
  onClick,
  hover = true,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  hover?: boolean;
}) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      onClick={onClick}
      onHoverStart={() => hover && setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileTap={hover ? { scale: 0.97 } : {}}
      animate={{ y: hov ? -3 : 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        background: C.card,
        borderRadius: 20,
        border: hov ? `1px solid rgba(168,230,54,0.35)` : '1px solid rgba(255,255,255,0.06)',
        boxShadow: hov
          ? '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(168,230,54,0.1)'
          : '0 2px 16px rgba(0,0,0,0.5)',
        transition: 'border 0.2s, box-shadow 0.2s',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

// Book with lime spine
const IconBook = ({ limeColor = C.lime }: { limeColor?: string }) => (
  <svg viewBox="0 0 40 40" width={40} height={40}>
    <defs>
      <linearGradient id="bkgrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
        <stop offset="100%" stopColor="rgba(200,200,200,0.7)" />
      </linearGradient>
      <filter id="bkshadow"><feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.4)" /></filter>
    </defs>
    <rect x="7" y="5" width="26" height="33" rx="3" fill="url(#bkgrad)" filter="url(#bkshadow)" />
    <rect x="7" y="5" width="5" height="33" rx="2" fill={limeColor} />
    <rect x="14" y="11" width="14" height="2" rx="1" fill="rgba(0,0,0,0.2)" />
    <rect x="14" y="16" width="10" height="2" rx="1" fill="rgba(0,0,0,0.15)" />
    <rect x="14" y="21" width="12" height="2" rx="1" fill="rgba(0,0,0,0.15)" />
    <rect x="14" y="26" width="8" height="2" rx="1" fill="rgba(0,0,0,0.1)" />
    {/* Shine */}
    <rect x="7" y="5" width="4" height="33" rx="2" fill="rgba(255,255,255,0.15)" />
  </svg>
);

// Arrow indicator
const IconArrowUp = () => (
  <svg viewBox="0 0 20 20" width={20} height={20}>
    <circle cx="10" cy="10" r="10" fill={C.lime} />
    <path d="M 10 14 L 10 7 M 7 10 L 10 7 L 13 10" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);
const IconArrowDown = () => (
  <svg viewBox="0 0 20 20" width={20} height={20}>
    <circle cx="10" cy="10" r="10" fill={C.lime} />
    <path d="M 10 6 L 10 13 M 7 10 L 10 13 L 13 10" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// Heart
const IconHeart = () => (
  <svg viewBox="0 0 40 40" width={40} height={40}>
    <defs>
      <linearGradient id="hrtg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={C.lime} />
        <stop offset="100%" stopColor={C.limeDark} />
      </linearGradient>
      <filter id="hrtshadow"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(168,230,54,0.4)" /></filter>
    </defs>
    <path d="M 20 34 L 6 21 C 1 14 5 6 11 6 C 15 6 18 9 20 11 C 22 9 25 6 29 6 C 35 6 39 14 34 21 Z"
      fill="url(#hrtg)" filter="url(#hrtshadow)" />
    <path d="M 11 12 Q 11 9 14 9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// Sell (book + up arrow)
const IconSell = () => (
  <div style={{ position: 'relative', width: 40, height: 40 }}>
    <IconBook />
    <div style={{ position: 'absolute', bottom: -2, right: -4 }}>
      <IconArrowUp />
    </div>
  </div>
);

// Buy (book + down arrow)
const IconBuy = () => (
  <div style={{ position: 'relative', width: 40, height: 40 }}>
    <IconBook limeColor="#60a8ff" />
    <div style={{ position: 'absolute', bottom: -2, right: -4 }}>
      <IconArrowDown />
    </div>
  </div>
);

// Publish
const IconPublish = () => (
  <svg viewBox="0 0 40 40" width={40} height={40}>
    <defs>
      <filter id="pubsh"><feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.4)" /></filter>
    </defs>
    <rect x="5" y="7" width="22" height="28" rx="3" fill="white" filter="url(#pubsh)" opacity={0.9} />
    <rect x="5" y="7" width="5" height="28" rx="2" fill={C.lime} />
    <rect x="12" y="13" width="11" height="2" rx="1" fill="rgba(0,0,0,0.2)" />
    <rect x="12" y="18" width="8" height="2" rx="1" fill="rgba(0,0,0,0.15)" />
    <circle cx="31" cy="13" r="9" fill={C.lime} />
    <path d="M 31 18 L 31 9 M 27 13 L 31 9 L 35 13" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <line x1="27" y1="17" x2="35" y2="17" stroke="black" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ─── Nav Icons ────────────────────────────────────────────────────────────────
const NavHome = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 28 28" width={24} height={24}>
    <path d="M 14 3 L 2 13 L 5 13 L 5 25 L 11 25 L 11 18 L 17 18 L 17 25 L 23 25 L 23 13 L 26 13 Z"
      fill={active ? C.lime : 'none'}
      stroke={active ? C.lime : 'rgba(255,255,255,0.5)'}
      strokeWidth={active ? 0 : 1.5}
      strokeLinejoin="round"
    />
  </svg>
);
const NavBook = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 28 28" width={24} height={24}>
    <rect x="4" y="4" width="14" height="20" rx="2" fill={active ? 'rgba(168,230,54,0.2)' : 'none'} stroke={active ? C.lime : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" />
    <rect x="4" y="4" width="3" height="20" rx="1.5" fill={active ? C.lime : 'rgba(255,255,255,0.5)'} />
    <rect x="9" y="9" width="7" height="1.5" rx="0.75" fill={active ? C.lime : 'rgba(255,255,255,0.4)'} />
    <rect x="9" y="13" width="5" height="1.5" rx="0.75" fill={active ? C.lime : 'rgba(255,255,255,0.4)'} />
    <rect x="20" y="5" width="3" height="20" rx="1.5" fill={active ? 'rgba(168,230,54,0.5)' : 'rgba(255,255,255,0.25)'} />
  </svg>
);
const NavCart = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 28 28" width={24} height={24}>
    <path d="M 3 5 L 7 5 L 10.5 19 L 22 19 L 25 9 L 9 9" stroke={active ? C.lime : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="11.5" cy="23" r="2" fill={active ? C.lime : 'rgba(255,255,255,0.5)'} />
    <circle cx="21" cy="23" r="2" fill={active ? C.lime : 'rgba(255,255,255,0.5)'} />
  </svg>
);
const NavUser = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 28 28" width={24} height={24}>
    <circle cx="14" cy="10" r="5.5" fill={active ? 'rgba(168,230,54,0.2)' : 'none'} stroke={active ? C.lime : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" />
    <path d="M 4 24 C 4 17 24 17 24 24" stroke={active ? C.lime : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" fill={active ? 'rgba(168,230,54,0.08)' : 'none'} strokeLinecap="round" />
  </svg>
);

// ─── Animated Progress ────────────────────────────────────────────────────────
const ProgressBar = ({ pct }: { pct: number }) => {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 500);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div style={{ position: 'relative', height: 8, background: '#2D2D2D', borderRadius: 4, overflow: 'hidden' }}>
      <motion.div
        animate={{ width: `${w}%` }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          borderRadius: 4,
          background: `linear-gradient(90deg, ${C.lime}, ${C.lime2})`,
        }}
      >
        {/* Glow tip */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', right: 0, top: -4, bottom: -4, width: 16,
            background: `radial-gradient(circle, ${C.lime2} 0%, transparent 70%)`,
            filter: 'blur(2px)',
          }}
        />
      </motion.div>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  icon, value, label, suffix = '',
}: {
  icon: React.ReactNode; value: string; label: string; suffix?: string;
}) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileTap={{ scale: 1.02 }}
      animate={{ y: hov ? -4 : 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        flex: 1,
        background: C.card,
        borderRadius: 18,
        padding: '18px 10px 14px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        border: hov ? `1px solid rgba(168,230,54,0.4)` : '1px solid rgba(255,255,255,0.05)',
        boxShadow: hov
          ? '0 12px 30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)'
          : '0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        transition: 'border 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
    >
      <motion.div
        animate={{ rotate: hov ? 15 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {icon}
      </motion.div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <span style={{
          fontSize: 32, fontWeight: 900, color: C.lime,
          fontFamily: 'Inter, sans-serif', lineHeight: 1,
        }}>{value}</span>
        {suffix && <span style={{ fontSize: 13, color: C.lime, fontWeight: 600 }}>{suffix}</span>}
      </div>
      <span style={{ fontSize: 12, color: C.gray, fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>
        {label}
      </span>
    </motion.div>
  );
};

// ─── Function Entry Card ──────────────────────────────────────────────────────
const FuncCard = ({
  icon, label, badge,
}: {
  icon: React.ReactNode; label: string; badge?: number;
}) => {
  const [pressed, setPressed] = useState(false);
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onTapStart={() => setPressed(true)}
      onTap={() => setTimeout(() => setPressed(false), 250)}
      style={{
        flex: '1 1 calc(50% - 6px)',
        background: C.card,
        borderRadius: 18,
        padding: '22px 14px 18px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)',
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Subtle top shine */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
      }} />
      <motion.div
        animate={{ y: pressed ? -4 : 0, filter: pressed ? 'brightness(1.3)' : 'brightness(1)' }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {icon}
      </motion.div>
      <span style={{
        fontSize: 14, color: C.gray, fontWeight: 400,
        fontFamily: 'Inter, sans-serif',
      }}>{label}</span>
      {badge !== undefined && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: C.lime, color: '#000',
          fontSize: 11, fontWeight: 800,
          width: 20, height: 20, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 8px rgba(168,230,54,0.5)',
        }}>{badge}</div>
      )}
    </motion.div>
  );
};

// ─── Menu Row ─────────────────────────────────────────────────────────────────
const MenuRow = ({
  icon, label, value, last = false,
}: {
  icon: React.ReactNode; label: string; value?: string; last?: boolean;
}) => (
  <motion.div
    whileTap={{ backgroundColor: 'rgba(168,230,54,0.04)' }}
    style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '15px 20px',
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.04)',
      cursor: 'pointer',
    }}
  >
    <div style={{
      width: 38, height: 38,
      background: 'rgba(168,230,54,0.08)',
      borderRadius: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid rgba(168,230,54,0.12)',
      flexShrink: 0,
    }}>{icon}</div>
    <div style={{ flex: 1, fontSize: 15, color: '#DDD', fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
      {label}
    </div>
    {value && (
      <span style={{ fontSize: 13, color: C.lime, fontWeight: 600, marginRight: 4 }}>{value}</span>
    )}
    <svg viewBox="0 0 16 16" width="14" height="14">
      <path d="M 6 3 L 11 8 L 6 13" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  </motion.div>
);

// ─── Bottom Nav Item ──────────────────────────────────────────────────────────
const NavItem = ({
  icon, label, active, onClick,
}: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void;
}) => (
  <motion.div
    onClick={onClick}
    whileTap={{ y: -4 }}
    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
    style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      cursor: 'pointer', paddingBottom: 4,
    }}
  >
    {icon}
    <span style={{
      fontSize: 11, color: active ? C.lime : '#666',
      fontFamily: 'Inter, sans-serif', fontWeight: active ? 600 : 400,
      transition: 'color 0.2s',
    }}>{label}</span>
  </motion.div>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState(4);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '20px 0',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      {/* ── Phone Shell ── */}
      <div style={{
        width: 390, height: 844,
        background: C.bg,
        borderRadius: 50,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        boxShadow: [
          '0 0 0 1.5px #2a2a2a',
          '0 0 0 3px #111',
          '0 0 80px rgba(0,0,0,0.9)',
          '0 30px 100px rgba(0,0,0,0.6)',
        ].join(', '),
      }}>
        {/* Status Bar */}
        <div style={{
          height: 48, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 26px', background: 'transparent',
        }}>
          <span style={{ color: 'white', fontSize: 15, fontWeight: 700 }}>9:41</span>
          <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
            {/* Signal */}
            <svg width="18" height="12" viewBox="0 0 18 12">
              {[0,1,2,3].map((i) => (
                <rect key={i} x={i * 4.5} y={12 - (i + 1) * 3} width="3" height={(i + 1) * 3} rx="1" fill="white" opacity={i < 3 ? 1 : 0.4} />
              ))}
            </svg>
            {/* Wifi */}
            <svg width="16" height="12" viewBox="0 0 16 12">
              <path d="M 8 10 L 15.5 3.5 C 12 0.5 4 0.5 0.5 3.5 Z" fill="white" />
              <path d="M 8 10 L 13 5.5 C 11 3.5 5 3.5 3 5.5 Z" fill="white" />
              <path d="M 8 10 L 10.5 7.5 C 9.5 6.5 6.5 6.5 5.5 7.5 Z" fill="white" />
              <circle cx="8" cy="10.5" r="1.5" fill="white" />
            </svg>
            {/* Battery */}
            <svg width="27" height="14" viewBox="0 0 27 14">
              <rect x="0" y="1.5" width="24" height="11" rx="3" fill="none" stroke="white" strokeWidth="1.2" />
              <rect x="24.5" y="4.5" width="2" height="5" rx="1" fill="white" />
              <rect x="1.5" y="3" width="16" height="8" rx="2" fill="white" />
            </svg>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          scrollbarWidth: 'none', paddingBottom: 90,
        }}>
          {/* ── Hero Banner ── */}
          <div style={{
            margin: '4px 16px 0',
            borderRadius: 26,
            background: 'linear-gradient(135deg, #6BBF00 0%, #A8E636 45%, #C5F243 100%)',
            position: 'relative',
            overflow: 'hidden',
            height: 180,
          }}>
            {/* BG decoration circles */}
            <div style={{
              position: 'absolute', right: -40, top: -40,
              width: 200, height: 200, borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
            }} />
            <div style={{
              position: 'absolute', left: -20, bottom: -30,
              width: 120, height: 120, borderRadius: '50%',
              background: 'rgba(0,0,0,0.08)',
            }} />

            {/* Text */}
            <div style={{ position: 'relative', zIndex: 2, padding: '24px 20px 0' }}>
              <p style={{
                margin: 0, fontSize: 13, color: 'rgba(0,0,0,0.55)',
                fontWeight: 500, letterSpacing: 0.3,
              }}>欢迎回来，书友 👋</p>
              <h2 style={{
                margin: '4px 0 14px', fontSize: 24, fontWeight: 900,
                color: '#000', lineHeight: 1.25, letterSpacing: '-0.5px',
              }}>今天淘哪本好书？</h2>
              <motion.button
                whileTap={{ scale: 0.94 }}
                style={{
                  background: '#000', color: 'white', border: 'none',
                  borderRadius: 50, padding: '9px 20px',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 7,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                }}
              >
                <span style={{ fontSize: 12 }}>▶</span> 去逛逛
              </motion.button>
            </div>

            {/* Character image */}
            <img
              src={studentImg}
              alt="student"
              style={{
                position: 'absolute', right: -10, bottom: 0,
                height: 175, width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))',
                zIndex: 3,
              }}
            />
          </div>

          {/* ── Stats ── */}
          <div style={{ display: 'flex', gap: 10, margin: '14px 16px 0' }}>
            <StatCard icon={<IconSell />} value="12" label="已卖出" />
            <StatCard icon={<IconBuy />} value="8" label="已买到" />
            <StatCard icon={<IconHeart />} value="15" label="已收藏" />
          </div>

          {/* ── Reading Goal ── */}
          <div style={{ margin: '14px 16px 0' }}>
            <Card hover={false} style={{ padding: 20 }}>
              {/* Top shine */}
              <div style={{
                position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
                borderRadius: 1,
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: '#555', fontWeight: 500, letterSpacing: 0.5 }}>TODAY</p>
                  <h3 style={{ margin: '2px 0 0', fontSize: 17, fontWeight: 800, color: C.white }}>
                    今日阅读目标
                  </h3>
                </div>
                <div style={{
                  background: 'rgba(168,230,54,0.12)',
                  border: `1px solid rgba(168,230,54,0.25)`,
                  borderRadius: 30, padding: '6px 14px',
                }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color: C.lime }}>75%</span>
                </div>
              </div>

              <ProgressBar pct={75} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.lime }} />
                  <span style={{ fontSize: 13, color: '#888' }}>已完成 <span style={{ color: '#bbb' }}>4/5 本</span></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#333' }} />
                  <span style={{ fontSize: 13, color: '#888' }}>未完成 <span style={{ color: C.lime }}>做笔记</span></span>
                </div>
              </div>
            </Card>
          </div>

          {/* ── Function Grid ── */}
          <div style={{ margin: '14px 16px 0' }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <FuncCard icon={<IconSell />} label="我卖出的" badge={12} />
              <FuncCard icon={<IconBuy />} label="我买到的" badge={8} />
              <FuncCard icon={<IconPublish />} label="我的发布" badge={5} />
              <FuncCard icon={<IconHeart />} label="我的收藏" badge={15} />
            </div>
          </div>

          {/* ── Profile Card ── */}
          <div style={{ margin: '14px 16px 0' }}>
            <Card hover={false} style={{ overflow: 'hidden' }}>
              {/* Profile top */}
              <div style={{
                padding: '20px 20px 16px',
                display: 'flex', alignItems: 'center', gap: 14,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                {/* Avatar */}
                <div style={{
                  width: 56, height: 56, borderRadius: 28, flexShrink: 0,
                  background: 'linear-gradient(135deg, #333 0%, #555 100%)',
                  border: `2px solid ${C.lime}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 16px rgba(168,230,54,0.25)`,
                  overflow: 'hidden',
                }}>
                  <svg viewBox="0 0 56 56" width="56" height="56">
                    <circle cx="28" cy="20" r="11" fill="#FDBCB4" />
                    <ellipse cx="28" cy="10" rx="12" ry="7" fill="#2D1B00" />
                    <path d="M 8 52 C 8 34 48 34 48 52" fill="#444" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 4 }}>张小书</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {/* Stars */}
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} viewBox="0 0 12 12" width="11" height="11">
                        <path d="M 6 0 L 7.5 4.5 L 12 4.5 L 8.5 7 L 9.8 12 L 6 9.2 L 2.2 12 L 3.5 7 L 0 4.5 L 4.5 4.5 Z"
                          fill={i <= 4 ? '#FFD700' : '#333'} />
                      </svg>
                    ))}
                    <span style={{ fontSize: 12, color: '#FFD700', fontWeight: 700 }}>4.8</span>
                  </div>
                </div>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: 36, height: 36, borderRadius: 12,
                    background: 'rgba(168,230,54,0.1)',
                    border: '1px solid rgba(168,230,54,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <svg viewBox="0 0 20 20" width="16" height="16">
                    <path d="M 3 15 V 18 H 6 L 16 8 L 13 5 Z" fill={C.lime} />
                    <path d="M 18.7 5.3 A 1 1 0 0 0 18.7 3.9 L 16.1 1.3 A 1 1 0 0 0 14.7 1.3 L 13 3 L 16.5 6.5 Z" fill={C.lime} />
                  </svg>
                </motion.div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {[
                  { v: '12', l: '已卖出' },
                  { v: '8', l: '已买到' },
                  { v: '15', l: '收藏' },
                  { v: '4.8', l: '好评' },
                ].map((item, i, arr) => (
                  <div key={i} style={{
                    flex: 1, padding: '14px 0', textAlign: 'center',
                    borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: C.lime }}>{item.v}</div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{item.l}</div>
                  </div>
                ))}
              </div>

              {/* Menu items */}
              <MenuRow
                icon={
                  <svg viewBox="0 0 20 20" width="18" height="18">
                    <circle cx="10" cy="7" r="4.5" fill="none" stroke={C.lime} strokeWidth="1.8" />
                    <path d="M 2 18 C 2 12 18 12 18 18" stroke={C.lime} strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  </svg>
                }
                label="个人资料"
              />
              <MenuRow
                icon={
                  <svg viewBox="0 0 20 20" width="18" height="18">
                    <circle cx="10" cy="8" r="3.5" fill="none" stroke={C.lime} strokeWidth="1.8" />
                    <path d="M 10 1 C 5.5 1 3 4.5 3 8 C 3 13 10 19 10 19 C 10 19 17 13 17 8 C 17 4.5 14.5 1 10 1 Z" fill="none" stroke={C.lime} strokeWidth="1.8" />
                  </svg>
                }
                label="收货地址"
                value="3 个"
              />
              <MenuRow
                icon={
                  <svg viewBox="0 0 20 20" width="18" height="18">
                    <circle cx="10" cy="10" r="9" fill="none" stroke={C.lime} strokeWidth="1.8" />
                    <path d="M 7.5 8 C 7.5 6 8.5 5 10 5 C 11.5 5 12.5 6 12.5 7.5 C 12.5 9.5 10 10.5 10 12" stroke={C.lime} strokeWidth="1.8" strokeLinecap="round" fill="none" />
                    <circle cx="10" cy="15" r="1.2" fill={C.lime} />
                  </svg>
                }
                label="帮助中心"
              />
              <MenuRow
                icon={
                  <svg viewBox="0 0 20 20" width="18" height="18">
                    <circle cx="10" cy="10" r="3" fill="none" stroke={C.lime} strokeWidth="1.8" />
                    <path d="M 10 1 L 10 4 M 10 16 L 10 19 M 1 10 L 4 10 M 16 10 L 19 10 M 3.2 3.2 L 5.3 5.3 M 14.7 14.7 L 16.8 16.8 M 16.8 3.2 L 14.7 5.3 M 5.3 14.7 L 3.2 16.8"
                      stroke={C.lime} strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                }
                label="设置"
                last
              />
            </Card>
          </div>

          {/* ── WeChat Login ── */}
          <div style={{ margin: '14px 16px 0' }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '16px',
                background: 'transparent',
                border: `1.5px solid rgba(168,230,54,0.3)`,
                borderRadius: 50,
                color: C.lime, fontSize: 15, fontWeight: 600,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                backdropFilter: 'blur(8px)',
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill={C.lime}>
                <path d="M 8.5 11 C 7.7 11 7 10.3 7 9.5 S 7.7 8 8.5 8 S 10 8.7 10 9.5 S 9.3 11 8.5 11 Z M 15.5 11 C 14.7 11 14 10.3 14 9.5 S 14.7 8 15.5 8 S 17 8.7 17 9.5 S 16.3 11 15.5 11 Z M 12 2 C 6.5 2 2 5.8 2 10.5 C 2 13.3 3.6 15.8 6 17.4 L 6 22 L 10 19.8 C 10.6 19.9 11.3 20 12 20 C 17.5 20 22 16.2 22 11.5 C 22 6.5 17.5 2 12 2 Z" />
              </svg>
              微信一键登录
            </motion.button>
          </div>

          {/* bottom spacing */}
          <div style={{ height: 20 }} />
        </div>

        {/* ── Bottom Nav ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 82,
          background: 'rgba(10,10,10,0.96)',
          backdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', paddingBottom: 8,
        }}>
          <NavItem icon={<NavHome active={activeTab === 0} />} label="首页" active={activeTab === 0} onClick={() => setActiveTab(0)} />
          <NavItem icon={<NavBook active={activeTab === 1} />} label="书城" active={activeTab === 1} onClick={() => setActiveTab(1)} />

          {/* Core CTA */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', paddingBottom: 10 }}>
            <motion.button
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              style={{
                width: 60, height: 60, borderRadius: 30,
                background: 'linear-gradient(135deg, #9D4EDD 0%, #FF6B6B 100%)',
                border: '3px solid #111',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 24px rgba(157,78,221,0.45), 0 0 50px rgba(255,107,107,0.15), 0 8px 20px rgba(0,0,0,0.5)',
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                <polygon points="6,4 20,12 6,20" />
              </svg>
            </motion.button>
          </div>

          <NavItem icon={<NavCart active={activeTab === 3} />} label="购物车" active={activeTab === 3} onClick={() => setActiveTab(3)} />
          <NavItem icon={<NavUser active={activeTab === 4} />} label="我的" active={activeTab === 4} onClick={() => setActiveTab(4)} />
        </div>
      </div>
    </div>
  );
}
