// ===== CRM: clientes, funil, veículos =====
const CRMF = {todos: () => true, VIP: c => c.tag === 'VIP', Recorrente: c => c.tag === 'Recorrente', Novo: c => c.tag === 'Novo', 'Em risco': c => c.tag === 'Em risco', rev: c => diff(c.proxRev) <= 30};
SUBCOUNT['crm.funil'] = () => S.leads.filter(l => l.etapa < 3).length;
VIEWS.crm = () => ({clientes: crmClientes, funil: crmFunil, veiculos: crmVeiculos})[S.sub]();
const crmHead = () => head('CRM', 'Relacionamento com clientes, veículos e oportunidades',
  `<button class="btn sec" onclick="toast('Importação da base atual (Excel/CSV) com deduplicação por CPF e placa.')">${ic('upload')}Importar base</button>` +
  (S.sub === 'funil' ? `<button class="btn" onclick="novoLead()">${ic('plus')}Novo lead</button>` : `<button class="btn" onclick="novoCliente()">${ic('plus')}Novo cliente</button>`), 'crm');
const revBadge = c => { const d = diff(c.proxRev); return d < 0 ? `<span class="b bad">Vencida ${rel(c.proxRev)}</span>` : d <= 30 ? `<span class="b warn">${rel(c.proxRev)}</span>` : `<span class="mut">${fmtD(c.proxRev)}</span>`; };
function crmSetF(k) { S.crmF = k; render(); }
function crmRows() {
  const q = norm(S.crmQ);
  const l = S.clientes.filter(CRMF[S.crmF]).filter(c => !q || norm(c.nome + ' ' + c.tel + ' ' + c.veiculos.map(v => v.placa + ' ' + v.modelo).join(' ')).includes(q));
  return l.map(c => `<tr class="click" onclick="openDr('cli',${c.id})"><td><div class="who">${av(c.nome)}<div><b>${c.nome}</b><small>${c.tel}</small></div></div></td>
    <td>${c.veiculos.map(v => `<div style="display:flex;gap:8px;align-items:center;margin:2px 0">${plate(v.placa)}<span class="sm">${v.modelo}</span></div>`).join('')}</td>
    <td>${fmtD(c.ultimo)}<div class="sm mut">${rel(c.ultimo)}</div></td><td>${revBadge(c)}</td><td class="num"><b>${brl0(c.gasto)}</b><div class="sm mut">${c.visitas} visitas</div></td>
    <td>${c.origem}</td><td>${badge(c.tag)}</td><td class="num"><button class="iconbtn" style="width:34px;height:34px" title="Enviar SMS" onclick="event.stopPropagation();waMsg(${c.id})">${ic('msg')}</button></td></tr>`).join('')
    || '<tr><td colspan="8" class="empty">Nenhum cliente encontrado.</td></tr>';
}
function crmClientes() {
  const n = k => S.clientes.filter(CRMF[k]).length;
  return crmHead() + `<div class="grid k5" style="margin-bottom:16px">
    ${kpi('Clientes ativos', '1.284', {icon: 'crm', hl: 1, delta: 4.2, sub: 'últimos 12 meses'})}
    ${kpi('Novos no mês', '61', {icon: 'user', delta: 12, sub: 'vs. mês anterior'})}
    ${kpi('Taxa de retorno', '64%', {icon: 'refresh', c: 'blue', sub: 'voltaram em 12 meses'})}
    ${kpi('Valor médio por cliente', 'R$ 3.870', {icon: 'financeiro', c: 'amber', sub: 'gasto acumulado'})}
  </div>
  <div class="card p0"><div class="tbar">${chips([['todos', 'Todos', n('todos')], ['VIP', 'VIP', n('VIP')], ['Recorrente', 'Recorrentes', n('Recorrente')], ['Novo', 'Novos', n('Novo')], ['Em risco', 'Em risco', n('Em risco')], ['rev', 'Revisão ≤ 30 dias', n('rev')]], S.crmF, 'crmSetF')}
    <div class="tsearch">${ic('search')}<input placeholder="Nome, telefone, placa ou modelo" value="${esc(S.crmQ)}" oninput="S.crmQ=this.value;$('#crmBody').innerHTML=crmRows()"></div></div>
  <div class="tw"><table><thead><tr><th>Cliente</th><th>Veículo(s)</th><th>Última visita</th><th>Próxima revisão</th><th class="num">Total gasto</th><th>Origem</th><th>Perfil</th><th></th></tr></thead><tbody id="crmBody">${crmRows()}</tbody></table></div></div>`;
}
function crmVeiculos() {
  const vs = S.clientes.flatMap(c => c.veiculos.map(v => ({...v, c})));
  return crmHead() + `<div class="card p0"><div class="tbar"><span class="mut">${vs.length} veículos na amostra · a placa liga cliente, histórico e revisões</span></div><div class="tw"><table><thead><tr><th>Placa</th><th>Modelo</th><th>Cliente</th><th class="num">KM</th><th>Última visita</th><th>Próxima revisão</th><th></th></tr></thead><tbody>
    ${vs.map(v => `<tr class="click" onclick="openDr('cli',${v.c.id},'veiculos')"><td>${plate(v.placa)}</td><td><b>${v.modelo}</b></td><td>${v.c.nome}</td><td class="num">${int(v.km)}</td><td>${fmtD(v.c.ultimo)}</td><td>${revBadge(v.c)}</td><td class="num"><button class="btn sm sec" onclick="event.stopPropagation();wzOpen('orc',${v.c.id},'${v.placa}')">Orçar</button></td></tr>`).join('')}
  </tbody></table></div></div>`;
}
function crmFunil() {
  return crmHead() + `<div class="grid k5" style="margin-bottom:16px">
    ${kpi('Leads abertos', S.leads.filter(l => l.etapa < 3).length, {icon: 'crm', hl: 1})}
    ${kpi('Valor em negociação', brl0(sum(S.leads.filter(l => l.etapa < 3), l => l.valor)), {icon: 'financeiro'})}
    ${kpi('Conversão de leads', '38%', {icon: 'check', c: 'blue', delta: 3.5})}
    ${kpi('Tempo até fechar', '4,2 dias', {icon: 'clock', c: 'amber'})}
  </div>
  <div class="kanban">${S.etapas.map((e, i) => { const ls = S.leads.filter(l => l.etapa === i);
    return `<div class="col"><div class="colh"><span><i style="background:${[C.pebble, C.blue, C.amber, C.moss][i]}"></i>${e}</span><small>${ls.length} · ${brlK(sum(ls, l => l.valor))}</small></div>
      ${ls.map(l => `<div class="kc" onclick="openDr('lead',${l.id})"><div class="r1"><span class="t">${l.nome}</span>${badge(l.origem, {})}</div><div class="m">${l.interesse}</div>
        <div class="r3"><b class="sm">${l.valor ? brl0(l.valor) : 'sem valor'}</b><span class="sm mut">${l.dias ? `há ${l.dias} d` : 'hoje'}</span>
        ${i < 3 ? `<div class="arrows" onclick="event.stopPropagation()"><button onclick="moveLead(${l.id},-1)" ${i === 0 ? 'disabled' : ''}>${ic('chevl')}</button><button onclick="moveLead(${l.id},1)">${ic('chev')}</button></div>` : ''}</div></div>`).join('') || '<div class="empty sm">Nenhum lead</div>'}</div>`; }).join('')}</div>`;
}
function moveLead(id, d) {
  const l = S.leads.find(x => x.id === id); l.etapa = Math.max(0, Math.min(3, l.etapa + d));
  if (l.etapa === 3) toast(`<b>${l.nome}</b> fechado! Converta em cliente para gerar o orçamento.`);
  render();
}
DR.lead = () => {
  const l = S.leads.find(x => x.id === S.dr.id); if (!l) return null;
  return {av: av(l.nome, 'lg'), h: l.nome, sub: `${l.tel} · via ${l.origem}`,
    body: `<div class="minik"><div><small>Etapa</small><b>${S.etapas[l.etapa]}</b></div><div><small>Valor estimado</small><b>${l.valor ? brl0(l.valor) : '—'}</b></div><div><small>No funil há</small><b>${l.dias} dia(s)</b></div></div>
      <div class="box"><small>Interesse</small>${l.interesse}</div>
      <div class="sec-t">Atividades</div><div class="tl">
        <div class="tli wa"><b>Contato recebido pelo formulário do site</b><small>${l.dias ? `há ${l.dias} dia(s)` : 'hoje'} · ${l.origem}</small><div class="msg in">Olá! Queria um orçamento: ${l.interesse.split('—')[0].trim().toLowerCase()}.</div></div>
        <div class="tli"><b>Lead criado automaticamente</b><small>atribuído a Juliana Prado</small></div></div>`,
    foot: `<button class="btn danger" onclick="perderLead(${l.id})">Marcar como perdido</button>${l.etapa < 3 ? `<button class="btn sec" onclick="moveLead(${l.id},1)">Avançar etapa</button>` : ''}<button class="btn" onclick="converterLead(${l.id})">${ic('orcamentos')}Converter e orçar</button>`};
};
function perderLead(id) { S.leads = S.leads.filter(l => l.id !== id); closeDrawer(); render(); toast('Lead marcado como perdido. Ele entra na campanha de reativação em 60 dias.', 'warn'); }
function converterLead(id) {
  const l = S.leads.find(x => x.id === id), cid = SEQ.cli++;
  const modelo = (l.interesse.split('—')[1] || 'Veículo').trim();
  const placa = 'NEW' + (1000 + cid * 7).toString().slice(-1) + 'A' + (10 + cid);
  S.clientes.push({id: cid, nome: l.nome, tel: l.tel, email: '—', cpf: '—', nasc: '1990-01-01', origem: l.origem, veiculos: [{placa, modelo, km: 0}], ultimo: D(0), proxRev: D(180), gasto: 0, visitas: 0, desde: String(now.getFullYear()), tag: 'Novo', lgpd: true, msgs: []});
  l.etapa = 3; closeDrawer();
  toast(`<b>${l.nome}</b> virou cliente. Monte o orçamento.`);
  wzOpen('orc', cid);
}
function novoLead() {
  openModal(mHead('Novo lead', 'Registre uma oportunidade que ainda não é cliente.') + `<div class="mb"><div class="fg">
    <div class="fld s2"><label>Nome ou empresa <i>*</i></label><input id="lNome" placeholder="Ex.: Frota Express Ltda"><span class="hint">Obrigatório</span></div>
    <div class="fld"><label>Celular <i>*</i></label><input id="lTel" placeholder="(11) 90000-0000" oninput="mTel(this)"></div>
    <div class="fld"><label>Origem</label><select id="lOri">${['Telefone', 'Site', 'Google', 'Instagram', 'Indicação', 'Rede Bosch', 'Passante'].map(o => `<option>${o}</option>`).join('')}</select></div>
    <div class="fld s2"><label>O que o cliente precisa?</label><input id="lInt" placeholder="Ex.: Troca de embreagem — Gol 2015"></div>
    <div class="fld"><label>Valor estimado</label><div class="inp"><span>R$</span><input id="lVal" type="number" min="0" placeholder="0"></div></div>
    <div class="fld"><label>Responsável</label><select>${S.users.filter(u => !u.papel.startsWith('Mec')).map(u => `<option>${u.nome}</option>`).join('')}</select></div></div></div>
    <div class="mf"><button class="btn ghost" onclick="closeModal()">Cancelar</button><div class="r"><button class="btn" onclick="salvarLead()">Salvar lead</button></div></div>`, 'sm');
}
function salvarLead() {
  const nome = $('#lNome').value.trim(), tel = $('#lTel').value.trim();
  if (fieldErr('lNome', !nome) | fieldErr('lTel', tel.length < 14)) return toast('Preencha nome e celular.', 'warn');
  S.leads.unshift({id: SEQ.lead++, nome, tel, interesse: $('#lInt').value || 'A definir', origem: $('#lOri').value, etapa: 0, valor: +$('#lVal').value || 0, dias: 0});
  closeModal(); go('crm', 'funil'); toast(`Lead <b>${nome}</b> criado em “Novo contato”.`);
}

