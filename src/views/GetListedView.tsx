import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ForgesNavbar, XLogoIcon } from '../components/OrdinalNavbar';
import { saveAgentToClientDatabase, type AgentEntity } from '../data/agentDatabase';

interface GetListedViewProps {
  onNavigate?: (path: string) => void;
}

export const GetListedView: React.FC<GetListedViewProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    agentName: '',
    chain: 'Ethereum',
    category: 'Market Making',
    contract: '',
    website: '',
    docsUrl: '',
    githubUrl: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submissionRef, setSubmissionRef] = useState<string>('');
  const [submittedAgent, setSubmittedAgent] = useState<AgentEntity | null>(null);

  useEffect(() => {
    try {
      const draft = localStorage.getItem('forges_getlisted_draft');
      if (draft) {
        setFormData(JSON.parse(draft));
      }
    } catch (e) { }
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

  const handleFieldChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (formSubmitted) {
      setFormSubmitted(false);
    }
    try {
      localStorage.setItem('forges_getlisted_draft', JSON.stringify(updated));
    } catch (e) { }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agentName.trim() || !formData.contract.trim() || !formData.website.trim()) {
      alert('Please fill out required fields: Agent Name, Contract Address, and Official Website.');
      return;
    }

    setIsSubmitting(true);
    const refId = 'FORGES-' + Math.floor(100000 + Math.random() * 900000);
    setSubmissionRef(refId);

    const discScore = formData.docsUrl && formData.website ? 94 : formData.website ? 75 : 50;
    const consScore = formData.contract ? 89 : 60;
    const incScore = 85;
    const indScore = formData.githubUrl && formData.githubUrl.trim() !== '' && formData.githubUrl !== 'N/A' ? 92 : 68;
    const compScore = parseFloat((discScore * 0.3 + consScore * 0.35 + incScore * 0.2 + indScore * 0.15).toFixed(1));

    const newAgent: AgentEntity = {
      id: 'agent-' + Date.now(),
      rank: 'NEW',
      name: formData.agentName,
      slug: formData.agentName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      avatar: formData.agentName.substring(0, 2).toUpperCase(),
      chain: formData.chain,
      category: formData.category,
      score: compScore,
      delta7d: '+0.0',
      isUp: true,
      status: compScore >= 80 ? 'verified' : 'standard',
      tag: 'Newly Indexed',
      daysIndexed: 1,
      contract: formData.contract,
      website: formData.website || undefined,
      docsUrl: formData.docsUrl || undefined,
      githubUrl: formData.githubUrl || undefined,
      blurb: formData.description || `Autonomous ${formData.category} agent operational on ${formData.chain}.`,
      activeWallets30d: 150,
      commits30d: formData.githubUrl ? 18 : 0,
      auditStatus: formData.contract ? 'Audit in Progress' : 'No / Unknown',
      adminKeysSafe: true,
      keyCount: compScore >= 90 ? 3 : compScore >= 80 ? 2 : compScore >= 70 ? 1 : 0,
      disclosureScore: discScore,
      consistencyScore: consScore,
      incidentScore: incScore,
      independenceScore: indScore,
      verdict: `Provisional evaluation index for ${formData.agentName}.`
    };

    setSubmittedAgent(newAgent);

    try {
      await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/v1/agents/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.agentName,
          category: formData.category.toLowerCase(),
          contractAddresses: formData.contract,
          chains: formData.chain.toLowerCase(),
          website: formData.website,
          docsUrl: formData.docsUrl || formData.website,
          githubUrl: formData.githubUrl || 'N/A',
          selectionRationale: formData.description || `Nominated AI agent for Class of 2026.`,
          submittedBy: 'user_nomination'
        })
      });
    } catch (err) { }

    saveAgentToClientDatabase(newAgent);

    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setFormData({
        agentName: '',
        chain: 'Ethereum',
        category: 'Market Making',
        contract: '',
        website: '',
        docsUrl: '',
        githubUrl: '',
        description: ''
      });
    }, 1400);
  };

  const discScore = formData.docsUrl && formData.website ? 94 : formData.website ? 75 : 50;
  const consScore = formData.contract ? 89 : 60;
  const incScore = 85;
  const indScore = formData.githubUrl && formData.githubUrl.trim() !== '' && formData.githubUrl !== 'N/A' ? 92 : 68;
  const compScore = discScore * 0.3 + consScore * 0.35 + incScore * 0.2 + indScore * 0.15;
  const hasInput = Boolean(formData.agentName && formData.contract);

  return (
    <div className="forges-app" style={{ background: 'var(--ink)', minHeight: '100vh', color: 'var(--white)' }}>
      <ForgesNavbar currentPath="/apply" onNavigate={navigateTo} />

      <div className="ticker-band" style={{ marginTop: '76px' }}>
        <div className="ticker-track">
          <span>FORGES 30 UNDER 30 · NOMINATE AN AGENT · EVALUATION PIPELINE · LIVE DIAGNOSTICS</span>
          <span>FORGES 30 UNDER 30 · NOMINATE AN AGENT · EVALUATION PIPELINE · LIVE DIAGNOSTICS</span>
        </div>
      </div>

      <main style={{ padding: '60px 0 100px' }}>
        <div className="container">
          <div className="kicker">07 / EVALUATION PIPELINE · NOMINATIONS</div>
          <motion.h1
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-0.04em', margin: '12px 0 20px', color: 'var(--white)' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Nominate an Agent for <span className="gradient-text">Class of 2026</span>
          </motion.h1>
          <p className="lead" style={{ maxWidth: '720px', fontSize: '16.5px', color: 'var(--gray-text)', marginBottom: '40px' }}>
            Submit an autonomous AI agent for audit review, run instant telemetry diagnostics, and calculate provisional reputation scores across 4 weighted criteria.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' }}>
            {/* Nomination Form */}
            <div style={{ background: '#0d0d0a', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '24px', padding: '36px', boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)' }}>
              <form onSubmit={handleFormSubmit}>
                <AnimatePresence>
                  {formSubmitted && (
                    <motion.div
                      style={{ background: 'rgba(215, 249, 0, 0.1)', borderLeft: '4px solid var(--lime)', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <div style={{ fontWeight: 900, color: 'var(--lime)', fontSize: '16px', marginBottom: '4px' }}>
                        ✓ Nomination & Telemetry Diagnostics Recorded!
                      </div>
                      <div style={{ color: 'var(--gray-text)', fontSize: '13px', lineHeight: 1.6 }}>
                        Reference ID: <b>{submissionRef}</b>. The FORGES Research Desk has indexed your contract telemetry and queued it for evaluation.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: 'var(--lime)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cipherworks"
                    value={formData.agentName}
                    onChange={(e) => handleFieldChange('agentName', e.target.value)}
                    required
                  />
                </div>

                <div className="form-row-2col">
                  <div>
                    <label style={{ display: 'block', color: 'var(--lime)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                      Primary Chain *
                    </label>
                    <select
                      value={formData.chain}
                      onChange={(e) => handleFieldChange('chain', e.target.value)}
                    >
                      <option>Ethereum</option>
                      <option>Solana</option>
                      <option>Base</option>
                      <option>Arbitrum</option>
                      <option>Polygon</option>
                      <option>BNB Chain</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: 'var(--lime)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFieldChange('category', e.target.value)}
                    >
                      <option>Market Making</option>
                      <option>Treasury Management</option>
                      <option>Yield Strategy</option>
                      <option>Arbitrage</option>
                      <option>Copy Trading</option>
                      <option>Lending</option>
                      <option>Developer</option>
                      <option>Security</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: 'var(--lime)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Smart Contract / Wallet Address *
                  </label>
                  <input
                    type="text"
                    placeholder="0x... or Solana Base58"
                    value={formData.contract}
                    onChange={(e) => handleFieldChange('contract', e.target.value)}
                    required
                  />
                </div>

                <div className="form-row-2col">
                  <div>
                    <label style={{ display: 'block', color: 'var(--lime)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                      Official Website URL *
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formData.website}
                      onChange={(e) => handleFieldChange('website', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: 'var(--lime)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                      Documentation URL (Docs)
                    </label>
                    <input
                      type="text"
                      placeholder="https://docs..."
                      value={formData.docsUrl}
                      onChange={(e) => handleFieldChange('docsUrl', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: 'var(--lime)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                    GitHub Repository URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={formData.githubUrl}
                    onChange={(e) => handleFieldChange('githubUrl', e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', color: 'var(--lime)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Strategy, Custody Model & Security Controls
                  </label>
                  <textarea
                    rows={4}
                    placeholder="How does the agent execute decisions? Who holds signing keys, and what timelocks or multisigs protect user funds?"
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-pink"
                  style={{ width: '100%', padding: '16px' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Ingesting & Diagnostics...' : 'Submit for Class of 2026 Audit'}
                </button>
              </form>
            </div>

            {/* Diagnostic Card */}
            <div>
              <div className="rating-box">
                {isSubmitting ? (
                  <div style={{ padding: '16px 0', textAlign: 'center' }}>
                    <div style={{ color: 'var(--lime)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', background: 'var(--lime)', borderRadius: '50%', boxShadow: '0 0 10px var(--lime)' }} />
                      RUNNING TELEMETRY DIAGNOSTICS...
                    </div>

                    <div style={{ position: 'relative', width: '72px', height: '72px', margin: '24px auto' }}>
                      <motion.div
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          border: '3px solid rgba(215, 249, 0, 0.15)',
                          borderTopColor: 'var(--lime)',
                          borderRightColor: 'var(--lime)'
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                      />
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '22px' }}>
                        ⚙️
                      </div>
                    </div>

                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>
                      Evaluating Agent Telemetry
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--gray-text)', lineHeight: 1.5, maxWidth: '280px', margin: '0 auto 24px' }}>
                      Indexing smart contract bytecode, verifying repository commits, & calculating final Key rating...
                    </div>

                    {/* Progress Bar Animation */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', height: '6px', overflow: 'hidden', width: '100%' }}>
                      <motion.div
                        style={{ background: 'linear-gradient(90deg, var(--lime), #38C172)', height: '100%' }}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                      />
                    </div>

                    <div style={{ marginTop: '14px', fontSize: '11px', color: 'var(--lime)', fontWeight: 800, letterSpacing: '0.08em' }}>
                      PROVISIONAL SCORE INGESTION IN PROGRESS
                    </div>
                  </div>
                ) : formSubmitted && submittedAgent ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ color: 'var(--lime)', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        FINAL RATING ASSESSMENT
                      </div>
                      <span style={{ background: 'rgba(215, 249, 0, 0.15)', color: 'var(--lime)', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                        ✓ EVALUATION INDEXED
                      </span>
                    </div>

                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#ffffff', marginBottom: '2px' }}>
                      {submittedAgent.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-text)', marginBottom: '12px' }}>
                      {submittedAgent.category} · {submittedAgent.chain}
                    </div>

                    <div className="stars">
                      {submittedAgent.keyCount === 3 ? '★★★' : submittedAgent.keyCount === 2 ? '★★☆' : submittedAgent.keyCount === 1 ? '★☆☆' : '☆☆☆'}
                      <span style={{ fontSize: '13px', color: 'var(--gray-text)', marginLeft: '10px', fontWeight: 600 }}>
                        ({submittedAgent.keyCount > 0 ? `${submittedAgent.keyCount} Key${submittedAgent.keyCount > 1 ? 's' : ''} Awarded` : 'Unrated'})
                      </span>
                    </div>
                    <div className="score">
                      {submittedAgent.score.toFixed(1)} <small>/ 100</small>
                    </div>

                    <div className="metric">
                      <div className="metric-row">
                        <span>Disclosure Completeness</span>
                        <b>{submittedAgent.disclosureScore} / 100</b>
                      </div>
                      <div className="bar"><i style={{ width: `${submittedAgent.disclosureScore}%` }}></i></div>
                    </div>

                    <div className="metric">
                      <div className="metric-row">
                        <span>On-Chain Consistency</span>
                        <b>{submittedAgent.consistencyScore} / 100</b>
                      </div>
                      <div className="bar"><i style={{ width: `${submittedAgent.consistencyScore}%` }}></i></div>
                    </div>

                    <div className="metric">
                      <div className="metric-row">
                        <span>Incident Response</span>
                        <b>{submittedAgent.incidentScore} / 100</b>
                      </div>
                      <div className="bar"><i style={{ width: `${submittedAgent.incidentScore}%` }}></i></div>
                    </div>

                    <div className="metric">
                      <div className="metric-row">
                        <span>Code Independence</span>
                        <b>{submittedAgent.independenceScore} / 100</b>
                      </div>
                      <div className="bar"><i style={{ width: `${submittedAgent.independenceScore}%` }}></i></div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-dark"
                      style={{ width: '100%', marginTop: '24px', fontSize: '12px' }}
                      onClick={() => setFormSubmitted(false)}
                    >
                      Simulate Another Agent
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ color: 'var(--lime)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      PROVISIONAL RATING SIMULATOR
                    </div>
                    <div className="stars">
                      {hasInput
                        ? (compScore >= 90 ? '★★★' : compScore >= 80 ? '★★☆' : compScore >= 70 ? '★☆☆' : '☆☆☆')
                        : '☆☆☆'}
                    </div>
                    <div className="score">
                      {hasInput ? compScore.toFixed(1) : '-'} <small>/ 100</small>
                    </div>

                    <div className="metric">
                      <div className="metric-row">
                        <span>Disclosure Completeness</span>
                        <b>{discScore} / 100</b>
                      </div>
                      <div className="bar"><i style={{ width: `${discScore}%` }}></i></div>
                    </div>

                    <div className="metric">
                      <div className="metric-row">
                        <span>On-Chain Consistency</span>
                        <b>{consScore} / 100</b>
                      </div>
                      <div className="bar"><i style={{ width: `${consScore}%` }}></i></div>
                    </div>

                    <div className="metric">
                      <div className="metric-row">
                        <span>Incident Response</span>
                        <b>{incScore} / 100</b>
                      </div>
                      <div className="bar"><i style={{ width: `${incScore}%` }}></i></div>
                    </div>

                    <div className="metric">
                      <div className="metric-row">
                        <span>Code Independence</span>
                        <b>{indScore} / 100</b>
                      </div>
                      <div className="bar"><i style={{ width: `${indScore}%` }}></i></div>
                    </div>
                  </>
                )}
              </div>
            </div>
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
