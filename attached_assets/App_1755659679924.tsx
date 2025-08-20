import React, { useEffect, useMemo, useState } from "react";

/**
 * CloudStrategik – Service Offerings Builder
 * A CPQ-lite tool focused on configuring service offerings, generating SOW text,
 * and saving reusable packages. Single-file React component; TailwindCSS styles.
 *
 * Notes:
 * - No pricing by default (you can toggle hours/effort).
 * - LocalStorage persistence (packages, settings, templates).
 * - Export SOW to Markdown, copy to clipboard, or download JSON config.
 */

// TypeScript interfaces
interface LineItem {
  id: string;
  label: string;
  defaultIncluded?: boolean;
  note?: string;
}

interface Tool {
  id: string;
  name: string;
}

interface Framework {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  tiers?: string[];
  tools: Tool[];
  frameworks: Framework[];
  lineItems: LineItem[];
  effortEstimate?: number;
  dependencies?: string[];
}

interface ConfiguredService {
  id: string;
  serviceId: string;
  tier?: string;
  selectedTools: string[];
  selectedFrameworks: string[];
  selectedLineItems: string[];
  customNotes?: string;
  effortOverride?: number;
}

interface ClientInfo {
  clientName: string;
  stakeholder: string;
  startDate: string;
  endDate?: string;
  timezone?: string;
}

interface OrgProfile {
  companyName: string;
  consultantName: string;
  email: string;
  phone: string;
  address: string;
}

interface Package {
  id: string;
  name: string;
  items: ConfiguredService[];
  client?: ClientInfo;
  notes?: string;
  createdAt: number;
}

// ------------------------------ Seed Data ------------------------------
const FRAMEWORKS: Framework[] = [
  { id: "nist80053", name: "NIST 800-53" },
  { id: "nistcsf", name: "NIST CSF" },
  { id: "iso27001", name: "ISO 27001" },
  { id: "cis", name: "CIS Controls" },
  { id: "hipaa", name: "HIPAA" },
  { id: "gdpr", name: "GDPR" },
  { id: "soc2", name: "SOC 2" },
  { id: "pci", name: "PCI DSS" },
  { id: "gxp", name: "GxP/GDP" },
];

const TOOLS: Tool[] = [
  { id: "shield", name: "Salesforce Shield / Event Monitoring" },
  { id: "securitycenter", name: "Salesforce Security Center" },
  { id: "appomni", name: "AppOmni" },
  { id: "ownsecure", name: "Own Secure" },
  { id: "spinspm", name: "SpinSPM (Spin.AI)" },
  { id: "vanta", name: "Vanta" },
  { id: "ownbackup", name: "OwnBackup (Backup & Recover)" },
  { id: "gearset", name: "Gearset Backup" },
  { id: "autorabit", name: "AutoRABIT Vault" },
  { id: "odaseva", name: "Odaseva" },
  { id: "custompar", name: "Custom PAR Tool (CloudStrategik)" },
];

