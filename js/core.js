// ===== utilitários gerais =====
const $ = s => document.querySelector(s);
const brl = v => (v || 0).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
const brl0 = v => (v || 0).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL', maximumFractionDigits: 0});
const brlK = v => { const a = Math.abs(v), s = v < 0 ? '-' : ''; return a >= 1000 ? `${s}R$ ${(a / 1000).toLocaleString('pt-BR', {maximumFractionDigits: a >= 100000 ? 0 : 1})}k` : `${s}R$ ${Math.round(a)}`; };
const int = v => Math.round(v || 0).toLocaleString('pt-BR');
const pct = (v, d = 1) => (v || 0).toLocaleString('pt-BR', {minimumFractionDigits: d, maximumFractionDigits: d}) + '%';
const now = new Date(); now.setHours(0, 0, 0, 0);
const pad = n => String(n).padStart(2, '0');
const toIso = x => `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const D = n => { const x = new Date(now); x.setDate(x.getDate() + n); return toIso(x); };
const addD = (s, n) => { const x = parse(s); x.setDate(x.getDate() + n); return toIso(x); };
const fmtD = s => { const [y, m, d] = s.split('-'); return `${d}/${m}/${y}`; };
const fmtDM = s => { const [, m, d] = s.split('-'); return `${d}/${m}`; };
const diff = s => Math.round((parse(s) - now) / 864e5);
const rel = s => { const d = diff(s); return d === 0 ? 'hoje' : d === 1 ? 'amanhã' : d === -1 ? 'ontem' : d > 0 ? `em ${d} dias` : `há ${-d} dias`; };
const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const clock = () => { const t = new Date(); return `${pad(t.getHours())}:${pad(t.getMinutes())}`; };
const stamp = () => `${fmtDM(D(0))} ${clock()}`;
const ini = n => n.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
const hash = s => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const sum = (arr, f = x => x) => arr.reduce((a, x) => a + f(x), 0);
const dataLonga = () => now.toLocaleDateString('pt-BR', {weekday: 'long', day: 'numeric', month: 'long'});
const saud = () => { const h = new Date().getHours(); return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'; };
const meses = n => Array.from({length: n}, (_, i) => MES[new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1).getMonth()]);

// ===== ícones =====
const IC = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/>',
  crm: '<circle cx="9" cy="8" r="4"/><path d="M2 21v-1a7 7 0 0 1 14 0v1M16 4a4 4 0 0 1 0 8M22 21v-1a7 7 0 0 0-4-6.3"/>',
  orcamentos: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  os: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
  agenda: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  estoque: '<path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8"/>',
  financeiro: '<path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  marketing: '<path d="M3 11v2a1 1 0 0 0 1 1h3l6 5V5L7 10H4a1 1 0 0 0-1 1zM17 8a5 5 0 0 1 0 8M20 5a9 9 0 0 1 0 14"/>',
  config: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chev: '<path d="m9 18 6-6-6-6"/>', chevl: '<path d="m15 18-6-6 6-6"/>', chevd: '<path d="m6 9 6 6 6-6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
  check: '<path d="M20 6 9 17l-5-5"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
  msg: '<path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.7A8.4 8.4 0 1 1 21 11.5z"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  car: '<path d="M5 17h14M3 13l2-6a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 7l2 6v4a1 1 0 0 1-1 1h-1M3 13v4a1 1 0 0 0 1 1h1M3 13h18"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/>',
  print: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',
  truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  kanban: '<rect x="3" y="3" width="5" height="18" rx="1.5"/><rect x="10" y="3" width="5" height="12" rx="1.5"/><rect x="17" y="3" width="4" height="8" rx="1.5"/>',
  trend: '<path d="m23 6-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
  file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  box: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M3 7l3-4h12l3 4M10 11h4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  bank: '<path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
  refresh: '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
  filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
  scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10"/>',
};
const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || IC.dashboard}</svg>`;
const LOGO = `<svg class="logo" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="#163300"/><circle cx="20" cy="20" r="11.5" fill="none" stroke="#9fe870" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="58 14.3" transform="rotate(-40 20 20)"/><path d="M19.4 7.7 14.2 6.4 16.6 12.4z" fill="#9fe870"/><path d="M25 20l-2.5 4.33h-5L15 20l2.5-4.33h5z" fill="#fff"/><circle cx="20" cy="20" r="1.9" fill="#163300"/></svg>`;
const LOGO_INV = LOGO.replace('fill="#163300"/>', 'fill="#9fe870"/>').replace('stroke="#9fe870"', 'stroke="#163300"').replace('fill="#9fe870"/><path d="M25', 'fill="#163300"/><path d="M25').replace('fill="#fff"', 'fill="#163300"').replace('r="1.9" fill="#163300"', 'r="1.9" fill="#9fe870"');

