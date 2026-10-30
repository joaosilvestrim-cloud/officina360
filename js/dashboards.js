// ===== Dashboards =====
function per() {
  if (S.per === 'hoje') return {fat: 3870, os: 8, conv: 75, dF: 6.2, dO: 14.3, dC: 3.1, lbl: 'vs. mesma data na semana passada'};
  if (S.per === 'semana') return {fat: 16940, os: 31, conv: 72.4, dF: 4.8, dO: 3.3, dC: 1.9, lbl: 'vs. semana passada'};
  return {fat: S.fatMes, os: S.osMes, conv: S.kpi.orcApr / S.kpi.orcEnv * 100, dF: 8.4, dO: 5.5, dC: 2.3, lbl: 'vs. mês anterior'};
}
function dbHead(sub) {
  const seg = `<div class="seg">${[['hoje', 'Hoje'], ['semana', 'Semana'], ['mes', 'Mês']].map(([k, l]) => `<button class="${S.per === k ? 'on' : ''}" onclick="S.per='${k}';render()">${l}</button>`).join('')}</div>`;
  return head(sub, `${dataLonga().replace(/^./, c => c.toUpperCase())} · atualizado às ${clock()}`, seg + `<button class="btn sec" onclick="toast('Relatório em PDF do período enviado para o seu e-mail.')">${ic('download')}Exportar</button>`, 'dashboard');
}
VIEWS.dashboard = () => ({geral: dbGeral, operacional: dbOper, financeiro: dbFin, comercial: dbCom})[S.sub]();