const SERVICES: Service[] = [
  {
    id: "backup-core",
    name: "Backup & Recovery – Core Setup",
    description:
      "Install and configure a Salesforce backup solution (data + metadata), define retention, encryption, and restore runbooks.",
    category: "Backup & Recovery",
    tiers: ["Basic", "Standard", "Enterprise"],
    tools: TOOLS.filter(t => ["ownbackup","gearset","autorabit","odaseva"].includes(t.id)),
    frameworks: FRAMEWORKS.filter(f => ["iso27001","soc2","hipaa","gdpr","pci"].includes(f.id)),
    lineItems: [
      { id: "install", label: "Tool installation & auth", defaultIncluded: true },
      { id: "baseline-policy", label: "Baseline backup policy (objects, frequency, retention)", defaultIncluded: true },
      { id: "encrypt", label: "At-rest encryption & key mgmt guidance" },
      { id: "restore-playbook", label: "Restore runbook & tabletop walkthrough", defaultIncluded: true },
      { id: "seed", label: "Sandbox seeding & data masking (if available)" },
    ],
    effortEstimate: 32,
  },
  {
    id: "dr-testing",
    name: "Recovery Test Plan & DR Exercises",
    description:
      "Design recovery test plan, execute sample restores, validate data/metadata integrity, and document results.",
    category: "Backup & Recovery",
    tools: TOOLS.filter(t => ["ownbackup","gearset","autorabit","odaseva"].includes(t.id)),
    frameworks: FRAMEWORKS.filter(f => ["iso27001","soc2","hipaa"].includes(f.id)),
    lineItems: [
      { id: "plan", label: "Author DR test plan & success criteria", defaultIncluded: true },
      { id: "exec", label: "Execute restore(s) to sandbox for validation", defaultIncluded: true },
      { id: "validation", label: "Validation scripts & reports", defaultIncluded: true },
      { id: "rto-rpo", label: "RTO/RPO assessment & tuning" },
    ],
    effortEstimate: 40,
  },
  {
    id: "posture-hardening",
    name: "Security Tool Implementation & Posture Hardening",
    description:
      "Implement SSPM tools, baseline misconfig scan, prioritized remediation plan, and coaching to harden posture.",
    category: "Posture Hardening",
    tiers: ["QuickStart", "Enhanced", "Managed"],
    tools: TOOLS.filter(t => ["securitycenter","appomni","ownsecure","spinspm","shield","vanta"].includes(t.id)),
    frameworks: FRAMEWORKS.filter(f => ["nistcsf","cis","iso27001","soc2","gdpr","hipaa"].includes(f.id)),
    lineItems: [
      { id: "install-sspmt", label: "Install & connect SSPM tool(s)", defaultIncluded: true },
      { id: "baseline-scan", label: "Baseline scan & posture score", defaultIncluded: true },
      { id: "remediation-plan", label: "Prioritized remediation backlog", defaultIncluded: true },
      { id: "coach", label: "Coaching & knowledge transfer" },
      { id: "workflow", label: "Alerting workflow to Slack/Teams/Jira" },
    ],
    effortEstimate: 36,
  },
  {
    id: "security-assessment",
    name: "Security Assessment (Config & Access)",
    description:
      "Point-in-time assessment covering identities, permissions, session/login settings, sharing, guest access, and API posture.",
    category: "Assessments",
    tools: TOOLS.filter(t => ["securitycenter","appomni","ownsecure","spinspm","shield"].includes(t.id)),
    frameworks: FRAMEWORKS.filter(f => ["cis","nist80053","nistcsf","iso27001","soc2","gdpr","hipaa"].includes(f.id)),
    lineItems: [
      { id: "discovery", label: "Workshops & discovery", defaultIncluded: true },
      { id: "scan", label: "Tool-assisted scan & manual checks", defaultIncluded: true },
      { id: "scorecard", label: "Risk scorecard & executive summary", defaultIncluded: true },
      { id: "roadmap", label: "Roadmap with quick wins & milestones" },
    ],
    effortEstimate: 48,
  },
  {
    id: "grc-mapping",
    name: "GRC & Compliance Mapping",
    description:
      "Map findings to controls (NIST/ISO/CIS/HIPAA/GDPR/etc.), set up a lightweight GRC tracker and remediation workflow.",
    category: "GRC & Compliance",
    tools: TOOLS.filter(t => ["securitycenter","appomni","vanta"].includes(t.id)),
    frameworks: FRAMEWORKS,
    lineItems: [
      { id: "control-map", label: "Control mappings & traceability", defaultIncluded: true },
      { id: "risk-register", label: "Risk register + owners & due dates", defaultIncluded: true },
      { id: "dashboards", label: "Compliance dashboards & reports" },
      { id: "auditevidence", label: "Evidence collection playbook" },
    ],
    effortEstimate: 30,
  },
  {
    id: "par-solution",
    name: "Privileged Activity Review (PAR) Solution",
    description:
      "Deploy the CloudStrategik PAR tool using Event Monitoring to track privileged actions, review logs, and report exceptions.",
    category: "Security Solutioning",
    tools: TOOLS.filter(t => ["shield","custompar"].includes(t.id)),
    frameworks: FRAMEWORKS.filter(f => ["gxp","iso27001","soc2"].includes(f.id)),
    lineItems: [
      { id: "deploy-par", label: "Deploy PAR managed package", defaultIncluded: true },
      { id: "policy", label: "Define privileged actions & thresholds", defaultIncluded: true },
      { id: "reports", label: "Dashboards & monthly review template" },
      { id: "integrations", label: "Integrate notifications to Slack/Email/Jira" },
    ],
    effortEstimate: 28,
  },
  {
    id: "monitor-retainer",
    name: "Monitoring & On-Call Retainer",
    description:
      "Ongoing monitoring of dashboards, periodic posture checks, release readiness, and on-call incident response SLAs.",
    category: "Monitoring & Retainer",
    tiers: ["Bronze (Quarterly)", "Silver (Monthly)", "Gold (Bi-Weekly)"],
    tools: TOOLS.filter(t => ["securitycenter","appomni","ownsecure","spinspm","shield"].includes(t.id)),
    frameworks: FRAMEWORKS,
    lineItems: [
      { id: "cadence", label: "Cadence reviews & executive brief", defaultIncluded: true },
      { id: "release", label: "Release readiness checks" },
      { id: "incident", label: "On-call incident support (SLA)" },
      { id: "tuning", label: "Alert tuning & hygiene" },
    ],
    effortEstimate: 16,
  },
];

