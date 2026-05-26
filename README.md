# Hidden Harvest · Seeds Report

Een aanvraagformulier waarbij een potentiële klant zijn handmatige bedrijfsprocessen invult. Na het insturen genereert Claude (Anthropic) een gepersonaliseerd concept "Seeds Report" met automatiseringskansen. Dit rapport wordt als HTML-bijlage intern naar Hidden Harvest gemaild via Resend. Hidden Harvest reviewt het rapport en stuurt het daarna zelf naar de klant — het rapport verschijnt dus bewust niet in de browser.

## Setup

### 1. Installeer Node.js (v20 of hoger)
Download van https://nodejs.org/ (LTS-versie). Sluit en heropen je terminal na installatie.

### 2. Anthropic API-key
- Maak een account op https://console.anthropic.com/
- Maak een API-key aan en voeg tegoed toe bij Billing

### 3. Resend API-key
- Maak een account op https://resend.com/
- Maak een API-key aan onder **API Keys**
- Verifieer je afzenderdomein (of gebruik `onboarding@resend.dev` als testafzender)

### 4. Omgevingsvariabelen
Maak in deze projectmap een bestand `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-jouw-echte-key
RESEND_API_KEY=re_jouw-echte-key
LEAD_NOTIFY_TO=naam@hiddenharvest.nl
LEAD_NOTIFY_FROM=Hidden Harvest <onboarding@resend.dev>
```

`LEAD_NOTIFY_TO` mag meerdere adressen bevatten, kommagescheiden.

### 5. Dependencies + dev-server
```powershell
npm install
npm run dev:env
```
Open http://localhost:3000 (Next.js gebruikt 3001 als 3000 bezet is).

**Windows-tip:** gebruik `npm run dev:env` in plaats van `npm run dev`. Het laadt `.env.local` handmatig via `run-dev.ps1` — een workaround voor een Next.js-issue op Windows waarbij env-vars soms niet automatisch worden ingelezen.

## Live zetten (Vercel)
```
npm install -g vercel
vercel deploy
```
Zet de volgende environment variables in het Vercel-dashboard:
- `ANTHROPIC_API_KEY`
- `RESEND_API_KEY`
- `LEAD_NOTIFY_TO`
- `LEAD_NOTIFY_FROM`

## Architectuur
- **Human-in-the-loop flow:** bezoeker vraagt aan → Claude genereert concept → Hidden Harvest ontvangt rapport als HTML-bijlage per mail → Hidden Harvest stuurt zelf het definitieve rapport naar de klant.
- **Deterministische math:** alle rekenwerk gebeurt in `app/api/generate-report/route.ts` in JavaScript. Claude doet alleen tekst.
- **27-combinatie lookup-tabel:** voorkomt optelfouten in de samenvatting.
- **Integer rounding:** bespaarde uren als gehele getallen, rest via aftrekking. Visuele math klopt altijd.
- **3 scenario-niveaus:** A=conservatief 70%, B=realistisch 85%, C=ambitieus 95%.
- **Demo-modus:** zonder API-key levert de app een mock-rapport dat intern gemaild wordt.

## Demo-data
Bedrijfsnaam: FreshMeals BV · Sector: E-commerce · Naam contactpersoon: Sanne de Vries · E-mailadres: sanne@freshmeals.example · Processen: klachten-/bestelmails (12u, 2 mensen), voorraad in Excel (8u, 1 persoon), facturen in Word (5u, 1 persoon).

## Troubleshooting

**Geen mail ontvangen na aanvraag**
- Controleer of `RESEND_API_KEY` correct is ingesteld in `.env.local`.
- Controleer of `LEAD_NOTIFY_TO` een geldig e-mailadres bevat.
- Verifieer in het Resend-dashboard of het afzenderdomein of -adres gevalideerd is.

**Foutmelding over `LEAD_NOTIFY_TO`**
De omgevingsvariabele ontbreekt of is leeg. Voeg minimaal één intern e-mailadres toe aan `.env.local`.

**Foutmelding over `RESEND_API_KEY`**
De omgevingsvariabele ontbreekt. Voeg een geldige Resend API-key toe aan `.env.local`.

**Rapport verschijnt niet in de browser**
Dit is bewust. Na een succesvolle aanvraag ziet de bezoeker alleen een bedankpagina. Het gegenereerde rapport gaat als HTML-bijlage intern naar Hidden Harvest, zodat het eerst gecontroleerd en gepersonaliseerd kan worden voordat het naar de klant gaat.
