export function StudentFields({
  name = "",
  gpa = "",
  nowDoing = "",
}: {
  name?: string;
  gpa?: string;
  nowDoing?: string;
}) {
  return (
    <>
      <div className="a-row">
        <div className="a-field">
          <label htmlFor="name">Student name</label>
          <input id="name" name="name" type="text" defaultValue={name} required minLength={2} maxLength={80} autoComplete="off" />
        </div>
        <div className="a-field">
          <label htmlFor="gpa">SEE GPA</label>
          <input
            id="gpa"
            name="gpa"
            type="text"
            inputMode="decimal"
            defaultValue={gpa}
            required
            pattern="[0-4](\.[0-9]{1,2})?"
            placeholder="e.g. 3.85"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="a-field">
        <label htmlFor="nowDoing">Now studying or working (optional)</label>
        <input
          id="nowDoing"
          name="nowDoing"
          type="text"
          defaultValue={nowDoing}
          maxLength={80}
          placeholder="e.g. MBBS at BPKIHS, or Engineering at Pulchowk"
          autoComplete="off"
        />
        <span className="a-hint">Leave empty if you do not know. Nothing is shown on the website when it is empty.</span>
      </div>
    </>
  );
}
