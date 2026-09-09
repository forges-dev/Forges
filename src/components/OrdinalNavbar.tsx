import React, { useState } from 'react';

interface OrdinalNavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const XLogoIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 14,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const GitHubLogoIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 14,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const ForgesNavbar: React.FC<OrdinalNavbarProps> = ({
  currentPath = '/',
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  const isCurrent = (path: string) => {
    if (path === '/apply') {
      return currentPath === '/apply' || currentPath === '/apply/' || currentPath === '/get-listed';
    }
    if (path === '/rankings') {
      return currentPath === '/rankings' || currentPath === '/rankings/';
    }
    if (path === '/methodology') {
      return currentPath === '/methodology' || currentPath === '/methodology/' || currentPath === '/method';
    }
    if (path === '/log') {
      return currentPath === '/log' || currentPath === '/log/';
    }
    if (path === '/qualified') {
      return currentPath === '/qualified' || currentPath === '/qualified/';
    }
    if (path === '/') {
      return currentPath === '/' || currentPath === '';
    }
    return currentPath === path;
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'The 30', path: '/rankings' },
    { label: 'Methodology', path: '/methodology' },
    { label: 'Build Log', path: '/log' },
    { label: 'Get Listed', path: '/apply' },
  ];

  return (
    <header className="nav">
      <div className="container nav-inner">
        <div className="logo" onClick={() => navigateTo('/')}>
          <span className="logo-mark"></span>
          <span>FORGES 30</span>
        </div>

        <nav className="nav-links">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={isCurrent(item.path) ? 'active' : ''}
              onClick={() => navigateTo(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="nav-actions">
          <a
            href="https://x.com/forgesagentsx"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark"
            aria-label="X (Twitter)"
            title="X (@forgesagentsx)"
            style={{ padding: '0 12px', minWidth: '38px' }}
          >
            <XLogoIcon size={14} />
          </a>
          <a
            href="https://github.com/forges-dev/Forges"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark"
          >
            <GitHubLogoIcon size={14} /> GitHub
          </a>
          <button className="btn btn-pink" onClick={() => navigateTo('/apply')}>
            Nominate Agent
          </button>
        </div>

        <button
          className="menu"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ fontSize: '24px', padding: '4px 8px' }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '76px',
            left: 0,
            right: 0,
            bottom: 0,
            padding: '24px 32px 48px',
            background: 'rgba(13, 13, 10, 0.98)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 999,
            overflowY: 'auto',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.path}
              style={{
                background: 'none',
                border: 'none',
                color: isCurrent(item.path) ? 'var(--lime)' : '#ffffff',
                fontSize: '18px',
                fontWeight: 800,
                textAlign: 'left',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                cursor: 'pointer'
              }}
              onClick={() => navigateTo(item.path)}
            >
              {item.label}
            </button>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            <a
              href="https://x.com/forgesagentsx"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark"
              style={{ width: '100%', justifyContent: 'center' }}
              aria-label="X (Twitter)"
              title="X (@forgesagentsx)"
            >
              <XLogoIcon size={16} />
            </a>
            <a
              href="https://github.com/forges-dev/Forges"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <GitHubLogoIcon size={16} /> GitHub Repository
            </a>
            <button className="btn btn-pink" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigateTo('/apply')}>
              Nominate Agent
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export const OrdinalNavbar = ForgesNavbar;
export const OrdoNavbar = ForgesNavbar;

export const ForgesKeyIcon: React.FC = () => (
  <span className="logo-mark" style={{ width: '20px', height: '20px', fontSize: '12px', display: 'inline-flex' }}></span>
);

export const OrdoKeyIcon = ForgesKeyIcon;
