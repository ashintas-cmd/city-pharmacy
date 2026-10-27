import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Check,
  Download,
  FileText,
  Loader2,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { EmptyState } from "@/components/EmptyState";
import { SidePanel } from "@/components/Modal";
import { useToast } from "@/context/ToastContext";
import { fetchEnquiries, fetchPrescriptionFile, updateEnquiry } from "@/lib/firestore";
import { cn, downloadCsv, formatDate } from "@/lib/utils";
import type { Enquiry, EnquiryType } from "@/types";

const typeLabels: Record<EnquiryType, string> = {
  "medicine-availability": "Medicine availability",
  "home-delivery": "Home delivery",
  "prescription-help": "Prescription help",
  "health-advice": "Ask a pharmacist",
  "order-support": "Order support",
  feedback: "Feedback",
  other: "Other",
};

const statusStyles: Record<string, string> = {
  new: "bg-amber-50 text-amber-700 ring-amber-200",
  contacted: "bg-sky-50 text-sky-700 ring-sky-200",
  closed: "bg-apollo-50 text-apollo-700 ring-apollo-200",
};

export function AdminEnquiries() {
  const toast = useToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "contacted" | "closed">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"new" | "contacted" | "closed">("new");
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<{ data: string; name: string } | null>(null);
  const [fileLoading, setFileLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setEnquiries(await fetchEnquiries());
    } catch (error) {
      console.error(error);
      toast.error("Could not load enquiries", "Check your admin access and connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    let alive = true;
    const loadFile = async () => {
      if (!selected?.prescriptionFileId) {
        setFile(null);
        return;
      }
      setFileLoading(true);
      try {
        const result = await fetchPrescriptionFile(selected.prescriptionFileId);
        if (alive) setFile(result);
      } catch {
        if (alive) setFile(null);
      } finally {
        if (alive) setFileLoading(false);
      }
    };
    void loadFile();
    return () => {
      alive = false;
    };
  }, [selected?.prescriptionFileId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enquiries.filter((enquiry) => {
      if (statusFilter !== "all" && enquiry.status !== statusFilter) return false;
      if (!q) return true;
      return [enquiry.name, enquiry.phone, enquiry.email, enquiry.message, enquiry.type, enquiry.area].join(" ").toLowerCase().includes(q);
    });
  }, [enquiries, statusFilter, search]);

  const counts = useMemo(
    () => ({
      all: enquiries.length,
      new: enquiries.filter((enquiry) => enquiry.status === "new").length,
      contacted: enquiries.filter((enquiry) => enquiry.status === "contacted").length,
      closed: enquiries.filter((enquiry) => enquiry.status === "closed").length,
    }),
    [enquiries],
  );

  const open = (enquiry: Enquiry) => {
    setSelected(enquiry);
    setStatus(enquiry.status);
    setNote(enquiry.adminNote ?? "");
    setFile(null);
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateEnquiry(selected.id!, { status, adminNote: note.trim() });
      const updated = { ...selected, status, adminNote: note.trim() };
      setSelected(updated);
      setEnquiries((current) => current.map((enquiry) => (enquiry.id === updated.id ? updated : enquiry)));
      toast.success("Enquiry updated");
    } catch (error) {
      console.error(error);
      toast.error("Could not update the enquiry");
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    downloadCsv("city-pharmacy-enquiries.csv", [
      ["Date", "Name", "Phone", "Email", "Age", "Area", "Type", "Message", "Preferred time", "Status", "Admin note", "Prescription"],
      ...filtered.map((enquiry) => [
        formatDate(enquiry.createdAt, true),
        enquiry.name,
        enquiry.phone,
        enquiry.email ?? "",
        enquiry.age ?? "",
        enquiry.area ?? "",
        typeLabels[enquiry.type] ?? enquiry.type,
        enquiry.message,
        enquiry.preferredTime ?? "",
        enquiry.status,
        enquiry.adminNote ?? "",
        enquiry.prescriptionFileId ? "Attached" : "None",
      ]),
    ]);
  };

  return (
    <div>
      <AdminPageHeader title="Patient enquiries" description={`${counts.new} new · ${counts.contacted} in progress · ${counts.all} total`}>
        <button type="button" onClick={exportCsv} className="btn-outline px-3 py-2 text-[10.5px]"><Download size={13} /> Export CSV</button>
        <button type="button" onClick={() => void load()} className="btn-primary px-3 py-2 text-[10.5px]"><RefreshCw size={13} /> Refresh</button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(["all", "new", "contacted", "closed"] as const).map((key) => (
          <button key={key} type="button" onClick={() => setStatusFilter(key)} className={cn("rounded-xl border p-3 text-left transition", statusFilter === key ? "border-apollo-500 bg-apollo-50 ring-1 ring-apollo-100" : "border-line bg-white hover:border-apollo-200")}>
            <p className="text-[8.5px] font-bold uppercase tracking-wider text-muted">{key === "all" ? "All enquiries" : key}</p>
            <p className="mt-1 text-xl font-extrabold text-apollo-900">{counts[key]}</p>
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line p-3">
          <div className="relative w-full max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search patient, phone or message" className="h-8 w-full rounded-lg border border-line bg-cream/50 pl-8 pr-2 text-[10.5px] outline-none focus:border-apollo-400" />
          </div>
          <p className="text-[9.5px] text-muted">{filtered.length} shown</p>
        </div>

        {loading ? (
          <div className="space-y-2 p-3">{[0, 1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-xl bg-cream" />)}</div>
        ) : filtered.length ? (
          <div className="divide-y divide-line">
            {filtered.map((enquiry) => (
              <button key={enquiry.id} type="button" onClick={() => open(enquiry)} className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-apollo-50/30">
                <span className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg", enquiry.prescriptionFileId ? "bg-violet-50 text-violet-700" : "bg-apollo-50 text-apollo-700")}>
                  {enquiry.prescriptionFileId ? <FileText size={15} /> : <MessageSquare size={15} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-[11px] font-bold text-ink">{enquiry.name}</p>
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[7.5px] font-bold uppercase ring-1", statusStyles[enquiry.status])}>{enquiry.status}</span>
                    <span className="text-[8px] font-semibold uppercase tracking-wide text-apollo-600">{typeLabels[enquiry.type] ?? enquiry.type}</span>
                    {enquiry.prescriptionFileId ? <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[7.5px] font-bold text-violet-700">Rx attached</span> : null}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[9.5px] text-muted">{enquiry.message}</p>
                  <p className="mt-0.5 text-[8.5px] text-muted/80">{enquiry.phone} · {formatDate(enquiry.createdAt, true)} · {enquiry.area}</p>
                </div>
                <span className="shrink-0 self-center text-[9px] font-semibold text-apollo-700">Open →</span>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState icon={MessageSquare} title="No enquiries here" description="New patient enquiries from the website will appear in this list." />
        )}
      </div>

      <SidePanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.name ?? "Enquiry"}
        description={selected ? `${typeLabels[selected.type] ?? selected.type} · ${formatDate(selected.createdAt, true)}` : undefined}
        footer={
          selected ? (
            <div className="flex items-center justify-between gap-2">
              <a href={`tel:+91${selected.phone}`} className="btn-outline px-3 py-2 text-[10px]"><Phone size={12} /> Call</a>
              <button type="button" onClick={save} disabled={saving} className="btn-primary px-4 py-2 text-[10.5px]"><Check size={13} /> {saving ? "Saving…" : "Save status"}</button>
            </div>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={cn("rounded-full px-2 py-0.5 text-[8px] font-bold uppercase ring-1", statusStyles[selected.status])}>{selected.status}</span>
              <span className="rounded-full bg-apollo-50 px-2 py-0.5 text-[8px] font-bold uppercase text-apollo-700">{typeLabels[selected.type] ?? selected.type}</span>
              {selected.userId ? <span className="rounded-full bg-cream px-2 py-0.5 text-[8px] font-semibold text-muted">Signed-in customer</span> : null}
            </div>

            <div className="rounded-xl border border-line p-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Patient details</p>
              <div className="mt-2 grid gap-1.5 text-[10.5px] text-ink/75">
                <p className="flex items-center gap-1.5"><UserRound size={12} className="text-apollo-600" /> {selected.name} {selected.age ? <span className="text-muted">· {selected.age}</span> : null}</p>
                <a href={`tel:+91${selected.phone}`} className="flex items-center gap-1.5 hover:text-apollo-700"><Phone size={12} className="text-apollo-600" /> {selected.phone}</a>
                {selected.email ? <p className="flex items-center gap-1.5"><MessageSquare size={12} className="text-apollo-600" /> {selected.email}</p> : null}
                {selected.area ? <p className="flex items-center gap-1.5"><MapPin size={12} className="text-apollo-600" /> {selected.area}</p> : null}
                <p className="flex items-center gap-1.5"><Calendar size={12} className="text-apollo-600" /> Preferred callback: {selected.preferredTime ?? "Anytime"}</p>
              </div>
            </div>

            <div className="rounded-xl bg-cream p-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Message</p>
              <p className="mt-1.5 whitespace-pre-line text-[10.5px] leading-relaxed text-ink/75">{selected.message}</p>
            </div>

            {selected.prescriptionFileId ? (
              <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-3">
                <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-violet-800"><FileText size={11} /> Prescription attachment</p>
                {fileLoading ? (
                  <div className="mt-2 flex items-center gap-2 text-[9.5px] text-muted"><Loader2 size={13} className="animate-spin" /> Loading file…</div>
                ) : file ? (
                  <div className="mt-2">
                    {file.data.startsWith("data:image") ? (
                      <a href={file.data} target="_blank" rel="noreferrer">
                        <img src={file.data} alt="Prescription" className="max-h-72 w-full rounded-lg border border-violet-200 bg-white object-contain" />
                      </a>
                    ) : (
                      <a href={file.data} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[10px] font-semibold text-violet-800 shadow-sm">
                        <FileText size={13} /> Open {file.name || "prescription PDF"}
                      </a>
                    )}
                    <p className="mt-1.5 text-[8.5px] text-violet-700/60">Only visible to admin users. Verify before dispensing.</p>
                  </div>
                ) : (
                  <p className="mt-1.5 text-[9.5px] text-muted">Could not load the attachment. Check the storage record.</p>
                )}
              </div>
            ) : null}

            {selected.consent ? <p className="text-[8.5px] text-muted">Patient consented to being contacted about this enquiry.</p> : null}

            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Update enquiry</p>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                {(["new", "contacted", "closed"] as const).map((item) => (
                  <button key={item} type="button" onClick={() => setStatus(item)} className={cn("rounded-lg border px-2 py-2 text-[9px] font-bold uppercase transition", status === item ? "border-apollo-500 bg-apollo-50 text-apollo-800" : "border-line text-muted hover:border-apollo-200")}>{item}</button>
                ))}
              </div>
              <label className="mt-2 block">
                <span className="label">Internal note</span>
                <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={2} className="field resize-none" placeholder="e.g. Called at 4:15 PM, confirmed stock, will send on WhatsApp" />
              </label>
            </div>

            <div className="flex gap-2">
              <a href={`tel:+91${selected.phone}`} className="btn-outline flex-1 py-2 text-[10px]"><Phone size={12} /> Call patient</a>
              <a
                href={`https://wa.me/91${selected.phone}?text=${encodeURIComponent(`Hi ${selected.name}, this is City Pharmacy regarding your enquiry.`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline flex-1 py-2 text-[10px]"
              >
                <MessageSquare size={12} /> WhatsApp
              </a>
            </div>
          </div>
        ) : null}
      </SidePanel>
    </div>
  );
}
