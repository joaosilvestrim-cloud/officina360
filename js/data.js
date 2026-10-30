// ===== dados fictícios de demonstração =====
const S = {
  screen: 'login', view: 'dashboard', sub: 'geral', per: 'mes', dr: null,
  crmQ: '', crmF: 'todos', orcF: 'Todos', orcQ: '', osMode: 'quadro', osMec: 'Todos', agDia: D(0),
  estF: 'Todos', estCat: 'Todas', estQ: '', movF: 'Todos', finF: 'Todos', finQ: '', npsF: 'Todos', invCat: 'Filtros', inv: {},
  fatMes: 58340, despMes: 39800, osMes: 96, caixa: 48250, aprovMes: 49200, kpi: {orcEnv: 118, orcApr: 81},
  mecanicos: ['Carlos Lima', 'Rafael Nunes', 'Diego Alves', 'Marcos Reis'],
  boxes: ['Box 1', 'Box 2', 'Box 3', 'Alinhamento'],
  boxCor: {'Box 1': '#163300', 'Box 2': '#0b4c72', 'Box 3': '#3d8a1f', 'Alinhamento': '#8a5a00'},
  forn: [{n: 'Distribuidora AutoPeças SP', p: 2}, {n: 'Freios & Cia Atacado', p: 3}, {n: 'Lubrificantes Paulista', p: 1}],
  clientes: [
    {id: 1, nome: 'Mariana Souza', tel: '(11) 98765-4321', email: 'mariana.souza@email.com', cpf: '312.554.908-12', nasc: '1988-11-05', origem: 'Indicação', veiculos: [{placa: 'FHK2B34', modelo: 'Honda Civic EXL 2019', km: 58200}], ultimo: D(-95), proxRev: D(12), gasto: 4820, visitas: 7, desde: '2021', tag: 'VIP', lgpd: true},
    {id: 2, nome: 'João Pedro Almeida', tel: '(11) 99812-3344', email: 'jp.almeida@email.com', cpf: '402.118.337-90', nasc: '1995-03-22', origem: 'Google', veiculos: [{placa: 'GBR4E21', modelo: 'VW T-Cross 2022', km: 31500}], ultimo: D(-40), proxRev: D(140), gasto: 1290, visitas: 2, desde: '2026', tag: 'Novo', lgpd: true},
    {id: 3, nome: 'Fernanda Costa', tel: '(11) 97455-1020', email: 'fe.costa@email.com', cpf: '228.901.456-33', nasc: '1984-07-14', origem: 'Instagram', veiculos: [{placa: 'EZT7H90', modelo: 'Toyota Corolla XEi 2020', km: 72000}], ultimo: D(-20), proxRev: D(160), gasto: 6930, visitas: 9, desde: '2020', tag: 'VIP', lgpd: true},
    {id: 4, nome: 'Ricardo Mendes', tel: '(11) 98120-7788', email: 'ricardo@mendesengenharia.com.br', cpf: '19.442.871/0001-05', nasc: '1979-01-30', origem: 'Indicação', veiculos: [{placa: 'RTM8C12', modelo: 'Fiat Toro Volcano 2021', km: 88400}, {placa: 'DKL5J66', modelo: 'Hyundai HB20 2018', km: 101300}], ultimo: D(-12), proxRev: D(25), gasto: 9150, visitas: 14, desde: '2019', tag: 'VIP', lgpd: true},
    {id: 5, nome: 'Patrícia Rocha', tel: '(11) 96633-4521', email: 'patricia.r@email.com', cpf: '371.223.019-44', nasc: '1991-11-02', origem: 'Passante', veiculos: [{placa: 'FGT1D77', modelo: 'Chevrolet Onix LT 2020', km: 64300}], ultimo: D(-240), proxRev: D(-60), gasto: 860, visitas: 2, desde: '2024', tag: 'Em risco', lgpd: true},
    {id: 6, nome: 'Bruno Carvalho', tel: '(11) 99001-2266', email: 'bruno.c@email.com', cpf: '288.765.432-10', nasc: '1987-05-19', origem: 'Google', veiculos: [{placa: 'HJK9F03', modelo: 'Jeep Renegade 2019', km: 69800}], ultimo: D(-150), proxRev: D(5), gasto: 3210, visitas: 5, desde: '2022', tag: 'Recorrente', lgpd: true},
    {id: 7, nome: 'Luciana Martins', tel: '(11) 95544-8890', email: 'lu.martins@email.com', cpf: '455.120.887-61', nasc: '1999-09-09', origem: 'Instagram', veiculos: [{placa: 'SPX2G48', modelo: 'Renault Kwid 2023', km: 18900}], ultimo: D(-15), proxRev: D(165), gasto: 380, visitas: 1, desde: '2026', tag: 'Novo', lgpd: false},
    {id: 8, nome: 'Eduardo Ferreira', tel: '(11) 98877-1209', email: 'eduardo.f@email.com', cpf: '199.304.556-72', nasc: '1972-12-11', origem: 'Rede Bosch', veiculos: [{placa: 'MNB6K29', modelo: 'Ford Ranger XLS 2018', km: 132500}], ultimo: D(-200), proxRev: D(-20), gasto: 5640, visitas: 8, desde: '2020', tag: 'Em risco', lgpd: true},
  ],
  servicos: [
    {id: 'S1', nome: 'Troca de óleo e filtro', preco: 120, h: .5, cat: 'Manutenção'},
    {id: 'S2', nome: 'Revisão completa (40 itens)', preco: 380, h: 2, cat: 'Manutenção'},
    {id: 'S3', nome: 'Alinhamento e balanceamento', preco: 160, h: 1, cat: 'Suspensão'},
    {id: 'S4', nome: 'Diagnóstico eletrônico (scanner)', preco: 180, h: 1, cat: 'Diagnóstico'},
    {id: 'S5', nome: 'Troca de pastilhas de freio', preco: 150, h: 1, cat: 'Freios'},
    {id: 'S6', nome: 'Higienização do ar-condicionado', preco: 190, h: 1, cat: 'Ar-condicionado'},
    {id: 'S7', nome: 'Troca do kit correia dentada', preco: 450, h: 3, cat: 'Motor'},
    {id: 'S8', nome: 'Troca de bateria', preco: 60, h: .5, cat: 'Elétrica'},
    {id: 'S9', nome: 'Troca de amortecedores (par)', preco: 320, h: 2, cat: 'Suspensão'},
    {id: 'S10', nome: 'Limpeza de bicos injetores', preco: 220, h: 1.5, cat: 'Motor'},
  ],
  estoque: [
    {cod: 'P01', nome: 'Óleo 5W30 sintético (1 L)', cat: 'Lubrificantes', local: 'A-01', qtd: 42, min: 24, max: 80, custo: 32, preco: 58, c30: 96, f: 2, ult: -1},
    {cod: 'P02', nome: 'Filtro de óleo', cat: 'Filtros', local: 'B-02', qtd: 18, min: 10, max: 40, custo: 22, preco: 45, c30: 24, f: 0, ult: -1},
    {cod: 'P03', nome: 'Filtro de ar do motor', cat: 'Filtros', local: 'B-03', qtd: 7, min: 8, max: 24, custo: 38, preco: 79, c30: 14, f: 0, ult: -2},
    {cod: 'P04', nome: 'Filtro de cabine', cat: 'Filtros', local: 'B-04', qtd: 12, min: 8, max: 24, custo: 29, preco: 65, c30: 11, f: 0, ult: -3},
    {cod: 'P05', nome: 'Jogo de pastilhas dianteiras', cat: 'Freios', local: 'C-01', qtd: 4, min: 6, max: 16, custo: 110, preco: 219, c30: 9, f: 1, ult: -2},
    {cod: 'P06', nome: 'Disco de freio (par)', cat: 'Freios', local: 'C-02', qtd: 6, min: 4, max: 10, custo: 260, preco: 489, c30: 3, f: 1, ult: -6},
    {cod: 'P07', nome: 'Bateria 60 Ah', cat: 'Elétrica', local: 'D-01', qtd: 3, min: 4, max: 10, custo: 390, preco: 649, c30: 5, f: 1, ult: -8},
    {cod: 'P08', nome: 'Palheta limpador (par)', cat: 'Acessórios', local: 'E-01', qtd: 15, min: 6, max: 20, custo: 45, preco: 89, c30: 4, f: 0, ult: -11},
    {cod: 'P09', nome: 'Vela de ignição', cat: 'Ignição', local: 'B-07', qtd: 24, min: 16, max: 48, custo: 28, preco: 54, c30: 16, f: 0, ult: -4},
    {cod: 'P10', nome: 'Kit correia dentada + tensor', cat: 'Motor', local: 'C-05', qtd: 2, min: 2, max: 6, custo: 380, preco: 690, c30: 2, f: 1, ult: -12},
    {cod: 'P11', nome: 'Fluido de freio DOT4 (500 ml)', cat: 'Lubrificantes', local: 'A-04', qtd: 20, min: 10, max: 30, custo: 24, preco: 46, c30: 8, f: 2, ult: -5},
    {cod: 'P12', nome: 'Higienizador de ar-condicionado', cat: 'Química', local: 'A-07', qtd: 9, min: 6, max: 20, custo: 35, preco: 70, c30: 7, f: 2, ult: -1},
    {cod: 'P13', nome: 'Amortecedor dianteiro', cat: 'Suspensão', local: 'C-08', qtd: 6, min: 2, max: 8, custo: 290, preco: 520, c30: 1, f: 1, ult: -34},
    {cod: 'P14', nome: 'Lâmpada H7', cat: 'Elétrica', local: 'D-04', qtd: 38, min: 10, max: 20, custo: 12, preco: 29, c30: 2, f: 0, ult: -27},
    {cod: 'P15', nome: 'Aditivo de radiador (1 L)', cat: 'Lubrificantes', local: 'A-05', qtd: 22, min: 8, max: 16, custo: 18, preco: 39, c30: 0, f: 2, ult: -128},
  ],
  osStatus: ['Aguardando', 'Diagnóstico', 'Aguardando peça', 'Em execução', 'Pronto', 'Entregue'],
  osCor: {'Aguardando': '#868685', 'Diagnóstico': '#0b4c72', 'Aguardando peça': '#8a5a00', 'Em execução': '#163300', 'Pronto': '#5cb82e', 'Entregue': '#6a6c6a'},
  orcamentos: [
    {id: 1052, cliente: 8, placa: 'MNB6K29', itens: [{t: 'S', r: 'S4', q: 1}], status: 'Rascunho', data: D(0), validade: D(7), desc: 0, relato: 'Luz da injeção acesa e falhando em marcha lenta'},
    {id: 1051, cliente: 6, placa: 'HJK9F03', itens: [{t: 'S', r: 'S2', q: 1}, {t: 'P', r: 'P01', q: 4}, {t: 'P', r: 'P02', q: 1}, {t: 'P', r: 'P03', q: 1}, {t: 'P', r: 'P04', q: 1}], status: 'Enviado', data: D(-1), validade: D(6), desc: 5, relato: 'Revisão dos 70.000 km'},
    {id: 1050, cliente: 1, placa: 'FHK2B34', itens: [{t: 'S', r: 'S5', q: 1}, {t: 'P', r: 'P05', q: 1}, {t: 'S', r: 'S3', q: 1}], status: 'Enviado', data: D(-2), validade: D(5), desc: 0, relato: 'Barulho ao frear e volante puxando para a direita'},
    {id: 1049, cliente: 4, placa: 'RTM8C12', itens: [{t: 'S', r: 'S7', q: 1}, {t: 'P', r: 'P10', q: 1}], status: 'Aprovado', data: D(-3), validade: D(4), desc: 0, relato: 'Troca preventiva da correia (88 mil km)', os: 2318},
    {id: 1048, cliente: 5, placa: 'FGT1D77', itens: [{t: 'S', r: 'S1', q: 1}, {t: 'P', r: 'P01', q: 4}, {t: 'P', r: 'P02', q: 1}], status: 'Recusado', data: D(-9), validade: D(-2), desc: 0, relato: 'Troca de óleo', motivo: 'Preço'},
    {id: 1047, cliente: 2, placa: 'GBR4E21', itens: [{t: 'S', r: 'S6', q: 1}, {t: 'P', r: 'P12', q: 1}, {t: 'P', r: 'P04', q: 1}], status: 'Aprovado', data: D(-4), validade: D(3), desc: 0, relato: 'Ar-condicionado com cheiro ruim', os: 2317},
  ],
  os: [
    {id: 2318, cliente: 4, placa: 'RTM8C12', itens: [{t: 'S', r: 'S7', q: 1}, {t: 'P', r: 'P10', q: 1}], mec: 'Rafael Nunes', box: 'Box 2', status: 'Em execução', entrada: D(-1), prazo: D(0), hora: '17:00', km: 88400, relato: 'Troca preventiva da correia (88 mil km)', orc: 1049},
    {id: 2317, cliente: 2, placa: 'GBR4E21', itens: [{t: 'S', r: 'S6', q: 1}, {t: 'P', r: 'P12', q: 1}, {t: 'P', r: 'P04', q: 1}], mec: 'Diego Alves', box: 'Box 3', status: 'Pronto', entrada: D(-1), prazo: D(0), hora: '12:00', km: 31500, relato: 'Ar-condicionado com cheiro ruim', orc: 1047},
    {id: 2316, cliente: 3, placa: 'EZT7H90', itens: [{t: 'S', r: 'S4', q: 1}, {t: 'S', r: 'S8', q: 1}, {t: 'P', r: 'P07', q: 1}], mec: 'Carlos Lima', box: 'Box 1', status: 'Diagnóstico', entrada: D(0), prazo: D(1), hora: '10:00', km: 72000, relato: 'Carro não pegou de manhã, bateria fraca'},
    {id: 2315, cliente: 7, placa: 'SPX2G48', itens: [{t: 'S', r: 'S1', q: 1}, {t: 'P', r: 'P01', q: 4}, {t: 'P', r: 'P02', q: 1}], mec: 'Diego Alves', box: 'Box 3', status: 'Aguardando', entrada: D(0), prazo: D(0), hora: '11:30', km: 18900, relato: 'Troca de óleo dos 20 mil'},
    {id: 2314, cliente: 4, placa: 'DKL5J66', itens: [{t: 'S', r: 'S5', q: 1}, {t: 'P', r: 'P05', q: 1}, {t: 'P', r: 'P06', q: 1}], mec: 'Rafael Nunes', box: 'Box 2', status: 'Aguardando peça', entrada: D(-2), prazo: D(-1), hora: '17:00', km: 101300, relato: 'Freio vibrando ao frear'},
    {id: 2313, cliente: 1, placa: 'FHK2B34', itens: [{t: 'S', r: 'S3', q: 1}], mec: 'Marcos Reis', box: 'Alinhamento', status: 'Em execução', entrada: D(0), prazo: D(0), hora: '16:00', km: 58200, relato: 'Volante puxando para a direita'},
    {id: 2312, cliente: 6, placa: 'HJK9F03', itens: [{t: 'S', r: 'S1', q: 1}, {t: 'P', r: 'P01', q: 4}, {t: 'P', r: 'P02', q: 1}], mec: 'Carlos Lima', box: 'Box 1', status: 'Entregue', entrada: D(-3), prazo: D(-3), hora: '17:00', km: 69700, relato: 'Troca de óleo'},
  ],
  agenda: [
    [0, '08:00', 4, 'RTM8C12', 'S7', 3, 'Box 2', 1], [0, '08:30', 7, 'SPX2G48', 'S1', 1, 'Box 3', 1], [0, '10:00', 3, 'EZT7H90', 'S4', 2, 'Box 1', 1],
    [0, '11:00', 6, 'HJK9F03', 'S3', 1, 'Alinhamento', 0], [0, '13:00', 8, 'MNB6K29', 'S2', 2, 'Box 1', 0], [0, '14:00', 2, 'GBR4E21', 'S6', 1, 'Box 3', 0],
    [0, '15:00', 1, 'FHK2B34', 'S3', 1, 'Alinhamento', 1], [0, '15:30', 4, 'DKL5J66', 'S5', 1.5, 'Box 2', 0],
    [1, '08:30', 6, 'HJK9F03', 'S2', 2, 'Box 1', 0], [1, '10:00', 5, 'FGT1D77', 'S1', 1, 'Box 3', 0], [3, '09:00', 1, 'FHK2B34', 'S5', 1, 'Box 2', 0],
    [3, '14:00', 8, 'MNB6K29', 'S4', 1, 'Box 1', 0], [4, '08:30', 2, 'GBR4E21', 'S10', 1.5, 'Box 3', 0],
    [-1, '09:00', 3, 'EZT7H90', 'S3', 1, 'Alinhamento', 1], [-2, '10:00', 6, 'HJK9F03', 'S1', 1, 'Box 3', 1], [-3, '08:00', 4, 'DKL5J66', 'S5', 2, 'Box 2', 1],
  ].map((a, i) => ({id: i + 1, dia: D(a[0]), hora: a[1], cliente: a[2], placa: a[3], sv: a[4], dur: a[5], box: a[6], checkin: !!a[7], st: a[0] > 0 && i % 3 === 0 ? 'Aguardando confirmação' : 'Confirmado'})),
  fin: [
    {id: 1, tipo: 'R', desc: 'OS 2312 — Bruno Carvalho', cat: 'Serviços', forma: 'Pix', venc: D(-3), valor: 380, status: 'Pago'},
    {id: 2, tipo: 'R', desc: 'OS 2311 — Fernanda Costa', cat: 'Serviços', forma: 'Cartão de crédito', venc: D(-1), valor: 1280, status: 'Pago'},
    {id: 3, tipo: 'R', desc: 'OS 2309 — Frota Express (faturado)', cat: 'Serviços', forma: 'Boleto', venc: D(5), valor: 3460, status: 'Pendente'},
    {id: 4, tipo: 'R', desc: 'OS 2305 — cartão 3x (parcela 2/3)', cat: 'Cartão', forma: 'Cartão de crédito', venc: D(9), valor: 640, status: 'Pendente'},
    {id: 5, tipo: 'R', desc: 'OS 2298 — Transportadora Lima (faturado)', cat: 'Serviços', forma: 'Boleto', venc: D(-4), valor: 2180, status: 'Pendente'},
    {id: 6, tipo: 'D', desc: 'Distribuidora AutoPeças SP — NF 88213', cat: 'Peças', forma: 'Boleto', venc: D(3), valor: 6840, status: 'Pendente'},
    {id: 7, tipo: 'D', desc: 'Aluguel do galpão', cat: 'Fixas', forma: 'Boleto', venc: D(1), valor: 7500, status: 'Pendente'},
    {id: 8, tipo: 'D', desc: 'Folha de pagamento', cat: 'Pessoal', forma: 'Transferência', venc: D(5), valor: 18900, status: 'Pendente'},
    {id: 9, tipo: 'D', desc: 'Energia elétrica', cat: 'Fixas', forma: 'Débito automático', venc: D(-4), valor: 1320, status: 'Pago'},
    {id: 10, tipo: 'D', desc: 'Google Ads — campanha revisão', cat: 'Marketing', forma: 'Cartão de crédito', venc: D(-10), valor: 1500, status: 'Pago'},
    {id: 11, tipo: 'D', desc: 'Internet e telefonia', cat: 'Fixas', forma: 'Débito automático', venc: D(-6), valor: 420, status: 'Pago'},
    {id: 12, tipo: 'D', desc: 'Simples Nacional (DAS)', cat: 'Impostos', forma: 'Boleto', venc: D(20), valor: 4650, status: 'Pendente'},
  ],
  hist: {rec: [48900, 51200, 54600, 52300, 55800, 49900, 61200, 57400, 59800, 62100, 63750], desp: [39800, 41500, 42200, 41200, 43900, 42100, 45600, 44200, 44900, 45800, 46300]},
  movs: [
    {data: D(-1), tipo: 'Saída', cod: 'P12', q: 1, origem: 'OS 2317 (reserva)', user: 'Diego Alves'},
    {data: D(-3), tipo: 'Saída', cod: 'P01', q: 4, origem: 'OS 2312', user: 'Carlos Lima'},
    {data: D(-3), tipo: 'Saída', cod: 'P02', q: 1, origem: 'OS 2312', user: 'Carlos Lima'},
    {data: D(-5), tipo: 'Entrada', cod: 'P01', q: 24, origem: 'NF 88213 — Lubrificantes Paulista', user: 'Juliana Prado'},
    {data: D(-5), tipo: 'Entrada', cod: 'P11', q: 10, origem: 'NF 88213 — Lubrificantes Paulista', user: 'Juliana Prado'},
    {data: D(-6), tipo: 'Ajuste', cod: 'P08', q: -1, origem: 'Inventário — item avariado', user: 'Arthur'},
    {data: D(-8), tipo: 'Saída', cod: 'P07', q: 1, origem: 'OS 2301', user: 'Rafael Nunes'},
    {data: D(-9), tipo: 'Saída', cod: 'P05', q: 1, origem: 'OS 2299', user: 'Rafael Nunes'},
    {data: D(-12), tipo: 'Entrada', cod: 'P06', q: 4, origem: 'NF 41022 — Freios & Cia Atacado', user: 'Juliana Prado'},
  ],
  pedidos: [
    {id: 'PC-0412', forn: 1, itens: [{cod: 'P06', q: 4}], valor: 1040, status: 'Recebido', data: D(-15), prev: D(-12)},
    {id: 'PC-0413', forn: 2, itens: [{cod: 'P01', q: 24}, {cod: 'P11', q: 10}], valor: 1008, status: 'Recebido', data: D(-7), prev: D(-5)},
  ],
  leads: [
    {id: 1, nome: 'Gustavo Pires', tel: '(11) 98111-2020', interesse: 'Revisão 40.000 km — Corolla', origem: 'Google', etapa: 0, valor: 890, dias: 0},
    {id: 2, nome: 'Aline Barbosa', tel: '(11) 97222-3131', interesse: 'Barulho na suspensão — Compass', origem: 'Instagram', etapa: 0, valor: 0, dias: 1},
    {id: 3, nome: 'Thiago Moraes', tel: '(11) 96333-4242', interesse: 'Troca de embreagem — Gol', origem: 'Indicação', etapa: 1, valor: 1850, dias: 2},
    {id: 4, nome: 'Camila Dias', tel: '(11) 95444-5353', interesse: 'Ar-condicionado não gela — Onix', origem: 'Site', etapa: 1, valor: 620, dias: 3},
    {id: 5, nome: 'Frota Express Ltda', tel: '(11) 3333-1000', interesse: 'Contrato de manutenção — 12 vans', origem: 'Indicação', etapa: 2, valor: 14400, dias: 6},
    {id: 6, nome: 'Renato Lopes', tel: '(11) 94555-6464', interesse: 'Freios + alinhamento — HB20', origem: 'Google', etapa: 3, valor: 780, dias: 4},
  ],
  etapas: ['Novo contato', 'Orçamento enviado', 'Negociação', 'Fechado'],
  campanhas: [
    {nome: 'Lembrete de revisão', tipo: 'Automática', gatilho: '15 dias antes da próxima revisão', canal: 'SMS', enviados: 148, respostas: 61, agend: 34, receita: 18760, custo: 52, status: 'Ativa'},
    {nome: 'Pós-venda + pesquisa NPS', tipo: 'Automática', gatilho: '2 dias após a entrega', canal: 'SMS', enviados: 212, respostas: 128, agend: 0, receita: 0, custo: 74, status: 'Ativa'},
    {nome: 'Reativação de inativos', tipo: 'Segmento', gatilho: 'Sem visita há mais de 6 meses', canal: 'SMS + e-mail', enviados: 96, respostas: 18, agend: 9, receita: 4120, custo: 34, status: 'Ativa'},
    {nome: 'Aniversário do cliente', tipo: 'Automática', gatilho: 'No dia do aniversário · cupom 10%', canal: 'SMS', enviados: 37, respostas: 15, agend: 6, receita: 1980, custo: 13, status: 'Ativa'},
    {nome: 'Black Friday — higienização A/C', tipo: 'Pontual', gatilho: 'Disparo agendado para 20/11', canal: 'E-mail + Instagram', enviados: 0, respostas: 0, agend: 0, receita: 0, custo: 0, status: 'Agendada'},
  ],
  autos: [
    {n: 'Lembrete de revisão', d: '15 dias antes da próxima revisão prevista (por data ou km)', on: true, env: 148, res: '34 agendamentos'},
    {n: 'Confirmação de agendamento', d: '1 dia antes do horário marcado, com botões Confirmar/Remarcar', on: true, env: 118, res: '−42% de faltas'},
    {n: 'Orçamento sem resposta', d: '48 h após o envio, se o cliente não aprovou', on: true, env: 23, res: '9 aprovados'},
    {n: 'Carro pronto', d: 'Quando a OS muda para “Pronto”, com valor e link de pagamento', on: true, env: 96, res: 'retirada 2,1 h mais rápida'},
    {n: 'Pós-venda + NPS', d: '2 dias após a entrega do veículo', on: true, env: 212, res: '128 respostas'},
    {n: 'Aniversário do cliente', d: 'No dia, com cupom de 10% válido por 30 dias', on: true, env: 37, res: '6 agendamentos'},
    {n: 'Reativação de inativos', d: 'Clientes sem visita há 6 meses', on: false, env: 0, res: '—'},
  ],
  nps: [
    {nome: 'Fernanda Costa', nota: 10, txt: 'Atendimento excelente, me mandaram foto da peça trocada.', d: -1},
    {nome: 'Ricardo Mendes', nota: 9, txt: 'Rápidos e transparentes no orçamento. Aprovei pelo celular.', d: -2},
    {nome: 'João Pedro Almeida', nota: 8, txt: 'Bom serviço, mas demorou um pouco na entrega.', d: -3},
    {nome: 'Patrícia Rocha', nota: 4, txt: 'Achei o preço da revisão acima do esperado.', d: -4},
    {nome: 'Bruno Carvalho', nota: 10, txt: 'Confio de olhos fechados. Sempre explicam tudo.', d: -5},
    {nome: 'Luciana Martins', nota: 7, txt: 'Gostei, só faltou um café na recepção :)', d: -6},
    {nome: 'Eduardo Ferreira', nota: 6, txt: 'O carro ficou bom, mas tive que ligar para saber o status.', d: -9},
  ],
  users: [
    {nome: 'Arthur', email: 'arthur@oficinadoarthur.com.br', papel: 'Administrador', ultimo: 'agora', on: true},
    {nome: 'Juliana Prado', email: 'juliana@oficinadoarthur.com.br', papel: 'Consultor / recepção', ultimo: 'há 5 min', on: true},
    {nome: 'Paula Ramos', email: 'financeiro@oficinadoarthur.com.br', papel: 'Financeiro', ultimo: 'há 2 h', on: true},
    {nome: 'Carlos Lima', email: 'carlos@oficinadoarthur.com.br', papel: 'Mecânico (chefe)', ultimo: 'há 12 min', on: true},
    {nome: 'Rafael Nunes', email: 'rafael@oficinadoarthur.com.br', papel: 'Mecânico', ultimo: 'há 30 min', on: true},
    {nome: 'Diego Alves', email: 'diego@oficinadoarthur.com.br', papel: 'Mecânico', ultimo: 'há 1 h', on: true},
    {nome: 'Marcos Reis', email: 'marcos@oficinadoarthur.com.br', papel: 'Mecânico', ultimo: 'ontem', on: false},
  ],
  integ: [
    {n: 'SMS e e-mail', d: 'Avisos, campanhas e link de aprovação de orçamento', ic: 'msg', st: 'Conectado', on: true},
    {n: 'NFS-e (prefeitura)', d: 'Emissão da nota de serviço na entrega do veículo', ic: 'file', st: 'Conectado', on: true},
    {n: 'NF-e de peças', d: 'Nota fiscal de venda de peças e importação de XML', ic: 'file', st: 'Conectado', on: true},
    {n: 'Banco — Open Finance', d: 'Extrato automático e conciliação de recebimentos', ic: 'bank', st: 'Configurar', on: false},
    {n: 'Pix e boletos', d: 'Cobrança com link de pagamento e baixa automática', ic: 'financeiro', st: 'Conectado', on: true},
    {n: 'Google Agenda', d: 'Sincroniza agendamentos com a agenda da equipe', ic: 'agenda', st: 'Conectado', on: true},
    {n: 'Meta Lead Ads / Instagram', d: 'Leads de anúncios entram direto no funil do CRM', ic: 'marketing', st: 'Configurar', on: false},
    {n: 'Catálogo de peças do fornecedor', d: 'Preço e disponibilidade em tempo real', ic: 'truck', st: 'Em breve', on: false},
  ],
  notifs: [
    {ic: 'eye', c: 'blue', txt: '<b>Mariana Souza</b> visualizou o orçamento 1050', at: 'há 2 min', go: ['orcamentos'], dr: ['orc', 1050], read: false},
    {ic: 'alert', c: 'red', txt: '<b>4 peças</b> abaixo do estoque mínimo', at: 'há 18 min', go: ['estoque', 'analise'], read: false},
    {ic: 'star', c: 'amber', txt: 'NPS 4 de <b>Patrícia Rocha</b> — requer contato', at: 'há 1 h', go: ['marketing', 'nps'], read: false},
    {ic: 'clock', c: '', txt: 'OS 2314 está <b>atrasada</b> (aguardando peça)', at: 'há 2 h', go: ['os'], dr: ['os', 2314], read: true},
  ],
};
let SEQ = {orc: 1053, os: 2319, fin: 13, ag: 100, ped: 414, cli: 9, lead: 7};

