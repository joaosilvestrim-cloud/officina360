// ===== Ordens de serviço =====
const prazoChip = o => o.status === 'Entregue' ? '<span class="b ok">Entregue</span>' : diff(o.prazo) < 0 ? '<span class="b bad">Atrasada</span>' : diff(o.prazo) === 0 ? `<span class="b warn nd">Hoje ${o.hora}</span>` : `<span class="b nd">${fmtDM(o.prazo)} ${o.hora}</span>`;
VIEWS.os = () => {
  const ab = osAbertas(), mecs = ['Todos', ...S.mecanicos];
  const l = S.os.filter(o => S.osMec === 'Todos' || o.mec === S.osMec);
  const seg = `<div class="seg"><button class="${S.osMode === 'quadro' ? 'on' : ''}" onclick="S.osMode='quadro';render()">${ic('kanban')}Quadro</button><button class="${S.osMode === 'lista' ? 'on' : ''}" onclick="S.osMode='lista';render()">${ic('list')}Lista</button></div>`;
  let body;
  if (S.osMode === 'quadro') {
    body = `<div class="kanban">${S.osStatus.map((s, i) => { const os = l.filter(o => o.status === s && (s !== 'Entregue' || diff(o.entrada) >= -3));
      return `<div class="col"><div class="colh"><span><i style="background:${S.osCor[s]}"></i>${s}</span><small>${os.length} · ${brlK(sum(os, o => tot(o.itens)))}</small></div>${os.map(o => {
        const c = cli(o.cliente), p = Math.round(o.ck.length / CHECK.length * 100);
        return `<div class="kc" onclick="openDr('os',${o.id})"><div class="r1"><span class="t">OS ${o.id}</span>${prazoChip(o)}</div>
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">${plate(o.placa)}<span class="sm b6" style="color:var(--obsidian)">${veic(o.cliente, o.placa)}</span></div>
          <div class="m">${c.nome}</div><div class="m" style="margin-top:2px">${resumo(o.itens)}</div>
          <div class="prog" title="Checklist ${p}%"><div style="width:${p}%"></div></div>
          <div class="r3"><span class="who" style="gap:7px">${av(o.mec, 'sm')}<span class="sm">${o.mec.split(' ')[0]} · ${o.box}</span></span>${s !== 'Entregue' ? `<div class="arrows" onclick="event.stopPropagation()"><button onclick="moveOs(${o.id},-1)" ${i === 0 ? 'disabled' : ''} title="Voltar etapa">${ic('chevl')}</button><button onclick="moveOs(${o.id},1)" title="Avançar etapa">${ic('chev')}</button></div>` : `<b class="sm">${brl0(tot(o.itens))}</b>`}</div></div>`;
      }).join('') || '<div class="empty sm">Vazio</div>'}</div>`; }).join('')}</div>`;
  } else {
    body = `<div class="card p0"><div class="tw"><table><thead><tr><th>OS</th><th>Veículo</th><th>Cliente</th><th>Serviços</th><th>Mecânico</th><th>Prazo</th><th>Etapa</th><th class="num">Valor</th></tr></thead><tbody>
      ${l.map(o => `<tr class="click" onclick="openDr('os',${o.id})"><td><b>${o.id}</b><div class="sm mut">${fmtDM(o.entrada)}</div></td><td>${plate(o.placa)}<div class="sm mut" style="margin-top:3px">${veic(o.cliente, o.placa)}</div></td><td>${cli(o.cliente).nome}</td><td class="sm">${resumo(o.itens)}</td><td><div class="who">${av(o.mec, 'sm')}<span class="sm">${o.mec}</span></div></td><td>${prazoChip(o)}</td><td>${badge(o.status)}</td><td class="num"><b>${brl(tot(o.itens))}</b></td></tr>`).join('')}</tbody></table></div></div>`;
  }
  return head('Ordens de serviço', `${ab.length} veículos no pátio · ${ab.filter(o => o.status === 'Pronto').length} prontos para entrega · ${ab.filter(o => diff(o.prazo) < 0).length} atrasado(s)`,
    seg + `<button class="btn" onclick="wzOpen('os')">${ic('plus')}Nova OS</button>`) +
    `<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap">${chips(mecs.map(m => [m, m === 'Todos' ? 'Toda a equipe' : m.split(' ')[0], m === 'Todos' ? ab.length : ab.filter(o => o.mec === m).length]), S.osMec, 'osSetMec')}
    <span class="sm mut">Ao marcar <b>Pronto</b> o cliente é avisado; ao <b>entregar</b>, o estoque baixa e o financeiro recebe o lançamento.</span></div>` + body;
};
function osSetMec(m) { S.osMec = m; render(); }
function moveOs(id, d) {
  const o = osById(id), i = S.osStatus.indexOf(o.status) + d;
  if (i < 0 || i > 5) return;
  if (S.osStatus[i] === 'Entregue') return entOpen(id);
  o.status = S.osStatus[i]; o.hist.push({st: o.status, at: stamp(), by: 'Arthur'});
  const c = cli(o.cliente);
  if (o.status === 'Pronto') { o.ck = [...Array(CHECK.length).keys()]; c.msgs.push({out: 1, txt: `Olá, ${c.nome.split(' ')[0]}! Seu ${veic(o.cliente, o.placa)} está pronto. Total: ${brl(tot(o.itens))}.`, at: stamp()}); toast(`<b>SMS automático</b> enviado para ${c.nome}: veículo pronto para retirada.`); }
  else if (o.status === 'Aguardando peça') toast(`Cliente avisado do novo prazo. Peças faltantes entram na compra sugerida.`, 'warn');
  else toast(`OS ${id} movida para <b>${o.status}</b>.`);
  render();
}
function toggleCk(id, k) { const o = osById(id), i = o.ck.indexOf(k); i >= 0 ? o.ck.splice(i, 1) : o.ck.push(k); renderDrawer(); render(); }
DR.os = () => {
  const o = osById(S.dr.id); if (!o) return null;
  const c = cli(o.cliente), idx = S.osStatus.indexOf(o.status), tab = S.dr.tab;
  const pre = `<div class="osflow">${S.osStatus.map((s, i) => `<div class="${i < idx ? 'done' : i === idx ? 'on' : ''}"></div>`).join('')}</div><div class="osflowl">${S.osStatus.map((s, i) => `<span class="${i === idx ? 'on' : ''}">${s}</span>`).join('')}</div>`;
  let body;
  if (tab === 'resumo') {
    body = `<div class="ig"><div><small>Cliente</small><b>${c.nome}</b></div><div><small>Veículo</small><b>${veic(o.cliente, o.placa)}</b> ${plate(o.placa)}</div><div><small>Entrada</small><b>${fmtD(o.entrada)}</b></div><div><small>Previsão de entrega</small><b>${fmtD(o.prazo)} às ${o.hora}</b> ${diff(o.prazo) < 0 && o.status !== 'Entregue' ? '<span class="b bad">Atrasada</span>' : ''}</div><div><small>Quilometragem</small><b>${int(o.km)} km</b></div><div><small>Origem</small><b>${o.orc ? `<button class="lnk" onclick="go('orcamentos');openDr('orc',${o.orc})">Orçamento ${o.orc}</button>` : 'Abertura direta'}</b></div></div>
      ${o.status !== 'Entregue' ? `<div class="fg" style="margin-bottom:16px"><div class="fld"><label>Mecânico responsável</label><select onchange="osById(${o.id}).mec=this.value;render()">${S.mecanicos.map(m => `<option ${m === o.mec ? 'selected' : ''}>${m}</option>`).join('')}</select></div><div class="fld"><label>Box</label><select onchange="osById(${o.id}).box=this.value;render()">${S.boxes.map(b => `<option ${b === o.box ? 'selected' : ''}>${b}</option>`).join('')}</select></div></div>` : ''}
      ${o.relato ? `<div class="box" style="margin-bottom:16px"><small>Relato do cliente</small>${esc(o.relato)}</div>` : ''}
      <table><thead><tr><th>Item</th><th class="num">Qtd.</th><th class="num">Total</th></tr></thead><tbody>${o.itens.map(i => `<tr><td><b style="color:var(--obsidian)">${info(i).nome}</b><div class="sm mut">${i.t === 'S' ? 'Mão de obra' : `Peça ${i.r} · ${o.status === 'Entregue' ? 'baixada' : 'reservada'}`}</div></td><td class="num">${i.q}</td><td class="num">${brl(itVal(i))}</td></tr>`).join('')}</tbody></table>
      <div class="li" style="border:0;padding-top:14px"><span style="font-size:17px;font-weight:800;color:var(--obsidian)">Total</span><b style="font-size:20px;color:var(--obsidian)">${brl(tot(o.itens))}</b></div>
      <div class="minik"><div><small>Horas previstas</small><b>${String(horasPrev(o.itens)).replace('.', ',')} h</b></div><div><small>Horas apontadas</small><b>${String(o.horas).replace('.', ',')} h</b></div><div><small>Checklist</small><b>${o.ck.length}/${CHECK.length}</b></div></div>`;
  } else if (tab === 'checklist') {
    body = `<p class="mut" style="margin-top:0">Preenchido no tablet pelo mecânico. Toque para marcar.</p>${CHECK.map((t, k) => { const on = o.ck.includes(k); return `<div class="ck ${on ? 'on' : ''}" onclick="toggleCk(${o.id},${k})"><span class="bx">${on ? ic('check') : ''}</span><span>${t}</span></div>`; }).join('')}`;
  } else if (tab === 'fotos') {
    const f = ['Frente', 'Traseira', 'Lateral esquerda', 'Lateral direita', 'Painel e km', 'Peça substituída'];
    body = `<p class="mut" style="margin-top:0">Fotos da entrada e do serviço — enviadas ao cliente junto do orçamento.</p><div class="fotos">${f.slice(0, 2 + Math.min(4, idx + 1)).map(x => `<div class="foto">${ic('camera')}${x}</div>`).join('')}<div class="foto add" onclick="toast('No tablet/celular abre a câmera; a foto entra direto na OS.')">${ic('plus')}Adicionar foto</div></div>`;
  } else {
    body = `<div class="tl">${[...o.hist].reverse().map((h, i) => `<div class="tli ${i === 0 ? 'ok' : ''}"><b>${h.st}</b><small>${h.at} · ${h.by}</small></div>`).join('')}</div>`;
  }
  const next = S.osStatus[idx + 1];
  const foot = o.status === 'Entregue' ? `<button class="btn ghost" onclick="toast('Recibo e NFS-e reenviados por e-mail.')">${ic('send')}Reenviar recibo</button><button class="btn sec" onclick="toast('PDF da OS gerado.')">${ic('print')}Imprimir</button>`
    : `<button class="btn ghost" onclick="toast('PDF da OS gerado para assinatura.')">${ic('print')}Imprimir</button>${idx > 0 ? `<button class="btn sec" onclick="moveOs(${o.id},-1)">${ic('chevl')}Voltar etapa</button>` : ''}${next === 'Entregue' ? `<button class="btn" onclick="entOpen(${o.id})">${ic('check')}Entregar veículo</button>` : `<button class="btn" onclick="moveOs(${o.id},1)">Avançar para ${next} ${ic('arrow')}</button>`}`;
  return {av: `<span class="kic dark" style="width:52px;height:52px">${ic('os')}</span>`, h: `OS ${o.id} ${badge(o.status)}`, sub: `${c.nome} · ${veic(o.cliente, o.placa)} · ${o.mec}`, pre, body, foot};
};

