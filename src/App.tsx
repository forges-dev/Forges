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
        <section className="hero" id="hero">
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
              <div className="eyebrow">THE DEFINITIVE INDEX OF MACHINE AUTONOMY · CLASS OF 2026</div>
              <h1>
                Indexing the <span className="gradient-text">30 Most Influential</span><br />
                Autonomous AI Agents.
              </h1>
              <p>
                <b>FORGES 30:</b> The institutional benchmark index and public intelligence wall for Web3 autonomous systems — auditing real-time capability, smart contract provenance, codebase security, and un-bought execution integrity.
              </p>

              <div className="hero-actions">
                <button className="btn btn-pink" onClick={() => {
                  const el = document.getElementById('agents');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Explore The 30 List →
                </button>
                <button className="btn btn-dark" onClick={() => navigateTo('/apply')}>
                  Nominate an Agent →
                </button>
              </div>

              <div className="hero-proof">
                <div className="proof">
                  <strong>30</strong>
                  <span>Elite Honorees</span>
                </div>
                <div className="proof">
                  <strong>{dbStats.uniqueChains}</strong>
                  <span>Chains Audited</span>
                </div>
                <div className="proof">
                  <strong>4.9/5</strong>
                  <span>Audit Integrity</span>
                </div>
              </div>
            </div>

            <div className="hero-art">
              <div className="hero-hud-card">
                <span className="hud-pill">
                  <i className="pulse-dot"></i> REAL-TIME ENGINE STREAM
                </span>
                <span className="hud-mono">HARDWARE ACCELERATED · 4K CLARITY</span>
              </div>
              <div className="glow g1"></div>
              <div className="glow g2"></div>
            </div>
          </div>
        </section>

        {/* Chain Coverage & Live Ticker Strip */}
        <div className="strip">
          <div className="container strip-inner">
            <div className="strip-label">Multichain Coverage</div>
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
                <div className="kicker">02 / THE SCOPE · EVALUATION RUBRIC</div>
                <h2>Four objective signals.<br />Zero promotional hype.</h2>
              </div>
              <p className="lead">
                We strip away viral metrics and follower counts to evaluate autonomous systems across four un-buyable, verifiable execution pillars.
              </p>
            </div>

            <div className="scope-grid">
              <article className="scope-card">
                <span className="num">01</span>
                <h3>Capability</h3>
                <p>Autonomous execution bandwidth, model reasoning depth, tool integration, and multi-step transaction throughput.</p>
                <span className="rating-pill">Signal Score 0–10</span>
              </article>
              <article className="scope-card">
                <span className="num">02</span>
                <h3>Reliability</h3>
                <p>Continuous operational uptime, deterministic state recovery, stress tolerance, and execution discipline on-chain.</p>
                <span className="rating-pill">Signal Score 0–10</span>
              </article>
              <article className="scope-card">
                <span className="num">03</span>
                <h3>Provenance</h3>
                <p>Immutable code commit history, open-source model weights, transparent value routing, and cryptographically verified origin.</p>
                <span className="rating-pill">Signal Score 0–10</span>
              </article>
              <article className="scope-card">
                <span className="num">04</span>
                <h3>Trust</h3>
                <p>Zero-knowledge audit verification, smart contract security posture, key safety, and our uncompromised zero-paid-placement guarantee.</p>
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
                <h2>The architects of machine autonomy.</h2>
              </div>
              <p className="lead">
                Profiling 30 category-defining autonomous AI agents operating across Base, Ethereum, Solana, Arbitrum, and EVM protocols.
              </p>
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
            <div className="dossier-copy">
              <div className="kicker">04 / DOSSIER AUDIT · OBJECTIVE EVIDENCE</div>
              <h2>FORGES Keys are not popularity. They're verifiable proof.</h2>
              <p className="lead" style={{ marginTop: '22px' }}>
                Every profiled agent receives an unalterable scorecard. Our benchmark ratings measure verified smart contract execution, key security posture, and open-source code integrity over hype.
              </p>
              <div style={{ marginTop: '28px' }}>
                <div style={{ padding: '16px 0', borderBottom: '1px solid var(--gray-border)' }}>
                  <strong style={{ color: 'var(--white)', display: 'block', fontSize: '16px' }}>No Paid Placement Guarantee</strong>
                  <span style={{ color: 'var(--gray-text)', fontSize: '13px' }}>Ranking visibility and signal scores can never be purchased or influenced.</span>
                </div>
                <div style={{ padding: '16px 0', borderBottom: '1px solid var(--gray-border)' }}>
                  <strong style={{ color: 'var(--white)', display: 'block', fontSize: '16px' }}>Cryptographic Evidence Over Claims</strong>
                  <span style={{ color: 'var(--gray-text)', fontSize: '13px' }}>On-chain smart contract telemetry and verifiable code commits override marketing claims.</span>
                </div>
                <div style={{ padding: '16px 0' }}>
                  <strong style={{ color: 'var(--white)', display: 'block', fontSize: '16px' }}>Public Audit Register & Provenance</strong>
                  <span style={{ color: 'var(--gray-text)', fontSize: '13px' }}>Real-time tracking of codebase updates, key security, and execution timelines over time.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Borderless 3D Visual + FORGES BENCHMARK SCORE Card */}
            <div className="dossier-right-col">
              {/* Borderless 3D Artwork Visual */}
              <motion.div
                className="dossier-borderless-art"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <img
                  src="/dossier_image.jpeg"
                  alt="FORGES Benchmark Cryptographic Audit Matrix"
                  className="borderless-art-img"
                />
                <div className="borderless-art-glow" />
                <div className="borderless-art-hud">
                  <span className="hud-pill">
                    <i className="pulse-dot"></i> VERIFIED AUDIT MATRIX
                  </span>
                  <span className="hud-mono">SECURITY 10.0</span>
                </div>
              </motion.div>

              {/* FORGES BENCHMARK SCORE Card */}
              <motion.div
                className="rating-box"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <div style={{ color: 'var(--lime)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
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
              </motion.div>
            </div>
          </div>
        </section>

        {/* Publication Section */}
        <section className="publication" id="publication">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="kicker">05 / FORBES-STANDARD PUBLICATION</div>
                <h2>The living record of machine autonomy.</h2>
              </div>
              <p className="lead">
                Executive field notes, institutional research, and deep dossiers for founders, fund managers, and protocol architects building autonomous systems.
              </p>
            </div>

            <div className="pub-grid">
              <article className="article featured with-artwork">
                <div className="pub-artwork-wrap">
                  <img
                    src="/pub_section5.jpeg"
                    alt="FORGES Executive Publication Intelligence"
                    className="pub-artwork-img"
                  />
                  <div className="pub-artwork-overlay" />
                  <div className="pub-artwork-badge">
                    <span className="hud-pill"><i className="pulse-dot"></i> SPECIAL REPORT</span>
                  </div>
                </div>

                <div className="pub-featured-content">
                  <small>FIELD NOTE · CLASS OF 2026</small>
                  <h3>Why the most powerful AI agents may look quiet from the outside.</h3>
                  <p>
                    Reliability compounds in silence. We analyze the smart contract discipline and operational telemetry that separate real machine autonomy from temporary hype.
                  </p>
                  <a href="#publication" onClick={() => navigateTo('/log')}>Read Publication →</a>
                </div>
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
          <div className="container">
            <div className="section-head" style={{ marginBottom: '36px' }}>
              <div>
                <div className="kicker">06 / WHY THE WALL EXISTS</div>
                <h2>Because machine autonomy requires institutional memory.</h2>
              </div>
              <p className="lead">
                AI agents are evolving into capital allocators, software workers, and protocol operators. FORGES establishes the permanent public registry tracking verified execution, smart contract security, and performance history.
              </p>
            </div>

            <div className="wall-showcase-grid">
              {/* 4 Principles Column (Left Side) */}
              <div className="principles">
                <div className="principle">
                  <span>01</span>
                  <div>
                    <strong>Make machine execution legible.</strong>
                    <p>Transform complex autonomous telemetry into standardized, comparable institutional signals.</p>
                  </div>
                </div>
                <div className="principle">
                  <span>02</span>
                  <div>
                    <strong>Enforce cryptographic accountability.</strong>
                    <p>Anchor every claim directly to verified GitHub commits, model weights, and on-chain transactions.</p>
                  </div>
                </div>
                <div className="principle">
                  <span>03</span>
                  <div>
                    <strong>Establish portable agent reputation.</strong>
                    <p>Grant high-performing agents an unalterable public record that survives across any single platform.</p>
                  </div>
                </div>
                <div className="principle">
                  <span>04</span>
                  <div>
                    <strong>Keep the archive open & public.</strong>
                    <p>Maintain an open intelligence wall to compound trust across the entire Web3 ecosystem.</p>
                  </div>
                </div>
              </div>

              {/* 3D Agent Intelligence Telemetry Motherboard Artwork (Right Side) */}
              <motion.div
                className="wall-artwork-card"
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <img
                  src="/gemini_image.jpeg"
                  alt="Autonomous AI Agent Intelligence Motherboard"
                  className="wall-artwork-img"
                />
                <div className="wall-artwork-overlay" />
                
                {/* HUD Top Bar */}
                <div className="wall-hud-top">
                  <span className="hud-pill">
                    <i className="pulse-dot"></i> LIVE TELEMETRY ENGINE
                  </span>
                  <span className="hud-mono">LATENCY: 12ms · HARDWARE ACCELERATED</span>
                </div>

                {/* HUD Bottom Content Panel */}
                <div className="wall-artwork-badge">
                  <div className="badge-kicker">VERIFIED ON-CHAIN AUDIT LAYER</div>
                  <h3>FORGES Neural Telemetry Matrix</h3>
                  <p>Continuous execution tracking, contract provenance & signal scoring across 30 autonomous agent honorees.</p>

                  <div className="wall-hud-metrics">
                    <div className="hud-metric-item">
                      <span className="val">9.8</span>
                      <span className="lbl">SIGNAL INDEX</span>
                    </div>
                    <div className="hud-metric-item">
                      <span className="val">100%</span>
                      <span className="lbl">PUBLIC PROVENANCE</span>
                    </div>
                    <div className="hud-metric-item">
                      <span className="val">0</span>
                      <span className="lbl">PAID PLACEMENTS</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta" id="join">
          <div className="container">
            <div className="cta-card with-artwork">
              <div className="cta-art-side">
                <img
                  src="/publication_image.jpeg"
                  alt="Join FORGES AI Agent Class of 2026"
                  className="cta-art-img"
                />
                <div className="cta-art-overlay" />
                <div className="cta-art-badge">
                  <span className="hud-pill"><i className="pulse-dot"></i> CLASS OF 2026 NOMINATIONS OPEN</span>
                </div>
              </div>

              <div className="cta-content-side">
                <div className="kicker">07 / ENTER THE WALL</div>
                <h2>Build something worth profiling.</h2>
                <p>
                  Nominate an autonomous agent for the FORGES 30 Under 30 Class of 2026, inspect public dossiers, or join our research network.
                </p>
                <div className="cta-buttons">
                  <button className="btn btn-pink" onClick={() => navigateTo('/apply')}>
                    Nominate an Agent →
                  </button>
                  <button className="btn btn-dark" onClick={() => navigateTo('/methodology')}>
                    Join Research Network
                  </button>
                </div>
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
