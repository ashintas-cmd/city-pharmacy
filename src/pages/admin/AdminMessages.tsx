import { useEffect, useMemo, useState } from "react";
import { Check, Download, Mail, MessageSquare, Phone, RefreshCw, Search, Send } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { EmptyState } from "@/components/EmptyState";
import { SidePanel } from "@/components/Modal";
import { useToast } from "@/context/ToastContext";
import { fetchMessages, updateMessage } from "@/lib/firestore";
import { cn, downloadCsv, formatDate } from "@/lib/utils";
import type { ContactMessage } from "@/types";

const statusStyles: Record<string, string> = {
  new: "bg-amber-50 text-amber-700 ring-amber-200",
  read: "bg-sky-50 text-sky-700 ring-sky-200",
  replied: "bg-apollo-50 text-apollo-700 ring-apollo-200",
};

export function AdminMessages() {
  const toast = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "replied">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [status, setStatus] = useState<"new" | "read" | "replied">("new");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setMessages(await fetchMessages());
    } catch (error) {
      console.error(error);
      toast.error("Could not load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((message) => {
      if (filter !== "all" && message.status !== filter) return false;
      if (!q) return true;
      return [message.name, message.email, message.phone, message.subject, message.message].join(" ").toLowerCase().includes(q);
    });
  }, [messages, filter, search]);

  const counts = useMemo(
    () => ({
      all: messages.length,
      new: messages.filter((message) => message.status === "new").length,
      read: messages.filter((message) => message.status === "read").length,
      replied: messages.filter((message) => message.status === "replied").length,
    }),
    [messages],
  );

  const open = (message: ContactMessage) => {
    setSelected(message);
    setStatus(message.status);
    setNote(message.adminNote ?? "");
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateMessage(selected.id!, { status, adminNote: note.trim() });
      const updated = { ...selected, status, adminNote: note.trim() };
      setSelected(updated);
      setMessages((current) => current.map((message) => (message.id === updated.id ? updated : message)));
      toast.success("Message updated");
    } catch {
      toast.error("Could not update the message");
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    downloadCsv("city-pharmacy-messages.csv", [
      ["Date", "Name", "Email", "Phone", "Subject", "Message", "Status", "Note"],
      ...filtered.map((message) => [formatDate(message.createdAt, true), message.name, message.email, message.phone ?? "", message.subject, message.message, message.status, message.adminNote ?? ""]),
    ]);
  };

  return (
    <div>
      <AdminPageHeader title="Contact messages" description={`${counts.new} unread · ${counts.all} total`}>
        <button type="button" onClick={exportCsv} className="btn-outline px-3 py-2 text-[10.5px]"><Download size={13} /> Export CSV</button>
        <button type="button" onClick={() => void load()} className="btn-primary px-3 py-2 text-[10.5px]"><RefreshCw size={13} /> Refresh</button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(["all", "new", "read", "replied"] as const).map((key) => (
          <button key={key} type="button" onClick={() => setFilter(key)} className={cn("rounded-xl border p-3 text-left transition", filter === key ? "border-apollo-500 bg-apollo-50 ring-1 ring-apollo-100" : "border-line bg-white hover:border-apollo-200")}>
            <p className="text-[8.5px] font-bold uppercase tracking-wider text-muted">{key}</p>
            <p className="mt-1 text-xl font-extrabold text-apollo-900">{counts[key]}</p>
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-2xl border border-line bg-white">
        <div className="flex items-center justify-between gap-2 border-b border-line p-3">
          <div className="relative w-full max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search subject, name or email" className="h-8 w-full rounded-lg border border-line bg-cream/50 pl-8 pr-2 text-[10.5px] outline-none focus:border-apollo-400" />
          </div>
          <p className="text-[9.5px] text-muted">{filtered.length} shown</p>
        </div>

        {loading ? (
          <div className="space-y-2 p-3">{[0, 1, 2].map((item) => <div key={item} className="h-14 animate-pulse rounded-xl bg-cream" />)}</div>
        ) : filtered.length ? (
          <div className="divide-y divide-line">
            {filtered.map((message) => (
              <button key={message.id} type="button" onClick={() => open(message)} className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-apollo-50/30">
                <span className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg", message.status === "new" ? "bg-amber-50 text-amber-700" : "bg-apollo-50 text-apollo-700")}>
                  <Mail size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-[11px] font-bold text-ink">{message.subject}</p>
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[7.5px] font-bold uppercase ring-1", statusStyles[message.status])}>{message.status}</span>
                  </div>
                  <p className="mt-0.5 text-[9.5px] text-muted">{message.name} · {message.email}{message.phone ? ` · ${message.phone}` : ""}</p>
                  <p className="mt-0.5 line-clamp-1 text-[9px] text-muted/80">{message.message}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[8.5px] text-muted">{formatDate(message.createdAt)}</p>
                  <span className="text-[9px] font-semibold text-apollo-700">Read →</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState icon={MessageSquare} title="No messages" description="Messages sent through the contact form will appear here." />
        )}
      </div>

      <SidePanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.subject ?? "Message"}
        description={selected ? `${selected.name} · ${formatDate(selected.createdAt, true)}` : undefined}
        footer={
          selected ? (
            <div className="flex items-center justify-between gap-2">
              <a href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`} className="btn-outline px-3 py-2 text-[10px]"><Send size={12} /> Reply by email</a>
              <button type="button" onClick={save} disabled={saving} className="btn-primary px-4 py-2 text-[10.5px]"><Check size={13} /> {saving ? "Saving…" : "Save"}</button>
            </div>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={cn("rounded-full px-2 py-0.5 text-[8px] font-bold uppercase ring-1", statusStyles[selected.status])}>{selected.status}</span>
              {selected.phone ? <a href={`tel:+91${selected.phone}`} className="rounded-full bg-apollo-50 px-2 py-0.5 text-[8px] font-semibold text-apollo-700"><Phone size={9} className="mr-0.5 inline" /> {selected.phone}</a> : null}
            </div>
            <div className="rounded-xl bg-cream p-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted">From</p>
              <p className="mt-1 text-[11px] font-semibold text-ink">{selected.name}</p>
              <a href={`mailto:${selected.email}`} className="text-[10px] text-apollo-700 hover:underline">{selected.email}</a>
              {selected.phone ? <p className="text-[10px] text-muted">{selected.phone}</p> : null}
            </div>
            <div className="rounded-xl border border-line p-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Message</p>
              <p className="mt-1.5 whitespace-pre-line text-[10.5px] leading-relaxed text-ink/75">{selected.message}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Status</p>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                {(["new", "read", "replied"] as const).map((item) => (
                  <button key={item} type="button" onClick={() => setStatus(item)} className={cn("rounded-lg border px-2 py-2 text-[9px] font-bold uppercase transition", status === item ? "border-apollo-500 bg-apollo-50 text-apollo-800" : "border-line text-muted hover:border-apollo-200")}>{item}</button>
                ))}
              </div>
              <label className="mt-2 block">
                <span className="label">Internal note</span>
                <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={2} className="field resize-none" />
              </label>
            </div>
          </div>
        ) : null}
      </SidePanel>
    </div>
  );
}
