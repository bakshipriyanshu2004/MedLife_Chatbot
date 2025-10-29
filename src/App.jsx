import { useEffect, useMemo, useRef, useState } from 'react'
import { askGemini } from './lib/gemini'

function App() {
  const [messages, setMessages] = useState(() => ([
    { role: 'model', content: "Hey! I'm MedLife. I can help with general medical info, symptoms, or wellness tips. What would you like to ask?" }
  ]))
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, loading])

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading])

  async function handleSend() {
    const text = input.trim()
    if (!text) return
    setInput("")
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setLoading(true)
    try {
      const reply = await askGemini(next)
      setMessages(prev => [...prev, { role: 'model', content: reply || "Sorry, I couldn’t generate a response this time." }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "I ran into a problem. Please check your internet connection or API key and try again." }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSend) handleSend()
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg glass shadow-neon grid place-items-center">
              <div className="w-3 h-3 rounded-full bg-neon-blue shadow-glow"></div>
            </div>
            <div>
              <div className="text-lg font-display tracking-widest neon-text">MEDLIFE</div>
              <div className="text-xs text-white/60 -mt-1">General medical info assistant</div>
            </div>
          </div>
          <a className="text-xs text-white/60 hover:text-white transition-colors" href="https://ai.google.dev/gemini-api/" target="_blank" rel="noreferrer">Powered by Gemini</a>
        </div>
      </header>

      <main className="flex-1 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto h-[calc(100vh-200px)] sm:h-[calc(100vh-220px)] glass rounded-2xl p-3 sm:p-6 shadow-glow border-white/10">
          <div ref={listRef} className="h-full overflow-y-auto pr-1 sm:pr-2 space-y-4 sm:space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${m.role === 'user' ? 'bg-neon-purple/20 border-neon-purple/30' : 'bg-white/5 border-white/10'} border rounded-2xl px-4 py-3 max-w-[85%] sm:max-w-[70%] leading-relaxed`}> 
              <div className={`text-[11px] uppercase tracking-wider mb-1 ${m.role === 'user' ? 'text-neon-purple' : 'text-neon-blue'}`}>{m.role === 'user' ? 'You' : 'MedLife'}</div>
                  <div className="whitespace-pre-wrap text-sm sm:text-[15px] text-white/90">{m.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 max-w-[85%] sm:max-w-[70%]">
                  <div className="text-[11px] uppercase tracking-wider mb-1 text-neon-blue">MedLife</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></span>
                    <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse [animation-delay:150ms]"></span>
                    <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse [animation-delay:300ms]"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="px-3 sm:px-6 pb-5 sm:pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-2 sm:p-3 border-white/10">
            <div className="flex items-end gap-2 sm:gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask about symptoms, conditions, wellness..."
                className="flex-1 resize-none bg-transparent outline-none text-sm sm:text-base placeholder:text-white/40 px-3 py-2"
              />
              <button
                onClick={handleSend}
                disabled={!canSend}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${canSend ? 'bg-neon-purple/30 hover:bg-neon-purple/40 text-white shadow-neon border border-neon-purple/40' : 'bg-white/10 text-white/50 border border-white/10 cursor-not-allowed'}`}
              >
                Send
              </button>
            </div>
            <div className="px-3 pt-2 text-[11px] sm:text-xs text-white/50">This is not medical advice. For emergencies, call local emergency services.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
