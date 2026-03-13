import { Industry, NewsItem } from '../types';
import { companies } from './companies';
import { v4 as uuid } from 'uuid';

interface NewsTemplate {
  headline: string;
  content: string;
  impact: number;
  affectedIndustries: Industry[];
  category: NewsItem['category'];
}

// Helper: pick random companies from an industry
function randomCompanyIds(industry: Industry, count: number = 1): string[] {
  const pool = companies.filter((c) => c.industry === industry);
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((c) => c.id);
}

function randomCompanyFromIndustry(industry: Industry) {
  const pool = companies.filter((c) => c.industry === industry);
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickRandomCompany() {
  return companies[Math.floor(Math.random() * companies.length)];
}

const globalNews: NewsTemplate[] = [
  {
    headline: 'Zentralbank senkt Leitzins um 0,5%',
    content: 'Die Europäische Zentralbank hat überraschend den Leitzins gesenkt. Analysten erwarten positive Auswirkungen auf den gesamten Markt.',
    impact: 0.4,
    affectedIndustries: ['finance', 'realestate', 'retail'],
    category: 'global',
  },
  {
    headline: 'Globale Rezessionsängste nehmen zu',
    content: 'Neue Wirtschaftsdaten deuten auf eine Verlangsamung der globalen Konjunktur hin. Investoren werden vorsichtiger.',
    impact: -0.5,
    affectedIndustries: [],
    category: 'global',
  },
  {
    headline: 'Inflation sinkt auf 2-Jahres-Tief',
    content: 'Die Inflation ist überraschend stark gesunken. Der Markt reagiert euphorisch auf die Nachricht.',
    impact: 0.5,
    affectedIndustries: [],
    category: 'global',
  },
  {
    headline: 'Handelskrieg eskaliert: Neue Zölle angekündigt',
    content: 'Die USA und China haben neue Strafzölle angekündigt. Die Unsicherheit an den Märkten steigt.',
    impact: -0.6,
    affectedIndustries: ['tech', 'automotive', 'retail'],
    category: 'global',
  },
  {
    headline: 'G20-Gipfel: Einigung auf Klimapaket',
    content: 'Die G20-Staaten haben sich auf ein ambitioniertes Klimapaket geeinigt. Erneuerbare Energien profitieren.',
    impact: 0.6,
    affectedIndustries: ['energy'],
    category: 'global',
  },
  {
    headline: 'Ölpreis steigt auf 120$ pro Barrel',
    content: 'Geopolitische Spannungen treiben den Ölpreis. Energiekosten belasten die Industrie.',
    impact: -0.3,
    affectedIndustries: ['automotive', 'food', 'retail'],
    category: 'global',
  },
  {
    headline: 'Arbeitsmarkt überraschend stark',
    content: 'Die Arbeitslosenquote ist auf ein Rekordtief gesunken. Konsumausgaben dürften steigen.',
    impact: 0.35,
    affectedIndustries: ['retail', 'entertainment', 'food'],
    category: 'global',
  },
  {
    headline: 'Kryptowährungen brechen ein - Flucht in Aktien',
    content: 'Nach dem Krypto-Crash suchen Anleger Sicherheit in traditionellen Aktien. Bankensektor profitiert.',
    impact: 0.25,
    affectedIndustries: ['finance'],
    category: 'global',
  },
  {
    headline: 'EU beschließt Konjunkturpaket über 500 Mrd. Euro',
    content: 'Das Hilfspaket soll die Wirtschaft ankurbeln. Alle Sektoren könnten profitieren.',
    impact: 0.45,
    affectedIndustries: [],
    category: 'global',
  },
  {
    headline: 'Zentralbank erhöht Leitzins überraschend',
    content: 'Die unerwartete Zinserhöhung belastet die Märkte. Wachstumsaktien unter Druck.',
    impact: -0.45,
    affectedIndustries: ['tech', 'realestate'],
    category: 'global',
  },
  {
    headline: 'Rohstoffpreise auf Allzeithoch',
    content: 'Lieferengpässe und steigende Nachfrage treiben die Rohstoffpreise. Produzierende Industrien betroffen.',
    impact: -0.3,
    affectedIndustries: ['automotive', 'food', 'aerospace'],
    category: 'global',
  },
  {
    headline: 'Verbrauchervertrauen auf Jahreshoch',
    content: 'Das Verbrauchervertrauen ist so hoch wie seit Jahren nicht. Konsumaktien profitieren.',
    impact: 0.35,
    affectedIndustries: ['retail', 'food', 'entertainment'],
    category: 'global',
  },
];

const industryNewsTemplates: Record<Industry, NewsTemplate[]> = {
  tech: [
    {
      headline: 'KI-Revolution: Neue Durchbrüche bei Large Language Models',
      content: 'Forscher haben einen neuen Ansatz für KI-Modelle entwickelt, der die Effizienz verdreifacht.',
      impact: 0.5,
      affectedIndustries: ['tech'],
      category: 'industry',
    },
    {
      headline: 'Massive Datenpanne bei Cloud-Anbietern',
      content: 'Millionen Kundendaten wurden kompromittiert. Cybersicherheitsaktien steigen.',
      impact: 0.4,
      affectedIndustries: ['tech'],
      category: 'industry',
    },
    {
      headline: 'EU verschärft Tech-Regulierung',
      content: 'Neue Vorschriften könnten die Geschäftsmodelle großer Tech-Konzerne einschränken.',
      impact: -0.4,
      affectedIndustries: ['tech'],
      category: 'industry',
    },
    {
      headline: 'Quantencomputer knackt erstmals RSA-Verschlüsselung',
      content: 'Ein Durchbruch im Quantencomputing erschüttert die IT-Sicherheitsbranche.',
      impact: 0.7,
      affectedIndustries: ['tech'],
      category: 'industry',
    },
    {
      headline: 'Halbleitermangel entspannt sich deutlich',
      content: 'Neue Chipfabriken gehen ans Netz. Die Tech-Branche atmet auf.',
      impact: 0.35,
      affectedIndustries: ['tech'],
      category: 'industry',
    },
    {
      headline: 'Cloud-Ausgaben der Unternehmen wachsen zweistellig',
      content: 'Unternehmen investieren massiv in Cloud-Infrastruktur. SaaS-Anbieter profitieren.',
      impact: 0.4,
      affectedIndustries: ['tech'],
      category: 'industry',
    },
  ],
  energy: [
    {
      headline: 'Solarzellen-Effizienz erreicht neuen Rekord',
      content: 'Neue Perowskit-Solarzellen erreichen 35% Effizienz. Solarbranche im Aufschwung.',
      impact: 0.6,
      affectedIndustries: ['energy'],
      category: 'industry',
    },
    {
      headline: 'Fusionsreaktor erzielt erstmals Netto-Energiegewinn',
      content: 'Ein historischer Moment für die Energiebranche. Fusionsenergie wird Realität.',
      impact: 0.8,
      affectedIndustries: ['energy'],
      category: 'industry',
    },
    {
      headline: 'Subventionen für erneuerbare Energien gekürzt',
      content: 'Die Regierung hat überraschend Kürzungen bei Energiesubventionen angekündigt.',
      impact: -0.5,
      affectedIndustries: ['energy'],
      category: 'industry',
    },
    {
      headline: 'Windkraft: Rekord bei neu installierten Anlagen',
      content: 'So viele neue Windräder wie nie zuvor. Die Energiewende schreitet voran.',
      impact: 0.4,
      affectedIndustries: ['energy'],
      category: 'industry',
    },
    {
      headline: 'Netzausbau stockt: Engpässe bei Stromtrassen',
      content: 'Genehmigungsverfahren verzögern den Netzausbau. Energieversorger unter Druck.',
      impact: -0.35,
      affectedIndustries: ['energy'],
      category: 'industry',
    },
  ],
  finance: [
    {
      headline: 'FinTech-Boom: Digitale Banken verdoppeln Kundenzahl',
      content: 'Der Trend zum digitalen Banking beschleunigt sich. Traditionelle Banken unter Druck.',
      impact: 0.3,
      affectedIndustries: ['finance'],
      category: 'industry',
    },
    {
      headline: 'Neue Bankenregulierung verschärft Eigenkapitalanforderungen',
      content: 'Basel IV-Regeln treten in Kraft. Banken müssen mehr Kapital vorhalten.',
      impact: -0.35,
      affectedIndustries: ['finance'],
      category: 'industry',
    },
    {
      headline: 'Blockchain revolutioniert Zahlungsverkehr',
      content: 'Neue DeFi-Protokolle ermöglichen Echtzeit-Überweisungen zu minimalen Kosten.',
      impact: 0.4,
      affectedIndustries: ['finance'],
      category: 'industry',
    },
    {
      headline: 'Versicherungsbranche profitiert von KI-Analytik',
      content: 'Machine Learning verbessert Risikomodelle. Die Margen steigen.',
      impact: 0.3,
      affectedIndustries: ['finance'],
      category: 'industry',
    },
  ],
  health: [
    {
      headline: 'Durchbruch in der Krebsforschung: mRNA-Therapie zeigt Erfolg',
      content: 'Klinische Studien zeigen vielversprechende Ergebnisse. Die Pharmabranche feiert.',
      impact: 0.7,
      affectedIndustries: ['health'],
      category: 'industry',
    },
    {
      headline: 'FDA verschärft Zulassungsverfahren',
      content: 'Neue Regulierungen könnten Medikamentenzulassungen verzögern.',
      impact: -0.4,
      affectedIndustries: ['health'],
      category: 'industry',
    },
    {
      headline: 'Roboterchirurgie: Neuer Meilenstein erreicht',
      content: 'KI-gesteuerte Operationsroboter erzielen bessere Ergebnisse als menschliche Chirurgen.',
      impact: 0.5,
      affectedIndustries: ['health'],
      category: 'industry',
    },
    {
      headline: 'Telemedizin-Nutzung verdreifacht sich',
      content: 'Patienten bevorzugen digitale Arztbesuche. Healthtech-Unternehmen wachsen stark.',
      impact: 0.4,
      affectedIndustries: ['health'],
      category: 'industry',
    },
    {
      headline: 'Patentstreit lähmt Pharma-Sektor',
      content: 'Großer Rechtsstreit um Blockbuster-Medikament. Unsicherheit im Gesundheitssektor.',
      impact: -0.35,
      affectedIndustries: ['health'],
      category: 'industry',
    },
  ],
  retail: [
    {
      headline: 'Online-Shopping-Rekord am Black Friday',
      content: 'E-Commerce-Umsätze übertreffen alle Erwartungen. Einzelhandelsaktien steigen.',
      impact: 0.5,
      affectedIndustries: ['retail'],
      category: 'industry',
    },
    {
      headline: 'Luxusmarkt wächst zweistellig in Asien',
      content: 'Die asiatische Mittelschicht kauft verstärkt Luxusgüter.',
      impact: 0.4,
      affectedIndustries: ['retail'],
      category: 'industry',
    },
    {
      headline: 'Lieferkettenprobleme belasten Einzelhandel',
      content: 'Hafenstreiks und Containerknappheit führen zu Engpässen.',
      impact: -0.4,
      affectedIndustries: ['retail'],
      category: 'industry',
    },
    {
      headline: 'Quick-Commerce wächst rasant',
      content: 'Blitzlieferungen in unter 15 Minuten verändern den Handel.',
      impact: 0.3,
      affectedIndustries: ['retail'],
      category: 'industry',
    },
  ],
  automotive: [
    {
      headline: 'EU beschließt Verbrenner-Aus ab 2035',
      content: 'Elektrofahrzeuge werden zum neuen Standard. Traditionelle Hersteller unter Druck.',
      impact: 0.3,
      affectedIndustries: ['automotive'],
      category: 'industry',
    },
    {
      headline: 'Autonomes Fahren: Level 5 erstmals zugelassen',
      content: 'Vollautonome Fahrzeuge dürfen erstmals ohne Fahrer auf die Straße.',
      impact: 0.6,
      affectedIndustries: ['automotive', 'tech'],
      category: 'industry',
    },
    {
      headline: 'Lithium-Knappheit treibt Batteriepreise',
      content: 'Engpässe bei Rohstoffen verteuern die Produktion von E-Autos.',
      impact: -0.45,
      affectedIndustries: ['automotive'],
      category: 'industry',
    },
    {
      headline: 'Wasserstoff-LKW bestehen Praxistest',
      content: 'Erste Wasserstoff-Trucks absolvieren erfolgreich 1 Mio. Kilometer.',
      impact: 0.4,
      affectedIndustries: ['automotive', 'energy'],
      category: 'industry',
    },
    {
      headline: 'Neuzulassungen von E-Autos verdoppelt',
      content: 'Der E-Mobilitäts-Markt wächst weiter stark. Ladenetzbetreiber profitieren.',
      impact: 0.35,
      affectedIndustries: ['automotive', 'energy'],
      category: 'industry',
    },
  ],
  food: [
    {
      headline: 'Bio-Boom: Umsatz steigt um 25%',
      content: 'Verbraucher setzen verstärkt auf Bio-Lebensmittel. Nachhaltige Produzenten profitieren.',
      impact: 0.4,
      affectedIndustries: ['food'],
      category: 'industry',
    },
    {
      headline: 'Dürre in Europa bedroht Ernte',
      content: 'Extreme Hitze vernichtet Ernten. Lebensmittelpreise steigen.',
      impact: -0.3,
      affectedIndustries: ['food'],
      category: 'industry',
    },
    {
      headline: 'Craft-Beer-Trend boomt weltweit',
      content: 'Kleine Brauereien wachsen schneller als die großen Konzerne.',
      impact: 0.35,
      affectedIndustries: ['food'],
      category: 'industry',
    },
    {
      headline: 'Lab-Grown-Meat erhält EU-Zulassung',
      content: 'Kultiviertes Fleisch darf erstmals in Europa verkauft werden. Lebensmittelbranche im Umbruch.',
      impact: 0.45,
      affectedIndustries: ['food'],
      category: 'industry',
    },
  ],
  entertainment: [
    {
      headline: 'VR-Gaming erobert den Massenmarkt',
      content: 'Neue erschwingliche VR-Headsets treiben den Gaming-Markt.',
      impact: 0.5,
      affectedIndustries: ['entertainment'],
      category: 'industry',
    },
    {
      headline: 'Streaming-Wars: Abonnentenzahlen stagnieren',
      content: 'Der Streaming-Markt zeigt Sättigungserscheinungen. Anbieter kämpfen um Kunden.',
      impact: -0.35,
      affectedIndustries: ['entertainment'],
      category: 'industry',
    },
    {
      headline: 'Blockbuster-Game bricht Verkaufsrekorde',
      content: 'Das meistverkaufte Spiel aller Zeiten erzielt 3 Mrd. Euro Umsatz am ersten Tag.',
      impact: 0.6,
      affectedIndustries: ['entertainment'],
      category: 'industry',
    },
    {
      headline: 'E-Sport wird olympische Disziplin',
      content: 'Das IOC nimmt E-Sport offiziell auf. Gaming-Unternehmen profitieren.',
      impact: 0.45,
      affectedIndustries: ['entertainment'],
      category: 'industry',
    },
  ],
  realestate: [
    {
      headline: 'Immobilienblase? Preise steigen weiter',
      content: 'Trotz Warnungen steigen die Immobilienpreise in Großstädten weiter an.',
      impact: 0.3,
      affectedIndustries: ['realestate'],
      category: 'industry',
    },
    {
      headline: 'Home-Office-Trend: Büroimmobilien unter Druck',
      content: 'Unternehmen reduzieren Büroflächen. Gewerbeimmobilien verlieren an Wert.',
      impact: -0.4,
      affectedIndustries: ['realestate'],
      category: 'industry',
    },
    {
      headline: 'Smart-City-Projekt erhält Milliarden-Förderung',
      content: 'Ein neues Smart-City-Projekt wird mit 10 Mrd. Euro gefördert.',
      impact: 0.5,
      affectedIndustries: ['realestate', 'tech'],
      category: 'industry',
    },
    {
      headline: 'Sozialwohnungsbau: Neues Förderprogramm',
      content: 'Milliarden für sozialen Wohnungsbau. Baukonzerne und Immobilienentwickler profitieren.',
      impact: 0.35,
      affectedIndustries: ['realestate'],
      category: 'industry',
    },
  ],
  aerospace: [
    {
      headline: 'SpaceTech: Erste kommerzielle Mondlandung geglückt',
      content: 'Private Raumfahrt erreicht neuen Meilenstein. Investoren jubeln.',
      impact: 0.7,
      affectedIndustries: ['aerospace'],
      category: 'industry',
    },
    {
      headline: 'Verteidigungsbudgets weltweit auf Rekordhoch',
      content: 'Geopolitische Spannungen treiben die Militärausgaben. Rüstungskonzerne profitieren.',
      impact: 0.5,
      affectedIndustries: ['aerospace'],
      category: 'industry',
    },
    {
      headline: 'Satellitenstart fehlgeschlagen: Millionen-Schaden',
      content: 'Ein Raketenstart ist gescheitert. Die Versicherungsbranche muss zahlen.',
      impact: -0.5,
      affectedIndustries: ['aerospace'],
      category: 'industry',
    },
    {
      headline: 'Flugtaxis erhalten Betriebsgenehmigung',
      content: 'Urban Air Mobility startet kommerziell. Luft- und Raumfahrtbranche im Aufwind.',
      impact: 0.55,
      affectedIndustries: ['aerospace'],
      category: 'industry',
    },
  ],
};

// Dynamic company-specific news generators
interface CompanyNewsGenerator {
  positive: (name: string) => NewsTemplate;
  negative: (name: string) => NewsTemplate;
}

const companyNewsGenerators: CompanyNewsGenerator[] = [
  {
    positive: (name) => ({
      headline: `${name} übertrifft Quartalszahlen deutlich`,
      content: `Umsatz und Gewinn liegen über den Erwartungen. Analysten heben ihre Kursziele an.`,
      impact: 0.6,
      affectedIndustries: [],
      category: 'company',
    }),
    negative: (name) => ({
      headline: `${name}: CEO tritt überraschend zurück`,
      content: `Der Rücktritt des CEOs sorgt für Unsicherheit bei Investoren.`,
      impact: -0.5,
      affectedIndustries: [],
      category: 'company',
    }),
  },
  {
    positive: (name) => ({
      headline: `${name} schließt Milliarden-Deal ab`,
      content: `Ein neuer Großauftrag könnte das Wachstum der nächsten Jahre sichern.`,
      impact: 0.55,
      affectedIndustries: [],
      category: 'company',
    }),
    negative: (name) => ({
      headline: `${name}: Gewinnwarnung erschüttert Investoren`,
      content: `Das Unternehmen senkt die Prognose für das laufende Geschäftsjahr deutlich.`,
      impact: -0.6,
      affectedIndustries: [],
      category: 'company',
    }),
  },
  {
    positive: (name) => ({
      headline: `${name} expandiert in neue Märkte`,
      content: `Der Eintritt in den asiatischen Markt eröffnet enormes Wachstumspotenzial.`,
      impact: 0.4,
      affectedIndustries: [],
      category: 'company',
    }),
    negative: (name) => ({
      headline: `${name}: Produktrückruf sorgt für Kurseinbruch`,
      content: `Qualitätsprobleme zwingen das Unternehmen zu einem kostspieligen Rückruf.`,
      impact: -0.55,
      affectedIndustries: [],
      category: 'company',
    }),
  },
  {
    positive: (name) => ({
      headline: `${name}: Aktienrückkaufprogramm angekündigt`,
      content: `Das Unternehmen will eigene Aktien im Wert von 2 Mrd. Euro zurückkaufen.`,
      impact: 0.35,
      affectedIndustries: [],
      category: 'company',
    }),
    negative: (name) => ({
      headline: `${name} verliert wichtigen Rechtsstreit`,
      content: `Ein Gerichtsurteil könnte das Unternehmen Hunderte Millionen kosten.`,
      impact: -0.5,
      affectedIndustries: [],
      category: 'company',
    }),
  },
  {
    positive: (name) => ({
      headline: `Analysten stufen ${name} hoch`,
      content: `Mehrere Investmentbanken heben ihre Empfehlung auf "Kaufen". Das Kursziel steigt.`,
      impact: 0.4,
      affectedIndustries: [],
      category: 'company',
    }),
    negative: (name) => ({
      headline: `${name}: Insider verkaufen massiv Aktien`,
      content: `Mehrere Vorstandsmitglieder haben große Aktienpakete verkauft. Anleger sind beunruhigt.`,
      impact: -0.4,
      affectedIndustries: [],
      category: 'company',
    }),
  },
  {
    positive: (name) => ({
      headline: `${name}: Strategische Partnerschaft geschlossen`,
      content: `Die neue Partnerschaft stärkt die Marktposition erheblich.`,
      impact: 0.45,
      affectedIndustries: [],
      category: 'company',
    }),
    negative: (name) => ({
      headline: `${name}: Datenskandal aufgedeckt`,
      content: `Ermittlungen wegen Datenschutzverstößen belasten die Aktie.`,
      impact: -0.45,
      affectedIndustries: [],
      category: 'company',
    }),
  },
  {
    positive: (name) => ({
      headline: `${name} erhöht Dividende um 30%`,
      content: `Aktionäre dürfen sich über eine deutlich höhere Ausschüttung freuen.`,
      impact: 0.3,
      affectedIndustries: [],
      category: 'company',
    }),
    negative: (name) => ({
      headline: `${name}: Großkunde kündigt Vertrag`,
      content: `Der Verlust eines wichtigen Kunden belastet die Umsatzprognose.`,
      impact: -0.4,
      affectedIndustries: [],
      category: 'company',
    }),
  },
  {
    positive: (name) => ({
      headline: `${name} meldet Patent-Durchbruch`,
      content: `Ein neues Patent sichert dem Unternehmen einen bedeutenden Wettbewerbsvorteil.`,
      impact: 0.5,
      affectedIndustries: [],
      category: 'company',
    }),
    negative: (name) => ({
      headline: `${name}: Streik lähmt Produktion`,
      content: `Arbeitnehmer legen die Arbeit nieder. Die Produktion steht vorübergehend still.`,
      impact: -0.35,
      affectedIndustries: [],
      category: 'company',
    }),
  },
];

export function generateNews(dayCount: number): NewsItem {
  const rand = Math.random();

  if (rand < 0.3) {
    // Global news
    const template = globalNews[Math.floor(Math.random() * globalNews.length)];
    const companyIds: string[] = [];
    // Assign random affected companies from affected industries
    for (const ind of template.affectedIndustries) {
      companyIds.push(...randomCompanyIds(ind, 1 + Math.floor(Math.random() * 2)));
    }
    return {
      id: uuid(),
      headline: template.headline,
      content: template.content,
      timestamp: Date.now(),
      dayNumber: dayCount,
      impact: Math.max(-1, Math.min(1, template.impact + (Math.random() - 0.5) * 0.2)),
      affectedIndustries: template.affectedIndustries,
      affectedCompanies: companyIds,
      category: template.category,
      read: false,
    };
  } else if (rand < 0.7) {
    // Industry news
    const industries = Object.keys(industryNewsTemplates) as Industry[];
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const templates = industryNewsTemplates[industry];
    const template = templates[Math.floor(Math.random() * templates.length)];
    // Pick 1-3 random companies from affected industries
    const companyIds: string[] = [];
    for (const ind of template.affectedIndustries) {
      companyIds.push(...randomCompanyIds(ind, 1 + Math.floor(Math.random() * 3)));
    }
    return {
      id: uuid(),
      headline: template.headline,
      content: template.content,
      timestamp: Date.now(),
      dayNumber: dayCount,
      impact: Math.max(-1, Math.min(1, template.impact + (Math.random() - 0.5) * 0.2)),
      affectedIndustries: template.affectedIndustries,
      affectedCompanies: companyIds,
      category: template.category,
      read: false,
    };
  } else {
    // Company-specific news
    const company = pickRandomCompany();
    const generator = companyNewsGenerators[Math.floor(Math.random() * companyNewsGenerators.length)];
    const isPositive = Math.random() > 0.45;
    const template = isPositive ? generator.positive(company.name) : generator.negative(company.name);
    return {
      id: uuid(),
      headline: template.headline,
      content: template.content,
      timestamp: Date.now(),
      dayNumber: dayCount,
      impact: Math.max(-1, Math.min(1, template.impact + (Math.random() - 0.5) * 0.2)),
      affectedIndustries: [company.industry, ...template.affectedIndustries],
      affectedCompanies: [company.id],
      category: template.category,
      read: false,
    };
  }
}
