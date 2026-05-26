'use client'

import { useState, FormEvent, ReactNode } from 'react'

type Process = {
  description: string
  hoursPerWeek: number
  peopleInvolved: number
}

type FormData = {
  companyName: string
  contactName: string
  contactEmail: string
  sector: string
  processes: Process[]
  painPoint: string
}

const SECTORS = [
  'E-commerce',
  'Zorg',
  'Recruitment / HR',
  'SaaS',
  'MKB / Dienstverlening',
  'Retail',
  'Productie',
  'Overig',
]

const EMPTY_PROCESS: Process = { description: '', hoursPerWeek: 0, peopleInvolved: 1 }

const INITIAL_STATE: FormData = {
  companyName: '',
  contactName: '',
  contactEmail: '',
  sector: '',
  processes: [{ ...EMPTY_PROCESS }, { ...EMPTY_PROCESS }, { ...EMPTY_PROCESS }],
  painPoint: '',
}

const DEMO_DATA: FormData = {
  companyName: 'FreshMeals BV',
  contactName: 'Sanne de Vries',
  contactEmail: 'sanne@freshmeals.example',
  sector: 'E-commerce',
  processes: [
    {
      description: 'Klachten- en bestelmails handmatig beantwoorden',
      hoursPerWeek: 12,
      peopleInvolved: 2,
    },
    {
      description: 'Voorraad bijhouden in Excel en handmatig bijwerken in webshop',
      hoursPerWeek: 8,
      peopleInvolved: 1,
    },
    {
      description: 'Facturen handmatig opmaken in Word en versturen',
      hoursPerWeek: 5,
      peopleInvolved: 1,
    },
  ],
  painPoint:
    'We groeien snel, maar het team verzuipt in administratie. Klanten wachten te lang op antwoorden en we maken regelmatig fouten bij de voorraad.',
}

const LOADING_STEPS = [
  'Processen worden geanalyseerd...',
  'Automatiseringskansen worden berekend...',
  'ROI wordt bepaald per kans...',
  'Seeds Report wordt opgesteld...',
]

