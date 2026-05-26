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

const SYSTEM_PROMPT = `Je bent een ervaren AI-automatiseringsconsultant van Hidden Harvest — een Nederlands bureau in Delft dat verborgen groei vindt in bedrijfsoperaties. Hidden Harvest analyseert handmatige processen en bouwt op maat gemaakte automatisering met AI.

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
- Begin met één zin die de huidige situatie schetst (bv. "[Bedrijfsnaam] besteedt nu wekelijks X uur aan drie terugkerende administratieve processen", waarbij X = de "Totale mensuren per week" uit "HUIDIGE SITUATIE").
- Noem dan de geschatte besparing met een voorzichtige formulering, bv. "kan naar schatting circa **[Y] uur per jaar** vrijspelen — goed voor ongeveer **[€Z]** aan personeelscapaciteit, uitgaande van €50 per uur". Y en Z komen LETTERLIJK uit de rij in de "TOTAAL PER COMBINATIE"-tabel die hoort bij je drie scenario-keuzes. Reken niets zelf uit.
- Eindig met één concrete zin over wat dit voor het team betekent (bv. sneller reageren op klanten, minder handmatig controleren, meer tijd voor verkoop en groei).

## Drie automatiseringskansen

### Kans 1: [Commerciële, productachtige naam — bv. "Automatische Offertemotor", "Order Intelligence Engine", "Slimme Voorraad Pilot". Vermijd droge functionele omschrijvingen als "Automatische verwerking van X".]
**Wat er nu gebeurt:** Eén zin over het huidige proces, in de taal van de gebruiker.
**Hoe automatisering eruit ziet:** 2-3 zinnen. Wees concreet over de oplossing: welke data, welk type AI-rol, welke integraties.
**Geschatte tijdsbesparing:** Gebruik EXACT dit format: "Van [HUIDIGE_UREN_PER_WEEK] uur/week naar [RESTERENDE_UREN_PER_WEEK] uur/week (controle/uitzonderingen). Dat bespaart [BESPAARDE_UREN_PER_WEEK] uur/week, oftewel [BESPAARDE_UREN_PER_JAAR] uur per jaar = **[BESPAARDE_EUROS_PER_JAAR]**." Alle vier de getallen komen uit het scenario dat je kiest in de "VOORAF BEREKENDE CIJFERS".
**Type oplossing:** Kies één: "AI als bouwer" (custom software sneller bouwen met AI) / "AI als engine" (AI doet zelf het werk dat eerder mensen deden) / "AI als product" (multi-tenant SaaS) / "Workflow automation / systeemintegratie" (koppelingen tussen bestaande systemen, AI optioneel). Combineren mag, bv. "AI als bouwer + workflow automation".
**Vergelijkbaar met:** Eén voorzichtige zin over een Hidden Harvest case die in de buurt komt. Gebruik formuleringen als "vergelijkbaar met X, waarbij ... grotendeels werd geautomatiseerd zodat medewerkers alleen nog uitzonderingen hoefden te controleren". Vermijd harde absolute claims als "van 16 uur naar 3 minuten" — beschrijf het concept, niet een gegarandeerde uitkomst. Laat deze regel helemaal weg als er geen passende case is.

### Kans 2: [...]
[zelfde structuur]

### Kans 3: [...]
[zelfde structuur]

## Aanbevolen eerste stap
Twee korte alinea's.
- **Alinea 1 (max 3 zinnen):** welke van de drie kansen zou je als eerste oppakken en waarom, met verwijzing naar de besparing van die specifieke kans.
- **Alinea 2 (kort en direct):** gebruik dit format: "We stellen voor om te beginnen met een **gratis Field Discovery-gesprek van 30 minuten**. Daarin kijkt Hidden Harvest naar [iets specifieks uit de gekozen eerste kans], bepaalt het welke integraties nodig zijn en schetst het hoe snel een eerste werkende oplossing live kan staan."

---
*Berekening gebaseerd op een indicatief uurtarief van €50 per uur en 48 werkweken per jaar.*

# Harde regels

- Schrijf zakelijk maar menselijk Nederlands. Geen vakjargon zonder uitleg.
- **REKEN NIETS ZELF UIT.** Gebruik UITSLUITEND de getallen uit het blok "VOORAF BEREKENDE CIJFERS" in de gebruikersinvoer. Alle math (uren × mensen × 48 weken × €50/uur) is al voor je uitgerekend. Verzin geen eigen sommen — neem getallen letterlijk over. Tel NOOIT zelf de drie processen op; gebruik in plaats daarvan de "TOTAAL PER COMBINATIE"-tabel.
- Voor elk proces: kies één automatiseringsniveau (A = conservatief 70%, B = realistisch 85%, of C = ambitieus 95%) op basis van hoe geschikt het proces is voor automatisering, en gebruik UITSLUITEND de cijfers uit dat ene scenario. Combineer geen scenario's binnen één proces.
- Voor de samenvatting: zoek je gekozen combinatie (bv. "B-A-B") op in de "TOTAAL PER COMBINATIE"-tabel en gebruik die getallen letterlijk. **De combinatie die je gebruikt voor de samenvatting MOET exact dezelfde zijn als de drie scenario-keuzes in de Kansen.** Schreef je in Kans 3 de "B"-cijfers, dan moet de Samenvatting-rij ook eindigen op "-B", niet op "-C". Als de uren in je Samenvatting niet gelijk zijn aan de som van de drie "X uur per jaar"-getallen in je Kansen, heb je een verkeerde rij gepakt — corrigeer voordat je antwoordt.
- Vermijd vage termen ("aanzienlijk", "veel", "snel") — gebruik de exacte getallen.
- **Geen jargon.** Schrijf NOOIT "mens in de loop" of "human in the loop". Gebruik in plaats daarvan formuleringen als "blijft een medewerker betrokken", "een medewerker controleert nog uitzonderingen", of "een collega keurt het concept nog goed".
- **Voorzichtige financiële taal.** Gebruik "naar schatting circa", "kan tot circa", "ongeveer" bij geldbedragen. Schrijf niet "bespaart €X" maar "kan naar schatting circa €X vrijspelen" of "goed voor ongeveer €X aan personeelscapaciteit". Het rapport is een indicatie, geen garantie.
- Sorteer de drie kansen op grootste ROI eerst (gebruik de "Besparing per jaar" van het gekozen scenario).
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

  return `## Samenvatting

