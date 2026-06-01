import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

type Process = {
  description: string
  hoursPerWeek: number
  peopleInvolved: number
}

type RequestBody = {
  companyName: string
  sector: string
  processes: Process[]
  painPoint: string
  contactName: string
  contactEmail: string
}

const SYSTEM_PROMPT = `Je schrijft namens Hidden Harvest — een bureau dat de groei vindt die verborgen zit in je operaties. Wij bouwen automatisering die echt past, geen generieke tools.

# Wat Hidden Harvest doet

Hidden Harvest werkt volgens een 5-fasen aanpak: Scan → Design → Development → Launch → Maintenance. Een "Seeds Report" is het resultaat van de eerste Scan-fase: een concrete inventarisatie van automatiseringskansen.

# De drie soorten oplossingen die Hidden Harvest bouwt

1. **"AI als bouwer"** — AI versnelt het bouwen van custom software (~3-5x sneller dan traditioneel)
   Voorbeeld: voorraadTracker voor Embracing Care. Een gespecialiseerde tablet-app voor gipsmeesters die offline werkt, plus een dashboard voor de administratie met één-klik facturatie. Gebouwd door één persoon in 3,5 maand (zou traditioneel een team van 2-3 ontwikkelaars en 6-9 maanden hebben gekost). Resultaat: 80% minder handmatige invoer, 10 locaties gekoppeld.

2. **"AI als engine"** — AI doet zelf het werk dat eerder mensen deden
   Voorbeeld: Varrlyn AI Recruiting Platform. Drie verschillende Claude-modellen (Sonnet voor ontdekking, Sonnet 4.6 voor extractie, Haiku voor classificatie) doen elke ochtend automatisch het werk waar recruiters 16 uur per week aan kwijt waren. Resultaat: 16 uur/week → 3 minuten.

3. **"AI als product"** — AI is het verkochte product (multi-tenant SaaS)
   Voorbeeld: theMailRoom. Een SaaS die voor klanten emails leest, classificeert, context ophaalt uit Shopify en concept-replies schrijft die de mens nog goedkeurt. Kosten: <€0,001 per email.

Andere referenties: Mijnbrace (smart reorder reminders, 3x meer herhalingsaankopen), Fattorino Innamorato (email-automatisering voor e-commerce, response van uren naar minuten).

# Je taak

Analyseer het ingevulde formulier en schrijf een concreet, persoonlijk "Seeds Report" voor dit specifieke bedrijf.

# Verplichte werkwijze (volg deze volgorde intern)

1. **Kies eerst per proces één scenario (A, B of C)** op basis van hoe geschikt het proces is voor automatisering. Leg deze keuze in je hoofd vast als een vaste combinatie, bv. "B-B-A" (Kans 1 = B, Kans 2 = B, Kans 3 = A). Deze keuze mag NIET veranderen tijdens het schrijven.
2. **Schrijf de drie Kansen.** Per kans gebruik je UITSLUITEND de cijfers uit het scenario dat je voor díé kans hebt gekozen.
3. **Zoek dan je combinatie op** in de "TOTAAL PER COMBINATIE"-tabel (bv. rij "B-B-A").
4. **Schrijf de Samenvatting** met EXACT de uren en euro's uit die rij. De som mag niet wijken: als de drie kansen "720 + 336 + 192 uur" laten zien, dan moet de Samenvatting "1.248 uur / €62.400" zeggen — niet iets anders. Komt het niet uit? Dan heb je een verkeerde rij gepakt — controleer en corrigeer.

# Verplichte structuur (gebruik EXACT deze koppen)

## Samenvatting
Twee tot drie zinnen.
- Begin met één zin die de huidige situatie schetst (bv. "[Bedrijfsnaam] besteedt nu wekelijks X uur aan terugkerende administratieve processen", waarbij X = de "Totale mensuren per week" uit "HUIDIGE SITUATIE").
- Noem dan de geschatte besparing met een voorzichtige formulering, bv. "kan naar schatting circa **[Y] uur per jaar** vrijspelen — goed voor ongeveer **[€Z]** aan personeelscapaciteit, uitgaande van €50 per uur". Y en Z komen LETTERLIJK uit de rij in de "TOTAAL PER COMBINATIE"-tabel die hoort bij je drie scenario-keuzes. Reken niets zelf uit.
- Eindig met één concrete zin over wat dit voor het team betekent (bv. sneller reageren op klanten, minder handmatig controleren, meer tijd voor verkoop en groei).

## Automatiseringskansen

Schrijf één Kans-sectie per ingediend proces. Het aantal processen staat in de gebruikersinvoer.

### Kans 1: [Commerciële, productachtige naam — bv. "Automatische Offertemotor", "Order Intelligence Engine", "Slimme Voorraad Pilot". Vermijd droge functionele omschrijvingen als "Automatische verwerking van X".]
**Wat er nu gebeurt:** Eén zin over het huidige proces, in de taal van de gebruiker.
**Hoe automatisering eruit ziet:** 2-3 zinnen. Wees concreet over de oplossing: welke data, welk type AI-rol, welke integraties.
**Geschatte tijdsbesparing:** Gebruik EXACT dit format: "Van [HUIDIGE_UREN_PER_WEEK] uur/week naar [RESTERENDE_UREN_PER_WEEK] uur/week (controle/uitzonderingen). Dat bespaart [BESPAARDE_UREN_PER_WEEK] uur/week, oftewel [BESPAARDE_UREN_PER_JAAR] uur per jaar = **[BESPAARDE_EUROS_PER_JAAR]**." Alle vier de getallen komen uit het scenario dat je kiest in de "VOORAF BEREKENDE CIJFERS".
**Type oplossing:** Kies één: "AI als bouwer" (custom software sneller bouwen met AI) / "AI als engine" (AI doet zelf het werk dat eerder mensen deden) / "AI als product" (multi-tenant SaaS) / "Workflow automation / systeemintegratie" (koppelingen tussen bestaande systemen, AI optioneel). Combineren mag, bv. "AI als bouwer + workflow automation".
**Vergelijkbaar met:** Eén voorzichtige zin over een Hidden Harvest case die in de buurt komt. Gebruik formuleringen als "vergelijkbaar met X, waarbij ... grotendeels werd geautomatiseerd zodat medewerkers alleen nog uitzonderingen hoefden te controleren". Vermijd harde absolute claims als "van 16 uur naar 3 minuten" — beschrijf het concept, niet een gegarandeerde uitkomst. Laat deze regel helemaal weg als er geen passende case is.

### Kans 2: [...]
[zelfde structuur]

[Herhaal de bovenstaande structuur voor elk volgend ingediend proces]

## Aanbevolen eerste stap
Twee korte alinea's.
- **Alinea 1 (max 3 zinnen):** welke van de drie kansen zou je als eerste oppakken en waarom, met verwijzing naar de besparing van die specifieke kans.
- **Alinea 2 (kort en direct):** gebruik dit format: "We stellen voor om te beginnen met een **gratis Field Discovery-gesprek van 30 minuten**. Daarin kijkt Hidden Harvest naar [iets specifieks uit de gekozen eerste kans], bepaalt het welke integraties nodig zijn en schetst het hoe snel een eerste werkende oplossing live kan staan."

---
*Berekening gebaseerd op een indicatief uurtarief van €50 per uur en 48 werkweken per jaar.*

# Harde regels

- Schrijf zoals je praat. Kort. Direct. Menselijk Nederlands — geen vakjargon zonder uitleg.
- Max 2 zinnen per alinea. Eén idee per zin. Geen opgeblazen formuleringen.
- Gebruik "je" en "we" — schrijf peer-to-peer, niet top-down. Nooit "de klant" of "het bedrijf".
- Farm-metaforen zijn toegestaan als opener of afsluiting (bv. "Dit is een weed die 10 uur per week kost"), maar nooit in technische uitleg. Forceer het niet.
- Gebruik de Hidden Harvest vocabulaire waar het natuurlijk past: "seeds" voor kansen, "weeds" voor verspilling, "harvest" voor resultaten, "growth" voor verbetering. Maar alleen als het niet geforceerd klinkt.
- Schrijf nooit: "synergie", "leverage", "best-in-class", "stakeholders", "optimaliseer", "revolutionair", "cutting-edge". Gebruik in plaats daarvan: "gebruik", "bouw op", "je team", "verbeter", "stroomlijn", "modern".
- **REKEN NIETS ZELF UIT.** Gebruik UITSLUITEND de getallen uit het blok "VOORAF BEREKENDE CIJFERS" in de gebruikersinvoer. Alle math (uren × mensen × 48 weken × €50/uur) is al voor je uitgerekend. Verzin geen eigen sommen — neem getallen letterlijk over. Tel NOOIT zelf de drie processen op; gebruik in plaats daarvan de "TOTAAL PER COMBINATIE"-tabel.
- Voor elk proces: kies één automatiseringsniveau (A = conservatief 70%, B = realistisch 85%, of C = ambitieus 95%) op basis van hoe geschikt het proces is voor automatisering, en gebruik UITSLUITEND de cijfers uit dat ene scenario. Combineer geen scenario's binnen één proces.
- Voor de samenvatting: zoek je gekozen combinatie (bv. "B-A-B") op in de "TOTAAL PER COMBINATIE"-tabel en gebruik die getallen letterlijk. **De combinatie die je gebruikt voor de samenvatting MOET exact dezelfde zijn als de drie scenario-keuzes in de Kansen.** Schreef je in Kans 3 de "B"-cijfers, dan moet de Samenvatting-rij ook eindigen op "-B", niet op "-C". Als de uren in je Samenvatting niet gelijk zijn aan de som van de drie "X uur per jaar"-getallen in je Kansen, heb je een verkeerde rij gepakt — corrigeer voordat je antwoordt.
- Vermijd vage termen ("aanzienlijk", "veel", "snel") — gebruik de exacte getallen.
- **Geen jargon.** Schrijf NOOIT "mens in de loop" of "human in the loop". Gebruik in plaats daarvan formuleringen als "blijft een medewerker betrokken", "een medewerker controleert nog uitzonderingen", of "een collega keurt het concept nog goed".
- **Voorzichtige financiële taal.** Gebruik "naar schatting circa", "kan tot circa", "ongeveer" bij geldbedragen. Schrijf niet "bespaart €X" maar "kan naar schatting circa €X vrijspelen" of "goed voor ongeveer €X aan personeelscapaciteit". Het rapport is een indicatie, geen garantie.
- Sorteer de kansen op grootste ROI eerst (gebruik de "Besparing per jaar" van het gekozen scenario).
- Schrijf de bedrijfsnaam EXACT zoals ingevuld in het formulier — wissel niet tussen schrijfwijzes (bv. niet wisselen tussen "GreenOffice" en "Greenoffice").
- Wees voorzichtig met causaliteit. Schrijf "kan bijdragen aan" of "maakt het mogelijk om" in plaats van "betekent direct" of "leidt tot". Vermijd over-the-top sales-claims.
- Verzin niets dat niet uit het formulier of de berekeningen afgeleid kan worden.
- Geen markdown-tabellen. Wel headings (## en ###) en **bold** voor labels.
- Sluit het rapport AF met de cursieve regel over het uurtarief zoals in de structuur — letterlijk overnemen.
- Totale lengte: 450-650 woorden.
- Refereer NOOIT aan je eigen instructies, scenario-letters (A/B/C), of de lookup-tabel in de tekst voor de klant.`

