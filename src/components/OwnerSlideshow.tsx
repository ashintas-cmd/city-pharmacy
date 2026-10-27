import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const photos = [
  {
    src: "/owner-1.jpg",
    alt: "Akshat Sabharwal, owner of City Pharmacy, in his office",
    focus: "center 22%",
  },
  {
    src: "/owner-2.jpg",
    alt: "Akshat Sabharwal at the City Pharmacy store",
    focus: "center 20%",
  },
  {
    src: "/owner-3.jpg",
    alt: "Akshat Sabharwal, owner of City Pharmacy, Adarsh Nagar",
    focus: "center 18%",
  },
];

export function OwnerSlideshow({
  className,
  showCaption = true,
  interval = 5200,
}: {
  className?: string;
  showCaption?: boolean;
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % photos.length), interval);
    return () => window.clearInterval(timer);
  }, [paused, interval]);

  const go = (direction: number) => {
    setIndex((value) => (value + direction + photos.length) % photos.length);
  };

  return (
    <div
      className={cn("group overflow-hidden bg-apollo-950", className)}
      role="group"
      aria-roledescription="carousel"
      aria-label="Photos of Akshat Sabharwal, owner of City Pharmacy"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {photos.map((photo, photoIndex) => (
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          loading={photoIndex === 0 ? "eager" : "lazy"}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-out",
            photoIndex === index ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
          )}
          style={{ objectPosition: photo.focus }}
          aria-hidden={photoIndex !== index}
        />
      ))}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-apollo-950 via-apollo-950/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-apollo-950/30 via-transparent to-transparent" />

      <div className="absolute left-3 top-3 flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-apollo-950/40 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
          <Sparkles size={9} className="text-amber-300" /> Meet the owner
        </span>
        <span className="rounded-full bg-white/15 px-2 py-1 text-[8px] font-bold text-white/80 backdrop-blur">
          {index + 1}/{photos.length}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-apollo-950/35 text-white/80 backdrop-blur transition hover:bg-apollo-950/60 hover:text-white"
        aria-label={paused ? "Play owner slideshow" : "Pause owner slideshow"}
      >
        {paused ? <Play size={11} fill="currentColor" /> : <Pause size={11} fill="currentColor" />}
      </button>

      <button
        type="button"
        onClick={() => go(-1)}
        className="absolute left-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition hover:bg-white/30 focus:opacity-100 group-hover:opacity-100"
        aria-label="Previous owner photo"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition hover:bg-white/30 focus:opacity-100 group-hover:opacity-100"
        aria-label="Next owner photo"
      >
        <ChevronRight size={16} />
      </button>

      {showCaption ? (
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[7.5px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur">
                Owner · City Pharmacy
              </span>
              <p className="mt-2 text-lg font-extrabold leading-tight text-white drop-shadow sm:text-xl">Akshat Sabharwal</p>
              <p className="mt-0.5 text-[9.5px] font-medium text-white/60">Adarsh Nagar, Delhi</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 pb-1">
              {photos.map((photo, photoIndex) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => setIndex(photoIndex)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    photoIndex === index ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70",
                  )}
                  aria-label={`Show owner photo ${photoIndex + 1}`}
                  aria-current={photoIndex === index}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