Op basis van de drie processen die ${body.companyName} heeft ingevuld, is er een geschatte besparing mogelijk van **${totalHoursPerYear} uur per jaar** — dat staat gelijk aan **€${totalEurosPerYear.toLocaleString('nl-NL')} aan personeelskosten**. De grootste kansen liggen in het automatiseren van ${p[0].description.toLowerCase()}, gevolgd door de overige twee processen.

## Drie automatiseringskansen

### Kans 1: Automatische verwerking van ${p[0].description.split(' ').slice(0, 4).join(' ')}

**Wat er nu gebeurt:** ${body.companyName} besteedt wekelijks ${p[0].hoursPerWeek * p[0].peopleInvolved} mensuur aan ${p[0].description.toLowerCase()}, volledig handmatig.

**Hoe automatisering eruit ziet:** Een AI-agent leest binnenkomende input, classificeert de inhoud en stelt automatisch een concept-antwoord of verwerking op op basis van vooraf ingestelde regels en historische data. Een medewerker controleert alleen uitzonderingen — de overige 80-90% verloopt zonder tussenkomst.

**Geschatte tijdsbesparing:** ${p[0].hoursPerWeek * p[0].peopleInvolved} uur/week → circa 30 minuten/week voor controle. Jaarbesparing: ${p[0].hoursPerWeek * p[0].peopleInvolved * 48} uur = **€${(p[0].hoursPerWeek * p[0].peopleInvolved * 48 * 50).toLocaleString('nl-NL')}**.

