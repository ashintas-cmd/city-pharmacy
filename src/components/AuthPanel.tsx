import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14Z" />
      <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10C7.2 7.7 9.4 6 12 6Z" />
    </svg>
  );
}

export function AuthPanel({
  title = "Sign in to City Pharmacy",
  subtitle = "Save addresses, track orders and check out faster.",
  onSuccess,
  admin = false,
  compact = false,
  defaultMode = "signin",
}: {
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
  admin?: boolean;
  compact?: boolean;
  defaultMode?: "signin" | "signup";
}) {
  const { signInGoogle, signInEmail, signUpEmail, sendReset } = useAuth();
  const toast = useToast();
  const [mode, setMode] = useState<"signin" | "signup" | "reset">(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState<"google" | "email" | null>(null);
  const [error, setError] = useState("");

  const done = (message: string) => {
    toast.success(message);
    onSuccess?.();
  };

  const handleGoogle = async () => {
    setBusy("google");
    setError("");
    try {
      await signInGoogle();
      done("Welcome to City Pharmacy");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      setBusy(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (mode === "reset") {
      if (!email.trim()) {
        setError("Enter the email linked to your account.");
        return;
      }
      setBusy("email");
      try {
        await sendReset(email);
        toast.success("Reset link sent", "Check your inbox and spam folder.");
        setMode("signin");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not send reset email.");
      } finally {
        setBusy(null);
      }
      return;
    }

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      setError("Use at least 6 characters for your password.");
      return;
    }

    setBusy("email");
    try {
      if (mode === "signup") {
        await signUpEmail(name, email, password);
        done("Account created. Welcome!");
      } else {
        await signInEmail(email, password);
        done(admin ? "Admin signed in" : "Signed in successfully");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className={cn("w-full", compact ? "" : "p-1")}>
      <div className="mb-4">
        <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-apollo-50 text-apollo-700">
          {admin ? <ShieldCheck size={20} /> : <Lock size={19} />}
        </span>
        <h2 className="text-xl font-extrabold tracking-tight text-apollo-900">{title}</h2>
        <p className="mt-1 text-[11.5px] leading-relaxed text-muted">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={busy !== null}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-semibold text-ink shadow-sm transition hover:border-apollo-300 hover:bg-apollo-50/50 disabled:opacity-60"
      >
        {busy === "google" ? <Loader2 size={15} className="animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </button>

      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[9px] font-semibold uppercase tracking-widest text-muted">or use email</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      {mode !== "reset" ? (
        <div className="mb-4 grid grid-cols-2 rounded-xl bg-cream p-1">
          {(["signin", "signup"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setMode(tab);
                setError("");
              }}
              className={cn(
                "rounded-lg py-2 text-[11px] font-semibold transition",
                mode === tab ? "bg-white text-apollo-800 shadow-sm" : "text-muted hover:text-ink",
              )}
            >
              {tab === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-cream px-3 py-2">
          <span className="text-[11px] font-semibold text-apollo-800">Reset your password</span>
          <button type="button" onClick={() => setMode("signin")} className="text-[10px] font-bold text-apollo-600 hover:underline">
            Back to sign in
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "signup" ? (
          <label className="block">
            <span className="label">Full name</span>
            <div className="relative">
              <UserRound size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                placeholder="Your name"
                className="field pl-9"
              />
            </div>
          </label>
        ) : null}

        <label className="block">
          <span className="label">Email address</span>
          <div className="relative">
            <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              className="field pl-9"
              required
            />
          </div>
        </label>

        {mode !== "reset" ? (
          <label className="block">
            <span className="label">Password</span>
            <div className="relative">
              <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
                className="field pl-9 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted transition hover:bg-cream"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </label>
        ) : null}

        {mode === "signin" ? (
          <div className="text-right">
            <button type="button" onClick={() => setMode("reset")} className="text-[10.5px] font-semibold text-apollo-600 hover:underline">
              Forgot password?
            </button>
          </div>
        ) : null}

        {error ? (
          <p className="rounded-lg border border-coral-200 bg-coral-50 px-3 py-2 text-[11px] font-medium text-coral-700">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={busy !== null} className="btn-primary w-full py-2.5">
          {busy === "email" ? <Loader2 size={15} className="animate-spin" /> : null}
          {mode === "signup" ? "Create my account" : mode === "reset" ? "Send reset link" : "Sign in"}
        </button>
      </form>

      <p className="mt-3 text-center text-[9.5px] leading-relaxed text-muted">
        By continuing you agree to our{" "}
        <a href="/terms" className="font-semibold text-apollo-700 hover:underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="font-semibold text-apollo-700 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
      {admin ? (
        <p className="mt-3 rounded-lg bg-sand px-3 py-2 text-[10px] leading-relaxed text-amber-900">
          Admin access is limited to email addresses listed in the <strong>admins</strong> collection. Ask the owner to
          add your email if you cannot access the panel.
        </p>
      ) : null}
    </div>
  );
}
