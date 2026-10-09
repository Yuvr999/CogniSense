import React, { useState } from 'react';
import { ClinicLayout } from './ClinicLayout';
import { RiskTierBadge } from '../ui';
import * as Tabs from '@radix-ui/react-tabs';
import { useNavigate } from 'react-router-dom';

const mockQueue = [
  { id: '7F3A', date: 'Oct 7, 10:45 AM', age: '70-74', tier: 'Elevated', p: 0.62, mods: 'Speech, Cog', qc: 1, status: 'Needs review' },
  { id: '2B9C', date: 'Oct 7, 09:12 AM', age: '65-69', tier: 'Low', p: 0.15, mods: 'Speech, Cog', qc: 0, status: 'Reviewed' },
  { id: '8E4D', date: 'Oct 6, 03:30 PM', age: '80-84', tier: 'High', p: 0.88, mods: 'Speech only', qc: 0, status: 'Needs review' },
  { id: '1A5B', date: 'Oct 6, 11:15 AM', age: '75-79', tier: 'Indeterminate', p: 0.45, mods: 'Speech, Cog', qc: 2, status: 'Needs review' }
];

export function Queue() {
  const [tab, setTab] = useState('needs-review');
  const navigate = useNavigate();

  const filteredQueue = mockQueue.filter(item => {
    if (tab === 'needs-review') return item.status === 'Needs review';
    if (tab === 'reviewed') return item.status === 'Reviewed';
    return true;
  });

  return (
    <ClinicLayout activePath="/clinic">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Screening Queue</h1>
          <p className="text-muted text-sm">Patients awaiting review.</p>
        </div>
        <div className="w-64">
          <input 
            type="search" 
            placeholder="Search session or patient..." 
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Tabs.Root value={tab} onValueChange={setTab}>
          <div className="px-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <Tabs.List className="flex gap-6">
              {[
                { id: 'all', label: 'All' },
                { id: 'needs-review', label: 'Needs review' },
                { id: 'reviewed', label: 'Reviewed' }
              ].map(t => (
                <Tabs.Trigger 
                  key={t.id}
                  value={t.id}
                  className={`py-4 text-sm font-bold border-b-2 focus:outline-none focus:ring-[3px] focus:ring-ink focus:ring-offset-1 ${tab === t.id ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`}
                >
                  {t.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-200 text-muted">
                  <th className="px-6 py-4 font-bold">Session</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Age</th>
                  <th className="px-6 py-4 font-bold">Risk Tier</th>
                  <th className="px-6 py-4 font-bold">Prob</th>
                  <th className="px-6 py-4 font-bold">Modalities</th>
                  <th className="px-6 py-4 font-bold">QC Flags</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueue.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-muted">
                      No screenings match this view.
                    </td>
                  </tr>
                ) : (
                  filteredQueue.map(row => (
                    <tr 
                      key={row.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/clinic/session/${row.id}`)}
                    >
                      <td className="px-6 py-4 font-mono font-bold text-ink">{row.id}</td>
                      <td className="px-6 py-4">{row.date}</td>
                      <td className="px-6 py-4">{row.age}</td>
                      <td className="px-6 py-4">
                        <RiskTierBadge tier={row.tier as any} size="sm" />
                      </td>
                      <td className="px-6 py-4 tabular-nums">{row.p.toFixed(2)}</td>
                      <td className="px-6 py-4">{row.mods}</td>
                      <td className="px-6 py-4">
                        {row.qc > 0 ? (
                          <span className="inline-flex items-center text-[#8F6B00] bg-[#FFF8E1] px-2 py-0.5 rounded text-xs font-bold">
                            {row.qc} flag{row.qc > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${row.status === 'Needs review' ? 'bg-orange-500' : 'bg-gray-300'}`}></span>
                        {row.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Tabs.Root>
      </div>
    </ClinicLayout>
  );
}