function dbGeral() {
  const P = per(), ab = osAbertas(), low = baixo(), margem = (S.fatMes - S.despMes) / S.fatMes * 100;
  const hoje = S.agenda.filter(a => a.dia === D(0)).sort((a, b) => a.hora.localeCompare(b.hora));
  const revis = S.clientes.filter(c => diff(c.proxRev) <= 30);
  const pagar = S.fin.filter(f => f.tipo === 'D' && f.status === 'Pendente' && diff(f.venc) <= 7);
  const atras = ab.filter(o => diff(o.prazo) < 0);
  const prazoChip = o => diff(o.prazo) < 0 ? '<span class="b bad">Atrasada</span>' : diff(o.prazo) === 0 ? `<span class="b warn nd">Hoje ${o.hora}</span>` : `<span class="b nd">${fmtDM(o.prazo)}</span>`;
  return dbHead(`${saud()}, Arthur`) + `
  <div class="grid k5">
    ${kpi('Faturamento', brl0(P.fat), {icon: 'financeiro', hl: 1, delta: P.dF, sub: P.lbl, spark: [42, 48, 45, 51, 49, 56, 58]})}
    ${kpi('Ticket médio', brl0(P.fat / P.os), {icon: 'tag', delta: 2.7, sub: `${P.os} OS fechadas`, spark: [560, 571, 590, 584, 598, 601, 607]})}
    ${kpi('Conversão de orçamentos', pct(P.conv), {icon: 'orcamentos', c: 'blue', delta: P.dC, sub: `${S.kpi.orcApr} de ${S.kpi.orcEnv} no mês`})}
    ${kpi('Veículos no pátio', ab.length, {icon: 'car', c: 'amber', sub: `${ab.filter(o => o.status === 'Pronto').length} prontos · ${atras.length} atrasado(s)`})}
    ${kpi('Margem operacional', pct(margem), {icon: 'trend', delta: 1.2, sub: 'receita − despesas'})}
  </div>
  <div class="grid g2 mt">
    <div class="card"><div class="ct"><h3>Receita x despesas</h3><span class="legend"><span><i style="background:${C.forest}"></i>Receita</span><span><i style="background:${C.pebble}"></i>Despesas</span></span></div>
      ${lineChart(meses(6), [{n: 'Receita', c: C.forest, area: C.lime, data: [...S.hist.rec.slice(-5), S.fatMes]}, {n: 'Despesas', c: C.pebble, dash: 1, data: [...S.hist.desp.slice(-5), S.despMes]}])}</div>
    <div class="card"><div class="ct"><h3>Composição da receita</h3><small>${S.per === 'mes' ? 'no mês' : S.per}</small></div>
      ${donut([{l: 'Mão de obra', v: 46, c: C.forest}, {l: 'Peças', v: 41, c: C.lime}, {l: 'Pacotes e planos', v: 9, c: C.blue}, {l: 'Outros', v: 4, c: C.fog}], brlK(P.fat), 'faturado')}
      <div class="sec-t">Meta do mês</div><div class="hb" style="grid-template-columns:1fr auto"><div class="tr" style="height:12px"><div class="fi" style="width:${Math.min(100, S.fatMes / 75000 * 100)}%;background:${C.forest}"></div></div><span class="num">${pct(S.fatMes / 75000 * 100, 0)} de R$ 75k</span></div></div>
  </div>
  <div class="grid g3 mt">
    <div class="card"><div class="ct"><h3>Pátio agora</h3><button class="lnk sm" onclick="go('os')">Ver quadro</button></div><div class="list">
      ${ab.slice(0, 6).map(o => `<div class="li click" onclick="go('os');openDr('os',${o.id})"><div class="who">${plate(o.placa)}<div><b>${veic(o.cliente, o.placa)}</b><small>${o.status} · ${o.mec.split(' ')[0]}</small></div></div>${prazoChip(o)}</div>`).join('')}</div></div>
    <div class="card"><div class="ct"><h3>Agenda de hoje</h3><button class="lnk sm" onclick="go('agenda')">Abrir agenda</button></div><div class="list">
      ${hoje.length ? hoje.slice(0, 6).map(a => `<div class="li click" onclick="go('agenda');openDr('ag',${a.id})"><div class="who"><span class="av sm" style="background:${S.boxCor[a.box]}1f;color:${S.boxCor[a.box]}">${a.hora.slice(0, 2)}h</span><div><b>${cli(a.cliente).nome}</b><small>${a.hora} · ${serv(a.sv).nome}</small></div></div>${a.checkin ? '<span class="b ok">Check-in</span>' : `<span class="b nd">${a.box}</span>`}</div>`).join('') : '<div class="empty">Sem agendamentos hoje.</div>'}</div></div>
    <div class="card"><div class="ct"><h3>Precisa da sua atenção</h3></div>
      ${low.length ? `<div class="al bad"><span class="ico">${ic('estoque')}</span><div><b>${low.length} peças abaixo do mínimo</b>${low.slice(0, 3).map(p => p.nome).join(', ')}${low.length > 3 ? '…' : ''}<div class="acts"><button class="btn sm" onclick="go('estoque','analise')">Ver compra sugerida</button></div></div></div>` : ''}
      ${atras.length ? `<div class="al warn"><span class="ico">${ic('clock')}</span><div><b>${atras.length} OS com prazo vencido</b>${atras.map(o => `OS ${o.id} (${o.status.toLowerCase()})`).join(', ')}<div class="acts"><button class="btn sm sec" onclick="go('os');openDr('os',${atras[0].id})">Abrir OS</button></div></div></div>` : ''}
      ${revis.length ? `<div class="al info"><span class="ico">${ic('msg')}</span><div><b>${revis.length} revisões vencidas ou a vencer</b>Dispare o lembrete e encha a agenda das próximas semanas.<div class="acts"><button class="btn sm sec" onclick="go('marketing','campanhas');cpOpen('rev30')">Criar campanha</button></div></div></div>` : ''}
      ${pagar.length ? `<div class="al ok"><span class="ico">${ic('financeiro')}</span><div><b>${pagar.length} contas a pagar em 7 dias</b>Total de ${brl(sum(pagar, f => f.valor))}<div class="acts"><button class="btn sm sec" onclick="go('financeiro','fluxo')">Ver fluxo de caixa</button></div></div></div>` : ''}
    </div>
  </div>
  <div class="grid g3 mt">
    <div class="card"><div class="ct"><h3>Serviços mais vendidos</h3><small>quantidade no mês</small></div>${hbars([{l: 'Troca de óleo', v: 52}, {l: 'Alinhamento', v: 41}, {l: 'Revisão completa', v: 38}, {l: 'Freios', v: 27}, {l: 'Diagnóstico', v: 22}, {l: 'Ar-condicionado', v: 15}])}</div>
    <div class="card"><div class="ct"><h3>Produtividade da equipe</h3><small>horas faturadas / meta 150 h</small></div>${hbars([{l: 'Carlos Lima', v: 142}, {l: 'Rafael Nunes', v: 131}, {l: 'Diego Alves', v: 118}, {l: 'Marcos Reis', v: 104}], {max: 150, fmt: v => v + ' h', c: C.spruce})}</div>
    <div class="card"><div class="ct"><h3>Origem dos novos clientes</h3><small>61 no mês</small></div>${donut([{l: 'Google', v: 21, c: C.forest}, {l: 'Indicação', v: 17, c: C.lime}, {l: 'Instagram', v: 12, c: C.blue}, {l: 'Rede Bosch', v: 6, c: C.sage}, {l: 'Passante', v: 5, c: C.fog}], '61', 'novos', {fmt: int})}</div>
  </div>`;
}

