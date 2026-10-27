import { useId } from "react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

type PackArtProps = {
  product: Pick<Product, "name" | "brand" | "packSize" | "art">;
  className?: string;
  variant?: "card" | "detail";
};

const hsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;

function wrap(name: string, max = 15) {
  const words = name.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
    if (lines.length === 2) break;
  }
  if (current && lines.length < 2) lines.push(current);
  return lines.slice(0, 2).map((line) => (line.length > max + 2 ? `${line.slice(0, max + 1)}…` : line));
}

export function PackArt({ product, className, variant = "card" }: PackArtProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, "");
  const hue = product.art?.hue ?? 170;
  const type = product.art?.type ?? "box";

  const accent = hsl(hue, 48, 42);
  const deep = hsl(hue, 52, 27);
  const soft = hsl(hue, 65, 93);
  const mid = hsl(hue, 44, 62);
  const lines = wrap(product.name, variant === "detail" ? 17 : 15);
  const brand = (product.brand || "City Pharmacy").toUpperCase().slice(0, 18);
  const pack = product.packSize?.toUpperCase().slice(0, 18) ?? "";

  return (
    <svg
      viewBox="0 0 320 300"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={`${product.name} pack illustration`}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={hsl(hue, 55, 96)} />
          <stop offset="1" stopColor={hsl(hue, 42, 88)} />
        </linearGradient>
        <linearGradient id={`front-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor={hsl(hue, 30, 96)} />
        </linearGradient>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={`shadow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="9" floodColor={deep} floodOpacity="0.22" />
        </filter>
      </defs>

      <rect width="320" height="300" rx="26" fill={`url(#bg-${uid})`} />
      <circle cx="160" cy="152" r="102" fill="#ffffff" opacity="0.45" />
      <circle cx="52" cy="56" r="34" fill={mid} opacity="0.12" />
      <circle cx="281" cy="238" r="46" fill={accent} opacity="0.1" />
      <circle cx="253" cy="62" r="6" fill={accent} opacity="0.55" />
      <circle cx="70" cy="240" r="4" fill={accent} opacity="0.45" />

      {type === "box" && (
        <g filter={`url(#shadow-${uid})`}>
          <path d="M104 88 L224 70 L238 226 L118 244 Z" fill={deep} opacity="0.2" />
          <g transform="rotate(-3 160 160)">
            <rect x="98" y="76" width="124" height="168" rx="9" fill={accent} opacity="0.28" transform="translate(8 7)" />
            <rect x="98" y="76" width="124" height="168" rx="9" fill={`url(#front-${uid})`} stroke={hsl(hue, 35, 80)} strokeWidth="1" />
            <path d="M98 76h124v42H98z" fill={accent} />
            <path d="M98 118h124v5H98z" fill={deep} opacity="0.28" />
            <circle cx="118" cy="97" r="10" fill="#fff" opacity="0.95" />
            <path d="M114 97h8M118 93v8" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
            <text x="136" y="101" fill="#fff" fontFamily="Inter, sans-serif" fontSize="8.5" fontWeight="700" letterSpacing="1">
              {brand.slice(0, 16)}
            </text>
            <text x="110" y="145" fill={deep} fontFamily="Inter, sans-serif" fontSize="13" fontWeight="800">
              {lines.map((line, i) => (
                <tspan key={i} x="110" dy={i === 0 ? 0 : 16}>
                  {line}
                </tspan>
              ))}
            </text>
            <rect x="110" y="190" width="54" height="3" rx="1.5" fill={accent} opacity="0.5" />
            <rect x="110" y="198" width="38" height="3" rx="1.5" fill={accent} opacity="0.28" />
            <text x="110" y="225" fill={hsl(hue, 20, 38)} fontFamily="Inter, sans-serif" fontSize="8.5" fontWeight="600" letterSpacing="0.7">
              {pack}
            </text>
            <text x="110" y="236" fill={hsl(hue, 12, 52)} fontFamily="Inter, sans-serif" fontSize="6.5" letterSpacing="1">
              CITY PHARMACY VERIFIED
            </text>
          </g>
        </g>
      )}

      {type === "bottle" && (
        <g filter={`url(#shadow-${uid})`}>
          <g transform="rotate(3 160 160)">
            <rect x="143" y="52" width="34" height="22" rx="5" fill={deep} />
            <rect x="148" y="55" width="24" height="3" rx="1.5" fill="#fff" opacity="0.22" />
            <rect x="148" y="72" width="24" height="16" rx="3" fill={accent} opacity="0.75" />
            <rect x="116" y="84" width="88" height="158" rx="24" fill={`url(#front-${uid})`} stroke={hsl(hue, 32, 82)} />
            <rect x="123" y="106" width="74" height="102" rx="11" fill={accent} />
            <rect x="123" y="106" width="74" height="18" rx="9" fill={deep} opacity="0.35" />
            <text x="160" y="130" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontSize="7.5" fontWeight="700" letterSpacing="1.2">
              {brand.slice(0, 18)}
            </text>
            <text x="160" y="153" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="800">
              {lines.map((line, i) => (
                <tspan key={i} x="160" dy={i === 0 ? 0 : 14}>
                  {line}
                </tspan>
              ))}
            </text>
            <rect x="136" y="181" width="48" height="2" rx="1" fill="#fff" opacity="0.45" />
            <text x="160" y="197" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontSize="7.5" fontWeight="600" letterSpacing="0.6">
              {pack}
            </text>
            <path d="M130 240h60" stroke={hsl(hue, 25, 70)} strokeWidth="2" strokeLinecap="round" />
            <rect x="128" y="96" width="10" height="112" rx="5" fill={`url(#glass-${uid})`} />
          </g>
        </g>
      )}

      {type === "tube" && (
        <g filter={`url(#shadow-${uid})`}>
          <g transform="rotate(-7 160 160)">
            <path
              d="M128 72c8-8 56-8 64 0l10 150c1 8-5 14-13 14h-58c-8 0-14-6-13-14l10-150Z"
              fill={`url(#front-${uid})`}
              stroke={hsl(hue, 32, 82)}
            />
            <path d="M128 72h64l1 14h-66l1-14Z" fill={hsl(hue, 30, 78)} />
            <rect x="132" y="60" width="56" height="16" rx="4" fill={deep} />
            <rect x="132" y="60" width="56" height="5" rx="2.5" fill="#fff" opacity="0.18" />
            <rect x="126" y="102" width="68" height="92" rx="9" fill={accent} />
            <text x="160" y="122" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="700" letterSpacing="1">
              {brand.slice(0, 17)}
            </text>
            <text x="160" y="145" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="800">
              {lines.map((line, i) => (
                <tspan key={i} x="160" dy={i === 0 ? 0 : 14}>
                  {line}
                </tspan>
              ))}
            </text>
            <text x="160" y="182" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontSize="7.5" fontWeight="600" letterSpacing="0.6">
              {pack}
            </text>
            <rect x="150" y="210" width="20" height="20" rx="5" fill={deep} opacity="0.85" />
            <path d="M154 220h12M160 214v12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      )}

      {type === "device" && (
        <g filter={`url(#shadow-${uid})`}>
          <g transform="rotate(-2 160 160)">
            <rect x="82" y="88" width="156" height="138" rx="20" fill={`url(#front-${uid})`} stroke={hsl(hue, 30, 80)} />
            <rect x="98" y="104" width="86" height="64" rx="9" fill={deep} />
            <path d="M106 136h10l6-14 8 28 7-20 5 6h36" stroke={hsl(hue, 60, 70)} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="192" y="120" fill={deep} fontFamily="Inter, sans-serif" fontSize="7" fontWeight="700" letterSpacing="0.8">
              {brand.slice(0, 12)}
            </text>
            <text x="192" y="134" fill={hsl(hue, 18, 45)} fontFamily="Inter, sans-serif" fontSize="6">
              HEALTH MONITOR
            </text>
            <rect x="98" y="180" width="34" height="12" rx="6" fill={accent} opacity="0.9" />
            <rect x="138" y="180" width="34" height="12" rx="6" fill={hsl(hue, 30, 84)} />
            <circle cx="212" cy="186" r="10" fill={accent} />
            <path d="M208 186h8M212 182v8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            <text x="106" y="214" fill={hsl(hue, 15, 50)} fontFamily="Inter, sans-serif" fontSize="7" fontWeight="600">
              {lines.join(" · ").slice(0, 26)}
            </text>
            <rect x="120" y="232" width="80" height="6" rx="3" fill={hsl(hue, 30, 80)} />
          </g>
        </g>
      )}

      {type === "jar" && (
        <g filter={`url(#shadow-${uid})`}>
          <g transform="rotate(2 160 160)">
            <rect x="118" y="64" width="84" height="26" rx="7" fill={deep} />
            <rect x="123" y="68" width="74" height="4" rx="2" fill="#fff" opacity="0.2" />
            <rect x="108" y="88" width="104" height="150" rx="24" fill={`url(#front-${uid})`} stroke={hsl(hue, 32, 80)} />
            <rect x="108" y="122" width="104" height="82" fill={accent} opacity="0.95" />
            <text x="160" y="142" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="700" letterSpacing="1">
              {brand.slice(0, 18)}
            </text>
            <text x="160" y="163" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontSize="12.5" fontWeight="800">
              {lines.map((line, i) => (
                <tspan key={i} x="160" dy={i === 0 ? 0 : 14}>
                  {line}
                </tspan>
              ))}
            </text>
            <text x="160" y="194" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="600" letterSpacing="0.6">
              {pack}
            </text>
            <circle cx="160" cy="218" r="9" fill="none" stroke={accent} strokeWidth="1.4" opacity="0.55" />
            <path d="M156 218h8M160 214v8" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />
            <rect x="116" y="94" width="8" height="110" rx="4" fill={`url(#glass-${uid})`} opacity="0.6" />
          </g>
        </g>
      )}

      {type === "sachet" && (
        <g filter={`url(#shadow-${uid})`}>
          <g transform="rotate(-4 160 160)">
            <path
              d="M104 84c0-6 4-10 10-10h92c6 0 10 4 10 10v146c0 7-5 12-12 12h-88c-7 0-12-5-12-12V84Z"
              fill={`url(#front-${uid})`}
              stroke={hsl(hue, 30, 80)}
            />
            <path d="M104 74h112v12H104z" fill={hsl(hue, 35, 74)} />
            <path d="M104 74l7 6 7-6 7 6 7-6 7 6 7-6 7 6 7-6 7 6 7-6 7 6 7-6 7 6 7-6 7 6 7-6 7 6 7-6" fill="none" stroke={hsl(hue, 30, 62)} strokeWidth="1.2" />
            <rect x="104" y="108" width="112" height="76" fill={accent} opacity="0.94" />
            <text x="160" y="128" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="700" letterSpacing="1">
              {brand.slice(0, 18)}
            </text>
            <text x="160" y="150" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontSize="12.5" fontWeight="800">
              {lines.map((line, i) => (
                <tspan key={i} x="160" dy={i === 0 ? 0 : 14}>
                  {line}
                </tspan>
              ))}
            </text>
            <text x="160" y="175" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="600">
              {pack}
            </text>
            <circle cx="160" cy="210" r="14" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.4" />
            <path d="M152 210h16M160 202v16" stroke={accent} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
          </g>
        </g>
      )}

      {type === "strip" && (
        <g filter={`url(#shadow-${uid})`}>
          <g transform="rotate(-14 160 160)">
            <rect x="74" y="94" width="172" height="112" rx="14" fill={hsl(hue, 18, 86)} stroke={hsl(hue, 24, 74)} />
            <rect x="82" y="102" width="156" height="96" rx="9" fill="#fff" opacity="0.55" />
            {Array.from({ length: 10 }).map((_, i) => {
              const col = i % 5;
              const row = Math.floor(i / 5);
              return (
                <g key={i}>
                  <circle cx={104 + col * 29} cy={126 + row * 46} r="10" fill={hsl(hue, 32, 88)} />
                  <ellipse cx={104 + col * 29} cy={126 + row * 46} rx="8" ry="9" fill={`url(#front-${uid})`} stroke={hsl(hue, 28, 76)} />
                  <path d={`M${97 + col * 29} ${126 + row * 46}h14`} stroke={accent} strokeWidth="1.2" opacity="0.4" />
                </g>
              );
            })}
            <rect x="74" y="94" width="172" height="9" rx="4.5" fill={accent} opacity="0.8" />
            <text x="160" y="224" textAnchor="middle" fill={hsl(hue, 20, 38)} fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700" letterSpacing="0.8">
              {brand.slice(0, 18)} · {pack}
            </text>
          </g>
        </g>
      )}

      <g opacity="0.9">
        <rect x="22" y="252" width="88" height="22" rx="11" fill="#ffffff" opacity="0.82" />
        <circle cx="34" cy="263" r="4" fill="#156F6C" />
        <path d="M32 263h4M34 261v4" stroke="#fff" strokeWidth="1" strokeLinecap="round" />
        <text x="43" y="266.5" fill="#165D59" fontFamily="Inter, sans-serif" fontSize="7.5" fontWeight="700" letterSpacing="0.6">
          CITY VERIFIED
        </text>
      </g>
    </svg>
  );
}
