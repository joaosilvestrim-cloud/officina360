// ===== navegação, menus, busca global, drawer, login e seleção de módulos =====
const NAV = [
  {grp: 'Visão geral'},
  {id: 'dashboard', label: 'Dashboards', icon: 'dashboard', subs: [['geral', 'Visão geral'], ['operacional', 'Operacional'], ['financeiro', 'Financeiro'], ['comercial', 'Comercial']]},
  {grp: 'Relacionamento'},
  {id: 'crm', label: 'CRM', icon: 'crm', subs: [['clientes', 'Clientes'], ['funil', 'Funil de vendas'], ['veiculos', 'Veículos']]},
  {id: 'marketing', label: 'Marketing', icon: 'marketing', subs: [['campanhas', 'Campanhas'], ['automacoes', 'Automações'], ['nps', 'Satisfação (NPS)']]},
  {grp: 'Operação'},
  {id: 'orcamentos', label: 'Orçamentos', icon: 'orcamentos'},
  {id: 'os', label: 'Ordens de serviço', icon: 'os'},
  {id: 'agenda', label: 'Agenda', icon: 'agenda', subs: [['dia', 'Dia por box'], ['semana', 'Semana']]},
  {id: 'estoque', label: 'Estoque', icon: 'estoque', subs: [['pecas', 'Peças'], ['analise', 'Análise e compras'], ['movimentos', 'Movimentações'], ['compras', 'Pedidos de compra'], ['inventario', 'Inventário']]},
  {grp: 'Gestão'},
  {id: 'financeiro', label: 'Financeiro', icon: 'financeiro', subs: [['contas', 'Contas a pagar e receber'], ['fluxo', 'Fluxo de caixa'], ['dre', 'DRE']]},
  {id: 'config', label: 'Configurações', icon: 'config', subs: [['empresa', 'Empresa'], ['usuarios', 'Usuários e permissões'], ['servicos', 'Serviços e preços'], ['integracoes', 'Integrações']]},
];
const VIEWS = {};
const navBadges = () => ({orcamentos: S.orcamentos.filter(o => o.status === 'Enviado').length, os: osAbertas().length, estoque: baixo().length});
const groupOf = id => { let g = ''; for (const n of NAV) { if (n.grp) g = n.grp; if (n.id === id) return g; } return ''; };

