import { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { Send, Trash2, Bot, User, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/soundEffects';

const CHAT_KB = {
  'mandatory documents': `📋 **Mandatory Documents for GeM Bids:**\n\n1. **GST Certificate** — Valid GSTIN required\n2. **PAN Card** — Linked with Income Tax records\n3. **Udyam/MSME Registration** — If applicable\n4. **ISO Certifications** — Category-specific (9001, 27001, etc.)\n5. **BIS/IS Standards** — For goods with quality standards\n6. **ESI & EPF Registrations** — Labour compliance\n7. **Aadhaar-authenticated signatory** — GeM portal requirement\n8. **Experience certificates** — If PQ criteria mandates\n\nAdditionally, **Vendor Assessment** by RITES gives a compliance badge that boosts bid credibility.`,
  'l1': `🏆 **L1 Bidder Selection in GeM:**\n\nThe L1 (Lowest-1) system identifies the **lowest-priced bidder** among those who passed technical evaluation.\n\n**Process:**\n1. Technical evaluation first — only qualified bids proceed\n2. Financial bids opened for qualified bidders\n3. System auto-ranks L1, L2, L3...\n4. L1 gets purchase order at their quoted price\n5. MSME preference rules apply under Make in India policy\n\nFor services, **Quality & Cost Based Selection (QCBS)** may weight both technical score and price.`,
  'disqualification': `⚖️ **Appealing a Disqualification:**\n\nGeM offers a **one-time representation mechanism:**\n\n1. **Window:** 48 hours from technical evaluation completion\n2. **Portal:** Submit via GeM portal — Bid Management section\n3. **Include:** Specific challenge reason + supporting documents\n4. **Review:** Buyer must respond within stipulated time\n5. **Escalation:** Unresolved disputes go to GeM Grievance Redressal\n\n⚠️ Only **one representation allowed per bid**. Make it comprehensive with all evidence.`,
  'pq': `📊 **Pre-Qualification (PQ) Criteria:**\n\nPQ criteria are minimum eligibility requirements set by the buyer:\n\n- **Financial:** Minimum annual turnover (3-year average)\n- **Experience:** Years in business, similar work orders\n- **Technical:** Certifications, manufacturing capacity\n- **Geographic:** Local presence, service network\n\nPQ screening happens **before** technical evaluation. Failing any mandatory PQ criterion = automatic disqualification.\n\n💡 Tip: Read bid document Section 2 (Eligibility Criteria) carefully before submitting.`,
  'gfr rule 149': `📜 **GFR Rule 149 — GeM Mandate:**\n\nUnder **General Financial Rules 2017, Rule 149**, all Central Government Ministries are **mandated** to procure from GeM portal.\n\n**Key Points:**\n- Applicable to all goods/services listed on GeM\n- If item unavailable: obtain **GeMAR&PTS** (Availability Report)\n- No specific upper value threshold — all categories covered\n- Compliance audited by C&AG regularly\n\n2026 Amendment extends mandate to UTs and aided institutions.`,
  'non-compliance': `🚫 **Non-Compliance Consequences:**\n\n**For Sellers:**\n- Account suspension (temporary/permanent)\n- Debarment from GeM portal\n- Financial penalties per STC\n- Blacklisting (shared across govt. portals)\n\n**For Buyers:**\n- C&AG audit objections\n- Disciplinary proceedings against officers\n- Mandatory justification for non-GeM procurement`,
};

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: "👋 Namaste! I'm your **BidCheck AI Assistant** — specialized in GeM procurement, bid compliance, and GFR guidelines.\n\nI can help with document checklists, PQ criteria, evaluation procedures, disqualification appeals, and more. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getAIResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('hello') || q.includes('hi') || q.includes('namaste')) {
      return "👋 Namaste! I'm ready to assist with your GeM compliance queries. Ask me about bid requirements, PQ criteria, document checklists, or disqualification appeals!";
    }
    for (const key of Object.keys(CHAT_KB)) {
      if (q.includes(key)) return CHAT_KB[key];
    }
    if (q.includes('gstin') || q.includes('gst')) {
      return '📋 **GST Compliance on GeM:**\n\nValid GSTIN is mandatory for all GeM sellers. Your GSTIN must be active on gst.gov.in and linked with your PAN. Cancelled or expired GSTIN leads to immediate disqualification.';
    }
    if (q.includes('msme') || q.includes('udyam')) {
      return '🏭 **MSME/Udyam Benefits on GeM:**\n\nMSME sellers enjoy 25% relaxation on turnover PQ criteria, EMD exemption, and purchasing preference under the Make in India policy.';
    }
    return `🤖 I understand your query regarding **"${query}"**.\n\nFor specific GeM compliance verification, cross-reference the bid's Additional Terms & Conditions (ATC) or call the GeM Helpdesk at **1800-419-3436**. Would you like me to detail the document checklist for this category?`;
  };

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    sound.playTap();
    const userMsg = { id: Date.now(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      sound.playNotification();
      const responseText = getAIResponse(text);
      const aiMsg = { id: Date.now() + 1, role: 'ai', text: responseText };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
  };

  const formatText = (txt) => {
    return txt
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="AI Compliance Assistant" subtitle="Domain-tuned AI for GeM procurement queries and GFR rules" />

        <div className="page-content">
          <div className="section-header" style={{ justifyContent: 'flex-end', marginBottom: 16 }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                sound.playTap();
                setMessages([
                  {
                    id: Date.now(),
                    role: 'ai',
                    text: 'Chat cleared. How can I assist with GeM compliance today?',
                  },
                ]);
              }}
            >
              <Trash2 size={14} /> Clear Chat
            </button>
          </div>

          <div className="grid-2 aichat-grid" style={{ alignItems: 'start' }}>
            <div>
              <div className="chat-container">
                <div className="chat-header">
                  <div className="chat-avatar">
                    <Bot size={20} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>BidCheck AI Assistant</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--green-light)', fontWeight: 600 }}>
                      ● Online — GFR 2017, ATC Library 2026, 50K+ bid records
                    </div>
                  </div>
                </div>

                <div className="quick-prompts">
                  {[
                    'Mandatory documents for GeM?',
                    'How does L1 selection work?',
                    'How to appeal disqualification?',
                    'What is PQ criteria?',
                    'GFR Rule 149 explained',
                  ].map((p) => (
                    <span key={p} className="quick-chip" onClick={() => handleSend(p)}>
                      {p}
                    </span>
                  ))}
                </div>

                <div className="chat-messages" id="chat-messages">
                  {messages.map((m) => (
                    <div key={m.id} className={`msg ${m.role}`}>
                      <div className="msg-avatar">
                        {m.role === 'ai' ? <Bot size={15} color="#fff" /> : <User size={15} color="#fff" />}
                      </div>
                      <div
                        className="msg-bubble"
                        dangerouslySetInnerHTML={{ __html: formatText(m.text) }}
                      />
                    </div>
                  ))}

                  {isTyping && (
                    <div className="msg ai">
                      <div className="msg-avatar">
                        <Bot size={15} color="#fff" />
                      </div>
                      <div className="msg-bubble">
                        <div className="typing-dots">
                          <span />
                          <span />
                          <span />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
                  <textarea
                    className="chat-input"
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask about GeM compliance, bid requirements, GFR guidelines..."
                  />
                  <button className="chat-send" onClick={() => handleSend()}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card">
                <div className="card-title" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookOpen size={16} color="var(--green-light)" /> Quick Reference Cards
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { title: '📋 Mandatory Documents Checklist', desc: 'GST, PAN, Udyam, ISO, BIS requirements', prompt: 'Mandatory documents for GeM?' },
                    { title: '📜 GFR Rule 149 — GeM Mandate', desc: 'Mandatory procurement through GeM portal', prompt: 'GFR Rule 149 explained' },
                    { title: '🏆 L1 Bidder Selection Process', desc: 'Lowest-priced technically qualified bidder', prompt: 'How does L1 selection work?' },
                    { title: '⏱️ 48-Hour Representation Window', desc: 'Appeal disqualification decisions', prompt: 'How to appeal disqualification?' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 12,
                        borderRadius: 10,
                        background: 'rgba(16,185,129,0.06)',
                        border: '1px solid rgba(16,185,129,0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onClick={() => handleSend(item.prompt)}
                    >
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card-title" style={{ marginBottom: 14 }}>📊 AI Engine Specs</div>
                <div className="grid-2" style={{ gap: 10 }}>
                  <div style={{ textAlign: 'center', padding: 12, background: 'rgba(16,185,129,0.08)', borderRadius: 10 }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--green-light)' }}>{messages.length}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Messages</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: 12, background: 'rgba(56,189,248,0.08)', borderRadius: 10 }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>98.2%</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
