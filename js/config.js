// ===== Configurações =====
VIEWS.config = () => head('Configurações', 'Dados da oficina, equipe, preços e integrações', '', 'config') + ({empresa: cfEmpresa, usuarios: cfUsuarios, servicos: cfServicos, integracoes: cfInteg})[S.sub]();
function cfEmpresa() {
  return `<div class="grid g2"><div class="card">
    <div class="fsec"><h4><span class="n">1</span>Dados da empresa</h4><div class="fg">
      <div class="fld"><label>Nome fantasia</label><input value="Oficina do Arthur"></div><div class="fld"><label>Razão social</label><input value="Arthur Serviços Automotivos Ltda"></div>
      <div class="fld"><label>CNPJ</label><input value="12.345.678/0001-90" oninput="mDoc(this)"></div><div class="fld"><label>Inscrição municipal</label><input value="5.678.901-2"></div>
      <div class="fld"><label>Telefone</label><input value="(11) 3333-4444" oninput="mTel(this)"></div><div class="fld"><label>E-mail</label><input value="contato@oficinadoarthur.com.br"></div>
      <div class="fld s2"><label>Endereço</label><input value="Av. das Oficinas, 1000 — São Paulo/SP"></div></div></div>
    <div class="fsec" style="margin:0"><h4><span class="n">2</span>Operação</h4><div class="fg fg3">
      <div class="fld"><label>Valor da hora de mão de obra</label><div class="inp"><span>R$</span><input type="number" value="160"></div></div>
      <div class="fld"><label>Horário</label><input value="Seg–sex 8h–18h · sáb 8h–12h"></div>
      <div class="fld"><label>Boxes / elevadores</label><input type="number" value="${S.boxes.length}"></div>
      <div class="fld"><label>Validade padrão do orçamento</label><select><option>7 dias</option><option>15 dias</option></select></div>
      <div class="fld"><label>Garantia de serviço</label><select><option>90 dias</option><option>6 meses</option></select></div>
      <div class="fld"><label>Regime tributário</label><select><option>Simples Nacional</option><option>Lucro presumido</option></select></div></div></div>
    <div style="display:flex;justify-content:flex-end;margin-top:16px"><button class="btn" onclick="toast('Configurações salvas.')">Salvar alterações</button></div></div>
  <div class="card dark" style="align-self:start;padding:28px"><h3 style="margin:0 0 14px">Identidade nos documentos</h3><div style="display:flex;gap:14px;align-items:center;background:#fff;border-radius:16px;padding:16px">${LOGO}<div><b style="color:var(--obsidian)">Oficina do Arthur</b><div class="sm mut">Bosch Car Service</div></div></div>
    <p style="margin:16px 0">O logotipo aparece em orçamentos, OS, recibos e no link de aprovação que o cliente recebe.</p><button class="btn" onclick="toast('Upload do logotipo (PNG ou SVG).')">${ic('upload')}Trocar logotipo</button></div></div>`;
}
function cfUsuarios() {
  const mods = ['Dashboards', 'CRM', 'Marketing', 'Orçamentos', 'Ordens de serviço', 'Agenda', 'Estoque', 'Financeiro', 'Configurações'];
  const perf = {'Administrador': mods.map(() => 2), 'Consultor / recepção': [1, 2, 1, 2, 2, 2, 1, 0, 0], 'Financeiro': [1, 1, 0, 1, 1, 0, 1, 2, 0], 'Mecânico': [0, 0, 0, 1, 2, 1, 1, 0, 0]};
  const mark = v => v === 2 ? '<span class="b ok nd">Editar</span>' : v === 1 ? '<span class="b nd">Ver</span>' : '<span class="mut">—</span>';
  return `<div class="card p0"><div class="tbar"><h3 style="margin:0;font-size:16px">Equipe</h3><button class="btn sm" onclick="toast('Convite enviado por e-mail com acesso ao perfil escolhido.')">${ic('plus')}Convidar usuário</button></div><div class="tw"><table><thead><tr><th>Usuário</th><th>Perfil</th><th>Último acesso</th><th>Ativo</th></tr></thead><tbody>
    ${S.users.map((u, i) => `<tr><td><div class="who">${av(u.nome)}<div><b>${u.nome}</b><small>${u.email}</small></div></div></td><td><select style="width:auto" ${i ? '' : 'disabled'} onchange="toast('Perfil de ${u.nome} alterado para '+this.value+'.')">${Object.keys(perf).concat(['Mecânico (chefe)']).map(p => `<option ${u.papel === p ? 'selected' : ''}>${p}</option>`).join('')}</select></td><td class="sm">${u.ultimo}</td><td>${sw(u.on, `S.users[${i}].on=this.checked;toast('Acesso de ${u.nome} '+(this.checked?'ativado':'bloqueado')+'.')`)}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="card p0 mt"><div class="tbar"><h3 style="margin:0;font-size:16px">Permissões por perfil</h3><span class="mut sm">mecânico vê só as próprias OS; financeiro não acessa configurações</span></div><div class="tw"><table><thead><tr><th>Módulo</th>${Object.keys(perf).map(p => `<th>${p}</th>`).join('')}</tr></thead><tbody>
    ${mods.map((m, i) => `<tr><td><b>${m}</b></td>${Object.values(perf).map(v => `<td>${mark(v[i])}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
}
function cfServicos() {
  return `<div class="card p0"><div class="tbar"><h3 style="margin:0;font-size:16px">Tabela de serviços</h3><div style="display:flex;gap:8px"><button class="btn sm sec" onclick="toast('Reajuste em massa: aplique % por categoria.')">Reajustar preços</button><button class="btn sm" onclick="toast('Novo serviço: nome, categoria, tempo padrão e preço.')">${ic('plus')}Serviço</button></div></div><div class="tw"><table><thead><tr><th>Serviço</th><th>Categoria</th><th class="num">Tempo padrão</th><th class="num">Preço</th><th class="num">Vendidos no mês</th></tr></thead><tbody>
    ${S.servicos.map((s, i) => `<tr><td><b style="color:var(--obsidian)">${s.nome}</b><div class="sm mut">${s.id}</div></td><td>${s.cat}</td><td class="num">${String(s.h).replace('.', ',')} h</td><td class="num"><div class="inp" style="width:130px;margin-left:auto"><span>R$</span><input type="number" value="${s.preco}" style="text-align:right" onchange="S.servicos[${i}].preco=+this.value;toast('Preço de ${s.nome} atualizado.')"></div></td><td class="num">${[52, 38, 41, 22, 27, 15, 6, 9, 4, 7][i]}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="card mt"><div class="ct"><h3>Pacotes rápidos</h3><small>aparecem no orçamento com um clique</small></div><div class="chips">${PACKS.map(p => `<span class="chip" style="cursor:default">${ic('zap')}${p.n} · ${brl0(sum(p.it, ([t, r, q]) => (t === 'S' ? serv(r) : peca(r)).preco * q))}</span>`).join('')}</div></div>`;
}
function cfInteg() {
  return `<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">${S.integ.map((x, i) => `<div class="card"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><span class="kic ${x.on ? 'dark' : ''}" style="width:46px;height:46px">${ic(x.ic)}</span>${badge(x.st, {Conectado: 'ok', Configurar: 'warn', 'Em breve': ''})}</div>
    <h3 style="margin:14px 0 4px;font-size:16px">${x.n}</h3><p class="mut sm" style="margin:0 0 16px;min-height:38px">${x.d}</p>
    ${x.st === 'Em breve' ? '<button class="btn sm sec" disabled>Em breve</button>' : x.on ? `<div style="display:flex;justify-content:space-between;align-items:center"><span class="sm mut">Sincronizado ${clock()}</span>${sw(true, `toggleInt(${i},this.checked)`)}</div>` : `<button class="btn sm" onclick="toggleInt(${i},true)">Conectar</button>`}</div>`).join('')}</div>`;
}
function toggleInt(i, on) { const x = S.integ[i]; x.on = on; x.st = on ? 'Conectado' : 'Configurar'; render(); toast(`${x.n} ${on ? 'conectado' : 'desconectado'}.`, on ? 'ok' : 'warn'); }
