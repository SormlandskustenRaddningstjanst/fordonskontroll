import { supabase } from "./supabase";

export type IntervalType = "DAY" | "WEEK" | "MONTH" | "QUARTER";

export type VehicleRow = {
  id: string;
  name: string;
  call_sign: string | null;
  registration_number: string | null;
  status: string;
  station_id: string;
  vehicle_type_id: string;
};

export type ChecklistTemplateRow = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  interval: IntervalType;
};

export type ChecklistItemMediaRow = {
  id: string;
  media_type: "VIDEO" | "IMAGE" | "DOCUMENT" | "LINK";
  title: string;
  description: string | null;
  url: string;
  sort_order: number;
};

export type ChecklistItemRow = {
  id: string;
  template_id: string;
  section_name: string;
  sort_order: number;
  title: string;
  short_description: string | null;
  instruction_text: string | null;
  failure_criteria: string | null;
  control_method: string | null;
  response_type: string;
  expected_value_text: string | null;
  unit: string | null;
  is_required: boolean;
  is_critical: boolean;
  require_comment_on_failure: boolean;
  require_photo_on_failure: boolean;
  require_video_on_failure: boolean;
  checklist_item_media?: ChecklistItemMediaRow[];
};

export type InspectionRow = {
  id: string;
  object_type: "VEHICLE" | "MATERIAL";
  vehicle_id: string | null;
  material_id: string | null;
  template_id: string;
  interval: IntervalType;
  performed_by: string;
  station_id: string | null;
  started_at: string;
  completed_at: string | null;
  signed_at: string | null;
  status: string;
  summary_status: string | null;
  notes: string | null;
};

export async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Ingen inloggad användare.");
  }

  return user.id;
}

export async function getVehicles(): Promise<VehicleRow[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("id, name, call_sign, registration_number, status, station_id, vehicle_type_id")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getTemplatesForVehicle(
  vehicleId: string,
  interval: IntervalType
): Promise<ChecklistTemplateRow[]> {
  const { data, error } = await supabase
    .from("vehicle_template_assignments")
    .select(`
      template_id,
      checklist_templates!inner (
        id,
        code,
        name,
        description,
        interval
      )
    `)
    .eq("vehicle_id", vehicleId)
    .eq("checklist_templates.interval", interval);

  if (error) throw error;

  return (data ?? []).map((row: any) => row.checklist_templates);
}

export async function getTemplateWithItems(templateId: string): Promise<{
  template: ChecklistTemplateRow;
  items: ChecklistItemRow[];
}> {
  const { data: template, error: templateError } = await supabase
    .from("checklist_templates")
    .select("id, code, name, description, interval")
    .eq("id", templateId)
    .single();

  if (templateError) throw templateError;

  const { data: items, error: itemsError } = await supabase
    .from("checklist_items")
    .select(`
      id,
      template_id,
      section_name,
      sort_order,
      title,
      short_description,
      instruction_text,
      failure_criteria,
      control_method,
      response_type,
      expected_value_text,
      unit,
      is_required,
      is_critical,
      require_comment_on_failure,
      require_photo_on_failure,
      require_video_on_failure,
      checklist_item_media (
        id,
        media_type,
        title,
        description,
        url,
        sort_order
      )
    `)
    .eq("template_id", templateId)
    .order("sort_order", { ascending: true });

  if (itemsError) throw itemsError;

  return {
    template,
    items: items ?? [],
  };
}

export async function startInspection(params: {
  vehicleId: string;
  templateId: string;
  interval: IntervalType;
  stationId?: string | null;
}): Promise<InspectionRow> {
  const performedBy = await getCurrentUserId();

  const { data, error } = await supabase
    .from("inspections")
    .insert({
      object_type: "VEHICLE",
      vehicle_id: params.vehicleId,
      template_id: params.templateId,
      interval: params.interval,
      performed_by: performedBy,
      station_id: params.stationId ?? null,
      status: "STARTED",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveInspectionResult(params: {
  inspectionId: string;
  checklistItemId: string;
  passed: boolean | null;
  commentText?: string | null;
  responseText?: string | null;
  responseNumber?: number | null;
  responseDate?: string | null;
  responseOption?: string | null;
}) {
  const { data, error } = await supabase
    .from("inspection_results")
    .upsert(
      {
        inspection_id: params.inspectionId,
        checklist_item_id: params.checklistItemId,
        passed: params.passed,
        comment_text: params.commentText ?? null,
        response_text: params.responseText ?? null,
        response_number: params.responseNumber ?? null,
        response_date: params.responseDate ?? null,
        response_option: params.responseOption ?? null,
      },
      {
        onConflict: "inspection_id,checklist_item_id",
      }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createDeviationFromFailedResult(inspectionResultId: string) {
  const { data, error } = await supabase.rpc("create_deviation_from_failed_result", {
    p_inspection_result_id: inspectionResultId,
    p_priority: "NORMAL",
    p_responsible_user_id: null,
  });

  if (error) throw error;
  return data;
}

export async function completeInspection(inspectionId: string) {
  const { error } = await supabase.rpc("complete_inspection", {
    p_inspection_id: inspectionId,
  });

  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}