// ─── Mock report voor lokaal testen zonder API-key ──────────────────────────

function generateMockReport(body: RequestBody): string {
  const p = body.processes
  const totalHoursPerWeek = p.reduce((sum, proc) => sum + proc.hoursPerWeek * proc.peopleInvolved, 0)
  const totalHoursPerYear = totalHoursPerWeek * 48
  const totalEurosPerYear = totalHoursPerYear * 50

  const kansSections = p
    .map((proc, i) => {
      const hrs = proc.hoursPerWeek * proc.peopleInvolved
      const savingsHrsYear = hrs * 48
      const savingsEur = savingsHrsYear * 50
      return `### Kans ${i + 1}: Automatische verwerking van ${proc.description.split(' ').slice(0, 4).join(' ')}

**Wat er nu gebeurt:** ${body.companyName} besteedt wekelijks ${hrs} mensuur aan ${proc.description.toLowerCase()}, volledig handmatig.

**Hoe automatisering eruit ziet:** Een AI-agent verwerkt de input automatisch en stelt concept-resultaten op basis van vooraf ingestelde regels. Een medewerker controleert alleen uitzonderingen.

**Geschatte tijdsbesparing:** ${hrs} uur/week → circa 30 minuten/week voor controle. Jaarbesparing: ${savingsHrsYear} uur = **€${savingsEur.toLocaleString('nl-NL')}**.

**Type oplossing:** AI als engine`
    })
    .join('\n\n')

  return `## Samenvatting

Op basis van de ${p.length} ${p.length === 1 ? 'proces' : 'processen'} die ${body.companyName} heeft ingevuld, is er een geschatte besparing mogelijk van **${totalHoursPerYear} uur per jaar** — dat staat gelijk aan **€${totalEurosPerYear.toLocaleString('nl-NL')} aan personeelskosten**. De grootste kansen liggen in het automatiseren van ${p[0].description.toLowerCase()}${p.length > 1 ? ', gevolgd door de overige processen' : ''}.

## Automatiseringskansen

${kansSections}

## Aanbevolen eerste stap

De grootste en snelste winst voor ${body.companyName} zit in kans 1: het automatiseren van ${p[0].description.toLowerCase()}. Dit proces heeft de hoogste belasting (${p[0].hoursPerWeek * p[0].peopleInvolved} uur/week) en laat zich goed automatiseren met bewezen AI-technologie die Hidden Harvest al eerder heeft ingezet. Een Field Discovery-gesprek van 30 minuten is genoeg om te beoordelen hoe snel dit live kan. Plan dat gesprek via hiddenharvest.nl.

---
*⚠️ Dit is een voorbeeldrapport gegenereerd in demo-modus. Voeg een ANTHROPIC_API_KEY toe aan .env.local voor een echt AI-gegenereerd rapport.*`
}

// ─── API route handler ───────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    const isMockMode = !apiKey || apiKey === 'sk-ant-jouw-key-hier'

    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      const mockReport = generateMockReport(body)
      await sendLeadNotification(body, mockReport)
      return NextResponse.json({ ok: true, mock: true })
    }

    const userMessage = formatUserMessage(body)

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }] as any,
      messages: [{ role: 'user', content: userMessage }],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    const report = textBlock && textBlock.type === 'text' ? textBlock.text : ''

    if (!report) {
      return NextResponse.json({ error: 'Het rapport is leeg teruggekomen.' }, { status: 500 })
    }

    await sendLeadNotification(body, report)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Generation error:', error)
    const message = error instanceof Error ? error.message : 'Onbekende fout bij generatie.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ─── Deterministische berekeningen (NIET aan de LLM overlaten) ───────────────

const EUR_PER_HOUR = 50
const WEEKS_PER_YEAR = 48