function dbOper() {
  const ab = osAbertas(), dias = Array.from({length: 14}, (_, i) => fmtDM(D(i - 13)));
  const ent = [6, 8, 7, 9, 5, 4, 0, 7, 8, 9, 6, 10, 5, 8], sai = [5, 7, 8, 8, 6, 5, 0, 6, 7, 9, 7, 9, 6, 7];
  return dbHead('Dashboard operacional') + `
  <div class="grid k5">
    ${kpi('OS abertas', ab.length, {icon: 'os', hl: 1, sub: `${ab.filter(o => o.status === 'Aguardando peça').length} aguardando peça`})}
    ${kpi('Tempo médio no pátio', '1,8 dia', {icon: 'clock', delta: -6.1, sub: 'da entrada à entrega'})}
    ${kpi('Entregas no prazo', '91%', {icon: 'check', delta: 2.4, sub: 'meta: 95%'})}
    ${kpi('Ocupação dos boxes', '78%', {icon: 'agenda', c: 'blue', sub: 'capacidade da semana'})}
    ${kpi('Retrabalho', '1,9%', {icon: 'refresh', c: 'red', delta: -0.6, sub: 'OS que voltaram em 30 dias'})}
  </div>
  <div class="grid g2 mt">
    <div class="card"><div class="ct"><h3>Entradas x entregas</h3><span class="legend"><span><i style="background:${C.forest}"></i>Entradas</span><span><i style="background:${C.lime}"></i>Entregas</span></span></div>
      ${barChart(dias, [{n: 'Entradas', c: C.forest, data: ent}, {n: 'Entregas', c: C.lime, data: sai}], {bw: 12})}</div>
    <div class="card"><div class="ct"><h3>OS por etapa</h3><small>agora</small></div>
      ${hbars(S.osStatus.slice(0, 5).map(s => ({l: s, v: ab.filter(o => o.status === s).length, c: S.osCor[s]})), {max: Math.max(3, ...S.osStatus.map(s => ab.filter(o => o.status === s).length))})}
      <div class="al warn" style="margin-top:14px"><span class="ico">${ic('alert')}</span><div><b>Gargalo: espera por peça</b>Média de 18 h parada. A compra sugerida no Estoque reduz esse tempo.</div></div></div>
  </div>
  <div class="grid g11 mt">
    <div class="card"><div class="ct"><h3>Ocupação por box</h3><small>semana atual</small></div>
      ${heatmap(S.boxes, ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb'], [[92, 85, 78, 88, 95, 60], [80, 90, 70, 75, 88, 45], [70, 65, 82, 60, 85, 50], [55, 72, 68, 80, 90, 70]])}</div>
    <div class="card"><div class="ct"><h3>Tempo médio por etapa</h3><small>horas</small></div>
      ${hbars([{l: 'Aguardando', v: 1.2}, {l: 'Diagnóstico', v: 2.5}, {l: 'Aguardando peça', v: 18, c: C.amber}, {l: 'Em execução', v: 4.1}, {l: 'Pronto → entrega', v: 3}], {fmt: v => String(v).replace('.', ',') + ' h'})}</div>
  </div>
  <div class="card p0 mt"><div class="tbar"><h3 style="margin:0;font-size:16px">Desempenho por mecânico</h3><small class="mut">no mês</small></div><div class="tw"><table><thead><tr><th>Mecânico</th><th class="num">OS concluídas</th><th class="num">Horas faturadas</th><th class="num">Eficiência</th><th class="num">Retrabalho</th><th class="num">Receita gerada</th></tr></thead><tbody>
    ${[['Carlos Lima', 31, 142, 108, 0], ['Rafael Nunes', 27, 131, 101, 1], ['Diego Alves', 24, 118, 96, 1], ['Marcos Reis', 14, 104, 92, 0]].map(m => `<tr><td><div class="who">${av(m[0], 'sm')}<b>${m[0]}</b></div></td><td class="num">${m[1]}</td><td class="num">${m[2]} h</td><td class="num"><span class="b ${m[3] >= 100 ? 'ok' : 'warn'} nd">${m[3]}%</span></td><td class="num">${m[4]}</td><td class="num"><b>${brl0(m[2] * 160 * 1.9)}</b></td></tr>`).join('')}
  </tbody></table></div></div>`;
}

