// ===== Agenda =====
const H0 = 8, H1 = 18, PX = 60;
const hm = s => { const [h, m] = s.split(':').map(Number); return h + m / 60; };
const weekOf = d => { const x = parse(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return [0, 1, 2, 3, 4, 5].map(i => { const y = new Date(x); y.setDate(y.getDate() + i); return toIso(y); }); };
const diaLabel = d => `${DIAS[parse(d).getDay()]}, ${fmtDM(d)}`;
VIEWS.agenda = () => {
  const ags = S.agenda.filter(a => a.dia === S.agDia), wk = weekOf(S.agDia), nW = S.agenda.filter(a => wk.includes(a.dia)).length;
  const nav = `<div class="seg"><button onclick="agNav(-1)" title="Anterior">${ic('chevl')}</button><button class="on" onclick="S.agDia=D(0);render()">Hoje</button><button onclick="agNav(1)" title="Próximo">${ic('chev')}</button></div>`;
  const h = head('Agenda', S.sub === 'dia' ? `${diaLabel(S.agDia).replace(/^./, c => c.toUpperCase())} · ${ags.length} agendamentos · clique num horário livre para agendar` : `Semana de ${fmtDM(wk[0])} a ${fmtDM(wk[5])} · ${nW} agendamentos`,
    nav + `<button class="btn" onclick="novoAg()">${ic('plus')}Agendar</button>`, 'agenda');
  const k = `<div class="grid k5" style="margin-bottom:16px">${kpi('Agendamentos hoje', S.agenda.filter(a => a.dia === D(0)).length, {icon: 'agenda', hl: 1})}${kpi('Ocupação da semana', Math.round(sum(S.agenda.filter(a => wk.includes(a.dia)), a => a.dur) / (6 * 10 * 4) * 100) + '%', {icon: 'trend'})}${kpi('Taxa de faltas', '4%', {icon: 'alert', c: 'amber', delta: -42, sub: 'com confirmação automática'})}${kpi('Agendados online', '37%', {icon: 'link', c: 'blue', sub: 'pelo link público'})}</div>`;
  if (S.sub === 'semana') return h + k + `<div class="week">${wk.map(d => { const l = S.agenda.filter(a => a.dia === d).sort((a, b) => a.hora.localeCompare(b.hora));
    return `<div class="day ${d === D(0) ? 'today' : ''}"><h4 onclick="S.agDia='${d}';go('agenda','dia')"><span>${diaLabel(d)}</span><span class="b nd">${l.length}</span></h4>${l.map(a => `<div class="ap" style="--c:${S.boxCor[a.box]}" onclick="openDr('ag',${a.id})"><b>${a.hora}</b> · ${a.box}<br><span style="color:var(--obsidian)">${cli(a.cliente).nome}</span><div class="mut">${serv(a.sv).nome}</div>${a.checkin ? '<span class="b ok" style="margin-top:4px">Check-in</span>' : a.st !== 'Confirmado' ? '<span class="b warn" style="margin-top:4px">A confirmar</span>' : ''}</div>`).join('')}
      <button class="btn sm ghost" onclick="novoAg(null,'${d}')">${ic('plus')}Agendar</button></div>`; }).join('')}</div>`;
  const hours = Array.from({length: H1 - H0}, (_, i) => H0 + i), t = new Date(), nowH = t.getHours() + t.getMinutes() / 60;
  return h + k + `<div class="dgwrap"><div class="dgrid" style="grid-template-columns:62px repeat(${S.boxes.length},minmax(170px,1fr))"><div style="border-bottom:1px solid var(--line);background:#fafbf9"></div>
    ${S.boxes.map(b => `<div class="dgh"><i style="background:${S.boxCor[b]}"></i>${b}<small>${ags.filter(a => a.box === b).length}</small></div>`).join('')}
    <div class="dgt">${hours.map(x => `<div style="height:${PX}px">${pad(x)}:00</div>`).join('')}</div>
    ${S.boxes.map(b => `<div class="dgc" style="height:${(H1 - H0) * PX}px">${hours.map(x => `<div class="slot" style="top:${(x - H0) * PX}px;height:${PX}px" onclick="novoAg('${b}','${S.agDia}','${pad(x)}:00')"></div>`).join('')}
      ${ags.filter(a => a.box === b).map(a => { const c = cli(a.cliente); return `<div class="evt" style="top:${(hm(a.hora) - H0) * PX + 2}px;height:${a.dur * PX - 4}px;--c:${S.boxCor[b]}" onclick="event.stopPropagation();openDr('ag',${a.id})"><b>${a.hora} · ${c.nome.split(' ')[0]} ${c.nome.split(' ').slice(-1)}</b><span>${serv(a.sv).nome}</span>${a.dur >= 1 ? `<span>${a.placa}</span>` : ''}${a.checkin ? '<em>✓ Check-in feito</em>' : a.st !== 'Confirmado' ? '<em style="color:var(--amber)">A confirmar</em>' : ''}</div>`; }).join('')}
      ${S.agDia === D(0) && nowH >= H0 && nowH <= H1 ? `<div class="nowl" style="top:${(nowH - H0) * PX}px"></div>` : ''}</div>`).join('')}</div></div>`;
};
function agNav(d) { let x = addD(S.agDia, d * (S.sub === 'semana' ? 7 : 1)); if (parse(x).getDay() === 0) x = addD(x, d); S.agDia = x; render(); }
DR.ag = () => {
  const a = S.agenda.find(x => x.id === S.dr.id); if (!a) return null;
  const c = cli(a.cliente), s = serv(a.sv), fim = hm(a.hora) + a.dur;
  return {av: `<span class="kic dark" style="width:52px;height:52px">${ic('agenda')}</span>`, h: `${s.nome}`, sub: `${diaLabel(a.dia)} · ${a.hora}–${pad(Math.floor(fim))}:${pad(Math.round(fim % 1 * 60))} · ${a.box}`,
    body: `<div class="minik"><div><small>Status</small><b style="font-size:14px">${badge(a.checkin ? 'Check-in feito' : a.st, {'Confirmado': 'ok', 'Check-in feito': 'ok', 'Aguardando confirmação': 'warn'})}</b></div><div><small>Duração</small><b>${String(a.dur).replace('.', ',')} h</b></div><div><small>Valor estimado</small><b>${brl0(s.preco)}</b></div></div>
      <div class="box" style="display:flex;gap:12px;align-items:center;margin-bottom:14px">${av(c.nome)}<div style="flex:1"><b style="color:var(--obsidian)">${c.nome}</b><div class="sm mut">${c.tel}</div></div><button class="lnk sm" onclick="openDr('cli',${c.id})">Ver cliente</button></div>
      <div class="box" style="display:flex;gap:12px;align-items:center">${ic('car')}<div style="flex:1"><b style="color:var(--obsidian)">${veic(a.cliente, a.placa)}</b></div>${plate(a.placa)}</div>
      <div class="sec-t">Comunicação automática</div><div class="tl"><div class="tli wa"><b>Confirmação enviada</b><small>ao agendar · SMS e e-mail</small></div><div class="tli ${a.st === 'Confirmado' ? 'ok' : ''}"><b>${a.st === 'Confirmado' ? 'Cliente confirmou presença' : 'Aguardando resposta do cliente'}</b><small>lembrete automático 1 dia antes</small></div></div>`,
    foot: a.checkin ? `<button class="btn" onclick="go('os')">${ic('os')}Ver no pátio</button>` : `<button class="btn danger" onclick="cancelarAg(${a.id})">Cancelar</button><button class="btn sec" onclick="toast('Lembrete enviado para ${c.nome}.')">${ic('send')}Lembrete</button><button class="btn" onclick="checkin(${a.id})">${ic('check')}Check-in → abrir OS</button>`};
};
function cancelarAg(id) { S.agenda = S.agenda.filter(a => a.id !== id); closeDrawer(); render(); toast('Agendamento cancelado. O cliente recebeu a opção de remarcar.', 'warn'); }
function checkin(id) {
  const a = S.agenda.find(x => x.id === id), n = SEQ.os++, c = cli(a.cliente); a.checkin = true;
  S.os.unshift({id: n, cliente: a.cliente, placa: a.placa, itens: [{t: 'S', r: a.sv, q: 1}], mec: S.mecanicos[n % 4], box: a.box, status: 'Aguardando', entrada: D(0), prazo: D(0), hora: '18:00', km: c.veiculos.find(v => v.placa === a.placa)?.km || 0, relato: serv(a.sv).nome,
    hist: [{st: 'OS aberta no check-in do agendamento', at: stamp(), by: 'Juliana Prado'}], ck: [0, 2], horas: 0});
  toast(`Check-in de <b>${c.nome}</b>. OS ${n} aberta — complete o checklist de entrada.`);
  go('os'); openDr('os', n, 'checklist');
}
function novoAg(box, dia, hora, cid) {
  const c0 = cid || S.clientes[0].id;
  openModal(mHead('Novo agendamento', 'O cliente recebe a confirmação por SMS e e-mail na hora.') + `<div class="mb">
    <div class="fsec"><h4><span class="n">1</span>Cliente e veículo</h4><div class="fg">
      <div class="fld"><label>Cliente <i>*</i></label><select id="aCli" onchange="$('#aVeic').innerHTML=cli(+this.value).veiculos.map(v=>'<option value='+v.placa+'>'+v.placa+' · '+v.modelo+'</option>').join('')">${S.clientes.map(c => `<option value="${c.id}" ${c.id === c0 ? 'selected' : ''}>${c.nome}</option>`).join('')}</select></div>
      <div class="fld"><label>Veículo <i>*</i></label><select id="aVeic"></select></div></div></div>
    <div class="fsec"><h4><span class="n">2</span>Serviço e horário</h4><div class="fg">
      <div class="fld s2"><label>Serviço</label><select id="aServ" onchange="$('#aDur').value=serv(this.value).h<1?1:serv(this.value).h">${S.servicos.map(s => `<option value="${s.id}">${s.nome} — ${s.h} h</option>`).join('')}</select></div>
      <div class="fld"><label>Data <i>*</i></label><input id="aDia" type="date" value="${dia || S.agDia}"></div>
      <div class="fld"><label>Horário <i>*</i></label><select id="aHora">${Array.from({length: 20}, (_, i) => `${pad(8 + Math.floor(i / 2))}:${i % 2 ? '30' : '00'}`).map(h => `<option ${h === (hora || '09:00') ? 'selected' : ''}>${h}</option>`).join('')}</select></div>
      <div class="fld"><label>Box</label><select id="aBox">${S.boxes.map(b => `<option ${b === box ? 'selected' : ''}>${b}</option>`).join('')}</select></div>
      <div class="fld"><label>Duração</label><div class="inp"><input id="aDur" type="number" min=".5" step=".5" value="1"><span>h</span></div></div>
      <div class="fld s2"><label>Observações</label><input id="aObs" placeholder="Ex.: cliente vai aguardar na oficina"></div></div></div>
    <label class="check"><input type="checkbox" checked> Enviar confirmação e lembrete automático por SMS e e-mail</label></div>
    <div class="mf"><button class="btn ghost" onclick="closeModal()">Cancelar</button><div class="r"><button class="btn" onclick="salvarAg()">${ic('check')}Agendar</button></div></div>`);
  $('#aCli').dispatchEvent(new Event('change'));
}
function salvarAg() {
  const a = {id: SEQ.ag++, cliente: +$('#aCli').value, placa: $('#aVeic').value, sv: $('#aServ').value, dia: $('#aDia').value, hora: $('#aHora').value, box: $('#aBox').value, dur: Math.max(.5, +$('#aDur').value || 1), checkin: false, st: 'Aguardando confirmação'};
  if (fieldErr('aDia', !a.dia)) return toast('Informe a data.', 'warn');
  if (parse(a.dia).getDay() === 0) { fieldErr('aDia', true); return toast('A oficina não abre aos domingos.', 'warn'); }
  const ini_ = hm(a.hora), fim = ini_ + a.dur;
  const conf = S.agenda.find(x => x.dia === a.dia && x.box === a.box && hm(x.hora) < fim && hm(x.hora) + x.dur > ini_);
  if (conf) { fieldErr('aHora', true); return toast(`<b>Conflito:</b> ${a.box} ocupado às ${conf.hora} (${cli(conf.cliente).nome}). Escolha outro horário ou box.`, 'warn'); }
  if (fim > H1) { fieldErr('aHora', true); return toast('O serviço passa do horário de fechamento (18h).', 'warn'); }
  S.agenda.push(a); closeModal(); S.agDia = a.dia; go('agenda', 'dia');
  toast(`Agendado: <b>${cli(a.cliente).nome}</b> em ${fmtD(a.dia)} às ${a.hora} (${a.box}). Confirmação enviada.`);
}
