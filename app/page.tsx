'use client'

import { useState, FormEvent } from 'react'

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
  processes: [{ ...EMPTY_PROCESS }],
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

const TOTAL_STEPS = 4

const LOADING_STEPS = [
  'Processen worden geanalyseerd...',
  'Automatiseringskansen worden berekend...',
  'ROI wordt bepaald per kans...',
  'Seeds Report wordt opgesteld...',
]

const STEP_LABELS = [
  'Wie ben jij?',
  'Hoe bereiken we je?',
  'Jullie processen',
  'Het grootste knelpunt',
]

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3.5 3.5L11.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>(INITIAL_STATE)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [animBack, setAnimBack] = useState(false)

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0: return formData.companyName.trim() !== '' && formData.contactName.trim() !== ''
      case 1: return formData.contactEmail.trim() !== '' && formData.sector !== ''
      case 2: return formData.processes.every(p => p.description.trim() !== '' && p.hoursPerWeek > 0 && p.peopleInvolved >= 1)
      case 3: return formData.painPoint.trim() !== ''
      default: return false
    }
  }

  const goNext = () => {
    setAnimBack(false)
    setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS - 1))
  }

  const goPrev = () => {
    setAnimBack(true)
    setCurrentStep(s => Math.max(s - 1, 0))
  }

  const updateProcess = (index: number, field: keyof Process, value: string | number) => {
    const newProcesses = [...formData.processes]
    newProcesses[index] = { ...newProcesses[index], [field]: value }
    setFormData({ ...formData, processes: newProcesses })
  }

  const addProcess = () => {
    setFormData({ ...formData, processes: [...formData.processes, { ...EMPTY_PROCESS }] })
  }

  const removeProcess = (index: number) => {
    setFormData({ ...formData, processes: formData.processes.filter((_, i) => i !== index) })
  }

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault()
    setLoading(true)
    setLoadingStep(0)
    setError(null)

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
      await res.json()
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-harvest-cream py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-harvest-green rounded-2xl p-10 md:p-14 text-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-8">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                <path d="M4 13l6 6L22 5" stroke="#F9F6F0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-5">
              Hidden Harvest
            </p>
            <h1 className="font-display text-3xl font-bold text-harvest-cream leading-snug mb-4">
              Bedankt voor<br />je aanvraag
            </h1>
            <p className="text-white/60 text-sm leading-relaxed mb-10">
              We hebben je gegevens ontvangen en sturen je binnenkort een persoonlijk Seeds Report.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false)
                setError(null)
                setFormData(INITIAL_STATE)
                setCurrentStep(0)
              }}
              className="px-6 py-2.5 bg-harvest-cream text-harvest-green font-semibold text-sm rounded-xl hover:bg-white transition"
            >
              Nieuwe aanvraag
            </button>
          </div>
          <p className="text-center text-[11px] text-stone-400 mt-6">
            Gemaakt voor Hidden Harvest · Powered by Claude
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-harvest-cream py-12 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <header className="text-center mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-harvest-green mb-4">
            Hidden Harvest
          </p>
          <h1 className="font-display text-[44px] font-bold text-stone-900 leading-none mb-5">
            Seeds Report
          </h1>
          <button
            type="button"
            onClick={() => setFormData(DEMO_DATA)}
            className="text-[11px] text-stone-400 border border-stone-200 rounded-lg px-3 py-1.5 hover:border-stone-400 hover:text-stone-600 transition"
          >
            Demo invullen →
          </button>
        </header>

        {/* Step progress */}
        <div className="flex items-center justify-center mb-10 gap-0">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  i < currentStep
                    ? 'bg-harvest-green-light text-white'
                    : i === currentStep
                    ? 'bg-harvest-green text-white ring-4 ring-harvest-green/10'
                    : 'bg-stone-100 text-stone-400'
                }`}
              >
                {i < currentStep ? (
                  <CheckIcon />
                ) : (
                  <span className="font-mono">{i + 1}</span>
                )}
              </div>
              {i < 3 && (
                <div
                  className={`w-14 h-px transition-colors duration-500 ${
                    i < currentStep ? 'bg-harvest-green-light' : 'bg-stone-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Animated step card */}
        <div key={currentStep} className={animBack ? 'step-enter-back' : 'step-enter'}>
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">

            {/* Card header */}
            <div className="px-8 pt-8 pb-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-harvest-green-light mb-2.5">
                Stap {currentStep + 1} / {TOTAL_STEPS} — {STEP_LABELS[currentStep]}
              </p>

              {currentStep === 0 && (
                <>
                  <h2 className="font-display text-[26px] font-bold text-stone-900 leading-tight mb-1.5">
                    Laten we beginnen!!
                  </h2>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    Wie ben jij en voor welk bedrijf doe je dit?
                  </p>
                </>
              )}
              {currentStep === 1 && (
                <>
                  <h2 className="font-display text-[26px] font-bold text-stone-900 leading-tight mb-1.5">
                    Hoe kunnen we je bereiken?
                  </h2>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    Je e-mail en sector helpen ons het rapport te personaliseren.
                  </p>
                </>
              )}
              {currentStep === 2 && (
                <>
                  <h2 className="font-display text-[26px] font-bold text-stone-900 leading-tight mb-1.5">
                    Jullie handmatige processen
                  </h2>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    Welke taken kosten jullie nu het meeste tijd?
                  </p>
                </>
              )}
              {currentStep === 3 && (
                <>
                  <h2 className="font-display text-[26px] font-bold text-stone-900 leading-tight mb-1.5">
                    Tot slot
                  </h2>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    Wat is jullie grootste pijnpunt op dit moment?
                  </p>
                </>
              )}
            </div>

            <div className="h-px bg-stone-100" />

            {/* Form fields */}
            <div className="px-8 py-7">

              {currentStep === 0 && (
                <div className="space-y-5">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-stone-500 mb-2">
                      Jouw naam
                    </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-harvest-green focus:bg-white transition"
                      placeholder="Sanne de Vries"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-stone-500 mb-2">
                      Bedrijfsnaam
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-harvest-green focus:bg-white transition"
                      placeholder="FreshMeals BV"
                    />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-stone-500 mb-2">
                      E-mailadres
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-harvest-green focus:bg-white transition"
                      placeholder="sanne@bedrijf.nl"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-stone-500 mb-2">
                      Sector
                    </label>
                    <select
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 text-stone-800 text-sm focus:outline-none focus:border-harvest-green focus:bg-white transition appearance-none cursor-pointer"
                    >
                      <option value="">Kies een sector</option>
                      {SECTORS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-3">
                  {formData.processes.map((_, i) => (
                    <div key={i} className="border border-stone-100 rounded-xl p-4 bg-stone-50/60">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-stone-400">
                          Proces {i + 1}
                        </span>
                        {formData.processes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProcess(i)}
                            className="text-xs text-stone-300 hover:text-red-400 transition"
                          >
                            Verwijderen
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <textarea
                          value={formData.processes[i].description}
                          onChange={(e) => updateProcess(i, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2.5 border border-stone-200 rounded-lg bg-white text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-harvest-green transition resize-none"
                          placeholder="Wat doe je nu handmatig? bv. klachtenmails beantwoorden..."
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-mono text-[9px] uppercase tracking-[0.15em] text-stone-400 mb-1.5">
                              Uren / week
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={formData.processes[i].hoursPerWeek || ''}
                              onChange={(e) => updateProcess(i, 'hoursPerWeek', Number(e.target.value))}
                              className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white text-stone-800 text-sm focus:outline-none focus:border-harvest-green transition"
                              placeholder="8"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[9px] uppercase tracking-[0.15em] text-stone-400 mb-1.5">
                              Aantal mensen
                            </label>
                            <input
                              type="number"
                              min={1}
                              value={formData.processes[i].peopleInvolved || ''}
                              onChange={(e) => updateProcess(i, 'peopleInvolved', Number(e.target.value))}
                              className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white text-stone-800 text-sm focus:outline-none focus:border-harvest-green transition"
                              placeholder="2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addProcess}
                    className="w-full py-2.5 border border-dashed border-stone-200 rounded-xl text-stone-400 text-sm hover:border-harvest-green hover:text-harvest-green transition"
                  >
                    + Proces toevoegen
                  </button>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <textarea
                    rows={5}
                    value={formData.painPoint}
                    onChange={(e) => setFormData({ ...formData, painPoint: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-harvest-green focus:bg-white transition resize-none"
                    placeholder="We groeien snel maar het team verzuipt in administratie..."
                  />
                  {error && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Navigation */}
            <div className="px-8 pb-8">
              {currentStep === 3 && loading ? (
                <div className="flex flex-col items-center gap-3 py-3">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-harvest-green animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                  <p className="font-mono text-[11px] text-stone-400 tracking-wide">
                    {LOADING_STEPS[loadingStep]}
                  </p>
                </div>
              ) : (
                <div className={`flex items-center ${currentStep === 0 ? 'justify-end' : 'justify-between'}`}>
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={goPrev}
                      className="text-sm text-stone-400 hover:text-stone-700 transition font-medium px-1"
                    >
                      ← Terug
                    </button>
                  )}
                  {currentStep < TOTAL_STEPS - 1 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!canProceed()}
                      className="px-7 py-2.5 bg-harvest-green text-white text-sm font-semibold rounded-xl hover:bg-green-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      Volgende →
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!canProceed()}
                      onClick={() => handleSubmit()}
                      className="px-7 py-2.5 bg-harvest-green text-white text-sm font-semibold rounded-xl hover:bg-green-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      Genereer Seeds Report →
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        <p className="text-center font-mono text-[10px] text-stone-400 tracking-wide mt-8">
          Gemaakt voor Hidden Harvest · Powered by Claude
        </p>
      </div>
    </main>
  )
}
