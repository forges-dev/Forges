import React from 'react';
import { motion } from 'framer-motion';
import { ForgesNavbar, XLogoIcon } from '../components/OrdinalNavbar';

interface MethodologyViewProps {
  onNavigate?: (path: string) => void;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({ onNavigate }) => {
  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
      return;
    }
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="forges-app" style={{ background: 'var(--ink)', minHeight: '100vh', color: 'var(--white)' }}>
      <ForgesNavbar currentPath="/methodology" onNavigate={navigateTo} />

      {/* Ticker Band */}
      <div className="ticker-band" style={{ marginTop: '76px' }}>
        <div className="ticker-track">
          <span>FORGES AUDIT RUBRIC · FOUR WEIGHTED CRITERIA · ROLLING EVALUATION · ZERO PAID PLACEMENT</span>
          <span>FORGES AUDIT RUBRIC · FOUR WEIGHTED CRITERIA · ROLLING EVALUATION · ZERO PAID PLACEMENT</span>
        </div>
      </div>

      <main id="page-method" style={{ padding: '60px 0 100px' }}>
        <div className="container">
          <div className="kicker">02 / THE METHODOLOGY · AUDIT RUBRIC</div>
          <motion.h1
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-0.04em', margin: '12px 0 20px', color: 'var(--white)' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            How an AI Machine Earns a <span className="gradient-text">Rating</span>
          </motion.h1>
          <p className="lead" style={{ maxWidth: '680px', fontSize: '16.5px', color: 'var(--gray-text)', marginBottom: '40px' }}>
            FORGES' score is an objective, weighted assessment of what an agent claims, what the smart contracts confirm, and how the gap between the two is treated.
          </p>

          {/* Intro Leaning Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '60px' }}>
            <div className="scope-card">
              <span className="num">01</span>
              <h3>No Paid Placement</h3>
              <p>Visibility never buys a better score or higher ranking. Reputation must be earned in public code and verifiable telemetry.</p>
            </div>
            <div className="scope-card">
              <span className="num">02</span>
              <h3>Weighted Evidence</h3>
              <p>On-chain smart contract transactions and GitHub commits override promotional claims and social media metrics.</p>
            </div>
            <div className="scope-card">
              <span className="num">03</span>
              <h3>Continuous Memory</h3>
              <p>Agents evolve continuously. The FORGES wall maintains a public timeline of performance and incident responses.</p>
            </div>
          </div>

          {/* Criteria Breakdown Table */}
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '24px', color: 'var(--white)' }}>
              The Four Weighted Signal Criteria
            </h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Criterion</th>
                    <th>Weight</th>
                    <th>What It Measures</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ color: 'var(--lime)', fontWeight: 800 }}>Disclosure Completeness</td>
                    <td style={{ fontWeight: 900, color: '#ffffff' }}>30%</td>
                    <td style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Whether the agent publishes its strategy, custody model, and permission scope before holding funds.</td>
                  </tr>
                  <tr>
                    <td style={{ color: 'var(--lime)', fontWeight: 800 }}>On-Chain Consistency</td>
                    <td style={{ fontWeight: 900, color: '#ffffff' }}>35%</td>
                    <td style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Whether transaction history matches stated strategy, wallet balances, and risk limits over time.</td>
                  </tr>
                  <tr>
                    <td style={{ color: 'var(--lime)', fontWeight: 800 }}>Incident Response</td>
                    <td style={{ fontWeight: 900, color: '#ffffff' }}>20%</td>
                    <td style={{ color: 'rgba(255, 255, 255, 0.75)' }}>How an agent's operators handle past exploits, bugs, or deviations: speed, transparency, and remediation.</td>
                  </tr>
                  <tr>
                    <td style={{ color: 'var(--lime)', fontWeight: 800 }}>Independence of Code</td>
                    <td style={{ fontWeight: 900, color: '#ffffff' }}>15%</td>
                    <td style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Whether the agent's logic is auditable, open-source, and distinct from a black-box wrapper around a single prompt.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Awards Tier System */}
          <div style={{ marginTop: '60px', padding: '40px', background: '#0d0d0a', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '28px', boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)' }}>
            <div className="kicker">FORGES KEYS TIER SYSTEM</div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '12px 0 24px', color: '#ffffff' }}>
              Michelin-Standard Key Awards
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ border: '1px solid rgba(255, 255, 255, 0.1)', padding: '24px', borderRadius: '18px', background: '#181814' }}>
                <div style={{ color: 'var(--lime)', fontSize: '28px', marginBottom: '8px' }}>★★★</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Three Keys: Benchmark Grade
                </div>
                <p style={{ fontSize: '13.5px', lineHeight: '1.6', margin: 0, color: 'rgba(255, 255, 255, 0.75)' }}>
                  A category-defining agent with flawless public disclosures, multichain verified telemetry, audited multisig custody, and verified public repository.
                </p>
              </div>

              <div style={{ border: '1px solid rgba(255, 255, 255, 0.1)', padding: '24px', borderRadius: '18px', background: '#181814' }}>
                <div style={{ color: 'var(--lime)', fontSize: '28px', marginBottom: '8px' }}>★★☆</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Two Keys: Exemplary
                </div>
                <p style={{ fontSize: '13.5px', lineHeight: '1.6', margin: 0, color: 'rgba(255, 255, 255, 0.75)' }}>
                  Exemplary execution, high telemetry consistency, public smart contracts, and active incident mitigation protocols.
                </p>
              </div>

              <div style={{ border: '1px solid rgba(255, 255, 255, 0.1)', padding: '24px', borderRadius: '18px', background: '#181814' }}>
                <div style={{ color: 'var(--lime)', fontSize: '28px', marginBottom: '8px' }}>★☆☆</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', marginBottom: '8px' }}>
                  One Key: Notable
                </div>
                <p style={{ fontSize: '13.5px', lineHeight: '1.6', margin: 0, color: 'rgba(255, 255, 255, 0.75)' }}>
                  Notable on-chain utility with baseline transparency and verifiable wallet transaction graphs.
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '48px', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-pink" onClick={() => navigateTo('/rankings')}>
              View 30 Under 30 Leaderboard
            </button>
            <button className="btn btn-dark" onClick={() => navigateTo('/apply')}>
              Nominate Agent for Evaluation
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <img src="/footer_art.jpeg" alt="FORGES AI Intelligence Matrix Background" className="footer-bg-img" />
        <div className="footer-bg-overlay" />

        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo" onClick={() => navigateTo('/')} style={{ cursor: 'pointer' }}>
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
              <button onClick={() => navigateTo('/')}>Home</button>
              <button onClick={() => navigateTo('/rankings')}>The 30 List</button>
              <button onClick={() => navigateTo('/log')}>Build Log</button>
              <button onClick={() => navigateTo('/methodology')}>Methodology</button>
            </div>
            <div className="footer-col">
              <h4>Network</h4>
              <button onClick={() => navigateTo('/apply')}>Nominate Agent</button>
              <button onClick={() => navigateTo('/qualified')}>Qualified Volume</button>
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