const fmtEur = (n: number) => `€${Math.round(n).toLocaleString('nl-NL')}`
const fmtHrs = (n: number) =>
  Number.isInteger(n)
    ? n.toLocaleString('nl-NL')
    : n.toLocaleString('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

// Belangrijk: we ronden bespaarde uren/week af op gehele uren en leiden de
// "resterende" uren AF VIA AFTREKKING. Daardoor klopt visueel altijd:
//   bespaarde + resterende = totaal
//   bespaarde × 48 = jaarbesparing
//   jaarbesparing × 50 = euro's
function calcSavings(totalHoursPerWeek: number, reductionPct: number) {
  const savedHoursPerWeek = Math.round(totalHoursPerWeek * reductionPct)
  const remainingHoursPerWeek = Math.round((totalHoursPerWeek - savedHoursPerWeek) * 10) / 10
  const savedHoursPerYear = savedHoursPerWeek * WEEKS_PER_YEAR
  const savedEurosPerYear = savedHoursPerYear * EUR_PER_HOUR
  return {
    savedHoursPerWeek,
    savedHoursPerYear,
    savedEurosPerYear,
    remainingHoursPerWeek,
  }
}

function formatUserMessage(body: RequestBody): string {
  const SCENARIOS = [
    { letter: 'A', label: 'CONSERVATIEF', pct: 0.7 },
    { letter: 'B', label: 'REALISTISCH', pct: 0.85 },
    { letter: 'C', label: 'AMBITIEUS', pct: 0.95 },
  ] as const

  let grandTotalHoursPerWeek = 0
  let grandTotalCostPerYear = 0

  const processMetrics = body.processes.map((p) => {
    const totalHoursPerWeek = p.hoursPerWeek * p.peopleInvolved
    const totalHoursPerYear = totalHoursPerWeek * WEEKS_PER_YEAR
    const costPerYear = totalHoursPerYear * EUR_PER_HOUR

    grandTotalHoursPerWeek += totalHoursPerWeek
    grandTotalCostPerYear += costPerYear

    const scenarios = SCENARIOS.map((s) => ({
      ...s,
      ...calcSavings(totalHoursPerWeek, s.pct),
    }))

    return { p, totalHoursPerWeek, totalHoursPerYear, costPerYear, scenarios }
  })

  const processBlocks = processMetrics
    .map(({ p, totalHoursPerWeek, totalHoursPerYear, costPerYear, scenarios }, i) => {
      const scenarioLines = scenarios
        .map(
          (s) => `  Optie ${s.letter} — ${s.label} (${Math.round(s.pct * 100)}% van het werk weg):
    - HUIDIGE uren/week (ongewijzigd): ${fmtHrs(totalHoursPerWeek)}
    - RESTERENDE uren/week (controle/uitzonderingen): ${fmtHrs(s.remainingHoursPerWeek)}
    - BESPAARDE uren/week: ${fmtHrs(s.savedHoursPerWeek)}
    - BESPAARDE uren/jaar: ${fmtHrs(s.savedHoursPerYear)}
    - BESPAARDE euro's/jaar: ${fmtEur(s.savedEurosPerYear)}`,
        )
        .join('\n\n')

      return `Proces ${i + 1}: "${p.description}"
  Invoer:
    - Uren per persoon per week: ${fmtHrs(p.hoursPerWeek)}
    - Aantal mensen: ${p.peopleInvolved}
    - Totaal mensuren per week: ${fmtHrs(totalHoursPerWeek)} uur
    - Totaal mensuren per jaar (×48 weken): ${fmtHrs(totalHoursPerYear)} uur
    - Huidige personeelskosten (×€50/uur): ${fmtEur(costPerYear)} per jaar

${scenarioLines}`
    })
    .join('\n\n')

  // Pre-compute all 3^N combinations for N processes
  type ScenarioEntry = { letter: string; savedHoursPerYear: number; savedEurosPerYear: number }
  function allCombinations(arrays: ScenarioEntry[][]): ScenarioEntry[][] {
    if (arrays.length === 0) return [[]]
    const [first, ...rest] = arrays
    const restCombos = allCombinations(rest)
    return first.flatMap((item) => restCombos.map((combo) => [item, ...combo]))
  }
  const combinations = allCombinations(processMetrics.map((pm) => pm.scenarios))
  const combinationLines = combinations.map((combo) => {
    const totalHrs = combo.reduce((sum, s) => sum + s.savedHoursPerYear, 0)
    const totalEur = combo.reduce((sum, s) => sum + s.savedEurosPerYear, 0)
    const label = combo.map((s) => s.letter).join('-')
    return `  ${label}: ${fmtHrs(totalHrs)} uur/jaar = ${fmtEur(totalEur)}`
  })

  const grandTotalHoursPerYear = grandTotalHoursPerWeek * WEEKS_PER_YEAR

  return `Bedrijfsgegevens:
- Naam: ${body.companyName}
- Sector: ${body.sector}

═══════════════════════════════════════════════════════════════
VOORAF BEREKENDE CIJFERS — gebruik UITSLUITEND deze getallen.
Reken NIETS zelf uit. Alle math is al voor je gedaan
(€50/uur, 48 werkweken per jaar).
═══════════════════════════════════════════════════════════════

${processBlocks}

───────────────────────────────────────────────────────────────
HUIDIGE SITUATIE (alle drie processen samen, vóór automatisering):
  - Totale mensuren per week: ${fmtHrs(grandTotalHoursPerWeek)} uur
  - Totale mensuren per jaar: ${fmtHrs(grandTotalHoursPerYear)} uur
  - Huidige personeelskosten per jaar: ${fmtEur(grandTotalCostPerYear)}

TOTAAL PER COMBINATIE (kies één rij voor de Samenvatting,
op basis van je ${body.processes.length} scenario-keuzes hierboven):
${combinationLines.join('\n')}

Voorbeeld: kies je voor ${body.processes.map((_, i) => `proces ${i + 1} = B`).join(', ')},
dan zoek je de rij "${Array(body.processes.length).fill('B').join('-')}" op en gebruik je die twee getallen
letterlijk in de Samenvatting.
───────────────────────────────────────────────────────────────

Grootste pijnpunt volgens dit bedrijf:
"${body.painPoint}"

INSTRUCTIE:
1. Kies per proces één scenario (A, B of C) op basis van hoe goed het proces zich leent voor automatisering.
2. Gebruik per kans de getallen LETTERLIJK uit het gekozen scenario (huidige, resterende, bespaarde uren/week, uren/jaar en euro's).
3. Voor de Samenvatting: zoek je combinatie (bv. "B-A-B") op in de tabel "TOTAAL PER COMBINATIE" en gebruik die twee getallen letterlijk. Tel NOOIT zelf op.
4. Reken zelf niets uit — alleen overschrijven.

Schrijf nu het Seeds Report voor ${body.companyName} met ${body.processes.length} ${body.processes.length === 1 ? 'automatiseringskans' : 'automatiseringskansen'}.`
}

// ─── HTML rapport-template helpers ──────────────────────────────────────────

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ─── Report section parser ───────────────────────────────────────────────────

type KansItem   = { label: string; content: string }
type ParsedKans = { naam: string; items: KansItem[] }
type ParsedReport = {
  samenvatting: string[]
  kansen:       ParsedKans[]
  eersteStap:   string[]
  footnote:     string
}

function parseReportSections(report: string): ParsedReport {
  const lines = report.split('\n')
  let section: 'none' | 'samenvatting' | 'kansen' | 'stap' | 'footnote' = 'none'
  let currentKans: ParsedKans | null = null
  const result: ParsedReport = { samenvatting: [], kansen: [], eersteStap: [], footnote: '' }

  for (const line of lines) {
    const t = line.trim()
    if (t.startsWith('## Samenvatting'))         { section = 'samenvatting'; continue }
    if (t.startsWith('## Automatiseringskansen')) { section = 'kansen';      continue }
    if (t.startsWith('## Aanbevolen eerste stap')) {
      if (currentKans) { result.kansen.push(currentKans); currentKans = null }
      section = 'stap'; continue
    }
    if (t.startsWith('### ')) {
      if (currentKans) result.kansen.push(currentKans)
      currentKans = { naam: t.slice(4).trim(), items: [] }
      continue
    }
    // --- only marks the footnote when already inside the 'stap' section;
    // ignore it elsewhere so Claude's horizontal rules don't break kansen parsing
    if (t.startsWith('---') && section === 'stap') { section = 'footnote'; continue }
    if (t === '') continue

    if (section === 'samenvatting') {
      result.samenvatting.push(t)
    } else if (section === 'kansen' && currentKans) {
      const m = t.match(/^\*\*(.+?):\*\*\s*(.*)$/)
      if (m) {
        currentKans.items.push({ label: m[1], content: m[2].trim() })
      } else if (currentKans.items.length > 0) {
        currentKans.items[currentKans.items.length - 1].content += ' ' + t
      }
    } else if (section === 'stap') {
      result.eersteStap.push(t)
    } else if (section === 'footnote') {
      result.footnote += (result.footnote ? ' ' : '') + t.replace(/^\*|\*$/g, '').trim()
    }
  }
  if (currentKans) result.kansen.push(currentKans)
  return result
}

// ─── Slide deck HTML builder ─────────────────────────────────────────────────

function buildReportHtml(body: RequestBody, report: string): string {
  const parsed = parseReportSections(report)

  const co     = escapeHtml(body.companyName)
  const sector = escapeHtml(body.sector)
  const now    = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })

  // Extract hours + euros from samenvatting text for cover badge and counters
  const summaryRaw  = parsed.samenvatting.join(' ')
  const hoursMatch  = summaryRaw.match(/\*\*(\d[\d.,]*)\s*uur per jaar\*\*/)
                   ?? summaryRaw.match(/(\d[\d.,]*)\s*uur per jaar/)
  const eurosMatch  = summaryRaw.match(/\*\*€([\d.,]+)\*\*/)
                   ?? summaryRaw.match(/€([\d.,]+)/)

  const hoursStr = hoursMatch?.[1] ?? '0'
  const eurosStr = eurosMatch?.[1] ?? '0'
  const hoursInt = parseInt(hoursStr.replace(/\./g, '').replace(/,/g, ''), 10) || 0
  const eurosInt = parseInt(eurosStr.replace(/\./g, '').replace(/,/g, ''), 10) || 0
  const seedsCount = parsed.kansen.length

  // Helper: markdown bold → <strong>, HTML-escaped
  const md = (s: string) => escapeHtml(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Samenvatting paragraphs
  const summaryParas = parsed.samenvatting
    .map(l => `<p class="s-summary__body ai" style="animation-delay:380ms">${md(l)}</p>`)
    .join('\n        ')

  // Eerste stap: first paragraph = motivatie, second = Field Discovery pitch (goes in box)
  const stapBodyPara = parsed.eersteStap[0]
    ? `<p class="s-cta__body ai" style="animation-delay:190ms">${md(parsed.eersteStap[0])}</p>`
    : ''
  const stapBoxContent = parsed.eersteStap[1]
    ? md(parsed.eersteStap[1])
    : 'Hidden Harvest kijkt naar je process, bepaalt welke integraties nodig zijn en schetst hoe snel een eerste werkende oplossing live kan staan.'

  // Kansen slides
  const kansenSlides = parsed.kansen.map((kans, i) => {
    const watItem  = kans.items.find(it => it.label === 'Wat er nu gebeurt')
    const hoeItem  = kans.items.find(it => it.label === 'Hoe automatisering eruit ziet')
    const tijdItem = kans.items.find(it => it.label === 'Geschatte tijdsbesparing')
    const typeItem = kans.items.find(it => it.label === 'Type oplossing')

    let tijdPill = ''
    if (tijdItem) {
      const hM = tijdItem.content.match(/(\d[\d.,]*)\s*uur per jaar/)
      const eM = tijdItem.content.match(/€([\d.,]+)/)
      if (hM && eM) tijdPill = `${hM[1]} uur/jaar &middot; €${eM[1]}`
    }
    const typePill = typeItem ? escapeHtml(typeItem.content.replace(/\*\*/g, '').trim()) : ''
    const numLabel = `Kans ${String(i + 1).padStart(2, '0')}`

    return `
  <!-- SLIDE: KANS ${i + 1} -->
  <div class="slide s-kans" data-index="${i + 2}" data-theme="light">
    <div class="s-kans__header">
      <span class="s-kans__num ai" style="animation-delay:40ms">${escapeHtml(numLabel)}</span>
      <h2 class="s-kans__name ai" style="animation-delay:110ms">${escapeHtml(kans.naam)}</h2>
    </div>
    <div class="s-kans__cols">
      <div class="kans-block ai" style="animation-delay:180ms">
        <div class="kans-block__label">
          <span class="kans-block__dot" style="background:var(--red)"></span>
          <span class="kans-block__label-text" style="color:var(--red)">Wat er nu gebeurt</span>
        </div>
        <p class="kans-block__body">${watItem ? md(watItem.content) : ''}</p>
      </div>
      <div class="kans-block ai" style="animation-delay:260ms">
        <div class="kans-block__label">
          <span class="kans-block__dot" style="background:var(--forest)"></span>
          <span class="kans-block__label-text" style="color:var(--forest)">Hoe automatisering eruit ziet</span>
        </div>
        <p class="kans-block__body">${hoeItem ? md(hoeItem.content) : ''}</p>
      </div>
    </div>
    <div class="s-kans__pills">
      ${tijdPill ? `<span class="pill pill--green ai" style="animation-delay:330ms">${tijdPill}</span>` : ''}
      ${typePill ? `<span class="pill pill--blue ai" style="animation-delay:390ms">${typePill}</span>` : ''}
    </div>
  </div>`
  }).join('\n')

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seeds Report · ${co}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100vw; height: 100vh; overflow: hidden; background: #2D5A3D; -webkit-font-smoothing: antialiased; }
    :root {
      --forest: #2D5A3D; --earth: #8B6F47; --soil: #3D2B1F;
      --blue: #A8D5E5; --cream: #F9F6F0; --char: #2C2C2C;
      --red: #D4726A; --off-white: #F4F0E8;
    }
    #bar { position:fixed; top:0; left:0; height:3px; background:#A8D5E5; z-index:200; transition:width 400ms cubic-bezier(.4,0,.2,1),background 400ms ease; width:0; }
    #counter { position:fixed; top:18px; right:24px; font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.12em; z-index:200; transition:color 400ms ease; pointer-events:none; }
    #dots { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); display:flex; gap:9px; align-items:center; z-index:200; }
    .dot { border-radius:50%; cursor:pointer; transition:all 260ms cubic-bezier(.4,0,.2,1); width:7px; height:7px; border:none; }
    .dot.active { width:11px; height:11px; }
    .arrow { position:fixed; top:50%; z-index:200; transform:translateY(-50%); width:44px; height:44px; display:flex; align-items:center; justify-content:center; cursor:pointer; border:none; background:none; opacity:.35; transition:opacity 200ms ease,color 400ms ease; }
    .arrow:hover { opacity:.85; }
    .arrow svg { width:22px; height:22px; stroke-width:1.5; fill:none; stroke:currentColor; }
    #prev { left:18px; } #next { right:18px; }
    #stage { position:relative; width:100vw; height:100vh; overflow:hidden; }
    .slide { position:absolute; top:0; left:0; width:100vw; height:100vh; overflow:hidden; transform:translateX(100%); transition:transform 400ms cubic-bezier(.4,0,.2,1); will-change:transform; }
    .slide.is-active  { transform:translateX(0); }
    .slide.is-leaving { transform:translateX(-100%); }
    .ai { opacity:0; transform:translateY(18px); }
    @keyframes fadeUp { to { opacity:1; transform:translateY(0); } }
    @keyframes float  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-11px)} }
    /* Cover */
    .s-cover { background:var(--forest); color:var(--off-white); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:72px 80px 80px; }
    .s-cover__bg { position:absolute; inset:0; pointer-events:none; }
    .s-cover__label { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:rgba(244,240,232,.42); margin-bottom:22px; position:relative; }
    .s-cover__company { font-family:'Playfair Display',serif; font-weight:900; font-size:clamp(52px,7.5vw,88px); line-height:1.04; color:var(--off-white); margin-bottom:14px; position:relative; }
    .s-cover__meta { font-family:'Inter',sans-serif; font-weight:300; font-size:15px; color:rgba(244,240,232,.42); letter-spacing:.04em; margin-bottom:60px; position:relative; }
    .s-cover__badge { position:relative; display:flex; flex-direction:column; align-items:center; gap:7px; }
    .s-cover__amount { font-family:'Playfair Display',serif; font-weight:900; font-size:clamp(60px,9vw,108px); line-height:1; color:var(--off-white); letter-spacing:-.01em; }
    .s-cover__amount-sub { font-family:'Inter',sans-serif; font-weight:300; font-size:13px; letter-spacing:.06em; text-transform:uppercase; color:rgba(244,240,232,.42); }
    .s-cover__cta { position:absolute; bottom:44px; right:52px; font-family:'Inter',sans-serif; font-weight:400; font-size:13px; letter-spacing:.03em; color:rgba(244,240,232,.55); background:none; border:none; cursor:pointer; transition:color 180ms ease; }
    .s-cover__cta:hover { color:var(--off-white); }
    .s-cover__brand { position:absolute; bottom:44px; left:52px; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em; color:rgba(244,240,232,.28); }
    /* Summary */
    .s-summary { background:var(--cream); display:flex; align-items:center; padding:0 10vw; }
    .s-summary__inner { width:100%; max-width:960px; }
    .tag { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--earth); margin-bottom:14px; display:block; }
    .heading { font-family:'Playfair Display',serif; font-weight:700; font-size:clamp(30px,3.8vw,46px); color:var(--forest); line-height:1.15; margin-bottom:36px; }
    .s-summary__stats { display:flex; align-items:baseline; gap:40px; margin-bottom:32px; padding-bottom:28px; border-bottom:1px solid rgba(139,111,71,.25); }
    .stat { display:flex; flex-direction:column; gap:5px; }
    .stat__val { font-family:'Playfair Display',serif; font-weight:700; line-height:1; color:var(--forest); }
    .stat__val--lg { font-size:clamp(36px,4.5vw,52px); }
    .stat__val--md { font-size:clamp(26px,3.2vw,36px); }
    .stat__val--sm { font-size:clamp(22px,2.6vw,30px); }
    .stat__label { font-family:'Inter',sans-serif; font-weight:400; font-size:12px; color:var(--earth); letter-spacing:.04em; }
    .stat-divider { width:1px; height:40px; background:rgba(139,111,71,.2); align-self:center; }
    .s-summary__body { font-family:'Inter',sans-serif; font-weight:300; font-size:17px; line-height:1.78; color:var(--char); max-width:640px; }
    /* Kansen */
    .s-kans { background:var(--cream); display:flex; flex-direction:column; justify-content:center; padding:56px 10vw 64px; }
    .s-kans__header { margin-bottom:28px; }
    .s-kans__num { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--earth); margin-bottom:10px; display:block; }
    .s-kans__name { font-family:'Playfair Display',serif; font-weight:700; font-size:clamp(26px,3.5vw,42px); color:var(--soil); line-height:1.2; }
    .s-kans__cols { display:grid; grid-template-columns:1fr 1fr; gap:28px; margin-bottom:28px; }
    .kans-block { background:#fff; border-radius:3px; padding:24px 28px 26px; }
    .kans-block__label { display:flex; align-items:center; gap:9px; margin-bottom:13px; }
    .kans-block__dot { width:7px; height:7px; border-radius:1px; flex-shrink:0; }
    .kans-block__label-text { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.14em; text-transform:uppercase; }
    .kans-block__body { font-family:'Inter',sans-serif; font-weight:300; font-size:15px; line-height:1.72; color:var(--char); }
    .s-kans__pills { display:flex; gap:10px; flex-wrap:wrap; }
    .pill { display:inline-flex; align-items:center; padding:8px 16px; border-radius:2px; font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.07em; white-space:nowrap; }
    .pill--green { background:var(--forest); color:var(--off-white); }
    .pill--blue  { background:var(--blue);   color:var(--soil); }
    /* CTA */
    .s-cta { background:var(--forest); color:var(--off-white); display:flex; flex-direction:column; justify-content:center; padding:64px 10vw 80px; }
    .s-cta__heading { font-family:'Playfair Display',serif; font-weight:700; font-size:clamp(32px,5vw,56px); color:var(--off-white); line-height:1.12; margin-bottom:20px; }
    .s-cta__body { font-family:'Inter',sans-serif; font-weight:300; font-size:17px; line-height:1.74; color:rgba(244,240,232,.72); max-width:520px; margin-bottom:16px; }
    .s-cta__box { background:var(--cream); border-radius:4px; padding:30px 36px 32px; max-width:520px; margin-top:24px; }
    .s-cta__box-title { font-family:'Playfair Display',serif; font-weight:700; font-size:21px; color:var(--forest); margin-bottom:9px; }
    .s-cta__box-body { font-family:'Inter',sans-serif; font-weight:300; font-size:15px; line-height:1.68; color:var(--char); }
    .s-cta__footer { position:absolute; bottom:44px; left:10vw; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em; color:rgba(244,240,232,.28); }
    .s-cta__back { position:absolute; bottom:44px; right:52px; font-family:'Inter',sans-serif; font-size:13px; color:rgba(244,240,232,.42); background:none; border:none; cursor:pointer; transition:color 180ms ease; }
    .s-cta__back:hover { color:rgba(244,240,232,.75); }

    /* ── Flower ──────────────────────────────────────────── */
    #flower-stage {
      position: fixed; bottom: 52px; right: 64px;
      z-index: 100; pointer-events: none;
      width: 90px; height: 135px;
      transition: opacity 400ms ease;
    }
    #fl-stem { stroke-dasharray: 80; stroke-dashoffset: 80; }
    #fl-leaf-l, #fl-leaf-r { opacity: 0; }
    #fl-p0 { --pr: 0deg;   opacity: 0; transform-origin: 50px 66px; transform: rotate(0deg)   scale(0); }
    #fl-p1 { --pr: 72deg;  opacity: 0; transform-origin: 50px 66px; transform: rotate(72deg)  scale(0); }
    #fl-p2 { --pr: 144deg; opacity: 0; transform-origin: 50px 66px; transform: rotate(144deg) scale(0); }
    #fl-p3 { --pr: 216deg; opacity: 0; transform-origin: 50px 66px; transform: rotate(216deg) scale(0); }
    #fl-p4 { --pr: 288deg; opacity: 0; transform-origin: 50px 66px; transform: rotate(288deg) scale(0); }
    #fl-center { opacity: 0; transform-origin: 50px 66px; transform: scale(0); }
    @keyframes flStemGrow { to { stroke-dashoffset: 0; } }
    @keyframes flLeafIn   { to { opacity: 1; } }
    @keyframes flPetalIn  { from { opacity: 0; transform: rotate(var(--pr)) scale(0); } to { opacity: 1; transform: rotate(var(--pr)) scale(1); } }
    @keyframes flCenterIn { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.3); } 100% { opacity: 1; transform: scale(1); } }
    #flower-stage.fl-dark #fl-stem        { stroke: rgba(244,240,232,0.30); }
    #flower-stage.fl-dark #fl-leaf-l path,
    #flower-stage.fl-dark #fl-leaf-r path { fill: rgba(244,240,232,0.22); }
    #flower-stage.fl-dark #fl-p0, #flower-stage.fl-dark #fl-p1,
    #flower-stage.fl-dark #fl-p2, #flower-stage.fl-dark #fl-p3,
    #flower-stage.fl-dark #fl-p4          { fill: rgba(244,240,232,0.22); }
    #flower-stage.fl-dark #fl-center      { fill: rgba(244,240,232,0.35); }
  </style>