function go(v, sub) {
  const n = NAV.find(x => x.id === v);
  S.view = v; S.sub = sub || (n.subs ? n.subs[0][0] : null); S.screen = 'app';
  closeDD(); toggleNav(false);
  const h = `#/${v}${S.sub ? '/' + S.sub : ''}`;
  if (location.hash !== h) history.pushState(null, '', h);
  render(); window.scrollTo(0, 0);
}
function enter(v, sub) { go(v, sub); }
function toHub() { S.screen = 'hub'; closeDrawer(); if (location.hash !== '#/modulos') history.pushState(null, '', '#/modulos'); render(); window.scrollTo(0, 0); }
function toggleNav(on) { $('#app').classList.toggle('navopen', on ?? !$('#app').classList.contains('navopen')); }
function fromHash() {
  const [v, sub] = location.hash.replace(/^#\/?/, '').split('/');
  if (v === 'modulos') { S.screen = 'hub'; return; }
  const n = NAV.find(x => x.id === v);
  if (n) { S.screen = 'app'; S.view = v; S.sub = n.subs ? (n.subs.find(s => s[0] === sub) ? sub : n.subs[0][0]) : null; }
}

function render() {
  ['login', 'hub', 'app'].forEach(k => $('#' + k).classList.toggle('hidden', S.screen !== k));
  if (S.screen === 'login') { $('#login').innerHTML = vLogin(); return; }
  if (S.screen === 'hub') { $('#hub').innerHTML = vHub(); return; }
  renderNav(); renderTop();
  $('#view').innerHTML = VIEWS[S.view]();
  if (S.dr) renderDrawer();
}
function renderNav() {
  const b = navBadges();
  $('#nav').innerHTML = NAV.map(n => {
    if (n.grp) return `<div class="grp">${n.grp}</div>`;
    const on = S.view === n.id;
    const bd = b[n.id] ? `<span class="nb ${n.id === 'estoque' ? 'red' : ''}">${b[n.id]}</span>` : '';
    return `<button class="ni ${on ? 'on' : ''}" onclick="go('${n.id}')">${ic(n.icon)}<span>${n.label}</span>${bd}${n.subs ? ic('chevd', 'chev' + (on ? ' open' : '')) : ''}</button>` +
      (on && n.subs ? `<div class="subs">${n.subs.map(([k, l]) => `<button class="${S.sub === k ? 'on' : ''}" onclick="go('${n.id}','${k}')">${l}</button>`).join('')}</div>` : '');
  }).join('');
}
function renderTop() {
  const n = NAV.find(x => x.id === S.view), sb = n.subs && n.subs.find(s => s[0] === S.sub);
  $('#crumbs').innerHTML = `<span>${groupOf(S.view)}</span>${ic('chev')}<b>${n.label}</b>${sb ? ic('chev') + `<span>${sb[1]}</span>` : ''}`;
  const u = S.notifs.filter(x => !x.read).length;
  $('#bellBtn').innerHTML = ic('bell') + (u ? `<span class="dot">${u}</span>` : '');
}
function initChrome() {
  $('#brandLogo').innerHTML = LOGO;
  $('#mMenu').innerHTML = ic('menu');
  $('#hubBtn').innerHTML = ic('grid');
  $('#searchBtn').innerHTML = `${ic('search')}<span>Buscar cliente, placa, OS, peça…</span><kbd>Ctrl K</kbd>`;
  $('#novoBtn').innerHTML = `${ic('plus')}<span>Novo</span>`;
  $('#userBtn').innerHTML = `<span class="av lime">AR</span><div><b>Arthur</b><small>Administrador</small></div>${ic('chevd', 'chev')}`;
  $('#palHead').insertAdjacentHTML('afterbegin', ic('search'));
}

// ===== dropdowns =====
const ACOES = [
  {t: 'Novo orçamento', s: 'Monte e envie com link de aprovação', ic: 'orcamentos', run: () => { go('orcamentos'); wzOpen('orc'); }},
  {t: 'Nova ordem de serviço', s: 'Abrir OS direto, sem orçamento', ic: 'os', run: () => { go('os'); wzOpen('os'); }},
  {t: 'Novo agendamento', s: 'Reservar box e horário', ic: 'agenda', run: () => { go('agenda'); novoAg(); }},
  {t: 'Novo cliente', s: 'Cadastro com consulta de placa', ic: 'user', run: () => { go('crm', 'clientes'); novoCliente(); }},
  {t: 'Novo lead', s: 'Oportunidade no funil de vendas', ic: 'crm', run: () => { go('crm', 'funil'); novoLead(); }},
  {t: 'Lançamento financeiro', s: 'Conta a pagar ou a receber', ic: 'financeiro', run: () => { go('financeiro', 'contas'); novoLanc(); }},
  {t: 'Nova campanha', s: 'Disparo segmentado por SMS e e-mail', ic: 'marketing', run: () => { go('marketing', 'campanhas'); cpOpen(); }},
  {t: 'Importar NF-e de peças', s: 'Entrada de estoque pelo XML', ic: 'upload', run: () => { go('estoque', 'pecas'); xmlOpen(); }},
];
const DD = {
  novo: () => `<div class="ddh">Criar</div>${ACOES.slice(0, 7).map((a, i) => `<button class="ddi" onclick="closeDD();ACOES[${i}].run()"><span class="ico">${ic(a.ic)}</span><div><b>${a.t}</b><small>${a.s}</small></div></button>`).join('')}`,
  notif: () => `<div class="ddh">Notificações <button class="lnk sm" onclick="S.notifs.forEach(n=>n.read=true);renderTop();toggleDD('notif')">Marcar todas como lidas</button></div>
    ${S.notifs.slice(0, 8).map((n, i) => `<div class="nt ${n.read ? '' : 'unread'}" onclick="abrirNotif(${i})"><span class="ico kic ${n.c}">${ic(n.ic)}</span><div><p>${n.txt}</p><small>${n.at}</small></div></div>`).join('')}`,
  user: () => `<div class="ddi" style="cursor:default"><span class="av lime">AR</span><div><b>Arthur</b><small>arthur@oficinadoarthur.com.br</small></div></div><div class="ddsep"></div>
    <button class="ddi" onclick="closeDD();toast('Perfil: nome, foto, senha e preferências de notificação.')"><span class="ico">${ic('user')}</span><div><b>Meu perfil</b></div></button>
    <button class="ddi" onclick="go('config')"><span class="ico">${ic('config')}</span><div><b>Configurações</b></div></button>
    <button class="ddi" onclick="closeDD();toHub()"><span class="ico">${ic('grid')}</span><div><b>Trocar de módulo</b></div></button>
    <div class="ddsep"></div><button class="ddi" onclick="closeDD();logout()"><span class="ico">${ic('logout')}</span><div><b>Sair</b></div></button>`,
};
function toggleDD(k) { const el = $('#dd-' + k), open = !el.classList.contains('open'); closeDD(); if (open) { el.innerHTML = DD[k](); el.classList.add('open'); } }
function closeDD() { document.querySelectorAll('.dd.open').forEach(e => e.classList.remove('open')); }
function abrirNotif(i) { const n = S.notifs[i]; n.read = true; closeDD(); go(...n.go); if (n.dr) openDr(...n.dr); }
function pushNotif(ic_, c, txt, goTo, dr) { S.notifs.unshift({ic: ic_, c, txt, at: 'agora', go: goTo, dr, read: false}); if (S.screen === 'app') renderTop(); }
document.addEventListener('mousedown', e => { if (!e.target.closest('.ddwrap')) closeDD(); });

// ===== busca global (Ctrl+K) =====
const PAL = {q: '', i: 0, res: []};
function openPalette() { $('#palette').classList.remove('hidden'); $('#palIn').value = ''; PAL.q = ''; PAL.i = 0; palRender(); setTimeout(() => $('#palIn').focus(), 20); }
function closePalette() { $('#palette').classList.add('hidden'); }
function palItems() {
  const a = [];
  ACOES.forEach(x => a.push({g: 'Ações', ic: x.ic, t: x.t, s: x.s, run: x.run}));
  NAV.filter(n => n.id).forEach(n => { a.push({g: 'Ir para', ic: n.icon, t: n.label, run: () => go(n.id)}); (n.subs || []).forEach(s => a.push({g: 'Ir para', ic: n.icon, t: `${n.label} › ${s[1]}`, run: () => go(n.id, s[0])})); });
  S.clientes.forEach(c => a.push({g: 'Clientes', ic: 'user', t: c.nome, s: `${c.tel} · ${c.veiculos.map(v => v.placa + ' ' + v.modelo).join(' | ')}`, run: () => { go('crm', 'clientes'); openDr('cli', c.id); }}));
  S.os.forEach(o => a.push({g: 'Ordens de serviço', ic: 'os', t: `OS ${o.id} · ${o.placa}`, s: `${cli(o.cliente).nome} · ${o.status}`, run: () => { go('os'); openDr('os', o.id); }}));
  S.orcamentos.forEach(o => a.push({g: 'Orçamentos', ic: 'orcamentos', t: `Orçamento ${o.id} · ${o.placa}`, s: `${cli(o.cliente).nome} · ${o.status} · ${brl(orcTot(o))}`, run: () => { go('orcamentos'); openDr('orc', o.id); }}));
  S.estoque.forEach(p => a.push({g: 'Peças', ic: 'estoque', t: p.nome, s: `${p.cod} · local ${p.local} · saldo ${p.qtd}`, run: () => { go('estoque', 'pecas'); openDr('peca', p.cod); }}));
  return a;
}
function palRender() {
  const q = norm(PAL.q.trim());
  let r = palItems();
  r = q ? r.filter(x => norm(x.t + ' ' + (x.s || '')).includes(q)).slice(0, 40) : r.filter(x => x.g === 'Ações').concat(r.filter(x => x.g === 'Ir para' && !x.t.includes('›')));
  PAL.res = r; PAL.i = Math.max(0, Math.min(PAL.i, r.length - 1));
  let g = '';
  $('#palRes').innerHTML = r.map((x, i) => (x.g !== g ? `<div class="pgh">${g = x.g}</div>` : '') +
    `<div class="pr ${i === PAL.i ? 'on' : ''}" data-i="${i}" onmousemove="palHL(${i})" onclick="palRun(${i})"><span class="ico">${ic(x.ic)}</span><div><b>${esc(x.t)}</b>${x.s ? `<small>${esc(x.s)}</small>` : ''}</div><span class="k">${i === PAL.i ? '↵' : ''}</span></div>`).join('') || '<div class="empty">Nada encontrado para essa busca.</div>';
}
function palHL(i) { if (PAL.i === i) return; PAL.i = i; document.querySelectorAll('.pr').forEach(e => { const on = +e.dataset.i === i; e.classList.toggle('on', on); e.querySelector('.k').textContent = on ? '↵' : ''; }); }
function palRun(i) { const x = PAL.res[i]; closePalette(); if (x) x.run(); }
function palKey(e) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); palHL(Math.max(0, Math.min(PAL.res.length - 1, PAL.i + (e.key === 'ArrowDown' ? 1 : -1)))); document.querySelector('.pr.on')?.scrollIntoView({block: 'nearest'}); }
  if (e.key === 'Enter') palRun(PAL.i);
  if (e.key === 'Escape') closePalette();
}
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && S.screen !== 'login') { e.preventDefault(); openPalette(); }
  if (e.key === 'Escape') { if (!$('#palette').classList.contains('hidden')) closePalette(); else if (!$('#modal').classList.contains('hidden')) closeModal(); else if (S.dr) closeDrawer(); }
});
window.addEventListener('popstate', () => { fromHash(); closeDrawer(); render(); });

