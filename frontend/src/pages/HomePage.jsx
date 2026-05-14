export function HomePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Bienvenue sur KineTrack</h1>
      <p className="text-slate-700">
        Cette première étape met en place l'architecture full-stack du projet.
      </p>

      <div className="rounded-lg border bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">Modules prévus</h2>
        <ul className="list-disc space-y-1 pl-6 text-slate-700">
          <li>Patients</li>
          <li>Agenda</li>
          <li>Portail patient</li>
          <li>IA</li>
          <li>SMS</li>
        </ul>
      </div>
    </section>
  );
}
