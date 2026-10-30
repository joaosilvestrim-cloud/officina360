// ===== Estoque: peças, análise (ABC + compra sugerida), movimentações, compras, inventário =====
VIEWS.estoque = () => ({pecas: esPecas, analise: esAnalise, movimentos: esMovs, compras: esCompras, inventario: esInv})[S.sub]();
SUBCOUNT['estoque.analise'] = () => baixo().length;
SUBCOUNT['estoque.compras'] = () => S.pedidos.filter(p => p.status === 'Enviado').length;
const esHead = () => head('Estoque', 'Saldo, reservas por OS, reposição inteligente e inventário',
  `<button class="btn sec" onclick="xmlOpen()">${ic('upload')}Importar XML de NF-e</button><button class="btn" onclick="go('estoque','analise')">${ic('truck')}Compra sugerida${baixo().length ? ` (${baixo().length})` : ''}</button>`, 'estoque');
const lvl = p => { const m = Math.max(p.max, p.qtd) * 1.1, c = {Ruptura: C.red, Repor: C.amber, Excesso: C.blue, OK: C.forest}[stq(p)];
  return `<div class="lvl" title="Mín ${p.min} · Máx ${p.max}"><i style="width:${Math.min(100, disp(p) / m * 100)}%;background:${c}"></i><em style="left:${p.min / m * 100}%"></em><em style="left:${p.max / m * 100}%"></em></div>`; };
