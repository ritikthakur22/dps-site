export function NewsFields({ title = "", summary = "", published }: { title?: string; summary?: string; published: string }) {
  return (
    <>
      <div className="a-row">
        <div className="a-field" style={{ gridColumn: "span 2" }}>
          <label htmlFor="title">Headline</label>
          <input id="title" name="title" type="text" defaultValue={title} required minLength={3} maxLength={140} />
        </div>
        <div className="a-field">
          <label htmlFor="published">Date</label>
          <input id="published" name="published" type="date" defaultValue={published} required />
        </div>
      </div>
      <div className="a-field">
        <label htmlFor="summary">Short summary</label>
        <textarea id="summary" name="summary" defaultValue={summary} required minLength={3} maxLength={400} rows={3} />
        <span className="a-hint">Two or three lines. Up to 400 characters.</span>
      </div>
    </>
  );
}
