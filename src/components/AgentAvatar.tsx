import React, { useState } from 'react';
import { motion } from 'framer-motion';

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

// Curated high-res Web3 logos for established networks & agents
const KNOWN_AGENT_LOGOS: Record<string, string> = {
  'cipherworks': 'https://www.google.com/s2/favicons?domain=cipherworks.ai&sz=128',
  'clanker-tokenbot': 'https://assets.coingecko.com/coins/images/51860/standard/clanker.png',
  'clanker': 'https://assets.coingecko.com/coins/images/51860/standard/clanker.png',
  'clanker (tokenbot)': 'https://assets.coingecko.com/coins/images/51860/standard/clanker.png',
  'nosana': 'https://assets.coingecko.com/coins/images/22564/standard/nosana.png',
  'nosana (nos)': 'https://assets.coingecko.com/coins/images/22564/standard/nosana.png',
  'myshell': 'https://assets.coingecko.com/coins/images/34947/standard/myshell.png',
  'myshell (shell)': 'https://assets.coingecko.com/coins/images/34947/standard/myshell.png',
  'bittensor': 'https://assets.coingecko.com/coins/images/29854/standard/bittensor-logo-clean-200.png',
  'bittensor (tao)': 'https://assets.coingecko.com/coins/images/29854/standard/bittensor-logo-clean-200.png',
  'fetch-ai': 'https://assets.coingecko.com/coins/images/5681/standard/Fetch.jpg',
  'fetch.ai': 'https://assets.coingecko.com/coins/images/5681/standard/Fetch.jpg',
  'fetch.ai (fet)': 'https://assets.coingecko.com/coins/images/5681/standard/Fetch.jpg',
  'agent-zero': 'https://raw.githubusercontent.com/agent0ai/agent-zero/main/docs/logo.png',
  'agent zero': 'https://raw.githubusercontent.com/agent0ai/agent-zero/main/docs/logo.png',
  'agent zero (a0t)': 'https://raw.githubusercontent.com/agent0ai/agent-zero/main/docs/logo.png',
  'elizaos': 'https://raw.githubusercontent.com/elizaOS/eliza/main/packages/client-twitter/assets/logo.png',
  'virtuals-protocol': 'https://assets.coingecko.com/coins/images/33077/standard/virtuals.png',
  'virtuals protocol': 'https://assets.coingecko.com/coins/images/33077/standard/virtuals.png',
  'chaingpt': 'https://assets.coingecko.com/coins/images/29729/standard/ChainGPT_Logo.png',
  'chaingpt (cgpt)': 'https://assets.coingecko.com/coins/images/29729/standard/ChainGPT_Logo.png',
  'moltbook': 'https://avatars.githubusercontent.com/u/190847983?v=4',
  'pippin-agent': 'https://assets.coingecko.com/coins/images/51493/standard/pippin.png',
  'pippin': 'https://assets.coingecko.com/coins/images/51493/standard/pippin.png',
  'paal-ai': 'https://assets.coingecko.com/coins/images/30748/standard/Paal.png',
  'paal ai': 'https://assets.coingecko.com/coins/images/30748/standard/Paal.png',
  'bankr': 'https://bankr.bot/favicon.ico',
  'bankr (bnkr)': 'https://bankr.bot/favicon.ico',
  'heurist': 'https://assets.coingecko.com/coins/images/38600/standard/heurist.jpg',
  'heurist (heu)': 'https://assets.coingecko.com/coins/images/38600/standard/heurist.jpg',
  'solana-agent-kit': 'https://raw.githubusercontent.com/sendaifun/solana-agent-kit/main/logo.png',
  'solana agent kit': 'https://raw.githubusercontent.com/sendaifun/solana-agent-kit/main/logo.png',
  'talus-network': 'https://talus.network/favicon.ico',
  'talus network': 'https://talus.network/favicon.ico',
  'wayfinder': 'https://wayfinder.ai/favicon.ico',
  'wayfinder (prompt)': 'https://wayfinder.ai/favicon.ico',
  'almanak': 'https://assets.coingecko.com/coins/images/35000/standard/almanak.png',
  'theoriq': 'https://theoriq.ai/favicon.ico',
  'theoriq (thq)': 'https://theoriq.ai/favicon.ico',
  'sentient': 'https://sentient.xyz/favicon.ico',
  'sentient (sent)': 'https://sentient.xyz/favicon.ico',
  'chaos-labs': 'https://chaoslabs.xyz/favicon.ico',
  'chaos labs': 'https://chaoslabs.xyz/favicon.ico',
  'chaos labs (chaos)': 'https://chaoslabs.xyz/favicon.ico',
  'freysa': 'https://freysa.ai/favicon.ico',
  'freysa (fai)': 'https://freysa.ai/favicon.ico',
  'autonolas': 'https://assets.coingecko.com/coins/images/31034/standard/olas.png',
  'autonolas (olas)': 'https://assets.coingecko.com/coins/images/31034/standard/olas.png',
  '0g-labs': 'https://assets.coingecko.com/coins/images/36000/standard/0g.png',
  '0g labs': 'https://assets.coingecko.com/coins/images/36000/standard/0g.png',
  '0g': 'https://assets.coingecko.com/coins/images/36000/standard/0g.png',
  '0g labs (og / aogi)': 'https://assets.coingecko.com/coins/images/36000/standard/0g.png',
  'luna': 'https://assets.coingecko.com/coins/images/33077/standard/virtuals.png',
  'luna by virtuals': 'https://assets.coingecko.com/coins/images/33077/standard/virtuals.png',
  'truth-terminal': 'https://assets.coingecko.com/coins/images/50787/standard/goat.jpg',
  'truth terminal': 'https://assets.coingecko.com/coins/images/50787/standard/goat.jpg',
  'aixbt': 'https://assets.coingecko.com/coins/images/51761/standard/aixbt.jpg',
  'promethia': 'https://promethia.finance/favicon.ico',
  'promethia (pro)': 'https://promethia.finance/favicon.ico',
  'aurelia': 'https://aurelia.ai/favicon.ico',
  'aurelia ai': 'https://aurelia.ai/favicon.ico',
  'clawd': 'https://avatars.githubusercontent.com/u/190847983?v=4',
  'clawd (clawd.atg.eth)': 'https://avatars.githubusercontent.com/u/190847983?v=4',
};



