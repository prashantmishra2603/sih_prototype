import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export function ComplianceBadge({ status, size = 'md' }) {
  const config = {
    PASS:   { cls: 'badge-pass',   icon: <CheckCircle2 size={12} />, label: 'PASS' },
    FAIL:   { cls: 'badge-fail',   icon: <XCircle size={12} />,      label: 'FAIL' },
    REVIEW: { cls: 'badge-review', icon: <AlertCircle size={12} />,  label: 'REVIEW' },
  };

  const c = config[status] || config.REVIEW;
  return (
    <span className={`badge ${c.cls}`} style={size === 'lg' ? { padding: '5px 14px', fontSize: '0.82rem' } : {}}>
      {c.icon}
      {c.label}
    </span>
  );
}

export function RiskBadge({ risk }) {
  if (!risk) return null;
  const config = {
    LOW:    { cls: 'badge badge-low',    label: '🟢 LOW RISK' },
    MEDIUM: { cls: 'badge badge-medium', label: '🟡 MEDIUM RISK' },
    HIGH:   { cls: 'badge badge-high',   label: '🔴 HIGH RISK' },
  };
  const c = config[risk] || config.LOW;
  return <span className={c.cls}>{c.label}</span>;
}

export function RecommendationBadge({ recommendation }) {
  if (!recommendation) return null;
  const map = {
    'APPROVED':        { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
    'REVIEW REQUIRED': { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
    'REJECTED':        { bg: 'rgba(239,68,68,0.12)',  color: '#f87171', border: 'rgba(239,68,68,0.3)' },
  };

  // fuzzy match
  let style = map['REVIEW REQUIRED'];
  for (const key of Object.keys(map)) {
    if (recommendation.toUpperCase().includes(key.split(' ')[0])) {
      style = map[key];
      break;
    }
  }

  return (
    <span style={{
      padding: '4px 12px',
      borderRadius: '100px',
      fontSize: '0.78rem',
      fontWeight: 700,
      background: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`,
    }}>
      {recommendation}
    </span>
  );
}
