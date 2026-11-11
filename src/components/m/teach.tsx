"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, BookOpen, Check, CheckCircle2, X, FileText, FileUp, GraduationCap, Loader, Mail, Scale, Search, Tags } from "lucide-react"
import { toast } from "sonner"

import { OperatorCard } from "@/components/m/operator"
import { FactsSheet, type SheetFact } from "@/components/m/facts-sheet"
import { useDone } from "@/components/m/store"
import { Card, Empty, Field, Group, Icon, PageTitle, Row, Section, Select, btn, inputCls } from "@/components/m/ui"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { DOCS, ME, REQUEST_TYPES, RULES, STAGES, type Rule, type Stage } from "@/lib/moneiva/data"
import { FACT_COUNT, KNOWS, NEW_DOC, factsFrom } from "@/lib/moneiva/playbook-data"
import { EMAIL_SOURCE, RUNS, THREADS } from "@/lib/moneiva/training-data"
import { STAGE_INFO, TEACH_ITEMS } from "@/lib/minimal"

const EMAIL = "Your email history"
type Phase = "ready" | "empty" | "reading"
type Open = { title: string; sub: string; facts: SheetFact[]; checkable?: boolean } | null

export type TeachPanel = "rules" | "types" | "email" | "right"

export function Teach({ initialPhase, initialPanel }: { initialPhase: Phase; initialPanel?: TeachPanel }) {
  const [phase, setPhase] = useState<Phase>(initialPhase)
  const [q, setQ] = useState("")
  const [open, setOpen] = useState<Open>(null)
  const [panel, setPanel] = useState<TeachPanel | null>(initialPanel ?? null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const isDone = useDone()
  const toCheck = TEACH_ITEMS.filter((t) => !isDone(t.kind === "new" ? t.item.id : t.thread.id)).length

  const all = useMemo(() => KNOWS.flatMap((g) => g.facts.map((f) => ({ ...f, group: g.name }))), [])
  const hits = q.trim() ? all.filter((f) => f.text.toLowerCase().includes(q.trim().toLowerCase())) : []

  const newDocFacts = NEW_DOC.facts.map((f) => ({ ...f, src: NEW_DOC.name }))
  const openDoc = (name: string) => {
    const facts = name === NEW_DOC.name ? newDocFacts : factsFrom(name)
    setOpen({ title: name, sub: `Learned ${facts.length} facts from this ${name === EMAIL ? "email" : "document"}. Mark anything wrong and it will be removed.`, facts })
  }

  function upload() {
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      setUploaded(true)
      toast.success(`Learned ${NEW_DOC.facts.length} facts from ${NEW_DOC.name}`, {
        action: { label: "Review", onClick: () => openDoc(NEW_DOC.name) },
        duration: 8000,
      })
    }, 2500)
  }

  if (phase === "empty") {
    return (
      <>
        <PageTitle title="Teach" />
        <Card>
          <Empty
            icon={<GraduationCap />}
            title="Teach it how your team works."
            sub="Connect your team's mailbox. It reads your past email to learn what your team does for each kind of request. Nothing is sent."
          >
            <button className={btn.large} onClick={() => setPhase("reading")}>
              Connect email
            </button>
            <button className={cn(btn.secondary, "h-12 px-6 text-[17px]")} onClick={upload}>
              Upload a document
            </button>
          </Empty>
        </Card>
      </>
    )
  }

  if (phase === "reading") {
    const pct = Math.round((EMAIL_SOURCE.readingDone / EMAIL_SOURCE.readingTotal) * 100)
    return (
      <>
        <PageTitle title="Teach" />
        <Card className="flex flex-col items-center px-6 py-14 text-center">
          <div className="relative mb-6 size-28">
            <svg viewBox="0 0 36 36" className="size-28 -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" strokeWidth="2.5" className="stroke-secondary" />
              <circle cx="18" cy="18" r="16" fill="none" strokeWidth="2.5" strokeLinecap="round" className="stroke-primary" strokeDasharray={`${pct} 100`} pathLength={100} />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-[24px] font-semibold">{pct}%</span>
          </div>
          <h2 className="text-[24px] font-semibold tracking-tight">Reading your email history</h2>
          <p className="mt-2 max-w-md text-[15px] text-muted-foreground">
            {EMAIL_SOURCE.readingDone} of {EMAIL_SOURCE.readingTotal} threads from {EMAIL_SOURCE.mailbox}. You can leave this page. You&apos;ll find things to check here when it&apos;s done.
          </p>
          <button className={cn(btn.secondary, "mt-7")} onClick={() => setPhase("ready")}>
            Skip ahead (mockup)
          </button>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageTitle title="Teach" lead="Teach the Operator how your team works. It learns through its agents, and every answer means it asks you less." />

      <OperatorCard className="mb-12" />

      <Card className="mb-12 flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="flex-1">
          <div className="text-[64px] leading-none font-bold tracking-tight">{toCheck}</div>
          <p className="mt-2 text-[17px] text-muted-foreground">
            {toCheck === 1 ? "thing" : "things"} to check from email it read or watched. Each answer means it asks you less.
          </p>
        </div>
        {toCheck > 0 && (
          <Link href="/teach/check" className={btn.large}>
            Start
            <ArrowRight className="size-5" />
          </Link>
        )}
      </Card>

      <Group className="-mt-8 mb-12">
        <Row
          onClick={() => setPanel("right")}
          icon={
            <Icon tone="green">
              <CheckCircle2 />
            </Icon>
          }
          title={`${RIGHT.length} it got right`}
          sub="Confirm them so it trusts these answers sooner"
        />
      </Group>

      <Section title="Add to what it knows">
        <div className="grid gap-3 sm:grid-cols-2">
          <button onClick={() => setPanel("email")} className="text-left">
            <Card className="flex h-full items-start gap-4 p-5 transition hover:shadow-md">
              <Icon tone="blue">
                <Mail />
              </Icon>
              <div>
                <div className="text-[17px] font-semibold">Email history</div>
                <div className="mt-1 text-[14px] text-muted-foreground">Import past threads from {EMAIL_SOURCE.mailbox}. 199 read so far.</div>
              </div>
            </Card>
          </button>
          <button onClick={upload} disabled={uploading} className="text-left">
            <Card className="flex h-full items-start gap-4 p-5 transition hover:shadow-md">
              <Icon tone="blue">{uploading ? <Loader className="animate-spin" /> : <FileUp />}</Icon>
              <div>
                <div className="text-[17px] font-semibold">{uploading ? `Reading ${NEW_DOC.name}` : "Upload a document"}</div>
                <div className="mt-1 text-[14px] text-muted-foreground">
                  {uploading ? "This takes a moment." : "Guides, rate sheets, dock hours. It lists every fact it learns so you can check them."}
                </div>
              </div>
            </Card>
          </button>
        </div>
      </Section>

      <Section title="What it knows">
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${FACT_COUNT} facts`}
            className="h-11 w-full rounded-xl bg-card pr-4 pl-10 text-[15px] shadow-[0_1px_2px_rgb(0_0_0/0.04)] outline-none placeholder:text-muted-foreground focus:ring-4 focus:ring-primary/15"
          />
        </div>
        {q.trim() ? (
          <Group>
            {hits.length ? (
              hits.slice(0, 12).map((f, i) => <Row key={i} title={<span className="whitespace-normal">{f.text}</span>} sub={`${f.group} · ${f.src}`} />)
            ) : (
              <Row title="Nothing found" sub="Try another word, or teach it by uploading a document." />
            )}
          </Group>
        ) : (
          <Group>
            {KNOWS.map((g) => (
              <Row
                key={g.name}
                onClick={() => setOpen({ title: g.name, sub: `${g.facts.length} facts`, facts: g.facts.map((f) => ({ text: f.text, src: f.src })) })}
                icon={
                  <Icon>
                    <BookOpen />
                  </Icon>
                }
                title={g.name}
                value={`${g.facts.length}`}
              />
            ))}
            <Row
              onClick={() => setPanel("rules")}
              icon={
                <Icon>
                  <Scale />
                </Icon>
              }
              title="Rules you set"
              sub="Things it must always or never do"
              value={`${RULES.filter((r) => r.active).length}`}
            />
            <Row
              onClick={() => setPanel("types")}
              icon={
                <Icon>
                  <Tags />
                </Icon>
              }
              title="Kinds of email"
              sub="Each one moves from Learning to Autopilot on its own"
              value={`${REQUEST_TYPES.length}`}
            />
          </Group>
        )}
      </Section>

      <Section title="Where it learned it">
        <Group>
          <Row
            onClick={() => openDoc(EMAIL)}
            icon={
              <Icon>
                <Mail />
              </Icon>
            }
            title="Email history"
            sub={EMAIL_SOURCE.mailbox}
            value={`${factsFrom(EMAIL).length} facts`}
          />
          {uploaded && (
            <Row
              onClick={() => openDoc(NEW_DOC.name)}
              icon={
                <Icon tone="blue">
                  <FileText />
                </Icon>
              }
              title={NEW_DOC.name}
              sub="Just now"
              value={`${NEW_DOC.facts.length} facts`}
            />
          )}
          {DOCS.map((d) => (
            <Row
              key={d.name}
              onClick={d.state === "Read" ? () => openDoc(d.name) : undefined}
              icon={<Icon>{d.state === "Read" ? <FileText /> : <Loader className="animate-spin" />}</Icon>}
              title={d.name}
              sub={d.state === "Read" ? `${d.on} by ${d.by}` : "Reading"}
              value={d.state === "Read" ? `${factsFrom(d.name).length} facts` : undefined}
            />
          ))}
        </Group>
      </Section>

      {open && (
        <FactsSheet key={open.title} open onOpenChange={(o) => !o && setOpen(null)} title={open.title} sub={open.sub} facts={open.facts} checkable={open.checkable} />
      )}

      <Sheet open={panel !== null} onOpenChange={(o) => !o && setPanel(null)}>
        <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg">
          {panel === "rules" && <RulesPanel />}
          {panel === "types" && <TypesPanel />}
          {panel === "email" && <EmailPanel onImport={() => setPanel(null)} />}
          {panel === "right" && <RightPanel />}
        </SheetContent>
      </Sheet>
    </>
  )
}

function PanelHead({ title, sub }: { title: string; sub: string }) {
  return (
    <SheetHeader className="border-b border-border p-6">
      <SheetTitle className="text-[22px] font-semibold tracking-tight">{title}</SheetTitle>
      <SheetDescription className="text-[15px]">{sub}</SheetDescription>
    </SheetHeader>
  )
}

function RulesPanel() {
  const [rules, setRules] = useState<Rule[]>(RULES)
  const [type, setType] = useState("All kinds of email")
  const [when, setWhen] = useState("")
  const [then, setThen] = useState("")
  const ready = when.trim() && then.trim()

  return (
    <>
      <PanelHead title="Rules you set" sub="Rules always win over what it learned. Most come from edits in Review, and you can add your own." />
      <div className="space-y-4 border-b border-border p-6">
        <div className="text-[15px] font-semibold">Add a rule</div>
        <Field label="For">
          <Select value={type} options={["All kinds of email", ...REQUEST_TYPES.map((t) => t.name)]} onChange={setType} />
        </Field>
        <Field label="When">
          <input value={when} onChange={(e) => setWhen(e.target.value)} placeholder="the pickup is more than 90 days old" className={inputCls} />
        </Field>
        <Field label="Then">
          <input value={then} onChange={(e) => setThen(e.target.value)} placeholder="don't reply, and send it to Review" className={inputCls} />
        </Field>
        <button
          className={cn(btn.primary, "w-full")}
          disabled={!ready}
          onClick={() => {
            const text = `If ${when.trim()}, ${then.trim()}.`
            setRules((r) => [{ text: text.charAt(0).toUpperCase() + text.slice(1), requestType: type, source: "Added by hand", by: ME.name, on: "Today", active: true }, ...r])
            setWhen("")
            setThen("")
            toast.success("Rule added. It applies from the next email.")
          }}
        >
          Add rule
        </button>
      </div>
      <ul className="divide-y divide-border">
        {rules.map((r) => (
          <li key={r.text} className="flex items-start gap-4 px-6 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-[15px] leading-relaxed">{r.text}</p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                {r.requestType} · {r.source} · {r.by}, {r.on}
              </p>
            </div>
            <Switch defaultChecked={r.active} aria-label="Rule on" className="mt-1" />
          </li>
        ))}
      </ul>
    </>
  )
}

function TypesPanel() {
  const [stages, setStages] = useState<Record<string, Stage>>(() => Object.fromEntries(REQUEST_TYPES.map((t) => [t.name, t.stage])))
  const [open, setOpen] = useState<string | null>(REQUEST_TYPES.find((t) => t.flag === "ready")?.name ?? null)

  function move(name: string, to: Stage) {
    const from = stages[name]
    if (from === to) return
    setStages((s) => ({ ...s, [name]: to }))
    toast.success(`${name} ${STAGES.indexOf(to) > STAGES.indexOf(from) ? "moved up" : "moved back"} to ${STAGE_INFO[to].label}`)
  }

  return (
    <>
      <PanelHead title="Kinds of email" sub="Each kind moves through four steps on its own. It moves up when it keeps matching your team, and only when you say so." />
      {STAGES.map((st) => {
        const types = REQUEST_TYPES.filter((t) => stages[t.name] === st)
        return (
          <div key={st} className="border-b border-border px-6 py-5">
            <div className="mb-1 flex items-baseline justify-between">
              <h3 className="text-[17px] font-semibold">{STAGE_INFO[st].label}</h3>
              <span className="text-[13px] text-muted-foreground">{types.length}</span>
            </div>
            <p className="mb-3 text-[13px] text-muted-foreground">{STAGE_INFO[st].sub}</p>
            <ul className="space-y-1">
              {types.map((t) => (
                <li key={t.name} className={cn("rounded-xl", open === t.name && "bg-muted")}>
                  <button onClick={() => setOpen(open === t.name ? null : t.name)} className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-[14px] hover:bg-muted">
                    <span>
                      {t.name}
                      {t.flag === "ready" && stages[t.name] === t.stage && <span className="ml-2 text-[12px] font-medium text-primary">Ready to move up</span>}
                    </span>
                    <span className="shrink-0 text-muted-foreground">{t.of ? `${t.matched} of ${t.of} right` : ""}</span>
                  </button>
                  {open === t.name && (
                    <div className="px-3 pb-3">
                      <div className="grid grid-cols-4 gap-1 rounded-full bg-card p-1">
                        {STAGES.map((to) => (
                          <button
                            key={to}
                            onClick={() => move(t.name, to)}
                            className={cn("h-8 rounded-full text-[12px] font-medium text-muted-foreground", stages[t.name] === to && "bg-primary text-primary-foreground")}
                          >
                            {STAGE_INFO[to].label}
                          </button>
                        ))}
                      </div>
                      <p className="mt-2 text-[12px] text-muted-foreground">{t.line}</p>
                    </div>
                  )}
                </li>
              ))}
              {!types.length && <li className="px-3 text-[14px] text-muted-foreground">None yet</li>}
            </ul>
          </div>
        )
      })}
    </>
  )
}

const RIGHT = THREADS.filter((t) => t.group === "right")

function RightPanel() {
  const [marks, setMarks] = useState<Record<string, "right" | "wrong">>({})
  const all = RIGHT.every((t) => marks[t.id])
  return (
    <>
      <PanelHead title="What it got right" sub="It did what your team did on these. Confirm them, or flag one that only looks right." />
      <ul className="divide-y divide-border">
        {RIGHT.map((t) => (
          <li key={t.id} className="px-6 py-4">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-medium">{t.subject}</div>
                <div className="mt-0.5 text-[12px] text-muted-foreground">
                  {t.from} · {t.type} · {t.tab === "shadow" ? "Watched live" : "Past email"}, {t.date}
                </div>
                <p className="mt-2 text-[14px] leading-relaxed">{t.did}</p>
              </div>
              {marks[t.id] ? (
                <button onClick={() =>
                    setMarks((m) => {
                      const next = { ...m }
                      delete next[t.id]
                      return next
                    })
                  } className="shrink-0 text-[13px] text-muted-foreground hover:text-foreground">
                  {marks[t.id] === "right" ? "Confirmed" : "Flagged"} · Undo
                </button>
              ) : (
                <div className="flex shrink-0 gap-1">
                  <button aria-label="Right" onClick={() => setMarks((m) => ({ ...m, [t.id]: "right" }))} className="grid size-8 place-items-center rounded-full bg-secondary hover:text-ok">
                    <Check className="size-4" />
                  </button>
                  <button aria-label="Not right" onClick={() => setMarks((m) => ({ ...m, [t.id]: "wrong" }))} className="grid size-8 place-items-center rounded-full bg-secondary hover:text-destructive">
                    <X className="size-4" />
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-auto border-t border-border p-4">
        <button
          className={cn(btn.primary, "w-full")}
          disabled={all}
          onClick={() => {
            setMarks((m) => Object.fromEntries(RIGHT.map((t) => [t.id, m[t.id] ?? "right"])))
            toast.success("Confirmed. It will trust these answers sooner.")
          }}
        >
          {all ? "All done" : "Mark the rest as right"}
        </button>
      </div>
    </>
  )
}

function EmailPanel({ onImport }: { onImport: () => void }) {
  const [months, setMonths] = useState("3")
  return (
    <>
      <PanelHead title="Email history" sub={`Connected to ${EMAIL_SOURCE.mailbox}. It reads past threads to learn what your team does. Nothing is sent.`} />
      <div className="p-6">
        <div className="mb-3 text-[15px] font-medium">Import more</div>
        <div className="mb-5 inline-flex rounded-full bg-secondary p-1">
          {["1", "3", "6", "12"].map((m) => (
            <button key={m} onClick={() => setMonths(m)} className={cn("h-8 rounded-full px-4 text-[13px] font-medium text-muted-foreground", months === m && "bg-card text-foreground shadow-sm")}>
              {m} {m === "1" ? "month" : "months"}
            </button>
          ))}
        </div>
        <button
          className={cn(btn.primary, "w-full")}
          onClick={() => {
            onImport()
            toast(`Importing the last ${months} ${months === "1" ? "month" : "months"}. New things to check will show up in Teach.`)
          }}
        >
          Import
        </button>
      </div>
      <div className="border-t border-border px-6 py-5">
        <div className="mb-2 text-[13px] font-semibold text-muted-foreground">Past imports</div>
        <ul className="space-y-3">
          {RUNS.map((r) => (
            <li key={r.id} className="text-[14px]">
              <div className="font-medium">{r.label}</div>
              <div className="text-muted-foreground">{r.sub}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
