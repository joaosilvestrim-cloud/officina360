// ===== Orçamentos =====
VIEWS.orcamentos = () => {
  const st = ['Todos', 'Rascunho', 'Enviado', 'Aprovado', 'Recusado'], env = S.orcamentos.filter(o => o.status === 'Enviado'), q = norm(S.orcQ);
  const l = S.orcamentos.filter(o => S.orcF === 'Todos' || o.status === S.orcF).filter(o => !q || norm(`${o.id} ${o.placa} ${cli(o.cliente).nome}`).includes(q));
  return head('Orçamentos', 'Do orçamento à aprovação pelo link — sem papel e sem ligação', `<button class="btn" onclick="wzOpen('orc')">${ic('plus')}Novo orçamento</button>`) + `
  <div class="grid k5" style="margin-bottom:16px">
    ${kpi('Aguardando resposta', env.length, {icon: 'clock', hl: 1, sub: brl0(sum(env, orcTot)) + ' em potencial'})}
    ${kpi('Conversão no mês', pct(S.kpi.orcApr / S.kpi.orcEnv * 100), {icon: 'check', delta: 2.3, sub: `${S.kpi.orcApr} de ${S.kpi.orcEnv}`})}
    ${kpi('Tempo até aprovação', '5,2 h', {icon: 'zap', c: 'blue', delta: -18, sub: 'antes: 1,4 dia por telefone'})}
    ${kpi('Valor aprovado no mês', brl0(S.aprovMes), {icon: 'financeiro', c: 'amber', delta: 9.1})}
  </div>
  <div class="card p0"><div class="tbar">${chips(st.map(s => [s, s, s === 'Todos' ? S.orcamentos.length : S.orcamentos.filter(o => o.status === s).length]), S.orcF, 'orcSetF')}
    <div class="tsearch">${ic('search')}<input placeholder="Nº, placa ou cliente" value="${esc(S.orcQ)}" onchange="S.orcQ=this.value;render()"></div></div>
  <div class="tw"><table><thead><tr><th>Nº</th><th>Cliente</th><th>Veículo</th><th>Serviços</th><th>Validade</th><th class="num">Valor</th><th>Status</th><th></th></tr></thead><tbody>
  ${l.map(o => { const c = cli(o.cliente), venc = o.status === 'Enviado' && diff(o.validade) < 0;
    return `<tr class="click" onclick="openDr('orc',${o.id})"><td><b>${o.id}</b><div class="sm mut">${fmtDM(o.data)}</div></td><td><div class="who">${av(c.nome, 'sm')}<b>${c.nome}</b></div></td>
    <td>${plate(o.placa)}<div class="sm mut" style="margin-top:3px">${veic(o.cliente, o.placa)}</div></td><td class="sm">${resumo(o.itens)}<div class="mut">${o.itens.filter(i => i.t === 'P').length} peça(s)</div></td>
    <td class="${venc ? 'dn' : ''}">${fmtD(o.validade)}<div class="sm mut">${rel(o.validade)}</div></td><td class="num"><b>${brl(orcTot(o))}</b>${o.desc ? `<div class="sm mut">−${o.desc}%</div>` : ''}</td><td>${badge(o.status)}</td>
    <td class="num" onclick="event.stopPropagation()">${o.status === 'Enviado' ? `<button class="btn sm" onclick="portal(${o.id})">${ic('phone')}Ver como cliente</button>` : o.status === 'Rascunho' ? `<button class="btn sm sec" onclick="enviarOrc(${o.id})">${ic('send')}Enviar</button>` : o.os ? `<button class="btn sm ghost" onclick="go('os');openDr('os',${o.os})">OS ${o.os}</button>` : ''}</td></tr>`; }).join('') || '<tr><td colspan="8" class="empty">Nenhum orçamento.</td></tr>'}
  </tbody></table></div></div>`;
};
function orcSetF(k) { S.orcF = k; render(); }
DR.orc = () => {
  const o = orcById(S.dr.id); if (!o) return null;
  const c = cli(o.cliente), sub = tot(o.itens);
  const body = S.dr.tab === 'itens' ? `${o.relato ? `<div class="box" style="margin-bottom:16px"><small>Relato do cliente</small>${esc(o.relato)}</div>` : ''}
    <table><thead><tr><th>Item</th><th class="num">Qtd.</th><th class="num">Unit.</th><th class="num">Total</th></tr></thead><tbody>${o.itens.map(i => `<tr><td><b style="color:var(--obsidian)">${info(i).nome}</b><div class="sm mut">${i.t === 'S' ? 'Mão de obra · ' + serv(i.r).h + ' h' : 'Peça · ' + i.r}</div></td><td class="num">${i.q}</td><td class="num">${brl(info(i).preco)}</td><td class="num">${brl(itVal(i))}</td></tr>`).join('')}</tbody></table>
    <div class="ig" style="margin-top:16px;grid-template-columns:1fr auto;gap:6px 20px"><span class="mut">Subtotal</span><b class="num">${brl(sub)}</b>${o.desc ? `<span class="mut">Desconto (${o.desc}%)</span><b class="num dn">− ${brl(sub * o.desc / 100)}</b>` : ''}<span style="font-size:18px;font-weight:800;color:var(--obsidian)">Total</span><b class="num" style="font-size:20px">${brl(orcTot(o))}</b></div>
    <div class="minik"><div><small>Emissão</small><b>${fmtD(o.data)}</b></div><div><small>Validade</small><b>${fmtD(o.validade)}</b></div><div><small>Tempo previsto</small><b>${String(horasPrev(o.itens)).replace('.', ',')} h</b></div></div>`
    : `<div class="tl">${o.hist.map(h => `<div class="tli ${h.ok ? 'ok' : ''}"><b>${h.t}</b><small>${h.at} · ${h.by}</small></div>`).join('')}</div>`;
  const acts = {
    Rascunho: `<button class="btn sec" onclick="closeDrawer();wzEdit(${o.id})">${ic('edit')}Editar</button><button class="btn" onclick="enviarOrc(${o.id})">${ic('send')}Enviar ao cliente</button>`,
    Enviado: `<button class="btn danger" onclick="recusarOrc(${o.id})">Recusar</button><button class="btn sec" onclick="aprovarOrc(${o.id})">Aprovar manualmente</button><button class="btn" onclick="portal(${o.id})">${ic('phone')}Ver como cliente</button>`,
    Aprovado: `<button class="btn" onclick="go('os');openDr('os',${o.os})">${ic('os')}Abrir OS ${o.os || ''}</button>`,
    Recusado: `<button class="btn sec" onclick="reabrirOrc(${o.id})">${ic('refresh')}Reabrir</button>`,
  }[o.status];
  return {av: `<span class="kic dark" style="width:52px;height:52px">${ic('orcamentos')}</span>`, h: `Orçamento ${o.id} ${badge(o.status)}`, sub: `${c.nome} · ${veic(o.cliente, o.placa)} · ${o.placa}`, body,
    foot: `<button class="btn ghost" onclick="toast('PDF do orçamento gerado com a marca da oficina.')">${ic('print')}PDF</button><button class="btn ghost" onclick="wzDup(${o.id})">${ic('copy')}Duplicar</button>${acts}`};
};
function enviarOrc(id) {
  const o = orcById(id); o.status = 'Enviado'; S.kpi.orcEnv++;
  o.hist.push({t: 'Enviado por SMS e e-mail', at: stamp(), by: 'Arthur'});
  toast(`Orçamento <b>${id}</b> enviado para ${cli(o.cliente).nome} com link de aprovação.`); render();
}
function aprovarOrc(id, sel) {
  const o = orcById(id), itens = o.itens.filter((_, k) => !sel || sel[k]).map(i => ({...i}));
  const n = SEQ.os++, mec = S.mecanicos[n % 4], c = cli(o.cliente);
  o.status = 'Aprovado'; o.os = n; S.kpi.orcApr++; S.aprovMes += tot(itens) * (1 - (o.desc || 0) / 100);
  o.hist.push({t: sel && sel.some(x => !x) ? `Aprovado parcialmente (${itens.length} de ${o.itens.length} itens)` : 'Aprovado', at: stamp(), by: sel ? c.nome + ' (link)' : 'Arthur', ok: 1});
  S.os.unshift({id: n, cliente: o.cliente, placa: o.placa, itens, mec, box: S.boxes[n % 3], status: 'Aguardando', entrada: D(0), prazo: D(1), hora: '17:00', km: c.veiculos.find(v => v.placa === o.placa)?.km || 0, relato: o.relato, orc: id,
    hist: [{st: 'OS aberta a partir do orçamento ' + id, at: stamp(), by: 'Sistema'}], ck: [], horas: 0});
  pushNotif('check', '', `<b>${c.nome}</b> aprovou o orçamento ${id} — OS ${n} criada`, ['os'], ['os', n]);
  toast(`Orçamento aprovado. <b>OS ${n}</b> aberta e atribuída a ${mec}.`); render();
}
function recusarOrc(id) {
  openModal(mHead('Recusar orçamento ' + id, 'O motivo alimenta os relatórios comerciais.') + `<div class="mb"><div class="radios">${['Preço', 'Vai fazer em outro lugar', 'Adiou o serviço', 'Sem resposta do cliente', 'Outro'].map((m, i) => `<label class="rc ${i ? '' : 'on'}" onclick="document.querySelectorAll('#mbox .rc').forEach(e=>e.classList.remove('on'));this.classList.add('on')"><input type="radio" name="mot" value="${m}" ${i ? '' : 'checked'} hidden><b>${m}</b></label>`).join('')}</div>
    <label class="check" style="margin-top:14px"><input type="checkbox" checked> Incluir o cliente na campanha de reativação em 30 dias</label></div>
    <div class="mf"><button class="btn ghost" onclick="closeModal()">Cancelar</button><div class="r"><button class="btn dark" onclick="confRecusa(${id})">Confirmar recusa</button></div></div>`, 'sm');
}
function confRecusa(id) { const o = orcById(id), m = document.querySelector('input[name=mot]:checked').value; o.status = 'Recusado'; o.motivo = m; o.hist.push({t: `Recusado — motivo: ${m}`, at: stamp(), by: 'Arthur'}); closeModal(); render(); toast('Orçamento marcado como recusado.', 'warn'); }
function reabrirOrc(id) { const o = orcById(id); o.status = 'Rascunho'; o.validade = D(7); o.hist.push({t: 'Reaberto', at: stamp(), by: 'Arthur'}); render(); toast('Orçamento reaberto como rascunho.'); }