// ===== drawer (painel lateral de detalhes) =====
const DRT = {
  cli: [['resumo', 'Resumo'], ['veiculos', 'Veículos'], ['historico', 'Histórico'], ['comunicacao', 'Comunicação']],
  os: [['resumo', 'Resumo'], ['checklist', 'Checklist'], ['fotos', 'Fotos'], ['historico', 'Histórico']],
  orc: [['itens', 'Itens'], ['historico', 'Histórico']],
  lead: [['info', 'Detalhes']], ag: [['info', 'Detalhes']],
  peca: [['resumo', 'Resumo'], ['movs', 'Movimentações']],
};
const DR = {};
function openDr(t, id, tab) { S.dr = {t, id, tab: tab || DRT[t][0][0]}; $('#drawerWrap').classList.add('open'); renderDrawer(); $('#drawer .db') && ($('#drawer .db').scrollTop = 0); }
function closeDrawer() { S.dr = null; $('#drawerWrap').classList.remove('open'); }
function drTab(k) { S.dr.tab = k; renderDrawer(); }
function renderDrawer() {
  if (!S.dr) return;
  const r = DR[S.dr.t](), tabs = DRT[S.dr.t];
  if (!r) return closeDrawer();
  $('#drawer').innerHTML = `<div class="dh"><div style="display:flex;gap:14px;align-items:center;min-width:0">${r.av || ''}<div style="min-width:0"><h2>${r.h}</h2><p>${r.sub}</p></div></div><button class="iconbtn" onclick="closeDrawer()" aria-label="Fechar">${ic('x')}</button></div>${r.pre || ''}
    ${tabs.length > 1 ? `<div class="dtabs">${tabs.map(([k, l]) => `<button class="${S.dr.tab === k ? 'on' : ''}" onclick="drTab('${k}')">${l}</button>`).join('')}</div>` : '<div style="height:16px;border-bottom:1px solid var(--line)"></div>'}
    <div class="db">${r.body}</div>${r.foot ? `<div class="df">${r.foot}</div>` : ''}`;
}

