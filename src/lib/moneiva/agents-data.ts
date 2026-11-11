// The five synthetic agents. Shared by Home, Inbox, Activity and Agents.
import type { AgentStatus } from "./data"

export type AgentKind = "email" | "inbound" | "outbound" | "files"
/** tools: [name, description, state label, on]. outputs: [field, shown as a column in Activity]. */
export type Agent = {
  id: "op" | "phone" | "check" | "osd" | "cat"
  name: string
  kind: AgentKind
  status: AgentStatus
  channel: string
  address: string
  desc: string
  error?: string
  today: string
  todayLabel: string
  needs: string
  needsHref?: string
  workflow: string
  href: string
  team: string
  language: string
  language2?: string
  tz: string
  voice?: string
  callName?: string
  callingFrom?: string
  fallback?: string
  greeting?: string
  who: string
  goal: string
  may: string
  mayNot: string
  tools: [string, string, string, boolean][]
  outputs: [string, boolean][]
  inputs: string[]
}

export const KIND_LABEL: Record<AgentKind, string> = {
  email: "Email",
  inbound: "Inbound calls",
  outbound: "Outbound calls",
  files: "Files and data",
}

export const AGENTS: Agent[] = [
  { id: 'op', name: 'Email and texts', kind: 'email', status: 'live', channel: 'Email · service@example.test', address: 'service@example.test',
    desc: 'Answers customer emails for the customer service desk, and replies or acts the way your team does.',
    today: '25', todayLabel: 'emails and texts today', needs: '7 need you', needsHref: '/inbox', workflow: 'In 3 workflows', href: '/agents/op',
    team: 'LTL customer service', language: 'English', tz: 'Central time (Chicago)',
    who: 'The customer service desk\'s assistant for Acme Logistics. It writes as "Customer Service Team".',
    goal: 'Answer each sender with what Acme and the Playbook can confirm, and propose the next step your team would take.',
    may: 'Reply to the sender, forward to the right person, and look things up in Acme.',
    mayNot: 'Promise anything Acme does not confirm, make up numbers, dates or names, or speak for other desks.',
    tools: [['Gmail', 'Reads and sends from service@example.test', 'Connected', true], ['Acme lookups', 'Pickups, PROs, delivery dates and dock hours', 'Connected', true],
      ['Forward to billing', 'Sends billing questions to billing@example.test', 'On', true], ['Text messages', 'Replies to texts sent to (555) 010-0345', 'On', true], ['Create a pickup', 'Books new pickups in Acme', 'Off', false]],
    outputs: [['Request type', true], ['Pickup number', true], ['PRO number', true], ['Next step', false], ['Escalation reason', false]], inputs: [] },
  { id: 'phone', name: 'Inbound phone line', kind: 'inbound', status: 'live', channel: 'Inbound calls · (555) 010-0345', address: '(555) 010-0345',
    desc: 'Answers the customer service line, gives pickup and delivery status, and books call backs.',
    today: '9', todayLabel: 'calls today', needs: '1 call to return', needsHref: '/inbox?filter=call&item=c1', workflow: 'In 1 workflow', href: '/agents/phone',
    team: 'LTL customer service', language: 'English', language2: 'Spanish', tz: 'Central time (Chicago)', voice: 'Riley: female, warm, clear (default)', callName: 'Riley', callingFrom: 'Acme Logistics', fallback: 'Transfer to the customer service desk',
    greeting: 'Thanks for calling Acme Logistics. This is Riley. How can I help?',
    who: 'The voice of the customer service line. Friendly, short answers, and it says when it is passing a caller to a person.',
    goal: 'Answer status questions on the call, and promise a call back for anything it can\'t change.',
    may: 'Look up pickups and PROs, take a message, and transfer to the desk.',
    mayNot: 'Change or cancel a pickup, quote a rate, or give out another customer\'s information.',
    tools: [['Transfers', 'To the desk at (555) 010-0100 when a caller asks for a person, or after 2 tries it can\'t answer', 'On', true],
      ['Voicemail', 'After hours, takes a message and puts it in Inbox', 'On', true], ['Acme lookups', 'Pickups, PROs and delivery dates', 'Connected', true],
      ['Text a summary', 'Texts the caller what was agreed', 'On', true], ['Phone menu navigation', 'Only for outbound calls', 'Off', false]],
    outputs: [['Request type', true], ['Caller name', true], ['Pickup number', true], ['Call back needed', true], ['Summary', false]], inputs: [] },
  { id: 'check', name: 'Carrier check calls', kind: 'outbound', status: 'live', channel: 'Outbound calls · (555) 010-0188', address: '(555) 010-0188',
    desc: 'Calls carriers about loads that are running late and updates the ETA.',
    today: '5', todayLabel: 'calls today', needs: '', workflow: 'Weekdays at 9 AM and 2 PM', href: '/agents/check',
    team: 'Carrier relations', language: 'English', language2: 'None, main language only', tz: 'Central time (Chicago)', voice: 'Sarah: female, firm, clear (default)', callName: 'Jordan', callingFrom: 'Acme Logistics', fallback: 'None. It ends the call and puts it in Inbox', greeting: 'Hi, this is Jordan calling from Acme Logistics about load [load number].',
    who: 'A polite caller from the carrier desk.', goal: 'Get an updated ETA and the reason for the delay.', may: 'Ask for the ETA and the driver\'s location.', mayNot: 'Agree to rate changes or detention pay.',
    tools: [['Transfers', 'Hands the call to a person on the carrier desk', 'Off', false], ['Leave a voicemail', 'When no one answers, leaves a short message with a call back number', 'Off', false],
      ['Phone menu navigation', 'Gets through the carrier\'s phone menu. Presses 802 to reach dispatch', 'On', true], ['Acme lookups', 'Loads, ETAs and stops', 'Connected', true]],
    outputs: [['ETA', true], ['Delay reason', true], ['Driver location', false]], inputs: ['Carrier name', 'Carrier phone', 'Load number'] },
  { id: 'osd', name: 'OS&D check calls', kind: 'outbound', status: 'error', channel: 'Outbound calls · (555) 010-0199', address: '(555) 010-0199',
    desc: 'Calls the delivery site after an overage, shortage or damage report to confirm what was received.',
    error: 'Stopped at 7:10 AM. The phone number (555) 010-0199 can no longer place calls. Pick another number in Profile.',
    today: '0', todayLabel: 'calls today', needs: '', workflow: '3 reports waiting', href: '/agents/osd',
    team: 'Claims', language: 'English', language2: 'None, main language only', tz: 'Central time (Chicago)', voice: 'Sarah: female, firm, clear (default)', callName: 'Jordan', callingFrom: 'Acme Logistics', fallback: 'None. It ends the call and puts it in Inbox', greeting: 'Hi, this is Acme Logistics calling about a delivery from [date].',
    who: 'A careful caller from the claims desk.', goal: 'Confirm what was received and whether there was damage.', may: 'Ask about pieces, condition and photos.', mayNot: 'Admit fault or promise a payout.',
    tools: [['Phone menu navigation', 'Presses through the site\'s phone menu to reach receiving', 'On', true], ['Voicemail', 'Leaves a message and tries again in 2 hours', 'On', true]],
    outputs: [['Pieces received', true], ['Damage noted', true], ['Photos requested', false]], inputs: ['Site name', 'PRO number', 'Delivery date'] },
  { id: 'cat', name: 'Catalog updates', kind: 'files', status: 'off', channel: 'Files · Catalog folder', address: 'Catalog folder',
    desc: 'Reads new rate and accessorial files and updates the catalog the other agents use.',
    today: '0', todayLabel: 'files today', needs: '', workflow: 'Off since Sep 30', href: '/agents/cat',
    team: 'Pricing', language: 'English', tz: 'Central time (Chicago)', who: 'A careful reader of pricing files.', goal: 'Keep the catalog current.', may: 'Propose catalog changes.', mayNot: 'Publish prices without approval.',
    tools: [], outputs: [['Changed items', true]], inputs: ['File'] }
];

export const agentById = (id: string) => AGENTS.find((a) => a.id === id)