**Type oplossing:** AI als engine

**Vergelijkbaar met:** Fattorino Innamorato, waarbij Hidden Harvest een vergelijkbaar systeem bouwde voor e-commerce klantenservice: responstijd daalde van uren naar minuten.

### Kans 2: Gestructureerde vervanging van ${p[1].description.split(' ').slice(0, 4).join(' ')}

**Wat er nu gebeurt:** ${p[1].peopleInvolved} medewerker${p[1].peopleInvolved > 1 ? 's besteden' : ' besteedt'} ${p[1].hoursPerWeek} uur per week aan ${p[1].description.toLowerCase()}.

**Hoe automatisering eruit ziet:** Een geautomatiseerd systeem koppelt de databron (bv. orders, spreadsheets of leveranciersinvoer) direct aan de uitvoer, zonder handmatige tussenstap. Wijzigingen worden in real-time doorgevoerd en zijn direct zichtbaar in een dashboard.

**Geschatte tijdsbesparing:** ${p[1].hoursPerWeek * p[1].peopleInvolved} uur/week → minder dan 10 minuten controle. Jaarbesparing: ${p[1].hoursPerWeek * p[1].peopleInvolved * 48} uur = **€${(p[1].hoursPerWeek * p[1].peopleInvolved * 48 * 50).toLocaleString('nl-NL')}**.

**Type oplossing:** AI als bouwer

### Kans 3: Slimme automatisering van ${p[2].description.split(' ').slice(0, 4).join(' ')}

**Wat er nu gebeurt:** ${p[2].description} kost ${p[2].hoursPerWeek * p[2].peopleInvolved} uur per week en is volledig handmatig, met kans op fouten en inconsistentie.

**Hoe automatisering eruit ziet:** Op basis van bestaande data (orders, klantgegevens, etc.) genereert het systeem automatisch het gewenste document of de gewenste output. Eén klik ter goedkeuring is alles wat de medewerker nog hoeft te doen.

**Geschatte tijdsbesparing:** ${p[2].hoursPerWeek * p[2].peopleInvolved} uur/week → één klik per item. Jaarbesparing: ${p[2].hoursPerWeek * p[2].peopleInvolved * 48} uur = **€${(p[2].hoursPerWeek * p[2].peopleInvolved * 48 * 50).toLocaleString('nl-NL')}**.

**Type oplossing:** AI als engine

## Aanbevolen eerste stap

De grootste en snelste winst voor ${body.companyName} zit in kans 1: het automatiseren van ${p[0].description.toLowerCase()}. Dit proces heeft de hoogste belasting (${p[0].hoursPerWeek * p[0].peopleInvolved} uur/week) en laat zich goed automatiseren met bewezen AI-technologie die Hidden Harvest al eerder heeft ingezet. Een Field Discovery-gesprek van 30 minuten is genoeg om te beoordelen hoe snel dit live kan — en wat de exacte besparing voor ${body.companyName} wordt. Plan dat gesprek via hiddenharvest.nl.

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

  // Pre-compute ALL 27 combinations (3 processes × 3 scenarios each)
  const combinationLines: string[] = []
  for (const s1 of processMetrics[0].scenarios) {
    for (const s2 of processMetrics[1].scenarios) {
      for (const s3 of processMetrics[2].scenarios) {
        const totalHrs = s1.savedHoursPerYear + s2.savedHoursPerYear + s3.savedHoursPerYear
        const totalEur = s1.savedEurosPerYear + s2.savedEurosPerYear + s3.savedEurosPerYear
        combinationLines.push(
          `  ${s1.letter}-${s2.letter}-${s3.letter}: ${fmtHrs(totalHrs)} uur/jaar = ${fmtEur(totalEur)}`,
        )
      }
    }
  }

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
op basis van je drie scenario-keuzes hierboven):
${combinationLines.join('\n')}

