import ActionForm from "@/components/admin/ActionForm";
import PhotoInput from "@/components/admin/PhotoInput";
import Where from "@/components/admin/Where";
import { getSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { saveSettingsAction } from "../../_actions/content";

export const metadata = { title: "Website text" };

function Field({
  name,
  label,
  value,
  max,
  hint,
  type = "text",
  multiline = false,
}: {
  name: string;
  label: string;
  value: string;
  max: number;
  hint?: string;
  type?: string;
  multiline?: boolean;
}) {
  return (
    <div className="a-field">
      <label htmlFor={name}>{label}</label>
      {multiline ? (
        <textarea id={name} name={name} defaultValue={value} maxLength={max} rows={4} />
      ) : (
        <input id={name} name={name} type={type} defaultValue={value} maxLength={max} />
      )}
      {hint && <span className="a-hint">{hint}</span>}
    </div>
  );
}

export default async function SettingsPage() {
  const s = await getSettings();
  return (
    <>
      <div className="a-head">
        <div>
          <h1>Website text</h1>
          <p>Change the main words, photo and contact details on the website. Press Save at the bottom when done.</p>
        </div>
      </div>

      <ActionForm action={saveSettingsAction} submitLabel="Save all changes" liveHref={SITE_URL}>
        <section className="a-card">
          <h2>Top of the home page</h2>
          <Where place="Home page, the big blue area at the top" href="/#top" />
          <div className="a-form">
            <Field name="heroTitle" label="Main headline" value={s.heroTitle} max={90} />
            <Field name="heroText" label="Text under the headline" value={s.heroText} max={260} multiline />
            <Field
              name="admissionText"
              label="Admissions label"
              value={s.admissionText}
              max={40}
              hint='Shown in yellow on the right, for example "Admissions open 2083".'
            />
            <Field name="studentCount" label="Number of students" value={s.studentCount} max={12} hint='Shown in the yellow strip, for example "1,000+".' />
          </div>
        </section>

        <section className="a-card">
          <h2>About the school</h2>
          <Where place="Home page, About the school" href="/#about" />
          <div className="a-form">
            <Field name="aboutText" label="About text" value={s.aboutText} max={900} multiline />
            <PhotoInput
              name="aboutPhoto"
              label="School photo"
              current={s.aboutPhotoUrl}
              maxSide={1600}
              allowRemove={Boolean(s.aboutPhotoId)}
              hint="A wide photo of the school building works best."
            />
          </div>
        </section>

        <section className="a-card">
          <h2>Contact details</h2>
          <Where place="Top bar, Admissions section and the footer on every page" href="/#contact" />
          <div className="a-form">
            <div className="a-row">
              <Field name="phone1" label="Main phone" value={s.phone1} max={20} type="tel" />
              <Field name="phone2" label="Second phone (optional)" value={s.phone2} max={20} type="tel" />
            </div>
            <div className="a-row">
              <Field name="email" label="Email" value={s.email} max={80} type="email" />
              <Field name="address" label="Address" value={s.address} max={120} />
            </div>
            <div className="a-row">
              <Field name="sportsCentre" label="Sports centre address" value={s.sportsCentre} max={120} />
              <Field name="facebookUrl" label="Facebook page link (optional)" value={s.facebookUrl} max={200} type="url" />
            </div>
          </div>
        </section>
      </ActionForm>
    </>
  );
}