export const getFaviconUrl = (website?: string, agentName?: string, slug?: string): string | null => {
  const keySlug = (slug || '').toLowerCase().trim();
  const keyName = (agentName || '').toLowerCase().trim();
  const cleanName = keyName.replace(/\s*\([^)]*\)/g, '').trim();
  const cleanSlug = keySlug.replace(/-agent$/, '').trim();

  if (KNOWN_AGENT_LOGOS[keySlug]) return KNOWN_AGENT_LOGOS[keySlug];
  if (KNOWN_AGENT_LOGOS[keyName]) return KNOWN_AGENT_LOGOS[keyName];
  if (KNOWN_AGENT_LOGOS[cleanName]) return KNOWN_AGENT_LOGOS[cleanName];
  if (KNOWN_AGENT_LOGOS[cleanSlug]) return KNOWN_AGENT_LOGOS[cleanSlug];

  if (!website || website === 'N/A' || website === 'NONE' || website === '') return null;

  try {
    const cleanUrl = website.startsWith('http') ? website : `https://${website}`;
    const url = new URL(cleanUrl);
    const domain = url.hostname.replace(/^www\./, '').toLowerCase();
    if (!domain || domain === 'localhost') return null;

    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return null;
  }
};

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agent,
  size = 28,
  className = '',
  style = {}
}) => {
  const [imgError, setImgError] = useState(false);
  const slug = (agent as any).slug || agent.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const faviconUrl = !imgError ? getFaviconUrl(agent.website, agent.name, slug) : null;
  const dimension = typeof size === 'number' ? `${size}px` : size;

  if (faviconUrl) {
    return (
      <motion.span
        whileHover={{ scale: 1.15, rotate: 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
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
          backgroundColor: '#fff',
          border: '1px solid var(--rule)',
          padding: '2px',
          boxSizing: 'border-box',
          verticalAlign: 'middle',
          cursor: 'pointer',
          ...style
        }}
      >
        <img
          src={faviconUrl}
          alt={`${agent.name} logo`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '50%',
            display: 'block'
          }}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </motion.span>
    );
  }

  // Beautiful editorial monogram badge for agents without an external logo
  return (
    <motion.span
      whileHover={{ scale: 1.15 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
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
        backgroundColor: '#0E0D0B',
        color: '#FAF9F6',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: typeof size === 'number' ? `${Math.max(10, Math.floor(size * 0.36))}px` : '0.75rem',
        fontWeight: 700,
        letterSpacing: '-0.5px',
        verticalAlign: 'middle',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
        cursor: 'pointer',
        ...style
      }}
    >
      {agent.avatar || agent.name.slice(0, 2).toUpperCase()}
    </motion.span>
  );
};
