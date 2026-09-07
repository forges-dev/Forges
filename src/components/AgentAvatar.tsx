import React, { useState } from 'react';

interface AgentAvatarProps {
  agent: {
    name: string;
    avatar?: string;
    website?: string;
    slug?: string;
  };
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

// Curated high-res Web3 CDN logos for top agents
const KNOWN_AGENT_LOGOS: Record<string, string> = {
  'cipherworks': 'https://www.google.com/s2/favicons?domain=cipherworks.ai&sz=128',
  'clanker-tokenbot': 'https://www.google.com/s2/favicons?domain=clanker.world&sz=128',
  'clanker': 'https://www.google.com/s2/favicons?domain=clanker.world&sz=128',
  'clanker (tokenbot)': 'https://www.google.com/s2/favicons?domain=clanker.world&sz=128',
  'nosana': 'https://www.google.com/s2/favicons?domain=nosana.com&sz=128',
  'nosana (nos)': 'https://www.google.com/s2/favicons?domain=nosana.com&sz=128',
  'myshell': 'https://www.google.com/s2/favicons?domain=myshell.ai&sz=128',
  'myshell (shell)': 'https://www.google.com/s2/favicons?domain=myshell.ai&sz=128',
  'bittensor': 'https://www.google.com/s2/favicons?domain=bittensor.com&sz=128',
  'bittensor (tao)': 'https://www.google.com/s2/favicons?domain=bittensor.com&sz=128',
  'fetch-ai': 'https://www.google.com/s2/favicons?domain=fetch.ai&sz=128',
  'fetch.ai': 'https://www.google.com/s2/favicons?domain=fetch.ai&sz=128',
  'fetch.ai (fet)': 'https://www.google.com/s2/favicons?domain=fetch.ai&sz=128',
  'agent-zero': 'https://raw.githubusercontent.com/agent0ai/agent-zero/main/docs/logo.png',
  'agent zero': 'https://raw.githubusercontent.com/agent0ai/agent-zero/main/docs/logo.png',
  'agent zero (a0t)': 'https://raw.githubusercontent.com/agent0ai/agent-zero/main/docs/logo.png',
  'elizaos': 'https://raw.githubusercontent.com/elizaOS/eliza/main/packages/client-twitter/assets/logo.png',
  'virtuals-protocol': 'https://www.google.com/s2/favicons?domain=virtuals.io&sz=128',
  'virtuals protocol': 'https://www.google.com/s2/favicons?domain=virtuals.io&sz=128',
  'chaingpt': 'https://www.google.com/s2/favicons?domain=chaingpt.org&sz=128',
  'chaingpt (cgpt)': 'https://www.google.com/s2/favicons?domain=chaingpt.org&sz=128',
  'moltbook': 'https://avatars.githubusercontent.com/u/190847983?v=4',
  'pippin-agent': 'https://www.google.com/s2/favicons?domain=pippin.love&sz=128',
  'pippin': 'https://www.google.com/s2/favicons?domain=pippin.love&sz=128',
  'paal-ai': 'https://www.google.com/s2/favicons?domain=paal.ai&sz=128',
  'paal ai': 'https://www.google.com/s2/favicons?domain=paal.ai&sz=128',
  'bankr': 'https://www.google.com/s2/favicons?domain=bankr.bot&sz=128',
  'bankr (bnkr)': 'https://www.google.com/s2/favicons?domain=bankr.bot&sz=128',
  'heurist': 'https://www.google.com/s2/favicons?domain=heurist.ai&sz=128',
  'heurist (heu)': 'https://www.google.com/s2/favicons?domain=heurist.ai&sz=128',
  'solana-agent-kit': 'https://raw.githubusercontent.com/sendaifun/solana-agent-kit/main/logo.png',
  'solana agent kit': 'https://raw.githubusercontent.com/sendaifun/solana-agent-kit/main/logo.png',
  'talus-network': 'https://www.google.com/s2/favicons?domain=talus.network&sz=128',
  'talus network': 'https://www.google.com/s2/favicons?domain=talus.network&sz=128',
  'wayfinder': 'https://www.google.com/s2/favicons?domain=wayfinder.ai&sz=128',
  'wayfinder (prompt)': 'https://www.google.com/s2/favicons?domain=wayfinder.ai&sz=128',
  'almanak': 'https://www.google.com/s2/favicons?domain=almanak.co&sz=128',
  'theoriq': 'https://www.google.com/s2/favicons?domain=theoriq.ai&sz=128',
  'theoriq (thq)': 'https://www.google.com/s2/favicons?domain=theoriq.ai&sz=128',
  'sentient': 'https://www.google.com/s2/favicons?domain=sentient.xyz&sz=128',
  'sentient (sent)': 'https://www.google.com/s2/favicons?domain=sentient.xyz&sz=128',
  'chaos-labs': 'https://www.google.com/s2/favicons?domain=chaoslabs.xyz&sz=128',
  'chaos labs': 'https://www.google.com/s2/favicons?domain=chaoslabs.xyz&sz=128',
  'chaos labs (chaos)': 'https://www.google.com/s2/favicons?domain=chaoslabs.xyz&sz=128',
  'freysa': 'https://www.google.com/s2/favicons?domain=freysa.ai&sz=128',
  'freysa (fai)': 'https://www.google.com/s2/favicons?domain=freysa.ai&sz=128',
  'autonolas': 'https://www.google.com/s2/favicons?domain=olas.network&sz=128',
  'autonolas (olas)': 'https://www.google.com/s2/favicons?domain=olas.network&sz=128',
  '0g-labs': 'https://www.google.com/s2/favicons?domain=0g.ai&sz=128',
  '0g labs': 'https://www.google.com/s2/favicons?domain=0g.ai&sz=128',
  '0g': 'https://www.google.com/s2/favicons?domain=0g.ai&sz=128',
  '0g labs (og / aogi)': 'https://www.google.com/s2/favicons?domain=0g.ai&sz=128',
  'luna': 'https://www.google.com/s2/favicons?domain=virtuals.io&sz=128',
  'luna by virtuals': 'https://www.google.com/s2/favicons?domain=virtuals.io&sz=128',
  'truth-terminal': 'https://www.google.com/s2/favicons?domain=truthcollective.foundation&sz=128',
  'truth terminal': 'https://www.google.com/s2/favicons?domain=truthcollective.foundation&sz=128',
  'aixbt': 'https://www.google.com/s2/favicons?domain=aixbt.tech&sz=128',
  'promethia': 'https://www.google.com/s2/favicons?domain=promethia.finance&sz=128',
  'promethia (pro)': 'https://www.google.com/s2/favicons?domain=promethia.finance&sz=128',
  'aurelia': 'https://www.google.com/s2/favicons?domain=aurelia.ai&sz=128',
  'aurelia ai': 'https://www.google.com/s2/favicons?domain=aurelia.ai&sz=128',
  'clawd': 'https://avatars.githubusercontent.com/u/190847983?v=4',
  'clawd (clawd.atg.eth)': 'https://avatars.githubusercontent.com/u/190847983?v=4',
  'zerebro': 'https://www.google.com/s2/favicons?domain=zerebro.org&sz=128',
  'gokite': 'https://www.google.com/s2/favicons?domain=gokite.ai&sz=128',
  'recall': 'https://www.google.com/s2/favicons?domain=recall.network&sz=128',
  'naptha': 'https://www.google.com/s2/favicons?domain=naptha.ai&sz=128',
  'griffain': 'https://www.google.com/s2/favicons?domain=griffain.com&sz=128',
  'vader-ai': 'https://www.google.com/s2/favicons?domain=vaderai.ai&sz=128',
  'cod3x': 'https://www.google.com/s2/favicons?domain=cod3x.org&sz=128',
  'sky-ai': 'https://www.google.com/s2/favicons?domain=skyai.pro&sz=128'
};

export const extractCleanDomain = (website?: string): string | null => {
  if (!website || website === 'N/A' || website === 'NONE' || website.trim() === '') return null;
  try {
    const cleanUrl = website.startsWith('http') ? website : `https://${website}`;
    const url = new URL(cleanUrl);
    let domain = url.hostname.replace(/^www\./, '').toLowerCase();

    // Extract root domain from subdomains like app.virtuals.io or docs.cipherworks.ai
    if (domain.startsWith('app.') || domain.startsWith('docs.') || domain.startsWith('api.') || domain.startsWith('beta.')) {
      const parts = domain.split('.');
      if (parts.length > 2) {
        domain = parts.slice(-2).join('.');
      }
    }

    if (!domain || domain === 'localhost') return null;
    return domain;
  } catch {
    return null;
  }
};

export const getFaviconSources = (website?: string, agentName?: string, slug?: string): string[] => {
  const sources: string[] = [];
  const keySlug = (slug || '').toLowerCase().trim();
  const keyName = (agentName || '').toLowerCase().trim();
  const cleanName = keyName.replace(/\s*\([^)]*\)/g, '').trim();
  const cleanSlug = keySlug.replace(/-agent$/, '').trim();