const covTxt = p => { const v = cobertura(p); return v == null ? '<span class="mut">sem giro</span>' : `<span class="${v < 10 ? 'dn b6' : ''}">${v} dias</span>`; };
function esSetF(k) { S.estF = k; render(); }
function esPecas() {
  const F = {Todos: () => true, Repor: p => ['Repor', 'Ruptura'].includes(stq(p)), Excesso: p => stq(p) === 'Excesso', 'Sem giro': p => p.ult < -90 || !p.c30, Reservadas: p => reservado(p) > 0};
  const q = norm(S.estQ), cats = ['Todas', ...new Set(S.estoque.map(p => p.cat))];
  const l = S.estoque.filter(F[S.estF]).filter(p => S.estCat === 'Todas' || p.cat === S.estCat).filter(p => !q || norm(p.nome + p.cod + p.local).includes(q));
  const res = sum(S.estoque, p => reservado(p) * p.custo), cobM = Math.round(sum(S.estoque.filter(p => p.c30), cobertura) / S.estoque.filter(p => p.c30).length);
  return esHead() + `<div class="grid k5" style="margin-bottom:16px">
    ${kpi('Valor em estoque', brl0(valorEstoque()), {icon: 'estoque', hl: 1, sub: `${S.estoque.length} itens · a custo`})}
    ${kpi('Itens para repor', baixo().length, {icon: 'alert', c: 'red', sub: 'abaixo do mínimo, sem pedido'})}
    ${kpi('Reservado para OS', brl0(res), {icon: 'os', c: 'blue', sub: `${S.estoque.filter(p => reservado(p) > 0).length} itens comprometidos`})}
    ${kpi('Cobertura média', cobM + ' dias', {icon: 'clock', sub: 'no ritmo de consumo atual'})}
    ${kpi('Capital parado', brl0(sum(S.estoque.filter(F['Sem giro']), p => p.qtd * p.custo)), {icon: 'box', c: 'amber', sub: 'sem saída há 90+ dias'})}
  </div>
  <div class="card p0"><div class="tbar">${chips(Object.keys(F).map(k => [k, k, S.estoque.filter(F[k]).length]), S.estF, 'esSetF')}
    <div style="display:flex;gap:8px;flex-wrap:wrap"><select style="width:auto;border-radius:9999px" onchange="S.estCat=this.value;render()">${cats.map(c => `<option ${c === S.estCat ? 'selected' : ''}>${c}</option>`).join('')}</select>
    <div class="tsearch">${ic('search')}<input placeholder="Peça, código ou local" value="${esc(S.estQ)}" onchange="S.estQ=this.value;render()"></div></div></div>
  <div class="tw"><table><thead><tr><th>Peça</th><th>Local</th><th class="num">Saldo</th><th class="num">Reservado</th><th class="num">Disponível</th><th>Nível (mín · máx)</th><th class="num">Cobertura</th><th class="num">Custo</th><th class="num">Venda</th><th>Situação</th></tr></thead><tbody>
  ${l.map(p => `<tr class="click" onclick="openDr('peca','${p.cod}')"><td><b style="color:var(--obsidian)">${p.nome}</b><div class="sm mut">${p.cod} · ${p.cat}</div></td><td><span class="b nd">${ic('pin').replace('class="i ', 'style="width:12px;height:12px" class="i ')}${p.local}</span></td>
    <td class="num">${p.qtd}</td><td class="num">${reservado(p) || '—'}</td><td class="num"><b>${disp(p)}</b></td><td>${lvl(p)}<div class="sm mut" style="margin-top:3px">${p.min} · ${p.max}</div></td><td class="num">${covTxt(p)}</td>
    <td class="num">${brl(p.custo)}</td><td class="num">${brl(p.preco)}</td><td>${p.pend ? '<span class="b info">Pedido em trânsito</span>' : badge(stq(p))}</td></tr>`).join('') || '<tr><td colspan="10" class="empty">Nenhuma peça com esse filtro.</td></tr>'}
  </tbody></table></div></div>`;
}
function abc() {
  const l = S.estoque.map(p => ({p, v: p.c30 * p.custo})).sort((a, b) => b.v - a.v), T = sum(l, x => x.v); let acc = 0;
  return l.map(x => { acc += x.v; const pc = acc / T * 100; return {...x, pc, cls: pc <= 80 ? 'A' : pc <= 95 ? 'B' : 'C'}; });
}
function esAnalise() {
  const A = abc(), low = baixo(), porF = S.forn.map((f, i) => ({f, i, it: low.filter(p => p.f === i)})).filter(x => x.it.length);
  const parados = S.estoque.filter(p => p.ult < -90 || !p.c30 || p.qtd > p.max);
  const cnt = k => A.filter(x => x.cls === k);
  return esHead() + `<div class="grid g2">
    <div class="card"><div class="ct"><h3>Compra sugerida</h3><small>disponível ≤ mínimo · repõe até o máximo</small></div>
      ${porF.length ? porF.map(({f, i, it}) => `<div class="fsec"><h4>${ic('truck')}${f.n}<small>entrega em ${f.p} dia(s)</small></h4>
        <table><thead><tr><th>Peça</th><th class="num">Disponível</th><th class="num">Mín · Máx</th><th class="num">Comprar</th><th class="num">Custo</th></tr></thead><tbody>${it.map(p => `<tr><td><b style="color:var(--obsidian)">${p.nome}</b><div class="sm mut">${p.cod} · consumo ${p.c30}/mês</div></td><td class="num ${disp(p) <= 0 ? 'dn b6' : ''}">${disp(p)}</td><td class="num">${p.min} · ${p.max}</td>
          <td class="num"><input id="sg-${p.cod}" type="number" min="0" value="${sugCompra(p)}" style="width:80px;text-align:right" oninput="$('#sgt-${i}').textContent=brl(sgTot(${i}))"></td><td class="num">${brl(p.custo)}</td></tr>`).join('')}</tbody></table>
        <div class="li" style="border:0;padding-bottom:0"><span>Total do pedido: <b id="sgt-${i}">${brl(sgTot(i))}</b></span><button class="btn" onclick="gerarPedido(${i})">${ic('send')}Enviar pedido</button></div></div>`).join('')
      : `<div class="al ok"><span class="ico">${ic('check')}</span><div><b>Estoque em dia</b>Nenhuma peça abaixo do mínimo sem pedido em aberto.</div></div>`}</div>
    <div class="card"><div class="ct"><h3>Curva ABC</h3><small>valor consumido por mês</small></div>
      ${donut([{l: `A — ${cnt('A').length} itens`, v: sum(cnt('A'), x => x.v), c: C.forest}, {l: `B — ${cnt('B').length} itens`, v: sum(cnt('B'), x => x.v), c: C.lime}, {l: `C — ${cnt('C').length} itens`, v: sum(cnt('C'), x => x.v), c: C.fog}], 'ABC', 'classificação')}
      <p class="sm mut" style="margin:14px 0 0"><b>A</b> = 80% do valor: controle diário e nunca deixar faltar. <b>C</b> = baixo impacto: comprar sob demanda.</p></div></div>
  <div class="grid g11 mt">
    <div class="card p0"><div class="tbar"><h3 style="margin:0;font-size:16px">Ranking ABC</h3></div><div class="tw"><table><thead><tr><th>Classe</th><th>Peça</th><th class="num">Consumo/mês</th><th class="num">Valor/mês</th><th class="num">% acumulado</th></tr></thead><tbody>
      ${A.map(x => `<tr class="click" onclick="openDr('peca','${x.p.cod}')"><td><span class="b ${x.cls === 'A' ? 'dark' : x.cls === 'B' ? 'lime' : ''} nd">${x.cls}</span></td><td>${x.p.nome}</td><td class="num">${x.p.c30}</td><td class="num">${brl0(x.v)}</td><td class="num">${pct(x.pc, 0)}</td></tr>`).join('')}</tbody></table></div></div>
    <div class="card"><div class="ct"><h3>Capital parado e excesso</h3><small>${brl0(sum(parados, p => p.qtd * p.custo))} imobilizados</small></div><div class="list">
      ${parados.map(p => `<div class="li"><div><b style="color:var(--obsidian)">${p.nome}</b><div class="sm mut">${p.qtd} un. · máx ${p.max} · última saída ${p.ult > -1 ? 'hoje' : `há ${-p.ult} dias`}</div></div><div style="text-align:right"><b>${brl0(p.qtd * p.custo)}</b><div><button class="lnk sm" onclick="toast('Sugestão: incluir ${p.nome} em promoção ou devolver ao fornecedor.')">O que fazer?</button></div></div></div>`).join('')}</div></div></div>`;
}
function sgTot(i) { return sum(baixo().filter(p => p.f === i), p => (+($('#sg-' + p.cod)?.value ?? sugCompra(p)) || 0) * p.custo); }
function gerarPedido(i) {
  const it = baixo().filter(p => p.f === i).map(p => ({cod: p.cod, q: +$('#sg-' + p.cod).value || 0})).filter(x => x.q > 0);
  if (!it.length) return toast('Informe ao menos uma quantidade.', 'warn');
  const id = 'PC-0' + SEQ.ped++, valor = sum(it, x => x.q * peca(x.cod).custo), f = S.forn[i];
  it.forEach(x => peca(x.cod).pend = x.q);
  S.pedidos.unshift({id, forn: i, itens: it, valor, status: 'Enviado', data: D(0), prev: D(f.p)});
  S.fin.unshift({id: SEQ.fin++, tipo: 'D', desc: `${f.n} — pedido ${id}`, cat: 'Peças', forma: 'Boleto', venc: D(28), valor, status: 'Pendente'});
  pushNotif('truck', 'blue', `Pedido <b>${id}</b> enviado para ${f.n}`, ['estoque', 'compras']);
  toast(`Pedido <b>${id}</b> enviado para ${f.n} (${brl(valor)}). Conta a pagar lançada para 28 dias.`); render();
}
function esMovs() {
  const T = ['Todos', 'Entrada', 'Saída', 'Ajuste'], l = S.movs.filter(m => S.movF === 'Todos' || m.tipo === S.movF);
  return esHead() + `<div class="card p0"><div class="tbar">${chips(T.map(t => [t, t === 'Todos' ? 'Todas' : t + 's', t === 'Todos' ? S.movs.length : S.movs.filter(m => m.tipo === t).length]), S.movF, 'movSet')}<span class="mut sm">Toda movimentação tem origem rastreável: OS, nota fiscal ou inventário.</span></div>
    <div class="tw"><table><thead><tr><th>Data</th><th>Tipo</th><th>Peça</th><th class="num">Qtd.</th><th>Origem</th><th>Usuário</th></tr></thead><tbody>
    ${l.map(m => `<tr><td>${fmtD(m.data)}</td><td>${badge(m.tipo, {Entrada: 'ok', 'Saída': 'info', Ajuste: 'warn'})}</td><td><b style="color:var(--obsidian)">${peca(m.cod).nome}</b><div class="sm mut">${m.cod}</div></td><td class="num b6 ${m.tipo === 'Entrada' ? 'up' : m.q < 0 || m.tipo === 'Saída' ? 'dn' : ''}">${m.tipo === 'Entrada' ? '+' : m.tipo === 'Saída' ? '−' : m.q > 0 ? '+' : ''}${Math.abs(m.q) === m.q || m.tipo !== 'Ajuste' ? Math.abs(m.q) : m.q}</td><td>${m.origem}</td><td><div class="who">${av(m.user, 'sm')}<span class="sm">${m.user}</span></div></td></tr>`).join('')}</tbody></table></div></div>`;
}
function movSet(k) { S.movF = k; render(); }
function esCompras() {
  const ab = S.pedidos.filter(p => p.status === 'Enviado');
  return esHead() + `<div class="grid k5" style="margin-bottom:16px">${kpi('Pedidos em aberto', ab.length, {icon: 'truck', hl: 1})}${kpi('Valor em trânsito', brl0(sum(ab, p => p.valor)), {icon: 'financeiro'})}${kpi('Prazo médio de entrega', '2,1 dias', {icon: 'clock', c: 'blue'})}${kpi('Compras no mês', brl0(12840 + sum(ab, p => p.valor)), {icon: 'box', c: 'amber'})}</div>
  <div class="card p0"><div class="tbar"><h3 style="margin:0;font-size:16px">Pedidos de compra</h3><button class="btn sm" onclick="go('estoque','analise')">${ic('plus')}Novo pedido pela compra sugerida</button></div><div class="tw"><table><thead><tr><th>Pedido</th><th>Fornecedor</th><th>Itens</th><th>Emissão</th><th>Previsão</th><th class="num">Valor</th><th>Status</th><th></th></tr></thead><tbody>
  ${S.pedidos.map(p => `<tr><td><b>${p.id}</b></td><td>${S.forn[p.forn].n}</td><td class="sm">${p.itens.map(x => `${x.q}× ${peca(x.cod).nome}`).join('<br>')}</td><td>${fmtD(p.data)}</td><td>${fmtD(p.prev)}<div class="sm mut">${p.status === 'Enviado' ? rel(p.prev) : ''}</div></td><td class="num"><b>${brl(p.valor)}</b></td><td>${badge(p.status === 'Enviado' ? 'Em trânsito' : p.status)}</td>
    <td class="num">${p.status === 'Enviado' ? `<button class="btn sm" onclick="conferir('${p.id}')">${ic('check')}Receber</button>` : ''}</td></tr>`).join('')}</tbody></table></div></div>`;
}
function conferir(id) {
  const p = S.pedidos.find(x => x.id === id);
  openModal(mHead(`Conferência do pedido ${id}`, `${S.forn[p.forn].n} — confira as quantidades recebidas`) + `<div class="mb"><table><thead><tr><th>Peça</th><th class="num">Pedido</th><th class="num">Recebido</th></tr></thead><tbody>
    ${p.itens.map((x, k) => `<tr><td><b style="color:var(--obsidian)">${peca(x.cod).nome}</b><div class="sm mut">guardar em ${peca(x.cod).local}</div></td><td class="num">${x.q}</td><td class="num"><input id="rc-${k}" type="number" min="0" value="${x.q}" style="width:90px;text-align:right"></td></tr>`).join('')}</tbody></table>
    <div class="fld" style="margin-top:14px"><label>Nota fiscal do fornecedor</label><input placeholder="Nº da NF-e ou chave de acesso" value="NF ${90000 + SEQ.ped * 7}"></div></div>
    <div class="mf"><button class="btn ghost" onclick="closeModal()">Cancelar</button><div class="r"><button class="btn" onclick="receberPedido('${id}')">${ic('check')}Confirmar entrada</button></div></div>`);
}
function receberPedido(id) {
  const p = S.pedidos.find(x => x.id === id); let parcial = false;
  p.itens.forEach((x, k) => { const r = +$('#rc-' + k).value || 0, pc = peca(x.cod); if (r < x.q) parcial = true; pc.qtd += r; delete pc.pend; S.movs.unshift({data: D(0), tipo: 'Entrada', cod: x.cod, q: r, origem: `Pedido ${id} — ${S.forn[p.forn].n}`, user: 'Juliana Prado'}); });
  p.status = parcial ? 'Recebido parcial' : 'Recebido'; closeModal(); render();
  toast(parcial ? `Pedido ${id} recebido com divergência — fornecedor notificado.` : `Pedido <b>${id}</b> recebido. Estoque atualizado.`, parcial ? 'warn' : 'ok');
}
function esInv() {
  const cats = [...new Set(S.estoque.map(p => p.cat))], l = S.estoque.filter(p => p.cat === S.invCat);
  return esHead() + `<div class="card dark" style="margin-bottom:16px;padding:26px 30px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:center"><div><h3 style="font-size:24px;font-weight:900;letter-spacing:-.04em;margin:0 0 4px">Inventário cíclico</h3><p style="margin:0">Conte uma categoria por semana — sem fechar a oficina. Diferenças viram ajuste com histórico.</p></div>
    <select style="width:auto;border-radius:9999px" onchange="S.invCat=this.value;S.inv={};render()">${cats.map(c => `<option ${c === S.invCat ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
  <div class="card p0"><div class="tw"><table><thead><tr><th>Peça</th><th>Local</th><th class="num">Saldo no sistema</th><th class="num">Contado</th><th class="num">Diferença</th><th class="num">Impacto</th></tr></thead><tbody>
    ${l.map(p => { const c = S.inv[p.cod], d = c == null ? null : c - p.qtd; return `<tr><td><b style="color:var(--obsidian)">${p.nome}</b><div class="sm mut">${p.cod}</div></td><td>${p.local}</td><td class="num">${p.qtd}</td>
      <td class="num"><input type="number" min="0" placeholder="—" value="${c ?? ''}" style="width:90px;text-align:right" onchange="S.inv['${p.cod}']=this.value===''?null:+this.value;render()"></td>
      <td class="num b6 ${d > 0 ? 'up' : d < 0 ? 'dn' : ''}">${d == null ? '—' : (d > 0 ? '+' : '') + d}</td><td class="num">${d ? brl(d * p.custo) : '—'}</td></tr>`; }).join('')}</tbody></table></div>
    <div class="tbar" style="border-top:1px solid var(--line);border-bottom:0"><span class="mut sm">${Object.values(S.inv).filter(v => v != null).length} de ${l.length} itens contados</span><button class="btn" onclick="finalizarInv()">${ic('check')}Finalizar inventário</button></div></div>`;
}
function finalizarInv() {
  const l = S.estoque.filter(p => p.cat === S.invCat && S.inv[p.cod] != null); if (!l.length) return toast('Informe a contagem de ao menos um item.', 'warn');
  let n = 0, v = 0;
  l.forEach(p => { const d = S.inv[p.cod] - p.qtd; if (d) { n++; v += d * p.custo; p.qtd = S.inv[p.cod]; S.movs.unshift({data: D(0), tipo: 'Ajuste', cod: p.cod, q: d, origem: `Inventário ${S.invCat}`, user: 'Arthur'}); } });
  S.inv = {}; render(); toast(`Inventário de <b>${S.invCat}</b> finalizado: ${n} ajuste(s), impacto de ${brl(v)}.`, n ? 'warn' : 'ok');
}
DR.peca = () => {
  const p = peca(S.dr.id); if (!p) return null;
  const ms = S.movs.filter(m => m.cod === p.cod), osr = osAbertas().filter(o => o.itens.some(i => i.t === 'P' && i.r === p.cod));
  const serie = meses(6).map((_, i) => Math.max(0, Math.round(p.c30 * (.75 + ((hash(p.cod + i) % 50) / 100)))));
  const body = S.dr.tab === 'resumo' ? `<div class="minik"><div><small>Saldo</small><b>${p.qtd}</b></div><div><small>Reservado</small><b>${reservado(p)}</b></div><div><small>Disponível</small><b>${disp(p)}</b></div><div><small>Cobertura</small><b>${cobertura(p) == null ? '—' : cobertura(p) + ' d'}</b></div></div>
      <div class="ig"><div><small>Fornecedor</small><b>${S.forn[p.f].n}</b></div><div><small>Local</small><b>${p.local}</b></div><div><small>Custo · venda</small><b>${brl(p.custo)} · ${brl(p.preco)}</b></div><div><small>Margem</small><b>${pct((p.preco - p.custo) / p.preco * 100, 0)}</b></div><div><small>Mínimo · máximo</small><b>${p.min} · ${p.max}</b></div><div><small>Consumo médio</small><b>${p.c30} / mês</b></div></div>
      <div class="sec-t">Saídas — últimos 6 meses</div>${barChart(meses(6), [{n: 'Saídas', c: C.forest, data: serie}], {h: 170, bw: 26})}
      ${osr.length ? `<div class="sec-t">Reservado para</div><div class="list">${osr.map(o => `<div class="li click" onclick="go('os');openDr('os',${o.id})"><span>OS ${o.id} · ${cli(o.cliente).nome}</span>${badge(o.status)}</div>`).join('')}</div>` : ''}
      <div class="sec-t">Ajuste rápido</div><div class="fg" style="grid-template-columns:110px 1fr auto;align-items:end"><div class="fld"><label>Qtd. (+/−)</label><input id="ajQ" type="number" value="1"></div><div class="fld"><label>Motivo</label><select id="ajM"><option>Avaria</option><option>Uso interno</option><option>Devolução de cliente</option><option>Correção de contagem</option></select></div><button class="btn dark" onclick="ajustar('${p.cod}')">Ajustar</button></div>`
    : `<div class="tl">${ms.map(m => `<div class="tli ${m.tipo === 'Entrada' ? 'ok' : ''}"><b>${m.tipo} de ${Math.abs(m.q)} un.</b><small>${fmtD(m.data)} · ${m.origem} · ${m.user}</small></div>`).join('') || '<div class="mut">Sem movimentações recentes.</div>'}</div>`;
  return {av: `<span class="kic dark" style="width:52px;height:52px">${ic('estoque')}</span>`, h: `${p.nome} ${p.pend ? '<span class="b info">Em trânsito</span>' : badge(stq(p))}`, sub: `${p.cod} · ${p.cat} · local ${p.local}`, body,
    foot: `<button class="btn sec" onclick="toast('Etiqueta com código de barras enviada para impressão.')">${ic('print')}Etiqueta</button>${['Repor', 'Ruptura'].includes(stq(p)) && !p.pend ? `<button class="btn" onclick="closeDrawer();go('estoque','analise')">${ic('truck')}Comprar</button>` : ''}`};
};
function ajustar(cod) {
  const p = peca(cod), q = +$('#ajQ').value || 0; if (!q) return;
  p.qtd = Math.max(0, p.qtd + q); S.movs.unshift({data: D(0), tipo: 'Ajuste', cod, q, origem: $('#ajM').value, user: 'Arthur'});
  render(); toast(`Ajuste de ${q > 0 ? '+' : ''}${q} em <b>${p.nome}</b> registrado.`);
}
// importação de XML da NF-e do fornecedor
const XMLI = [['P03', 12], ['P05', 8], ['P07', 4], ['P09', 16]];
function xmlOpen(step = 0) {
  if (step === 0) return openModal(mHead('Importar XML de NF-e', 'Entrada de mercadoria sem digitar item por item.') + `<div class="mb"><div class="foto add" style="aspect-ratio:auto;padding:46px 20px" onclick="xmlOpen(1)">${ic('upload')}<b style="font-size:15px;color:var(--obsidian)">Arraste o XML aqui ou clique para selecionar</b><span class="mut" style="font-weight:500">Também lemos a chave de acesso de 44 dígitos ou o QR code da DANFE</span></div></div>
    <div class="mf"><button class="btn ghost" onclick="closeModal()">Cancelar</button><div class="r"><button class="btn" onclick="xmlOpen(1)">Simular importação</button></div></div>`);
  const v = sum(XMLI, ([c, q]) => peca(c).custo * q);
  openModal(mHead('NF-e 90311 — Distribuidora AutoPeças SP', `Emitida em ${fmtD(D(0))} · ${XMLI.length} itens reconhecidos automaticamente`) + `<div class="mb"><table><thead><tr><th>Item da nota</th><th>Vinculado a</th><th class="num">Qtd.</th><th class="num">Custo</th></tr></thead><tbody>
    ${XMLI.map(([c, q]) => `<tr><td class="sm mut">${peca(c).nome.toUpperCase()} REF ${hash(c) % 9000 + 1000}</td><td><span class="b ok">${peca(c).cod}</span> ${peca(c).nome}</td><td class="num">${q}</td><td class="num">${brl(peca(c).custo)}</td></tr>`).join('')}</tbody></table>
    <div class="li" style="border:0;padding-top:14px"><span class="mut">Gera também a conta a pagar (boleto em 28 dias)</span><b style="font-size:18px;color:var(--obsidian)">${brl(v)}</b></div></div>
    <div class="mf"><button class="btn ghost" onclick="xmlOpen(0)">Voltar</button><div class="r"><button class="btn" onclick="xmlConfirm()">${ic('check')}Confirmar entrada</button></div></div>`, 'wide');
}
function xmlConfirm() {
  XMLI.forEach(([c, q]) => { const p = peca(c); p.qtd += q; delete p.pend; S.movs.unshift({data: D(0), tipo: 'Entrada', cod: c, q, origem: 'NF 90311 — Distribuidora AutoPeças SP', user: 'Arthur'}); });
  S.fin.unshift({id: SEQ.fin++, tipo: 'D', desc: 'Distribuidora AutoPeças SP — NF 90311', cat: 'Peças', forma: 'Boleto', venc: D(28), valor: sum(XMLI, ([c, q]) => peca(c).custo * q), status: 'Pendente'});
  closeModal(); go('estoque', 'movimentos'); toast('Entrada de <b>4 itens</b> registrada e conta a pagar lançada.');
}
