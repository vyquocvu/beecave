import React from 'react';
import { Tabs } from '@/components/ui';
import type { LeaderboardPeriod } from '@/types/leaderboard';

interface PeriodSelectorProps {
  value: LeaderboardPeriod;
  onChange: (p: LeaderboardPeriod) => void;
}

const ITEMS = [
  { key: '24h' as const, label: '24h' },
  { key: '7d' as const, label: '7d' },
  { key: 'all' as const, label: 'All' },
];

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <Tabs
      variant="segment"
      items={ITEMS}
      value={value}
      onChange={onChange}
    />
  );
}
