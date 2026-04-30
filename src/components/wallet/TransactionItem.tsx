import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Transaction } from '@/types/wallet';
import { colors, spacing } from '@/constants/theme';
import { Badge } from '@/components/ui';
import { formatDate, formatSize, toNumber } from '@/utils/format';

interface TransactionItemProps {
  tx: Transaction;
}

export function TransactionItem({ tx }: TransactionItemProps) {
  const amount = toNumber(tx.amount);
  const isPositive = amount > 0 && tx.type !== 'fee';
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.type}>{labelFor(tx.type)}</Text>
        <Text style={styles.date}>{formatDate(tx.time)}</Text>
      </View>
      <Text style={[styles.amount, { color: isPositive ? colors.up : colors.down }]}>
        {isPositive ? '+' : ''}
        {formatSize(tx.amount, 4)} {tx.asset}
      </Text>
      <Badge
        label={tx.status}
        variant={tx.status === 'confirmed' ? 'up' : tx.status === 'failed' ? 'down' : 'neutral'}
      />
    </View>
  );
}

function labelFor(type: Transaction['type']): string {
  switch (type) {
    case 'deposit':
      return 'Deposit';
    case 'withdrawal':
      return 'Withdraw';
    case 'funding':
      return 'Funding';
    case 'fee':
      return 'Fee';
    case 'pnl':
      return 'PnL';
    case 'liquidation':
      return 'Liquidation';
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.subtle,
  },
  type: { color: colors.text.primary, fontSize: 14, fontWeight: '600' },
  date: { color: colors.text.tertiary, fontSize: 11, marginTop: 2 },
  amount: { fontSize: 13, fontWeight: '600', fontVariant: ['tabular-nums'] },
});
