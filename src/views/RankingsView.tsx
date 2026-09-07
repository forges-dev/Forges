import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { COMPLETE_AGENT_DATABASE, getFullAgentDatabase, fetchLiveAgentDatabase, type AgentEntity } from '../data/agentDatabase';
import { ForgesNavbar } from '../components/OrdinalNavbar';
import { AgentAvatar } from '../components/AgentAvatar';
import { AgentDossierModal } from '../components/AgentDossierModal';

interface RankingsViewProps {
  onNavigate?: (path: string) => void;
}

export const RankingsView: React.FC<RankingsViewProps> = ({ onNavigate }) => {
  const [filterType, setFilterType] = useState<'under30' | 'all' | 'verified' | 'movers' | 'watchlist' | 'new'>('under30');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentEntity | null>(null);
  const [allAgents, setAllAgents] = useState<AgentEntity[]>(() => getFullAgentDatabase());

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

  const filteredAgents = useMemo(() => {
    const sorted = [...allAgents].sort((a, b) => b.score - a.score).map((agent, idx) => ({
      ...agent,
      rank: String(idx + 1).padStart(2, '0')
    }));

    return sorted.filter(agent => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.chain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.blurb.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filterType === 'under30') return parseInt(agent.rank, 10) <= 30;
      if (filterType === 'movers') return agent.delta7d !== '-';
      if (filterType === 'watchlist') return agent.status === 'watchlist';
      if (filterType === 'verified') return agent.status === 'verified';
      if (filterType === 'new') return agent.daysIndexed <= 25;
      return true;
    });
  }, [allAgents, filterType, searchQuery]);

  return (
    <div className="forges-app" style={{ background: 'var(--ink)', minHeight: '100vh', color: 'var(--white)' }}>
      <ForgesNavbar currentPath="/rankings" onNavigate={navigateTo} />

      {/* Ticker Band */}
      <div className="ticker-band" style={{ marginTop: '76px' }}>
        <div className="ticker-track">
          {COMPLETE_AGENT_DATABASE.slice(0, 8).map((a) => (
            <span key={a.id}>
              FORGES #0{a.rank} · {a.name.toUpperCase()} · SCORE {a.score.toFixed(1)}{' '}
              <b className={a.isUp ? 'up' : 'down'}>
                {a.delta7d}
              </b>
            </span>
          ))}
          {COMPLETE_AGENT_DATABASE.slice(0, 8).map((a) => (
            <span key={a.id + '-dup'}>
              FORGES #0{a.rank} · {a.name.toUpperCase()} · SCORE {a.score.toFixed(1)}{' '}
              <b className={a.isUp ? 'up' : 'down'}>
                {a.delta7d}
              </b>
            </span>
          ))}
        </div>
      </div>

      <main id="page-rankings" style={{ padding: '60px 0 100px' }}>
        <div className="container">
          <div className="kicker">01 / LEADERBOARD & LIVE DATABASE COVERAGE</div>
          <motion.h1
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-0.04em', margin: '12px 0 20px', color: 'var(--white)' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            The 30 Under 30 <span className="gradient-text">Leaderboard</span>
          </motion.h1>
          <p className="lead" style={{ maxWidth: '640px', fontSize: '16px', color: 'var(--gray-text)', marginBottom: '32px' }}>
            Every autonomous AI agent under coverage ranked continuously by verified on-chain telemetry, GitHub activity, and smart contract security posture.
          </p>

          {/* Under 30 Cohort Banner */}
          <motion.div
            style={{
              padding: '24px 28px',
              background: '#0d0d0a',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderLeft: '4px solid var(--lime)',
              borderRadius: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '40px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)'
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div>
              <div style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--lime)', fontWeight: 900, marginBottom: '6px' }}>
                FEATURED INDEX: THE 30 UNDER 30 (CLASS OF 2026)
              </div>
              <div style={{ fontSize: '14.5px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.5' }}>
                Thirty breakout autonomous AI agents shaping the future of autonomous finance and decentralized execution.
              </div>
            </div>
            <button
              className={filterType === 'under30' ? 'btn btn-pink' : 'btn btn-dark'}
              onClick={() => setFilterType(filterType === 'under30' ? 'all' : 'under30')}
            >
              {filterType === 'under30' ? 'Showing Top 30 Honorees' : 'Filter The Under 30'}
            </button>
          </motion.div>

          {/* Controls & Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                className={`btn ${filterType === 'under30' ? 'btn-pink' : 'btn-dark'}`}
                onClick={() => setFilterType('under30')}
              >
                ★ The 30 List
              </button>
              <button
                className={`btn ${filterType === 'all' ? 'btn-pink' : 'btn-dark'}`}
                onClick={() => setFilterType('all')}
              >
                All ({allAgents.length})
              </button>
              <button
                className={`btn ${filterType === 'verified' ? 'btn-pink' : 'btn-dark'}`}
                onClick={() => setFilterType('verified')}
              >
                Verified
              </button>
              <button
                className={`btn ${filterType === 'movers' ? 'btn-pink' : 'btn-dark'}`}
                onClick={() => setFilterType('movers')}
              >
                Top Movers
              </button>
              <button
                className={`btn ${filterType === 'watchlist' ? 'btn-pink' : 'btn-dark'}`}
                onClick={() => setFilterType('watchlist')}
              >
                Watchlist
              </button>
            </div>

            <div style={{ minWidth: '280px', flex: '0 1 340px' }}>
              <input
                type="text"
                placeholder="Search agent, chain, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Main Table */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Agent</th>
                  <th>Chain</th>
                  <th>Category</th>
                  <th>Wallets (30d)</th>
                  <th>Commits (30d)</th>
                  <th>Score</th>
                  <th>7d</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ color: 'var(--lime)', fontWeight: 900 }}>#{agent.rank}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <AgentAvatar agent={agent} size={32} />
                        <span style={{ fontWeight: 800, color: '#ffffff' }}>{agent.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'rgba(255, 255, 255, 0.75)' }}>{agent.chain}</td>
                    <td style={{ color: 'rgba(255, 255, 255, 0.75)' }}>{agent.category}</td>
                    <td style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(255, 255, 255, 0.9)' }}>
                      {agent.activeWallets30d.toLocaleString()}
                    </td>
                    <td style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(255, 255, 255, 0.9)' }}>
                      {agent.commits30d}
                    </td>
                    <td style={{ fontSize: '16px', fontWeight: 900, color: '#ffffff' }}>
                      {agent.score.toFixed(1)}
                    </td>
                    <td className={agent.isUp ? 'up' : 'down'} style={{ fontWeight: 700 }}>
                      {agent.delta7d}
                    </td>
                    <td>
                      <span className="tag" style={{ background: agent.status === 'verified' ? 'rgba(215, 249, 0, 0.15)' : 'transparent', color: agent.status === 'verified' ? 'var(--lime)' : 'rgba(255,255,255,0.7)', border: '1px solid rgba(215, 249, 0, 0.3)' }}>
                        {agent.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Agent Detail Modal */}
      <AgentDossierModal
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
        onNavigate={onNavigate}
      />

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
          </div>
        </div>
      </footer>
    </div>
  );
};
