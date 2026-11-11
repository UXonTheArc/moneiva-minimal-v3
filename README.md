# Moneiva Minimal V3

Minimal V2, reworked so the Operator is clearly a different kind of thing from the other agents. All data is synthetic.

## The model

- **The Operator is the brain.** It holds what your team taught it (facts, kinds of email, rules) and decides how much it can do alone.
- **Learning agents work for it.** Email and texts, and the Inbound phone line, each work one channel and feed what they see back to the Operator. Each moves through Learning, Shadowing, Reviewing and Autopilot.
- **Task agents follow a script.** OS&D check calls, Carrier check calls and Catalog updates do what a workflow tells them. They don't learn and have no stages.

## Where things live

- **The four places tell the product story.** Teach it, Review its work, then Automate, with Today as the daily summary.
- **Teach opens on the Operator:** what it knows, its two learning agents with their progress, and what's ready to move up.
- **Automate** holds workflows and task agents, as two views. The 35 step OS&D phone check keeps its Overview, Steps canvas, Runs and Values.
- **Today** shows what needs you, the Operator's learning, and how the workflows are doing.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Today: replies and calls to approve, things to fix, your agents and workflows |
| `/review` | Replies and calls to approve, one at a time |
| `/teach` | What the agents know and where it came from |
| `/teach/check` | New kinds of email and threads to check, one at a time |
| `/agents` | Automate, Agents view: task agents, its learning stage and the workflows that use it |
| `/agents/[id]` | One agent: op, phone, check, osd, cat |
| `/workflows` | Automate, Workflows view: every workflow, grouped by Needs you, Running and Off |
| `/workflows/phonecheck` | OS&D phone check: Overview, Steps, Runs, Values |
| `/workflows/phonecheck/edit` | The full canvas: edit, add or delete steps, then Publish |
| `/workflows/[id]` | Smaller workflows: osd, late, missed, latepickup, kpi |
| `/activity` | Everything that happened |
| `/settings` | Account, with links to the management pages |

`/automate` opens the Agents view. Old addresses (/inbox, /playbook, /training) redirect to the new ones.

## Run it

```bash
npm install
npm run dev
```
