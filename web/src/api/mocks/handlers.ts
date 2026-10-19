import { http, HttpResponse } from 'msw';
import { DEFAULT_SESSIONS, generateDynamicSession } from '../sessionRepository';

export const handlers = [
  http.get('/v1/model/card', () => {
    return HttpResponse.json({
      auroc: { value: 0.89, ci: [0.85, 0.92] },
      sensitivity: { value: 0.85, ci: [0.80, 0.89] },
      specificity: { value: 0.78, ci: [0.72, 0.83] },
      n: 450,
      dataset: 'ADReSS',
      data_mode: 'synthetic'
    });
  }),

  http.post('/v1/sessions', () => {
    return HttpResponse.json({
      id: 'session-demo',
      status: 'created'
    });
  }),

  http.get('/v1/sessions/:id/result', ({ params }: { params: any }) => {
    const id = String(params.id).toUpperCase();
    const result = DEFAULT_SESSIONS[id] || generateDynamicSession(id);
    return HttpResponse.json(result);
  }),

  http.delete('/v1/sessions/:id', ({ params }: { params: any }) => {
    return HttpResponse.json({
      status: 'purged',
      id: params.id,
      purged_at: new Date().toISOString()
    });
  }),
];
