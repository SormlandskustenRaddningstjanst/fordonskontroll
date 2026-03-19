import { supabase } from './supabase';
import { mockChecklist, mockVehicles } from './mockData';
import type { ChecklistItem, InspectionResultDraft, Interval, Vehicle } from './types';

export async function listVehicles(): Promise<Vehicle[]> {
  if (!supabase) return mockVehicles;

  const { data, error } = await supabase
    .from('vehicles')
    .select('id,name,call_sign,registration_number,status')
    .order('name');

  if (error) throw error;
  return (data ?? []) as Vehicle[];
}

export async function listChecklist(vehicleId: string, interval: Interval): Promise<ChecklistItem[]> {
  if (!supabase) return mockChecklist;

  const { data: vehicle, error: vehicleError } = await supabase
    .from('vehicles')
    .select('vehicle_type_id')
    .eq('id', vehicleId)
    .single();

  if (vehicleError) throw vehicleError;

  const { data: template, error: templateError } = await supabase
    .from('checklist_templates')
    .select('id')
    .eq('object_type', 'VEHICLE')
    .eq('vehicle_type_id', vehicle.vehicle_type_id)
    .eq('interval', interval)
    .single();

  if (templateError) throw templateError;

  const { data, error } = await supabase
    .from('checklist_items')
    .select('id,section_name,sort_order,title,instruction_text,failure_criteria,is_critical')
    .eq('template_id', template.id)
    .order('sort_order');

  if (error) throw error;
  return (data ?? []) as ChecklistItem[];
}

export async function saveInspectionResults(params: {
  vehicleId: string;
  interval: Interval;
  results: InspectionResultDraft[];
}) {
  // Placeholder until auth/users are connected.
  return {
    ok: true,
    summary: params.results.filter((r) => r.passed === false).length,
  };
}
