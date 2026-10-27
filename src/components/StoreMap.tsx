import { ArrowUpRight, MapPin } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { cn } from "@/lib/utils";

export function StoreMap({ className, dark = false }: { className?: string; dark?: boolean }) {
  const { settings } = useCatalog();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.mapQuery)}`;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-line bg-[#E8EFE9]", className)}>
      <svg
        viewBox="0 0 640 420"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={`Illustrated map showing City Pharmacy in ${settings.city}`}
      >
        <rect width="640" height="420" fill="#E9F0E8" />
        <g fill="#DCE7DB">
          <rect x="24" y="28" width="120" height="82" rx="10" />
          <rect x="168" y="28" width="92" height="52" rx="10" />
          <rect x="284" y="20" width="130" height="80" rx="10" />
          <rect x="448" y="30" width="100" height="70" rx="10" />
          <rect x="576" y="26" width="90" height="90" rx="10" />
          <rect x="30" y="164" width="96" height="92" rx="10" />
          <rect x="154" y="152" width="86" height="76" rx="10" />
          <rect x="418" y="152" width="108" height="88" rx="10" />
          <rect x="552" y="150" width="100" height="76" rx="10" />
          <rect x="28" y="320" width="126" height="80" rx="10" />
          <rect x="190" y="306" width="92" height="90" rx="10" />
          <rect x="416" y="304" width="120" height="94" rx="10" />
          <rect x="562" y="300" width="92" height="96" rx="10" />
        </g>
        <g fill="#CFE1CC">
          <rect x="182" y="324" width="108" height="70" rx="18" />
          <circle cx="506" cy="102" r="26" />
          <circle cx="90" cy="290" r="16" />
        </g>
        <g stroke="#F8FBF6" strokeLinecap="round">
          <path d="M-20 138 C120 118 210 150 330 142 C450 134 540 112 680 138" strokeWidth="34" />
          <path d="M-20 278 C130 262 260 288 360 278 C470 266 560 286 680 270" strokeWidth="24" />
          <path d="M268 -20 C258 90 282 180 272 300 C264 380 276 410 270 440" strokeWidth="28" />
          <path d="M478 -20 C470 92 492 178 486 292 C482 370 492 404 486 440" strokeWidth="20" />
        </g>
        <g stroke="#E4C88D" strokeWidth="3" strokeDasharray="14 12" opacity=".9">
          <path d="M-20 138 C120 118 210 150 330 142 C450 134 540 112 680 138" />
          <path d="M268 -20 C258 90 282 180 272 300 C264 380 276 410 270 440" />
        </g>
        <g fill="#8B9C8A" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" letterSpacing="2">
          <text x="56" y="206">ADARSH NAGAR</text>
          <text x="500" y="206">AZADPUR</text>
          <text x="60" y="390">MAIN MARKET</text>
          <text x="382" y="76">MODEL TOWN</text>
        </g>
        <g fill="#B9C8B7" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="600" letterSpacing="1">
          <text x="298" y="132">GT KARNAL ROAD</text>
          <text x="488" y="268">RING ROAD</text>
        </g>
        <g>
          <circle cx="320" cy="190" r="42" fill="#156F6C" opacity=".08" />
          <circle cx="320" cy="190" r="28" fill="#156F6C" opacity=".12" />
          <path d="M320 160c-13 0-24 10.6-24 23.7 0 17.4 24 40.3 24 40.3s24-22.9 24-40.3C344 170.6 333 160 320 160Z" fill="#156F6C" />
          <circle cx="320" cy="184" r="10" fill="#fff" />
          <path d="M316 184h8M320 180v8" stroke="#156F6C" strokeWidth="2.4" strokeLinecap="round" />
        </g>
        <g fill="#156F6C" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="800" letterSpacing="0.8">
          <text x="276" y="232">CITY PHARMACY</text>
        </g>
      </svg>

      <div className="absolute inset-x-3 bottom-3">
        <div className={cn("flex items-center gap-2.5 rounded-xl p-2.5 shadow-soft backdrop-blur", dark ? "bg-apollo-950/95 text-white" : "bg-white/95")}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-apollo-700 text-white">
            <MapPin size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <p className={cn("truncate text-[10px] font-bold", dark ? "text-white" : "text-ink")}>{settings.name}</p>
            <p className={cn("truncate text-[8.5px]", dark ? "text-white/55" : "text-muted")}>
              {settings.addressLine1}, {settings.city} – {settings.pincode}
            </p>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className={cn("flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[8.5px] font-bold", dark ? "bg-white text-apollo-900" : "bg-apollo-700 text-white")}
          >
            Directions <ArrowUpRight size={10} />
          </a>
        </div>
      </div>
    </div>
  );
}
