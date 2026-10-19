import React from 'react';
import { ClinicLayout } from './ClinicLayout';
import { RiskTierBadge } from '../ui';
import * as Tabs from '@radix-ui/react-tabs';
import { useNavigate } from 'react-router-dom';
import { useClinicQueueStore } from '../../state/clinicQueueStore';

export function Queue() {
  const navigate = useNavigate();
  const { 
    items, 
    searchQuery, 
    setSearchQuery, 
    activeTab, 
    setActiveTab, 
    getFilteredItems,
    resetQueue 
  } = useClinicQueueStore();

  const filteredQueue = getFilteredItems();

  const needsReviewCount = items.filter(i => i.status === 'Needs review').length;
  const reviewedCount = items.filter(i => i.status === 'Reviewed').length;

  return (
    <ClinicLayout activePath="/clinic">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-ink">Screening Queue</h1>
            <span className="text-xs font-mono font-bold bg-ink text-paper px-2.5 py-0.5 rounded-full">
              {items.length} Active Sessions
            </span>
          </div>
          <p className="text-muted text-sm">
            Triage and sign off on incoming patient speech and cognitive screening sessions.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <input 
              type="search" 
              placeholder="Search session ID, age, tier..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            />
            <span className="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-gray-400 hover:text-ink text-xs font-bold p-1"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={resetQueue}
            className="hidden lg:inline-flex text-xs font-semibold text-muted hover:text-ink px-2.5 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
            title="Reset queue to demo seed"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Tabs.Root value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
          <div className="px-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <Tabs.List className="flex gap-6">
              {[
                { id: 'needs-review', label: 'Needs review', count: needsReviewCount },
                { id: 'reviewed', label: 'Reviewed', count: reviewedCount },
                { id: 'all', label: 'All', count: items.length },
              ].map(t => (
                <Tabs.Trigger 
                  key={t.id}
                  value={t.id}
                  className={`py-4 text-sm font-bold border-b-2 flex items-center gap-2 focus:outline-none focus:ring-[3px] focus:ring-ink focus:ring-offset-1 ${activeTab === t.id ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`}
                >
                  <span>{t.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${activeTab === t.id ? 'bg-ink text-paper' : 'bg-gray-200 text-muted'}`}>
                    {t.count}
                  </span>
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-200 text-muted text-xs uppercase font-mono bg-gray-50/50">
                  <th className="px-6 py-3.5 font-bold">Session ID</th>
                  <th className="px-6 py-3.5 font-bold">Screening Date</th>
                  <th className="px-6 py-3.5 font-bold">Age Cohort</th>
                  <th className="px-6 py-3.5 font-bold">Risk Tier</th>
                  <th className="px-6 py-3.5 font-bold">Probability</th>
                  <th className="px-6 py-3.5 font-bold">Modalities</th>
                  <th className="px-6 py-3.5 font-bold">QC Flags</th>
                  <th className="px-6 py-3.5 font-bold">Triage Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredQueue.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-muted">
                      <div className="text-3xl mb-2">📋</div>
                      <div className="font-bold text-ink text-base mb-1">No screenings match this view</div>
                      <p className="text-xs text-muted max-w-sm mx-auto mb-4">
                        {searchQuery ? `No results found for "${searchQuery}".` : `There are no sessions currently in the "${activeTab}" tab.`}
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="px-3.5 py-1.5 bg-ink text-paper rounded-lg text-xs font-bold hover:bg-neutral-800"
                        >
                          Clear Search Filter
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredQueue.map(row => (
                    <tr 
                      key={row.id} 
                      className="hover:bg-sand/30 cursor-pointer transition-colors group"
                      onClick={() => navigate(`/clinic/session/${row.id}`)}
                    >
                      <td className="px-6 py-4 font-mono font-bold text-ink flex items-center gap-2">
                        <span>{row.id}</span>
                        <span className="text-muted group-hover:text-ink group-hover:translate-x-0.5 transition-all text-xs">→</span>
                      </td>
                      <td className="px-6 py-4 text-muted text-xs">{row.date}</td>
                      <td className="px-6 py-4 font-medium">{row.age}</td>
                      <td className="px-6 py-4">
                        <RiskTierBadge tier={row.tier as any} size="sm" />
                      </td>
                      <td className="px-6 py-4 tabular-nums font-mono font-bold">{row.p.toFixed(2)}</td>
                      <td className="px-6 py-4 text-xs">{row.mods}</td>
                      <td className="px-6 py-4">
                        {row.qc > 0 ? (
                          <span className="inline-flex items-center text-[#8F6B00] bg-[#FFF8E1] px-2 py-0.5 rounded text-xs font-bold border border-[#8F6B00]/20">
                            ⚠️ {row.qc} flag{row.qc > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-mono text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          row.status === 'Needs review' 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'Needs review' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                          {row.status}
                        </span>
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
