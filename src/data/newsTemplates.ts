import { Industry, NewsItem } from '../types';
import { v4 as uuid } from 'uuid';

interface NewsTemplate {
  headline: string;
  content: string;
  impact: number;
  affectedIndustries: Industry[];
  affectedCompanyIds: string[];
  category: NewsItem['category'];
}

const globalNews: NewsTemplate[] = [
  {
    headline: 'Zentralbank senkt Leitzins um 0,5%',
    content: 'Die Europäische Zentralbank hat überraschend den Leitzins gesenkt. Analysten erwarten positive Auswirkungen auf den gesamten Markt.',
    impact: 0.4,
    affectedIndustries: ['finance', 'realestate', 'retail'],
    affectedCompanyIds: [],
    category: 'global',
  },
  {
    headline: 'Globale Rezessionsängste nehmen zu',
    content: 'Neue Wirtschaftsdaten deuten auf eine Verlangsamung der globalen Konjunktur hin. Investoren werden vorsichtiger.',
    impact: -0.5,
    affectedIndustries: [],
    affectedCompanyIds: [],
    category: 'global',
  },
  {
    headline: 'Inflation sinkt auf 2-Jahres-Tief',
    content: 'Die Inflation ist überraschend stark gesunken. Der Markt reagiert euphorisch auf die Nachricht.',
    impact: 0.5,
    affectedIndustries: [],
    affectedCompanyIds: [],
    category: 'global',
  },
  {
    headline: 'Handelskrieg eskaliert: Neue Zölle angekündigt',
    content: 'Die USA und China haben neue Strafzölle angekündigt. Die Unsicherheit an den Märkten steigt.',
    impact: -0.6,
    affectedIndustries: ['tech', 'automotive', 'retail'],
    affectedCompanyIds: [],
    category: 'global',
  },
  {
    headline: 'G20-Gipfel: Einigung auf Klimapaket',
    content: 'Die G20-Staaten haben sich auf ein ambitioniertes Klimapaket geeinigt. Erneuerbare Energien profitieren.',
    impact: 0.6,
    affectedIndustries: ['energy'],
    affectedCompanyIds: ['sol', 'fus'],
    category: 'global',
  },
  {
    headline: 'Ölpreis steigt auf 120$ pro Barrel',
    content: 'Geopolitische Spannungen treiben den Ölpreis. Energiekosten belasten die Industrie.',
    impact: -0.3,
    affectedIndustries: ['automotive', 'food', 'retail'],
    affectedCompanyIds: [],
    category: 'global',
  },
  {
    headline: 'Arbeitsmarkt überraschend stark',
    content: 'Die Arbeitslosenquote ist auf ein Rekordtief gesunken. Konsumausgaben dürften steigen.',
    impact: 0.35,
    affectedIndustries: ['retail', 'entertainment', 'food'],
    affectedCompanyIds: [],
    category: 'global',
  },
  {
    headline: 'Kryptowährungen brechen ein - Flucht in Aktien',
    content: 'Nach dem Krypto-Crash suchen Anleger Sicherheit in traditionellen Aktien. Bankensektor profitiert.',
    impact: 0.25,
    affectedIndustries: ['finance'],
    affectedCompanyIds: ['glb', 'fpay'],
    category: 'global',
  },
];

