import { useEffect, useState } from 'react';

export function ScoreRing({ score, size = 120, strokeWidth = 10, label }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const step = score / 40;
      const interval = setInterval(() => {
        start += step;
        if (start >= score) { setDisplayScore(score); clearInterval(interval); }
        else setDisplayScore(Math.floor(start));
      }, 20);
      return () => clearInterval(interval);
    }, 200);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayScore / 100) * circumference;
  const dashOffset = circumference - progress;

  const getColor = (s) => {
    if (s >= 80) return '#10b981';
    if (s >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const color = getColor(score);

  return (
    <div className="score-ring-wrapper">
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 6px ${color}66)` }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: size > 100 ? '1.6rem' : '1.1rem',
            fontWeight: 800,
            color,
            lineHeight: 1,
          }}>{displayScore}%</span>
        </div>
      </div>
      {label && <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{label}</span>}
    </div>
  );
}
