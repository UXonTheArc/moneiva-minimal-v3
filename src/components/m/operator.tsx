"use client"

import Link from "next/link"
import { ArrowUpRight, Brain } from "lucide-react"

import { KindIcon } from "@/components/m/kind-icon"
import { Card, Dot, Group, Icon, Journey, Row, btn } from "@/components/m/ui"
import { cn } from "@/lib/utils"
import { AGENTS } from "@/lib/moneiva/agents-data"
import { REQUEST_TYPES, RULES } from "@/lib/moneiva/data"
import { FACT_COUNT } from "@/lib/moneiva/playbook-data"
import { AGENT_STAGE, LEARNING_IDS, STAGE_INFO, agentState, stageCounts } from "@/lib/minimal"

/**
 * The Operator is the brain. It holds what your team taught it and decides how much it can do alone.
 * Its learning agents work a channel each and feed what they see back to it.
 */
export function OperatorCard({ compact, className }: { compact?: boolean; className?: string }) {
  const learning = AGENTS.filter((a) => LEARNING_IDS.includes(a.id))
  const ready = REQUEST_TYPES.filter((t) => t.flag === "ready")
  const counts = stageCounts().filter((c) => c.count > 0)

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
        <span className="grid size-14 shrink-0 place-items-center rounded-[16px] bg-primary/12 text-primary [&_svg]:size-7">
          <Brain />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[24px] font-semibold tracking-tight">The Operator</div>
          <p className="mt-1 max-w-xl text-[15px] text-muted-foreground">
            Learns how your team works through its learning agents. The more you teach it, the more it does on its own.
          </p>
        </div>
        {compact && (
          <Link href="/teach" className={btn.secondary}>
            Open
          </Link>
        )}
      </div>

      {!compact && (
        <div className="grid grid-cols-3 border-t border-border text-center">
          {[
            { n: FACT_COUNT, label: "facts it knows", href: "/teach#knows" },
            { n: REQUEST_TYPES.length, label: "kinds of email", href: "/teach?panel=types" },
            { n: RULES.length, label: "rules you set", href: "/teach?panel=rules" },
          ].map((s) => (
            <Link key={s.label} href={s.href} className="border-r border-border px-2 py-4 last:border-r-0 hover:bg-muted/50">
              <div className="text-[24px] font-semibold tracking-tight tabular-nums">{s.n}</div>
              <div className="text-[13px] text-muted-foreground">{s.label}</div>
            </Link>
          ))}
        </div>
      )}

      <div className="border-t border-border px-4 pt-4 pb-1 text-[12px] font-semibold tracking-wide text-muted-foreground uppercase sm:px-6">
        Learning agents
      </div>
      <Group className="rounded-none shadow-none">
        {learning.map((a) => {
          const st = agentState(a)
          const stage = AGENT_STAGE[a.id]
          const isOp = a.id === "op"
          return (
            <Row
              key={a.id}
              href={`/agents/${a.id}`}
              className="sm:px-6"
              icon={
                <Icon>
                  <KindIcon kind={a.kind} />
                </Icon>
              }
              title={a.name}
              sub={
                <span className="inline-flex flex-wrap items-center gap-x-1.5">
                  <Dot tone={st.tone} />
                  {a.today} {a.todayLabel}
                  {isOp && (
                    <>
                      <span className="text-muted-foreground/60">·</span>
                      {counts.map((c) => `${c.count} ${STAGE_INFO[c.stage].label.toLowerCase()}`).join(", ")}
                    </>
                  )}
                </span>
              }
              value={
                <div className="hidden w-40 sm:block">
                  <Journey stage={stage} compact />
                  <div className="mt-1.5 text-left text-[12px]">{isOp ? `Mostly ${STAGE_INFO[stage].label.toLowerCase()}` : STAGE_INFO[stage].label}</div>
                </div>
              }
            />
          )
        })}
        {ready.map((t) => (
          <Row
            key={t.name}
            href="/agents/op"
            className="sm:px-6"
            icon={
              <Icon tone="green">
                <ArrowUpRight />
              </Icon>
            }
            title={`${t.name} is ready to move up`}
            sub={`Matched your team ${t.matched} of ${t.of} times while shadowing. Move it to Reviewing.`}
          />
        ))}
      </Group>
    </Card>
  )
}