// ===== visão do cliente (link de aprovação) =====
let PT = null;
function portal(id) { const o = orcById(id); PT = {id, sel: o.itens.map(() => true)}; ptRender(); }
function ptRender() {
  const o = orcById(PT.id), c = cli(o.cliente), itens = o.itens.filter((_, k) => PT.sel[k]), t = tot(itens) * (1 - (o.desc || 0) / 100);
  openModal(`<div class="ptwrap"><div class="ptside"><span class="b lime nd">Simulação</span><h3 style="margin-top:14px">É isto que ${c.nome.split(' ')[0]} recebe por SMS e e-mail.</h3>
    <p class="mut">Um link seguro com o orçamento, fotos do diagnóstico e aprovação item a item. A resposta volta direto para o sistema e abre a OS.</p>
    <ul class="ticks"><li>Sem login e sem baixar app</li><li>Aprovação parcial de itens</li><li>Data, hora e IP registrados</li><li>Pagamento antecipado por Pix (opcional)</li></ul>
    <button class="btn sec" onclick="closeModal()">Fechar simulação</button></div>
    <div class="phone"><div class="notch"></div><div class="pscreen"><div class="pth">${LOGO}<div><b>Oficina do Arthur</b><small>Bosch Car Service</small></div></div>
      <div class="ptc"><small class="mut">Orçamento nº ${o.id} · válido até ${fmtDM(o.validade)}</small><h4>Olá, ${c.nome.split(' ')[0]}!</h4><p>Este é o orçamento do seu <b>${veic(o.cliente, o.placa)}</b> (${o.placa}).</p>
      <div class="ptfotos"><div>${ic('camera')}</div><div>${ic('camera')}</div><div>${ic('camera')}</div></div>
      ${o.itens.map((it, k) => `<label class="ptit ${PT.sel[k] ? '' : 'off'}"><input type="checkbox" ${PT.sel[k] ? 'checked' : ''} ${o.status !== 'Enviado' ? 'disabled' : ''} onchange="PT.sel[${k}]=this.checked;ptRender()"><span>${info(it).nome}${it.q > 1 ? ` ×${it.q}` : ''}<small>${it.t === 'S' ? 'Mão de obra' : 'Peça'}</small></span><b>${brl(itVal(it))}</b></label>`).join('')}
      ${o.desc ? `<div class="ptrow"><span>Desconto</span><span>−${o.desc}%</span></div>` : ''}<div class="ptrow tot"><span>Total</span><span>${brl(t)}</span></div>
      ${o.status === 'Enviado' ? `<button class="btn full" onclick="ptAprovar()">${ic('check')}Aprovar ${PT.sel.every(x => x) ? 'orçamento' : 'itens marcados'}</button><button class="btn full ghost" style="margin-top:6px" onclick="toast('Ligando para a oficina…')">Tenho uma dúvida</button>` : `<div class="b ok nd" style="display:flex;justify-content:center;padding:10px">Orçamento ${o.status.toLowerCase()}</div>`}
      </div></div></div></div>`, 'wide');
}
function ptAprovar() { if (!PT.sel.some(Boolean)) return toast('Marque ao menos um item.', 'warn'); closeModal(); aprovarOrc(PT.id, PT.sel); }