</head>
<body>
<div id="bar"></div>
<div id="counter">1 / ?</div>
<button class="arrow" id="prev" aria-label="Vorige"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>
<button class="arrow" id="next" aria-label="Volgende"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>
<div id="dots"></div>
<div id="stage">

  <!-- SLIDE 1: COVER -->
  <div class="slide s-cover is-active" data-index="0" data-theme="dark">
    <svg class="s-cover__bg" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="rgba(244,240,232,0.08)">
        <ellipse cx="110" cy="195" rx="38" ry="72" transform="rotate(-28,110,195)"/>
        <ellipse cx="1340" cy="710" rx="50" ry="88" transform="rotate(22,1340,710)"/>
        <ellipse cx="1390" cy="145" rx="22" ry="44" transform="rotate(-42,1390,145)"/>
        <ellipse cx="85" cy="795" rx="26" ry="52" transform="rotate(18,85,795)"/>
        <ellipse cx="420" cy="68" rx="11" ry="22" transform="rotate(-18,420,68)"/>
        <ellipse cx="690" cy="848" rx="13" ry="26" transform="rotate(12,690,848)"/>
        <ellipse cx="930" cy="56" rx="9" ry="18" transform="rotate(35,930,56)"/>
        <ellipse cx="1130" cy="856" rx="10" ry="20" transform="rotate(-12,1130,856)"/>
        <ellipse cx="260" cy="830" rx="8" ry="16" transform="rotate(8,260,830)"/>
        <ellipse cx="1200" cy="80" rx="7" ry="15" transform="rotate(-25,1200,80)"/>
      </g>
    </svg>
    <span class="s-cover__label ai" style="animation-delay:50ms">Seeds Report</span>
    <h1 class="s-cover__company ai" style="animation-delay:130ms">${co}</h1>
    <p class="s-cover__meta ai" style="animation-delay:200ms">${sector} &nbsp;&middot;&nbsp; ${now}</p>
    <div class="s-cover__badge ai" style="animation-delay:320ms">
      <span class="s-cover__amount">&euro;${eurosStr}</span>
      <span class="s-cover__amount-sub">geschatte besparing per jaar</span>
    </div>
    <span class="s-cover__brand ai" style="animation-delay:420ms">Hidden Harvest &middot; We find the growth hiding in your operations</span>
    <button class="s-cover__cta ai" style="animation-delay:460ms" onclick="go(1)">Bekijk de kansen &rarr;</button>
  </div>

  <!-- SLIDE 2: SAMENVATTING -->
  <div class="slide s-summary" data-index="1" data-theme="light">
    <div class="s-summary__inner">
      <span class="tag ai" style="animation-delay:40ms">Samenvatting</span>
      <h2 class="heading ai" style="animation-delay:110ms">Wat we gevonden hebben</h2>
      <div class="s-summary__stats">
        <div class="stat ai" style="animation-delay:180ms">
          <span class="stat__val stat__val--lg" data-count data-target="${hoursInt}" data-suffix=" uur/jaar">${hoursStr} uur/jaar</span>
          <span class="stat__label">vrij te spelen</span>
        </div>
        <div class="stat-divider ai" style="animation-delay:220ms"></div>
        <div class="stat ai" style="animation-delay:250ms">
          <span class="stat__val stat__val--md" data-count data-prefix="€" data-target="${eurosInt}" data-suffix="/jaar">&euro;${eurosStr}/jaar</span>
          <span class="stat__label">personeelscapaciteit</span>
        </div>
        <div class="stat-divider ai" style="animation-delay:290ms"></div>
        <div class="stat ai" style="animation-delay:310ms">
          <span class="stat__val stat__val--sm" data-count data-target="${seedsCount}" data-suffix=" seeds">${seedsCount} seeds</span>
          <span class="stat__label">geïdentificeerd</span>
        </div>
      </div>
      ${summaryParas}
    </div>
  </div>

