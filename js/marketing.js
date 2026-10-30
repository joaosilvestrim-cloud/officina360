// ===== Marketing: campanhas, automações, NPS =====
VIEWS.marketing = () => ({campanhas: mkCampanhas, automacoes: mkAutos, nps: mkNps})[S.sub]();
SUBCOUNT['marketing.automacoes'] = () => S.autos.filter(a => a.on).length;
const mkHead = () => head('Marketing', 'Campanhas por SMS e e-mail que enchem a agenda — e medem o retorno', `<button class="btn" onclick="cpOpen()">${ic('plus')}Nova campanha</button>`, 'marketing');
const SEGS = [
  {k: 'rev30', l: 'Revisão vencida ou a vencer em 30 dias', d: 'Maior taxa de conversão', f: c => diff(c.proxRev) <= 30, base: 143},
  {k: 'inat', l: 'Sem visita há mais de 6 meses', d: 'Reativação', f: c => diff(c.ultimo) < -180, base: 212},
  {k: 'vip', l: 'Clientes VIP', d: 'Ofertas exclusivas e planos', f: c => c.tag === 'VIP', base: 86},
  {k: 'suv', l: 'Donos de SUV e picapes', d: 'Suspensão, freios e pneus', f: c => /T-Cross|Renegade|Toro|Ranger|Compass/.test(c.veiculos.map(v => v.modelo).join()), base: 327},
  {k: 'todos', l: 'Todos com consentimento (LGPD)', d: 'Comunicados gerais', f: c => c.lgpd, base: 1184},
];
const TPLS = [
  {n: 'Lembrete de revisão', m: 'Olá, {nome}! Aqui é da Oficina do Arthur.\nA revisão do seu {veiculo} está chegando ({data}). Quer agendar? Responda com o melhor dia e reservamos um box para você.'},
  {n: 'Promoção', m: 'Oi, {nome}! Neste mês a higienização do ar-condicionado do seu {veiculo} sai com 20% de desconto. Responda QUERO para agendar.'},
  {n: 'Reativação', m: '{nome}, sentimos sua falta! Faz tempo que o {veiculo} não passa por aqui. Que tal um check-up gratuito de 20 itens? Responda SIM para agendar.'},
];
function mkCampanhas() {
  return mkHead() + `<div class="grid k5" style="margin-bottom:16px">
    ${kpi('Receita gerada', brl0(sum(S.campanhas, c => c.receita)), {icon: 'trend', hl: 1, delta: 18.2, sub: 'agendamentos atribuídos'})}
    ${kpi('Mensagens em 30 dias', int(sum(S.campanhas, c => c.enviados)), {icon: 'send'})}
    ${kpi('Taxa de resposta', '45%', {icon: 'msg', c: 'blue', delta: 3.1})}
    ${kpi('Agendamentos gerados', sum(S.campanhas, c => c.agend), {icon: 'agenda', c: 'amber'})}
  </div>
  <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(330px,1fr))">${S.campanhas.map((c, i) => `<div class="card">
    <div class="ct"><h3>${c.nome}</h3>${badge(c.status)}</div><div class="sm mut" style="margin:-8px 0 14px">${c.tipo} · ${c.canal}<br>${c.gatilho}</div>
    ${hbars([{l: 'Enviados', v: c.enviados}, {l: 'Respostas', v: c.respostas, c: C.spruce}, {l: 'Agendamentos', v: c.agend, c: C.moss}], {max: Math.max(1, c.enviados)})}
    <div class="li" style="border-top:1px solid var(--line2);margin-top:4px;padding-bottom:0"><span class="mut sm">Receita · custo de envio</span><b>${c.receita ? brl0(c.receita) : '—'} <span class="mut sm">· ${brl0(c.custo)}</span></b></div></div>`).join('')}</div>`;
}
function mkAutos() {
  return mkHead() + `<div class="card dark" style="margin-bottom:16px;padding:28px 32px"><h3 style="font-size:26px;font-weight:900;letter-spacing:-.04em;margin:0 0 6px">O sistema conversa com o cliente por você.</h3><p style="margin:0;max-width:640px">Cada automação dispara sozinha a partir de um evento da operação — uma OS que fica pronta, uma revisão que vence, um orçamento sem resposta.</p></div>
  <div class="card p0">${S.autos.map((a, i) => `<div class="li" style="padding:16px 20px"><div style="display:flex;gap:14px;align-items:center;flex:1;min-width:0">${sw(a.on, `toggleAuto(${i},this.checked)`)}<div><b style="color:var(--obsidian)">${a.n}</b><div class="sm mut">${a.d}</div></div></div>
    <div style="text-align:right;white-space:nowrap"><b>${a.env ? int(a.env) + ' envios' : '—'}</b><div class="sm mut">${a.res}</div></div><button class="btn sm sec" onclick="verAuto(${i})">${ic('edit')}Editar</button></div>`).join('')}</div>`;
}
function toggleAuto(i, on) { S.autos[i].on = on; toast(`Automação <b>${S.autos[i].n}</b> ${on ? 'ativada' : 'pausada'}.`, on ? 'ok' : 'warn'); }
function verAuto(i) {
  const a = S.autos[i];
  openModal(mHead(a.n, a.d) + `<div class="mb"><div class="grid g11" style="gap:20px"><div>
    <div class="fld" style="margin-bottom:14px"><label>Gatilho</label><input value="${esc(a.d)}" disabled></div>
    <div class="fld" style="margin-bottom:14px"><label>Mensagem</label><textarea id="auMsg" oninput="$('#auPrev').textContent=this.value.replace('{nome}','Mariana').replace('{veiculo}','Honda Civic')">Olá, {nome}! ${a.n === 'Carro pronto' ? 'Seu {veiculo} está pronto para retirada. Pague pelo link ou na retirada.' : 'Aqui é da Oficina do Arthur sobre o seu {veiculo}.'}</textarea></div>
    <div class="fld"><label>Horário permitido</label><select><option>Somente em horário comercial (8h–18h)</option><option>Qualquer horário</option></select></div></div>
    <div><label class="b6" style="display:block;margin-bottom:6px;font-size:13px;color:var(--obsidian)">Prévia</label><div class="wa"><div class="bub" id="auPrev"></div></div></div></div></div>
    <div class="mf"><button class="btn ghost" onclick="closeModal()">Cancelar</button><div class="r"><button class="btn" onclick="closeModal();toast('Automação salva.')">Salvar</button></div></div>`);
  $('#auMsg').dispatchEvent(new Event('input'));
}
function mkNps() {
  const F = {Todos: () => true, Promotores: n => n.nota >= 9, Neutros: n => n.nota >= 7 && n.nota <= 8, Detratores: n => n.nota <= 6};
  const l = S.nps.filter(F[S.npsF]);
  return mkHead() + `<div class="grid g2"><div class="card"><div class="ct"><h3>Evolução do NPS</h3><small>meta: 75</small></div>${lineChart(meses(6), [{n: 'NPS', c: C.forest, area: C.lime, data: [68, 71, 70, 74, 73, 76]}], {fmt: v => Math.round(v), min: 60, max: 80, h: 220, pl: 36, ref: 75, refL: 'meta'})}</div>
    <div class="card" style="text-align:center">${gauge(76)}<div class="minik" style="margin:16px 0 0"><div><small>Promotores</small><b class="up">82%</b></div><div><small>Neutros</small><b>12%</b></div><div><small>Detratores</small><b class="dn">6%</b></div></div><div class="sm mut" style="margin-top:10px">128 respostas nos últimos 30 dias</div></div></div>
  <div class="card p0 mt"><div class="tbar">${chips(['Todos', 'Promotores', 'Neutros', 'Detratores'].map(k => [k, k, S.nps.filter(F[k]).length]), S.npsF, 'npsSet')}<span class="mut sm">Pesquisa enviada por SMS e e-mail 2 dias após a entrega</span></div>
    <div style="padding:6px 20px">${l.map(n => `<div class="li"><div class="who" style="align-items:flex-start">${av(n.nome)}<div><b>${n.nome}</b><div style="margin-top:2px">${esc(n.txt)}</div><small>${fmtD(D(n.d))}</small></div></div>
      <div style="display:flex;gap:8px;align-items:center"><span class="b ${n.nota >= 9 ? 'ok' : n.nota >= 7 ? 'warn' : 'bad'} nd" style="font-size:14px;padding:4px 12px">${n.nota}</span>${n.nota <= 6 ? `<button class="btn sm" onclick="tratarNps('${n.nome}')">Tratar</button>` : ''}</div></div>`).join('')}</div></div>`;
}
function npsSet(k) { S.npsF = k; render(); }
function tratarNps(nome) { toast(`Tarefa criada para Arthur: ligar para <b>${nome}</b> em até 24 h.`); pushNotif('star', 'amber', `Tarefa: contato com <b>${nome}</b> (NPS baixo)`, ['marketing', 'nps']); }

