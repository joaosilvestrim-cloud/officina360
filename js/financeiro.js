// ===== Financeiro: contas, fluxo de caixa, DRE =====
VIEWS.financeiro = () => ({contas: fiContas, fluxo: fiFluxo, dre: fiDre})[S.sub]();
SUBCOUNT['financeiro.contas'] = () => S.fin.filter(f => f.status === 'Pendente' && diff(f.venc) < 0).length || null;
const fiHead = () => head('Financeiro', 'Contas, caixa e resultado — alimentados automaticamente pela operação',
  `<button class="btn sec" onclick="conciliar()">${ic('refresh')}Conciliar extrato</button><button class="btn" onclick="novoLanc()">${ic('plus')}Novo lançamento</button>`, 'financeiro');
const pend = t => S.fin.filter(f => f.tipo === t && f.status === 'Pendente');
function fiKpis() {
  const venc = S.fin.filter(f => f.status === 'Pendente' && diff(f.venc) < 0);
  return `<div class="grid k5" style="margin-bottom:16px">
    ${kpi('Saldo em caixa', brl0(S.caixa), {icon: 'bank', hl: 1, sub: 'bancos + caixa físico'})}
    ${kpi('A receber', brl0(sum(pend('R'), f => f.valor)), {icon: 'trend', sub: `${pend('R').length} títulos`})}
    ${kpi('A pagar', brl0(sum(pend('D'), f => f.valor)), {icon: 'financeiro', c: 'amber', sub: `${pend('D').length} títulos`})}
    ${kpi('Vencidos', brl0(sum(venc, f => f.valor)), {icon: 'alert', c: 'red', sub: `${venc.length} título(s) em atraso`})}
    ${kpi('Resultado do mês', brl0(S.fatMes - S.despMes), {icon: 'check', delta: 31.5, sub: 'receitas − despesas'})}</div>`;
}
function fiSetF(k) { S.finF = k; render(); }
function fiContas() {
  const F = {Todos: () => true, 'A receber': f => f.tipo === 'R' && f.status === 'Pendente', 'A pagar': f => f.tipo === 'D' && f.status === 'Pendente', Vencidos: f => f.status === 'Pendente' && diff(f.venc) < 0, Pagos: f => f.status === 'Pago'};
  const q = norm(S.finQ), l = S.fin.filter(F[S.finF]).filter(f => !q || norm(f.desc + f.cat).includes(q)).sort((a, b) => (a.status === 'Pago') - (b.status === 'Pago') || a.venc.localeCompare(b.venc));
  return fiHead() + fiKpis() + `<div class="card p0"><div class="tbar">${chips(Object.keys(F).map(k => [k, k, S.fin.filter(F[k]).length]), S.finF, 'fiSetF')}<div class="tsearch">${ic('search')}<input placeholder="Descrição ou categoria" value="${esc(S.finQ)}" onchange="S.finQ=this.value;render()"></div></div>
  <div class="tw"><table><thead><tr><th>Vencimento</th><th>Descrição</th><th>Categoria</th><th>Forma</th><th class="num">Valor</th><th>Status</th><th></th></tr></thead><tbody>
  ${l.map(f => { const v = f.status === 'Pendente' && diff(f.venc) < 0;
    return `<tr><td>${fmtD(f.venc)}<div class="sm ${v ? 'dn' : 'mut'}">${f.status === 'Pago' ? 'pago' : rel(f.venc)}</div></td><td><div class="who"><span class="kic ${f.tipo === 'R' ? '' : 'amber'}" style="width:30px;height:30px">${ic(f.tipo === 'R' ? 'trend' : 'financeiro')}</span><b>${f.desc}</b></div></td><td>${f.cat}</td><td class="sm">${f.forma || '—'}</td>
    <td class="num"><b class="${f.tipo === 'R' ? 'up' : ''}">${f.tipo === 'R' ? '+' : '−'} ${brl(f.valor)}</b></td><td>${badge(v ? 'Vencido' : f.status)}</td>
    <td class="num">${f.status === 'Pendente' ? `<button class="btn sm ${f.tipo === 'R' ? '' : 'sec'}" onclick="baixar(${f.id})">${f.tipo === 'R' ? 'Receber' : 'Pagar'}</button>${f.tipo === 'R' && v ? ` <button class="btn sm ghost" onclick="toast('Cobrança com link Pix enviada por SMS e e-mail.')">Cobrar</button>` : ''}` : ''}</td></tr>`; }).join('') || '<tr><td colspan="7" class="empty">Nenhum lançamento.</td></tr>'}
  </tbody></table></div></div>`;
}
function baixar(id) {
  const f = S.fin.find(x => x.id === id); f.status = 'Pago';
  S.caixa += f.tipo === 'R' ? f.valor : -f.valor; if (f.tipo === 'D') S.despMes += f.valor;
  render(); toast(`${f.tipo === 'R' ? 'Recebimento' : 'Pagamento'} de <b>${brl(f.valor)}</b> registrado. Saldo: ${brl(S.caixa)}.`);
}
function conciliar() {
  const p = S.fin.filter(f => f.status === 'Pendente' && f.tipo === 'R' && diff(f.venc) <= 0);
  openModal(mHead('Conciliação bancária', 'Extrato importado via Open Finance — o sistema sugere o casamento.') + `<div class="mb"><table><thead><tr><th>Extrato</th><th>Lançamento sugerido</th><th class="num">Valor</th><th></th></tr></thead><tbody>
    <tr><td class="sm">PIX RECEBIDO ${fmtDM(D(0))}</td><td>${p[0] ? p[0].desc : 'OS 2311 — Fernanda Costa'}</td><td class="num">${brl(p[0] ? p[0].valor : 1280)}</td><td><span class="b ok">Compatível</span></td></tr>
    <tr><td class="sm">TED ENERGIA ${fmtDM(D(-4))}</td><td>Energia elétrica</td><td class="num">${brl(1320)}</td><td><span class="b ok">Já conciliado</span></td></tr>
    <tr><td class="sm">TARIFA PACOTE</td><td class="mut">Sem lançamento — criar como “Tarifas bancárias”</td><td class="num">${brl(49.9)}</td><td><span class="b warn">Novo</span></td></tr></tbody></table></div>
    <div class="mf"><button class="btn ghost" onclick="closeModal()">Fechar</button><div class="r"><button class="btn" onclick="closeModal();${p[0] ? `baixar(${p[0].id});` : ''}toast('Extrato conciliado.')">${ic('check')}Confirmar conciliação</button></div></div>`, 'wide');
}
let NL = {tipo: 'D'};
function novoLanc(tipo) {
  NL = {tipo: tipo || NL.tipo || 'D'};
  const cats = NL.tipo === 'R' ? ['Serviços', 'Venda de peças', 'Cartão', 'Outras receitas'] : ['Peças', 'Pessoal', 'Fixas', 'Impostos', 'Marketing', 'Manutenção', 'Outras despesas'];
  openModal(mHead('Novo lançamento', 'Receitas de OS entram sozinhas — use para o que vem de fora da operação.') + `<div class="mb">
    <div class="radios cols" style="margin-bottom:16px"><div class="rc ${NL.tipo === 'D' ? 'on' : ''}" onclick="novoLanc('D')"><span class="ico">${ic('financeiro')}</span><div><b>Conta a pagar</b><small>despesa</small></div></div><div class="rc ${NL.tipo === 'R' ? 'on' : ''}" onclick="novoLanc('R')"><span class="ico">${ic('trend')}</span><div><b>Conta a receber</b><small>receita</small></div></div></div>
    <div class="fg"><div class="fld s2"><label>Descrição <i>*</i></label><input id="nlDesc" placeholder="${NL.tipo === 'D' ? 'Ex.: Compra de ferramentas' : 'Ex.: Contrato de frota — novembro'}"></div>
      <div class="fld"><label>Valor <i>*</i></label><div class="inp"><span>R$</span><input id="nlVal" type="number" min="0" step=".01" placeholder="0,00"></div></div>
      <div class="fld"><label>Vencimento <i>*</i></label><input id="nlVenc" type="date" value="${D(7)}"></div>
      <div class="fld"><label>Categoria</label><select id="nlCat">${cats.map(c => `<option>${c}</option>`).join('')}</select></div>
      <div class="fld"><label>Forma</label><select id="nlForma"><option>Boleto</option><option>Pix</option><option>Transferência</option><option>Cartão de crédito</option><option>Débito automático</option></select></div>
      <div class="fld"><label>Repetir</label><select id="nlRep"><option value="1">Não repete</option><option value="3">Mensal por 3 meses</option><option value="12">Mensal por 12 meses</option></select></div>
      <div class="fld"><label>Centro de custo</label><select><option>Oficina</option><option>Administrativo</option><option>Comercial</option></select></div>
      <label class="check s2"><input type="checkbox" id="nlPago"> Já foi ${NL.tipo === 'D' ? 'pago' : 'recebido'}</label></div></div>
    <div class="mf"><button class="btn ghost" onclick="closeModal()">Cancelar</button><div class="r"><button class="btn" onclick="salvarLanc()">Salvar lançamento</button></div></div>`);
}
function salvarLanc() {
  const desc = $('#nlDesc').value.trim(), v = +$('#nlVal').value, venc = $('#nlVenc').value, rep = +$('#nlRep').value, pago = $('#nlPago').checked;
  if ([fieldErr('nlDesc', !desc), fieldErr('nlVal', !(v > 0)), fieldErr('nlVenc', !venc)].some(Boolean)) return toast('Preencha descrição, valor e vencimento.', 'warn');
  for (let i = 0; i < rep; i++) S.fin.unshift({id: SEQ.fin++, tipo: NL.tipo, desc: desc + (rep > 1 ? ` (${i + 1}/${rep})` : ''), cat: $('#nlCat').value, forma: $('#nlForma').value, venc: addD(venc, i * 30), valor: v, status: pago && !i ? 'Pago' : 'Pendente'});
  if (pago) { S.caixa += NL.tipo === 'R' ? v : -v; if (NL.tipo === 'D') S.despMes += v; }
  closeModal(); S.finF = 'Todos'; go('financeiro', 'contas'); toast(`Lançamento <b>${desc}</b> salvo${rep > 1 ? ` (${rep} parcelas)` : ''}.`);
}
function fiFluxo() {
  let saldo = S.caixa; const dias = 31, serie = [], ent = Array(dias).fill(0), sai = Array(dias).fill(0);
  S.fin.filter(f => f.status === 'Pendente').forEach(f => { const d = Math.max(0, diff(f.venc)); if (d < dias) (f.tipo === 'R' ? ent : sai)[d] += f.valor; });
  for (let i = 0; i < dias; i++) { saldo += ent[i] - sai[i] + (i && i % 1 === 0 ? 1850 : 0); serie.push(Math.round(saldo)); }
  const minV = Math.min(...serie), minD = serie.indexOf(minV);
  const prox = S.fin.filter(f => f.status === 'Pendente').sort((a, b) => a.venc.localeCompare(b.venc)); let run = S.caixa;
  return fiHead() + `<div class="grid k5" style="margin-bottom:16px">
    ${kpi('Saldo hoje', brl0(S.caixa), {icon: 'bank', hl: 1})}${kpi('Entradas previstas (30d)', brl0(sum(ent) + 1850 * 30), {icon: 'trend', sub: 'títulos + média diária de OS'})}
    ${kpi('Saídas previstas (30d)', brl0(sum(sai)), {icon: 'financeiro', c: 'amber'})}${kpi('Saldo em 30 dias', brl0(serie.at(-1)), {icon: 'check', c: 'blue'})}</div>
  ${minV < 20000 ? `<div class="al warn"><span class="ico">${ic('alert')}</span><div><b>Ponto de atenção em ${fmtD(D(minD))}</b>O saldo projetado chega a ${brl0(minV)}. Antecipe recebíveis de cartão ou negocie o vencimento de fornecedores.</div></div>` : ''}
  <div class="card"><div class="ct"><h3>Saldo projetado — próximos 30 dias</h3><span class="legend"><span><i style="background:${C.forest}"></i>Saldo</span><span><i style="background:${C.red}"></i>Reserva mínima (R$ 20k)</span></span></div>
    ${lineChart(Array.from({length: dias}, (_, i) => fmtDM(D(i))), [{n: 'Saldo', c: C.forest, area: C.lime, data: serie}], {ref: 20000, refL: 'reserva mínima', h: 260})}</div>
  <div class="card p0 mt"><div class="tbar"><h3 style="margin:0;font-size:16px">Movimentos previstos</h3><span class="mut sm">a partir do saldo de hoje</span></div><div class="tw"><table><thead><tr><th>Data</th><th>Lançamento</th><th class="num">Entrada</th><th class="num">Saída</th><th class="num">Saldo</th></tr></thead><tbody>
    ${prox.map(f => { run += f.tipo === 'R' ? f.valor : -f.valor; return `<tr><td>${fmtD(f.venc)}${diff(f.venc) < 0 ? ' <span class="b bad">vencido</span>' : ''}</td><td>${f.desc}</td><td class="num up">${f.tipo === 'R' ? brl(f.valor) : ''}</td><td class="num dn">${f.tipo === 'D' ? brl(f.valor) : ''}</td><td class="num"><b class="${run < 0 ? 'dn' : ''}">${brl(run)}</b></td></tr>`; }).join('')}</tbody></table></div></div>`;
}
function fiDre() {
  const r = S.fatMes, ant = S.hist.rec.at(-1);
  const L = [['Receita bruta', 1, 1], ['Mão de obra', .46, 0], ['Venda de peças', .5, 0], ['Pacotes e planos', .04, 0], ['(−) Impostos (Simples Nacional)', -.08, 1], ['(=) Receita líquida', .92, 2], ['(−) Custo das peças vendidas', -.29, 1], ['(=) Margem de contribuição', .63, 2], ['(−) Folha e encargos', -.27, 1], ['(−) Aluguel e despesas fixas', -.14, 1], ['(−) Marketing', -.03, 1], ['(−) Tarifas e financeiras', -.02, 1]];
  const res = .63 - .27 - .14 - .03 - .02;
  const row = (l, f, t) => { const a = r * f, b = ant * f * (t === 2 || l.startsWith('Receita') || !l.startsWith('(') ? 1 : 1.03), v = (a - b) / Math.abs(b) * 100;
    return `<tr style="${t === 2 ? 'background:var(--canvas);font-weight:700' : ''}"><td style="${t === 0 ? 'padding-left:34px;color:var(--slate)' : 'color:var(--obsidian)'}">${l}</td><td class="num">${brl(a)}</td><td class="num mut">${pct(Math.abs(f) * 100, 0)}</td><td class="num">${brl(b)}</td><td class="num"><span class="${(v >= 0) === (f >= 0) ? 'up' : 'dn'}">${v >= 0 ? '+' : ''}${pct(v)}</span></td></tr>`; };
  return fiHead() + `<div class="grid g2"><div class="card p0"><div class="tbar"><h3 style="margin:0;font-size:16px">DRE gerencial — ${MES[now.getMonth()]}/${now.getFullYear()}</h3><button class="btn sm sec" onclick="toast('DRE exportada para Excel.')">${ic('download')}Excel</button></div><div class="tw"><table><thead><tr><th>Conta</th><th class="num">Mês atual</th><th class="num">% receita</th><th class="num">Mês anterior</th><th class="num">Variação</th></tr></thead><tbody>
    ${L.map(x => row(...x)).join('')}<tr style="background:var(--forest)"><td style="color:var(--lime);font-weight:800">(=) Resultado operacional</td><td class="num" style="color:#fff;font-weight:800">${brl(r * res)}</td><td class="num" style="color:var(--lime)">${pct(res * 100, 0)}</td><td class="num" style="color:#cfdcc4">${brl(ant * res * .94)}</td><td class="num" style="color:var(--lime)">+${pct((r / (ant * .94) - 1) * 100)}</td></tr></tbody></table></div></div>
  <div><div class="card dark" style="padding:26px"><h3 style="margin:0 0 4px;font-size:15px">Ponto de equilíbrio</h3><div style="font-size:36px;font-weight:900;letter-spacing:-.05em;color:#fff">${brl0(r * .46 / .63)}</div><p style="margin:6px 0 0">Faturamento mínimo para cobrir custos fixos. No ritmo atual, ele é atingido por volta do dia ${Math.round(30 * .46 / .63)} de cada mês.</p></div>
    <div class="card mt"><div class="ct"><h3>Para onde vai cada R$ 100</h3></div>${hbars([{l: 'Peças', v: 29}, {l: 'Folha', v: 27}, {l: 'Fixas', v: 14}, {l: 'Impostos', v: 8}, {l: 'Marketing e taxas', v: 5}, {l: 'Resultado', v: 17, c: C.moss}], {fmt: v => 'R$ ' + v, max: 30})}</div></div></div>`;
}
