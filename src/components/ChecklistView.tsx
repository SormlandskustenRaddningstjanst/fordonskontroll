import type { ChecklistItem, InspectionResultDraft } from '../lib/types';

export default function ChecklistView({
  items,
  results,
  onToggle,
  onComment,
}: {
  items: ChecklistItem[];
  results: Record<string, InspectionResultDraft>;
  onToggle: (itemId: string, passed: boolean) => void;
  onComment: (itemId: string, comment: string) => void;
}) {
  return (
    <section className="card">
      <h2>Checklista</h2>
      <div className="checklist">
        {items.map((item) => {
          const result = results[item.id] ?? {
            checklist_item_id: item.id,
            passed: null,
            comment_text: '',
          };

          return (
            <article className="check-item" key={item.id}>
              <div className="check-top">
                <div>
                  <div className="section-label">{item.section_name}</div>
                  <h3>{item.title}</h3>
                  {item.is_critical && <div className="critical">Kritisk punkt</div>}
                </div>
              </div>
              {item.instruction_text && (
                <div className="instruction-block">
                  <strong>Så gör du</strong>
                  <p>{item.instruction_text}</p>
                </div>
              )}
              {item.failure_criteria && (
                <div className="instruction-block warning-block">
                  <strong>Fel om</strong>
                  <p>{item.failure_criteria}</p>
                </div>
              )}
              <div className="answer-row">
                <button
                  className={result.passed === true ? 'answer active-good' : 'answer'}
                  onClick={() => onToggle(item.id, true)}
                >
                  OK
                </button>
                <button
                  className={result.passed === false ? 'answer active-bad' : 'answer'}
                  onClick={() => onToggle(item.id, false)}
                >
                  Ej OK
                </button>
              </div>
              <textarea
                className="comment"
                placeholder="Kommentar eller avvikelse"
                value={result.comment_text}
                onChange={(e) => onComment(item.id, e.target.value)}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}