// ===== helpers de domínio =====
const cli = id => S.clientes.find(c => c.id === id);
const osById = id => S.os.find(o => o.id === id);
const orcById = id => S.orcamentos.find(o => o.id === id);
const peca = cod => S.estoque.find(p => p.cod === cod);
const serv = id => S.servicos.find(s => s.id === id);
const info = it => it.t === 'S' ? serv(it.r) : peca(it.r);
const itVal = it => info(it).preco * it.q;
const tot = itens => sum(itens, itVal);
const orcTot = o => tot(o.itens) * (1 - (o.desc || 0) / 100);
const veic = (cid, placa) => { const v = cli(cid).veiculos.find(v => v.placa === placa); return v ? v.modelo : ''; };
const resumo = itens => itens.filter(i => i.t === 'S').map(i => info(i).nome).join(' + ') || (itens[0] ? info(itens[0]).nome : '—');
const osAbertas = () => S.os.filter(o => o.status !== 'Entregue');
const reservado = p => sum(osAbertas(), o => sum(o.itens.filter(i => i.t === 'P' && i.r === p.cod), i => i.q));
const disp = p => p.qtd - reservado(p);
const cobertura = p => p.c30 ? Math.round(disp(p) / (p.c30 / 30)) : null;
const stq = p => { const d = disp(p); if (d <= 0) return 'Ruptura'; if (d <= p.min) return 'Repor'; if (p.qtd > p.max) return 'Excesso'; return 'OK'; };
const baixo = () => S.estoque.filter(p => disp(p) <= p.min && !p.pend);
const sugCompra = p => Math.max(0, p.max - disp(p) - (p.pend || 0));
const valorEstoque = () => sum(S.estoque, p => p.qtd * p.custo);
const horasPrev = itens => sum(itens.filter(i => i.t === 'S'), i => serv(i.r).h * i.q);
const MODELOS = ['VW Polo Highline 2022', 'Chevrolet Tracker LTZ 2021', 'Fiat Argo Drive 2023', 'Hyundai Creta Limited 2022', 'Toyota Hilux SRV 2020', 'Jeep Compass Longitude 2021', 'Nissan Kicks SV 2022', 'Renault Duster Iconic 2021', 'Honda HR-V EXL 2020'];
const CHECK = ['Nível de combustível registrado', 'Fotos da lataria (4 lados)', 'Quilometragem registrada', 'Pertences no veículo conferidos', 'Luzes do painel verificadas', 'Nível de óleo e fluidos', 'Pneus e calibragem', 'Freios (pastilhas e discos)', 'Suspensão e direção', 'Bateria e sistema elétrico', 'Teste de rodagem', 'Limpeza para entrega'];
const PACKS = [
  {n: 'Revisão 10.000 km', it: [['S', 'S2', 1], ['P', 'P01', 4], ['P', 'P02', 1], ['P', 'P03', 1], ['P', 'P04', 1]]},
  {n: 'Troca de óleo', it: [['S', 'S1', 1], ['P', 'P01', 4], ['P', 'P02', 1]]},
  {n: 'Freios dianteiros', it: [['S', 'S5', 1], ['P', 'P05', 1], ['P', 'P11', 1]]},
  {n: 'Ar-condicionado', it: [['S', 'S6', 1], ['P', 'P12', 1], ['P', 'P04', 1]]},
  {n: 'Alinhamento', it: [['S', 'S3', 1]]},
];

