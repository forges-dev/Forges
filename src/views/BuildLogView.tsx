import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BUILD_LOG_ENTRIES, type LogEntryType } from '../data/buildLogData';
import { OrdinalNavbar } from '../components/OrdinalNavbar';
import { CountUpNumber } from '../components/CountUpNumber';

interface BuildLogViewProps {
  onNavigate: (path: string) => void;
}

export const BuildLogView: React.FC<BuildLogViewProps> = ({ onNavigate }) => {
  const [filterType, setFilterType] = useState<'all' | LogEntryType>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="ordinal-app" style={{ background: 'var(--ink)', minHeight: '100vh', color: 'var(--white)' }}>
      <OrdinalNavbar currentPath="/log" onNavigate={onNavigate} />

      <div className="ticker-band" style={{ marginTop: '76px' }}>
        <div className="ticker-track">
          <span>PUBLIC BUILD LOG · APPEND-ONLY AUDIT TRAIL · DEPLOYMENTS & SYSTEM RECALIBRATIONS</span>
          <span>PUBLIC BUILD LOG · APPEND-ONLY AUDIT TRAIL · DEPLOYMENTS & SYSTEM RECALIBRATIONS</span>
        </div>
      </div>

      <main style={{ padding: '60px 0 100px' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="kicker">05 / PUBLIC BUILD LOG · ARCHIVE</div>
          <motion.h1
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-0.04em', margin: '12px 0 20px', color: 'var(--white)' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Chronological <span className="gradient-text">Build Register</span>
          </motion.h1>
          <p className="lead" style={{ maxWidth: '720px', fontSize: '16.5px', color: 'var(--gray-text)', marginBottom: '40px' }}>
            An append-only, public record of FORGES system deployments, parameter recalibrations, and telemetry corrections.
          </p>

          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
            <div style={{ background: 'var(--gray-card)', border: '1px solid var(--gray-border)', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--lime)' }}>
                <CountUpNumber to={totalEntries} duration={1.8} />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--gray-text)', textTransform: 'uppercase', fontWeight: 800, marginTop: '4px' }}>
                Logged Deployments
              </div>
            </div>
            <div style={{ background: 'var(--gray-card)', border: '1px solid var(--gray-border)', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--lime)' }}>
                <CountUpNumber to={correctionCount} duration={1.8} />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--gray-text)', textTransform: 'uppercase', fontWeight: 800, marginTop: '4px' }}>
                Published Corrections
              </div>
            </div>
            <div style={{ background: 'var(--gray-card)', border: '1px solid var(--gray-border)', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--lime)' }}>
                <CountUpNumber to={100} suffix="%" duration={1.5} />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--gray-text)', textTransform: 'uppercase', fontWeight: 800, marginTop: '4px' }}>
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
                  background: 'var(--gray-card)',
                  border: '1px solid var(--gray-border)',
                  borderRadius: '20px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--lime)', fontWeight: 900, letterSpacing: '0.08em' }}>
                    {entry.date} · {entry.type.toUpperCase()}
                  </span>
                  <span className="tag" style={{ background: 'rgba(215, 249, 0, 0.08)' }}>
                    {entry.id.toUpperCase()}
                  </span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--white)', margin: 0 }}>
                  {entry.summary}
                </h3>
                {entry.link && (
                  <div style={{ marginTop: '8px' }}>
                    <button
                      className="btn btn-dark"
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                      onClick={() => onNavigate(entry.link!)}
                    >
                      {entry.linkText || 'View Context'} →
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo" onClick={() => onNavigate('/')}>
                <span className="logo-mark"></span>
                <span>FORGES 30</span>
              </div>
              <p>The independent intelligence wall & Forbes 30 Under 30 index for autonomous AI agents. Profile. Verify. Remember.</p>
            </div>
            <div className="footer-col">
              <h4>Explore</h4>
              <button onClick={() => onNavigate('/')}>The 30 List</button>
              <button onClick={() => onNavigate('/rankings')}>Rankings</button>
              <button onClick={() => onNavigate('/log')}>Build Log</button>
            </div>
            <div className="footer-col">
              <h4>Network</h4>
              <button onClick={() => onNavigate('/apply')}>Nominate Agent</button>
              <button onClick={() => onNavigate('/qualified')}>Qualified Volume</button>
              <button onClick={() => onNavigate('/methodology')}>Methodology</button>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <button onClick={() => onNavigate('/methodology')}>Audit Rubric</button>
              <button onClick={() => onNavigate('/')}>Terms of Service</button>
              <button onClick={() => onNavigate('/')}>Privacy Policy</button>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 FORGES 30. All rights reserved. Forbes 30 Under 30 AI Agent Index Edition.</span>
            <span>Hoodopus Lime Color Palette.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