function dbFin() {
  const lab = meses(12), rec = [...S.hist.rec, S.fatMes], desp = [...S.hist.desp, S.despMes];
  const pend = S.fin.filter(f => f.status === 'Pendente').sort((a, b) => a.venc.localeCompare(b.venc));
  return dbHead('Dashboard financeiro') + `
  <div class="grid k5">
    ${kpi('Receita do mês', brl0(S.fatMes), {icon: 'trend', hl: 1, delta: 8.4})}
    ${kpi('Despesas do mês', brl0(S.despMes), {icon: 'financeiro', c: 'amber', delta: -2.1})}
    ${kpi('Resultado', brl0(S.fatMes - S.despMes), {icon: 'check', delta: 31.5, sub: pct((S.fatMes - S.despMes) / S.fatMes * 100) + ' de margem'})}
    ${kpi('Saldo em caixa', brl0(S.caixa), {icon: 'bank', c: 'blue', sub: 'conciliado hoje'})}
    ${kpi('Inadimplência', '2,3%', {icon: 'alert', c: 'red', sub: brl(sum(S.fin.filter(f => f.tipo === 'R' && f.status === 'Pendente' && diff(f.venc) < 0), f => f.valor)) + ' vencidos'})}
  </div>
  <div class="grid g2 mt">
    <div class="card"><div class="ct"><h3>Receita, despesas e resultado — 12 meses</h3><span class="legend"><span><i style="background:${C.forest}"></i>Receita</span><span><i style="background:${C.pebble}"></i>Despesas</span><span><i style="background:${C.moss}"></i>Resultado</span></span></div>
      ${lineChart(lab, [{n: 'Receita', c: C.forest, data: rec}, {n: 'Despesas', c: C.pebble, dash: 1, data: desp}, {n: 'Resultado', c: C.moss, area: C.lime, data: rec.map((v, i) => v - desp[i])}])}</div>
    <div class="card"><div class="ct"><h3>Despesas por categoria</h3></div>
      ${donut([{l: 'Pessoal', v: 41, c: C.forest}, {l: 'Peças', v: 31, c: C.lime}, {l: 'Fixas', v: 17, c: C.blue}, {l: 'Impostos', v: 8, c: C.sage}, {l: 'Marketing', v: 3, c: C.fog}], brlK(S.despMes), 'no mês')}</div>
  </div>
  <div class="grid g11 mt">
    <div class="card"><div class="ct"><h3>Recebimentos por forma de pagamento</h3></div>
      ${donut([{l: 'Pix', v: 38, c: C.forest}, {l: 'Cartão de crédito', v: 34, c: C.lime}, {l: 'Cartão de débito', v: 16, c: C.blue}, {l: 'Boleto (faturado)', v: 9, c: C.sage}, {l: 'Dinheiro', v: 3, c: C.fog}], '38%', 'via Pix')}</div>
    <div class="card"><div class="ct"><h3>Próximos vencimentos</h3><button class="lnk sm" onclick="go('financeiro','contas')">Ver todos</button></div><div class="list">
      ${pend.slice(0, 6).map(f => `<div class="li"><div><b style="color:var(--obsidian)">${f.desc}</b><div class="sm mut">${fmtD(f.venc)} · ${rel(f.venc)}</div></div><b class="num ${f.tipo === 'R' ? 'up' : ''}">${f.tipo === 'R' ? '+' : '−'} ${brl(f.valor)}</b></div>`).join('')}</div></div>
  </div>`;
}

