export type EnergyCategory = 'rinnovabile' | 'esauribile' | 'nuova';

export type EnergyId =
  | 'sole'
  | 'acqua'
  | 'atomo'
  | 'vento'
  | 'carbone'
  | 'petrolio'
  | 'metano'
  | 'geotermico'
  | 'rifiuti'
  | 'idrogeno';

export interface DiscoveryFact {
  id: string;
  objectName: string;
  title: string;
  inventors: string;
  year: string;
  summary: string;
  funFact: string;
  transformation: string;
}

export interface BuildablePart {
  id: string;
  name: string;
  role: string;
}

export interface EnergySourceSpec {
  id: EnergyId;
  name: string;
  subtitle: string;
  category: EnergyCategory;
  categoryLabel: string;
  dependsOnSun: boolean;
  forms: string[];
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  shortGuide: string;
  buildParts: BuildablePart[];
  discoveries: Record<string, DiscoveryFact>;
}

export const ENERGY_SOURCES: EnergySourceSpec[] = [
  {
    id: 'sole',
    name: 'Sole',
    subtitle: 'Pannelli Fotovoltaici & Solare Termico',
    category: 'rinnovabile',
    categoryLabel: 'Fonte Rinnovabile',
    dependsOnSun: true,
    forms: ['Luminosa', 'Termica', 'Elettrica'],
    accentColor: '#D97706',
    badgeBg: 'bg-amber-50 border-amber-200',
    badgeText: 'text-amber-800',
    shortGuide:
      'Costruisci il circuito sul tetto, poi muovi il cursore del Sole! Puoi scegliere tra produrre elettricità (accumulata nella batteria) oppure scaldare l’acqua per la doccia.',
    buildParts: [
      { id: 'pannello', name: 'Pannello Solare', role: 'Cattura la luce o il calore del Sole' },
      { id: 'accumulo', name: 'Batteria / Serbatoio', role: 'Conserva elettricità o acqua calda' },
      { id: 'utenza', name: 'Casa & Lampada', role: 'Usa l’energia prodotta' },
    ],
    discoveries: {
      pannello_fotovoltaico: {
        id: 'pannello_fotovoltaico',
        objectName: 'Pannello Fotovoltaico',
        title: "Chi ha scoperto l'Effetto Fotoelettrico?",
        inventors: 'Alexandre Edmond Becquerel & Albert Einstein',
        year: '1839 – 1905',
        summary:
          'Nel 1839 il fisico francese Becquerel notò che la luce produceva una piccola corrente su certi materiali. Nel 1905 Albert Einstein spiegò il perché: la luce è fatta di pacchetti di energia chiamati fotoni che "spingono" fuori gli elettroni dal silicio!',
        funFact:
          'Albert Einstein vinse il Premio Nobel per la Fisica proprio grazie alla scoperta dell’effetto fotoelettrico, non per la relatività!',
        transformation: 'Energia Luminosa → Energia Elettrica',
      },
      collettore_termico: {
        id: 'collettore_termico',
        objectName: 'Pannello Solare Termico',
        title: "Chi ha inventato il primo scalda-acqua solare?",
        inventors: 'Horace-Bénédict de Saussure & Clarence Kemp',
        year: '1767 – 1891',
        summary:
          'Nel 1767 lo scienziato svizzero de Saussure costruì una scatola isolata con vetri neri capace di scaldare l’acqua oltre i 100 °C solo col Sole! Nel 1891 Clarence Kemp brevettò il primo scaldabagno solare per le case.',
        funFact:
          'I tubi scuri del pannello termico assorbono molto più calore di quelli bianchi perché il nero trattiene tutti i raggi solari.',
        transformation: 'Energia Luminosa → Energia Termica (Acqua Calda)',
      },
      batteria_volta: {
        id: 'batteria_volta',
        objectName: 'Batteria di Accumulo',
        title: 'Chi ha inventato la prima Batteria?',
        inventors: 'Alessandro Volta',
        year: '1799',
        summary:
          'Il fisico italiano Alessandro Volta impilò dischetti di zinco, rame e panno bagnato creando la "Pila di Volta": per la prima volta l’umanità poteva conservare l’elettricità e usarla quando serviva, proprio come facciamo oggi con l’energia solare di notte!',
        funFact:
          'L’unità di misura della tensione elettrica, il Volt (V), porta proprio il suo nome.',
        transformation: 'Energia Elettrica ↔ Energia Chimica',
      },
      lampadina_edison: {
        id: 'lampadina_edison',
        objectName: 'Casa & Lampadina',
        title: 'Chi ha inventato la Lampadina?',
        inventors: 'Joseph Swan, Thomas Edison & Lewis Latimer',
        year: '1879 – 1881',
        summary:
          'Joseph Swan e Thomas Edison perfezionarono i primi bulbi luminosi, mentre l’inventore Lewis Latimer creò il filamento di carbonio resistente che permise alle lampadine di durare centinaia di ore nelle case.',
        funFact:
          'Le lampadine a LED di oggi consumano circa 8 volte meno elettricità delle vecchie lampadine a filamento!',
        transformation: 'Energia Elettrica → Energia Luminosa',
      },
    },
  },
  {
    id: 'acqua',
    name: 'Acqua',
    subtitle: 'Diga & Centrale Idroelettrica',
    category: 'rinnovabile',
    categoryLabel: 'Fonte Rinnovabile',
    dependsOnSun: true,
    forms: ['Potenziale', 'Cinetica', 'Meccanica', 'Elettrica'],
    accentColor: '#0284C7',
    badgeBg: 'bg-sky-50 border-sky-200',
    badgeText: 'text-sky-800',
    shortGuide:
      'Monta la diga, la turbina e i cavi fino alla casa. Poi regola l’apertura della diga per far scendere l’acqua e premi l’interruttore dentro casa per accendere o spegnere la luce!',
    buildParts: [
      { id: 'diga', name: 'Diga & Condotta', role: 'Trattiene l’acqua in alto e la fa scendere' },
      { id: 'turbina', name: 'Turbina & Generatore', role: 'Trasforma la spinta dell’acqua in corrente' },
      { id: 'casa', name: 'Rete & Casa', role: 'Porta l’elettricità alle lampade' },
    ],
    discoveries: {
      diga_potenziale: {
        id: 'diga_potenziale',
        objectName: 'Diga e Bacino Idrico',
        title: 'Perché l’Acqua dipende dal Sole?',
        inventors: 'Aristide Bergès & il Ciclo dell’Acqua',
        year: '1869',
        summary:
          'Il Sole scalda i mari facendo evaporare l’acqua, che forma le nuvole e cade come pioggia in montagna! Trattenuta da una diga in alto, l’acqua possiede Energia Potenziale. L’ingegnere Bergès la chiamò "Carbone Bianco".',
        funFact:
          'Più la diga è alta rispetto alla centrale, più l’acqua arriva veloce e forte sulla turbina!',
        transformation: 'Energia Potenziale → Energia Cinetica',
      },
      turbina_pelton: {
        id: 'turbina_pelton',
        objectName: 'Turbina Idraulica',
        title: 'Chi ha inventato la Turbina Pelton?',
        inventors: 'Lester Allan Pelton',
        year: '1879',
        summary:
          'Durante la corsa all’oro in California, il falegname Lester Pelton inventò una ruota con speciali palette a doppio cucchiaio: quando il getto d’acqua le colpisce, l’acqua rimbalza trasferendo quasi tutta la sua forza alla ruota!',
        funFact:
          'Le turbine Pelton sono ancora oggi usate nelle grandi centrali idroelettriche delle Alpi italiane!',
        transformation: 'Energia Cinetica → Energia Meccanica',
      },
      generatore_faraday: {
        id: 'generatore_faraday',
        objectName: 'Generatore Elettrico (Dinamo)',
        title: 'Chi ha scoperto come creare Elettricità dal movimento?',
        inventors: 'Michael Faraday & Antonio Pacinotti',
        year: '1831 – 1860',
        summary:
          'Michael Faraday scoprì che muovendo una calamita vicino a un filo di rame si genera corrente elettrica (induzione elettromagnetica). Il fisico italiano Antonio Pacinotti costruì la prima dinamo continua ad anello!',
        funFact:
          'Quasi tutta l’elettricità del mondo — da acqua, vento, vapore o nucleare — nasce facendo girare calamite e bobine di rame!',
        transformation: 'Energia Meccanica → Energia Elettrica',
      },
    },
  },
  {
    id: 'atomo',
    name: 'Atomo',
    subtitle: 'Centrale Nucleare a Fissione',
    category: 'esauribile',
    categoryLabel: 'Fonte Minerale (Uranio)',
    dependsOnSun: false,
    forms: ['Nucleare', 'Termica', 'Meccanica', 'Elettrica'],
    accentColor: '#0D9488',
    badgeBg: 'bg-teal-50 border-teal-200',
    badgeText: 'text-teal-800',
    shortGuide:
      'Assembla il reattore ad uranio, la caldaia a vapore e la turbina per illuminare la città. Accendi o spegni la centrale e regola le barre di controllo per osservare come l’uranio fa bollire l’acqua!',
    buildParts: [
      { id: 'reattore', name: 'Reattore ad Uranio', role: 'Produce calore dividendo gli atomi' },
      { id: 'caldaia', name: 'Caldaia & Turbina', role: 'L’acqua bolle e il vapore fa girare la turbina' },
      { id: 'citta', name: 'Torre & Città', role: 'Raffredda il vapore e illumina i quartieri' },
    ],
    discoveries: {
      fissione_uranio: {
        id: 'fissione_uranio',
        objectName: 'Barre di Uranio',
        title: 'Chi ha scoperto la Fissione Nucleare?',
        inventors: 'Enrico Fermi, Lise Meitner & Otto Hahn',
        year: '1934 – 1942',
        summary:
          'Il fisico italiano Enrico Fermi bombardò l’uranio con neutroni, e nel 1938 Lise Meitner spiegò che l’atomo di uranio si era spaccato in due ("fissione"), liberando una quantità gigantesca di calore senza bisogno di bruciare ossigeno!',
        funFact:
          'Una pastiglia di uranio grande come la punta di un dito produce tanta energia quanto una tonnellata intera di carbone!',
        transformation: 'Energia Nucleare → Energia Termica',
      },
      barre_controllo: {
        id: 'barre_controllo',
        objectName: 'Barre di Controllo',
        title: 'Come si spegne una Centrale Nucleare?',
        inventors: 'Enrico Fermi & team Chicago Pile-1',
        year: '1942',
        summary:
          'Tra le barre di uranio si inseriscono barre speciali (spesso di boro o cadmio) che assorbono i neutroni liberi come una spugna: abbassandole tutte dentro il reattore, la reazione si ferma in sicurezza!',
        funFact:
          'Enrico Fermi costruì la prima pila atomica funzionante sotto le tribune di uno stadio a Chicago.',
        transformation: 'Controllo della Fissione a Catena',
      },
      torre_vapore: {
        id: 'torre_vapore',
        objectName: 'Torre di Raffreddamento',
        title: 'Cos’è la nuvola bianca sopra la centrale?',
        inventors: 'Ingegneria Termotecnica Moderna',
        year: 'XX Secolo',
        summary:
          'La centrale nucleare usa il calore dell’uranio per far bollire l’acqua. Dopo aver fatto girare la turbina, il vapore va nella grande torre per raffreddarsi e tornare acqua liquida: ciò che esce è solo vapore acqueo pulito, non fumo!',
        funFact:
          'Le centrali nucleari non emettono CO2 mentre producono elettricità, ma producono scorie radioattive da custodire con cura.',
        transformation: 'Energia Termica → Meccanica → Elettrica',
      },
    },
  },
  {
    id: 'vento',
    name: 'Vento',
    subtitle: 'Pale Eoliche & Correnti Termiche',
    category: 'rinnovabile',
    categoryLabel: 'Fonte Rinnovabile',
    dependsOnSun: true,
    forms: ['Eolica', 'Meccanica', 'Elettrica'],
    accentColor: '#0EA5E9',
    badgeBg: 'bg-cyan-50 border-cyan-200',
    badgeText: 'text-cyan-800',
    shortGuide:
      'Monta la pala eolica, l’alternatore e la stalla. Poi varia il Sole sul mare: guarda come le differenze tra l’aria fredda sul mare e l’aria calda sul prato creano il vento che accende la stalla!',
    buildParts: [
      { id: 'torre', name: 'Torre & Rotore Eolico', role: 'Cattura la forza del vento' },
      { id: 'alternatore', name: 'Moltiplicatore & Generatore', role: 'Trasforma la rotazione in corrente' },
      { id: 'stalla', name: 'Cavi & Stalla', role: 'Illumina e scalda la fattoria' },
    ],
    discoveries: {
      correnti_vento: {
        id: 'correnti_vento',
        objectName: 'Mare, Sole e Correnti',
        title: 'Come nasce il Vento tra Mare e Terra?',
        inventors: 'Evangelista Torricelli & George Hadley',
        year: '1643 – 1735',
        summary:
          'Il Sole scalda la terraferma più velocemente del mare! L’aria calda sopra i campi diventa leggera e sale verso l’alto, mentre l’aria più fredda che staziona sul mare corre verso la terra per prendere il suo posto: ecco il vento!',
        funFact:
          'Evangelista Torricelli (inventore del barometro) capì per primo che il vento è causato dalle differenze di pressione e temperatura dell’aria.',
        transformation: 'Energia Solare → Energia Eolica (Cinetica dell’aria)',
      },
      pala_eolica: {
        id: 'pala_eolica',
        objectName: 'Pala Eolica',
        title: 'Chi ha costruito la prima Turbina Eolica Elettrica?',
        inventors: 'James Blyth, Charles F. Brush & Poul la Cour',
        year: '1887 – 1891',
        summary:
          'Per migliaia di anni i mulini a vento hanno macinato il grano e pompato acqua. Nel 1887-1888 lo scozzese Blyth e l’americano Brush collegarono le pale a una dinamo, illuminando una casa col vento per la prima volta!',
        funFact:
          'Le pale di una grande turbina eolica moderna hanno la stessa forma aerodinamica delle ali di un aeroplano!',
        transformation: 'Energia Eolica → Energia Meccanica',
      },
      motore_elettrico: {
        id: 'motore_elettrico',
        objectName: 'Generatore & Motore Elettrico',
        title: 'Chi ha inventato il Motore Elettrico?',
        inventors: 'Galileo Ferraris, Nikola Tesla & Thomas Davenport',
        year: '1834 – 1888',
        summary:
          'Un generatore e un motore elettrico sono quasi gemelli! Nel 1885 l’italiano Galileo Ferraris e poco dopo Nikola Tesla scoprirono il campo magnetico rotante, alla base dei motori e dei generatori moderni.',
        funFact:
          'Se fai girare l’asse di un motore elettrico con il vento, diventa subito un generatore che produce corrente!',
        transformation: 'Energia Meccanica ↔ Energia Elettrica',
      },
    },
  },
  {
    id: 'carbone',
    name: 'Carbone',
    subtitle: 'Centrale Termoelettrica a Carbone',
    category: 'esauribile',
    categoryLabel: 'Fonte Esauribile (Fossile)',
    dependsOnSun: true,
    forms: ['Chimica', 'Termica', 'Meccanica', 'Elettrica'],
    accentColor: '#475569',
    badgeBg: 'bg-slate-100 border-slate-300',
    badgeText: 'text-slate-800',
    shortGuide:
      'Costruisci la caldaia e la turbina a vapore. Carica il carbone nella fornace e regola l’aria: osserva come il vapore muove la turbina, ma attenzione alla riserva finita e al fumo di CO2!',
    buildParts: [
      { id: 'fornace', name: 'Fornace & Caldaia', role: 'Brucia il carbone per far bollire l’acqua' },
      { id: 'turbina_vapore', name: 'Turbina a Vapore', role: 'Il vapore in pressione spinge le pale' },
      { id: 'fabbrica', name: 'Generatore & Officina', role: 'Trasforma il moto in elettricità' },
    ],
    discoveries: {
      carbone_origine: {
        id: 'carbone_origine',
        objectName: 'Giacimento di Carbone',
        title: 'Da dove viene il Carbone e perché è Esauribile?',
        inventors: 'Foreste del Carbonifero (300 milioni di anni fa)',
        year: 'Era Paleozoica',
        summary:
          'Il carbone è formato da antichissime piante e felci giganti che assorbirono l’energia del Sole milioni di anni fa! Sepolte sotto fango e rocce senza aria, si sono trasformate in roccia nera piena di energia chimica.',
        funFact:
          'Poiché ci vogliono milioni di anni per formarsi, quando finiamo una miniera di carbone non possiamo farlo ricrescere rapidamente: per questo si chiama "esauribile"!',
        transformation: 'Energia Solare antica → Energia Chimica',
      },
      macchina_vapore: {
        id: 'macchina_vapore',
        objectName: 'Caldaia & Turbina a Vapore',
        title: 'Chi ha perfezionato la Macchina a Vapore?',
        inventors: 'Thomas Newcomen & James Watt',
        year: '1712 – 1769',
        summary:
          'James Watt migliorò così tanto il motore a vapore alimentato a carbone da dare il via alla Rivoluzione Industriale: treni, navi e fabbriche iniziarono a muoversi grazie al vapore!',
        funFact:
          'Anche l’unità di misura della potenza elettrica — il Watt (W) — è dedicata a James Watt!',
        transformation: 'Energia Termica → Meccanica → Elettrica',
      },
    },
  },
  {
    id: 'petrolio',
    name: 'Petrolio',
    subtitle: 'Pozzo, Raffineria & Motore',
    category: 'esauribile',
    categoryLabel: 'Fonte Esauribile (Fossile)',
    dependsOnSun: true,
    forms: ['Chimica', 'Termica', 'Cinetica', 'Elettrica'],
    accentColor: '#B45309',
    badgeBg: 'bg-orange-50 border-orange-200',
    badgeText: 'text-orange-900',
    shortGuide:
      'Monta la pompa di estrazione, la torre di raffinazione e il motore. Avvia la pompa per estrarre l’oro nero (attenzione: la riserva scende!) e accendi il generatore / veicolo.',
    buildParts: [
      { id: 'pompa', name: 'Pompa di Estrazione', role: 'Porta in superficie il petrolio grezzo' },
      { id: 'raffineria', name: 'Torre di Raffinazione', role: 'Separa benzina, gasolio e altri derivati' },
      { id: 'motore', name: 'Motore & Alternatore', role: 'Trasforma il carburante in moto e luce' },
    ],
    discoveries: {
      pozzo_drake: {
        id: 'pozzo_drake',
        objectName: 'Pozzo di Petrolio',
        title: 'Chi ha scavato il primo Pozzo di Petrolio moderno?',
        inventors: 'Edwin Drake ("Colonnello Drake")',
        year: '1859',
        summary:
          'Prima del 1859 il petrolio si raccoglieva solo dove affiorava per caso. Edwin Drake trivellò il primo pozzo meccanico profondo in Pennsylvania (USA), avviando l’era moderna dell’"oro nero".',
        funFact:
          'Il petrolio si è formato in milioni di anni dai resti di minuscoli organismi marini (plancton) che ricevettero energia dal Sole!',
        transformation: 'Energia Chimica → Energia Termica',
      },
      raffineria_petrolio: {
        id: 'raffineria_petrolio',
        objectName: 'Torre di Raffinazione',
        title: 'Chi ha inventato la Raffinazione del Petrolio?',
        inventors: 'Ignacy Łukasiewicz',
        year: '1853',
        summary:
          'Il farmacista polacco Ignacy Łukasiewicz scoprì come distillare il petrolio grezzo scaldandolo a diverse temperature: così si separano gas leggeri, benzina, cherosene per le lampade e bitume per le strade!',
        funFact:
          'Dal petrolio si ricavano non solo carburanti, ma anche quasi tutte le plastiche degli oggetti che usiamo ogni giorno.',
        transformation: 'Separazione chimica per distillazione',
      },
      motore_scoppio: {
        id: 'motore_scoppio',
        objectName: 'Motore a Scoppio',
        title: 'Chi ha inventato il Motore a Scoppio?',
        inventors: 'Eugenio Barsanti & Felice Matteucci (poi Nicolaus Otto)',
        year: '1853',
        summary:
          'I due inventori toscani Barsanti e Matteucci progettarono il primo vero motore a combustione interna: una scintilla fa bruciare la miscela di aria e carburante nel cilindro, spingendo il pistone!',
        funFact:
          'Le auto elettriche oggi sostituiscono questo motore con batterie e motori elettrici molto più silenziosi e senza gas di scarico.',
        transformation: 'Energia Chimica → Termica → Cinetica',
      },
    },
  },
  {
    id: 'metano',
    name: 'Metano',
    subtitle: 'Gas Naturale & Turbina a Gas',
    category: 'esauribile',
    categoryLabel: 'Fonte Esauribile (Fossile)',
    dependsOnSun: true,
    forms: ['Chimica', 'Termica', 'Meccanica', 'Elettrica'],
    accentColor: '#2563EB',
    badgeBg: 'bg-blue-50 border-blue-200',
    badgeText: 'text-blue-800',
    shortGuide:
      'Collega il gasdotto, il bruciatore a fiamma blu e il condominio. Apri la valvola del gas metano per vedere come scalda le case e fa girare la turbina elettrica!',
    buildParts: [
      { id: 'gasdotto', name: 'Gasdotto & Valvola', role: 'Trasporta il gas naturale in pressione' },
      { id: 'turbogas', name: 'Bruciatore & Turbogas', role: 'La fiamma blu muove la turbina' },
      { id: 'condominio', name: 'Condominio & Termosifoni', role: 'Fornisce calore ed elettricità' },
    ],
    discoveries: {
      gas_volta: {
        id: 'gas_volta',
        objectName: 'Giacimento & Gasdotto di Metano',
        title: 'Chi ha scoperto il Gas Metano?',
        inventors: 'Alessandro Volta',
        year: '1776',
        summary:
          'Mentre navigava sui canneti del Lago Maggiore, Alessandro Volta vide salire bolle dall’acqua, le raccolse in una bottiglia e vide che bruciavano con una bella fiamma azzurra: aveva scoperto il metano ("aria infiammabile delle paludi")!',
        funFact:
          'Il metano naturale è inodore! Nelle tubature delle case si aggiunge apposta una goccia di sostanza profumata (mercaptano) per farci sentire subito se c’è una perdita.',
        transformation: 'Energia Chimica → Energia Termica',
      },
      turbina_gas: {
        id: 'turbina_gas',
        objectName: 'Centrale Turbogas',
        title: 'Come funziona una Turbina a Gas?',
        inventors: 'Frank Whittle & Hans von Ohain (turbine moderne)',
        year: '1930 – 1939',
        summary:
          'Il metano brucia con aria compressa facendo espandere gas caldissimi che spingono direttamente una turbina velocissima (simile al motore di un aereo fissato a terra!). Il calore rimasto bolle altra acqua per una seconda turbina!',
        funFact:
          'Tra i combustibili fossili (carbone, petrolio, metano), il metano è quello che produce meno polveri sottili e meno CO2 a parità di energia.',
        transformation: 'Energia Termica → Meccanica → Elettrica',
      },
    },
  },
  {
    id: 'geotermico',
    name: 'Geotermico',
    subtitle: 'Calore della Terra & Vapore Naturale',
    category: 'rinnovabile',
    categoryLabel: 'Fonte Rinnovabile',
    dependsOnSun: false,
    forms: ['Termica', 'Meccanica', 'Elettrica'],
    accentColor: '#DC2626',
    badgeBg: 'bg-red-50 border-red-200',
    badgeText: 'text-red-800',
    shortGuide:
      'Posiziona i pozzi profondi, la turbina e la serra riscaldata. Pompa acqua fredda verso le rocce bollenti del sottosuolo: il vapore risalirà per produrre luce e scaldare le piante!',
    buildParts: [
      { id: 'pozzo', name: 'Pozzi Geotermici', role: 'Mandano acqua giù e raccolgono vapore su' },
      { id: 'turbina_geo', name: 'Turbina & Condensatore', role: 'Trasforma il vapore terrestre in corrente' },
      { id: 'serra', name: 'Serra Botanica', role: 'Usa calore ed elettricità tutto l’anno' },
    ],
    discoveries: {
      magma_terra: {
        id: 'magma_terra',
        objectName: 'Rocce Calde & Magma',
        title: 'Perché fa così caldo sotto i nostri piedi?',
        inventors: 'Calore Primordiale del Pianeta Terra',
        year: '4,5 miliardi di anni fa',
        summary:
          'Più si scende in profondità nella Terra, più la temperatura sale (circa +3 °C ogni 100 metri!). Questo calore immenso arriva dal nucleo terrestre e dal decadimento naturale di rocce radioattive profonde: è indipendente dal Sole e non si ferma mai!',
        funFact:
          'In Islanda il calore geotermico scalda perfino i marciapiedi d’inverno per sciogliere la neve!',
        transformation: 'Energia Geotermica (Termica) → Vapore',
      },
      larderello: {
        id: 'larderello',
        objectName: 'Centrale di Larderello',
        title: 'Dove è nata la prima Centrale Geotermica del mondo?',
        inventors: 'Principe Piero Ginori Conti (Larderello, Toscana)',
        year: '1904',
        summary:
          'Il 4 luglio 1904, a Larderello in Toscana, l’italiano Piero Ginori Conti usò il vapore naturale dei soffioni boraciferi per accendere 5 lampadine tramite una dinamo! Nel 1911 costruì lì la prima vera centrale geotermoelettrica del pianeta.',
        funFact:
          'Ancora oggi la Toscana produce circa il 30% di tutta l’elettricità di cui ha bisogno grazie all’energia geotermica!',
        transformation: 'Energia Termica → Meccanica → Elettrica',
      },
    },
  },
  {
    id: 'rifiuti',
    name: 'Rifiuti',
    subtitle: 'Biogas & Termovalorizzatore',
    category: 'nuova',
    categoryLabel: 'Recupero Energetico',
    dependsOnSun: false,
    forms: ['Chimica', 'Termica', 'Elettrica'],
    accentColor: '#16A34A',
    badgeBg: 'bg-emerald-50 border-emerald-200',
    badgeText: 'text-emerald-800',
    shortGuide:
      'Costruisci il digestore di biogas, la caldaia con i filtri e la rete di quartiere. Prova a inserire sia Scarti Organici (energia chimica!) sia Rifiuti Non Riciclabili (energia termica!), tenendo attivo il filtro ecologico!',
    buildParts: [
      { id: 'impianto', name: 'Digestore & Caldaia', role: 'Trasforma scarti in biogas o calore' },
      { id: 'filtro', name: 'Filtri & Turbina', role: 'Pulisce i fumi e genera elettricità' },
      { id: 'quartiere', name: 'Quartiere', role: 'Riceve energia dai propri scarti' },
    ],
    discoveries: {
      biogas_batteri: {
        id: 'biogas_batteri',
        objectName: 'Digestore Biogas (Organico)',
        title: 'Come fanno gli avanzi di cucina a creare Energia?',
        inventors: 'Microbiologia & Digestione Anaerobica',
        year: 'XIX – XXI Secolo',
        summary:
          'Gli scarti di frutta, verdura e letame vengono chiusi in grandi vasche senza ossigeno. Miliardi di batteri amici li "digeriscono" producendo Biogas (ricco di metano) che può alimentare autobus e centrali elettriche!',
        funFact:
          'Ciò che resta nella vasca alla fine diventa un ottimo fertilizzante naturale (compost) per i campi!',
        transformation: 'Energia Chimica (Biomassa) → Gas → Elettrica',
      },
      termovalorizzatore: {
        id: 'termovalorizzatore',
        objectName: 'Termovalorizzatore & Filtri',
        title: 'Come funziona un Termovalorizzatore moderno?',
        inventors: 'Ingegneria Ambientale Moderna',
        year: 'XX – XXI Secolo',
        summary:
          'Prima si ricicla tutto il possibile (carta, vetro, plastica, metalli)! Solo la parte che non si può più riciclare viene bruciata ad altissima temperatura per fare vapore, mentre speciali filtri a maniche e carboni attivi catturano le polveri.',
        funFact:
          'A Copenaghen c’è un termovalorizzatore così pulito che sul tetto hanno costruito una pista da sci aperta tutto l’anno!',
        transformation: 'Energia Chimica → Termica → Elettrica',
      },
    },
  },
  {
    id: 'idrogeno',
    name: 'Idrogeno',
    subtitle: 'Elettrolisi & Cella a Combustibile',
    category: 'nuova',
    categoryLabel: 'Nuova Fonte / Vettore',
    dependsOnSun: false,
    forms: ['Chimica', 'Elettrica', 'Cinetica'],
    accentColor: '#4F46E5',
    badgeBg: 'bg-indigo-50 border-indigo-200',
    badgeText: 'text-indigo-800',
    shortGuide:
      'Assembla l’elettrolizzatore, il serbatoio H₂ e il Bus a idrogeno. Prima usa elettricità pulita per dividere l’acqua in idrogeno, poi manda l’idrogeno nella cella per far viaggiare il bus lasciando solo acqua pura!',
    buildParts: [
      { id: 'elettrolizzatore', name: 'Elettrolizzatore H₂O', role: 'Separa l’acqua in Idrogeno e Ossigeno' },
      { id: 'serbatoio', name: 'Serbatoio H₂', role: 'Immagazzina l’idrogeno in sicurezza' },
      { id: 'bus', name: 'Cella & Bus Elettrico', role: 'Trasforma H₂ in corrente silenziosa' },
    ],
    discoveries: {
      elettrolisi: {
        id: 'elettrolisi',
        objectName: 'Elettrolizzatore (H₂O → H₂ + O₂)',
        title: 'Chi ha scoperto come estrarre Idrogeno dall’Acqua?',
        inventors: 'William Nicholson & Anthony Carlisle',
        year: '1800',
        summary:
          'Appena poche settimane dopo che Alessandro Volta inventò la pila, Nicholson e Carlisle immersero due fili elettrici in acqua: videro subito salire bollicine di Idrogeno da un lato e Ossigeno dall’altro!',
        funFact:
          'Se l’elettricità per dividere l’acqua arriva dal Sole o dal Vento, il risultato si chiama "Idrogeno Verde"!',
        transformation: 'Energia Elettrica → Energia Chimica (H₂)',
      },
      cella_combustibile: {
        id: 'cella_combustibile',
        objectName: 'Cella a Combustibile',
        title: 'Chi ha inventato la Cella a Combustibile?',
        inventors: 'William Robert Grove',
        year: '1839',
        summary:
          'Il giudice e scienziato gallese William Grove inventò la "batteria a gas": un dispositivo che fa il processo inverso dell’elettrolisi! Riunisce idrogeno e ossigeno generando corrente elettrica continua senza bruciare nulla.',
        funFact:
          'Dallo scarico di un autobus o di un treno a idrogeno escono solo goccioline di acqua pura distillata!',
        transformation: 'Energia Chimica (H₂) → Elettrica → Cinetica',
      },
    },
  },
];

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const ENERGY_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: 'Chi ha spiegato l’Effetto Fotoelettrico che fa funzionare i pannelli solari fotovoltaici?',
    options: ['Albert Einstein (con Becquerel)', 'James Watt', 'Edwin Drake', 'Lester Pelton'],
    correctIndex: 0,
    explanation: 'Nel 1905 Albert Einstein spiegò come i fotoni della luce liberano elettroni, vincendo il Nobel!',
  },
  {
    id: 2,
    question: 'Da quale fonte naturale dipende la nascita del vento tra mare e terraferma?',
    options: ['Dal nucleo di uranio', 'Dal Sole che scalda in modo diverso terra e mare', 'Dal carbone sotterraneo', 'Dalla Luna'],
    correctIndex: 1,
    explanation: 'L’aria calda sulla terraferma sale e l’aria più fredda che staziona sul mare corre a sostituirla creando il vento!',
  },
  {
    id: 3,
    question: 'Cosa fa bollire l’acqua dentro una centrale nucleare?',
    options: ['Il fuoco del gas metano', 'Il calore liberato dalla fissione dell’uranio', 'I raggi del Sole concentrati', 'Il magma del sottosuolo'],
    correctIndex: 1,
    explanation: 'La fissione degli atomi di uranio libera un grande calore che fa bollire l’acqua per spingere le turbine.',
  },
  {
    id: 4,
    question: 'Dove è stata costruita nel 1904 la prima centrale geotermica al mondo?',
    options: ['A Londra', 'A Larderello, in Toscana (Italia)', 'In California', 'A Parigi'],
    correctIndex: 1,
    explanation: 'Piero Ginori Conti accese le prime lampadine col vapore terrestre a Larderello nel 1904!',
  },
  {
    id: 5,
    question: 'Quali tra queste sono tutte "Fonti Esauribili" (fossili)?',
    options: ['Sole, Acqua, Vento', 'Carbone, Petrolio, Metano', 'Geotermico, Sole, Idrogeno', 'Vento, Rifiuti, Acqua'],
    correctIndex: 1,
    explanation: 'Carbone, petrolio e metano hanno impiegato milioni di anni a formarsi e si esauriscono man mano che li usiamo.',
  },
  {
    id: 6,
    question: 'Cosa esce dallo scarico di un autobus alimentato da una cella a idrogeno?',
    options: ['Fumo nero di carbone', 'Solo gocce di acqua pura (vapore)', 'Gas metano', 'Uranio liquido'],
    correctIndex: 1,
    explanation: 'La cella a combustibile unisce idrogeno e ossigeno creando elettricità e pura acqua (H₂O)!',
  },
  {
    id: 7,
    question: 'Quale scienziato italiano inventò la prima batteria (pila) e scoprì anche il gas metano?',
    options: ['Alessandro Volta', 'Galileo Galilei', 'Guglielmo Marconi', 'Enrico Fermi'],
    correctIndex: 0,
    explanation: 'Alessandro Volta scoprì il metano nel 1776 sul Lago Maggiore e inventò la pila elettrica nel 1799!',
  },
];
