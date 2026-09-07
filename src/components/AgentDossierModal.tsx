import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentAvatar } from './AgentAvatar';
import { CountUpNumber } from './CountUpNumber';
import type { AgentEntity } from '../data/agentDatabase';

interface AgentDossierModalProps {
  agent: AgentEntity | null;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const AgentDossierModal: React.FC<AgentDossierModalProps> = ({
  agent,
  onClose,
  onNavigate
}) => {
  const [copied, setCopied] = useState(false);

  if (!agent) return null;

  const handleCopyContract = () => {
    if (agent.contract) {
      navigator.clipboard.writeText(agent.contract);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const keyRatingStars = agent.keyCount === 3 ? '★★★' : agent.keyCount === 2 ? '★★☆' : '★☆☆';
  const keyRatingLabel = agent.keyCount === 3
    ? 'Three Keys · Benchmark Grade'
    : agent.keyCount === 2
    ? 'Two Keys · Exemplary'
    : 'One Key · Notable';

  return (
    <AnimatePresence>
      <motion.div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(9, 9, 7, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          style={{
            background: '#0d0d0a',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '28px',
            padding: 'clamp(20px, 4vw, 36px)',
            width: 'min(680px, calc(100vw - 32px))',
            maxHeight: '88vh',
            overflowY: 'auto',
            position: 'relative',
            color: '#ffffff',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.6)'
          }}
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        >
          {/* Close button */}
          <button
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              color: '#ffffff',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s'
            }}
            onClick={onClose}
            aria-label="Close dossier"
          >
            ✕
          </button>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px', paddingRight: '40px' }}>
            <AgentAvatar agent={agent} size={64} style={{ border: '2px solid rgba(215, 249, 0, 0.4)' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                  {agent.name}
                </h2>
                <span
                  style={{
                    background: 'var(--lime)',
                    color: '#0d0d0a',
                    fontWeight: 900,
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    letterSpacing: '0.04em'
                  }}
                >
                  #{agent.rank}
                </span>
              </div>
              <div style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>{agent.chain}</span>
                <span>·</span>
                <span>{agent.category}</span>
                <span>·</span>
                <span style={{ color: 'var(--lime)', fontWeight: 800 }}>{keyRatingStars} {keyRatingLabel}</span>
              </div>
            </div>
          </div>

          {/* Tagline Blurb */}
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px', fontStyle: 'italic', background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: '12px', borderLeft: '3px solid var(--lime)' }}>
            "{agent.blurb}"
          </p>

          {/* Score & Market Trend Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: '#141410', padding: '20px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '24px' }}>
            <div>
              <div style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em' }}>
                FORGES TRUST SCORE
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--lime)', lineHeight: 1.1, marginTop: '4px' }}>
                <CountUpNumber to={agent.score} decimals={1} duration={1.5} /> <small style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 600 }}>/ 100</small>
              </div>
            </div>

            <div>
              <div style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em' }}>
                7D MOMENTUM
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '4px' }} className={agent.delta7d.startsWith('+') ? 'up' : 'down'}>
                {agent.delta7d}
              </div>
            </div>

            <div>
              <div style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em' }}>
                AUDIT MEMORY
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>
                {agent.daysIndexed} Days Active
              </div>
            </div>
          </div>

          {/* The 4 Weighted Audit Criteria Breakdown */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--lime)', marginBottom: '16px' }}>
              Four Weighted Audit Signal Criteria
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#141410', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 700 }}>Disclosure (30%)</span>
                  <b style={{ color: 'var(--lime)' }}>{agent.disclosureScore || 90} / 100</b>
                </div>
                <div className="bar" style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)' }}>
                  <i style={{ width: `${agent.disclosureScore || 90}%`, background: 'var(--lime)' }}></i>
                </div>
              </div>

              <div style={{ background: '#141410', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 700 }}>On-Chain Telemetry (35%)</span>
                  <b style={{ color: 'var(--lime)' }}>{agent.consistencyScore || 92} / 100</b>
                </div>
                <div className="bar" style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)' }}>
                  <i style={{ width: `${agent.consistencyScore || 92}%`, background: 'var(--lime)' }}></i>
                </div>
              </div>

              <div style={{ background: '#141410', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 700 }}>Incident Recovery (20%)</span>
                  <b style={{ color: 'var(--lime)' }}>{agent.incidentScore || 88} / 100</b>
                </div>
                <div className="bar" style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)' }}>
                  <i style={{ width: `${agent.incidentScore || 88}%`, background: 'var(--lime)' }}></i>
                </div>
              </div>

              <div style={{ background: '#141410', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 700 }}>Code Independence (15%)</span>
                  <b style={{ color: 'var(--lime)' }}>{agent.independenceScore || 94} / 100</b>
                </div>
                <div className="bar" style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)' }}>
                  <i style={{ width: `${agent.independenceScore || 94}%`, background: 'var(--lime)' }}></i>
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry & Audit Posture Details */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '14px' }}>
              On-Chain Telemetry & Cryptographic Verification
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ background: '#141410', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginBottom: '4px' }}>Active Wallets (30d)</div>
                <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '16px', fontFamily: "'IBM Plex Mono', monospace" }}>
                  <CountUpNumber to={agent.activeWallets30d} duration={1.8} /> wallets
                </div>
              </div>

              <div style={{ background: '#141410', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginBottom: '4px' }}>GitHub Commits (30d)</div>
                <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '16px', fontFamily: "'IBM Plex Mono', monospace" }}>
                  <CountUpNumber to={agent.commits30d} suffix=" commits" duration={1.8} />
                </div>
              </div>

              <div style={{ background: '#141410', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginBottom: '4px' }}>Smart Contract Audit</div>
                <div style={{ color: '#2e8b57', fontWeight: 900, fontSize: '14.5px' }}>
                  ✓ {agent.auditStatus}
                </div>
              </div>

              <div style={{ background: '#141410', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginBottom: '4px' }}>Admin Key Custody</div>
                <div style={{ color: agent.adminKeysSafe ? '#2e8b57' : '#d93030', fontWeight: 900, fontSize: '14.5px' }}>
                  {agent.adminKeysSafe ? '✓ Multisig / Timelock' : '⚠ Retained Admin Key'}
                </div>
              </div>
            </div>
          </div>

          {/* Smart Contract Address with Copy */}
          {agent.contract && (
            <div style={{ background: '#141410', padding: '12px 18px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>Contract Telemetry ID</span>
                <code style={{ fontSize: '13px', color: 'var(--lime)', fontFamily: "'IBM Plex Mono', monospace" }}>
                  {agent.contract}
                </code>
              </div>
              <button
                onClick={handleCopyContract}
                style={{
                  background: copied ? 'var(--lime)' : 'rgba(255, 255, 255, 0.08)',
                  color: copied ? '#0d0d0a' : '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          )}

          {/* Research Dossier Body & Verdict */}
          {agent.dossierBody && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '10px' }}>
                FORGES Intelligence Dossier
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '14px', lineHeight: 1.65, margin: 0 }}>
                {agent.dossierBody}
              </p>
            </div>
          )}

          {agent.verdict && (
            <div style={{ background: 'rgba(215, 249, 0, 0.08)', padding: '16px 20px', borderLeft: '4px solid var(--lime)', borderRadius: '12px', marginBottom: '28px' }}>
              <div style={{ fontSize: '11px', color: 'var(--lime)', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.08em', marginBottom: '4px' }}>
                Editorial Verdict
              </div>
              <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: 1.55, fontWeight: 600 }}>
                {agent.verdict}
              </div>
            </div>
          )}

          {/* Quick External Links with Custom SVG Icons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {agent.website && (
              <a
                href={agent.website}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#141410',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  padding: '9px 15px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>Official Website</span>
              </a>
            )}
            {agent.docsUrl && (
              <a
                href={agent.docsUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#141410',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  padding: '9px 15px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>Documentation</span>
              </a>
            )}
            {agent.githubUrl && (
              <a
                href={agent.githubUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#141410',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  padding: '9px 15px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--lime)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub Repository</span>
              </a>
            )}
            {agent.xHandle && (
              <a
                href={`https://x.com/${agent.xHandle.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#141410',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  padding: '9px 15px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--lime)">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>@{agent.xHandle.replace('@', '')}</span>
              </a>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px' }}>
            <button
              className="btn btn-dark"
              style={{ flex: 1, padding: '14px' }}
              onClick={onClose}
            >
              Close Dossier
            </button>
            {onNavigate && (
              <button
                className="btn btn-pink"
                style={{ flex: 1, padding: '14px' }}
                onClick={() => {
                  onClose();
                  onNavigate('/rankings');
                }}
              >
                View in Rankings
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