// ===== componentes de UI =====
const AVC = ['#163300', '#054d28', '#0b4c72', '#6a6c6a', '#8a5a00', '#3d6b1f'];
const av = (n, cls = '') => { const c = AVC[hash(n) % AVC.length]; return `<span class="av ${cls}" style="background:${c}1c;color:${c}">${ini(n)}</span>`; };
const plate = p => `<span class="plate">${esc(p)}</span>`;
function badge(s, map) {
  const m = map || {
    'Pago': 'ok', 'Aprovado': 'ok', 'Entregue': 'ok', 'Pronto': 'ok', 'Ativa': 'ok', 'Recebido': 'ok', 'Confirmado': 'ok', 'Conectado': 'ok', 'OK': 'ok', 'Ativo': 'ok',
    'VIP': 'dark', 'Enviado': 'info', 'Em execução': 'info', 'Diagnóstico': 'info', 'Agendada': 'info', 'Novo': 'info', 'Enviando': 'info', 'Em trânsito': 'info',
    'Pendente': 'warn', 'Aguardando peça': 'warn', 'Repor': 'warn', 'Aguardando confirmação': 'warn', 'Excesso': 'warn', 'Configurar': 'warn', 'Recebido parcial': 'warn',
    'Recusado': 'bad', 'Em risco': 'bad', 'Vencido': 'bad', 'Ruptura': 'bad', 'Atrasada': 'bad', 'Cancelado': 'bad',
  };
  return `<span class="b ${m[s] || ''}">${esc(s)}</span>`;
}
function head(title, sub, actions = '', tabsOf = null) {
  const n = tabsOf && NAV.find(x => x.id === tabsOf);
  const tabs = n && n.subs ? `<div class="subtabs">${n.subs.map(([k, l]) => { const c = SUBCOUNT[`${tabsOf}.${k}`]; const cv = c ? c() : null;
    return `<button class="${S.sub === k ? 'on' : ''}" onclick="go('${tabsOf}','${k}')">${l}${cv ? `<span class="cnt">${cv}</span>` : ''}</button>`; }).join('')}</div>` : '';
  return `<div class="ph"><div><h1>${title}</h1><p>${sub}</p></div><div class="ph-act">${actions}</div></div>${tabs}`;
}
const SUBCOUNT = {};
function kpi(label, value, o = {}) {
  return `<div class="card kpi ${o.hl ? 'hl' : ''}"><div class="kh"><span class="kic ${o.c || ''}">${ic(o.icon || 'trend')}</span>${label}</div>
    <div class="vrow"><div class="v">${value}</div>${o.spark ? spark(o.spark, o.hl ? '#9fe870' : '#163300') : ''}</div><div class="kf">${o.delta != null ? `<span class="delta ${o.delta >= 0 ? 'up' : 'dn'}">${o.delta >= 0 ? '▲' : '▼'} ${pct(Math.abs(o.delta))}</span>` : ''}<span>${o.sub || ''}</span></div></div>`;
}
const chips = (opts, cur, fn) => `<div class="chips">${opts.map(([k, l, n]) => `<button class="chip ${cur === k ? 'on' : ''}" onclick="${fn}('${k}')">${l}${n != null ? `<span class="cnt">${n}</span>` : ''}</button>`).join('')}</div>`;
const stepper = (steps, cur) => `<div class="stepper">${steps.map((s, i) => `<div class="st ${i < cur ? 'done' : i === cur ? 'on' : ''}"><span class="n">${i < cur ? '✓' : i + 1}</span><span>${s}</span></div>`).join('')}</div>`;
const sw = (on, fn) => `<label class="sw"><input type="checkbox" ${on ? 'checked' : ''} onchange="${fn}"><span></span></label>`;

function toast(html, type = 'ok') {
  const t = document.createElement('div'); t.className = 'toast ' + type;
  t.innerHTML = `<span class="ico">${ic(type === 'warn' ? 'alert' : 'check')}</span><div>${html}</div>`;
  $('#toasts').appendChild(t); setTimeout(() => t.remove(), 4600);
}
function openModal(html, cls = '') { $('#mbox').className = 'mbox ' + cls; $('#mbox').innerHTML = html; $('#modal').classList.remove('hidden'); }
function closeModal() { $('#modal').classList.add('hidden'); }
const mHead = (t, p) => `<div class="mh"><div><h3>${t}</h3>${p ? `<p>${p}</p>` : ''}</div><button class="iconbtn" onclick="closeModal()" aria-label="Fechar">${ic('x')}</button></div>`;

// máscaras de formulário
function mTel(el) { const v = el.value.replace(/\D/g, '').slice(0, 11); let o = v; if (v.length > 2) o = `(${v.slice(0, 2)}) ${v.slice(2)}`; if (v.length > 7) o = `(${v.slice(0, 2)}) ${v.slice(2, v.length > 10 ? 7 : 6)}-${v.slice(v.length > 10 ? 7 : 6)}`; el.value = o; }
function mDoc(el) { const v = el.value.replace(/\D/g, '').slice(0, 14);
  el.value = v.length <= 11 ? v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    : v.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2'); }
function mPlaca(el) { el.value = el.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7); }
function fieldErr(id, on) { const f = document.getElementById(id); if (f) f.closest('.fld').classList.toggle('err', on); return on; }
