// ===== gráficos em SVG (sem dependências) =====
const C = {forest: '#163300', lime: '#9fe870', spruce: '#054d28', blue: '#0b4c72', pebble: '#868685', fog: '#e8ebe6', amber: '#c08a1e', red: '#cb272f', moss: '#5cb82e', sage: '#a9c497'};
let UID = 0;
function nice(v) {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v)), n = v / p;
  const m = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find(x => x >= n);
  return m * p;
}
function smooth(p) {
  if (p.length < 3) return 'M' + p.map(q => q.join(',')).join(' L');
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) { const [x0, y0] = p[i], [x1, y1] = p[i + 1], cx = (x0 + x1) / 2; d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`; }
  return d;
}
// séries: [{n, c, data, area, dash}]
function lineChart(labels, series, o = {}) {
  const W = 640, H = o.h || 240, pl = o.pl || 54, pr = 14, pt = 14, pb = 28, fmt = o.fmt || brlK, uid = ++UID;
  const all = series.flatMap(s => s.data);
  const mn = Math.min(...all), mx = Math.max(...all);
  let lo = o.min != null ? o.min : Math.min(0, mn); const hi = o.max != null ? o.max : nice(mx);
  if (lo < 0 && o.min == null) lo = -nice(-lo);
  const X = i => pl + (W - pl - pr) * (labels.length < 2 ? .5 : i / (labels.length - 1));
  const Y = v => pt + (H - pt - pb) * (1 - (v - lo) / (hi - lo));
  let g = '';
  for (let k = 0; k <= 4; k++) { const v = lo + (hi - lo) * k / 4, y = Y(v); g += `<line x1="${pl}" x2="${W - pr}" y1="${y}" y2="${y}" stroke="${v === 0 && lo < 0 ? '#c3c8bf' : '#eef0ec'}"/><text x="${pl - 10}" y="${y + 4}" text-anchor="end">${fmt(v)}</text>`; }
  const step = Math.ceil(labels.length / 12);
  const xl = labels.map((l, i) => i % step === 0 || i === labels.length - 1 ? `<text x="${X(i)}" y="${H - 6}" text-anchor="middle">${l}</text>` : '').join('');
  const base = Y(Math.max(lo, 0));
  const ps = series.map(s => {
    const pts = s.data.map((v, i) => [X(i), Y(v)]), d = smooth(pts);
    const area = s.area ? `<path d="${d} L${pts.at(-1)[0]},${base} L${pts[0][0]},${base}Z" fill="${s.area}" opacity=".35"/>` : '';
    const dots = labels.length <= 14 ? pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#fff" stroke="${s.c}" stroke-width="2.2"><title>${labels[i]} · ${s.n}: ${(o.tip || fmt)(s.data[i])}</title></circle>`).join('') : '';
    return `${area}<path d="${d}" fill="none" stroke="${s.c}" stroke-width="${s.w || 2.6}" ${s.dash ? 'stroke-dasharray="6 5"' : ''} stroke-linecap="round"/>${dots}`;
  }).join('');
  const ref = o.ref != null ? `<line x1="${pl}" x2="${W - pr}" y1="${Y(o.ref)}" y2="${Y(o.ref)}" stroke="${C.red}" stroke-dasharray="4 4"/><text x="${W - pr}" y="${Y(o.ref) - 6}" text-anchor="end" style="fill:${C.red}">${o.refL || ''}</text>` : '';
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" data-u="${uid}">${g}${xl}${ref}${ps}</svg>`;
}
function barChart(labels, series, o = {}) {
  const W = 640, H = o.h || 230, pl = o.pl || 42, pr = 8, pt = 12, pb = 28, fmt = o.fmt || int;
  const hi = nice(Math.max(...series.flatMap(s => s.data)));
  const gw = (W - pl - pr) / labels.length, bw = Math.min(o.bw || 18, gw * .72 / series.length);
  const Y = v => pt + (H - pt - pb) * (1 - v / hi);
  let g = '';
  for (let k = 0; k <= 4; k++) { const v = hi * k / 4, y = Y(v); g += `<line x1="${pl}" x2="${W - pr}" y1="${y}" y2="${y}" stroke="#eef0ec"/><text x="${pl - 8}" y="${y + 4}" text-anchor="end">${fmt(v)}</text>`; }
  const bars = labels.map((l, i) => {
    const x0 = pl + gw * i + (gw - bw * series.length - 3 * (series.length - 1)) / 2;
    return series.map((s, j) => { const v = s.data[i], y = Y(v), h = Math.max(1, Y(0) - y);
      return `<rect x="${x0 + j * (bw + 3)}" y="${y}" width="${bw}" height="${h}" rx="${Math.min(5, bw / 2)}" fill="${s.c}"><title>${l} · ${s.n}: ${(o.tip || fmt)(v)}</title></rect>`; }).join('') +
      `<text x="${pl + gw * i + gw / 2}" y="${H - 8}" text-anchor="middle">${l}</text>`;
  }).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}">${g}${bars}</svg>`;
}
function donut(parts, center, sub, o = {}) {
  const r = 52, Cc = 2 * Math.PI * r, T = sum(parts, p => p.v) || 1; let off = 0;
  const arcs = parts.map(p => { const len = p.v / T * Cc;
    const s = `<circle cx="70" cy="70" r="${r}" fill="none" stroke="${p.c}" stroke-width="20" stroke-dasharray="${Math.max(len - 2, 0)} ${Cc}" stroke-dashoffset="${-off}" transform="rotate(-90 70 70)"><title>${p.l}: ${Math.round(p.v / T * 100)}%</title></circle>`;
    off += len; return s; }).join('');
  return `<div class="dn-wrap"><svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="${r}" fill="none" stroke="${C.fog}" stroke-width="20"/>${arcs}
    <text x="70" y="68" text-anchor="middle" style="font:800 18px Inter,system-ui;fill:#0e0f0c;letter-spacing:-.5px">${center}</text><text x="70" y="86" text-anchor="middle" style="font:500 11px Inter,system-ui;fill:#6a6c6a">${sub}</text></svg>
    <div class="dl">${parts.map(p => `<div><i style="background:${p.c}"></i><span>${p.l}</span><b>${o.fmt ? o.fmt(p.v) : Math.round(p.v / T * 100) + '%'}</b></div>`).join('')}</div></div>`;
}
function spark(data, c) {
  const W = 80, H = 30, mx = Math.max(...data), mn = Math.min(...data);
  const pts = data.map((v, i) => [i / (data.length - 1) * W, H - 3 - (v - mn) / ((mx - mn) || 1) * (H - 6)]);
  return `<svg class="spark" viewBox="0 0 ${W} ${H}"><path d="${smooth(pts)}" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/></svg>`;
}
function hbars(items, o = {}) {
  const max = o.max || Math.max(...items.map(i => i.v)) || 1, fmt = o.fmt || int;
  return items.map(i => `<div class="hb"><span>${i.l}</span><div class="tr"><div class="fi" style="width:${Math.min(100, i.v / max * 100)}%;background:${i.c || o.c || C.forest}"></div></div><span class="num">${fmt(i.v)}</span></div>`).join('');
}
function heatmap(rows, cols, data) {
  return `<div class="heat" style="grid-template-columns:96px repeat(${cols.length},1fr)"><div></div>${cols.map(c => `<div class="hl" style="justify-content:center">${c}</div>`).join('')}
    ${rows.map((r, i) => `<div class="hl">${r}</div>${data[i].map(v => { const a = v / 100; return `<div class="hc" title="${r} · ${v}%" style="background:rgba(22,51,0,${(.08 + a * .85).toFixed(2)});color:${a > .5 ? '#9fe870' : '#163300'}">${v}%</div>`; }).join('')}`).join('')}</div>`;
}
function funnel(steps) {
  const max = steps[0].v;
  return `<div class="funnel">${steps.map((s, i) => `<div class="fr"><span>${s.l}</span><div class="fb" style="width:${Math.max(18, s.v / max * 100)}%;background:${s.c};color:${s.tc || '#fff'}">${int(s.v)}${i ? `<small>${pct(s.v / steps[i - 1].v * 100, 0)}</small>` : ''}</div></div>`).join('')}</div>`;
}
function gauge(v) {
  const L = Math.PI * 80, f = (v + 100) / 200 * L;
  return `<svg viewBox="0 0 180 110" style="width:220px;display:block;margin:0 auto"><path d="M10,95 A80,80 0 0 1 170,95" fill="none" stroke="${C.fog}" stroke-width="18" stroke-linecap="round"/>
    <path d="M10,95 A80,80 0 0 1 170,95" fill="none" stroke="${C.forest}" stroke-width="18" stroke-linecap="round" stroke-dasharray="${f} ${L}"/>
    <text x="90" y="86" text-anchor="middle" style="font:900 40px Inter,system-ui;fill:#0e0f0c;letter-spacing:-2px">${v}</text><text x="90" y="106" text-anchor="middle" style="font:600 11px Inter,system-ui;fill:#6a6c6a">NPS · zona de excelência</text></svg>`;
}