// ------------------------------ Utilities ------------------------------
const uid = () => Math.random().toString(36).slice(2, 9);
const ls = {
  get: (key: string, fallback: any) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set: (key: string, value: any) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} },
};

function classNames(...arr: (string | boolean | undefined)[]){ return arr.filter(Boolean).join(" "); }

// ------------------------------ Main App ------------------------------
export default function App(){
  const [activeTab, setActiveTab] = useState("catalog");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [frameworkFilter, setFrameworkFilter] = useState<string[]>([]);
  const [toolFilter, setToolFilter] = useState<string[]>([]);
  const [org, setOrg] = useState<OrgProfile>(() => ls.get("cs_org", {
    companyName: "CloudStrategik Consulting",
    consultantName: "Anderson Anthony",
    email: "Anderson@cloudstrategik.com",
    phone: "",
    address: "504 Lavaca, Suite 1005, Austin, Texas 78701, US",
  }));

  const [currentClient, setCurrentClient] = useState<ClientInfo>(() => ls.get("cs_client", {
    clientName: "<Client Name>", stakeholder: "<Primary Stakeholder>", startDate: new Date().toISOString().slice(0,10), timezone: "America/Chicago",
  }));

  const [cart, setCart] = useState<ConfiguredService[]>(() => ls.get("cs_cart", []));
  const [packages, setPackages] = useState<Package[]>(() => ls.get("cs_packages", []));
  const [notes, setNotes] = useState("");
  const [showSOW, setShowSOW] = useState(false);

  useEffect(() => { ls.set("cs_org", org); }, [org]);
  useEffect(() => { ls.set("cs_client", currentClient); }, [currentClient]);
  useEffect(() => { ls.set("cs_cart", cart); }, [cart]);
  useEffect(() => { ls.set("cs_packages", packages); }, [packages]);

  const categories = useMemo(() => Array.from(new Set(SERVICES.map(s => s.category))), []);

  const filtered = useMemo(() => {
    return SERVICES.filter(s => {
      const matchQuery = !query || (s.name.toLowerCase().includes(query.toLowerCase()) || s.description.toLowerCase().includes(query.toLowerCase()));
      const matchCat = categoryFilter.length === 0 || categoryFilter.includes(s.category);
      const matchFw = frameworkFilter.length === 0 || frameworkFilter.every(f => s.frameworks.some(sf => sf.id === f));
      const matchTool = toolFilter.length === 0 || toolFilter.some(t => s.tools.some(st => st.id === t));
      return matchQuery && matchCat && matchFw && matchTool;
    });
  }, [query, categoryFilter, frameworkFilter, toolFilter]);

  const addServiceToCart = (service: Service) => {
    const config: ConfiguredService = {
      id: uid(),
      serviceId: service.id,
      tier: service.tiers?.[0],
      selectedTools: service.tools.map(t => t.id).slice(0, 1), // default first tool
      selectedFrameworks: service.frameworks.map(f => f.id).slice(0, 3),
      selectedLineItems: service.lineItems.filter(li => li.defaultIncluded).map(li => li.id),
    };
    setCart(c => [...c, config]);
  };

  const removeFromCart = (id: string) => setCart(c => c.filter(i => i.id !== id));

  const updateCart = (id: string, updater: (c: ConfiguredService)=>ConfiguredService) => {
    setCart(c => c.map(x => x.id === id ? updater(x) : x));
  };

  const currentPackage: Package = useMemo(() => ({ id: "temp", name: "Current Package", items: cart, client: currentClient, notes, createdAt: Date.now() }), [cart, currentClient, notes]);

  const totalEffort = useMemo(() => cart.reduce((sum, cfg) => {
    const svc = SERVICES.find(s => s.id === cfg.serviceId);
    if(!svc) return sum;
    return sum + (cfg.effortOverride ?? svc.effortEstimate ?? 0);
  }, 0), [cart]);

  const sowText = useMemo(() => buildSOW({ org, pkg: currentPackage }), [org, currentPackage]);

  const saveAsPackage = () => {
    const name = prompt("Name this package/template:", `Pkg ${new Date().toLocaleDateString()}`);
    if(!name) return;
    const p: Package = { ...currentPackage, id: uid(), name, createdAt: Date.now() };
    setPackages(prev => [p, ...prev]);
    alert("Saved!");
  };

  const loadPackage = (p: Package) => {
    setCart(p.items);
    setCurrentClient(p.client ?? currentClient);
    setNotes(p.notes ?? notes);
    setActiveTab("sow");
  };

  const downloadMarkdown = () => {
    const blob = new Blob([sowText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${currentClient.clientName || "SOW"} - CloudStrategik SOW.md`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(currentPackage, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${currentPackage.name.replace(/\s+/g,'_')}.json`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    try { await navigator.clipboard.writeText(sowText); alert("SOW copied to clipboard!"); } catch { alert("Copy failed"); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar activeTab={activeTab} setActiveTab={setActiveTab} totalEffort={totalEffort} onSave={saveAsPackage} onExportJSON={exportJSON} />

      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Filters */}
        <aside className="lg:col-span-1 space-y-4">
          <Panel title="Search & Filters">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search services..." className="w-full rounded-xl border p-2 focus:outline-none focus:ring-2 focus:ring-slate-400"/>

            <FilterGroup label="Categories" options={categories.map(c=>({id:c, name:c}))} values={categoryFilter} onChange={setCategoryFilter} />
            <FilterGroup label="Frameworks" options={FRAMEWORKS} values={frameworkFilter} onChange={setFrameworkFilter} />
            <FilterGroup label="Tools" options={TOOLS} values={toolFilter} onChange={setToolFilter} />
          </Panel>

          <Panel title="Client & Org">
            <LabeledInput label="Client Name" value={currentClient.clientName} onChange={v=>setCurrentClient({...currentClient, clientName:v})} />
            <LabeledInput label="Stakeholder" value={currentClient.stakeholder} onChange={v=>setCurrentClient({...currentClient, stakeholder:v})} />
            <div className="grid grid-cols-2 gap-3">
              <LabeledInput label="Start Date" type="date" value={currentClient.startDate} onChange={v=>setCurrentClient({...currentClient, startDate:v})} />
              <LabeledInput label="Timezone" value={currentClient.timezone || ''} onChange={v=>setCurrentClient({...currentClient, timezone:v})} />
            </div>
            <hr className="my-3"/>
            <LabeledInput label="Your Company" value={org.companyName} onChange={v=>setOrg({...org, companyName:v})} />
            <LabeledInput label="Consultant Name" value={org.consultantName} onChange={v=>setOrg({...org, consultantName:v})} />
            <LabeledInput label="Email" value={org.email} onChange={v=>setOrg({...org, email:v})} />
            <LabeledInput label="Phone" value={org.phone} onChange={v=>setOrg({...org, phone:v})} />
            <LabeledInput label="Address" value={org.address} onChange={v=>setOrg({...org, address:v})} />
          </Panel>

          <Panel title="Package Notes">
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Assumptions, constraints, custom details..." className="w-full min-h-[120px] rounded-xl border p-2"/>
            <button onClick={saveAsPackage} className="mt-3 w-full rounded-xl bg-slate-900 text-white py-2 hover:bg-slate-800">Save as Template</button>
          </Panel>
        </aside>

        {/* Right: Content */}
        <main className="lg:col-span-2">
          {activeTab === "catalog" && (
            <CatalogView services={filtered} addService={addServiceToCart} />
          )}
          {activeTab === "configure" && (
            <ConfigureView cart={cart} updateCart={updateCart} removeFromCart={removeFromCart} />
          )}
          {activeTab === "sow" && (
            <SOWView sowText={sowText} onCopy={copyToClipboard} onDownload={downloadMarkdown} effort={totalEffort} />
          )}
          {activeTab === "packages" && (
            <PackagesView packages={packages} onLoad={loadPackage} onDelete={(id)=>setPackages(p=>p.filter(x=>x.id!==id))} />
          )}
          {activeTab === "settings" && (
            <SettingsView org={org} setOrg={setOrg} />
          )}
        </main>
      </div>

      {/* Quick SOW floating action */}
      <div className="fixed bottom-4 right-4">
        <div className="rounded-2xl shadow-lg bg-white border p-3 flex items-center gap-3">
          <button onClick={()=>setActiveTab("sow")} className="rounded-xl bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700">Build SOW</button>
          <button onClick={()=>setActiveTab("configure")} className="rounded-xl bg-slate-200 px-4 py-2 hover:bg-slate-300">Configure ({cart.length})</button>
        </div>
      </div>
    </div>
  );
}

// ------------------------------ Sub-Components ------------------------------
function TopBar({ activeTab, setActiveTab, totalEffort, onSave, onExportJSON }:{ activeTab:string, setActiveTab:(t:string)=>void, totalEffort:number, onSave:()=>void, onExportJSON:()=>void }){
  const tabs = [
    { id: "catalog", label: "Catalog" },
    { id: "configure", label: "Configure" },
    { id: "sow", label: "SOW Builder" },
    { id: "packages", label: "Templates" },
    { id: "settings", label: "Settings" },
  ];
  return (
    <header className="bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <h1 className="text-xl font-semibold">CloudStrategik – Service Offerings Builder</h1>
            <p className="text-sm text-slate-500">CPQ-lite for services • Focus on scope, deliverables & SOW</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {tabs.map(t => (
            <button key={t.id} onClick={()=>setActiveTab(t.id)} className={classNames("px-3 py-2 rounded-xl text-sm", activeTab===t.id?"bg-slate-900 text-white":"hover:bg-slate-200")}>{t.label}</button>
          ))}
          <div className="ml-3 text-sm text-slate-600">Effort: <span className="font-semibold">{totalEffort} hrs</span></div>
          <button onClick={onSave} className="ml-3 px-3 py-2 rounded-xl bg-slate-900 text-white text-sm">Save Template</button>
          <button onClick={onExportJSON} className="px-3 py-2 rounded-xl bg-slate-200 text-sm">Export JSON</button>
        </div>
      </div>
    </header>
  );
}

function Logo(){
  return (
    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white grid place-items-center font-bold">CS</div>
  );
}

function Panel({ title, children }:{ title:string, children:React.ReactNode }){
  return (
    <section className="rounded-2xl bg-white border p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function FilterGroup({ label, options, values, onChange }:{ label:string, options:{id:string, name:string}[], values:string[], onChange:(v:string[])=>void }){
  return (
    <div className="mt-3">
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map(o=>{
          const active = values.includes(o.id);
          return (
            <button key={o.id} onClick={()=> onChange(active ? values.filter(v=>v!==o.id) : [...values, o.id])} className={classNames("px-3 py-1 rounded-full text-xs border", active?"bg-slate-900 text-white":"bg-white hover:bg-slate-100")}>{o.name}</button>
          );
        })}
      </div>
    </div>
  );
}

function LabeledInput({ label, value, onChange, type="text" }:{ label:string, value:string, onChange:(v:string)=>void, type?:string }){
  return (
    <label className="block text-sm mb-2">
      <span className="block text-slate-600 mb-1">{label}</span>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} className="w-full rounded-xl border p-2 focus:outline-none focus:ring-2 focus:ring-slate-400"/>
    </label>
  );
}

function CatalogView({ services, addService }:{ services:Service[], addService:(s:Service)=>void }){
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {services.map(s => (
        <div key={s.id} className="rounded-2xl bg-white border p-4 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase text-slate-500">{s.category}</div>
              <h3 className="text-lg font-semibold">{s.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{s.description}</p>
            </div>
            <div className="text-right text-xs text-slate-500">Effort ~ <span className="font-semibold text-slate-700">{s.effortEstimate ?? 0} hrs</span></div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {s.tools.slice(0,4).map(t => (
              <span key={t.id} className="px-2 py-1 rounded-full text-xs bg-slate-100 border">{t.name}</span>
            ))}
          </div>
          <div className="mt-2">
            <div className="text-xs text-slate-500">Line items:</div>
            <ul className="text-sm list-disc pl-5 text-slate-700">
              {s.lineItems.slice(0,3).map(li => <li key={li.id}>{li.label}{li.defaultIncluded ? " • (default)" : ""}</li>)}
              {s.lineItems.length > 3 && <li className="text-slate-400">+ {s.lineItems.length - 3} more…</li>}
            </ul>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={()=>addService(s)} className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800">Add to Configure</button>
            <button onClick={(e)=>{e.preventDefault(); alert(detailText(s));}} className="text-slate-700 text-sm underline-offset-2 hover:underline">Details</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function detailText(s: Service){
  const li = s.lineItems.map(i=>`• ${i.label}${i.defaultIncluded?" (default)":""}`);
  const fw = s.frameworks.map(f=>f.name).join(", ");
  const tools = s.tools.map(t=>t.name).join(", ");
  return `${s.name}\n\n${s.description}\n\nCategory: ${s.category}\nEffort: ${s.effortEstimate ?? 0} hrs\n\nLine Items:\n${li.join("\n")}\n\nTools: ${tools}\nFrameworks: ${fw}`;
}

function ConfigureView({ cart, updateCart, removeFromCart }:{ cart:ConfiguredService[], updateCart:(id:string, up:(c:ConfiguredService)=>ConfiguredService)=>void, removeFromCart:(id:string)=>void }){
  return (
    <div className="space-y-4">
      {cart.length === 0 && (
        <div className="rounded-2xl bg-white border p-6 text-center text-slate-600">No items yet. Add services from the Catalog.</div>
      )}
      {cart.map(cfg => <ConfigCard key={cfg.id} cfg={cfg} updateCart={updateCart} removeFromCart={removeFromCart} />)}
    </div>
  );
}

function ConfigCard({ cfg, updateCart, removeFromCart }:{ cfg:ConfiguredService, updateCart:(id:string, up:(c:ConfiguredService)=>ConfiguredService)=>void, removeFromCart:(id:string)=>void }){
  const svc = SERVICES.find(s => s.id === cfg.serviceId)!;
  return (
    <div className="rounded-2xl bg-white border p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase text-slate-500">{svc.category}</div>
          <h3 className="text-lg font-semibold">{svc.name}</h3>
          <p className="text-sm text-slate-600 mt-1">{svc.description}</p>
        </div>
        <button onClick={()=>removeFromCart(cfg.id)} className="text-slate-600 hover:text-red-600 text-sm">Remove</button>
      </div>

      {/* Tier selector */}
      {svc.tiers?.length ? (
        <div className="mt-3">
          <div className="text-xs text-slate-500 mb-1">Tier</div>
          <div className="flex flex-wrap gap-2">
            {svc.tiers.map(t => (
              <button key={t} onClick={()=>updateCart(cfg.id, c=>({...c, tier:t}))} className={classNames("px-3 py-1 rounded-full text-xs border", cfg.tier===t?"bg-slate-900 text-white":"bg-white hover:bg-slate-100")}>{t}</button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Tools */}
      <div className="mt-4">
        <div className="text-xs text-slate-500 mb-1">Tools</div>
        <div className="flex flex-wrap gap-2">
          {svc.tools.map(t => {
            const on = cfg.selectedTools.includes(t.id);
            return (
              <button key={t.id} onClick={()=>updateCart(cfg.id, c=>({...c, selectedTools: on ? c.selectedTools.filter(x=>x!==t.id) : [...c.selectedTools, t.id]}))} className={classNames("px-3 py-1 rounded-full text-xs border", on?"bg-emerald-600 text-white border-emerald-700":"bg-white hover:bg-slate-100")}>{t.name}</button>
            );
          })}
        </div>
      </div>

      {/* Frameworks */}
      <div className="mt-4">
        <div className="text-xs text-slate-500 mb-1">Compliance Frameworks</div>
        <div className="flex flex-wrap gap-2">
          {svc.frameworks.map(f => {
            const on = cfg.selectedFrameworks.includes(f.id);
            return (
              <button key={f.id} onClick={()=>updateCart(cfg.id, c=>({...c, selectedFrameworks: on ? c.selectedFrameworks.filter(x=>x!==f.id) : [...c.selectedFrameworks, f.id]}))} className={classNames("px-3 py-1 rounded-full text-xs border", on?"bg-indigo-600 text-white border-indigo-700":"bg-white hover:bg-slate-100")}>{f.name}</button>
            );
          })}
        </div>
      </div>

      {/* Line items */}
      <div className="mt-4">
        <div className="text-xs text-slate-500 mb-1">Line Items</div>
        <div className="grid sm:grid-cols-2 gap-2">
          {svc.lineItems.map(li => {
            const on = cfg.selectedLineItems.includes(li.id);
            return (
              <label key={li.id} className={classNames("flex items-center gap-2 rounded-xl border p-2", on?"bg-slate-50 border-slate-300":"")}> 
                <input type="checkbox" checked={on} onChange={()=>updateCart(cfg.id, c=>({...c, selectedLineItems: on ? c.selectedLineItems.filter(x=>x!==li.id) : [...c.selectedLineItems, li.id]}))} />
                <span className="text-sm">{li.label}{li.defaultIncluded ? " • default" : ""}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Effort override & notes */}
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="block text-slate-600 mb-1">Effort (hrs)</span>
          <input type="number" min={0} value={cfg.effortOverride ?? (SERVICES.find(s=>s.id===cfg.serviceId)?.effortEstimate ?? 0)} onChange={e=>updateCart(cfg.id, c=>({...c, effortOverride: Number(e.target.value)}))} className="w-full rounded-xl border p-2"/>
        </label>
        <label className="block text-sm">
          <span className="block text-slate-600 mb-1">Notes</span>
          <input value={cfg.customNotes || ""} onChange={e=>updateCart(cfg.id, c=>({...c, customNotes: e.target.value}))} className="w-full rounded-xl border p-2" placeholder="Scope caveats, SLAs, constraints…"/>
        </label>
      </div>
    </div>
  );
}

function SOWView({ sowText, onCopy, onDownload, effort }:{ sowText:string, onCopy:()=>void, onDownload:()=>void, effort:number }){
  return (
    <div className="rounded-2xl bg-white border p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Statement of Work (Preview)</h2>
        <div className="text-sm text-slate-600">Total Effort ~ <span className="font-semibold">{effort} hrs</span></div>
      </div>
      <div className="mt-3 text-sm text-slate-600">This Markdown will export with your selected services, line items, tools, and frameworks. Edit after export as needed.</div>
      <pre className="mt-4 whitespace-pre-wrap text-sm bg-slate-50 border rounded-xl p-4 max-h-[60vh] overflow-auto">{sowText}</pre>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={onCopy} className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800">Copy Markdown</button>
        <button onClick={onDownload} className="rounded-xl bg-slate-200 px-4 py-2 hover:bg-slate-300">Download .md</button>
      </div>
    </div>
  );
}

function PackagesView({ packages, onLoad, onDelete }:{ packages:Package[], onLoad:(p:Package)=>void, onDelete:(id:string)=>void }){
  return (
    <div className="space-y-3">
      {packages.length === 0 && (
        <div className="rounded-2xl bg-white border p-6 text-center text-slate-600">No templates yet. Save your current configuration as a template.</div>
      )}
      {packages.map(p => (
        <div key={p.id} className="rounded-2xl bg-white border p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Saved {new Date(p.createdAt).toLocaleString()}</div>
            <div className="text-lg font-semibold">{p.name}</div>
            <div className="text-sm text-slate-600">{p.items.length} configured services • Client: {p.client?.clientName || "(not set)"}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>onLoad(p)} className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800">Load</button>
            <button onClick={()=>onDelete(p.id)} className="rounded-xl bg-red-50 text-red-700 px-4 py-2 hover:bg-red-100">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsView({ org, setOrg }:{ org:OrgProfile, setOrg:(o:OrgProfile)=>void }){
  return (
    <div className="rounded-2xl bg-white border p-4 grid md:grid-cols-2 gap-4">
      <LabeledInput label="Company Name" value={org.companyName} onChange={v=>setOrg({...org, companyName:v})} />
      <LabeledInput label="Consultant Name" value={org.consultantName} onChange={v=>setOrg({...org, consultantName:v})} />
      <LabeledInput label="Email" value={org.email} onChange={v=>setOrg({...org, email:v})} />
      <LabeledInput label="Phone" value={org.phone} onChange={v=>setOrg({...org, phone:v})} />
      <label className="md:col-span-2 block text-sm">
        <span className="block text-slate-600 mb-1">Business Address</span>
        <textarea value={org.address} onChange={e=>setOrg({...org, address: e.target.value})} className="w-full rounded-xl border p-2" />
      </label>
      <div className="md:col-span-2 text-sm text-slate-500">Company details are injected into SOW headers & signature blocks.</div>
    </div>
  );
}

// ------------------------------ SOW Builder ------------------------------
function buildSOW({ org, pkg }:{ org:OrgProfile, pkg:Package }): string {
  const selectedBlocks = pkg.items.map(cfg => renderServiceBlock(cfg)).join("\n\n");
  const totalEffort = pkg.items.reduce((sum, i)=>{
    const svc = SERVICES.find(s => s.id === i.serviceId); return sum + (i.effortOverride ?? (svc?.effortEstimate ?? 0));
  }, 0);

  return `# Statement of Work (SOW)\n\n` +
`**Consultancy:** ${org.companyName}\n\n` +
`**Consultant:** ${org.consultantName}  \\\n**Email:** ${org.email}  \\\n**Phone:** ${org.phone}  \\\n**Address:** ${org.address}\n\n` +
`**Client:** ${pkg.client?.clientName || "<Client>"}  \\\n**Stakeholder:** ${pkg.client?.stakeholder || "<Stakeholder>"}  \\\n**Start Date:** ${pkg.client?.startDate || "<Date>"}  \\\n**Timezone:** ${pkg.client?.timezone || "America/Chicago"}\n\n` +
`---\n\n` +
`## 1. Objectives\n` +
`Deliver Salesforce security, backup/recovery, posture hardening, and compliance outcomes through the services defined herein. Prioritize measurable improvements, risk reduction, and operational readiness.` +
`\n\n## 2. Scope of Services\n` +
selectedBlocks +
`\n\n## 3. Deliverables\n` +
`- SOW-aligned deliverables per service blocks (documents, dashboards, runbooks).\n` +
`- Remediation backlog with owners and target dates.\n` +
`- Executive summary and recommendations.\n\n` +
`## 4. Timeline & Effort\n` +
`- Estimated total effort: **~${totalEffort} hours** (subject to refinement during discovery).\n` +
`- Detailed sequencing established jointly during kickoff; dependencies noted in service blocks.\n\n` +
`## 5. Assumptions\n` +
`- Client provides timely access to environments, stakeholders, and required licenses.\n` +
`- Non-prod sandboxes are available for testing and validation.\n` +
`- Scope changes are managed through change control.\n\n` +
`## 6. Out of Scope\n` +
`- Product license procurement.\n` +
`- Custom development beyond explicitly listed items.\n` +
`- 24/7 operations unless covered by a retainer tier.\n\n` +
`## 7. Client Responsibilities\n` +
`- Identify executive sponsor and technical owner(s).\n` +
`- Review/approve changes, provide SMEs, and validate deliverables.\n\n` +
`## 8. Compliance Mapping\n` +
renderComplianceMatrix(pkg.items) +
`\n\n## 9. Acceptance Criteria\n` +
`- Deliverables accepted when requirements in each service block are met and signed off by the stakeholder.\n\n` +
`## 10. Signatures\n` +
`**${org.companyName}**  \\\nName: ${org.consultantName}  \\\nDate: _____________\n\n` +
`**${pkg.client?.clientName || "Client"}**  \\\nName: ${pkg.client?.stakeholder || "Authorized Representative"}  \\\nDate: _____________\n`;
}

function renderServiceBlock(cfg: ConfiguredService){
  const svc = SERVICES.find(s => s.id === cfg.serviceId)!;
  const lineItems = svc.lineItems.filter(li => cfg.selectedLineItems.includes(li.id));
  const tools = svc.tools.filter(t => cfg.selectedTools.includes(t.id));
  const fws = svc.frameworks.filter(f => cfg.selectedFrameworks.includes(f.id));
  return `### ${svc.name}${cfg.tier?` – ${cfg.tier}`:""}
` +
`**Category:** ${svc.category}  \\\n**Effort:** ~${cfg.effortOverride ?? (svc.effortEstimate ?? 0)} hrs\n\n` +
`**Included Line Items:**\n` + (lineItems.length? lineItems.map(li=>`- ${li.label}`).join("\n") : "- (to be refined during discovery)") + "\n\n" +
`**Tools:** ${tools.map(t=>t.name).join(", ") || "TBD"}\n\n` +
`**Frameworks (mapping focus):** ${fws.map(f=>f.name).join(", ") || "TBD"}\n\n` +
(cfg.customNotes ? `**Notes:** ${cfg.customNotes}\n\n` : "");
}

function renderComplianceMatrix(items: ConfiguredService[]) {
  if(items.length === 0) return "- (No services selected)";
  const rows = items.map(i => {
    const svc = SERVICES.find(s => s.id === i.serviceId)!;
    const fws = svc.frameworks.filter(f => i.selectedFrameworks.includes(f.id));
    return `- **${svc.name}** → ${fws.map(f=>f.name).join(", ") || "TBD"}`;
  }).join("\n");
  return rows;
}