export default function Home() {
  const [formData, setFormData] = useState<FormData>(INITIAL_STATE)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [report, setReport] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const updateProcess = (index: number, field: keyof Process, value: string | number) => {
    const newProcesses = [...formData.processes]
    newProcesses[index] = { ...newProcesses[index], [field]: value }
    setFormData({ ...formData, processes: newProcesses })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLoadingStep(0)
    setError(null)
    setReport(null)

    const interval = setInterval(() => {
      setLoadingStep((prev) => Math.min(prev + 1, LOADING_STEPS.length - 1))
    }, 2200)

    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Er ging iets mis bij het genereren.')
      }
      const data = await res.json()
      setReport(data.report)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  if (report) {
    return (
      <ReportView
        report={report}
        formData={formData}
        onReset={() => {
          setReport(null)
          setError(null)
          setFormData(INITIAL_STATE)
        }}
      />
    )
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-harvest-green font-semibold mb-3">
            Hidden Harvest
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-3">Seeds Report</h1>
          <p className="text-stone-600 max-w-md mx-auto leading-relaxed">
            Vul je grootste handmatige processen in. Onze AI vindt binnen een minuut waar
            automatisering jou de meeste tijd oplevert.
          </p>
          <button
            type="button"
            onClick={() => setFormData(DEMO_DATA)}
            className="mt-4 text-xs text-stone-500 border border-stone-300 rounded-md px-3 py-1.5 hover:bg-stone-100 transition"
          >
            Demo invullen →
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 md:p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Bedrijfsnaam</label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-3 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-harvest-green focus:border-transparent transition"
              placeholder="bv. FreshMeals BV"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Naam contactpersoon</label>
            <input
              type="text"
              required
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="w-full px-3 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-harvest-green focus:border-transparent transition"
              placeholder="bv. Sanne de Vries"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">E-mailadres</label>
            <input
              type="email"
              required
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-3 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-harvest-green focus:border-transparent transition"
              placeholder="bv. sanne@bedrijf.nl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Sector</label>
            <select
              required
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              className="w-full px-3 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-harvest-green focus:border-transparent transition bg-white"
            >
              <option value="">— Kies een sector —</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-stone-700">
              Drie processen die nu veel tijd kosten
            </p>
            {[0, 1, 2].map((i) => (
              <div key={i} className="border border-stone-200 rounded-md p-4 bg-stone-50/50">
                <p className="font-semibold text-stone-800 mb-3 text-sm">Proces {i + 1}</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-stone-600 mb-1">
                      Wat doe je nu handmatig?
                    </label>
                    <textarea
                      required
                      value={formData.processes[i].description}
                      onChange={(e) => updateProcess(i, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-harvest-green transition text-sm"
                      placeholder="bv. Klachtenmails beantwoorden, voorraad bijhouden..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Uren per week</label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={formData.processes[i].hoursPerWeek || ''}
                        onChange={(e) => updateProcess(i, 'hoursPerWeek', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-harvest-green transition text-sm"
                        placeholder="bv. 8"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Aantal mensen</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={formData.processes[i].peopleInvolved || ''}
                        onChange={(e) =>
                          updateProcess(i, 'peopleInvolved', Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-harvest-green transition text-sm"
                        placeholder="bv. 2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Wat is je grootste pijnpunt?
            </label>
            <textarea
              required
              value={formData.painPoint}
              onChange={(e) => setFormData({ ...formData, painPoint: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-harvest-green transition"
              placeholder="bv. We groeien snel maar het team verzuipt in administratie..."
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="w-full py-5 flex flex-col items-center gap-4">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-harvest-green animate-bounce"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </div>
              <p className="text-sm text-stone-500 transition-all duration-500">
                {LOADING_STEPS[loadingStep]}
              </p>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-3 bg-harvest-green text-white font-semibold rounded-md hover:bg-green-900 transition"
            >
              Genereer Seeds Report
            </button>
          )}
        </form>

        <p className="text-center text-xs text-stone-500 mt-6">
          Gemaakt voor Hidden Harvest · Powered by Claude
        </p>
      </div>
    </main>
  )
}

function ReportView({
  report,
  formData,
  onReset,
}: {
  report: string
  formData: FormData
  onReset: () => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen py-12 px-4 print:py-0 print:px-0">
      <div className="max-w-3xl mx-auto">
        <article className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 md:p-12 print:shadow-none print:border-0 print:rounded-none">
          <header className="mb-8 pb-6 border-b border-stone-200">
            <p className="text-xs uppercase tracking-widest text-harvest-green font-semibold mb-2 print:text-black">
              Hidden Harvest · Seeds Report
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900">
              {formData.companyName}
            </h1>
            <p className="text-stone-500 mt-1">{formData.sector}</p>
          </header>

          <FormattedReport text={report} />

          <footer className="mt-12 pt-6 border-t border-stone-200 flex flex-wrap gap-3 print:hidden">
            <button
              onClick={onReset}
              className="px-4 py-2.5 bg-stone-100 text-stone-700 rounded-md hover:bg-stone-200 transition text-sm"
            >
              ← Nieuw rapport
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-stone-100 text-stone-700 rounded-md hover:bg-stone-200 transition text-sm"
            >
              {copied ? '✓ Gekopieerd' : 'Kopieer tekst'}
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-stone-100 text-stone-700 rounded-md hover:bg-stone-200 transition text-sm"
            >
              Opslaan als PDF
            </button>
            <a
              href="https://hiddenharvest.nl/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-harvest-green text-white rounded-md hover:bg-green-900 transition text-sm font-medium ml-auto"
            >
              Plan een Field Discovery →
            </a>
          </footer>
        </article>
      </div>
    </main>
  )
}

function FormattedReport({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-3 text-stone-800 leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return (
            <h2 key={i} className="text-2xl font-bold text-stone-900 mt-8 mb-2 first:mt-0">
              {line.slice(3)}
            </h2>
          )
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={i} className="text-lg font-semibold text-harvest-green mt-6 mb-1">
              {line.slice(4)}
            </h3>
          )
        }
        if (line.trim() === '') {
          return <div key={i} className="h-1" />
        }
        return (
          <p key={i} className="text-stone-700 text-sm md:text-base">
            {renderInlineBold(line)}
          </p>
        )
      })}
    </div>
  )
}

function renderInlineBold(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-stone-900">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}
