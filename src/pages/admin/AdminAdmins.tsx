import { useEffect, useState } from "react";
import { BadgeCheck, Mail, Plus, RefreshCw, ShieldCheck, Trash2, UserPlus, UsersRound } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { addAdmin, fetchAdmins, removeAdmin } from "@/lib/firestore";
import { formatDate } from "@/lib/utils";
import type { AdminEntry } from "@/types";

export function AdminAdmins() {
  const { user } = useAuth();
  const toast = useToast();
  const [admins, setAdmins] = useState<AdminEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setAdmins(await fetchAdmins());
    } catch (error) {
      console.error(error);
      toast.error("Could not load the admin list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      toast.error("Enter a valid email address");
      return;
    }
    if (admins.some((admin) => admin.email.toLowerCase() === clean)) {
      toast.info("Already an admin", "This email is already on the team list.");
      return;
    }
    setAdding(true);
    try {
      await addAdmin(clean, name.trim());
      setEmail("");
      setName("");
      await load();
      toast.success("Admin added", `${clean} can now sign in to the admin panel.`);
    } catch (error) {
      console.error(error);
      toast.error("Could not add the admin");
    } finally {
      setAdding(false);
    }
  };

  const remove = async (admin: AdminEntry) => {
    if (admin.email.toLowerCase() === user?.email?.toLowerCase()) {
      toast.error("You can't remove yourself", "Ask another admin to remove your access.");
      return;
    }
    setRemoving(admin.email);
    try {
      await removeAdmin(admin.email);
      await load();
      toast.success("Admin removed", admin.email);
    } catch (error) {
      console.error(error);
      toast.error("Could not remove the admin");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Team access" description="Only these email addresses can open the admin panel.">
        <button type="button" onClick={() => void load()} className="btn-outline px-3 py-2 text-[10.5px]"><RefreshCw size={13} /> Refresh</button>
      </AdminPageHeader>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="rounded-2xl border border-line bg-white p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-apollo-50 text-apollo-700"><UserPlus size={16} /></span>
            <div>
              <h3 className="text-[13px] font-bold text-apollo-950">Add an admin</h3>
              <p className="text-[9px] text-muted">Use the email they sign in with.</p>
            </div>
          </div>
          <form onSubmit={add} className="mt-3 space-y-2.5">
            <label className="block">
              <span className="label">Email address</span>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field pl-9" placeholder="name@example.com" />
              </div>
            </label>
            <label className="block">
              <span className="label">Display name (optional)</span>
              <input value={name} onChange={(event) => setName(event.target.value)} className="field" placeholder="e.g. Akshat Sabharwal" />
            </label>
            <button type="submit" disabled={adding} className="btn-primary w-full py-2 text-[10.5px]"><Plus size={13} /> {adding ? "Adding…" : "Grant admin access"}</button>
          </form>
          <div className="mt-3 rounded-xl bg-cream p-3 text-[9px] leading-relaxed text-muted">
            <p className="flex items-center gap-1.5 font-bold text-ink"><ShieldCheck size={12} className="text-apollo-600" /> How this works</p>
            <p className="mt-1">
              Each admin is a document in the Firestore <code className="rounded bg-white px-1">admins</code> collection, keyed by
              email. Firestore security rules check this collection before allowing access to orders, enquiries and the catalogue.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <h3 className="text-[13px] font-bold text-apollo-950">Admin team</h3>
              <p className="text-[9px] text-muted">{admins.length} {admins.length === 1 ? "person" : "people"} with access</p>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-apollo-50 text-apollo-700"><UsersRound size={15} /></span>
          </div>
          {loading ? (
            <div className="space-y-2 p-3">{[0, 1].map((item) => <div key={item} className="h-14 animate-pulse rounded-xl bg-cream" />)}</div>
          ) : admins.length ? (
            <div className="divide-y divide-line">
              {admins.map((admin) => {
                const self = admin.email.toLowerCase() === user?.email?.toLowerCase();
                return (
                  <div key={admin.email} className="flex items-center gap-3 px-4 py-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-apollo-700 text-[11px] font-bold text-white">
                      {(admin.name || admin.email).charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-1.5 text-[10.5px] font-semibold text-ink">
                        {admin.name || admin.email.split("@")[0]}
                        {self ? <span className="rounded bg-apollo-50 px-1.5 py-0.5 text-[7px] font-bold uppercase text-apollo-700">You</span> : null}
                      </p>
                      <p className="truncate text-[9px] text-muted">{admin.email}</p>
                      <p className="mt-0.5 text-[8px] text-muted/70">Added {formatDate(admin.addedAt)}</p>
                    </div>
                    <span className="hidden items-center gap-1 rounded-full bg-apollo-50 px-2 py-0.5 text-[7.5px] font-bold text-apollo-700 sm:flex"><BadgeCheck size={9} /> Active</span>
                    <button
                      type="button"
                      onClick={() => remove(admin)}
                      disabled={self || removing === admin.email}
                      className="grid h-7 w-7 place-items-center rounded-lg text-muted transition hover:bg-coral-50 hover:text-coral-600 disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={`Remove ${admin.email}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={UsersRound} title="No admins found" description="Add an admin email to grant access to the panel." />
          )}
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[9.5px] leading-relaxed text-amber-900">
        <p className="font-bold">Who should be an admin?</p>
        <p className="mt-0.5 text-amber-900/75">
          Add the owner (Akshat Sabharwal) and trusted pharmacy staff only. Admins can see patient contact details,
          prescriptions, orders and revenue. Removing an email does not delete the Google account — it only removes panel
          access.
        </p>
      </div>
    </div>
  );
}
