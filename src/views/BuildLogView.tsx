import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BUILD_LOG_ENTRIES, type LogEntryType } from '../data/buildLogData';
import { QUALIFIED_NOTICE_DATA } from '../data/buildStages';
import { ForgesNavbar, XLogoIcon } from '../components/OrdinalNavbar';
import { CountUpNumber } from '../components/CountUpNumber';

interface BuildLogViewProps {
  onNavigate: (path: string) => void;
  defaultTab?: 'log' | 'qualified';
}

export const BuildLogView: React.FC<BuildLogViewProps> = ({ onNavigate, defaultTab = 'log' }) => {
  const [activeTab, setActiveTab] = useState<'log' | 'qualified'>(defaultTab);
  const [filterType, setFilterType] = useState<'all' | LogEntryType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { description, expectedPublication, currentStage, allStages } = QUALIFIED_NOTICE_DATA;

  const filteredEntries = BUILD_LOG_ENTRIES.filter((entry) => {
    const matchesType =
      filterType === 'all'
        ? true
        : filterType === 'correction'
          ? entry.type === 'correction' || entry.type === 'reversal'
          : entry.type === filterType;

    const matchesSearch =
      entry.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.date.includes(searchQuery);

    return matchesType && matchesSearch;
  });

  const totalEntries = BUILD_LOG_ENTRIES.length;
  const correctionCount = BUILD_LOG_ENTRIES.filter((e) => e.type === 'correction' || e.type === 'reversal').length;

  return (
    <div className="forges-app" style={{ background: 'var(--ink)', minHeight: '100vh', color: 'var(--white)' }}>
      <ForgesNavbar currentPath={activeTab === 'qualified' ? '/qualified' : '/log'} onNavigate={onNavigate} />

      <div className="ticker-band" style={{ marginTop: '76px' }}>
        <div className="ticker-track">
          <span>PUBLIC BUILD LOG & QUALIFIED VOLUME ENGINE · INSTITUTIONAL TELEMETRY REGISTER · REMOVING WASH TRADES & CIRCULAR ROUTING</span>
          <span>PUBLIC BUILD LOG & QUALIFIED VOLUME ENGINE · INSTITUTIONAL TELEMETRY REGISTER · REMOVING WASH TRADES & CIRCULAR ROUTING</span>
        </div>
      </div>

      <main style={{ padding: '60px 0 100px' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <div className="kicker">SYSTEM PROTOCOL · TELEMETRY & BUILD LOG</div>

          <motion.h1
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-0.04em', margin: '12px 0 18px', color: 'var(--white)' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {activeTab === 'log' ? (
              <>Build Register & <span className="gradient-text">Public Audit Trail</span></>
            ) : (
              <>Qualified Volume <span className="gradient-text">Telemetry Engine</span></>
            )}
          </motion.h1>

          <p className="lead" style={{ maxWidth: '780px', fontSize: '16.5px', color: 'var(--gray-text)', marginBottom: '36px', lineHeight: 1.6 }}>
            {activeTab === 'log'
              ? 'An append-only public record of FORGES system deployments, model recalibrations, and telemetry corrections.'
              : description}
          </p>

          {/* Tab Switcher */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', borderBottom: '1px solid var(--gray-border-strong)', paddingBottom: '16px' }}>
            <button
              className={`btn ${activeTab === 'log' ? 'btn-pink' : 'btn-dark'}`}
              onClick={() => setActiveTab('log')}
              style={{ padding: '12px 24px', fontSize: '13px' }}
            >
              Build Register ({totalEntries})
            </button>
            <button
              className={`btn ${activeTab === 'qualified' ? 'btn-pink' : 'btn-dark'}`}
              onClick={() => setActiveTab('qualified')}
              style={{ padding: '12px 24px', fontSize: '13px' }}
            >
              Qualified Volume Engine
            </button>
          </div>

          {/* TAB 1: BUILD REGISTER LOG */}
          {activeTab === 'log' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {/* Stats Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div style={{ background: '#0d0d0a', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '20px', padding: '24px', textAlign: 'center', boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff' }}>
                    <CountUpNumber to={totalEntries} duration={1.8} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', fontWeight: 800, marginTop: '4px' }}>
                    Logged Deployments
                  </div>
                </div>
                <div style={{ background: '#0d0d0a', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '20px', padding: '24px', textAlign: 'center', boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff' }}>
                    <CountUpNumber to={correctionCount} duration={1.8} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', fontWeight: 800, marginTop: '4px' }}>
                    Published Corrections
                  </div>
                </div>
                <div style={{ background: '#0d0d0a', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '20px', padding: '24px', textAlign: 'center', boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff' }}>
                    <CountUpNumber to={100} suffix="%" duration={1.5} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', fontWeight: 800, marginTop: '4px' }}>
                    Audit Transparency
                  </div>
                </div>
              </div>

              {/* Filters & Search */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    className={`btn ${filterType === 'all' ? 'btn-pink' : 'btn-dark'}`}
                    onClick={() => setFilterType('all')}
                  >
                    All Entries ({totalEntries})
                  </button>
                  <button
                    className={`btn ${filterType === 'feature' ? 'btn-pink' : 'btn-dark'}`}
                    onClick={() => setFilterType('feature')}
                  >
                    Deployments
                  </button>
                  <button
                    className={`btn ${filterType === 'correction' ? 'btn-pink' : 'btn-dark'}`}
                    onClick={() => setFilterType('correction')}
                  >
                    Corrections
                  </button>
                </div>

                <div style={{ minWidth: '240px' }}>
                  <input
                    type="text"
                    placeholder="Search log entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Timeline List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredEntries.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    style={{
                      background: '#0d0d0a',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '20px',
                      padding: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.25)'
                    }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--lime)', fontWeight: 900, letterSpacing: '0.08em' }}>
                        {entry.date} · {entry.type.toUpperCase()}
                      </span>
                      <span className="tag" style={{ background: 'var(--lime)', color: '#0d0d0a', border: '1px solid var(--lime)', fontWeight: 800 }}>
                        {entry.id.toUpperCase()}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      {entry.summary}
                    </h3>
                    {entry.link && (
                      <div style={{ marginTop: '8px' }}>
                        <button
                          className="btn btn-dark"
                          style={{ fontSize: '12px', padding: '6px 14px' }}
                          onClick={() => onNavigate(entry.link!)}
                        >
                          {entry.linkText || 'View Context'}
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 2: QUALIFIED VOLUME ENGINE */}
          {activeTab === 'qualified' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {/* Status Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div style={{ background: '#0d0d0a', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '20px', padding: '24px', textAlign: 'center', boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>{currentStage}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', fontWeight: 800, marginTop: '6px' }}>
                    Pipeline Phase
                  </div>
                </div>
                <div style={{ background: '#0d0d0a', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '20px', padding: '24px', textAlign: 'center', boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>{expectedPublication}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', fontWeight: 800, marginTop: '6px' }}>
                    Target Availability
                  </div>
                </div>
                <div style={{ background: '#0d0d0a', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '20px', padding: '24px', textAlign: 'center', boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff' }}>
                    <CountUpNumber to={0} suffix="%" duration={1.5} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', fontWeight: 800, marginTop: '6px' }}>
                    Wash Trade Tolerance
                  </div>
                </div>
              </div>

              {/* Roadmap Card */}
              <div style={{ background: '#0d0d0a', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '24px', padding: '36px', boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', marginBottom: '20px' }}>
                  Development & Verification Roadmap
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {allStages.map((stageName, idx) => {
                    const currentStageIndex = allStages.indexOf(currentStage);
                    const isPast = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <motion.div
                        key={stageName}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px 20px',
                          borderRadius: '14px',
                          borderLeft: isCurrent ? '4px solid var(--lime)' : isPast ? '4px solid #2e8b57' : '4px solid rgba(255, 255, 255, 0.12)',
                          background: isCurrent ? '#181814' : '#12120e',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: 900, color: 'var(--lime)', textTransform: 'uppercase', marginRight: '8px' }}>
                            STAGE 0{idx + 1}
                          </span>
                          <span style={{ fontWeight: 800, fontSize: '15px', color: '#ffffff' }}>{stageName}</span>
                        </div>
                        <span
                          className="tag"
                          style={{
                            background: isCurrent ? 'var(--lime)' : isPast ? '#2e8b57' : 'transparent',
                            color: isCurrent ? '#0d0d0a' : isPast ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                            border: isCurrent ? '1px solid var(--lime)' : isPast ? '1px solid #2e8b57' : '1px solid rgba(255, 255, 255, 0.2)',
                            fontWeight: 800
                          }}
                        >
                          {isPast ? 'COMPLETE' : isCurrent ? 'IN PROGRESS' : 'QUEUED'}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer>
        <img src="/footer_art.jpeg" alt="FORGES AI Intelligence Matrix Background" className="footer-bg-img" />
        <div className="footer-bg-overlay" />

        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo" onClick={() => onNavigate('/')} style={{ cursor: 'pointer' }}>
                <span className="logo-mark"></span>
                <span>FORGES 30</span>
              </div>
              <p>The independent intelligence wall & Forbes 30 Under 30 index for autonomous AI agents. Profile. Verify. Remember.</p>
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pulse-dot" style={{ width: '8px', height: '8px', background: 'var(--lime)', borderRadius: '50%', boxShadow: '0 0 10px var(--lime)' }} />
                <span style={{ fontSize: '11px', color: 'var(--lime)', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  REAL-TIME TELEMETRY ACTIVE
                </span>
              </div>
            </div>
            <div className="footer-col">
              <h4>Explore</h4>
              <button onClick={() => onNavigate('/')}>Home</button>
              <button onClick={() => onNavigate('/rankings')}>The 30 List</button>
              <button onClick={() => onNavigate('/log')}>Build Log</button>
              <button onClick={() => onNavigate('/methodology')}>Methodology</button>
            </div>
            <div className="footer-col">
              <h4>Network</h4>
              <button onClick={() => onNavigate('/apply')}>Nominate Agent</button>
              <button onClick={() => onNavigate('/log')}>Qualified Volume</button>
              <a href="https://x.com/forgesagentsx" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <XLogoIcon size={12} /> Official X (@forgesagentsx)
              </a>
              <a href="https://github.com/forges-dev/Forges" target="_blank" rel="noreferrer">GitHub Repository</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 FORGES 30. All rights reserved. Forbes 30 Under 30 AI Agent Index Edition.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
