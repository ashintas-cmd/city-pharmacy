import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, BadgeCheck, Clock3, Gem, ShieldCheck, Sparkles, Truck, UserRound } from "lucide-react";
import { AuthPanel } from "@/components/AuthPanel";
import { useAuth } from "@/context/AuthContext";
import { usePageMeta } from "@/hooks/usePageMeta";

export function LoginPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const redirect = params.get("redirect") || "/account";

  usePageMeta("Sign in | City Pharmacy", "Sign in with Google or email to order medicines, track orders and save delivery addresses.");

  useEffect(() => {
    if (!loading && user) navigate(redirect, { replace: true });
  }, [loading, user, navigate, redirect]);

  return (
    <div className="shell py-8 sm:py-12">
      <div className="grid overflow-hidden rounded-3xl border border-line bg-white lg:grid-cols-2">
        <div className="p-6 sm:p-10">
          <AuthPanel onSuccess={() => navigate(redirect, { replace: true })} />
          <p className="mt-5 text-center text-[10px] text-muted">
            <Link to="/admin" className="font-semibold text-apollo-700 hover:underline">Pharmacy staff? Open the admin panel</Link>
          </p>
        </div>

        <div className="relative hidden overflow-hidden bg-gradient-to-br from-apollo-800 to-apollo-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[30px] border-white/5" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-apollo-100 ring-1 ring-white/15">
              <UserRound size={11} /> City Pharmacy account
            </span>
            <h2 className="mt-4 text-[30px] font-extrabold leading-tight">
              Your health,<br />
              remembered.
            </h2>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/60">
              One account for faster checkout, saved addresses, prescription refills and every City Pharmacy order — on
              your phone or at the store.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                { icon: Sparkles, title: "Diwali savings, automatic", text: "Your 15% offer is applied the moment you add eligible items." },
                { icon: Truck, title: "Faster checkout", text: "Saved addresses and delivery preferences." },
                { icon: ShieldCheck, title: "Private & secure", text: "Google sign-in or email — we never see your password." },
                { icon: Clock3, title: "Order history", text: "Reorder regular medicines in a couple of taps." },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-apollo-100">
                    <item.icon size={15} />
                  </span>
                  <span>
                    <span className="block text-[11.5px] font-semibold text-white">{item.title}</span>
                    <span className="mt-0.5 block text-[10px] leading-relaxed text-white/50">{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-apollo-100">
              <Gem size={13} /> Trusted by 25,000+ families in North Delhi
            </div>
            <p className="mt-1.5 text-[10px] leading-relaxed text-white/50">
              Licensed pharmacy · Owner: Akshat Sabharwal · Adarsh Nagar, Delhi 110033
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[9px] text-white/40">
              <span className="flex items-center gap-1"><BadgeCheck size={10} /> Genuine stock</span>
              <span className="flex items-center gap-1"><Clock3 size={10} /> Open 24×7</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] text-muted">
        <Link to="/shop" className="font-semibold text-apollo-700 hover:underline">Continue browsing without signing in</Link>
        <span className="h-3 w-px bg-line" />
        <Link to="/enquiry" className="hover:text-apollo-700">Patient enquiry</Link>
        <span className="h-3 w-px bg-line" />
        <Link to="/contact" className="hover:text-apollo-700">Contact the store</Link>
      </div>
    </div>
  );
}