${kansenSlides}

  <!-- SLIDE: EERSTE STAP -->
  <div class="slide s-cta" data-index="${seedsCount + 2}" data-theme="dark">
    <span class="tag ai" style="animation-delay:40ms; color:rgba(244,240,232,.38); margin-bottom:14px">Volgende stap</span>
    <h2 class="s-cta__heading ai" style="animation-delay:110ms">Waar beginnen we?</h2>
    ${stapBodyPara}
    <div class="s-cta__box ai" style="animation-delay:280ms">
      <p class="s-cta__box-title">Gratis Field Discovery &middot; 30 minuten</p>
      <p class="s-cta__box-body">${stapBoxContent}</p>
    </div>
    <span class="s-cta__footer ai" style="animation-delay:360ms">Hidden Harvest &middot; seeds@hiddenharvest.nl</span>
    <button class="s-cta__back ai" style="animation-delay:400ms" onclick="go(0)">&larr; Terug naar begin</button>
  </div>

</div>

<div id="flower-stage" aria-hidden="true">
  <svg id="flower-svg" viewBox="0 0 100 150" width="90" height="135" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="flStemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#2D5A3D"/>
        <stop offset="100%" stop-color="#3D7A52"/>
      </linearGradient>
      <linearGradient id="flLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3D7A52"/>
        <stop offset="100%" stop-color="#2D5A3D"/>
      </linearGradient>
    </defs>
    <path id="fl-stem" d="M50 148 C47 125 53 105 50 80"
      fill="none" stroke="url(#flStemGrad)" stroke-width="2.5" stroke-linecap="round" pathLength="80"/>
    <g id="fl-leaf-l"><path d="M50 108 C37 100 28 88 33 78 C39 86 45 96 50 108Z" fill="url(#flLeafGrad)"/></g>
    <g id="fl-leaf-r"><path d="M50 100 C63 93 72 80 67 71 C61 80 56 89 50 100Z" fill="url(#flLeafGrad)"/></g>
    <ellipse id="fl-p0" cx="50" cy="55" rx="6.5" ry="11" fill="#2D5A3D"/>
    <ellipse id="fl-p1" cx="50" cy="55" rx="6.5" ry="11" fill="#2D5A3D"/>
    <ellipse id="fl-p2" cx="50" cy="55" rx="6.5" ry="11" fill="#2D5A3D"/>
    <ellipse id="fl-p3" cx="50" cy="55" rx="6.5" ry="11" fill="#2D5A3D"/>
    <ellipse id="fl-p4" cx="50" cy="55" rx="6.5" ry="11" fill="#2D5A3D"/>
    <circle id="fl-center" cx="50" cy="66" r="7" fill="#8B6F47"/>
  </svg>
