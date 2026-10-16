import { HIGHLIGHT_CATEGORIES } from "@/lib/site";

export function HighlightFields({
  name = "",
  grade = "",
  achievement = "",
  category = "Academics",
}: {
  name?: string;
  grade?: string;
  achievement?: string;
  category?: string;
}) {
  return (
    <>
      <div className="a-row">
        <div className="a-field">
          <label htmlFor="name">Student name</label>
          <input id="name" name="name" type="text" defaultValue={name} required minLength={2} maxLength={80} />
        </div>
        <div className="a-field">
          <label htmlFor="grade">Class</label>
          <input id="grade" name="grade" type="text" defaultValue={grade} required maxLength={30} placeholder="e.g. Grade 8" />
        </div>
        <div className="a-field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" defaultValue={category}>
            {HIGHLIGHT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="a-field">
        <label htmlFor="achievement">Achievement</label>
        <textarea
          id="achievement"
          name="achievement"
          defaultValue={achievement}
          required
          maxLength={240}
          rows={3}
          placeholder="e.g. First place, district inter-school table tennis, 2082"
        />
      </div>
    </>
  );
}
