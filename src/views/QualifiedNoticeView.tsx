import React from 'react';
import { motion } from 'framer-motion';
import { QUALIFIED_NOTICE_DATA } from '../data/buildStages';
import { OrdinalNavbar } from '../components/OrdinalNavbar';
import { CountUpNumber } from '../components/CountUpNumber';

interface QualifiedNoticeViewProps {
  onNavigate: (path: string) => void;
}

export const QualifiedNoticeView: React.FC<QualifiedNoticeViewProps> = ({ onNavigate }) => {
  const { eyebrow, headline, description, expectedPublication, currentStage, allStages } = QUALIFIED_NOTICE_DATA;

  return (
    <div className="ordinal-app" style={{ background: 'var(--ink)', minHeight: '100vh', color: 'var(--white)' }}>
      <OrdinalNavbar currentPath="/qualified" onNavigate={onNavigate} />

      <div className="ticker-band" style={{ marginTop: '76px' }}>
        <div className="ticker-track">
          <span>QUALIFIED VOLUME ENGINE · INSTITUTIONAL TELEMETRY FILTER · REMOVING WASH TRADES & CIRCULAR ROUTING</span>
          <span>QUALIFIED VOLUME ENGINE · INSTITUTIONAL TELEMETRY FILTER · REMOVING WASH TRADES & CIRCULAR ROUTING</span>
        </div>
      </div>

      <main style={{ padding: '60px 0 100px' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="kicker">{eyebrow}</div>
          <motion.h1
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-0.04em', margin: '12px 0 20px', color: 'var(--white)' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {headline}
          </motion.h1>
          <p className="lead" style={{ maxWidth: '760px', fontSize: '16.5px', color: 'var(--gray-text)', marginBottom: '40px' }}>
            {description}
          </p>

          {/* Status Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
            <div style={{ background: 'var(--gray-card)', border: '1px solid var(--gray-border)', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--lime)' }}>{currentStage}</div>
              <div style={{ fontSize: '12px', color: 'var(--gray-text)', textTransform: 'uppercase', fontWeight: 800, marginTop: '6px' }}>
                Pipeline Phase
              </div>
            </div>
            <div style={{ background: 'var(--gray-card)', border: '1px solid var(--gray-border)', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--lime)' }}>{expectedPublication}</div>
              <div style={{ fontSize: '12px', color: 'var(--gray-text)', textTransform: 'uppercase', fontWeight: 800, marginTop: '6px' }}>
                Target Availability
              </div>
            </div>
            <div style={{ background: 'var(--gray-card)', border: '1px solid var(--gray-border)', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--lime)' }}>
                <CountUpNumber to={0} suffix="%" duration={1.5} />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--gray-text)', textTransform: 'uppercase', fontWeight: 800, marginTop: '6px' }}>
                Wash Trading Tolerance
              </div>
            </div>
          </div>

          {/* Roadmap Card */}
          <div style={{ background: 'var(--gray-card)', border: '1px solid var(--gray-border)', borderRadius: '24px', padding: '36px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--white)', marginBottom: '20px' }}>
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
                      borderLeft: isCurrent ? '4px solid var(--lime)' : isPast ? '4px solid #6fbf73' : '4px solid var(--gray-border-strong)',
                      background: isCurrent ? 'rgba(215, 249, 0, 0.08)' : '#141410'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--lime)', textTransform: 'uppercase', marginRight: '8px' }}>
                        STAGE 0{idx + 1}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--white)' }}>{stageName}</span>
                    </div>
                    <span
                      className="tag"
                      style={{
                        background: isCurrent ? 'var(--lime)' : 'transparent',
                        color: isCurrent ? 'var(--ink)' : 'var(--lime)',
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