// ===== assistente de orçamento / OS =====
let WZ = null;
function wzOpen(mode = 'orc', cid = null, placa = null, servId = null) {
  const c = cid && cli(cid), v = c && (c.veiculos.find(x => x.placa === placa) || c.veiculos[0]);
  WZ = {mode, step: cid ? 1 : 0, cliente: cid, placa: v ? v.placa : null, km: v ? v.km : '', relato: '', itens: servId ? [{t: 'S', r: servId, q: 1}] : [], desc: 0, val: 7, wa: true, em: false, mec: S.mecanicos[0], box: S.boxes[0], prazo: D(1), hora: '17:00'};
  closeDrawer(); wzRender();
}
function wzEdit(id) { const o = orcById(id); WZ = {mode: 'orc', edit: id, step: 1, cliente: o.cliente, placa: o.placa, km: '', relato: o.relato || '', itens: o.itens.map(i => ({...i})), desc: o.desc || 0, val: 7, wa: true, em: false}; wzRender(); }
function wzDup(id) { const o = orcById(id); wzOpen('orc', o.cliente, o.placa); WZ.itens = o.itens.map(i => ({...i})); WZ.relato = o.relato || ''; wzRender(); toast('Itens copiados para um novo orçamento.'); }
function wzSetCli(v) { WZ.cliente = +v || null; const c = WZ.cliente && cli(WZ.cliente); WZ.placa = c ? c.veiculos[0].placa : null; WZ.km = c ? c.veiculos[0].km : ''; wzRender(); }
function wzItens() {
  if (!WZ.itens.length) return '<div class="empty" style="background:var(--canvas);border-radius:14px">Use um pacote rápido ou adicione serviços e peças acima.</div>';
  return `<table><thead><tr><th>Item</th><th class="num">Qtd.</th><th class="num">Unit.</th><th class="num">Total</th><th></th></tr></thead><tbody>${WZ.itens.map((i, k) => { const x = info(i), d = i.t === 'P' ? disp(x) : null;
    return `<tr><td><b style="color:var(--obsidian)">${x.nome}</b><div class="sm">${i.t === 'S' ? `<span class="mut">Mão de obra · ${x.h} h</span>` : d >= i.q ? `<span class="up">● ${d} disponível(is) — será reservado</span>` : `<span class="dn">● sem saldo — entra na compra sugerida</span>`}</div></td>
      <td class="num"><span class="qty"><button onclick="wzQ(${k},-1)">−</button><span>${i.q}</span><button onclick="wzQ(${k},1)">+</button></span></td><td class="num">${brl(x.preco)}</td><td class="num"><b>${brl(itVal(i))}</b></td><td class="num"><button class="iconbtn" style="width:32px;height:32px" onclick="WZ.itens.splice(${k},1);$('#wzItens').innerHTML=wzItens()">${ic('trash')}</button></td></tr>`; }).join('')}</tbody></table>
    <div class="li" style="padding:14px 4px 0;border:0"><span class="mut">${WZ.itens.length} itens · ${String(horasPrev(WZ.itens)).replace('.', ',')} h de mão de obra</span><b style="font-size:20px;color:var(--obsidian);letter-spacing:-.03em">${brl(tot(WZ.itens))}</b></div>`;
}
function wzQ(k, d) { WZ.itens[k].q = Math.max(1, WZ.itens[k].q + d); $('#wzItens').innerHTML = wzItens(); }
function wzAdd() { const [t, r] = $('#wzItem').value.split('|'), q = Math.max(1, +$('#wzQtd').value || 1), ex = WZ.itens.find(i => i.t === t && i.r === r); ex ? ex.q += q : WZ.itens.push({t, r, q}); $('#wzItens').innerHTML = wzItens(); }
function wzPack(k) { PACKS[k].it.forEach(([t, r, q]) => { const ex = WZ.itens.find(i => i.t === t && i.r === r); ex ? ex.q = Math.max(ex.q, q) : WZ.itens.push({t, r, q}); }); $('#wzItens').innerHTML = wzItens(); toast(`Pacote <b>${PACKS[k].n}</b> adicionado.`); }
function wzRender() {
  const isOs = WZ.mode === 'os', c = WZ.cliente && cli(WZ.cliente);
  let b;
  if (WZ.step === 0) {
    b = `<div class="fsec"><h4><span class="n">1</span>Cliente</h4><div class="fld"><label>Cliente <i>*</i></label><select id="wzCli" onchange="wzSetCli(this.value)"><option value="">Selecione o cliente…</option>${S.clientes.map(x => `<option value="${x.id}" ${x.id === WZ.cliente ? 'selected' : ''}>${esc(x.nome)} — ${x.veiculos.map(v => v.placa).join(', ')}</option>`).join('')}</select>
      <span class="hint">Não encontrou? <button class="lnk" onclick="closeModal();novoCliente('${WZ.mode}')">Cadastrar novo cliente</button></span></div></div>
      ${c ? `<div class="fsec"><h4><span class="n">2</span>Veículo</h4><div class="radios">${c.veiculos.map(v => `<div class="rc ${v.placa === WZ.placa ? 'on' : ''}" onclick="WZ.placa='${v.placa}';WZ.km=${v.km};wzRender()"><span class="ico">${ic('car')}</span><div><b>${esc(v.modelo)}</b><small>${int(v.km)} km</small></div><span class="rv">${plate(v.placa)}</span></div>`).join('')}</div>
      <div class="fg" style="margin-top:14px"><div class="fld"><label>Quilometragem atual</label><div class="inp"><input type="number" value="${WZ.km}" oninput="WZ.km=this.value"><span>km</span></div></div>
      <div class="fld"><label>Relato do cliente</label><input value="${esc(WZ.relato)}" oninput="WZ.relato=this.value" placeholder="Ex.: barulho ao frear"></div></div></div>` : ''}`;
  } else if (WZ.step === 1) {
    b = `<div class="box" style="display:flex;gap:12px;align-items:center;margin-bottom:16px">${av(c.nome)}<div style="flex:1"><b style="color:var(--obsidian)">${c.nome}</b><div class="sm mut">${veic(c.id, WZ.placa)}</div></div>${plate(WZ.placa)}<button class="lnk sm" onclick="WZ.step=0;wzRender()">Trocar</button></div>
      <div class="fld" style="margin-bottom:16px"><label>Pacotes rápidos</label><div class="chips">${PACKS.map((p, k) => `<button class="chip" onclick="wzPack(${k})">${ic('zap')}${p.n}</button>`).join('')}</div></div>
      <div class="fg" style="grid-template-columns:1fr 96px auto;align-items:end"><div class="fld"><label>Adicionar serviço ou peça</label><select id="wzItem"><optgroup label="Mão de obra">${S.servicos.map(s => `<option value="S|${s.id}">${s.nome} — ${brl(s.preco)}</option>`).join('')}</optgroup>
        <optgroup label="Peças (disponível)">${S.estoque.map(p => `<option value="P|${p.cod}">${p.nome} — ${brl(p.preco)} (${disp(p)})</option>`).join('')}</optgroup></select></div>
        <div class="fld"><label>Qtd.</label><input id="wzQtd" type="number" min="1" value="1"></div><button class="btn dark" onclick="wzAdd()">${ic('plus')}Adicionar</button></div>
      <div id="wzItens" style="margin-top:16px">${wzItens()}</div>`;
  } else {
    const sub = tot(WZ.itens);
    b = `<div class="grid g11" style="gap:14px"><div class="fsec" style="margin:0"><h4>Resumo</h4><div class="ig" style="margin:0"><div><small>Cliente</small><b>${c.nome}</b></div><div><small>Veículo</small><b>${veic(c.id, WZ.placa)}</b></div><div><small>Itens</small><b>${WZ.itens.length}</b></div><div><small>Mão de obra</small><b>${String(horasPrev(WZ.itens)).replace('.', ',')} h</b></div></div></div>
      <div class="fsec" style="margin:0"><h4>Condições</h4><div class="fg"><div class="fld"><label>Desconto</label><div class="inp"><input type="number" min="0" max="30" value="${WZ.desc}" oninput="WZ.desc=Math.min(30,Math.max(0,+this.value||0));$('#wzTot').textContent=brl(tot(WZ.itens)*(1-WZ.desc/100))"><span>%</span></div><span class="hint">Até 30% sem aprovação do gestor</span></div>
      ${isOs ? `<div class="fld"><label>Previsão de entrega</label><input type="date" value="${WZ.prazo}" onchange="WZ.prazo=this.value"></div>` : `<div class="fld"><label>Validade</label><select onchange="WZ.val=+this.value">${[3, 7, 15].map(d => `<option value="${d}" ${d === WZ.val ? 'selected' : ''}>${d} dias</option>`).join('')}</select></div>`}</div></div></div>
      ${isOs ? `<div class="fg" style="margin-top:14px"><div class="fld"><label>Mecânico responsável</label><select onchange="WZ.mec=this.value">${S.mecanicos.map(m => `<option>${m}</option>`).join('')}</select></div><div class="fld"><label>Box</label><select onchange="WZ.box=this.value">${S.boxes.map(x => `<option>${x}</option>`).join('')}</select></div></div>` :
      `<div class="fld" style="margin-top:14px"><label>Enviar por</label><div style="display:flex;gap:20px"><label class="check"><input type="checkbox" ${WZ.wa ? 'checked' : ''} onchange="WZ.wa=this.checked"> SMS com link de aprovação</label><label class="check"><input type="checkbox" ${WZ.em ? 'checked' : ''} onchange="WZ.em=this.checked"> E-mail com PDF</label></div></div>`}
      <div class="card dark" style="margin-top:16px;display:flex;justify-content:space-between;align-items:center;padding:20px 24px"><span>Total ${WZ.desc ? `<span style="opacity:.7">(subtotal ${brl(sub)})</span>` : ''}</span><b id="wzTot" style="font-size:30px;color:var(--lime);letter-spacing:-.04em;font-weight:900">${brl(sub * (1 - WZ.desc / 100))}</b></div>`;
  }
  const steps = ['Cliente e veículo', 'Serviços e peças', isOs ? 'Abertura da OS' : 'Revisão e envio'];
  const fin = WZ.step < 2 ? `<button class="btn" onclick="wzNext()">Continuar ${ic('arrow')}</button>` : isOs ? `<button class="btn" onclick="wzSave('os')">${ic('os')}Abrir OS</button>`
    : `<button class="btn sec" onclick="wzSave('Rascunho')">Salvar rascunho</button><button class="btn" onclick="wzSave('Enviado')">${ic('send')}Enviar ao cliente</button>`;
  openModal(mHead(WZ.edit ? `Editar orçamento ${WZ.edit}` : isOs ? 'Nova ordem de serviço' : 'Novo orçamento', isOs ? 'Abertura direta, sem passar por orçamento' : 'Preços do catálogo e saldo do estoque em tempo real') + stepper(steps, WZ.step) + `<div class="mb">${b}</div>
    <div class="mf"><button class="btn ghost" onclick="${WZ.step ? 'WZ.step--;wzRender()' : 'closeModal()'}">${WZ.step ? 'Voltar' : 'Cancelar'}</button><div class="r">${fin}</div></div>`, 'wide');
}
function wzNext() {
  if (WZ.step === 0 && (!WZ.cliente || !WZ.placa)) { fieldErr('wzCli', true); return toast('Selecione o cliente e o veículo.', 'warn'); }
  if (WZ.step === 1 && !WZ.itens.length) return toast('Adicione ao menos um item.', 'warn');
  WZ.step++; wzRender();
}
function wzSave(status) {
  const c = cli(WZ.cliente);
  if (status === 'os') {
    const n = SEQ.os++;
    S.os.unshift({id: n, cliente: WZ.cliente, placa: WZ.placa, itens: WZ.itens, mec: WZ.mec, box: WZ.box, status: 'Aguardando', entrada: D(0), prazo: WZ.prazo, hora: '17:00', km: +WZ.km || 0, relato: WZ.relato, hist: [{st: 'OS aberta', at: stamp(), by: 'Arthur'}], ck: [], horas: 0});
    closeModal(); go('os'); openDr('os', n); return toast(`<b>OS ${n}</b> aberta para ${c.nome}. Peças reservadas no estoque.`);
  }
  let id = WZ.edit;
  if (id) { const o = orcById(id); Object.assign(o, {itens: WZ.itens, desc: WZ.desc, relato: WZ.relato, status, validade: D(WZ.val)}); o.hist.push({t: 'Orçamento editado', at: stamp(), by: 'Arthur'}); }
  else { id = SEQ.orc++; S.orcamentos.unshift({id, cliente: WZ.cliente, placa: WZ.placa, itens: WZ.itens, status, data: D(0), validade: D(WZ.val), desc: WZ.desc, relato: WZ.relato, hist: [{t: 'Orçamento criado', at: stamp(), by: 'Arthur'}]}); }
  const o = orcById(id);
  if (status === 'Enviado') { S.kpi.orcEnv++; o.hist.push({t: `Enviado por ${[WZ.wa && 'SMS', WZ.em && 'e-mail'].filter(Boolean).join(' e ') || 'SMS'}`, at: stamp(), by: 'Sistema'}); }
  closeModal(); S.orcF = 'Todos'; go('orcamentos'); openDr('orc', id);
  toast(status === 'Enviado' ? `Orçamento <b>${id}</b> enviado para ${c.nome}. Teste o botão “Ver como cliente”.` : `Rascunho <b>${id}</b> salvo.`);
}