function dbCom() {
  return dbHead('Dashboard comercial') + `
  <div class="grid k5">
    ${kpi('Orçamentos enviados', S.kpi.orcEnv, {icon: 'send', hl: 1, delta: 6.3})}
    ${kpi('Conversão', pct(S.kpi.orcApr / S.kpi.orcEnv * 100), {icon: 'check', delta: 2.3})}
    ${kpi('Valor aprovado', brl0(S.aprovMes), {icon: 'financeiro', c: 'blue', delta: 9.1})}
    ${kpi('Novos clientes', '61', {icon: 'user', c: 'amber', delta: 12})}
    ${kpi('NPS', '76', {icon: 'star', delta: 4.1, sub: 'zona de excelência'})}
  </div>
  <div class="grid g2 mt">
    <div class="card"><div class="ct"><h3>Funil comercial do mês</h3><small>do primeiro contato ao retorno</small></div>
      ${funnel([{l: 'Contatos / leads', v: 214, c: C.forest}, {l: 'Orçamentos enviados', v: S.kpi.orcEnv, c: C.spruce}, {l: 'Aprovados', v: S.kpi.orcApr, c: C.moss}, {l: 'OS entregues', v: 76, c: C.lime, tc: C.forest}, {l: 'Voltaram em 12 meses', v: 49, c: C.mist || '#e2f6d5', tc: C.forest}])}</div>
    <div class="card"><div class="ct"><h3>Novos x recorrentes</h3><small>clientes atendidos</small></div>${donut([{l: 'Recorrentes', v: 64, c: C.forest}, {l: 'Novos', v: 36, c: C.lime}], '64%', 'recorrência')}</div>
  </div>
  <div class="grid g11 mt">
    <div class="card"><div class="ct"><h3>Receita por origem do cliente</h3></div>${hbars([{l: 'Indicação', v: 18900}, {l: 'Google', v: 14200}, {l: 'Campanhas', v: 9800, c: C.moss}, {l: 'Rede Bosch', v: 7400}, {l: 'Instagram', v: 5100}, {l: 'Passante', v: 2900}], {fmt: brlK})}</div>
    <div class="card"><div class="ct"><h3>Evolução do NPS</h3><small>últimos 6 meses</small></div>${lineChart(meses(6), [{n: 'NPS', c: C.forest, area: C.lime, data: [68, 71, 70, 74, 73, 76]}], {fmt: v => Math.round(v), min: 60, max: 80, h: 220, pl: 36})}</div>
  </div>
  <div class="card p0 mt"><div class="tbar"><h3 style="margin:0;font-size:16px">Retorno das campanhas</h3><button class="lnk sm" onclick="go('marketing','campanhas')">Abrir Marketing</button></div><div class="tw"><table><thead><tr><th>Campanha</th><th class="num">Enviados</th><th class="num">Agendamentos</th><th class="num">Receita</th><th class="num">Custo</th><th class="num">Retorno</th></tr></thead><tbody>
    ${S.campanhas.filter(c => c.enviados).map(c => `<tr><td><b>${c.nome}</b></td><td class="num">${int(c.enviados)}</td><td class="num">${c.agend || '—'}</td><td class="num">${c.receita ? brl0(c.receita) : '—'}</td><td class="num">${brl0(c.custo)}</td><td class="num">${c.receita ? `<span class="b ok nd">${int(c.receita / c.custo)}x</span>` : '—'}</td></tr>`).join('')}
  </tbody></table></div></div>`;
}
