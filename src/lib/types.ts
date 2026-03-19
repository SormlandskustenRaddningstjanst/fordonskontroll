export type Interval = 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER';

export type Vehicle = {
  id: string;
  name: string;
  call_sign?: string | null;
  registration_number?: string | null;
  status: 'IN_SERVICE' | 'IN_SERVICE_WITH_DEVIATION' | 'NOT_READY' | 'OUT_OF_SERVICE' | 'UNDER_REPAIR';
};

export type ChecklistItem = {
  id: string;
  section_name: string;
  sort_order: number;
  title: string;
  instruction_text?: string | null;
  failure_criteria?: string | null;
  is_critical: boolean;
};

export type InspectionResultDraft = {
  checklist_item_id: string;
  passed: boolean | null;
  comment_text: string;
};
