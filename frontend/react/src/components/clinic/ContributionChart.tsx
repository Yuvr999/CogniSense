import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

interface ContributionChartProps {
  features: { name: string; value: number; contribution: number; category: string }[];
}

export function ContributionChart({ features }: ContributionChartProps) {
  const data = features.map(f => ({
    ...f,
    // Provide an absolute value for the bar length, but keep original for coloring
    absContribution: Math.abs(f.contribution)
  })).sort((a, b) => b.absContribution - a.absContribution).slice(0, 5); // Top 5

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md text-sm">
          <p className="font-bold">{data.name}</p>
          <p>Value: {data.value}</p>
          <p className={data.contribution > 0 ? 'text-[var(--color-risk-high)]' : 'text-[var(--color-risk-low-text)]'}>
            Effect: {data.contribution > 0 ? '+' : ''}{data.contribution.toFixed(3)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80">
      <h3 className="text-lg font-bold mb-4">What drove this result</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              width={120}
              tick={{ fontSize: 12, fill: '#6B7280' }} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
            <ReferenceLine x={0} stroke="#E5E7EB" />
            <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.contribution > 0 ? 'var(--color-risk-high-bg)' : 'var(--color-risk-low-bg)'}
                  stroke={entry.contribution > 0 ? 'var(--color-risk-high)' : 'var(--color-risk-low-text)'}
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