// enriquece os dados de exemplo (histórico das OS, checklist, mensagens)
(function seed() {
  S.os.forEach(o => {
    const idx = S.osStatus.indexOf(o.status);
    o.hist = [{st: 'OS aberta', at: `${fmtDM(o.entrada)} 08:${pad(5 + o.id % 40)}`, by: 'Juliana Prado (recepção)'}];
    for (let i = 1; i <= idx; i++) o.hist.push({st: S.osStatus[i], at: `${fmtDM(o.entrada)} ${pad(8 + i * 2)}:${pad((o.id * 7 + i * 13) % 60)}`, by: i === 5 ? 'Juliana Prado' : o.mec});
    o.ck = [...Array(Math.min(12, 4 + idx * 2)).keys()];
    o.horas = Math.round(horasPrev(o.itens) * Math.min(1, idx / 4) * 10) / 10;
  });
  S.orcamentos.forEach(o => {
    o.hist = [{t: 'Orçamento criado', at: `${fmtDM(o.data)} 09:12`, by: 'Juliana Prado'}];
    if (o.status !== 'Rascunho') o.hist.push({t: 'Enviado por SMS e e-mail', at: `${fmtDM(o.data)} 09:15`, by: 'Sistema'}, {t: 'Visualizado pelo cliente', at: `${fmtDM(o.data)} 10:02`, by: cli(o.cliente).nome});
    if (o.status === 'Aprovado') o.hist.push({t: 'Aprovado pelo cliente (link)', at: `${fmtDM(o.data)} 10:40`, by: cli(o.cliente).nome, ok: 1});
    if (o.status === 'Recusado') o.hist.push({t: `Recusado — motivo: ${o.motivo}`, at: `${fmtDM(addD(o.data, 1))} 14:20`, by: cli(o.cliente).nome});
  });
  S.clientes.forEach(c => {
    const v = c.veiculos[0].modelo.split(' ').slice(0, 2).join(' ');
    c.msgs = [
      {out: 1, txt: `Olá, ${c.nome.split(' ')[0]}! Seu ${v} está pronto para retirada. Total: ${brl(c.gasto / c.visitas)}.`, at: `${fmtDM(c.ultimo)} 16:40`},
      {out: 0, txt: 'Obrigado! Passo aí às 18h.', at: `${fmtDM(c.ultimo)} 16:52`},
      {out: 1, txt: 'De 0 a 10, quanto você recomendaria a nossa oficina?', at: `${fmtDM(addD(c.ultimo, 2))} 10:00`},
      {out: 0, txt: String(c.tag === 'Em risco' ? 6 : 10), at: `${fmtDM(addD(c.ultimo, 2))} 10:21`},
    ];
  });
})();
