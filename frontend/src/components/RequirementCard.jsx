import { useState } from 'react';
import { ComplianceBadge } from './Badges';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

export function RequirementCard({ req, analysis }) {
  const [expanded, setExpanded] = useState(false);

  const statusClass = analysis?.status?.toLowerCase() || 'review';

  return (
    <div className={`req-card ${statusClass}`}>
      <div className="req-header">
        <div>
          <div className="req-title">{req?.title || analysis?.req_title}</div>
          <div className="req-category">{req?.category || analysis?.req_category}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ComplianceBadge status={analysis?.status || 'REVIEW'} />
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 8 }}>
        <div>
          <div className="evidence-label">Required</div>
          <div className="evidence-value" style={{ color: 'var(--text-primary)' }}>
            {analysis?.required_value || req?.required_value || '—'}
          </div>
        </div>
        {analysis?.found_value && (
          <div>
            <div className="evidence-label">Found</div>
            <div className="evidence-value" style={{
              color: analysis.status === 'PASS' ? 'var(--green-light)'
                : analysis.status === 'FAIL' ? 'var(--red-light)'
                : '#fbbf24'
            }}>
              {analysis.found_value}
            </div>
          </div>
        )}
      </div>

      {expanded && (
        <div>
          <div className="evidence-box">
            <div className="evidence-label">AI Analysis</div>
            <div className="evidence-value">{analysis?.reason || 'No analysis available.'}</div>
            {analysis?.evidence_doc && (
              <div className="evidence-doc">
                <FileText size={12} />
                <span>{analysis.evidence_doc}</span>
                {analysis.evidence_page && (
                  <span style={{
                    background: 'rgba(59,130,246,0.15)',
                    color: 'var(--blue-light)',
                    padding: '1px 6px',
                    borderRadius: 4,
                    fontSize: '0.72rem',
                  }}>
                    Page {analysis.evidence_page}
                  </span>
                )}
              </div>
            )}
          </div>
          {analysis?.risk && (
            <div style={{
              marginTop: 8,
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: '0.78rem',
              background: analysis.risk === 'HIGH'
                ? 'rgba(239,68,68,0.08)' : analysis.risk === 'MEDIUM'
                ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)',
              color: analysis.risk === 'HIGH'
                ? 'var(--red-light)' : analysis.risk === 'MEDIUM'
                ? '#fbbf24' : 'var(--green-light)',
            }}>
              ⚠️ Risk: {analysis.risk}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
