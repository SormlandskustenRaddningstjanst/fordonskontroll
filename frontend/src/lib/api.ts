import { supabase } from "./supabase";

export async function startInspection(params: {
  vehicleId: string;
  templateId: string;
  interval: "DAY" | "WEEK" | "MONTH" | "QUARTER";
  performedBy: string;
  stationId?: string | null;
}) {
  const { data, error } = await supabase
    .from("inspections")
    .insert({
      object_type: "VEHICLE",
      vehicle_id: params.vehicleId,
      template_id: params.templateId,
      interval: params.interval,
      performed_by: params.performedBy,
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
  responseText?: string | null;
  responseNumber?: number | null;
  responseDate?: string | null;
  responseOption?: string | null;
  commentText?: string | null;
}) {
  const { data, error } = await supabase
    .from("inspection_results")
    .upsert(
      {
        inspection_id: params.inspectionId,
        checklist_item_id: params.checklistItemId,
        passed: params.passed,
        response_text: params.responseText ?? null,
        response_number: params.responseNumber ?? null,
        response_date: params.responseDate ?? null,
        response_option: params.responseOption ?? null,
        comment_text: params.commentText ?? null,
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

export async function completeInspection(inspectionId: string) {
  const { error } = await supabase.rpc("complete_inspection", {
    p_inspection_id: inspectionId,
  });

  if (error) throw error;
}