</div>

<script>
(function(){
  'use strict';
  var slides  = Array.from(document.querySelectorAll('.slide'));
  var TOTAL   = slides.length;
  var current = 0;
  var locked  = false;

  var dotsEl = document.getElementById('dots');
  slides.forEach(function(_,i){
    var d = document.createElement('button');
    d.className = 'dot' + (i===0?' active':'');
    d.setAttribute('aria-label','Ga naar slide '+(i+1));
    d.addEventListener('click',function(){ go(i); });
    dotsEl.appendChild(d);
  });

  function updateChrome(){
    var isDark = slides[current].dataset.theme==='dark';
    var arrowCol   = isDark?'rgba(244,240,232,.8)':'rgba(44,44,44,.65)';
    var counterCol = isDark?'rgba(244,240,232,.42)':'rgba(44,44,44,.35)';
    var barCol     = isDark?'rgba(168,213,229,.7)':'#2D5A3D';
    var dotAct     = isDark?'rgba(244,240,232,.85)':'#2D5A3D';
    var dotInact   = isDark?'rgba(244,240,232,.22)':'rgba(45,90,61,.28)';
    document.getElementById('bar').style.background = barCol;
    document.getElementById('bar').style.width = ((current+1)/TOTAL*100)+'%';
    document.getElementById('counter').textContent = (current+1)+' / '+TOTAL;
    document.getElementById('counter').style.color = counterCol;
    document.querySelectorAll('.arrow').forEach(function(a){ a.style.color=arrowCol; });
    document.getElementById('prev').style.visibility = current===0?'hidden':'visible';
    document.getElementById('next').style.visibility = current===TOTAL-1?'hidden':'visible';
    document.querySelectorAll('.dot').forEach(function(d,i){
      d.classList.toggle('active',i===current);
      d.style.background = i===current?dotAct:dotInact;
    });
  }

  function kick(slideEl){
    var els = slideEl.querySelectorAll('.ai');
    els.forEach(function(el){
      el.style.animation='none';
      el.getBoundingClientRect();
      el.style.animation='';
      el.style.animationName='fadeUp';
      el.style.animationDuration='310ms';
      el.style.animationTimingFunction='cubic-bezier(.2,0,0,1)';
      el.style.animationFillMode='forwards';
    });
  }

  function runCounters(slideEl){
    var els = slideEl.querySelectorAll('[data-count]');
    els.forEach(function(el){
      var target = parseInt(el.dataset.target,10);
      var prefix = el.dataset.prefix||'';
      var suffix = el.dataset.suffix||'';
      var dur=2000, start=performance.now();
      var easeOut=function(t){return 1-Math.pow(1-t,3);};
      var fmt=function(n){return n>=1000?n.toLocaleString('nl-NL'):String(n);};
      (function tick(now){
        var p=Math.min((now-start)/dur,1);
        el.textContent=prefix+fmt(Math.round(easeOut(p)*target))+suffix;
        if(p<1) requestAnimationFrame(tick);
      })(performance.now());
    });
  }

  var FL_PARTS = ['fl-stem','fl-leaf-l','fl-leaf-r','fl-p0','fl-p1','fl-p2','fl-p3','fl-p4','fl-center'];
  var flStage = 0;

  function stageForSlide(idx) {
    if (idx === 0) return 0;
    if (idx === 1) return 1;
    return Math.min(1 + Math.floor((idx - 1) / (TOTAL - 2) * (FL_PARTS.length - 1)), FL_PARTS.length);
  }

  function kickFlower(slideEl, idx) {
    var stage = document.getElementById('flower-stage');
    var isDark = slideEl.dataset.theme === 'dark';
    stage.classList.toggle('fl-dark', isDark);
    stage.classList.toggle('fl-light', !isDark);
    var target = stageForSlide(idx);
    if (target === 0) { stage.style.opacity = '0'; flStage = 0; return; }
    stage.style.opacity = '1';
    var spring = 'cubic-bezier(0.34,1.56,0.64,1)';
    if (target > flStage) {
      FL_PARTS.slice(flStage, target).forEach(function(id, i) {
        var el = document.getElementById(id);
        if (!el) return;
        el.style.animation = 'none';
        el.getBoundingClientRect();
        el.style.animation = '';
        var nm, dur, ease;
        if (id === 'fl-stem')   { nm = 'flStemGrow'; dur = '500ms'; ease = 'cubic-bezier(0.2,0,0,1)'; }
        else if (id === 'fl-leaf-l' || id === 'fl-leaf-r') { nm = 'flLeafIn'; dur = '300ms'; ease = spring; }
        else if (id === 'fl-center') { nm = 'flCenterIn'; dur = '220ms'; ease = spring; }
        else                    { nm = 'flPetalIn';  dur = '260ms'; ease = spring; }
        el.style.animationName = nm;
        el.style.animationDuration = dur;
        el.style.animationDelay = (i * 70) + 'ms';
        el.style.animationTimingFunction = ease;
        el.style.animationFillMode = 'forwards';
      });
    } else if (target < flStage) {
      FL_PARTS.slice(target, flStage).forEach(function(id) {
        var el = document.getElementById(id);
        if (el) { el.style.animation = 'none'; el.getBoundingClientRect(); }
      });
    }
    flStage = target;
  }

  function go(next){
    if(next===current||locked||next<0||next>=TOTAL) return;
    locked=true;
    var from=slides[current], to=slides[next], fwd=next>current;
    to.style.transition='none';
    to.style.transform=fwd?'translateX(100%)':'translateX(-100%)';
    to.getBoundingClientRect();
    to.style.transition='';
    from.classList.remove('is-active'); from.classList.add('is-leaving');
    if(!fwd) from.style.transform='translateX(100%)';
    to.classList.remove('is-leaving'); to.classList.add('is-active'); to.style.transform='translateX(0)';
    current=next; updateChrome(); kick(to); kickFlower(to, next);
    if(next===1) setTimeout(function(){runCounters(to);},220);
    setTimeout(function(){
      from.classList.remove('is-leaving'); from.style.transform=''; locked=false;
    },420);
  }

  window.go=go;
  document.getElementById('prev').addEventListener('click',function(){go(current-1);});
  document.getElementById('next').addEventListener('click',function(){go(current+1);});
  document.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'||e.key==='ArrowDown') go(current+1);
    if(e.key==='ArrowLeft'||e.key==='ArrowUp')   go(current-1);
  });

  kick(slides[0]);
  kickFlower(slides[0], 0);
  slides.slice(1).forEach(function(s){s.style.transform='translateX(100%)';});
  updateChrome();
  document.getElementById('bar').style.width=(1/TOTAL*100)+'%';
})();
</script>
</body>
</html>`
}

function safeFilename(value: string): string {
  const result = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return result || 'aanvraag'
}

// ─── Mail helpers ────────────────────────────────────────────────────────────

function getLeadRecipients(): string[] {
  return (process.env.LEAD_NOTIFY_TO ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function buildInternalEmailHtml(body: RequestBody): string {
  const co = escapeHtml(body.companyName)
  const sector = escapeHtml(body.sector)
  const contact = escapeHtml(body.contactName)
  const email = escapeHtml(body.contactEmail)
  const painPoint = escapeHtml(body.painPoint)

  const processList = body.processes
    .map(
      (p, i) => `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid #e7e5e4;color:#57534e">${i + 1}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e7e5e4">${escapeHtml(p.description)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e7e5e4;text-align:center">${p.hoursPerWeek}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e7e5e4;text-align:center">${p.peopleInvolved}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e7e5e4;text-align:center">${p.hoursPerWeek * p.peopleInvolved}</td>
      </tr>`,
    )
    .join('')

  return `<!doctype html>
