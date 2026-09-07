import React from 'react';
import { BuildLogView } from './BuildLogView';

interface QualifiedNoticeViewProps {
  onNavigate: (path: string) => void;
}

export const QualifiedNoticeView: React.FC<QualifiedNoticeViewProps> = ({ onNavigate }) => {
  return <BuildLogView onNavigate={onNavigate} defaultTab="qualified" />;
};