// ===== login =====
function vLogin() {
  return `<div class="login"><div class="lside"><div class="lring"></div><div class="brand">${LOGO}<div class="wm"><b>Oficina<span>360</span></b><small>Gestão integrada para oficinas</small></div></div>
    <h2>A oficina inteira em um só lugar.</h2><p>CRM, orçamentos, ordens de serviço, agenda, estoque, financeiro e marketing conectados, com dashboards em tempo real.</p>
    <div class="lfeat"><span>Aprovação de orçamento por link</span><span>Pátio em quadro visual</span><span>Estoque com reserva por OS</span><span>DRE e fluxo de caixa</span><span>Campanhas automáticas</span></div></div>
    <div class="lform"><form onsubmit="event.preventDefault();login()"><div style="margin-bottom:28px" class="only-m">${LOGO}</div><h1>Entrar</h1><p class="mut" style="margin:0 0 26px">Acesse o painel da Oficina do Arthur.</p>
      <div class="fld"><label>E-mail</label><input type="email" value="arthur@oficinadoarthur.com.br" autocomplete="username"></div>
      <div class="fld"><label>Senha</label><input type="password" placeholder="Qualquer senha (demonstração)" autocomplete="current-password"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin:4px 0 22px"><label class="check"><input type="checkbox" checked> Manter conectado</label><button type="button" class="lnk sm" onclick="toast('Link de redefinição enviado por e-mail.')">Esqueci a senha</button></div>
      <button class="btn full" type="submit" style="padding:13px">Entrar ${ic('arrow')}</button>
      <div class="demo"><b>Protótipo navegável.</b> Todos os dados são fictícios e nada é salvo — fique à vontade para clicar em tudo.</div></form></div></div>`;
}
function login() { S.screen = 'hub'; history.pushState(null, '', '#/modulos'); render(); toast('Bem-vindo, <b>Arthur</b>! Escolha um módulo para começar.'); }
function logout() { S.screen = 'login'; closeDrawer(); history.pushState(null, '', '#'); render(); }