const industryNews: Record<Industry, NewsTemplate[]> = {
  tech: [
    {
      headline: 'KI-Revolution: Neue Durchbrüche bei Large Language Models',
      content: 'Forscher haben einen neuen Ansatz für KI-Modelle entwickelt, der die Effizienz verdreifacht.',
      impact: 0.5,
      affectedIndustries: ['tech'],
      affectedCompanyIds: ['nex'],
      category: 'industry',
    },
    {
      headline: 'Massive Datenpanne bei Cloud-Anbietern',
      content: 'Millionen Kundendaten wurden kompromittiert. Cybersicherheitsaktien steigen.',
      impact: 0.4,
      affectedIndustries: ['tech'],
      affectedCompanyIds: ['cnet'],
      category: 'industry',
    },
    {
      headline: 'EU verschärft Tech-Regulierung',
      content: 'Neue Vorschriften könnten die Geschäftsmodelle großer Tech-Konzerne einschränken.',
      impact: -0.4,
      affectedIndustries: ['tech'],
      affectedCompanyIds: [],
      category: 'industry',
    },
    {
      headline: 'Quantencomputer knackt erstmals RSA-Verschlüsselung',
      content: 'Ein Durchbruch im Quantencomputing erschüttert die IT-Sicherheitsbranche.',
      impact: 0.7,
      affectedIndustries: ['tech'],
      affectedCompanyIds: ['qbit', 'cnet'],
      category: 'industry',
    },
  ],
  energy: [
    {
      headline: 'Solarzellen-Effizienz erreicht neuen Rekord',
      content: 'Neue Perowskit-Solarzellen erreichen 35% Effizienz. Solarbranche im Aufschwung.',
      impact: 0.6,
      affectedIndustries: ['energy'],
      affectedCompanyIds: ['sol'],
      category: 'industry',
    },
    {
      headline: 'Fusionsreaktor erzielt erstmals Netto-Energiegewinn',
      content: 'Ein historischer Moment für die Energiebranche. Fusionsenergie wird Realität.',
      impact: 0.8,
      affectedIndustries: ['energy'],
      affectedCompanyIds: ['fus'],
      category: 'industry',
    },
    {
      headline: 'Subventionen für erneuerbare Energien gekürzt',
      content: 'Die Regierung hat überraschend Kürzungen bei Energiesubventionen angekündigt.',
      impact: -0.5,
      affectedIndustries: ['energy'],
      affectedCompanyIds: ['sol'],
      category: 'industry',
    },
  ],
  finance: [
    {
      headline: 'FinTech-Boom: Digitale Banken verdoppeln Kundenzahl',
      content: 'Der Trend zum digitalen Banking beschleunigt sich. Traditionelle Banken unter Druck.',
      impact: 0.3,
      affectedIndustries: ['finance'],
      affectedCompanyIds: ['fpay'],
      category: 'industry',
    },
    {
      headline: 'Neue Bankenregulierung verschärft Eigenkapitalanforderungen',
      content: 'Basel IV-Regeln treten in Kraft. Banken müssen mehr Kapital vorhalten.',
      impact: -0.35,
      affectedIndustries: ['finance'],
      affectedCompanyIds: ['glb'],
      category: 'industry',
    },
    {
      headline: 'Blockchain revolutioniert Zahlungsverkehr',
      content: 'Neue DeFi-Protokolle ermöglichen Echtzeit-Überweisungen zu minimalen Kosten.',
      impact: 0.4,
      affectedIndustries: ['finance'],
      affectedCompanyIds: ['fpay'],
      category: 'industry',
    },
  ],
  health: [
    {
      headline: 'Durchbruch in der Krebsforschung: mRNA-Therapie zeigt Erfolg',
      content: 'Klinische Studien zeigen vielversprechende Ergebnisse. Die Pharmabranche feiert.',
      impact: 0.7,
      affectedIndustries: ['health'],
      affectedCompanyIds: ['bio'],
      category: 'industry',
    },
    {
      headline: 'FDA verschärft Zulassungsverfahren',
      content: 'Neue Regulierungen könnten Medikamentenzulassungen verzögern.',
      impact: -0.4,
      affectedIndustries: ['health'],
      affectedCompanyIds: ['bio'],
      category: 'industry',
    },
    {
      headline: 'Roboterchirurgie: Neuer Meilenstein erreicht',
      content: 'KI-gesteuerte Operationsroboter erzielen bessere Ergebnisse als menschliche Chirurgen.',
      impact: 0.5,
      affectedIndustries: ['health'],
      affectedCompanyIds: ['med'],
      category: 'industry',
    },
  ],
  retail: [
    {
      headline: 'Online-Shopping-Rekord am Black Friday',
      content: 'E-Commerce-Umsätze übertreffen alle Erwartungen. Einzelhandelsaktien steigen.',
      impact: 0.5,
      affectedIndustries: ['retail'],
      affectedCompanyIds: ['mkt'],
      category: 'industry',
    },
    {
      headline: 'Luxusmarkt wächst zweistellig in Asien',
      content: 'Die asiatische Mittelschicht kauft verstärkt Luxusgüter.',
      impact: 0.4,
      affectedIndustries: ['retail'],
      affectedCompanyIds: ['lux'],
      category: 'industry',
    },
    {
      headline: 'Lieferkettenprobleme belasten Einzelhandel',
      content: 'Hafenstreiks und Containerknappheit führen zu Engpässen.',
      impact: -0.4,
      affectedIndustries: ['retail'],
      affectedCompanyIds: ['mkt'],
      category: 'industry',
    },
  ],
  automotive: [
    {
      headline: 'EU beschließt Verbrenner-Aus ab 2035',
      content: 'Elektrofahrzeuge werden zum neuen Standard. Traditionelle Hersteller unter Druck.',
      impact: 0.3,
      affectedIndustries: ['automotive'],
      affectedCompanyIds: ['evolt'],
      category: 'industry',
    },
    {
      headline: 'Autonomes Fahren: Level 5 erstmals zugelassen',
      content: 'Vollautonome Fahrzeuge dürfen erstmals ohne Fahrer auf die Straße.',
      impact: 0.6,
      affectedIndustries: ['automotive', 'tech'],
      affectedCompanyIds: ['evolt'],
      category: 'industry',
    },
    {
      headline: 'Lithium-Knappheit treibt Batteriepreise',
      content: 'Engpässe bei Rohstoffen verteuern die Produktion von E-Autos.',
      impact: -0.45,
      affectedIndustries: ['automotive'],
      affectedCompanyIds: ['evolt', 'turb'],
      category: 'industry',
    },
    {
      headline: 'Wasserstoff-LKW bestehen Praxistest',
      content: 'Erste Wasserstoff-Trucks absolvieren erfolgreich 1 Mio. Kilometer.',
      impact: 0.4,
      affectedIndustries: ['automotive', 'energy'],
      affectedCompanyIds: ['turb'],
      category: 'industry',
    },
  ],
  food: [
    {
      headline: 'Bio-Boom: Umsatz steigt um 25%',
      content: 'Verbraucher setzen verstärkt auf Bio-Lebensmittel. Nachhaltige Produzenten profitieren.',
      impact: 0.4,
      affectedIndustries: ['food'],
      affectedCompanyIds: ['grn'],
      category: 'industry',
    },
    {
      headline: 'Dürre in Europa bedroht Ernte',
      content: 'Extreme Hitze vernichtet Ernten. Lebensmittelpreise steigen.',
      impact: -0.3,
      affectedIndustries: ['food'],
      affectedCompanyIds: [],
      category: 'industry',
    },
    {
      headline: 'Craft-Beer-Trend boomt weltweit',
      content: 'Kleine Brauereien wachsen schneller als die großen Konzerne.',
      impact: 0.35,
      affectedIndustries: ['food'],
      affectedCompanyIds: ['brew'],
      category: 'industry',
    },
  ],
  entertainment: [
    {
      headline: 'VR-Gaming erobert den Massenmarkt',
      content: 'Neue erschwingliche VR-Headsets treiben den Gaming-Markt.',
      impact: 0.5,
      affectedIndustries: ['entertainment'],
      affectedCompanyIds: ['pxl'],
      category: 'industry',
    },
    {
      headline: 'Streaming-Wars: Abonnentenzahlen stagnieren',
      content: 'Der Streaming-Markt zeigt Sättigungserscheinungen. Anbieter kämpfen um Kunden.',
      impact: -0.35,
      affectedIndustries: ['entertainment'],
      affectedCompanyIds: ['strm'],
      category: 'industry',
    },
    {
      headline: 'Blockbuster-Game bricht Verkaufsrekorde',
      content: 'Das meistverkaufte Spiel aller Zeiten erzielt 3 Mrd. Euro Umsatz am ersten Tag.',
      impact: 0.6,
      affectedIndustries: ['entertainment'],
      affectedCompanyIds: ['pxl'],
      category: 'industry',
    },
  ],
  realestate: [
    {
      headline: 'Immobilienblase? Preise steigen weiter',
      content: 'Trotz Warnungen steigen die Immobilienpreise in Großstädten weiter an.',
      impact: 0.3,
      affectedIndustries: ['realestate'],
      affectedCompanyIds: ['sky'],
      category: 'industry',
    },
    {
      headline: 'Home-Office-Trend: Büroimmobilien unter Druck',
      content: 'Unternehmen reduzieren Büroflächen. Gewerbeimmobilien verlieren an Wert.',
      impact: -0.4,
      affectedIndustries: ['realestate'],
      affectedCompanyIds: ['sky'],
      category: 'industry',
    },
    {
      headline: 'Smart-City-Projekt erhält Milliarden-Förderung',
      content: 'Ein neues Smart-City-Projekt wird mit 10 Mrd. Euro gefördert.',
      impact: 0.5,
      affectedIndustries: ['realestate', 'tech'],
      affectedCompanyIds: ['sky'],
      category: 'industry',
    },
  ],
  aerospace: [
    {
      headline: 'SpaceTech: Erste kommerzielle Mondlandung geglückt',
      content: 'Private Raumfahrt erreicht neuen Meilenstein. Investoren jubeln.',
      impact: 0.7,
      affectedIndustries: ['aerospace'],
      affectedCompanyIds: ['orb'],
      category: 'industry',
    },
    {
      headline: 'Verteidigungsbudgets weltweit auf Rekordhoch',
      content: 'Geopolitische Spannungen treiben die Militärausgaben. Rüstungskonzerne profitieren.',
      impact: 0.5,
      affectedIndustries: ['aerospace'],
      affectedCompanyIds: ['aero'],
      category: 'industry',
    },
    {
      headline: 'Satellitenstart fehlgeschlagen: Millionen-Schaden',
      content: 'Ein Raketenstart ist gescheitert. Die Versicherungsbranche muss zahlen.',
      impact: -0.5,
      affectedIndustries: ['aerospace'],
      affectedCompanyIds: ['orb'],
      category: 'industry',
    },
  ],
};

