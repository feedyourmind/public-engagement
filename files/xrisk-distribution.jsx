import { useState, useMemo, useCallback, useRef } from "react";

function erf(x) {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const t = 1.0 / (1.0 + p * Math.abs(x));
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

function normalPDF(x) { return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI); }
function normalCDF(x) { return 0.5 * (1 + erf(x / Math.sqrt(2))); }
function skewNormalPDF(x, loc, sc, sh) {
  const z = (x - loc) / sc;
  return (2 / sc) * normalPDF(z) * normalCDF(sh * z);
}

const SEGMENTS = [
  { id: "dismissive", label: "Dismissive", description: "AI risk is essentially zero — technology is neutral or inherently beneficial.", color: "#2d6a4f", colorLight: "rgba(45,106,79,0.25)" },
  { id: "unconcerned", label: "Unconcerned", description: "Risks exist but are manageable through existing institutions and market forces.", color: "#52b788", colorLight: "rgba(82,183,136,0.25)" },
  { id: "cautious", label: "Cautiously Optimistic", description: "Real risks need attention, but careful governance can keep things on track.", color: "#f4a261", colorLight: "rgba(244,162,97,0.25)" },
  { id: "concerned-current", label: "Concerned (Current)", description: "Worried about risks already materializing — surveillance, job displacement, algorithmic bias, misinformation.", color: "#e07a5f", colorLight: "rgba(224,122,95,0.25)" },
  { id: "concerned-future", label: "Concerned (Future)", description: "Worried about emerging and escalating threats — bioterrorism, dystopian control, power oligarchy, automated warfare.", color: "#c1440e", colorLight: "rgba(193,68,14,0.25)" },
  { id: "alarmed", label: "Alarmed / Doomer", description: "AI poses a genuine existential threat — current trajectory leads to catastrophe or human extinction.", color: "#9b2226", colorLight: "rgba(155,34,38,0.25)" },
];

function genCurve(loc, sc, sh, xMin, xMax, steps = 600) {
  const data = [], dx = (xMax - xMin) / steps;
  for (let i = 0; i <= steps; i++) { const x = xMin + i * dx; data.push({ x, y: skewNormalPDF(x, loc, sc, sh) }); }
  return data;
}

function integrate(data, a, b) {
  let s = 0;
  for (let i = 1; i < data.length; i++) {
    const x0 = data[i-1].x, y0 = data[i-1].y, x1 = data[i].x, y1 = data[i].y;
    if (x1 < a || x0 > b) continue;
    const ca = Math.max(x0, a), cb = Math.min(x1, b);
    if (cb <= ca) continue;
    const ta = (ca - x0)/(x1 - x0), tb = (cb - x0)/(x1 - x0);
    s += 0.5 * (y0 + ta*(y1-y0) + y0 + tb*(y1-y0)) * (cb - ca);
  }
  return s;
}

