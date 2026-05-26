# Hidden Harvest · Seeds Report Generator

Een webformulier waar een potentiële klant zijn handmatige bedrijfsprocessen invult, waarna Claude (Anthropic) automatisch een gepersonaliseerd "Seeds Report" genereert met automatiseringskansen.

## Setup

### 1. Installeer Node.js (v20 of hoger)
Download van https://nodejs.org/ (LTS-versie). Sluit en heropen je terminal na installatie.

### 2. Anthropic API-key
- Maak een account op https://console.anthropic.com/
- Maak een API-key aan en voeg tegoed toe bij Billing
- Maak in deze projectmap een bestand `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-jouw-echte-key
```

### 3. Dependencies + dev-server
```powershell
npm install
npm run dev:env
```
Open http://localhost:3000 (of 3001 als 3000 bezet is).

**Windows-tip:** gebruik `npm run dev:env` in plaats van `npm run dev`. Het laadt `.env.local` handmatig via `run-dev.ps1` — een workaround voor een Next.js-issue op Windows waarbij env-vars soms niet automatisch worden ingelezen.

## Live zetten (Vercel)
```
npm install -g vercel
vercel deploy
```
Zet `ANTHROPIC_API_KEY` als environment variable in het Vercel-dashboard.

## Architectuur
- **Deterministische math:** alle rekenwerk gebeurt in `app/api/generate-report/route.ts` in JavaScript. Claude doet alleen tekst.
- **27-combinatie lookup-tabel:** voorkomt optelfouten in de samenvatting.
- **Integer rounding:** bespaarde uren als gehele getallen, rest via aftrekking. Visuele math klopt altijd.
- **3 scenario-niveaus:** A=conservatief 70%, B=realistisch 85%, C=ambitieus 95%.
- **Demo-modus:** zonder API-key levert de app een mock-rapport.

## Demo-data
Bedrijfsnaam: FreshMeals BV · Sector: E-commerce · Processen: klachten-/bestelmails (12u, 2 mensen), voorraad in Excel (8u, 1 persoon), facturen in Word (5u, 1 persoon).