const companySpecificNews: Record<string, NewsTemplate[]> = {
  nex: [
    {
      headline: 'NexGen Systems übertrifft Quartalszahlen deutlich',
      content: 'Umsatz +35%, Gewinn +42%. Die Cloud-Sparte wächst exponentiell.',
      impact: 0.6,
      affectedIndustries: ['tech'],
      affectedCompanyIds: ['nex'],
      category: 'company',
    },
    {
      headline: 'NexGen Systems: CEO tritt überraschend zurück',
      content: 'Der Rücktritt des CEOs sorgt für Unsicherheit bei Investoren.',
      impact: -0.5,
      affectedIndustries: [],
      affectedCompanyIds: ['nex'],
      category: 'company',
    },
  ],
  evolt: [
    {
      headline: 'E-Volt Motors: Neues Modell bricht Reichweiten-Rekord',
      content: 'Das neue Flaggschiff schafft 1000 km Reichweite. Vorbestellungen explodieren.',
      impact: 0.7,
      affectedIndustries: [],
      affectedCompanyIds: ['evolt'],
      category: 'company',
    },
    {
      headline: 'E-Volt Motors: Rückruf von 100.000 Fahrzeugen',
      content: 'Ein Software-Fehler zwingt zum Rückruf. Die Kosten sind erheblich.',
      impact: -0.6,
      affectedIndustries: [],
      affectedCompanyIds: ['evolt'],
      category: 'company',
    },
  ],
  orb: [
    {
      headline: 'OrbitX: Milliarden-Auftrag von der ESA',
      content: 'OrbitX erhält den größten Einzelauftrag in der Geschichte der privaten Raumfahrt.',
      impact: 0.8,
      affectedIndustries: [],
      affectedCompanyIds: ['orb'],
      category: 'company',
    },
  ],
  bio: [
    {
      headline: 'BioVital: Phase-3-Studie erfolgreich',
      content: 'Das Alzheimer-Medikament zeigt in Phase 3 hervorragende Ergebnisse.',
      impact: 0.8,
      affectedIndustries: [],
      affectedCompanyIds: ['bio'],
      category: 'company',
    },
    {
      headline: 'BioVital: Medikament fällt durch Zulassung',
      content: 'Die Behörden haben das Hauptprodukt nicht zugelassen. Herber Rückschlag.',
      impact: -0.7,
      affectedIndustries: [],
      affectedCompanyIds: ['bio'],
      category: 'company',
    },
  ],
  strm: [
    {
      headline: 'StreamVerse gewinnt 20 Mio. neue Abonnenten',
      content: 'Ein Hit-Show treibt das Wachstum. Der Aktienkurs springt.',
      impact: 0.5,
      affectedIndustries: [],
      affectedCompanyIds: ['strm'],
      category: 'company',
    },
  ],
  glb: [
    {
      headline: 'GlobalTrust Bank: Rekord-Dividende angekündigt',
      content: 'Die Bank schüttet die höchste Dividende ihrer Geschichte aus.',
      impact: 0.4,
      affectedIndustries: [],
      affectedCompanyIds: ['glb'],
      category: 'company',
    },
  ],
  lux: [
    {
      headline: 'LuxMonde übernimmt italienisches Modehaus für 5 Mrd.',
      content: 'Die Übernahme stärkt das Portfolio im High-Fashion-Segment.',
      impact: 0.35,
      affectedIndustries: [],
      affectedCompanyIds: ['lux'],
      category: 'company',
    },
  ],
};