// ===== seleção de módulos =====
function vHub() {
  const ab = osAbertas(), hoje = S.agenda.filter(a => a.dia === D(0)), low = baixo(), env = S.orcamentos.filter(o => o.status === 'Enviado');
  const margem = (S.fatMes - S.despMes) / S.fatMes * 100;
  const mods = [
    {id: 'dashboard', t: 'Dashboards', d: 'Faturamento, margem, produtividade e metas da oficina em tempo real.', m: [['Faturamento do mês', brlK(S.fatMes)], ['Margem', pct(margem)]], feat: 1},
    {id: 'os', t: 'Ordens de serviço', d: 'Pátio em quadro visual, checklist com fotos e entrega com nota fiscal.', m: [['No pátio', ab.length], ['Prontos', ab.filter(o => o.status === 'Pronto').length]]},
    {id: 'orcamentos', t: 'Orçamentos', d: 'Monte em minutos; o cliente aprova item a item pelo link.', m: [['Aguardando', env.length], ['Conversão', pct(S.kpi.orcApr / S.kpi.orcEnv * 100)]]},
    {id: 'agenda', t: 'Agenda', d: 'Horários por box, confirmação automática e check-in que abre a OS.', m: [['Hoje', hoje.length], ['Ocupação', '78%']]},
    {id: 'crm', t: 'CRM e clientes', d: 'Cliente 360°: veículos, histórico, conversas e funil de vendas.', m: [['Clientes ativos', '1.284'], ['Leads abertos', S.leads.filter(l => l.etapa < 3).length]]},
    {id: 'estoque', t: 'Estoque', d: 'Reserva por OS, curva ABC, compra sugerida e inventário.', m: [['Itens a repor', low.length], ['Valor em estoque', brlK(valorEstoque())]]},
    {id: 'financeiro', t: 'Financeiro', d: 'Contas, fluxo de caixa projetado, DRE e conciliação bancária.', m: [['Saldo', brlK(S.caixa)], ['A pagar 7 dias', brlK(sum(S.fin.filter(f => f.tipo === 'D' && f.status === 'Pendente' && diff(f.venc) <= 7), f => f.valor))]]},
    {id: 'marketing', t: 'Marketing', d: 'Campanhas e automações por SMS e e-mail, NPS e reativação de clientes.', m: [['Receita gerada', brlK(sum(S.campanhas, c => c.receita))], ['NPS', '76']]},
    {id: 'config', t: 'Configurações', d: 'Usuários e permissões, tabela de serviços e integrações.', m: [['Usuários', S.users.length], ['Integrações ativas', S.integ.filter(i => i.on).length]]},
  ];
  const icon = id => NAV.find(n => n.id === id).icon;
  return `<div class="hubhero"><div class="hubring"></div>
    <div class="hubtop">${LOGO}<div class="wm"><b>Oficina<span>360</span></b><small>Oficina do Arthur · Bosch Car Service</small></div><div class="sp"></div>
      <button class="hubsearch" onclick="openPalette()">${ic('search')}<span>Buscar cliente, placa, OS…</span><kbd>Ctrl K</kbd></button>
      <button class="hubuser" onclick="logout()" title="Sair"><span class="av lime">AR</span><div><b>Arthur</b><small>Sair</small></div></button></div>
    <div class="hubin"><span class="b lime nd">Protótipo navegável · dados fictícios</span><h1>${saud()},<br>Arthur.</h1><p>${dataLonga().replace(/^./, c => c.toUpperCase())} — por onde vamos começar?</p>
      <div class="today"><div><small>Veículos no pátio</small><b>${ab.length}</b></div><div><small>Agendamentos hoje</small><b>${hoje.length}</b></div><div><small>Prontos para entrega</small><b>${ab.filter(o => o.status === 'Pronto').length}</b></div><div><small>Orçamentos aguardando</small><b>${env.length}</b></div><div><small>Faturamento do mês</small><b>${brlK(S.fatMes)}</b></div></div></div></div>
  <div class="hubbody"><div class="hubsec"><h2>Módulos</h2><div class="quick">
      <button class="btn" onclick="ACOES[0].run()">${ic('plus')}Novo orçamento</button><button class="btn sec" onclick="ACOES[2].run()">${ic('agenda')}Agendar</button><button class="btn sec" onclick="ACOES[3].run()">${ic('user')}Novo cliente</button></div></div>
    <div class="mods">${mods.map(m => `<button class="mod ${m.feat ? 'feat' : ''}" onclick="enter('${m.id}')"><span class="mi">${ic(icon(m.id))}</span><span class="go">${ic('arrow')}</span>
      <h3>${m.t}</h3><p>${m.d}</p><div class="mm">${m.m.map(x => `<div>${x[0]}<b>${x[1]}</b></div>`).join('')}</div></button>`).join('')}</div></div>`;
}