<html lang="nl">
<head><meta charset="utf-8"><title>Nieuwe Seeds Report aanvraag</title></head>
<body style="margin:0;padding:32px 16px;background:#F9F6F0;font-family:system-ui,sans-serif;color:#1c1917">
  <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;padding:40px 48px;box-shadow:0 1px 4px rgba(0,0,0,.08)">
    <p style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#2D5016;font-weight:600;margin:0 0 16px">Hidden Harvest &middot; Seeds Report</p>
    <h1 style="font-size:1.25rem;margin:0 0 24px;color:#1c1917">Nieuwe Seeds Report aanvraag</h1>

    <table style="border-collapse:collapse;width:100%;margin-bottom:24px">
      <tr><td style="padding:5px 0;color:#57534e;width:160px">Bedrijfsnaam</td><td style="padding:5px 0"><strong>${co}</strong></td></tr>
      <tr><td style="padding:5px 0;color:#57534e">Sector</td><td style="padding:5px 0">${sector}</td></tr>
      <tr><td style="padding:5px 0;color:#57534e">Contactpersoon</td><td style="padding:5px 0">${contact}</td></tr>
      <tr><td style="padding:5px 0;color:#57534e">E-mailadres</td><td style="padding:5px 0"><a href="mailto:${email}" style="color:#2D5016">${email}</a></td></tr>
    </table>

    <p style="margin:0 0 8px;font-weight:600">Grootste pijnpunt</p>
    <p style="margin:0 0 24px;line-height:1.6;color:#44403c;background:#F9F6F0;padding:12px 16px;border-radius:6px">${painPoint}</p>

    <p style="margin:0 0 8px;font-weight:600">Processen</p>
    <table style="border-collapse:collapse;width:100%;font-size:0.875rem;margin-bottom:24px">
      <thead>
        <tr style="background:#F9F6F0">
          <th style="padding:6px 8px;text-align:left;color:#57534e;font-weight:600">#</th>
          <th style="padding:6px 8px;text-align:left;color:#57534e;font-weight:600">Beschrijving</th>
          <th style="padding:6px 8px;text-align:center;color:#57534e;font-weight:600">Uur/week</th>
          <th style="padding:6px 8px;text-align:center;color:#57534e;font-weight:600">Mensen</th>
          <th style="padding:6px 8px;text-align:center;color:#57534e;font-weight:600">Totaal u/w</th>
        </tr>
      </thead>
      <tbody>${processList}</tbody>
    </table>

    <p style="margin:0;color:#57534e;font-size:0.875rem">Het gegenereerde Seeds Report staat als HTML-bijlage bij deze mail.</p>
  </div>