export function generateNews(dayCount: number): NewsItem {
  const allTemplates: NewsTemplate[] = [];

  // Weight: global news less frequent, industry more, company rare but impactful
  const rand = Math.random();
  let template: NewsTemplate;

  if (rand < 0.3) {
    // Global news
    template = globalNews[Math.floor(Math.random() * globalNews.length)];
  } else if (rand < 0.75) {
    // Industry news
    const industries = Object.keys(industryNews) as Industry[];
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const templates = industryNews[industry];
    template = templates[Math.floor(Math.random() * templates.length)];
  } else {
    // Company-specific news
    const companyIds = Object.keys(companySpecificNews);
    const companyId = companyIds[Math.floor(Math.random() * companyIds.length)];
    const templates = companySpecificNews[companyId];
    template = templates[Math.floor(Math.random() * templates.length)];
  }

  // Add some randomness to impact
  const impactVariation = (Math.random() - 0.5) * 0.2;

  return {
    id: uuid(),
    headline: template.headline,
    content: template.content,
    timestamp: Date.now(),
    impact: Math.max(-1, Math.min(1, template.impact + impactVariation)),
    affectedIndustries: template.affectedIndustries,
    affectedCompanies: template.affectedCompanyIds,
    category: template.category,
    read: false,
  };
}
