import { useMemo, useState } from "react";
import type { ChecklistItemRow } from "../lib/api";
import {
  completeInspection,
  createDeviationFromFailedResult,
  saveInspectionResult,
} from "../lib/api";

type Props = {
  inspectionId: string;
  templateName: string;
  intervalLabel: string;
  items: ChecklistItemRow[];
  onCompleted: () => void;
};

type LocalAnswer = {
  passed?: boolean | null;
  commentText?: string;
};

export default function ChecklistView({
  inspectionId,
  templateName,
  intervalLabel,
  items,
  onCompleted,
}: Props) {
  const [answers, setAnswers] = useState<Record<string, LocalAnswer>>({});
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [errorText, setErrorText] = useState("");

  const grouped = useMemo(() => {
    const groups: Record<string, ChecklistItemRow[]> = {};
    for (const item of items) {
      if (!groups[item.section_name]) groups[item.section_name] = [];
      groups[item.section_name].push(item);
    }
    return groups;
  }, [items]);

  async function handleSaveAnswer(item: ChecklistItemRow, passed: boolean) {
    try {
      setSavingItemId(item.id);
      setErrorText("");

      const localComment = answers[item.id]?.commentText ?? "";

      const result = await saveInspectionResult({
        inspectionId,
        checklistItemId: item.id,
        passed,
        commentText: localComment || null,
      });

      setAnswers((prev) => ({
        ...prev,
        [item.id]: {
          ...prev[item.id],
          passed,
        },
      }));

      if (passed === false) {
        await createDeviationFromFailedResult(result.id);
      }
    } catch (error: any) {
      setErrorText(error.message ?? "Kunde inte spara svar.");
    } finally {
      setSavingItemId(null);
    }
  }

  async function handleCompleteInspection() {
    try {
      setCompleting(true);
      setErrorText("");
      await completeInspection(inspectionId);
      onCompleted();
    } catch (error: any) {
      setErrorText(error.message ?? "Kunde inte slutföra kontroll.");
    } finally {
      setCompleting(false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ marginBottom: 4 }}>{templateName}</h2>
        <div style={{ opacity: 0.7 }}>{intervalLabel}</div>
      </div>

      {Object.entries(grouped).map(([sectionName, sectionItems]) => (
        <div key={sectionName} style={{ marginBottom: 24 }}>
          <h3>{sectionName}</h3>

          {sectionItems.map((item) => {
            const local = answers[item.id] ?? {};
            const video = item.checklist_item_media?.find((m) => m.media_type === "VIDEO");

            return (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 12,
                  background: item.is_critical ? "#fff8f8" : "#fff",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <strong>{item.title}</strong>
                  {item.is_critical ? (
                    <span style={{ color: "crimson", fontWeight: 700 }}>Kritisk</span>
                  ) : null}
                </div>

                {item.short_description ? (
                  <p style={{ marginBottom: 8 }}>{item.short_description}</p>
                ) : null}

                {item.instruction_text ? (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Så gör du</div>
                    <div>{item.instruction_text}</div>
                  </div>
                ) : null}

                {item.failure_criteria ? (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Fel om</div>
                    <div>{item.failure_criteria}</div>
                  </div>
                ) : null}

                {video ? (
                  <div style={{ marginBottom: 12 }}>
                    <a href={video.url} target="_blank" rel="noreferrer">
                      🎥 {video.title || "Instruktionsfilm"}
                    </a>
                  </div>
                ) : null}

                <textarea
                  placeholder="Kommentar"
                  value={local.commentText ?? ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [item.id]: {
                        ...prev[item.id],
                        commentText: e.target.value,
                      },
                    }))
                  }
                  style={{
                    width: "100%",
                    minHeight: 70,
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    marginBottom: 10,
                  }}
                />

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleSaveAnswer(item, true)}
                    disabled={savingItemId === item.id}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 8,
                      border: "1px solid #ccc",
                    }}
                  >
                    OK
                  </button>

                  <button
                    onClick={() => handleSaveAnswer(item, false)}
                    disabled={savingItemId === item.id}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 8,
                      border: "1px solid #ccc",
                    }}
                  >
                    Ej OK
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {errorText ? <p style={{ color: "crimson" }}>{errorText}</p> : null}

      <button
        onClick={handleCompleteInspection}
        disabled={completing}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 8,
          border: "none",
          fontWeight: 700,
          marginTop: 12,
        }}
      >
        {completing ? "Slutför..." : "Slutför kontroll"}
      </button>
    </div>
  );
}
