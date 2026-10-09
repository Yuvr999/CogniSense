import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/v1/model/card', () => {
    return HttpResponse.json({
      auroc: { value: 0.89, ci: [0.85, 0.92] },
      sensitivity: { value: 0.85, ci: [0.80, 0.89] },
      specificity: { value: 0.78, ci: [0.72, 0.83] },
      n: 450,
      dataset: 'ADReSS',
      data_mode: 'synthetic'
    })
  }),

  http.post('/v1/sessions', () => {
    return HttpResponse.json({
      id: 'session-demo',
      status: 'created'
    })
  }),

  http.get('/v1/sessions/:id/result', ({ params }: { params: any }) => {
    // We can return different personas based on ID or just cycle them.
    // Let's return the "elevated" persona for the demo.
    return HttpResponse.json({
      id: params.id,
      patient: {
        age_band: '70-74',
        education_years: 14,
        language: 'English',
        device: 'Tablet'
      },
      review_status: 'Draft: not reviewed',
      risk_tier: 'Elevated',
      probability: 0.62,
      probability_ci: [0.41, 0.78],
      speech_score: 0.66,
      cognitive_score: 0.55,
      data_quality: {
        flags: ['Audio quality was low (background noise). Treat the speech score with caution.']
      },
      features: [
        { name: 'Average Pause Duration', value: 1.2, contribution: 0.15, category: 'speech' },
        { name: 'Information Units (Speech)', value: 11, contribution: 0.12, category: 'speech' },
        { name: 'Word Recall', value: 3, contribution: 0.08, category: 'cognitive' },
        { name: 'Fluency Words', value: 14, contribution: 0.05, category: 'cognitive' },
        { name: 'Education Level', value: 14, contribution: -0.04, category: 'demographics' }
      ],
      cognitive_domains: [
        { name: 'Memory', zScore: -1.2 },
        { name: 'Executive Function', zScore: -0.5 },
        { name: 'Language', zScore: -0.8 },
        { name: 'Attention', zScore: 0.2 }
      ],
      speech_pauses: [
        { start: 2.1, duration: 1.5 },
        { start: 8.5, duration: 2.3 },
        { start: 15.0, duration: 3.1 },
        { start: 22.0, duration: 1.2 }
      ],
      speech_duration: 30,
      scene_content: { found: 11, total: 25 },
      data_mode: 'synthetic'
    })
  }),

  http.delete('/v1/sessions/:id', ({ params }: { params: any }) => {
    return HttpResponse.json({
      status: 'purged',
      id: params.id,
      purged_at: new Date().toISOString()
    })
  }),
]
