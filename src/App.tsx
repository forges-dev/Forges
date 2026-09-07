import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFullAgentDatabase, fetchLiveAgentDatabase, type AgentEntity } from './data/agentDatabase';
import { OrdinalNavbar } from './components/OrdinalNavbar';
import { AgentAvatar, getFaviconUrl } from './components/AgentAvatar';
import { CountUpNumber } from './components/CountUpNumber';

export default function App({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [selectedAgent, setSelectedAgent] = useState<AgentEntity | null>(null);
  const [allAgents, setAllAgents] = useState<AgentEntity[]>(() => getFullAgentDatabase());
  const [pageIndex, setPageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const totalPages = useMemo(() => Math.ceil(allAgents.length / 4), [allAgents.length]);

  // Auto-slide 4 cards at a time (1 page) every 2 seconds (2000ms)
  useEffect(() => {
    if (isPaused || totalPages <= 1) return;
    const interval = setInterval(() => {
      setPageIndex((prev) => (prev + 1) % totalPages);
    }, 2000);
    return () => clearInterval(interval);
  }, [totalPages, isPaused]);

  const handleTouchStart = (clientX: number) => {
    setIsPaused(true);
    touchStartX.current = clientX;
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX.current !== null) {
      const diff = touchStartX.current - clientX;
      if (diff > 40) {
        setPageIndex((prev) => (prev + 1) % totalPages);
      } else if (diff < -40) {
        setPageIndex((prev) => (prev <= 0 ? totalPages - 1 : prev - 1));
      }
      touchStartX.current = null;
    }
    setTimeout(() => setIsPaused(false), 2500);
  };

  useEffect(() => {
    fetchLiveAgentDatabase().then((liveList) => {
      if (liveList && liveList.length > 0) {
        setAllAgents(liveList);
      }
    });

    const handleDbUpdate = () => {
      fetchLiveAgentDatabase().then((liveList) => {
        setAllAgents(liveList);
      });
    };
    window.addEventListener('forges_db_updated', handleDbUpdate);
    return () => window.removeEventListener('forges_db_updated', handleDbUpdate);
  }, []);

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

  const dbStats = useMemo(() => {
    const total = allAgents.length;
    const watchlist = allAgents.filter(a => a.status === 'watchlist').length;
    const verified = allAgents.filter(a => a.status === 'verified').length;
    const totalWallets = allAgents.reduce((sum, a) => sum + a.activeWallets30d, 0);
    const uniqueChains = new Set(allAgents.map(a => a.chain)).size;
    const revokedRate = Math.round((watchlist / total) * 100);

    return {
      total,
      watchlist,
      verified,
      totalWallets,
      uniqueChains,
      revokedRate
    };
  }, [allAgents]);

  return (
    <div className="ordinal-app">
      {/* Masthead */}
      <OrdinalNavbar currentPath="/" onNavigate={navigateTo} />

      <main id="page-home">
        {/* Hero Section */}
        <section className="hero" id="home">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="hero-bg-video"
            src="/hero-section-forger.mp4"
          />
          <div className="hero-overlay"></div>

          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">INDEPENDENT AI AGENT INTELLIGENCE · CLASS OF 2026</div>
              <h1>
                Create, own,<br />
                and <span className="gradient-text">measure</span><br />
                AI agents.
              </h1>
              <p>
                <b>FORGES 30 UNDER 30:</b> A public intelligence wall and selective ranking engine for autonomous AI agents — profiling capability, behavior, provenance, and trust across the emerging agent economy.
              </p>

              <div className="hero-actions">
                <button className="btn btn-pink" onClick={() => {
                  const el = document.getElementById('agents');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Explore The 30 List →
                </button>
                <button className="btn btn-dark" onClick={() => navigateTo('/apply')}>
                  Nominate Agent
                </button>
              </div>

              <div className="hero-proof">
                <div className="proof">
                  <strong>30</strong>
                  <span>Elite Honorees</span>
                </div>
                <div className="proof">
                  <strong>{dbStats.uniqueChains}</strong>
                  <span>Chains Covered</span>
                </div>
                <div className="proof">
                  <strong>4.8/5</strong>
                  <span>Review Integrity</span>
                </div>
              </div>
            </div>

            <div className="hero-art">
              <div className="glow g1"></div>
              <div className="glow g2"></div>
            </div>
          </div>
        </section>

        {/* Chain Coverage & Live Ticker Strip */}
        <div className="strip">
          <div className="container strip-inner">
            <div className="strip-label">Chain Coverage</div>
            <div className="chain">
              <span>Ethereum</span>
              <span>Base</span>
              <span>Solana</span>
              <span>Arbitrum</span>
              <span>Optimism</span>
              <span>Polygon</span>
              <span>Avalanche</span>
            </div>
          </div>
        </div>

        <div className="ticker-band">
          <div className="ticker-track">
            {allAgents.slice(0, 8).map((a) => (
              <span key={a.id}>
                FORGES #0{a.rank} · {a.name.toUpperCase()} · SCORE {a.score.toFixed(1)}{' '}
                <b className={a.isUp ? 'up' : 'down'}>
                  {a.delta7d}
                </b>
              </span>
            ))}
            {allAgents.slice(0, 8).map((a) => (
              <span key={a.id + '-dup'}>
                FORGES #0{a.rank} · {a.name.toUpperCase()} · SCORE {a.score.toFixed(1)}{' '}
                <b className={a.isUp ? 'up' : 'down'}>
                  {a.delta7d}
                </b>
              </span>
            ))}
          </div>
        </div>

        {/* Scope Section */}
        <section id="scope">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="kicker">02 / THE SCOPE · FORGES 30 RUBRIC</div>
                <h2>Four signals.<br />One clearer picture.</h2>
              </div>
              <p className="lead">
                We reduce the noise around AI agents into four objective signal categories, so a profile tells you more than a follower count or viral metric ever could.
              </p>
            </div>

            <div className="scope-grid">
              <article className="scope-card">
                <span className="num">01</span>
                <h3>Capability</h3>
                <p>What can the agent actually do? Execution range, autonomous tool use, reasoning loops, and transaction throughput.</p>
                <span className="rating-pill">Signal Score 0–10</span>
              </article>
              <article className="scope-card">
                <span className="num">02</span>
                <h3>Reliability</h3>
                <p>Consistency under pressure: uptime, failure recovery, code reproducibility, and operational discipline on-chain.</p>
                <span className="rating-pill">Signal Score 0–10</span>
              </article>
              <article className="scope-card">
                <span className="num">03</span>
                <h3>Provenance</h3>
                <p>Who built it, what models power it, where value flows, and how independently its claims can be verified on GitHub & chain.</p>
                <span className="rating-pill">Signal Score 0–10</span>
              </article>
              <article className="scope-card">
                <span className="num">04</span>
                <h3>Trust</h3>
                <p>Verifiable evidence, contract audit posture, key security, and zero paid placement guarantee behind every dossier.</p>
                <span className="rating-pill">Signal Score 0–10</span>
              </article>
            </div>
          </div>
        </section>

        {/* Profiled Agents / 30 Under 30 Honorees Carousel */}
        <section className="agents" id="agents">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="kicker">03 / THE 30 UNDER 30 HONOREES · CLASS OF 2026</div>
                <h2>The wall is moving.</h2>
              </div>
            </div>

            <div
              className="carousel"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
              onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientX)}
              onMouseDown={(e) => handleTouchStart(e.clientX)}
              onMouseUp={(e) => handleTouchEnd(e.clientX)}
              style={{ cursor: 'grab', userSelect: 'none' }}
            >
              <div
                className="track"
                style={{
                  transform: `translateX(calc(-${pageIndex * 4} * (25% + 5px)))`,
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {allAgents.map((agent) => {
                  const faviconUrl = getFaviconUrl(agent.website, agent.name, agent.slug);
                  return (
                    <article
                      key={agent.id}
                      className="agent"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <div className="agent-top">
                        {faviconUrl ? (
                          <img
                            src={faviconUrl}
                            alt={agent.name}
                            className="agent-full-img"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className="agent-full-fallback"
                          style={{ display: faviconUrl ? 'none' : 'flex' }}
                        >
                          {agent.avatar || agent.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="agent-top-overlay" />
                      </div>
                      <div className="agent-body">
                        <div className="agent-name">
                          <h3>{agent.name}</h3>
                          <span className="tag">{agent.tag || 'Honoree'}</span>
                        </div>
                        <p>{agent.blurb}</p>
                        <div className="mini-meta">
                          <span>Trust Score {agent.score.toFixed(1)}</span>
                          <span>{agent.chain} · #{agent.rank}</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Pagination / Slide Progress Dots (1 dot per 4 cards page) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPageIndex(idx);
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 2500);
                  }}
                  style={{
                    width: idx === pageIndex ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: idx === pageIndex ? 'var(--lime)' : 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button className="btn btn-dark" onClick={() => navigateTo('/rankings')}>
                View Full 30 Under 30 Leaderboard →
              </button>
            </div>
          </div>
        </section>

        {/* Dossier & Rating Section */}
        <section className="dossier" id="dossier">
          <div className="container dossier-grid">
            <div>
              <div className="kicker">04 / DOSSIER AUDIT · OBJECTIVE EVIDENCE</div>
              <h2>FORGES Keys are not popularity. They're evidence.</h2>
              <p className="lead" style={{ marginTop: '22px' }}>
                Every agent gets a repeatable scorecard. The rating is designed to reflect verifiable execution, smart contract security, and codebase integrity over hype.
              </p>
              <div style={{ marginTop: '28px' }}>
                <div style={{ padding: '16px 0', borderBottom: '1px solid var(--gray-border)' }}>
                  <strong style={{ color: 'var(--white)', display: 'block', fontSize: '16px' }}>No Paid Rankings</strong>
                  <span style={{ color: 'var(--gray-text)', fontSize: '13px' }}>Visibility never buys a better score or higher placement.</span>
                </div>
                <div style={{ padding: '16px 0', borderBottom: '1px solid var(--gray-border)' }}>
                  <strong style={{ color: 'var(--white)', display: 'block', fontSize: '16px' }}>Weighted Evidence</strong>
                  <span style={{ color: 'var(--gray-text)', fontSize: '13px' }}>Not every claim carries the same confidence; on-chain contracts override promotional copy.</span>
                </div>
                <div style={{ padding: '16px 0' }}>
                  <strong style={{ color: 'var(--white)', display: 'block', fontSize: '16px' }}>Public Audits & Provenance</strong>
                  <span style={{ color: 'var(--gray-text)', fontSize: '13px' }}>Agents evolve continuously; dossiers track execution timelines over time.</span>
                </div>
              </div>
            </div>

            <div className="rating-box">
              <div style={{ color: 'var(--lime)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                FORGES BENCHMARK SCORE
              </div>
              <div className="stars">★★★★★</div>
              <div className="score">
                9.8 <small>/ 10</small>
              </div>

              <div className="metric">
                <div className="metric-row">
                  <span>Capability & Execution</span>
                  <b>9.5 / 10</b>
                </div>
                <div className="bar"><i style={{ width: '95%' }}></i></div>
              </div>

              <div className="metric">
                <div className="metric-row">
                  <span>Reliability & Uptime</span>
                  <b>9.8 / 10</b>
                </div>
                <div className="bar"><i style={{ width: '98%' }}></i></div>
              </div>

              <div className="metric">
                <div className="metric-row">
                  <span>On-Chain Provenance</span>
                  <b>9.2 / 10</b>
                </div>
                <div className="bar"><i style={{ width: '92%' }}></i></div>
              </div>

              <div className="metric">
                <div className="metric-row">
                  <span>Security & Key Safety</span>
                  <b>10.0 / 10</b>
                </div>
                <div className="bar"><i style={{ width: '100%' }}></i></div>
              </div>
            </div>
          </div>
        </section>

        {/* Publication Section */}
        <section className="publication" id="publication">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="kicker">05 / FORBES-STANDARD PUBLICATION</div>
                <h2>A living record of the agent economy.</h2>
              </div>
              <p className="lead">
                Executive field notes, deep dossiers, and research for creators, funds, and protocols operating autonomous AI systems.
              </p>
            </div>

            <div className="pub-grid">
              <article className="article featured">
                <div>
                  <small>FIELD NOTE · CLASS OF 2026</small>
                  <h3>Why the best AI agents may look boring from the outside.</h3>
                  <p>
                    Reliability compounds quietly. We look at the operational signals and smart contract discipline that separate useful autonomy from impressive demos.
                  </p>
                </div>
                <a href="#publication" onClick={() => navigateTo('/log')}>Read Publication →</a>
              </article>

              <div className="pub-side">
                <article className="article">
                  <small>DOSSIER SPOTLIGHT · VX-4</small>
                  <h3>Inside an execution-first agent.</h3>
                  <p>Capability, constraints, and multi-chain telemetry on Base & Ethereum.</p>
                  <a href="#agents" onClick={() => navigateTo('/rankings')}>Open Dossier →</a>
                </article>
                <article className="article">
                  <small>METHODOLOGY · V1.0</small>
                  <h3>How we score trust.</h3>
                  <p>The evidence ladder behind every FORGES Key rating and audit tier.</p>
                  <a href="#dossier" onClick={() => navigateTo('/methodology')}>View Methodology →</a>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Wall & Principles Section */}
        <section className="wall">
          <div className="container wall-grid">
            <div className="wall-copy">
              <div className="kicker">06 / WHY THE WALL EXISTS</div>
              <h2>Because the market needs memory.</h2>
              <p>
                AI agents are becoming products, workers, protocols, and assets. Their reputation shouldn't be rebuilt from scratch every time a new launch gets attention.
              </p>
              <p>
                FORGES exists to create durable public context: what happened, what was verified on-chain, what changed, and what remains unknown.
              </p>
            </div>

            <div className="principles">
              <div className="principle">
                <span>01</span>
                <div>
                  <strong>Make agents legible.</strong>
                  <p>Turn complex machine execution into clear, comparable signals.</p>
                </div>
              </div>
              <div className="principle">
                <span>02</span>
                <div>
                  <strong>Make claims accountable.</strong>
                  <p>Attach assertions to verifiable code commits and smart contract telemetry.</p>
                </div>
              </div>
              <div className="principle">
                <span>03</span>
                <div>
                  <strong>Make reputation portable.</strong>
                  <p>Give high-performing agents a durable public record beyond any single platform.</p>
                </div>
              </div>
              <div className="principle">
                <span>04</span>
                <div>
                  <strong>Make the archive public.</strong>
                  <p>Keep the intelligence wall open to compound value across the Web3 ecosystem.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta" id="join">
          <div className="container">
            <div className="cta-card">
              <div className="kicker">07 / ENTER THE WALL</div>
              <h2>Build something worth profiling.</h2>
              <p>
                Nominate an agent for the FORGES 30 Under 30 Class of 2026, follow the dossiers, or join our research network.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button className="btn btn-pink" onClick={() => navigateTo('/apply')}>
                  Nominate an Agent →
                </button>
                <button className="btn btn-dark" onClick={() => navigateTo('/methodology')}>
                  Join Research Network
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Agent Detail Modal */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              background: 'rgba(13, 13, 10, 0.85)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setSelectedAgent(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                background: 'var(--gray-card)',
                border: '2px solid var(--gray-border-strong)',
                borderRadius: '24px',
                padding: '32px',
                maxWidth: '560px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                color: 'var(--white)'
              }}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <button
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--lime)',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedAgent(null)}
              >
                ✕
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <AgentAvatar agent={selectedAgent} size={52} />
                <div>
                  <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 900 }}>
                    {selectedAgent.name}
                  </h2>
                  <div style={{ fontSize: '13px', color: 'var(--lime)', fontWeight: 700, marginTop: '4px' }}>
                    {selectedAgent.chain} · {selectedAgent.category} · FORGES RANK #{selectedAgent.rank}
                  </div>
                </div>
              </div>

              <p style={{ color: 'var(--gray-text)', fontSize: '14.5px', lineHeight: 1.6, margin: '16px 0' }}>
                "{selectedAgent.blurb}"
              </p>

              <div style={{ borderTop: '1px solid var(--gray-border)', borderBottom: '1px solid var(--gray-border)', padding: '16px 0', margin: '20px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div>
                    <div style={{ color: 'var(--gray-text)', fontSize: '12px', textTransform: 'uppercase', fontWeight: 700 }}>FORGES Score</div>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--lime)' }}>
                      <CountUpNumber to={selectedAgent.score} decimals={1} duration={1.5} />
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--gray-text)', fontSize: '12px', textTransform: 'uppercase', fontWeight: 700 }}>7d Trend</div>
                    <div style={{ fontSize: '24px', fontWeight: 800 }} className={selectedAgent.isUp ? 'up' : 'down'}>
                      {selectedAgent.delta7d}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ margin: '18px 0' }}>
                <h4 style={{ color: 'var(--lime)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  Telemetry & Audit Posture
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gray-border)', paddingBottom: '6px' }}>
                    <span style={{ color: 'var(--gray-text)' }}>Active Wallets (30d):</span>
                    <b><CountUpNumber to={selectedAgent.activeWallets30d} duration={1.8} /></b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gray-border)', paddingBottom: '6px' }}>
                    <span style={{ color: 'var(--gray-text)' }}>GitHub Commits (30d):</span>
                    <b><CountUpNumber to={selectedAgent.commits30d} suffix=" commits" duration={1.8} /></b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gray-border)', paddingBottom: '6px' }}>
                    <span style={{ color: 'var(--gray-text)' }}>Smart Contract Audit:</span>
                    <b style={{ color: 'var(--lime)' }}>{selectedAgent.auditStatus}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gray-text)' }}>Admin Key Security:</span>
                    <b>{selectedAgent.adminKeysSafe ? '✓ Multisig / Timelock' : '⚠ Retained Admin Key'}</b>
                  </div>
                </div>
              </div>

              {selectedAgent.verdict && (
                <div style={{ background: '#141410', padding: '14px 18px', borderLeft: '3px solid var(--lime)', borderRadius: '8px', margin: '20px 0', fontSize: '13px', color: 'var(--gray-text)' }}>
                  <strong style={{ color: 'var(--white)' }}>Editorial Verdict:</strong> {selectedAgent.verdict}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', gap: '12px' }}>
                <button className="btn btn-dark" style={{ flex: 1 }} onClick={() => setSelectedAgent(null)}>
                  Close Dossier
                </button>
                <button className="btn btn-pink" style={{ flex: 1 }} onClick={() => navigateTo('/rankings')}>
                  View Rankings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo" onClick={() => navigateTo('/')}>
                <span className="logo-mark"></span>
                <span>FORGES 30</span>
              </div>
              <p>The independent intelligence wall & Forbes 30 Under 30 index for autonomous AI agents. Profile. Verify. Remember.</p>
            </div>
            <div className="footer-col">
              <h4>Explore</h4>
              <button onClick={() => navigateTo('/')}>The 30 List</button>
              <button onClick={() => navigateTo('/rankings')}>Rankings</button>
              <button onClick={() => navigateTo('/log')}>Build Log</button>
            </div>
            <div className="footer-col">
              <h4>Network</h4>
              <button onClick={() => navigateTo('/apply')}>Nominate Agent</button>
              <button onClick={() => navigateTo('/qualified')}>Qualified Volume</button>
              <button onClick={() => navigateTo('/methodology')}>Methodology</button>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <button onClick={() => navigateTo('/methodology')}>Audit Rubric</button>
              <button onClick={() => navigateTo('/')}>Terms of Service</button>
              <button onClick={() => navigateTo('/')}>Privacy Policy</button>
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
}
