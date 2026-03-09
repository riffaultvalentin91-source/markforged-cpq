import { useState, useCallback, useMemo } from "react";

// ─── Q1-2026 EMEA PRICE LIST (PricebookEntry sheet) ──────────────────────────
const PRICE_LIST = {
  // FFF Printers
  "Onyx One (Gen 2)":                { sku:"21443",     subSku:"S-DF-21443", price:6490,   cat:"FFF Printer",    hGroup:"Onyx Pro",               weightKg:15,  dfcPrinters:1 },
  "Onyx Pro (Gen 2)":                { sku:"21444",     subSku:"S-DF-21444", price:8990,   cat:"FFF Printer",    hGroup:"Onyx Pro",               weightKg:16,  dfcPrinters:1 },
  "Onyx Pro (Gen 2 - No WiFi)":      { sku:"21445",     subSku:"S-DF-21444", price:8990,   cat:"FFF Printer",    hGroup:"Onyx Pro",               weightKg:16,  dfcPrinters:1 },
  "Mark Two (Gen 2)":                { sku:"21446",     subSku:"S-DF-21446", price:15990,  cat:"FFF Printer",    hGroup:"Mark Two",               weightKg:25,  dfcPrinters:1 },
  "Mark Two (Gen 2 - No WiFi)":      { sku:"21447",     subSku:"S-DF-21446", price:15990,  cat:"FFF Printer",    hGroup:"Mark Two",               weightKg:25,  dfcPrinters:1 },
  "Mark Two (Gen 2) - REFURB":       { sku:"W21446",    subSku:"S-DF-21446", price:15990,  cat:"FFF Printer",    hGroup:"Mark Two",               weightKg:25,  dfcPrinters:1 },
  // Industrial
  "X3 (Gen 2)":                      { sku:"21448",     subSku:"S-DF-21448", price:44990,  cat:"Industrial",     hGroup:"X7",                     weightKg:55,  dfcPrinters:1 },
  "X5 (Gen 2)":                      { sku:"21449",     subSku:"S-DF-21449", price:54990,  cat:"Industrial",     hGroup:"X7",                     weightKg:65,  dfcPrinters:1 },
  "X7 (Gen 2)":                      { sku:"21450",     subSku:"S-DF-21450", price:64990,  cat:"Industrial",     hGroup:"X7",                     weightKg:78.5,dfcPrinters:1 },
  "X7 (Gen 2 - No WiFi)":            { sku:"21451",     subSku:"S-DF-21450", price:64990,  cat:"Industrial",     hGroup:"X7",                     weightKg:78.5,dfcPrinters:1 },
  "X7 Field Edition":                { sku:"F-PR-3023", subSku:"S-DF-20809", price:89990,  cat:"Industrial",     hGroup:"X7",                     weightKg:80,  dfcPrinters:1 },
  "X7 Field Edition (No WiFi)":      { sku:"F-PR-3013", subSku:"S-DF-20809", price:89990,  cat:"Industrial",     hGroup:"X7",                     weightKg:80,  dfcPrinters:1 },
  // FX Series
  "FX10":                            { sku:"22203",     subSku:"S-DF-22203", price:99990,  cat:"FX Series",      hGroup:"FX10",                   weightKg:221.5,dfcPrinters:1 },
  "FX10 (No WiFi)":                  { sku:"22204",     subSku:"S-DF-22203", price:99990,  cat:"FX Series",      hGroup:"FX10",                   weightKg:221.5,dfcPrinters:1 },
  "FX10 Metal Kit":                  { sku:"44000",     price:19990,  cat:"FX Series",      hGroup:"FX10",                   weightKg:5,   dfcPrinters:0 },
  "FX10 Sinter-1 Bundle":            { sku:"F-PR-5504", subSku:"S-DF-22203", price:169990, cat:"FX Series",      hGroup:"FX10",                   weightKg:560, dfcPrinters:2 },
  "FX10 Sinter-2 Bundle":            { sku:"F-PR-5505", subSku:"S-DF-22203", price:209990, cat:"FX Series",      hGroup:"FX10",                   weightKg:660, dfcPrinters:2 },
  "FX20":                            { sku:"F-PR-3016", subSku:"S-DF-21297", price:239900, cat:"FX Series",      hGroup:"FX20",                   weightKg:757.5,dfcPrinters:1 },
  // Metal Printing
  "Metal X (Gen 2)":                 { sku:"21466",     subSku:"S-DF-21466", price:109990, cat:"Metal Printing", hGroup:"Metal X Printer Only",   weightKg:90,  dfcPrinters:1 },
  "Metal X (Gen 2 - No WiFi)":       { sku:"21467",     subSku:"S-DF-21466", price:109990, cat:"Metal Printing", hGroup:"Metal X Printer Only",   weightKg:90,  dfcPrinters:1 },
  "Metal X, Wash 1, Sinter 1 Bundle":            { sku:"F-PR-5001", subSku:"S-DF-21466", price:137990, cat:"Metal Printing", hGroup:"MX/S1 Bundle", weightKg:655, dfcPrinters:3 },
  "Metal X, Wash 1, Sinter 2 Bundle":            { sku:"F-PR-5002", subSku:"S-DF-21466", price:197990, cat:"Metal Printing", hGroup:"MX/S2 Bundle", weightKg:750, dfcPrinters:3 },
  "Metal X, Wash 1, Sinter 1 Bundle (No WiFi)":  { sku:"F-PR-5011", subSku:"S-DF-21466", price:137990, cat:"Metal Printing", hGroup:"MX/S1 Bundle", weightKg:655, dfcPrinters:3 },
  "Metal X, Wash 1, Sinter 2 Bundle (No WiFi)":  { sku:"F-PR-5012", subSku:"S-DF-21466", price:197990, cat:"Metal Printing", hGroup:"MX/S2 Bundle", weightKg:750, dfcPrinters:3 },
  "3:1:1 (S-2) Print Farm":          { sku:"F-PR-5501", subSku:"S-DF-21466", price:307990, cat:"Metal Printing", hGroup:"MX/S2 Bundle",           weightKg:1150,dfcPrinters:5 },
  "5:1:1 (S-2) Print Farm":          { sku:"F-PR-5502", subSku:"S-DF-21466", price:417990, cat:"Metal Printing", hGroup:"MX/S2 Bundle",           weightKg:1600,dfcPrinters:7 },
  "2:1:1 (S-2) Print Farm":          { sku:"F-PR-5503", subSku:"S-DF-21466", price:252990, cat:"Metal Printing", hGroup:"MX/S2 Bundle",           weightKg:900, dfcPrinters:4 },
  // Post-Processing
  "Sinter-1 (B.V.)":                 { sku:"F-SR-0011", subSku:"S-DF-A3277", price:59990,  cat:"Post-Processing",hGroup:"Metal X Printer Only",   weightKg:347, dfcPrinters:1 },
  "Sinter-1 (B.V., No WiFi)":        { sku:"F-SR-0010", subSku:"S-DF-A3277", price:65990,  cat:"Post-Processing",hGroup:"Metal X Printer Only",   weightKg:347, dfcPrinters:1 },
  "Sinter-2":                        { sku:"F-SR-0002", subSku:"S-DF-A3700", price:131990, cat:"Post-Processing",hGroup:"Metal X Printer Only",   weightKg:435, dfcPrinters:1 },
  "Wash-1 (B.V)":                    { sku:"F-PW-0002", subSku:"S-DF-A3500", price:15200,  cat:"Post-Processing",hGroup:"Metal X Printer Only",   weightKg:218, dfcPrinters:1 },
  // Services
  "System Install and Operator Training": { sku:"INSTALL-TRN",price:4800, cat:"Services", hGroup:null, weightKg:0, dfcPrinters:0 },
  "Office Hours":                         { sku:"MFU-013",    price:660,  cat:"Services", hGroup:null, weightKg:0, dfcPrinters:0 },
  // Digital Forge
  "Digital Forge Complete Advanced 1":  { sku:"S-DF-0002", price:3000,  cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  "Digital Forge Complete On-Prem 1":   { sku:"S-DF-0003", price:5000,  cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  "Digital Forge Complete Advanced 2":  { sku:"S-DF-0004", price:1000,  cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  "Digital Forge Complete On-Prem 2":   { sku:"S-DF-0005", price:1000,  cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  "FX20 - Digital Forge Essential":     { sku:"S-DF-21297",price:28788, cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  "Onyx One - Digital Forge Essential": { sku:"S-DF-21443",price:779,   cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  "Onyx Pro - Digital Forge Essential": { sku:"S-DF-21444",price:1079,  cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  "Mark Two - Digital Forge Essential": { sku:"S-DF-21446",price:1919,  cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  "X3 - Digital Forge Essential":       { sku:"S-DF-21448",price:5399,  cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  "X5 - Digital Forge Essential":       { sku:"S-DF-21449",price:6599,  cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  "X7 - Digital Forge Essential":       { sku:"S-DF-21450",price:7799,  cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  "X7 Field Edition - Digital Forge Essential": { sku:"S-DF-20809",price:10799,cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  "Metal X - Digital Forge Essential":  { sku:"S-DF-21466",price:12099, cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  "FX10 - Digital Forge Essential":     { sku:"S-DF-22203",price:11999, cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  "Sinter-1 - Digital Forge Essential": { sku:"S-DF-A3277",price:3600,  cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  "Wash-1 - Digital Forge Essential":   { sku:"S-DF-A3500",price:760,   cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  "Sinter-2 - Digital Forge Essential": { sku:"S-DF-A3700",price:9240,  cat:"Digital Forge",hGroup:null, weightKg:0, dfcPrinters:0 },
  // Materials
  "17-4PH Stainless Steel V2 400cc": { sku:"20876",  price:260,  cat:"Materials", hGroup:"Individual Material Spools", weightKg:1.5,  dfcPrinters:0 },
  "3200cc ULTEM 9085 Filament":      { sku:"20879",  price:1400, cat:"Materials", hGroup:"Large Pack FRUs",           weightKg:5.94, dfcPrinters:0 },
  "3200cc Support for ULTEM":        { sku:"20880",  price:1480, cat:"Materials", hGroup:"Large Pack FRUs",           weightKg:5.53, dfcPrinters:0 },
  "Carbon Fiber HT 50cc":            { sku:"20881",  price:200,  cat:"Materials", hGroup:"Individual Material Spools", weightKg:0.3,  dfcPrinters:0 },
  "Carbon Fiber HT 150cc":           { sku:"20882",  price:600,  cat:"Materials", hGroup:"Individual Material Spools", weightKg:0.6,  dfcPrinters:0 },
  "3200cc Onyx":                     { sku:"20883",  price:760,  cat:"Materials", hGroup:"Large Pack FRUs",           weightKg:5.57, dfcPrinters:0 },
  "400cc H13 Tool Steel v2":         { sku:"21010",  price:460,  cat:"Materials", hGroup:"Individual Material Spools", weightKg:1.5,  dfcPrinters:0 },
  "400cc D2 Tool Steel v2":          { sku:"21024",  price:460,  cat:"Materials", hGroup:"Individual Material Spools", weightKg:1.5,  dfcPrinters:0 },
  "Smooth TPU 95A Black 800cc":      { sku:"21248",  price:170,  cat:"Materials", hGroup:"Individual Material Spools", weightKg:1.0,  dfcPrinters:0 },
  "Smooth TPU 95A White 800cc":      { sku:"21250",  price:170,  cat:"Materials", hGroup:"Individual Material Spools", weightKg:1.0,  dfcPrinters:0 },
  "3200cc Vega":                     { sku:"22225",  price:3200, cat:"Materials", hGroup:"Large Pack FRUs",           weightKg:5.5,  dfcPrinters:0 },
  "Onyx ESD V2 800cc":               { sku:"22439",  price:230,  cat:"Materials", hGroup:"Individual Material Spools", weightKg:1.64, dfcPrinters:0 },
  "400cc 316L Stainless Steel":      { sku:"22474",  price:320,  cat:"Materials", hGroup:"Individual Material Spools", weightKg:1.5,  dfcPrinters:0 },
  "800cc Nylon White FS":            { sku:"22509",  price:180,  cat:"Materials", hGroup:"Individual Material Spools", weightKg:1.0,  dfcPrinters:0 },
  "800cc Onyx":                      { sku:"F-MF-0001",price:190,cat:"Materials", hGroup:"Individual Material Spools", weightKg:1.64, dfcPrinters:0 },
  "800cc Nylon":                     { sku:"F-MF-0002",price:170,cat:"Materials", hGroup:"Individual Material Spools", weightKg:1.0,  dfcPrinters:0 },
  "800cc Onyx FR":                   { sku:"F-MF-0004",price:230,cat:"Materials", hGroup:"Individual Material Spools", weightKg:1.64, dfcPrinters:0 },
  "50cc Fiberglass CFF":             { sku:"FG-AB-50", price:80, cat:"Materials", hGroup:"Individual Material Spools", weightKg:0.2,  dfcPrinters:0 },
  "150cc Fiberglass CFF":            { sku:"F-FG-0003",price:230,cat:"Materials", hGroup:"Individual Material Spools", weightKg:0.5,  dfcPrinters:0 },
  "150cc Carbon Fiber CFF":          { sku:"F-FG-0005",price:450,cat:"Materials", hGroup:"Individual Material Spools", weightKg:0.5,  dfcPrinters:0 },
  "150cc Kevlar CFF":                { sku:"F-FG-0006",price:300,cat:"Materials", hGroup:"Individual Material Spools", weightKg:0.5,  dfcPrinters:0 },
  "50cc Carbon Fiber CFF":           { sku:"CF-BA-50", price:150,cat:"Materials", hGroup:"Individual Material Spools", weightKg:0.2,  dfcPrinters:0 },
  "50cc Carbon Fiber FR-A":          { sku:"CF-FR-50", price:175,cat:"Materials", hGroup:"Individual Material Spools", weightKg:0.2,  dfcPrinters:0 },
};

const CATEGORIES = ["FFF Printer","Industrial","FX Series","Metal Printing","Post-Processing","Digital Forge","Materials","Services"];

// ─── HANDLING FEE RULES (Handling_Fee_Calculation_Sheet.xlsx) ────────────────
const HANDLING_FEES = {
  "Onyx Pro":                   { perUnit:40,  cap:2000 },
  "Mark Two":                   { perUnit:75,  cap:null },
  "X7":                         { perUnit:100, cap:null },
  "FX10":                       { perUnit:100, cap:null },
  "FX20":                       { perUnit:100, cap:null },
  "Metal X Printer Only":       { perUnit:100, cap:null },
  "MX/S1 Bundle":               { perUnit:150, cap:null },
  "MX/S2 Bundle":               { perUnit:200, cap:null },
  "Individual Material Spools": { perUnit:1,   cap:150  },
  "Material Spool Packs":       { perUnit:10,  cap:150  },
  "Small Pack FRUs":            { perUnit:1,   cap:100  },
  "Large Pack FRUs":            { perUnit:5,   cap:null },
};

function calcBaseHandling(net) { return Math.min(Math.max(Math.round(net*0.02*100)/100, 5), 20); }
function calcPerUnitHandling(group, qty) {
  const r = HANDLING_FEES[group];
  if (!r) return 0;
  const raw = r.perUnit * qty;
  return r.cap !== null ? Math.min(raw, r.cap) : raw;
}

// ─── ESSENTIALS RATES (Worksheet CSV) ────────────────────────────────────────
const ESSENTIALS_RATES = {
  "Onyx One (Gen 2)":[0.12,0.12,0.12,0.12,0.12,0.12],
  "Onyx Pro (Gen 2)":[0.12,0.12,0.12,0.12,0.12,0.12],
  "Mark Two (Gen 2)":[0.12,0.12,0.12,0.12,0.12,0.12],
  "X3 (Gen 2)":      [0.12,0.12,0.12,0.12,0.12,0.12],
  "X5 (Gen 2)":      [0.12,0.12,0.12,0.12,0.12,0.12],
  "X7 (Gen 2)":      [0.12,0.12,0.12,0.12,0.12,0.12],
  "X7 Field Edition":[0.12,0.12,0.12,0.12,0.12,0.12],
  "FX10":            [0.12,0.12,0.12,0.12,0.12,0.12],
  "FX20":            [0.12,0.12,0.12,0.12,0.12,0.12],
  "Metal X (Gen 2)": [0.11,0.05,0.035,0.035,0.03,0.03],
  "Sinter-1 (B.V.)":[0.06,0.06,0.06,0.06,0.06,0.06],
  "Sinter-2":        [0.07,0.07,0.07,0.07,0.07,0.07],
  "Wash-1 (B.V)":    [0.05,0.05,0.05,0.05,0.05,0.05],
};

const SUB_TERMS = [
  { label:"1 Year",   years:1, type:"fixed"    },
  { label:"3 Year",   years:3, type:"fixed"    },
  { label:"Prorated", years:0, type:"prorated" },
];

function getEssRate(name, qty) {
  const r = ESSENTIALS_RATES[name];
  if (!r) return 0;
  return r[Math.min(qty,6)-1] || r[0];
}
function calcSubTotal(annualU, term, months) {
  if (!term) return 0;
  if (term.type==="fixed") {
    // 3-year gets the same 15% discount as DFC plan pricing per FAQ
    const disc3yr = term.years === 3 ? 0.85 : 1;
    return annualU * term.years * disc3yr;
  }
  return annualU * ((months||12)/12);
}

// ─── DFC PLAN CALCULATOR (from Digital_Forge_Complete_FAQ_-_Partners.pdf) ────
// Essential 1yr:       12% × MSRP (all printers in org)
// Essential 3yr:       3 × 12% × MSRP × 0.85
// Advanced ≤3p 1yr:    12% × MSRP + $3,000 (flat)
// Advanced ≤3p 3yr:    3 × (12% × MSRP + $3,000) × 0.85
// Advanced >3p 1yr:    12% × MSRP + $1,000 × nPrinters
// Advanced >3p 3yr:    3 × (12% × MSRP + $1,000 × nPrinters) × 0.85
// On-Prem ≤3p 1yr:     12% × MSRP + $5,000 (flat)
// On-Prem ≤3p 3yr:     3 × (12% × MSRP + $5,000) × 0.85
// On-Prem >3p 1yr:     12% × MSRP + $1,000 × nPrinters
// On-Prem >3p 3yr:     3 × (12% × MSRP + $1,000 × nPrinters) × 0.85
// On-Prem Software any: $3,000 × nPrinters (1yr) or × 0.85 (3yr)

function calcDFC({ msrpTotal, nPrinters, plan, term }) {
  if (!msrpTotal || !nPrinters || !plan || !term) return { annual:0, total:0, perPrinter:0 };
  const is3yr = term === "3 Year";
  const disc  = is3yr ? 0.85 : 1;
  const yrs   = is3yr ? 3 : 1;
  const ess12 = msrpTotal * 0.12;

  let base1yr = 0;
  if (plan === "Basic") return { annual:0, total:0, perPrinter:0, note:"Basic — no charge" };
  if (plan === "Essential") {
    base1yr = ess12;
  } else if (plan === "Advanced") {
    const addon = nPrinters <= 3 ? 3000 : 1000 * nPrinters;
    base1yr = ess12 + addon;
  } else if (plan === "On-Prem") {
    const addon = nPrinters <= 3 ? 5000 : 1000 * nPrinters;
    base1yr = ess12 + addon;
  } else if (plan === "On-Prem Software") {
    base1yr = 3000 * nPrinters;
  }

  const total = is3yr ? base1yr * yrs * disc : base1yr;
  return {
    annual: base1yr,
    total,
    perPrinter: total / nPrinters,
    annualEffective: total / yrs,
    saving: is3yr ? (base1yr * yrs - total) : 0,
  };
}

const DFC_PLANS = ["Basic","Essential","Advanced","On-Prem","On-Prem Software"];
const DFC_PLAN_COLORS = {
  "Basic":"#555870", "Essential":"#3b82f6", "Advanced":"#8b5cf6", "On-Prem":"#f59e0b", "On-Prem Software":"#22c55e"
};
const DFC_PLAN_DESC = {
  "Basic":           "Free with purchase · Basic software only · 1yr warranty",
  "Essential":       "12% MSRP/yr · Batch workflows · RBAC · API access · MFU",
  "Advanced":        "Essential + Simulation + Inspection (Industrial) · MFU",
  "On-Prem":         "Offline Eiger + LAN Connector + support + MFU · No cloud",
  "On-Prem Software":"Offline Eiger + LAN only · Software-only, no support",
};

// ─── DISCOUNT APPROVAL ───────────────────────────────────────────────────────
function getApproval(pct) {
  if (pct===0)    return { label:"No Approval Required",                  color:"#22c55e", icon:"✓" };
  if (pct<=0.10)  return { label:"Regional President Approval Required",  color:"#f59e0b", icon:"⚠" };
  return               { label:"CEO Approval Required",                   color:"#ef4444", icon:"✕" };
}

// ─── UTILS ───────────────────────────────────────────────────────────────────
const fmt  = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n||0);
const fmtP = n => (n*100).toFixed(1)+"%";
const genId = () => "MKF-"+Date.now().toString().slice(-6);
const todayStr = () => new Date().toISOString().split("T")[0];
const expiryStr = () => { const d=new Date(); d.setDate(d.getDate()+30); return d.toISOString().split("T")[0]; };

// ─── COLOURS — light theme ────────────────────────────────────────────────────
const C = {
  bg:"#f0f2f5", panel:"#ffffff", card:"#f8f9fb", border:"#dde1e9", borderHi:"#c8cdd8",
  accent:"#1a1a1a", accentB:"#333333", yellow:"#F9E500", text:"#1a1a1a", muted:"#6b7280", dim:"#e2e6ed",
  green:"#16a34a", amber:"#d97706", red:"#dc2626", blue:"#2563eb", purple:"#7c3aed",
};
const sans = "'Inter','Helvetica Neue',Arial,sans-serif";
const mono = "'IBM Plex Mono','Fira Code','Courier New',monospace";
const baseInp = { width:"100%", background:"#fff", border:`1px solid ${C.border}`, borderRadius:5, padding:"9px 12px", color:C.text, fontSize:14, fontFamily:sans, outline:"none", boxSizing:"border-box", transition:"border-color .15s" };
const baseSel = { ...baseInp, cursor:"pointer", appearance:"none", backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236b7280'/%3E%3C/svg%3E\")", backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center" };

const Lbl = ({c,children}) => <label style={{display:"block",fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:c||C.muted,marginBottom:5,fontFamily:sans}}>{children}</label>;
const Field = ({label,labelColor,children,style}) => <div style={style}><Lbl c={labelColor}>{label}</Lbl>{children}</div>;
const SecTitle = ({children,color}) => <div style={{fontSize:12,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:color||"#1a1a1a",marginBottom:16,paddingBottom:10,borderBottom:`2px solid ${C.yellow||"#F9E500"}`,fontFamily:sans}}>{children}</div>;
const InfoRow = ({label,value,color,bold,sub}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:sub?"3px 0":"5px 0",fontSize:sub?13:14,fontFamily:sans}}>
    <span style={{color:sub?C.muted+"aa":C.muted}}>{label}</span>
    <span style={{color:color||C.text,fontWeight:bold?700:500}}>{value}</span>
  </div>
);

// ─── LINE ROW ─────────────────────────────────────────────────────────────────
function LineRow({ item, index, onUpdate, onRemove }) {
  const pData   = PRICE_LIST[item.productName]||null;
  const lp      = pData?.price||0;
  const qty     = item.qty||1;
  const disc    = (item.discountPct||0)/100;
  const term    = SUB_TERMS.find(t=>t.label===item.term)||null;
  const eRate   = getEssRate(item.productName, qty);
  const annualU = lp * eRate;
  const subU    = term ? calcSubTotal(annualU, term, item.proratedMonths||12) : 0;
  const hwList  = lp*qty, hwNet=hwList*(1-disc);
  const subList = subU*qty, subNet=subList*(1-disc);
  const hasSub  = pData && term && eRate>0;
  const lineNet = hwNet+(hasSub?subNet:0);
  const handling= pData?.hGroup ? calcPerUnitHandling(pData.hGroup, qty) : 0;
  const wt      = pData ? (pData.weightKg||0)*qty : 0;
  const discBC  = (item.discountPct||0)>10 ? C.red : (item.discountPct||0)>0 ? C.amber : C.border;

  return (
    <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:6,padding:16,marginBottom:12,position:"relative",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
      <button onClick={onRemove} style={{position:"absolute",top:12,right:12,background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>
      <div style={{fontSize:11,fontWeight:700,color:C.muted,letterSpacing:"0.15em",marginBottom:12,fontFamily:sans}}>LINE {String(index+1).padStart(2,"0")}</div>

      <div style={{display:"grid",gridTemplateColumns:"2.4fr 60px 140px 110px",gap:10,alignItems:"end"}}>
        <Field label="Product">
          <select style={baseSel} value={item.productName} onChange={e=>onUpdate({...item,productName:e.target.value})}>
            <option value="">— Select product —</option>
            {CATEGORIES.map(cat=>(
              <optgroup key={cat} label={cat}>
                {Object.entries(PRICE_LIST).filter(([,v])=>v.cat===cat).map(([name,v])=>(
                  <option key={name} value={name}>{name} — {fmt(v.price)}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field label="Qty">
          <input type="number" min="1" style={baseInp} value={item.qty}
            onChange={e=>onUpdate({...item,qty:Math.max(1,parseInt(e.target.value)||1)})}/>
        </Field>
        <Field label="Ess. Subscription">
          <select style={baseSel} value={item.term} onChange={e=>onUpdate({...item,term:e.target.value})}>
            <option value="">Hardware Only</option>
            {SUB_TERMS.map(t=><option key={t.label} value={t.label}>{t.label}</option>)}
          </select>
        </Field>
        <Field label="Discount %">
          <input type="number" min="0" max="100" step="0.5" style={{...baseInp,borderColor:discBC}}
            value={item.discountPct} onChange={e=>onUpdate({...item,discountPct:Math.min(100,Math.max(0,parseFloat(e.target.value)||0))})}/>
        </Field>
      </div>

      {item.term==="Prorated" && (
        <div style={{marginTop:10,maxWidth:180}}>
          <Field label="Remaining Months">
            <select style={baseSel} value={item.proratedMonths||12} onChange={e=>onUpdate({...item,proratedMonths:parseInt(e.target.value)})}>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m=><option key={m} value={m}>{m} month{m>1?"s":""}</option>)}
            </select>
          </Field>
        </div>
      )}

      {pData && (
        <div style={{marginTop:12,paddingTop:10,borderTop:`1px solid ${C.dim}`,display:"flex",flexWrap:"wrap",gap:"4px 20px",fontSize:13,fontFamily:sans}}>
          <span><span style={{color:C.muted}}>SKU: </span><span style={{color:C.text,fontFamily:mono}}>{pData.sku}</span></span>
          <span><span style={{color:C.muted}}>List/unit: </span><span style={{color:C.text}}>{fmt(lp)}</span></span>
          <span><span style={{color:C.muted}}>HW net: </span><span style={{color:C.green,fontWeight:700}}>{fmt(hwNet)}</span></span>
          {hasSub && <>
            <span style={{width:"100%",height:0}}/>
            <span><span style={{color:C.muted}}>Ess./yr: </span><span style={{color:C.text}}>{fmt(annualU)} ({fmtP(eRate)})</span></span>
            <span><span style={{color:C.muted}}>Sub ({item.term}{item.term==="Prorated"?` ${item.proratedMonths||12}mo`:""}): </span><span style={{color:C.text}}>{fmt(subList)}</span></span>
            <span><span style={{color:C.muted}}>Sub net: </span><span style={{color:C.green,fontWeight:700}}>{fmt(subNet)}</span></span>
          </>}
          {handling>0 && <span><span style={{color:C.muted}}>Handling: </span><span style={{color:C.blue,fontWeight:600}}>{fmt(handling)}</span></span>}
          {wt>0 && <span><span style={{color:C.muted}}>~Weight: </span><span style={{color:C.text}}>{wt.toFixed(1)} kg</span></span>}
          <span style={{width:"100%",height:0}}/>
          <span style={{fontSize:14,fontWeight:700}}><span style={{color:C.muted}}>Line total net: </span><span style={{color:C.text}}>{fmt(lineNet)}</span></span>
        </div>
      )}
    </div>
  );
}

// ─── DFC PLAN PANEL ──────────────────────────────────────────────────────────
function DFCPanel({ computedLines }) {
  const [selectedPlan, setSelectedPlan] = useState("Essential");
  const [dfcTerm, setDfcTerm] = useState("1 Year");
  const [manualPrinters, setManualPrinters] = useState("");
  const [manualMsrp, setManualMsrp] = useState("");

  // Auto-compute from hardware lines
  const autoMsrp = computedLines.reduce((s,c) => s + (c.pData?.dfcPrinters>0 ? c.hwList : 0), 0);
  const autoPrinters = computedLines.reduce((s,c) => s + ((c.pData?.dfcPrinters||0) * c.qty), 0);

  const useMsrp     = parseFloat(manualMsrp)    || autoMsrp;
  const usePrinters = parseInt(manualPrinters)   || autoPrinters || 1;

  const result = useMemo(() => calcDFC({
    msrpTotal:  useMsrp,
    nPrinters:  usePrinters,
    plan:       selectedPlan,
    term:       dfcTerm,
  }), [useMsrp, usePrinters, selectedPlan, dfcTerm]);

  const planColor = DFC_PLAN_COLORS[selectedPlan] || C.accent;
  const fleetTier = usePrinters <= 3 ? "1–3 printers" : ">3 printers";
  const is3yr     = dfcTerm === "3 Year";

  // Require 3yr for Metal X / FX20
  const hasMetalRequired = computedLines.some(c =>
    c.pData && ["Metal X (Gen 2)","Metal X (Gen 2 - No WiFi)","FX20","Metal X, Wash 1, Sinter 1 Bundle","Metal X, Wash 1, Sinter 2 Bundle","FX10 Sinter-1 Bundle","FX10 Sinter-2 Bundle"].includes(c.productName)
  );

  return (
    <div style={{background:C.card,border:`1px solid ${C.borderHi}`,borderRadius:5,padding:16}}>
      <div style={{fontSize:9,letterSpacing:"0.25em",textTransform:"uppercase",color:C.purple,marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
        Digital Forge Complete — Plan Calculator
      </div>

      {hasMetalRequired && dfcTerm === "1 Year" && (
        <div style={{background:"#fff8f0",border:`1px solid ${C.amber}44`,borderRadius:4,padding:"8px 12px",marginBottom:12,fontSize:11,color:C.amber}}>
          ⚠ Metal X / FX20 require a 3-year DFC term. Get Markforged approval for 1-year exceptions.
        </div>
      )}

      {/* Plan selector cards */}
      <div style={{marginBottom:14}}>
        <Lbl>DFC Plan Tier</Lbl>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6}}>
          {DFC_PLANS.map(p => (
            <button key={p} onClick={()=>setSelectedPlan(p)}
              style={{background:selectedPlan===p?DFC_PLAN_COLORS[p]+"22":"transparent",border:`1px solid ${selectedPlan===p?DFC_PLAN_COLORS[p]:C.dim}`,borderRadius:4,padding:"7px 4px",fontFamily:mono,fontSize:9,color:selectedPlan===p?DFC_PLAN_COLORS[p]:C.muted,cursor:"pointer",letterSpacing:"0.05em",textTransform:"uppercase",transition:"all .15s"}}>
              {p}
            </button>
          ))}
        </div>
        <div style={{fontSize:10,color:"#444",marginTop:6,lineHeight:1.5}}>{DFC_PLAN_DESC[selectedPlan]}</div>
      </div>

      {/* Term */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        <Field label="Term">
          <select style={baseSel} value={dfcTerm} onChange={e=>setDfcTerm(e.target.value)}>
            <option>1 Year</option>
            <option>3 Year</option>
          </select>
        </Field>
        {is3yr && (
          <div style={{background:`${C.green}0e`,border:`1px solid ${C.green}33`,borderRadius:4,padding:"9px 12px",display:"flex",alignItems:"center",gap:8,fontSize:11,color:C.green}}>
            <span style={{fontSize:14}}>✓</span> 15% saving on 3-year term
          </div>
        )}
      </div>

      {/* Fleet inputs */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        <Field label={`# Printers in Eiger Org ${autoPrinters>0?"(auto-detected)":"(enter manually)"}`}>
          <input type="number" min="1" style={baseInp}
            value={manualPrinters||autoPrinters||""}
            onChange={e=>setManualPrinters(e.target.value)}
            placeholder={autoPrinters ? String(autoPrinters) : "e.g. 3"}/>
        </Field>
        <Field label={`Total MSRP of Org ${autoMsrp>0?"(auto from lines)":"(enter manually)"}`}>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:12}}>$</span>
            <input type="number" min="0" style={{...baseInp,paddingLeft:22}}
              value={manualMsrp||(autoMsrp||"")}
              onChange={e=>setManualMsrp(e.target.value)}
              placeholder={autoMsrp ? String(autoMsrp) : "e.g. 130000"}/>
          </div>
        </Field>
      </div>

      {/* Results */}
      {selectedPlan !== "Basic" && useMsrp > 0 && usePrinters > 0 && (
        <div style={{background:"#f5f6fa",border:`1px solid ${planColor}33`,borderRadius:5,padding:14,marginTop:4}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:10,color:planColor,letterSpacing:"0.1em",textTransform:"uppercase"}}>{selectedPlan} · {dfcTerm}</span>
            <span style={{fontSize:9,color:"#444",background:C.dim,borderRadius:10,padding:"2px 8px"}}>{fleetTier} tier</span>
          </div>
          <InfoRow label="MSRP base (12%)" value={fmt(useMsrp * 0.12)} sub/>
          {selectedPlan === "Advanced" && (
            <InfoRow label={`Advanced add-on (${usePrinters<=3?"$3,000 flat":usePrinters+"× $1,000"})`} value={fmt(usePrinters<=3?3000:1000*usePrinters)} sub/>
          )}
          {selectedPlan === "On-Prem" && (
            <InfoRow label={`On-Prem add-on (${usePrinters<=3?"$5,000 flat":usePrinters+"× $1,000"})`} value={fmt(usePrinters<=3?5000:1000*usePrinters)} sub/>
          )}
          {selectedPlan === "On-Prem Software" && (
            <InfoRow label={`$3,000 × ${usePrinters} printers`} value={fmt(3000*usePrinters)} sub/>
          )}
          <div style={{borderTop:`1px solid ${C.dim}`,marginTop:6,paddingTop:6}}>
            <InfoRow label="1-Year List Price" value={fmt(result.annual)}/>
            {is3yr && <>
              <InfoRow label="3-Year Gross" value={fmt(result.annual*3)} sub/>
              <InfoRow label="15% discount saving" value={`−${fmt(result.saving)}`} color={C.green} sub/>
              <InfoRow label="3-Year Total" value={fmt(result.total)} color={planColor} bold/>
              <InfoRow label="Effective per year" value={fmt(result.annualEffective)} sub/>
            </>}
            {!is3yr && <InfoRow label="Annual Total" value={fmt(result.total)} color={planColor} bold/>}
            <InfoRow label={`Per printer (${usePrinters}p)`} value={fmt(result.perPrinter)} sub/>
          </div>
          <div style={{borderTop:`1px solid ${C.dim}`,marginTop:8,paddingTop:8,fontSize:10,color:"#333",lineHeight:1.6}}>
            Partner margin: 40%{selectedPlan==="On-Prem Software"?" (20% for On-Prem Software only)":""} ·
            Start date: 1st of month after order{hasMetalRequired?" (Metal X: upon installation by certified tech)":""}
          </div>
        </div>
      )}

      {selectedPlan === "Basic" && (
        <div style={{background:`${C.muted}0a`,border:`1px solid ${C.dim}`,borderRadius:4,padding:12,fontSize:11,color:C.muted,textAlign:"center"}}>
          Basic plan — no charge. Includes 1-year manufacturer warranty &amp; basic Eiger access.
        </div>
      )}
    </div>
  );
}

// ─── SHIPPING ESTIMATE LOGIC ──────────────────────────────────────────────────
// Origin: European warehouse/3PL · Calibrated from real Salesforce orders
//
// Calibration reference — Mark Two (25 kg) + spools, ~$16K net:
//   Shipping Cost  = $78.50  → 0.49% of net  ✓ Express tier
//   Handling Fee   = $101.00 → matches per-unit logic  ✓
//   Total Duties   = $220.25 → 1.38% of net  (DAP, customer pays)
//   Total VAT      = $0      → B2B reverse charge  ✓
//
// Shipping tiers (carrier cost only, excl. handling & duties):
//   Express  < 30 kg  : 0.5% net, min $60   (DHL / courier)
//   LTL     30–150 kg : 0.9% net, min $150  (pallet freight forwarder)
//   FTL      > 150 kg : 1.4% net, min $350  (specialist / flatbed)
//
// Duties estimate (EMEA avg, non-EU destinations):
//   ~1.4% of net order value — shown as info for DAP, absorbed by MKF for DDP
// VAT: B2B reverse charge = $0 on quote (customer accounts in own return)

const SHIP_TIERS = [
  { maxKg:30,       label:"Express / courier",       pct:0.005, min:60,  color:"#16a34a" },
  { maxKg:150,      label:"LTL / pallet freight",    pct:0.009, min:150, color:"#d97706" },
  { maxKg:Infinity, label:"FTL / specialist freight",pct:0.014, min:350, color:"#dc2626" },
];
const DUTIES_RATE = 0.014; // ~1.4% of net (EMEA avg, calibrated from SF data)

function calcShipEstimate(netTotal, weightKg, incoterm) {
  if (!netTotal || !weightKg) return { low:0, mid:0, high:0, duties:0, tier:null };
  const tier   = SHIP_TIERS.find(t => weightKg <= t.maxKg);
  const base   = Math.max(netTotal * tier.pct, tier.min);
  const duties = Math.round(netTotal * DUTIES_RATE / 5) * 5;
  const mid    = Math.round(base / 5) * 5;
  const low    = Math.round(mid * 0.8 / 5) * 5;
  const high   = Math.round(mid * 1.3 / 5) * 5;
  return { low, mid, high, duties, tier };
}

// ─── SHIPPING PANEL ───────────────────────────────────────────────────────────
function ShippingPanel({ netTotal, computedLines, customerPickup, setCustomerPickup, customShipping, setCustomShipping, incoterm, setIncoterm, useEstimate, setUseEstimate }) {

  const baseHandling = useMemo(() => calcBaseHandling(netTotal), [netTotal]);
  const pickupCharge = customerPickup ? 30 : 0;
  const perUnitTotal = useMemo(() =>
    computedLines.reduce((s,c) => s + calcPerUnitHandling(c.pData?.hGroup||"", c.qty), 0), [computedLines]);
  const totalHandling = baseHandling + pickupCharge + perUnitTotal;
  const totalWeight   = computedLines.reduce((s,c) => s + (c.pData?.weightKg||0)*c.qty, 0);

  const estimate = useMemo(() => calcShipEstimate(netTotal, totalWeight, incoterm), [netTotal, totalWeight, incoterm]);

  const shippingCost = useEstimate
    ? (estimate.mid || 0)
    : (parseFloat(customShipping) || 0);
  const grandTotal = netTotal + totalHandling + shippingCost;

  // Sync estimate into customShipping when switching to manual so it prefills
  const handleUseEstimateChange = (val) => {
    setUseEstimate(val);
    if (!val && estimate.mid) setCustomShipping(String(estimate.mid));
  };

  const tier = estimate.tier;
  const tierColor = tier?.color || C.muted;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>

      {/* ── WEIGHT SUMMARY ── */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:16}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.blue,marginBottom:12}}>Shipment Weight</div>
        {totalWeight === 0
          ? <div style={{fontSize:13,color:C.muted}}>Add products on the Line Items tab to calculate weight.</div>
          : <>
              <div style={{display:"flex",flexWrap:"wrap",gap:"3px 18px",marginBottom:10}}>
                {computedLines.filter(c=>c.pData&&c.pData.weightKg>0).map((c,i)=>(
                  <span key={i} style={{fontSize:12,color:C.muted}}>{c.productName} ×{c.qty} = <strong style={{color:C.text}}>{((c.pData.weightKg||0)*c.qty).toFixed(1)} kg</strong></span>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"#f0f4ff",borderRadius:5,border:`1px solid ${C.blue}22`}}>
                <span style={{fontSize:15,fontWeight:700,color:C.text}}>{totalWeight.toFixed(1)} kg total</span>
                {tier && <span style={{fontSize:11,color:tierColor,border:`1px solid ${tierColor}55`,borderRadius:4,padding:"3px 10px",fontWeight:700}}>{tier.label}</span>}
              </div>
            </>
        }
      </div>

      {/* ── HANDLING FEES ── */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:16}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.blue,marginBottom:12}}>Handling Fees (Markforged policy)</div>
        <div style={{marginBottom:10,padding:"10px 12px",background:"#fafbfc",borderRadius:5,border:`1px solid ${C.border}`}}>
          <div style={{fontSize:11,color:C.muted,marginBottom:4}}>Base fee: 2% of net order · min $5 · max $20</div>
          <InfoRow label="Base handling" value={fmt(baseHandling)} color={C.blue}/>
        </div>
        <div style={{marginBottom:10,padding:"10px 12px",background:"#fafbfc",borderRadius:5,border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <input type="checkbox" id="pickup" checked={customerPickup} onChange={e=>setCustomerPickup(e.target.checked)} style={{accentColor:C.accent,width:15,height:15,cursor:"pointer"}}/>
            <label htmlFor="pickup" style={{fontSize:13,color:C.text,cursor:"pointer",fontWeight:500}}>Customer arranges own pickup (+$30)</label>
          </div>
          {customerPickup && <InfoRow label="Customer pickup charge" value={fmt(30)} color={C.blue}/>}
        </div>
        {computedLines.filter(c=>c.pData?.hGroup&&calcPerUnitHandling(c.pData.hGroup,c.qty)>0).length > 0 && (
          <div style={{padding:"10px 12px",background:"#fafbfc",borderRadius:5,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>Per-unit handling:</div>
            {computedLines.filter(c=>c.pData?.hGroup&&calcPerUnitHandling(c.pData.hGroup,c.qty)>0).map((c,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"2px 0"}}>
                <span style={{color:C.text}}>{c.productName} ×{c.qty} <span style={{color:C.muted}}>({c.pData.hGroup})</span></span>
                <span style={{color:C.blue,fontWeight:600}}>{fmt(calcPerUnitHandling(c.pData.hGroup,c.qty))}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{borderTop:`2px solid ${C.border}`,paddingTop:10,marginTop:12}}>
          <InfoRow label="Total Handling" value={fmt(totalHandling)} color={C.blue} bold/>
        </div>
      </div>

      {/* ── FREIGHT ESTIMATE ── */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:16}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.blue,marginBottom:4}}>Freight Cost Estimate</div>
        <div style={{fontSize:11,color:C.muted,marginBottom:14}}>Ships from EU warehouse · % of net order value by weight tier</div>

        {/* Incoterms selector */}
        <div style={{marginBottom:14}}>
          <Lbl>Incoterms</Lbl>
          <div style={{display:"flex",gap:8}}>
            {["DDP","DAP"].map(t=>(
              <button key={t} onClick={()=>setIncoterm(t)} style={{flex:1,padding:"9px 0",borderRadius:5,border:`2px solid ${incoterm===t?C.accent:C.border}`,background:incoterm===t?C.accent+"12":"#fff",color:incoterm===t?C.accent:C.muted,fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .15s"}}>
                {t}
                <div style={{fontSize:10,fontWeight:400,marginTop:2,color:incoterm===t?C.accent:C.muted}}>
                  {t==="DDP"?"Markforged absorbs duties":"Customer pays duties"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Estimate display */}
        {totalWeight > 0 && netTotal > 0 ? (
          <div style={{marginBottom:14}}>
            {/* Carrier cost */}
            <div style={{background:"#f0f4ff",border:`1px solid ${C.blue}22`,borderRadius:6,padding:"13px 15px",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:C.text}}>Carrier Cost</div>
                  <div style={{fontSize:11,color:C.muted}}>{tier?.label} · {((tier?.pct||0)*100).toFixed(1)}% of net · min ${tier?.min}</div>
                </div>
                <span style={{fontSize:11,color:tierColor,border:`1px solid ${tierColor}55`,borderRadius:4,padding:"2px 8px",fontWeight:700}}>{totalWeight.toFixed(1)} kg</span>
              </div>
              <div style={{display:"flex",gap:5}}>
                {[{l:"Low",v:estimate.low},{l:"Mid",v:estimate.mid},{l:"High",v:estimate.high}].map(({l,v})=>(
                  <div key={l} style={{flex:1,textAlign:"center",padding:"7px 4px",background:l==="Mid"?"#e0e7ff":"#fff",borderRadius:5,border:`1px solid ${l==="Mid"?C.blue+"44":C.border}`}}>
                    <div style={{fontSize:10,color:C.muted,marginBottom:2}}>{l}{l==="Mid"?" ✓":""}</div>
                    <div style={{fontSize:13,fontWeight:700,color:l==="Mid"?C.blue:C.text}}>{fmt(v)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Duties line */}
            <div style={{padding:"11px 14px",borderRadius:6,border:`1px solid ${incoterm==="DDP"?C.amber+"55":C.border}`,background:incoterm==="DDP"?"#fffbeb":"#fafbfc"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:incoterm==="DDP"?C.amber:C.text}}>
                    Total Duties (est. ~1.4% net)
                  </div>
                  <div style={{fontSize:11,color:C.muted,marginTop:2}}>
                    {incoterm==="DDP"
                      ? "Absorbed by Markforged — not billed to customer"
                      : "Billed directly to customer by customs authority"}
                  </div>
                </div>
                <div style={{fontSize:14,fontWeight:700,color:incoterm==="DDP"?C.amber:C.muted,whiteSpace:"nowrap",marginLeft:12}}>
                  {incoterm==="DDP"?<span style={{textDecoration:"line-through"}}>{fmt(estimate.duties)}</span>:fmt(estimate.duties)}
                </div>
              </div>
              {incoterm==="DAP"&&<div style={{fontSize:10,color:C.muted,marginTop:6}}>⚠ Not included in Grand Total — customer responsibility</div>}
              {incoterm==="DDP"&&<div style={{fontSize:10,color:C.amber,marginTop:6}}>⚠ For DDP deals, confirm duties absorption with Finance before sending</div>}
            </div>

            {/* VAT note */}
            <div style={{fontSize:11,color:C.muted,marginTop:8,padding:"6px 10px",background:"#f8f9fb",borderRadius:4,border:`1px solid ${C.border}`}}>
              VAT: B2B reverse charge applies — $0 on quote (customer accounts in own VAT return)
            </div>
          </div>
        ) : (
          <div style={{padding:"12px 14px",background:"#fafbfc",borderRadius:5,border:`1px solid ${C.border}`,marginBottom:14,fontSize:13,color:C.muted}}>
            Add products and a net order value to generate an estimate.
          </div>
        )}

        {/* Toggle: use estimate vs manual */}
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {[{v:true,l:"Use estimate"},{v:false,l:"Enter actual quote"}].map(({v,l})=>(
            <button key={l} onClick={()=>handleUseEstimateChange(v)} style={{flex:1,padding:"8px 0",borderRadius:5,border:`2px solid ${useEstimate===v?C.green:C.border}`,background:useEstimate===v?C.green+"12":"#fff",color:useEstimate===v?C.green:C.muted,fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .15s"}}>
              {l}
            </button>
          ))}
        </div>

        {/* Manual override */}
        {!useEstimate && (
          <div>
            <Lbl>Actual carrier quote</Lbl>
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:14,fontWeight:600}}>$</span>
              <input type="number" min="0" step="10" style={{...baseInp,paddingLeft:26,fontSize:14}} value={customShipping} onChange={e=>setCustomShipping(e.target.value)} placeholder="0"/>
            </div>
          </div>
        )}
      </div>

      {/* ── GRAND TOTAL ── */}
      <div style={{background:"#f0faf4",border:`1px solid ${C.green}44`,borderRadius:6,padding:"16px 18px"}}>
        <InfoRow label="Products Net" value={fmt(netTotal)}/>
        <InfoRow label="Handling" value={fmt(totalHandling)} color={C.blue}/>
        <InfoRow label={`Freight ${useEstimate?"(est.)":"(quoted)"}`} value={fmt(shippingCost)} color={shippingCost>0?C.blue:C.muted}/>
        {incoterm==="DAP" && estimate.duties>0 && (
          <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:12,color:C.muted,fontStyle:"italic"}}>
            <span>Duties (DAP — customer pays separately)</span>
            <span>{fmt(estimate.duties)}</span>
          </div>
        )}
        <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 2px",fontSize:17,fontWeight:700,color:C.text,borderTop:`2px solid ${C.green}44`,marginTop:10}}>
          <span>Grand Total {useEstimate&&shippingCost>0?<span style={{fontSize:11,color:C.muted,fontWeight:400}}>(freight est.)</span>:null}</span>
          <span style={{color:C.green}}>{fmt(grandTotal)}</span>
        </div>
        {incoterm==="DAP"&&estimate.duties>0&&<div style={{fontSize:10,color:C.muted,marginTop:4}}>Duties not included · {incoterm} · customer import responsibility</div>}
        {incoterm==="DDP"&&<div style={{fontSize:10,color:C.amber,marginTop:4}}>DDP · duties absorbed by Markforged · confirm with Finance</div>}
      </div>

    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function ValentinDirectCPQ() {
  const [qid]     = useState(genId);
  const [qDate]   = useState(todayStr);
  const [qExpiry, setQExpiry]     = useState(expiryStr);
  const [repName, setRepName]     = useState("");
  const [sfUrl,   setSfUrl]       = useState("");
  const [custName,setCustName]    = useState("");
  const [custContact,setCustContact] = useState("");
  const [custAddr,setCustAddr]         = useState("");
  const [custPostal,setCustPostal]     = useState("");
  const [custCity,setCustCity]         = useState("");
  const [custCountry,setCustCountry]   = useState("");
  const [custVAT,setCustVAT]           = useState("");
  const [custEmail,setCustEmail]       = useState("");
  const [notes,   setNotes]       = useState("");
  const [activeTab, setActiveTab] = useState("lines");
  const [savedQuotes, setSavedQuotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mkf_cpq_saves")||"[]"); } catch { return []; }
  });
  const [showSavePanel, setShowSavePanel] = useState(false);

  const getSnapshot = () => ({
    qid, qDate, qExpiry, repName, sfUrl,
    custName, custContact, custEmail, custAddr, custPostal, custCity, custCountry, custVAT,
    notes, lines, customerPickup, customShipping, incoterm, useEstimate,
    savedAt: new Date().toISOString(),
  });

  const restoreSnapshot = (snap) => {
    setQExpiry(snap.qExpiry||expiryStr);
    setRepName(snap.repName||""); setSfUrl(snap.sfUrl||"");
    setCustName(snap.custName||""); setCustContact(snap.custContact||"");
    setCustEmail(snap.custEmail||""); setCustAddr(snap.custAddr||"");
    setCustPostal(snap.custPostal||""); setCustCity(snap.custCity||"");
    setCustCountry(snap.custCountry||""); setCustVAT(snap.custVAT||"");
    setNotes(snap.notes||""); setLines(snap.lines||[{id:1,productName:"",qty:1,term:"",discountPct:0,proratedMonths:12}]);
    setCustomerPickup(snap.customerPickup||false); setCustomShipping(snap.customShipping||"");
    setIncoterm(snap.incoterm||"DDP"); setUseEstimate(snap.useEstimate!==false);
    setShowSavePanel(false);
  };

  const saveQuote = () => {
    const snap = getSnapshot();
    const label = (custName||"Untitled") + " — " + qid;
    const entry = { id: Date.now(), label, snap };
    const updated = [entry, ...savedQuotes].slice(0, 20);
    setSavedQuotes(updated);
    try { localStorage.setItem("mkf_cpq_saves", JSON.stringify(updated)); } catch {}
    setShowSavePanel(false);
    alert("Quote saved: " + label);
  };

  const deleteQuote = (id) => {
    const updated = savedQuotes.filter(q => q.id !== id);
    setSavedQuotes(updated);
    try { localStorage.setItem("mkf_cpq_saves", JSON.stringify(updated)); } catch {}
  };

  const addrMissing = !custPostal.trim() || !custCity.trim() || !custCountry.trim();
  const reqStyle = (val) => ({...baseInp, borderColor: !val.trim() ? C.red : C.border});
  const ReqLbl = ({children}) => <label style={{display:"block",fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:C.muted,marginBottom:5}}>{children} <span style={{color:C.red}}>*</span></label>;

  // Shipping state lifted up so preview panel can see it
  const [customerPickup, setCustomerPickup] = useState(false);
  const [customShipping, setCustomShipping] = useState("");
  const [incoterm, setIncoterm]             = useState("DDP");
  const [useEstimate, setUseEstimate]       = useState(true);

  const [lines, setLines] = useState([
    { id:1, productName:"", qty:1, term:"", discountPct:0, proratedMonths:12 }
  ]);

  const addLine  = () => setLines(p=>[...p,{id:Date.now(),productName:"",qty:1,term:"",discountPct:0,proratedMonths:12}]);
  const upLine   = useCallback((id,u)=>setLines(p=>p.map(l=>l.id===id?u:l)),[]);
  const remLine  = useCallback(id=>setLines(p=>p.filter(l=>l.id!==id)),[]);

  const computed = lines.map(item=>{
    const pData = PRICE_LIST[item.productName]||null;
    const lp    = pData?.price||0;
    const qty   = item.qty||1;
    const disc  = (item.discountPct||0)/100;
    const term  = SUB_TERMS.find(t=>t.label===item.term)||null;
    const eRate = getEssRate(item.productName, qty);
    const annualU=lp*eRate, subU=term?calcSubTotal(annualU,term,item.proratedMonths||12):0;
    const hwList=lp*qty, hwNet=hwList*(1-disc);
    const subList=subU*qty, subNet=subList*(1-disc);
    const hasSub=pData&&term&&eRate>0;
    return {...item,pData,hwList,hwNet,subList,subNet,hasSub,
            lineList:hwList+(hasSub?subList:0), lineNet:hwNet+(hasSub?subNet:0)};
  });

  const active    = computed.filter(c=>c.pData);
  const totalList = active.reduce((s,c)=>s+c.lineList,0);
  const totalNet  = active.reduce((s,c)=>s+c.lineNet,0);
  const totalDisc = totalList-totalNet;
  const discPct   = totalList>0?totalDisc/totalList:0;
  const approval  = getApproval(discPct);
  const hasLines  = active.length>0;

  // Shipping calcs
  const baseHandling   = useMemo(()=>calcBaseHandling(totalNet),[totalNet]);
  const pickupCharge   = customerPickup ? 30 : 0;
  const perUnitTotal   = useMemo(()=>active.reduce((s,c)=>s+calcPerUnitHandling(c.pData?.hGroup||"",c.qty),0),[active]);
  const totalHandling  = baseHandling + pickupCharge + perUnitTotal;
  const shipEstimate   = useMemo(()=>calcShipEstimate(totalNet, active.reduce((s,c)=>s+(c.pData?.weightKg||0)*c.qty,0), incoterm),[totalNet,active,incoterm]);
  const shippingCost   = useEstimate ? (shipEstimate.mid||0) : (parseFloat(customShipping)||0);
  const grandTotal     = totalNet + totalHandling + shippingCost;

  const handleExportPDF = () => {
    if (!hasLines) return;
    const fullAddr = [custAddr, custPostal && custCity ? `${custPostal} ${custCity}` : (custPostal||custCity), custCountry].filter(Boolean).join(", ");
    const rows = active.map(c => {
      const hwRow = `<tr>
        <td style="padding:8px 8px 4px;vertical-align:top;border-bottom:none">
          <div style="font-weight:600;font-size:13px">${c.productName}</div>
          ${(c.discountPct||0)>0?`<div style="font-size:11px;color:#dc2626;margin-top:2px">− ${c.discountPct}% discount</div>`:""}
        </td>
        <td style="padding:8px 8px 4px;text-align:center;color:#6b7280;border-bottom:none">${c.qty}</td>
        <td style="padding:8px 8px 4px;font-family:monospace;font-size:11px;color:#6b7280;border-bottom:none">${c.pData?.sku||""}</td>
        <td style="padding:8px 8px 4px;text-align:right;color:#6b7280;border-bottom:none">${fmt(c.hwList)}</td>
        <td style="padding:8px 8px 4px;text-align:right;font-weight:700;color:#16a34a;font-size:13px;border-bottom:none">${fmt(c.hwNet)}</td>
      </tr>`;
      const subRow = c.hasSub ? `<tr>
        <td style="padding:2px 8px 8px 20px;vertical-align:top;color:#6b7280;font-size:12px;border-bottom:1px solid #f0f2f5">
          ↳ Essentials ${c.term}${c.term==="Prorated"?` (${c.proratedMonths||12}mo)`:""} @ ${fmtP(getEssRate(c.productName,c.qty))} MSRP
        </td>
        <td style="padding:2px 8px 8px;text-align:center;color:#6b7280;font-size:12px;border-bottom:1px solid #f0f2f5">${c.qty}</td>
        <td style="padding:2px 8px 8px;font-family:monospace;font-size:10px;color:#9ca3af;border-bottom:1px solid #f0f2f5">${c.pData?.subSku||""}</td>
        <td style="padding:2px 8px 8px;text-align:right;color:#6b7280;font-size:12px;border-bottom:1px solid #f0f2f5">${fmt(c.subList)}</td>
        <td style="padding:2px 8px 8px;text-align:right;color:#16a34a;font-size:12px;border-bottom:1px solid #f0f2f5">${fmt(c.subNet)}</td>
      </tr>` : `<tr><td colspan="5" style="border-bottom:1px solid #f0f2f5;padding:0 0 0px"></td></tr>`;
      return hwRow + subRow;
    }).join("");

    const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<title>Quote ${qid}${custName?" — "+custName:""}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:#1a1d26;background:#fff;padding:48px 56px;}
  @media print{body{padding:24px 32px;}}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:18px;border-bottom:3px solid #F9E500;}
  .logo-title{font-size:22px;font-weight:800;color:#1a1a1a;margin-bottom:5px;}
  .meta{font-size:11px;color:#6b7280;line-height:2.1;}
  .badge{font-size:14px;font-weight:700;color:#e03d00;font-family:monospace;margin-bottom:4px;}
  .bill-to{margin-bottom:22px;padding-bottom:16px;border-bottom:1px solid #e5e7eb;}
  .section-label{font-size:10px;text-transform:uppercase;letter-spacing:.1em;font-weight:700;color:#6b7280;margin-bottom:5px;}
  .bill-name{font-size:15px;font-weight:700;margin-bottom:3px;}
  .bill-detail{font-size:12px;color:#6b7280;line-height:1.8;}
  table{width:100%;border-collapse:collapse;margin-bottom:22px;}
  thead tr{border-bottom:2px solid #dde1e9;}
  th{padding:8px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;font-weight:700;text-align:left;}
  .totals-box{max-width:340px;margin-left:auto;border-top:2px solid #dde1e9;padding-top:14px;}
  .trow{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;}
  .trow-label{color:#6b7280;}
  .grand{font-size:20px;font-weight:800;border-top:2px solid #dde1e9;padding-top:12px;margin-top:8px;}
  .notes-box{margin-top:22px;padding:13px 16px;background:#f8f9fb;border-radius:5px;border-left:3px solid #e03d00;font-size:13px;}
  .footer{margin-top:36px;padding-top:14px;border-top:1px solid #e5e7eb;font-size:10px;color:#9ca3af;}
  .legal-box{margin-top:22px;padding:14px 16px;background:#fffbeb;border-left:3px solid #F9E500;border-radius:4px;font-size:11px;color:#78350f;line-height:2;}
  .legal-title{font-size:12px;font-weight:700;color:#1a1a1a;margin-bottom:8px;}
  .legal-box a{color:#2563eb;}
</style>
</head><body>
<div class="header">
  <div>
    <div class="logo-title">Markforged Direct CPQ</div>
    <div class="meta">Markforged, Inc. · 60 Tower Road · Waltham, MA 02451<br/>EMEA Price Book — Q1 2026 · Internal / Confidential</div>
  </div>
  <div style="text-align:right">
    <div class="badge">${qid}</div>
    <div class="meta">Issued: ${qDate}<br/>Expires: ${qExpiry}${repName?`<br/>Rep: ${repName}`:""}</div>
  </div>
</div>
${custName?`<div class="bill-to">
  <div class="section-label">Bill To</div>
  <div class="bill-name">${custName}</div>
  <div class="bill-detail">${[custContact, custAddr, custPostal&&custCity?`${custPostal} ${custCity}`:(custPostal||custCity), custCountry?`<strong>${custCountry}</strong>`:"", custVAT?`<span style="color:#6b7280">VAT: ${custVAT}</span>`:"", custEmail?`<a href="mailto:${custEmail}" style="color:#2563eb">${custEmail}</a>`:""].filter(Boolean).join("<br/>")}</div>
</div>`:""}
<table>
  <thead><tr>
    <th>Product / Line</th>
    <th style="text-align:center">Qty</th>
    <th>SKU</th>
    <th style="text-align:right">List</th>
    <th style="text-align:right">Net</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="totals-box">
  <div class="trow"><span class="trow-label">HW List Total</span><span>${fmt(active.reduce((s,c)=>s+c.hwList,0))}</span></div>
  ${active.some(c=>c.hasSub)?`<div class="trow"><span class="trow-label">Essentials List Total</span><span>${fmt(active.reduce((s,c)=>s+c.subList,0))}</span></div>`:""}
  ${totalDisc>0?`<div class="trow"><span class="trow-label">Discount (${fmtP(discPct)})</span><span style="color:#dc2626">− ${fmt(totalDisc)}</span></div>`:""}
  <div class="trow" style="font-weight:600"><span class="trow-label">Products Net</span><span>${fmt(totalNet)}</span></div>
  <div class="trow"><span class="trow-label">Handling</span><span style="color:#2563eb">${fmt(totalHandling)}</span></div>
  ${shippingCost>0?`<div class="trow"><span class="trow-label">Shipping</span><span style="color:#2563eb">${fmt(shippingCost)}</span></div>`:""}
  <div class="trow grand"><span>Grand Total</span><span style="color:#16a34a">${fmt(grandTotal)}</span></div>
</div>
${notes?`<div class="notes-box"><strong>Notes:</strong><br/>${notes}</div>`:""}
<div class="legal-box">
  <div class="legal-title">Quotation Configuration and Acceptance Terms</div>
  <div>› <strong>Bundled Offer:</strong> The quotation provided is for a bundled configuration. Any adjustments to the proposed configuration will require a revised quotation and updated pricing.</div>
  <div>› <strong>Digital Forge Complete Term:</strong> The proposed Digital Forge Complete Essential plan term is for 1 year beginning on <strong>&lt;&lt;START DATE&gt;&gt;</strong> and expiring on <strong>&lt;&lt;END DATE&gt;&gt;</strong>. For more information please visit <a href="https://markforged.com/plans">markforged.com/plans</a></div>
  <div>› <strong>Acceptance Deadline:</strong> Purchase Orders must be received by Markforged, Inc. on or before <strong>${qExpiry}</strong></div>
  <div>› <strong>Terms and Conditions:</strong> All purchases are governed by the applicable Terms and Conditions at <a href="https://markforged.com/legal">markforged.com/legal</a>. The terms in effect at the time of order submission will apply and supersede any conflicting terms stated in the Purchase Order.</div>
</div>
<div class="footer">Confidential · Markforged Internal / Partner Use Only · Generated ${new Date().toLocaleString("en-GB")}</div>
</body></html>`;

    const blob = new Blob([html], { type:"text/html;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `Quote-${qid}${custName?"-"+custName.replace(/\s+/g,"-"):""}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const tabBtn = (id,label,badge) => (
    <button onClick={()=>setActiveTab(id)} style={{background:"transparent",border:"none",borderBottom:`3px solid ${activeTab===id?C.accent:"transparent"}`,color:activeTab===id?C.accent:C.muted,padding:"12px 18px",fontFamily:sans,fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .15s",whiteSpace:"nowrap"}}>
      {label}{badge?<span style={{marginLeft:6,background:C.accent,borderRadius:10,padding:"2px 7px",fontSize:11,color:"#fff"}}>{badge}</span>:null}
    </button>
  );

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:sans,fontSize:14}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input:focus,select:focus,textarea:focus{border-color:#1a1a1a!important;box-shadow:0 0 0 3px rgba(249,229,0,0.25);}
        button:hover{opacity:.85;}
        select option{background:#fff;color:#1a1d26;}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:#f0f2f5;}
        ::-webkit-scrollbar-thumb{background:#dde1e9;border-radius:3px;}
      `}</style>

      {/* HEADER */}
      <div style={{background:"#1a1a1a",padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between",height:62,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>

          <div>
            <div style={{fontSize:15,fontWeight:800,color:"#ffffff",letterSpacing:"-0.01em",fontFamily:sans}}>Markforged <span style={{color:"#F9E500",fontWeight:400}}>Direct CPQ</span></div>
            <div style={{fontSize:10,color:"#9ca3af",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>EMEA · Q1-2026 · Internal</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={saveQuote} title="Save quote to browser" style={{background:"#F9E500",border:"none",borderRadius:4,padding:"6px 14px",fontSize:12,color:"#1a1a1a",fontWeight:800,cursor:"pointer",fontFamily:sans}}>
            ↓ Save
          </button>
          <button onClick={()=>setShowSavePanel(p=>!p)} title="Load saved quote" style={{background:showSavePanel?"#ffffff22":"transparent",border:"1px solid #ffffff33",borderRadius:4,padding:"6px 14px",fontSize:12,color:"#ffffff",fontWeight:600,cursor:"pointer",fontFamily:sans}}>
            ↗ Load {savedQuotes.length>0?`(${savedQuotes.length})`:""}
          </button>
          <span style={{background:"#ffffff15",borderRadius:4,padding:"5px 12px",fontSize:12,color:"#F9E500",fontWeight:800,fontFamily:mono,letterSpacing:"0.05em"}}>{qid}</span>
        </div>
      </div>

      {/* SAVE/LOAD PANEL */}
      {showSavePanel && (
        <div style={{position:"fixed",top:62,right:0,width:380,maxHeight:"calc(100vh - 62px)",overflowY:"auto",background:C.panel,borderLeft:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,boxShadow:"-4px 4px 24px rgba(0,0,0,0.12)",zIndex:100,padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text,letterSpacing:"0.05em",textTransform:"uppercase"}}>Saved Quotes</div>
            <button onClick={()=>setShowSavePanel(false)} style={{background:"none",border:"none",fontSize:18,color:C.muted,cursor:"pointer",lineHeight:1}}>×</button>
          </div>
          {savedQuotes.length===0 ? (
            <div style={{padding:"24px 0",textAlign:"center",color:C.muted,fontSize:13}}>
              No saved quotes yet.<br/>Hit <strong>↓ Save</strong> to save the current quote.
            </div>
          ) : savedQuotes.map(q => (
            <div key={q.id} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",marginBottom:8,background:C.card,border:`1px solid ${C.border}`,borderRadius:6}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{q.label}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:2}}>{new Date(q.snap.savedAt).toLocaleString("en-GB",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</div>
              </div>
              <button onClick={()=>restoreSnapshot(q.snap)} style={{background:"#1a1a1a",color:"#F9E500",border:"none",borderRadius:4,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>Load</button>
              <button onClick={()=>deleteQuote(q.id)} style={{background:"transparent",color:C.muted,border:`1px solid ${C.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,cursor:"pointer"}}>🗑</button>
            </div>
          ))}
          <div style={{marginTop:16,paddingTop:14,borderTop:`1px solid ${C.border}`,fontSize:11,color:C.muted,lineHeight:1.6}}>
            Quotes are saved in your browser — they persist across sessions on this device.<br/>
            Max 20 quotes stored.
          </div>
        </div>
      )}

        <div style={{display:"grid",gridTemplateColumns:"1fr 400px",minHeight:"calc(100vh - 61px)"}}>

          {/* LEFT */}
          <div style={{borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column"}}>
            <div style={{background:C.panel,borderBottom:`1px solid ${C.border}`,padding:"0 32px",display:"flex",gap:2,overflowX:"auto"}}>
              {tabBtn("lines","Line Items",hasLines?active.length:null)}
              {tabBtn("dfc","DFC Plans")}
              {tabBtn("shipping","Shipping & Handling")}
            </div>

            <div style={{padding:"24px 32px",overflowY:"auto",flex:1}}>
              <div style={{marginBottom:24}}>
                <SecTitle>Deal Information</SecTitle>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>
                  <Field label="Sales Rep"><input style={baseInp} value={repName} onChange={e=>setRepName(e.target.value)} placeholder="Your name"/></Field>
                  <Field label="Region / Price Book"><input style={{...baseInp,color:C.accent,fontWeight:600}} value="EMEA — Q1 2026" readOnly/></Field>
                  <Field label="Salesforce URL"><input style={baseInp} value={sfUrl} onChange={e=>setSfUrl(e.target.value)} placeholder="Paste SF URL"/></Field>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:14,marginBottom:14}}>
                  <Field label="Quote Date"><input type="date" style={baseInp} value={qDate} readOnly/></Field>
                  <Field label="Expiry Date"><input type="date" style={baseInp} value={qExpiry} onChange={e=>setQExpiry(e.target.value)}/></Field>
                  <Field label="Company"><input style={baseInp} value={custName} onChange={e=>setCustName(e.target.value)} placeholder="Acme Corp"/></Field>
                  <Field label="Contact"><input style={baseInp} value={custContact} onChange={e=>setCustContact(e.target.value)} placeholder="Jane Smith"/></Field>
                  <Field label="Email"><input type="email" style={baseInp} value={custEmail} onChange={e=>setCustEmail(e.target.value)} placeholder="jane@acme.com"/></Field>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:14,marginBottom:0}}>
                <div><ReqLbl>Street / Address</ReqLbl><input style={baseInp} value={custAddr} onChange={e=>setCustAddr(e.target.value)} placeholder="12 Rue de la Paix"/></div>
                <div><ReqLbl>Postal Code</ReqLbl><input style={reqStyle(custPostal)} value={custPostal} onChange={e=>setCustPostal(e.target.value)} placeholder="69001"/></div>
                <div><ReqLbl>City</ReqLbl><input style={reqStyle(custCity)} value={custCity} onChange={e=>setCustCity(e.target.value)} placeholder="Lyon"/></div>
                <div><ReqLbl>Country</ReqLbl><input style={reqStyle(custCountry)} value={custCountry} onChange={e=>setCustCountry(e.target.value)} placeholder="France"/></div>
              </div>
              {addrMissing && <div style={{fontSize:11,color:C.red,marginTop:6,fontWeight:600}}>⚠ Postal code, city and country are required to export the quote</div>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:14,marginTop:12}}>
                <Field label="VAT Number"><input style={baseInp} value={custVAT} onChange={e=>setCustVAT(e.target.value)} placeholder="e.g. DE123456789"/></Field>
                <Field label="Internal Notes / Business Case"><input style={baseInp} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Discount justification, competitive notes..."/></Field>
              </div>
              </div>

              {activeTab==="lines" && <>
                <div style={{marginBottom:24}}>
                  <SecTitle>Line Items</SecTitle>
                  {lines.map((item,i)=>(
                    <LineRow key={item.id} item={item} index={i}
                      onUpdate={u=>upLine(item.id,u)} onRemove={()=>remLine(item.id)}/>
                  ))}
                  <button style={{display:"flex",alignItems:"center",gap:8,width:"100%",background:"transparent",border:`2px dashed ${C.border}`,borderRadius:5,padding:"12px 16px",color:C.muted,fontSize:14,fontFamily:sans,fontWeight:600,cursor:"pointer",marginTop:10}} onClick={addLine}>
                    <span style={{fontSize:18}}>＋</span> Add Line Item
                  </button>
                </div>
                {hasLines && (
                  <div style={{marginBottom:24}}>
                    <SecTitle>Discount Summary & Approval</SecTitle>
                    <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:6,padding:18,marginBottom:14,boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
                      <InfoRow label="Total List Price" value={fmt(totalList)}/>
                      {totalDisc>0 && <InfoRow label="Total Discount" value={`−${fmt(totalDisc)} (${fmtP(discPct)})`} color={C.red}/>}
                      <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 4px",fontSize:17,fontWeight:700,color:C.text,borderTop:`2px solid ${C.border}`,marginTop:8}}>
                        <span>NET TOTAL</span><span style={{color:C.green}}>{fmt(totalNet)}</span>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:5,border:"1px solid",borderColor:approval.color+"55",background:approval.color+"10",color:approval.color,fontSize:14,fontWeight:600}}>
                      <span style={{fontSize:18}}>{approval.icon}</span><span>{approval.label}</span>
                    </div>
                  </div>
                )}
                <div style={{marginTop:8}}>
                  <SecTitle>Quotation Terms</SecTitle>
                  <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:6,padding:"14px 16px",fontSize:12,color:"#92400e",lineHeight:1.8}}>
                    <div style={{fontWeight:700,marginBottom:8,fontSize:13,color:"#1a1a1a"}}>Quotation Configuration and Acceptance Terms</div>
                    <div>› <strong>Bundled Offer:</strong> The quotation provided is for a bundled configuration. Any adjustments to the proposed configuration will require a revised quotation and updated pricing.</div>
                    <div>› <strong>Digital Forge Complete Term:</strong> The proposed Digital Forge Complete Essential plan term is for 1 year beginning on <strong>&lt;&lt;START DATE&gt;&gt;</strong> and expiring on <strong>&lt;&lt;END DATE&gt;&gt;</strong></div>
                    <div>&gt;&gt; For more information about Digital Forge Complete, including features and functionality, please visit <span style={{color:"#2563eb",textDecoration:"underline"}}>markforged.com/plans</span></div>
                    <div>› <strong>Acceptance Deadline:</strong> Purchase Orders for this quotation configuration must be received by Markforged, Inc. on or before <strong>{qExpiry}</strong></div>
                    <div>› <strong>Terms and Conditions:</strong> All purchases are governed by the applicable Terms and Conditions available at <span style={{color:"#2563eb",textDecoration:"underline"}}>markforged.com/legal</span>. The terms in effect at the time of order submission will apply and will supersede any conflicting terms stated in the Purchase Order.</div>
                  </div>
                </div>
              </>}

              {activeTab==="dfc" && <DFCPanel computedLines={active}/>}

              {activeTab==="shipping" && <ShippingPanel
                netTotal={totalNet} computedLines={active}
                customerPickup={customerPickup} setCustomerPickup={setCustomerPickup}
                customShipping={customShipping} setCustomShipping={setCustomShipping}
                incoterm={incoterm} setIncoterm={setIncoterm}
                useEstimate={useEstimate} setUseEstimate={setUseEstimate}
              />}
            </div>
          </div>

          {/* RIGHT PREVIEW */}
          <div style={{background:"#eef0f4",padding:"22px 18px",position:"sticky",top:0,maxHeight:"calc(100vh - 61px)",overflowY:"auto",borderLeft:`1px solid ${C.border}`}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted,marginBottom:14,paddingBottom:10,borderBottom:`1px solid ${C.border}`}}>Live Quote Preview</div>

            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:6,padding:18,marginBottom:14,boxShadow:"0 1px 5px rgba(0,0,0,0.07)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div style={{fontSize:11,color:C.accent,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:3}}>Markforged, Inc.</div>
                  <div style={{fontSize:11,color:C.muted,lineHeight:1.7}}>60 Tower Road · Waltham, MA 02451<br/>www.markforged.com</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.accent,fontFamily:mono}}>{qid}</div>
                  <div style={{fontSize:11,color:C.muted,marginTop:4}}>Issued: {qDate}</div>
                  <div style={{fontSize:11,color:C.muted}}>Expires: {qExpiry}</div>
                </div>
              </div>

              {custName && (
                <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10,marginBottom:12}}>
                  <div style={{fontSize:11,color:C.muted,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Bill To</div>
                  <div style={{fontSize:14,fontWeight:700,color:C.text}}>{custName}</div>
                  {custContact&&<div style={{fontSize:12,color:C.muted}}>{custContact}</div>}
                  {custAddr&&<div style={{fontSize:12,color:C.muted}}>{custAddr}</div>}
                  {(custPostal||custCity)&&<div style={{fontSize:12,color:C.muted}}>{[custPostal,custCity].filter(Boolean).join(" ")}</div>}
                  {custCountry&&<div style={{fontSize:12,fontWeight:700,color:C.text}}>{custCountry}</div>}
                  {custVAT&&<div style={{fontSize:11,color:C.muted,marginTop:2}}>VAT: {custVAT}</div>}
                  {custEmail&&<div style={{fontSize:11,color:C.blue,marginTop:2}}>{custEmail}</div>}
                </div>
              )}

              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr>{["Product","Qty","SKU","List","Net"].map((h,i)=>(
                    <th key={h} style={{textAlign:i>=3?"right":"left",padding:"6px 4px",borderBottom:`2px solid ${C.border}`,color:C.muted,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase"}}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {active.length===0?(
                    <tr><td colSpan={5} style={{padding:"20px 0",color:C.muted,textAlign:"center",fontSize:13}}>Add products to preview</td></tr>
                  ):active.map(c=>(
                    <>
                      <tr key={c.id+"-hw"}>
                        <td style={{padding:"6px 4px 2px",borderBottom:"none",verticalAlign:"top"}}>
                          <div style={{color:C.text,fontWeight:600,fontSize:12}}>{c.productName}</div>
                          {(c.discountPct||0)>0&&<div style={{fontSize:10,color:C.red,fontWeight:600}}>−{c.discountPct}%</div>}
                        </td>
                        <td style={{padding:"6px 4px 2px",borderBottom:"none",color:C.muted,textAlign:"center",fontSize:12}}>{c.qty}</td>
                        <td style={{padding:"6px 4px 2px",borderBottom:"none",color:C.muted,fontSize:10,fontFamily:mono}}>{c.pData?.sku}</td>
                        <td style={{padding:"6px 4px 2px",borderBottom:"none",color:C.muted,textAlign:"right",fontSize:12}}>{fmt(c.hwList)}</td>
                        <td style={{padding:"6px 4px 2px",borderBottom:"none",color:C.green,fontWeight:700,textAlign:"right",fontSize:12}}>{fmt(c.hwNet)}</td>
                      </tr>
                      {c.hasSub&&(
                        <tr key={c.id+"-sub"}>
                          <td style={{padding:"1px 4px 6px 12px",borderBottom:`1px solid ${C.dim}`,verticalAlign:"top"}}>
                            <div style={{color:C.muted,fontSize:10}}>↳ Essentials {c.term} ({fmtP(getEssRate(c.productName,c.qty))} MSRP)</div>
                          </td>
                          <td style={{padding:"1px 4px 6px",borderBottom:`1px solid ${C.dim}`,color:C.muted,textAlign:"center",fontSize:10}}>{c.qty}</td>
                          <td style={{padding:"1px 4px 6px",borderBottom:`1px solid ${C.dim}`,color:C.muted,fontSize:9,fontFamily:mono}}>{c.pData?.subSku||""}</td>
                          <td style={{padding:"1px 4px 6px",borderBottom:`1px solid ${C.dim}`,color:C.muted,textAlign:"right",fontSize:10}}>{fmt(c.subList)}</td>
                          <td style={{padding:"1px 4px 6px",borderBottom:`1px solid ${C.dim}`,color:C.green,textAlign:"right",fontSize:10}}>{fmt(c.subNet)}</td>
                        </tr>
                      )}
                      {!c.hasSub&&(
                        <tr key={c.id+"-gap"} style={{borderBottom:`1px solid ${C.dim}`}}><td colSpan={5} style={{padding:"0 0 4px"}}></td></tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>

              {hasLines&&(
                <div style={{borderTop:`2px solid ${C.border}`,paddingTop:10,marginTop:6}}>
                  {active.some(c=>c.hasSub)&&<InfoRow label="HW List" value={fmt(active.reduce((s,c)=>s+c.hwList,0))} sub/>}
                  {active.some(c=>c.hasSub)&&<InfoRow label="Essentials List" value={fmt(active.reduce((s,c)=>s+c.subList,0))} sub/>}
                  {totalDisc>0&&<InfoRow label={`Discount (${fmtP(discPct)})`} value={`−${fmt(totalDisc)}`} color={C.red}/>}
                  <InfoRow label="Products Net" value={fmt(totalNet)} bold/>
                  <InfoRow label="Handling" value={fmt(totalHandling)} color={C.blue}/>
                  {shippingCost>0&&<InfoRow label={`Freight${useEstimate?" (est.)":""}`} value={fmt(shippingCost)} color={C.blue}/>}
                  {incoterm==="DAP"&&shipEstimate.duties>0&&<InfoRow label="Duties (DAP, not included)" value={fmt(shipEstimate.duties)} color={C.muted}/>}
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:700,color:C.text,paddingTop:10,borderTop:`2px solid ${C.borderHi}`,marginTop:8}}>
                    <span>GRAND TOTAL</span><span style={{color:C.green}}>{fmt(grandTotal)}</span>
                  </div>
                </div>
              )}
              {repName&&<div style={{marginTop:10,fontSize:11,color:C.muted,fontWeight:600}}>PREPARED BY: {repName.toUpperCase()}</div>}
            </div>

            {hasLines&&(
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:5,border:"1px solid",borderColor:approval.color+"55",background:approval.color+"12",color:approval.color,fontSize:13,fontWeight:600,marginBottom:12}}>
                <span style={{fontSize:16}}>{approval.icon}</span><span>{approval.label}</span>
              </div>
            )}

            {notes&&(
              <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:5,padding:"12px 14px",marginBottom:12}}>
                <div style={{fontSize:11,color:C.muted,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>Notes</div>
                <div style={{fontSize:13,color:C.text,lineHeight:1.6}}>{notes}</div>
              </div>
            )}

            {(() => {
              const canExport = hasLines && !addrMissing;

              const handleGmail = () => {
                if (!canExport) return;
                const fullAddr = [custAddr, custPostal&&custCity?`${custPostal} ${custCity}`:(custPostal||custCity), custCountry].filter(Boolean).join(", ");
                const linesTxt = active.map(c => {
                  const hw = `  • ${c.productName} ×${c.qty}  |  SKU: ${c.pData?.sku}  |  Net: ${fmt(c.hwNet)}`;
                  const sub = c.hasSub ? `\n    ↳ Essentials ${c.term} (${c.pData?.subSku})  |  Net: ${fmt(c.subNet)}` : "";
                  const disc = (c.discountPct||0)>0 ? `  [−${c.discountPct}%]` : "";
                  return hw + disc + sub;
                }).join("\n");
                const body = [
                  `Dear ${custContact||custName||""},`,
                  ``,
                  `Please find below your Markforged quote ${qid}, valid until ${qExpiry}.`,
                  ``,
                  `─── BILL TO ────────────────────────────`,
                  `${custName}${custContact?`\n${custContact}`:""}${custVAT?`\nVAT: ${custVAT}`:""}`,
                  fullAddr,
                  ``,
                  `─── LINE ITEMS ─────────────────────────`,
                  linesTxt,
                  ``,
                  `─── SUMMARY ────────────────────────────`,
                  `Products Net   ${fmt(totalNet)}`,
                  `Handling       ${fmt(totalHandling)}`,
                  shippingCost>0 ? `Freight${useEstimate?" (est.)":""}   ${fmt(shippingCost)}` : null,
                  incoterm==="DAP"&&shipEstimate.duties>0 ? `Duties (DAP, cust. responsibility)   ${fmt(shipEstimate.duties)}` : null,
                  `GRAND TOTAL    ${fmt(grandTotal)}`,
                  ``,
                  `─────────────────────────────────────────`,
                  `Incoterms: ${incoterm} · Ships from EU warehouse`,
                  `EMEA Q1-2026 pricing · Internal / Confidential`,
                  ``,
                  `Best regards,`,
                  repName||"",
                  `Markforged EMEA`,
                ].filter(l=>l!==null).join("\n");

                const subject = `Markforged Quote ${qid} — ${custName||""}`;
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(custEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(gmailUrl, "_blank");
              };

              return (
                <>
                  <button onClick={handleExportPDF} disabled={!canExport}
                    style={{width:"100%",background:canExport?"#F9E500":"#e2e6ed",border:"none",borderRadius:5,padding:"13px",color:canExport?"#1a1a1a":"#6b7280",fontSize:14,fontFamily:sans,fontWeight:700,cursor:canExport?"pointer":"not-allowed",marginTop:4}}>
                    ↓ Download Quote (.html)
                  </button>
                  <button onClick={handleGmail} disabled={!canExport}
                    style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:canExport?"#fff":"#f3f4f6",border:`2px solid ${canExport?"#4285F4":"#e2e6ed"}`,borderRadius:5,padding:"11px",color:canExport?"#4285F4":"#9ca3af",fontSize:14,fontFamily:sans,fontWeight:700,cursor:canExport?"pointer":"not-allowed",marginTop:8}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.64l8.073-6.147C21.69 2.28 24 3.434 24 5.457z" fill="#4285F4"/></svg>
                    Send via Gmail
                  </button>
                  {!hasLines && <div style={{fontSize:11,color:C.muted,textAlign:"center",marginTop:8}}>Add at least one product to export</div>}
                  {hasLines && addrMissing && <div style={{fontSize:11,color:C.red,textAlign:"center",marginTop:8,fontWeight:600}}>⚠ Fill in postal code, city & country first</div>}
                  {canExport && <div style={{fontSize:11,color:C.muted,textAlign:"center",marginTop:8,lineHeight:1.5}}>HTML → open in Chrome → Ctrl+P → Save as PDF<br/>Gmail → opens compose with pre-filled quote</div>}
                </>
              );
            })()}
          </div>
        </div>
    </div>
  );
}