function Chart({ curveData, segments, boundaries, xMin, xMax, yMax, onDrag, hovered, setHovered }) {
  const ref = useRef(null);
  const W = 900, H = 380;
  const pad = { top: 30, right: 30, bottom: 50, left: 20 };
  const cw = W - pad.left - pad.right, ch = H - pad.top - pad.bottom;
  const sx = useCallback((x) => pad.left + ((x - xMin)/(xMax - xMin))*cw, [xMin, xMax, cw]);
  const sy = useCallback((y) => pad.top + ch - (y/yMax)*ch, [yMax, ch]);

  const curvePath = useMemo(() => curveData.map((p,i) => `${i===0?"M":"L"}${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`).join(" "), [curveData, sx, sy]);

  const fills = useMemo(() => {
    const all = [xMin, ...boundaries, xMax];
    return segments.map((seg, i) => {
      const s = all[i], e = all[i+1];
      const pts = curveData.filter(p => p.x >= s && p.x <= e);
      if (pts.length < 2) return null;
      const path = `M${sx(pts[0].x).toFixed(2)},${sy(0)} ` + pts.map(p => `L${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`).join(" ") + ` L${sx(pts[pts.length-1].x).toFixed(2)},${sy(0)} Z`;
      return { ...seg, path, s, e, idx: i };
    });
  }, [segments, boundaries, curveData, sx, sy, xMin, xMax]);

  const [drag, setDrag] = useState(null);
  const onDown = (i) => (ev) => { ev.preventDefault(); setDrag(i); };
  const onMove = useCallback((ev) => {
    if (drag === null || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const mx = (ev.clientX - r.left) * (W / r.width);
    onDrag(drag, xMin + ((mx - pad.left)/cw)*(xMax - xMin));
  }, [drag, xMin, xMax, cw, onDrag]);
  const onUp = useCallback(() => setDrag(null), []);

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}
      onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>
      {fills.map(f => f && (
        <path key={f.id} d={f.path} fill={hovered === f.id ? f.color : f.colorLight} stroke="none"
          style={{ transition: "fill 0.25s", cursor: "pointer" }}
          onMouseEnter={() => setHovered(f.id)} onMouseLeave={() => setHovered(null)}
          opacity={hovered && hovered !== f.id ? 0.35 : 1} />
      ))}
      <path d={curvePath} fill="none" stroke="#1a1a2e" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1={sx(xMin)} y1={sy(0)} x2={sx(xMax)} y2={sy(0)} stroke="#555" strokeWidth="1" />
      <text x={sx(xMin)+10} y={sy(0)+38} textAnchor="start" fill="#888" fontSize="11" fontFamily="'DM Sans',sans-serif">Zero Risk</text>
      <text x={sx(xMax)-10} y={sy(0)+38} textAnchor="end" fill="#888" fontSize="11" fontFamily="'DM Sans',sans-serif">Existential Risk</text>
      <text x={sx((xMin+xMax)/2)} y={sy(0)+38} textAnchor="middle" fill="#aaa" fontSize="10" fontFamily="'DM Sans',sans-serif">Perceived Level of AI Risk →</text>
      {boundaries.map((bx, i) => {
        const px = sx(bx);
        return (
          <g key={i} style={{ cursor: "ew-resize" }} onMouseDown={onDown(i)}>
            <line x1={px} y1={pad.top} x2={px} y2={sy(0)} stroke="#1a1a2e" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.5" />
            <circle cx={px} cy={sy(0)} r="6" fill="#1a1a2e" stroke="#fff" strokeWidth="2" opacity="0.9" />
          </g>
        );
      })}
      {fills.map(f => {
        if (!f) return null;
        const midX = (f.s + f.e) / 2;
        const midPt = curveData.reduce((b, p) => Math.abs(p.x - midX) < Math.abs(b.x - midX) ? p : b, curveData[0]);
        const wide = (f.e - f.s) > 0.6;
        return (
          <text key={f.id+"_l"} x={sx(midX)} y={Math.min(sy(midPt.y * 0.45), sy(0) - 14)}
            textAnchor="middle" fill={f.color} fontSize={wide ? "9" : "8"} fontWeight="700" fontFamily="'DM Sans',sans-serif"
            opacity={hovered && hovered !== f.id ? 0.25 : 0.85}
            style={{ transition: "opacity 0.25s", pointerEvents: "none", textTransform: "uppercase", letterSpacing: "0.4px" }}>
            {f.label}
          </text>
        );
      })}
    </svg>
  );
}

function ParamSlider({ label, value, min, max, step, onChange, color = "#f4a261" }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#999", fontFamily: "'DM Sans',sans-serif" }}>{label}</span>
        <span style={{ fontSize: 12, color: "#ccc", fontFamily: "'DM Mono',monospace" }}>{value.toFixed(2)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))} style={{ width: "100%", accentColor: color }} />
    </div>
  );
}

function BoundarySlider({ index, value, min, max, step, onChange, left, right, leftPct, rightPct }) {
  return (
    <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 9, height: 9, borderRadius: 2, background: left.color }} />
          <span style={{ fontSize: 11, color: left.color, fontWeight: 600 }}>{left.label}</span>
          <span style={{ fontSize: 10, color: "#555" }}>←</span>
          <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "#777" }}>B{index + 1}</span>
          <span style={{ fontSize: 10, color: "#555" }}>→</span>
          <span style={{ fontSize: 11, color: right.color, fontWeight: 600 }}>{right.label}</span>
          <div style={{ width: 9, height: 9, borderRadius: 2, background: right.color }} />
        </div>
        <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "#aaa" }}>{value.toFixed(2)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#777" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", color: left.color }}>{leftPct.toFixed(1)}%</span>
        <span style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", color: right.color }}>{rightPct.toFixed(1)}%</span>
      </div>
    </div>
  );
}

function Panel({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, marginBottom: 16, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", background: "none", border: "none", cursor: "pointer", color: "#999" }}>
        <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 500, fontFamily: "'DM Sans',sans-serif" }}>{title}</span>
        <span style={{ fontSize: 18, color: "#666", transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▾</span>
      </button>
      {open && <div style={{ padding: "0 20px 20px" }}>{children}</div>}
    </div>
  );
}