Voorbeeld: kies je voor proces 1 = B, proces 2 = A, proces 3 = B,
dan zoek je de rij "B-A-B" op en gebruik je die twee getallen
letterlijk in de Samenvatting.
───────────────────────────────────────────────────────────────

Grootste pijnpunt volgens dit bedrijf:
"${body.painPoint}"

INSTRUCTIE:
1. Kies per proces één scenario (A, B of C) op basis van hoe goed het proces zich leent voor automatisering.
2. Gebruik per kans de getallen LETTERLIJK uit het gekozen scenario (huidige, resterende, bespaarde uren/week, uren/jaar en euro's).
3. Voor de Samenvatting: zoek je combinatie (bv. "B-A-B") op in de tabel "TOTAAL PER COMBINATIE" en gebruik die twee getallen letterlijk. Tel NOOIT zelf op.
4. Reken zelf niets uit — alleen overschrijven.

Schrijf nu het Seeds Report voor ${body.companyName}.`
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

function formatReportMarkdownToHtml(report: string): string {
  return report
    .split('\n')
    .map((line) => {
      if (line.startsWith('## ')) return `<h2>${escapeHtml(line.slice(3))}</h2>`
      if (line.startsWith('### ')) return `<h3>${escapeHtml(line.slice(4))}</h3>`
      if (line === '---') return '<hr>'
      if (line.trim() === '') return ''
      const escaped = escapeHtml(line)
      const withBold = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      return `<p>${withBold}</p>`
    })
    .join('\n')
}

function buildReportHtml(body: RequestBody, report: string): string {
  const co = escapeHtml(body.companyName)
  const sector = escapeHtml(body.sector)
  const contact = escapeHtml(body.contactName ?? '')
  const email = escapeHtml(body.contactEmail ?? '')
  const bodyHtml = formatReportMarkdownToHtml(report)

  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <title>Seeds Report · ${co}</title>
  <style>
    body { margin: 0; padding: 32px 16px; background: #F9F6F0; font-family: Georgia, 'Times New Roman', serif; color: #1c1917; }
    .wrapper { max-width: 820px; margin: 0 auto; }
    .card { background: #fff; border-radius: 12px; padding: 48px 56px; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
    .brand { font-family: system-ui, sans-serif; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #2D5016; font-weight: 600; margin: 0 0 4px; }
    .meta { font-family: system-ui, sans-serif; font-size: 13px; color: #57534e; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #e7e5e4; }
    .meta p { margin: 2px 0; }
    h2 { font-size: 1.2rem; color: #2D5016; font-family: system-ui, sans-serif; margin: 28px 0 6px; }
    h3 { font-size: 1rem; font-family: system-ui, sans-serif; color: #1c1917; margin: 18px 0 4px; }
    p { font-size: 0.9375rem; line-height: 1.7; margin: 6px 0; }
    hr { border: none; border-top: 1px solid #e7e5e4; margin: 24px 0; }
    strong { color: #1c1917; }
    .footer { font-family: system-ui, sans-serif; font-size: 11px; color: #a8a29e; text-align: center; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <p class="brand">Hidden Harvest · Seeds Report</p>
      <div class="meta">
        <p><strong>${co}</strong></p>
        <p>${sector}</p>
        ${contact ? `<p>${contact}${email ? ` &middot; <a href="mailto:${email}" style="color:#2D5016">${email}</a>` : ''}</p>` : ''}
      </div>
      ${bodyHtml}
    </div>
    <p class="footer">Gemaakt voor Hidden Harvest &middot; Powered by Claude</p>
  </div>
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
    subject: `Nieuwe Seeds Report aanvraag: ${body.companyName}`,
    html: buildInternalEmailHtml(body),
    attachments: [{ filename, content: Buffer.from(reportHtml) }],
  })
}
