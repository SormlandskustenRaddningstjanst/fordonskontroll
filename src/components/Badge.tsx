import React from 'react';

export default function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'danger'; }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
