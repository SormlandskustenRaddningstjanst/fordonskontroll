import type { ChecklistItem, Vehicle } from './types';

export const mockVehicles: Vehicle[] = [
  { id: '1', name: '3010 Släckbil', call_sign: '3010', registration_number: 'ABC123', status: 'IN_SERVICE' },
  { id: '2', name: '3080 IL-bil', call_sign: '3080', registration_number: 'DEF456', status: 'IN_SERVICE_WITH_DEVIATION' },
  { id: '3', name: 'Båt 1', call_sign: 'BÅT1', registration_number: null, status: 'NOT_READY' },
];

export const mockChecklist: ChecklistItem[] = [
  {
    id: 'c1',
    section_name: 'Fordon',
    sort_order: 10,
    title: 'Fordonsbelysning',
    instruction_text: 'Starta fordonet, slå på positionsljus, halvljus och helljus. Gå runt fordonet och kontrollera blinkers och bromsljus.',
    failure_criteria: 'Någon lampa fungerar inte eller blinkar fel.',
    is_critical: true,
  },
  {
    id: 'c2',
    section_name: 'Pump/släcksystem',
    sort_order: 20,
    title: 'Nivå vatten/skum',
    instruction_text: 'Kontrollera nivåindikator för vatten och skum. Säkerställ att nivåerna uppfyller lokal rutin.',
    failure_criteria: 'För låg nivå eller läckage.',
    is_critical: true,
  },
  {
    id: 'c3',
    section_name: 'Sjukvård',
    sort_order: 30,
    title: 'Defibrillator',
    instruction_text: 'Kontrollera att enheten finns på plats, att statusindikatorn är grön och att batteri samt elektroder är godkända.',
    failure_criteria: 'Saknas, felindikering eller otjänligt batteri/elektroder.',
    is_critical: true,
  },
  {
    id: 'c4',
    section_name: 'Ordning',
    sort_order: 40,
    title: 'Städning hytt/skåp',
    instruction_text: 'Kontrollera att hytt och skåp är städade och att utrustningen är återställd.',
    failure_criteria: 'Skräp, oordning eller löst material.',
    is_critical: false,
  },
];