// ===== assistente de nova campanha =====
let CP = null;
function cpOpen(seg) { CP = {step: 0, seg: seg || 'rev30', tpl: 0, msg: TPLS[0].m, nome: 'Lembrete de revisão — ' + MES[now.getMonth()], quando: 'agora', data: D(1), wa: true, em: false}; cpRender(); }
function cpPrev() {
  const s = SEGS.find(x => x.k === CP.seg), c = S.clientes.find(s.f) || S.clientes[0];
  return CP.msg.replace(/{nome}/g, c.nome.split(' ')[0]).replace(/{veiculo}/g, c.veiculos[0].modelo).replace(/{data}/g, fmtD(c.proxRev));
}
function cpRender() {
  const s = SEGS.find(x => x.k === CP.seg), amostra = S.clientes.filter(s.f);
  let b;
  if (CP.step === 0) b = `<div class="radios">${SEGS.map(x => `<div class="rc ${x.k === CP.seg ? 'on' : ''}" onclick="CP.seg='${x.k}';cpRender()"><span class="ico">${ic('crm')}</span><div><b>${x.l}</b><small>${x.d}</small></div><span class="rv">${int(x.base)} clientes</span></div>`).join('')}</div>
    <div class="sec-t">Exemplos deste público</div><div class="chips">${amostra.slice(0, 6).map(c => `<span class="chip" style="cursor:default">${c.nome}</span>`).join('') || '<span class="mut sm">Nenhum na amostra</span>'}</div>`;
  else if (CP.step === 1) b = `<div class="grid g11" style="gap:22px"><div>
      <div class="fld" style="margin-bottom:14px"><label>Nome da campanha <i>*</i></label><input value="${esc(CP.nome)}" oninput="CP.nome=this.value"></div>
      <div class="fld" style="margin-bottom:8px"><label>Modelo</label><div class="chips">${TPLS.map((t, i) => `<button class="chip ${CP.tpl === i ? 'on' : ''}" onclick="CP.tpl=${i};CP.msg=TPLS[${i}].m;cpRender()">${t.n}</button>`).join('')}</div></div>
      <div class="fld"><label>Mensagem</label><textarea id="cpMsg" rows="6" oninput="CP.msg=this.value;$('#cpPrev').textContent=cpPrev()">${esc(CP.msg)}</textarea>
      <div class="varchips">${['{nome}', '{veiculo}', '{data}'].map(v => `<button class="chip" onclick="CP.msg+=' ${v}';$('#cpMsg').value=CP.msg;$('#cpPrev').textContent=cpPrev()">+ ${v}</button>`).join('')}</div></div></div>
    <div><label class="b6" style="display:block;margin-bottom:6px;font-size:13px;color:var(--obsidian)">Prévia da mensagem (SMS)</label><div class="wa"><div class="bub"><span id="cpPrev">${esc(cpPrev())}</span><small>${clock()} ✓✓</small></div></div>
    <p class="sm mut">Variáveis são preenchidas com os dados de cada cliente. SMS tem até 160 caracteres; o e-mail aceita imagens e botão de agendamento.</p></div></div>`;
  else {
    const custo = s.base * .12, prev = Math.round(s.base * .2) * 607;
    b = `<div class="fld" style="margin-bottom:14px"><label>Quando enviar?</label><div class="radios cols">
      <div class="rc ${CP.quando === 'agora' ? 'on' : ''}" onclick="CP.quando='agora';cpRender()"><span class="ico">${ic('send')}</span><div><b>Enviar agora</b><small>em lotes, horário comercial</small></div></div>
      <div class="rc ${CP.quando === 'agendar' ? 'on' : ''}" onclick="CP.quando='agendar';cpRender()"><span class="ico">${ic('clock')}</span><div><b>Agendar</b><small>escolha data e hora</small></div></div></div></div>
      ${CP.quando === 'agendar' ? `<div class="fg" style="margin-bottom:14px"><div class="fld"><label>Data</label><input type="date" value="${CP.data}" onchange="CP.data=this.value"></div><div class="fld"><label>Hora</label><input type="time" value="09:00"></div></div>` : ''}
      <div class="fld" style="margin-bottom:16px"><label>Canais</label><label class="check"><input type="checkbox" ${CP.wa ? 'checked' : ''} onchange="CP.wa=this.checked"> SMS</label><label class="check"><input type="checkbox" ${CP.em ? 'checked' : ''} onchange="CP.em=this.checked"> E-mail</label></div>
      <div class="minik"><div><small>Público</small><b>${int(s.base)}</b></div><div><small>Custo estimado</small><b>${brl0(custo)}</b></div><div><small>Agendamentos esperados</small><b>~${Math.round(s.base * .2)}</b></div><div><small>Receita potencial</small><b>${brlK(prev)}</b></div></div>`;
  }
  openModal(mHead('Nova campanha', 'Público → mensagem → envio') + stepper(['Público', 'Mensagem', 'Envio'], CP.step) + `<div class="mb">${b}</div>
    <div class="mf"><button class="btn ghost" onclick="${CP.step ? 'CP.step--;cpRender()' : 'closeModal()'}">${CP.step ? 'Voltar' : 'Cancelar'}</button><div class="r">${CP.step < 2 ? `<button class="btn" onclick="CP.step++;cpRender()">Continuar ${ic('arrow')}</button>` : `<button class="btn" onclick="cpSalvar()">${CP.quando === 'agora' ? 'Disparar campanha' : 'Agendar campanha'}</button>`}</div></div>`, 'wide');
}
function cpSalvar() {
  const s = SEGS.find(x => x.k === CP.seg), agora = CP.quando === 'agora';
  S.campanhas.unshift({nome: CP.nome || 'Campanha', tipo: 'Pontual', gatilho: s.l + (agora ? '' : ` · ${fmtD(CP.data)}`), canal: [CP.wa && 'SMS', CP.em && 'e-mail'].filter(Boolean).join(' + ') || 'SMS', enviados: agora ? s.base : 0, respostas: agora ? Math.round(s.base * .08) : 0, agend: 0, receita: 0, custo: agora ? Math.round(s.base * .12) : 0, status: agora ? 'Enviando' : 'Agendada'});
  closeModal(); go('marketing', 'campanhas');
  toast(agora ? `Disparando para <b>${int(s.base)} clientes</b>. Respostas caem no CRM.` : `Campanha agendada para <b>${fmtD(CP.data)}</b>.`);
}