// ===== cadastro de cliente =====
let NC = {};
function novoCliente(next) {
  NC = {next: next || null};
  openModal(mHead('Novo cliente', 'Cadastro completo em menos de 1 minuto — a placa preenche o veículo.') + `<div class="mb">
    <div class="fsec"><h4><span class="n">1</span>Dados do cliente</h4><div class="fg">
      <div class="fld s2"><label>Nome completo <i>*</i></label><input id="cNome" placeholder="Nome e sobrenome"><span class="hint">Obrigatório</span></div>
      <div class="fld"><label>CPF ou CNPJ <i>*</i></label><input id="cDoc" placeholder="000.000.000-00" oninput="mDoc(this)"><span class="hint">Usado na nota fiscal</span></div>
      <div class="fld"><label>Celular <i>*</i></label><input id="cTel" placeholder="(11) 90000-0000" oninput="mTel(this)"><span class="hint">Avisos e aprovação de orçamento</span></div>
      <div class="fld"><label>E-mail</label><input id="cEmail" type="email" placeholder="nome@email.com"></div>
      <div class="fld"><label>Data de nascimento</label><input id="cNasc" type="date"></div>
      <div class="fld"><label>Como conheceu a oficina?</label><select id="cOri">${['Indicação', 'Google', 'Instagram', 'Rede Bosch', 'Passante', 'Site'].map(o => `<option>${o}</option>`).join('')}</select></div>
      <div class="fld"><label>CEP</label><input placeholder="00000-000" oninput="this.value=this.value.replace(/\\D/g,'').slice(0,8).replace(/(\\d{5})(\\d)/,'$1-$2')"></div></div></div>
    <div class="fsec"><h4><span class="n">2</span>Veículo <small>consulta automática pela placa</small></h4><div class="fg">
      <div class="fld"><label>Placa <i>*</i></label><div class="inp"><input id="cPlaca" placeholder="ABC1D23" oninput="mPlaca(this)" style="text-transform:uppercase;font-weight:700;letter-spacing:.08em"><button type="button" id="cBusca" onclick="consultaPlaca()">${ic('search')}Consultar</button></div><span class="hint">Formato Mercosul ou antigo</span></div>
      <div class="fld"><label>Modelo e ano</label><input id="cModelo" placeholder="Preenchido pela consulta"></div>
      <div class="fld"><label>Quilometragem atual</label><div class="inp"><input id="cKm" type="number" min="0" placeholder="0"><span>km</span></div></div>
      <div class="fld"><label>Combustível</label><select><option>Flex</option><option>Gasolina</option><option>Diesel</option><option>Híbrido</option><option>Elétrico</option></select></div></div></div>
    <div class="fsec" style="margin:0"><h4><span class="n">3</span>Consentimento (LGPD)</h4>
      <label class="check"><input type="checkbox" id="cLgpd" checked> Cliente autoriza receber avisos e ofertas por SMS</label>
      <label class="check" style="margin-top:8px"><input type="checkbox"> Cliente autoriza receber e-mails promocionais</label></div></div>
    <div class="mf"><button class="btn ghost" onclick="closeModal()">Cancelar</button><div class="r"><button class="btn sec" onclick="salvarCliente('orc')">Salvar e criar orçamento</button><button class="btn" onclick="salvarCliente()">Salvar cliente</button></div></div>`);
  setTimeout(() => $('#cNome').focus(), 30);
}
function consultaPlaca() {
  const p = $('#cPlaca').value;
  if (!/^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(p)) { fieldErr('cPlaca', true); return toast('Placa inválida. Use o formato ABC1D23.', 'warn'); }
  fieldErr('cPlaca', false); const b = $('#cBusca'); b.innerHTML = '<span class="spin" style="width:16px;height:16px;border-width:2px"></span>Consultando'; b.disabled = true;
  setTimeout(() => { $('#cModelo').value = MODELOS[hash(p) % MODELOS.length]; b.innerHTML = ic('check') + 'Encontrado'; b.disabled = false; toast(`Veículo encontrado: <b>${$('#cModelo').value}</b>`); }, 700);
}
function salvarCliente(then) {
  const nome = $('#cNome').value.trim(), doc = $('#cDoc').value, tel = $('#cTel').value, placa = $('#cPlaca').value;
  const errs = [fieldErr('cNome', nome.split(' ').length < 2), fieldErr('cDoc', doc.length < 14), fieldErr('cTel', tel.length < 14), fieldErr('cPlaca', placa.length !== 7)];
  if (errs.some(Boolean)) return toast('Confira os campos destacados.', 'warn');
  const id = SEQ.cli++;
  S.clientes.unshift({id, nome, tel, email: $('#cEmail').value || '—', cpf: doc, nasc: $('#cNasc').value || '1990-01-01', origem: $('#cOri').value,
    veiculos: [{placa, modelo: $('#cModelo').value || 'Modelo a confirmar', km: +$('#cKm').value || 0}], ultimo: D(0), proxRev: D(180), gasto: 0, visitas: 0, desde: String(now.getFullYear()), tag: 'Novo', lgpd: $('#cLgpd').checked, msgs: []});
  closeModal(); toast(`Cliente <b>${nome}</b> cadastrado.`);
  if (then === 'orc' || NC.next) { wzOpen(NC.next === 'os' ? 'os' : 'orc', id); return; }
  go('crm', 'clientes'); openDr('cli', id);
}
function waMsg(cid, kind) {
  const c = cli(cid), txt = kind === 'rev' ? `Olá, ${c.nome.split(' ')[0]}! A revisão do seu ${c.veiculos[0].modelo} está chegando. Quer agendar? Responda com o melhor dia.` : `Olá, ${c.nome.split(' ')[0]}! Aqui é da Oficina do Arthur. Como podemos ajudar?`;
  c.msgs.push({out: 1, txt, at: stamp()});
  toast(`SMS enviado para <b>${c.nome}</b>.`); if (S.dr && S.dr.t === 'cli') renderDrawer();
}
function opps(c) {
  const v = c.veiculos[0], o = [];
  if (v.km >= 60000) o.push(['Troca do kit correia dentada', `${int(v.km)} km — recomendada a cada 60.000 km`, 'S7']);
  if (diff(c.proxRev) <= 30) o.push(['Revisão completa', `revisão ${diff(c.proxRev) < 0 ? 'vencida' : 'prevista ' + rel(c.proxRev)}`, 'S2']);
  o.push(['Higienização do ar-condicionado', 'última há mais de 12 meses', 'S6']);
  if (c.tag === 'VIP') o.push(['Plano de manutenção anual', 'cliente VIP — oferecer pacote com desconto', 'S2']);
  return o.map(x => `<div class="li"><div><b style="color:var(--obsidian)">${x[0]}</b><div class="sm mut">${x[1]}</div></div><button class="btn sm sec" onclick="wzOpen('orc',${c.id},null,'${x[2]}')">Orçar</button></div>`).join('');
}
DR.cli = () => {
  const c = cli(S.dr.id), tab = S.dr.tab; if (!c) return null;
  const hist = S.os.filter(o => o.cliente === c.id), orcs = S.orcamentos.filter(o => o.cliente === c.id);
  let body = '';
  if (tab === 'resumo') {
    const d = diff(c.proxRev);
    body = `<div class="minik"><div><small>Total gasto</small><b>${brl0(c.gasto)}</b></div><div><small>Visitas</small><b>${c.visitas}</b></div><div><small>Ticket médio</small><b>${c.visitas ? brl0(c.gasto / c.visitas) : '—'}</b></div><div><small>Cliente desde</small><b>${c.desde}</b></div></div>
      ${d <= 30 ? `<div class="al ${d < 0 ? 'bad' : 'warn'}"><span class="ico">${ic('clock')}</span><div><b>Revisão ${d < 0 ? 'vencida ' + rel(c.proxRev) : 'prevista ' + rel(c.proxRev)}</b>${c.veiculos[0].modelo} — envie um lembrete ou agende agora.<div class="acts"><button class="btn sm" onclick="waMsg(${c.id},'rev')">Enviar lembrete</button><button class="btn sm sec" onclick="novoAg(null,null,null,${c.id})">Agendar</button></div></div></div>` : ''}
      <div class="sec-t">Dados cadastrais</div><div class="ig"><div><small>CPF/CNPJ</small><b>${c.cpf}</b></div><div><small>Celular</small><b>${c.tel}</b></div><div><small>E-mail</small><b>${c.email}</b></div><div><small>Nascimento</small><b>${fmtD(c.nasc)}</b></div><div><small>Origem</small><b>${c.origem}</b></div><div><small>LGPD</small><b>${c.lgpd ? '<span class="b ok">Autoriza contato</span>' : '<span class="b">Sem consentimento</span>'}</b></div></div>
      <div class="sec-t">Oportunidades sugeridas</div><div class="list">${opps(c)}</div>`;
  } else if (tab === 'veiculos') {
    body = c.veiculos.map(v => `<div class="box" style="margin-bottom:10px;display:flex;gap:14px;align-items:center"><span class="kic dark">${ic('car')}</span><div style="flex:1"><b style="color:var(--obsidian)">${v.modelo}</b><div class="sm mut">${int(v.km)} km · próxima revisão ${fmtD(c.proxRev)}</div></div>${plate(v.placa)}<button class="btn sm sec" onclick="wzOpen('orc',${c.id},'${v.placa}')">Orçar</button></div>`).join('') +
      `<button class="btn sec" onclick="toast('Adicionar veículo: mesma consulta automática por placa do cadastro.')">${ic('plus')}Adicionar veículo</button>`;
  } else if (tab === 'historico') {
    body = `<div class="sec-t" style="margin-top:0">Ordens de serviço</div><div class="list">${hist.map(o => `<div class="li click" onclick="go('os');openDr('os',${o.id})"><div><b style="color:var(--obsidian)">OS ${o.id} · ${resumo(o.itens)}</b><div class="sm mut">${fmtD(o.entrada)} · ${o.placa}</div></div><div style="text-align:right">${badge(o.status)}<div class="sm b6">${brl(tot(o.itens))}</div></div></div>`).join('') || '<div class="mut sm">Nenhuma OS neste período.</div>'}</div>
      <div class="sec-t">Orçamentos</div><div class="list">${orcs.map(o => `<div class="li click" onclick="go('orcamentos');openDr('orc',${o.id})"><div><b style="color:var(--obsidian)">Orçamento ${o.id}</b><div class="sm mut">${fmtD(o.data)} · ${resumo(o.itens)}</div></div><div style="text-align:right">${badge(o.status)}<div class="sm b6">${brl(orcTot(o))}</div></div></div>`).join('') || '<div class="mut sm">Nenhum orçamento.</div>'}</div>
      <div class="sec-t">Histórico importado</div><div class="list"><div class="li"><span>Revisão 50.000 km</span><span class="mut sm">${fmtD(addD(c.ultimo, -190))} · ${brl(890)}</span></div><div class="li"><span>Troca de pastilhas</span><span class="mut sm">${fmtD(addD(c.ultimo, -320))} · ${brl(369)}</span></div></div>`;
  } else {
    body = `<div class="tl">${[...c.msgs].reverse().map(m => `<div class="tli ${m.out ? 'wa' : ''}"><b>${m.out ? 'Oficina → cliente' : c.nome.split(' ')[0] + ' respondeu'}</b><small>${m.at} · ${m.out ? 'SMS' : 'resposta por SMS'}</small><div class="msg ${m.out ? '' : 'in'}">${esc(m.txt)}</div></div>`).join('') || '<div class="mut">Sem mensagens ainda.</div>'}</div>`;
  }
  return {av: av(c.nome, 'lg'), h: `${c.nome} ${badge(c.tag)}`, sub: `${c.tel} · ${c.email}`, body,
    foot: `<button class="btn sec" onclick="waMsg(${c.id})">${ic('msg')}Enviar SMS</button><button class="btn sec" onclick="novoAg(null,null,null,${c.id})">${ic('agenda')}Agendar</button><button class="btn" onclick="wzOpen('orc',${c.id})">${ic('orcamentos')}Novo orçamento</button>`};
};