export default function XRiskDistribution() {
  const [loc, setLoc] = useState(0.3);
  const [sc, setSc] = useState(0.66);
  const [sh, setSh] = useState(5.5);
  const xMin = -1.5, xMax = 5;
  // 5 boundaries for 6 segments
  const [bounds, setBounds] = useState([0.0, 0.6, 1.4, 1.95, 2.5]);
  const segs = SEGMENTS;

  const curve = useMemo(() => genCurve(loc, sc, sh, xMin, xMax, 600), [loc, sc, sh]);
  const yMax = useMemo(() => Math.max(...curve.map(p => p.y)) * 1.15, [curve]);
  const total = useMemo(() => integrate(curve, xMin, xMax), [curve]);
  const areas = useMemo(() => {
    const all = [xMin, ...bounds, xMax];
    return segs.map((_, i) => { const a = integrate(curve, all[i], all[i+1]); return total > 0 ? (a/total)*100 : 0; });
  }, [curve, bounds, total]);

  const handleBound = useCallback((idx, val) => {
    setBounds(prev => {
      const n = [...prev];
      const lo = idx === 0 ? xMin + 0.05 : prev[idx-1] + 0.05;
      const hi = idx === prev.length - 1 ? xMax - 0.05 : prev[idx+1] - 0.05;
      n[idx] = Math.min(Math.max(val, lo), hi);
      return n;
    });
  }, [xMin, xMax]);

  const [hov, setHov] = useState(null);

  const presets = [
    { label: "Default", loc: 0.3, sc: 0.66, sh: 5.5, b: [0.0, 0.6, 1.4, 1.95, 2.5] },
    { label: "More Concerned", loc: 1.2, sc: 0.9, sh: 1.5, b: [-0.2, 0.5, 1.2, 1.8, 2.8] },
    { label: "Polarized", loc: 0.5, sc: 1.4, sh: 0.0, b: [-0.6, 0.2, 0.8, 1.4, 2.0] },
    { label: "Tech Optimists", loc: -0.2, sc: 0.5, sh: 8.0, b: [-0.3, 0.3, 0.9, 1.4, 2.0] },
  ];
  const apply = (p) => { setLoc(p.loc); setSc(p.sc); setSh(p.sh); setBounds([...p.b]); };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", color: "#e0e0e0", fontFamily: "'DM Sans',sans-serif", padding: "40px 20px", display: "flex", justifyContent: "center" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 980, width: "100%" }}>

        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 800, color: "#f0ece2", marginBottom: 8, lineHeight: 1.15, letterSpacing: "-0.5px" }}>
            The AI X-Risk Spectrum
          </h1>
          <p style={{ fontSize: 15, color: "#888", lineHeight: 1.6, maxWidth: 640 }}>
            A qualitative view of how people perceive the risks posed by artificial intelligence —
            from full dismissal to existential alarm. Adjust boundaries and curve shape to match your intuition.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {presets.map(p => (
            <button key={p.label} onClick={() => apply(p)}
              style={{ padding: "7px 16px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "#ccc", fontSize: 12, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "#fff"; }}
              onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.04)"; e.target.style.color = "#ccc"; }}>
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ background: "#f7f5ef", borderRadius: 12, padding: "24px 16px 12px", marginBottom: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.35)" }}>
          <Chart curveData={curve} segments={segs} boundaries={bounds} xMin={xMin} xMax={xMax} yMax={yMax}
            onDrag={handleBound} hovered={hov} setHovered={setHov} />
        </div>

        {/* 6-segment legend: 3x2 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
          {segs.map((seg, i) => (
            <div key={seg.id} onMouseEnter={() => setHov(seg.id)} onMouseLeave={() => setHov(null)}
              style={{ background: hov === seg.id ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${hov === seg.id ? seg.color : "rgba(255,255,255,0.06)"}`, borderRadius: 10, padding: "16px 14px", cursor: "pointer", transition: "all 0.25s", opacity: hov && hov !== seg.id ? 0.4 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: seg.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>{seg.label}</span>
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 26, fontWeight: 500, color: "#f0ece2", marginBottom: 6 }}>
                {areas[i].toFixed(1)}%
              </div>
              <p style={{ fontSize: 11, color: "#777", lineHeight: 1.45, margin: 0 }}>{seg.description}</p>
            </div>
          ))}
        </div>

        <Panel title="Segment Boundaries" defaultOpen={true}>
          <p style={{ fontSize: 12, color: "#666", marginBottom: 14, marginTop: 0 }}>
            Move each boundary to resize adjacent segments. Slide right to shrink the left segment and grow the right.
          </p>
          {bounds.map((b, i) => (
            <BoundarySlider key={i} index={i} value={b}
              min={i === 0 ? xMin + 0.05 : bounds[i-1] + 0.05}
              max={i === bounds.length - 1 ? xMax - 0.05 : bounds[i+1] - 0.05}
              step={0.02} onChange={v => handleBound(i, v)}
              left={segs[i]} right={segs[i+1]} leftPct={areas[i]} rightPct={areas[i+1]} />
          ))}
        </Panel>

        <Panel title="Curve Shape" defaultOpen={false}>
          <p style={{ fontSize: 12, color: "#666", marginBottom: 14, marginTop: 0 }}>Adjust the overall distribution shape.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            <ParamSlider label="Location (peak shift)" value={loc} min={-2} max={3} step={0.05} onChange={setLoc} />
            <ParamSlider label="Scale (spread)" value={sc} min={0.2} max={2.5} step={0.02} onChange={setSc} />
            <ParamSlider label="Shape (skewness)" value={sh} min={-10} max={10} step={0.1} onChange={setSh} />
          </div>
        </Panel>

        <p style={{ fontSize: 11, color: "#555", marginTop: 20, textAlign: "center", fontStyle: "italic" }}>
          This is a qualitative, perception-based visualization — not derived from empirical survey data.
        </p>
      </div>
    </div>
  );
}