  // 1. Curated verified logo
  const curated = KNOWN_AGENT_LOGOS[keySlug] || KNOWN_AGENT_LOGOS[keyName] || KNOWN_AGENT_LOGOS[cleanName] || KNOWN_AGENT_LOGOS[cleanSlug];
  if (curated) {
    sources.push(curated);
  }

  const domain = extractCleanDomain(website);
  if (domain) {
    // 2. Google Favicons API (128px high-res)
    const googleUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    if (!sources.includes(googleUrl)) sources.push(googleUrl);

    // 3. DuckDuckGo Favicon CDN
    const ddgUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    if (!sources.includes(ddgUrl)) sources.push(ddgUrl);

    // 4. Unavatar Multi-Source Favicon API
    const unavatarUrl = `https://unavatar.io/${domain}`;
    if (!sources.includes(unavatarUrl)) sources.push(unavatarUrl);

    // 5. Icon Horse CDN
    const iconHorseUrl = `https://icon.horse/icon/${domain}`;
    if (!sources.includes(iconHorseUrl)) sources.push(iconHorseUrl);
  }

  return sources;
};

export const getFaviconUrl = (website?: string, agentName?: string, slug?: string): string | null => {
  const sources = getFaviconSources(website, agentName, slug);
  return sources.length > 0 ? sources[0] : null;
};

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agent,
  size = 28,
  className = '',
  style = {}
}) => {
  const slug = (agent as any).slug || agent.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const sources = React.useMemo(() => getFaviconSources(agent.website, agent.name, slug), [agent.website, agent.name, slug]);
  const [sourceIdx, setSourceIdx] = useState(0);
  const dimension = typeof size === 'number' ? `${size}px` : size;

  if (sourceIdx < sources.length) {
    return (
      <span
        className={`aside-avatar ${className}`}
        style={{
          width: dimension,
          height: dimension,
          minWidth: dimension,
          minHeight: dimension,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          border: '1px solid var(--gray-border-strong)',
          padding: '2px',
          boxSizing: 'border-box',
          verticalAlign: 'middle',
          cursor: 'pointer',
          ...style
        }}
      >
        <img
          src={sources[sourceIdx]}
          alt={`${agent.name} logo`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '50%',
            display: 'block'
          }}
          onError={() => setSourceIdx((prev) => prev + 1)}
          loading="lazy"
        />
      </span>
    );
  }

  // Editorial monogram badge for agents without an external logo
  return (
    <span
      className={`aside-avatar ${className}`}
      style={{
        width: dimension,
        height: dimension,
        minWidth: dimension,
        minHeight: dimension,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: '#0d0d0a',
        color: 'var(--lime)',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: typeof size === 'number' ? `${Math.max(10, Math.floor(size * 0.38))}px` : '0.75rem',
        fontWeight: 800,
        letterSpacing: '-0.5px',
        verticalAlign: 'middle',
        border: '1px solid var(--lime)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        ...style
      }}
    >
      {agent.avatar || agent.name.slice(0, 2).toUpperCase()}
    </span>
  );
};

export const AgentCardImage: React.FC<{
  agent: {
    name: string;
    avatar?: string;
    website?: string;
    slug?: string;
  };
}> = ({ agent }) => {
  const slug = (agent as any).slug || agent.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const sources = React.useMemo(() => getFaviconSources(agent.website, agent.name, slug), [agent.website, agent.name, slug]);
  const [sourceIdx, setSourceIdx] = useState(0);

  if (sourceIdx < sources.length) {
    return (
      <img
        src={sources[sourceIdx]}
        alt={agent.name}
        className="agent-full-img"
        onError={() => setSourceIdx((prev) => prev + 1)}
        loading="lazy"
      />
    );
  }

  return (
    <div className="agent-full-fallback">
      {agent.avatar || agent.name.slice(0, 2).toUpperCase()}
    </div>
  );
};
