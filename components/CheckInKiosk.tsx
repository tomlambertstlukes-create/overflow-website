"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ExternalLink,
  Play,
  Settings2,
  ShieldCheck,
  Sparkles,
  Square,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react";

const CHECKIN_URL =
  process.env.NEXT_PUBLIC_KO_CHECKIN_URL ||
  "https://kingdomoverflow.churchsuite.com/checkin";

const JOIN_FORM_URL =
  process.env.NEXT_PUBLIC_KO_JOIN_FORM_URL ||
  "https://kingdomoverflow.churchsuite.com/-/forms/zqtiiald";

type Mode = "home" | "join" | "staff-start" | "staff-end";

function formatClock(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export default function CheckInKiosk() {
  const [mode, setMode] = useState<Mode>("home");
  const [now, setNow] = useState(() => new Date());
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 10_000);
    setSessionReady(window.localStorage.getItem("ko-checkin-session-ready") === "true");
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
    };
  }, []);

  useEffect(() => setFrameLoaded(false), [mode]);

  const markSessionReady = (ready: boolean) => {
    setSessionReady(ready);
    window.localStorage.setItem("ko-checkin-session-ready", String(ready));
  };

  const returnHome = (registrationFinished = false) => {
    setMode("home");
    setStaffOpen(false);
    setJustRegistered(registrationFinished);
    if (registrationFinished) {
      window.setTimeout(() => setJustRegistered(false), 7_500);
    }
  };

  if (mode === "join") {
    return (
      <section className="fixed inset-0 z-[100] flex min-h-[100dvh] flex-col overflow-hidden bg-[#101821] text-white">
        <header className="relative z-10 flex min-h-20 items-center justify-between gap-3 border-b border-white/10 bg-[#141D26]/95 px-4 py-3 backdrop-blur-2xl sm:px-6">
          <button
            type="button"
            onClick={() => returnHome(false)}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 text-sm font-bold text-white/85"
          >
            <ChevronLeft className="h-5 w-5" />
            Check-in home
          </button>
          <a
            href={JOIN_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 text-sm font-bold text-white/75"
          >
            Open directly <ExternalLink className="h-4 w-4" />
          </a>
        </header>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col p-2 sm:p-3">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.6rem] border border-white/10 bg-white shadow-2xl shadow-black/35 sm:rounded-[2rem]">
            {!frameLoaded && (
              <div className="absolute inset-0 z-10 grid place-items-center bg-[#F8F7F3] text-[#141D26]">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#141D26]/10 border-t-[#C51F5D]" />
                  <p className="text-sm font-bold">Loading registration…</p>
                </div>
              </div>
            )}
            <iframe
              src={JOIN_FORM_URL}
              title="Kingdom Overflow registration"
              className="h-full w-full border-0 bg-white"
              onLoad={() => setFrameLoaded(true)}
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 sm:mt-3 sm:px-5">
            <div className="hidden items-center gap-2 text-sm text-white/60 sm:flex">
              <ShieldCheck className="h-4 w-4 text-[#E2E2D2]" />
              Your details are handled securely through ChurchSuite.
            </div>
            <button
              type="button"
              onClick={() => returnHome(true)}
              className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--cream)] px-5 text-sm font-black text-[#141D26]"
            >
              Finished registering? Return home <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (mode === "staff-start" || mode === "staff-end") {
    const starting = mode === "staff-start";
    return (
      <section className="fixed inset-0 z-[100] min-h-[100dvh] overflow-auto bg-[#101821] text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-28 -top-36 h-96 w-96 rounded-full bg-[#F300C5]/20 blur-3xl" />
          <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-[#4162FF]/15 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-[100dvh] max-w-5xl flex-col px-5 py-6 sm:px-8 sm:py-8">
          <header className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => returnHome(false)}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 text-sm font-bold text-white/85"
            >
              <ChevronLeft className="h-5 w-5" /> Check-in home
            </button>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Staff controls</div>
          </header>

          <main className="flex flex-1 items-center py-10 sm:py-14">
            <div className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-9">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--cream)] text-[#141D26]">
                {starting ? <Play className="h-7 w-7" /> : <Square className="h-7 w-7" />}
              </div>
              <div className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-[#F300C5]">
                {starting ? "Start today’s session" : "Finish today’s session"}
              </div>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] sm:text-5xl">
                {starting ? "Start from a Gathering" : "Close the current session"}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
                {starting
                  ? "ChurchSuite does not allow its Check-In screen to be embedded here, so session setup opens directly in ChurchSuite. Choose Show More → Create from gathering → select the Gathering name → confirm/save."
                  : "Open ChurchSuite Check-In, go to Admin → Close, then confirm. Any attendees still checked in will be checked out when the session closes."}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <a
                  href={CHECKIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#F300C5] to-[#C51F5D] px-6 text-center text-base font-black text-white shadow-xl shadow-[#C51F5D]/20 transition hover:-translate-y-0.5"
                >
                  Open ChurchSuite {starting ? "session setup" : "Check-In"}
                  <ExternalLink className="h-5 w-5" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    markSessionReady(starting);
                    returnHome(false);
                  }}
                  className="inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-[var(--cream)] px-6 text-center text-base font-black text-[#141D26] transition hover:-translate-y-0.5"
                >
                  {starting ? "Session is live — return home" : "Session is closed — return home"}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm leading-6 text-white/45">
                ChurchSuite opens in a separate tab so this KO kiosk screen stays available. Complete the session action there, then return to this tab and confirm above.
              </div>
            </div>
          </main>
        </div>
      </section>
    );
  }

  return (
    <section className="fixed inset-0 z-[100] min-h-[100dvh] overflow-auto bg-[#141D26] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 12%, rgba(243,0,197,.16), transparent 30%), radial-gradient(circle at 82% 78%, rgba(65,98,255,.14), transparent 28%), radial-gradient(circle at 72% 15%, rgba(197,31,93,.14), transparent 26%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-7xl flex-col px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.055] shadow-lg shadow-black/15 sm:h-16 sm:w-16">
              <img src="/brand/ko-logo-cream.png" alt="Kingdom Overflow" className="h-11 w-11 object-contain sm:h-12 sm:w-12" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-[var(--cream)] sm:text-xl">Kingdom Overflow</div>
              <div className="mt-0.5 text-[0.62rem] uppercase tracking-[0.18em] text-white/45 sm:text-xs sm:tracking-[0.22em]">
                Belonging • Opportunity • Wellbeing
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black tabular-nums tracking-tight text-[var(--cream)] sm:text-3xl">{formatClock(now)}</div>
            <div className="mt-0.5 hidden text-xs font-semibold text-white/40 sm:block">{formatDate(now)}</div>
          </div>
        </header>

        <main className="flex flex-1 items-center py-8 sm:py-12 lg:py-14">
          <div className="w-full">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-white/65">
                <Sparkles className="h-3.5 w-3.5 text-[#F300C5]" /> Welcome
              </div>
              <h1 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Good to see you.
                <span className="block bg-gradient-to-r from-[#F300C5] via-[#C51F5D] to-[#E2E2D2] bg-clip-text text-transparent">
                  Let’s get you checked in.
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/58 sm:text-lg sm:leading-8">
                Been before? Check in for today. First time with us? Register once, then you’ll be ready to check in.
              </p>
            </div>

            {justRegistered && (
              <div className="mx-auto mt-7 flex max-w-2xl items-center justify-center gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-5 py-4 text-center text-sm font-bold text-emerald-100">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                You’re registered. Now tap Check in to join today’s session.
              </div>
            )}

            <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:mt-10 sm:grid-cols-2 lg:gap-6">
              <button
                type="button"
                disabled={!sessionReady}
                onClick={() => sessionReady && window.location.assign(CHECKIN_URL)}
                className={`group relative min-h-56 overflow-hidden rounded-[2rem] border p-7 text-left shadow-2xl transition duration-300 sm:min-h-72 sm:p-8 ${
                  sessionReady
                    ? "border-white/10 bg-[var(--cream)] text-[#141D26] shadow-black/20 hover:-translate-y-1"
                    : "cursor-not-allowed border-white/10 bg-white/[0.035] text-white/45 shadow-black/10"
                }`}
              >
                <div className={`grid h-14 w-14 place-items-center rounded-2xl shadow-lg ${sessionReady ? "bg-[#141D26] text-[var(--cream)]" : "bg-white/10 text-white/40"}`}>
                  <UsersRound className="h-7 w-7" />
                </div>
                <div className="mt-10 sm:mt-12">
                  <div className={`text-xs font-black uppercase tracking-[0.2em] ${sessionReady ? "text-[#243447]/55" : "text-white/35"}`}>
                    {sessionReady ? "I’ve been before" : "Waiting for staff"}
                  </div>
                  <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] sm:text-4xl">Check in</h2>
                  <div className={`mt-4 flex items-center justify-between gap-4 text-sm font-bold ${sessionReady ? "text-[#243447]/70" : "text-white/35"}`}>
                    <span>{sessionReady ? "Open today’s ChurchSuite Check-In" : "A team member needs to start today’s session first"}</span>
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${sessionReady ? "bg-[#141D26] text-white" : "bg-white/10 text-white/30"}`}>
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("join")}
                className="group relative min-h-56 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-7 text-left shadow-2xl shadow-black/15 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.075] sm:min-h-72 sm:p-8"
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#F300C5] via-[#C51F5D] to-[#E2E2D2]" />
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/10 text-[#F7DDF1]">
                  <UserPlus className="h-7 w-7" />
                </div>
                <div className="mt-10 sm:mt-12">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-white/45">First time with us</div>
                  <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl">New here</h2>
                  <div className="mt-4 flex items-center justify-between gap-4 text-sm font-bold text-white/58">
                    <span>Register once — it only takes a moment</span>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#F300C5] to-[#C51F5D] text-white">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </main>

        <footer className="flex items-center justify-between gap-3 border-t border-white/8 pt-4 text-xs text-white/35">
          <div className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-white/45" /> Secure check-in powered by ChurchSuite
          </div>
          <button
            type="button"
            onClick={() => setStaffOpen(true)}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 font-bold text-white/55"
          >
            <Settings2 className="h-4 w-4" /> Staff
          </button>
        </footer>
      </div>

      {staffOpen && (
        <div className="fixed inset-0 z-[200] grid place-items-center bg-[#080D12]/80 p-4 backdrop-blur-xl">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#17212B] shadow-2xl shadow-black/50">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-[#F300C5]">Staff only</div>
                <h2 className="mt-1 text-2xl font-black tracking-tight">Session controls</h2>
                <p className="mt-2 text-sm leading-6 text-white/55">Start or close the ChurchSuite Check-In session for this kiosk.</p>
              </div>
              <button
                type="button"
                aria-label="Close staff controls"
                onClick={() => setStaffOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.055] text-white/70"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-bold ${sessionReady ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : "border-white/10 bg-white/[0.04] text-white/55"}`}>
                {sessionReady ? "This kiosk is marked ready for check-in." : "No live session has been confirmed on this kiosk yet."}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => { setStaffOpen(false); setMode("staff-start"); }}
                  className="rounded-[1.5rem] border border-white/10 bg-[var(--cream)] p-5 text-left text-[#141D26]"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#141D26] text-white"><Play className="h-5 w-5" /></div>
                  <h3 className="mt-5 text-xl font-black">Start session</h3>
                  <p className="mt-2 text-sm leading-6 text-[#243447]/70">Open ChurchSuite, choose <strong>Create from gathering</strong>, select the Gathering name, then confirm.</p>
                </button>
                <button
                  type="button"
                  onClick={() => { setStaffOpen(false); setMode("staff-end"); }}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 text-left text-white"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/10 text-[#F7DDF1]"><Square className="h-5 w-5" /></div>
                  <h3 className="mt-5 text-xl font-black">End session</h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">Open the active session’s Admin area, choose <strong>Close</strong>, then confirm.</p>
                </button>
              </div>
              <p className="mt-5 text-xs leading-5 text-white/35">The Gathering picker stays inside ChurchSuite, so it always reflects your current configured Gatherings.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