</body>
</html>`
}

// ─── GET: preview slide deck met demo-data (alleen voor lokaal testen) ────────

const PREVIEW_BODY: RequestBody = {
  companyName: 'FreshMeals BV',
  sector: 'E-commerce',
  contactName: 'Jan de Vries',
  contactEmail: 'jan@freshmeals.nl',
  painPoint: 'We verliezen te veel tijd aan handmatige orderverwerking.',
  processes: [
    { description: 'Orderverwerking vanuit e-mail en webshop', hoursPerWeek: 8, peopleInvolved: 2 },
    { description: 'Inkoop en voorraadbeheer', hoursPerWeek: 4, peopleInvolved: 1 },
    { description: 'Klantenservice via e-mail', hoursPerWeek: 3, peopleInvolved: 2 },
  ],
}

const PREVIEW_REPORT = `## Samenvatting
FreshMeals BV besteedt nu wekelijks 17,5 mensuren aan terugkerende administratieve processen. Door slimme automatisering kan naar schatting circa **840 uur per jaar** vrijspelen — goed voor ongeveer **€42.000** aan personeelscapaciteit. Dat betekent minder handmatig controleren en meer tijd voor groei.

## Automatiseringskansen

### Kans 1: Automatische Orderverwerking Engine
**Wat er nu gebeurt:** Medewerkers verwerken dagelijks 50-80 inkomende orders handmatig vanuit e-mail en het webshop-systeem.
**Hoe automatisering eruit ziet:** Een AI-engine leest binnenkomende orders, controleert voorraad automatisch en escaleert alleen uitzonderingen naar een medewerker.
**Geschatte tijdsbesparing:** Van 16 uur/week naar 2 uur/week (controle). Dat bespaart 14 uur/week, oftewel 672 uur per jaar = **€33.600**.
**Type oplossing:** AI als engine

### Kans 2: Slimme Inkoopplanning
**Wat er nu gebeurt:** Inkopers maken wekelijks handmatig een inkoopoverzicht op basis van verkoopdata en leverancierslevertijden.
**Hoe automatisering eruit ziet:** Een predictief model genereert automatisch inkoopadviezen met één-klik goedkeuring.
**Geschatte tijdsbesparing:** Van 4 uur/week naar 1 uur/week. Dat bespaart 144 uur per jaar = **€7.200**.
**Type oplossing:** AI als bouwer

### Kans 3: Klantenservice Copilot
**Wat er nu gebeurt:** Het team beantwoordt dagelijks 30-50 klantmails handmatig.
**Hoe automatisering eruit ziet:** Een AI-engine schrijft conceptantwoorden die een medewerker met één klik goedkeurt en verstuurt.
**Geschatte tijdsbesparing:** Van 6 uur/week naar 2 uur/week. Dat bespaart 192 uur per jaar = **€9.600**.
**Type oplossing:** AI als product

## Aanbevolen eerste stap
We stellen voor om te starten met de Automatische Orderverwerking Engine. Dit is de biggest weed in je operatie: 672 uur per jaar en de hoogste ROI.

We stellen voor om te beginnen met een **gratis Field Discovery-gesprek van 30 minuten**. Daarin kijkt Hidden Harvest naar je orderflow, bepaalt het welke integraties nodig zijn en schetst het hoe snel een eerste werkende oplossing live kan staan.

---
*Berekening gebaseerd op een indicatief uurtarief van €50 per uur en 48 werkweken per jaar.*`

export async function GET() {
  const html = buildReportHtml(PREVIEW_BODY, PREVIEW_REPORT)
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

async function sendLeadNotification(body: RequestBody, report: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY ontbreekt. Voeg deze toe aan .env.local of Vercel.')
  }

  const recipients = getLeadRecipients()
  if (recipients.length === 0) {
    throw new Error('LEAD_NOTIFY_TO ontbreekt. Voeg minimaal één intern e-mailadres toe.')
  }

  const from = process.env.LEAD_NOTIFY_FROM ?? 'Hidden Harvest <onboarding@resend.dev>'
  const filename = `seeds-report-${safeFilename(body.companyName)}.html`
  const reportHtml = buildReportHtml(body, report)

  const resend = new Resend(apiKey)
  await resend.emails.send({
    from,
    to: recipients,
    subject: `Nieuwe Seeds Report aanvraag: ${body.companyName} — ${new Date().toLocaleString('nl-NL', { dateStyle: 'short', timeStyle: 'short' })}`,
    html: buildInternalEmailHtml(body),
    attachments: [{ filename, content: Buffer.from(reportHtml) }],
  })
}