// ===== entrega: pagamento → nota → baixa de estoque → financeiro =====
let EN = null;
const FPS = [['Pix', 'zap', 'na hora'], ['Cartão de crédito', 'financeiro', 'até 6x'], ['Cartão de débito', 'financeiro', 'na hora'], ['Dinheiro', 'financeiro', 'troco no caixa'], ['Faturado 30 dias', 'file', 'boleto para empresa']];
function entOpen(id) { EN = {id, step: 0, fp: 'Pix', parc: 1, desc: 0}; entRender(); }
function entTotal() { return tot(osById(EN.id).itens) * (1 - EN.desc / 100); }
function entRender() {
  const o = osById(EN.id), c = cli(o.cliente);
  if (EN.step === 0) {
    openModal(mHead(`Entregar veículo — OS ${o.id}`, `${c.nome} · ${veic(o.cliente, o.placa)} · ${o.placa}`) + stepper(['Pagamento', 'Processamento', 'Concluído'], 0) + `<div class="mb">
      <div class="fsec"><h4>Itens</h4>${o.itens.map(i => `<div class="li" style="padding:6px 0"><span>${info(i).nome}${i.q > 1 ? ` ×${i.q}` : ''}</span><span class="num">${brl(itVal(i))}</span></div>`).join('')}</div>
      <div class="fld" style="margin-bottom:14px"><label>Forma de pagamento</label><div class="radios cols">${FPS.map(([f, ico, s]) => `<div class="rc ${EN.fp === f ? 'on' : ''}" onclick="EN.fp='${f}';entRender()"><span class="ico">${ic(ico)}</span><div><b>${f}</b><small>${s}</small></div></div>`).join('')}</div></div>
      <div class="fg">${EN.fp === 'Cartão de crédito' ? `<div class="fld"><label>Parcelas</label><select onchange="EN.parc=+this.value;$('#enParc').textContent=this.value>1?this.value+'x de '+brl(entTotal()/this.value):''">${[1, 2, 3, 4, 5, 6].map(p => `<option value="${p}" ${p === EN.parc ? 'selected' : ''}>${p}x sem juros</option>`).join('')}</select></div>` : ''}
        <div class="fld"><label>Desconto na entrega</label><div class="inp"><input type="number" min="0" max="15" value="${EN.desc}" oninput="EN.desc=Math.min(15,Math.max(0,+this.value||0));$('#enTot').textContent=brl(entTotal())"><span>%</span></div></div></div>
      <div class="card dark" style="margin-top:16px;display:flex;justify-content:space-between;align-items:center;padding:20px 24px"><span>Total a receber <span id="enParc" style="opacity:.75"></span></span><b id="enTot" style="font-size:30px;color:var(--lime);font-weight:900;letter-spacing:-.04em">${brl(entTotal())}</b></div>
      <p class="sm mut" style="margin-bottom:0">Ao confirmar: emissão da NFS-e, baixa das peças no estoque, lançamento no financeiro e pesquisa NPS agendada para daqui a 2 dias.</p></div>
      <div class="mf"><button class="btn ghost" onclick="closeModal()">Cancelar</button><div class="r"><button class="btn" onclick="entConfirm()">${ic('check')}Confirmar e emitir nota</button></div></div>`);
  } else if (EN.step === 1) {
    const st = ['Registrando pagamento', 'Emitindo NFS-e na prefeitura', 'Baixando peças do estoque', 'Lançando no financeiro', 'Agendando pesquisa de satisfação'];
    openModal(mHead(`Processando OS ${o.id}`, 'Tudo integrado, sem digitar nada duas vezes.') + stepper(['Pagamento', 'Processamento', 'Concluído'], 1) + `<div class="mb proc">${st.map((s, i) => `<div class="pi" id="pr${i}"><span class="wait"></span>${s}</div>`).join('')}</div>`);
    st.forEach((_, i) => { setTimeout(() => { const el = $('#pr' + i); if (el) el.firstChild.outerHTML = '<span class="spin"></span>'; }, i * 420); setTimeout(() => { const el = $('#pr' + i); if (el) el.firstChild.outerHTML = `<span class="donei">${ic('check')}</span>`; }, i * 420 + 400); });
    setTimeout(() => { entFinal(); EN.step = 2; entRender(); }, st.length * 420 + 300);
  } else {
    const n = 4800 + o.id % 100;
    openModal(stepper(['Pagamento', 'Processamento', 'Concluído'], 3) + `<div class="mb success"><div class="big">${ic('check')}</div><h3>Veículo entregue!</h3><p class="mut">OS ${o.id} · ${c.nome}</p>
      <div class="minik" style="text-align:left;margin-top:20px"><div><small>Recebido</small><b>${brl(EN.v)}</b></div><div><small>Forma</small><b>${EN.fp}</b></div><div><small>NFS-e</small><b>nº 004.${n}</b></div><div><small>Próxima revisão</small><b>${fmtD(D(180))}</b></div></div></div>
      <div class="mf"><button class="btn ghost" onclick="closeModal()">Fechar</button><div class="r"><button class="btn" onclick="closeModal();toast('Recibo e NFS-e enviados para ${c.nome} por e-mail.')">${ic('send')}Enviar recibo por e-mail</button></div></div>`, 'sm');
  }
}
function entConfirm() { EN.step = 1; entRender(); }
function entFinal() {
  const o = osById(EN.id), c = cli(o.cliente), v = entTotal(), pend = EN.fp.startsWith('Faturado');
  EN.v = v;
  o.itens.filter(i => i.t === 'P').forEach(i => { const p = peca(i.r); p.qtd = Math.max(0, p.qtd - i.q); p.ult = 0; S.movs.unshift({data: D(0), tipo: 'Saída', cod: p.cod, q: i.q, origem: `OS ${o.id}`, user: o.mec}); });
  S.fin.unshift({id: SEQ.fin++, tipo: 'R', desc: `OS ${o.id} — ${c.nome}`, cat: 'Serviços', forma: EN.fp + (EN.parc > 1 ? ` ${EN.parc}x` : ''), venc: pend ? D(30) : D(0), valor: v, status: pend ? 'Pendente' : 'Pago'});
  if (!pend) S.caixa += v;
  S.fatMes += v; S.osMes++; c.gasto += v; c.visitas++; c.ultimo = D(0); c.proxRev = D(180);
  o.status = 'Entregue'; o.hist.push({st: `Entregue · ${EN.fp} · NFS-e emitida`, at: stamp(), by: 'Arthur'});
  closeDrawer(); render();
  const low = baixo(); if (low.length) setTimeout(() => toast(`<b>${low.length} peças</b> abaixo do mínimo após a baixa. Veja a compra sugerida.`, 'warn'), 900);
}
