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
