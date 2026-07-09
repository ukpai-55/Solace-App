import { useState, useRef, useEffect, useCallback } from "react";

const SYSTEM_PROMPT = `You are Solace — a warm, deeply knowledgeable AI mental health companion available to anyone, anywhere in the world, for free. You are not a licensed therapist or doctor and never claim to be. But you are trained in the world's most effective evidence-based therapeutic approaches.

CORE PRINCIPLES:
— Always lead with empathy. Acknowledge the feeling before anything else.
— Ask only one thoughtful question at a time.
— Keep responses warm and concise — 2 to 4 sentences. Leave space for the person to speak.
— Never diagnose or prescribe.
— Be human. Use "I" naturally.

THERAPEUTIC APPROACH:
— Use CBT: gently notice all-or-nothing thinking, catastrophizing, personalization. Help people examine evidence for beliefs through questions, never lectures.
— Use DBT: hold two truths at once — "this pain is real AND it will pass." Offer grounding when overwhelmed: name 5 things you see, 4 you can touch, 3 sounds you hear.
— Use ACT: thoughts are not facts. Help people step back — "I'm noticing the thought that I'm worthless" vs "I am worthless."
— Use Motivational Interviewing: reflect twice before asking anything. Draw out the person's own wisdom.

CULTURAL AWARENESS:
— Africa: faith, community, and family are genuine healing sources. Respect them deeply. Stigma is heavy — approach with extra gentleness.
— Asia: emotional restraint may be strength. Ask about physical symptoms as doorways to emotions.
— Latin America: family is central to healing. Warmth and personal connection matter deeply.
— Middle East: faith is often the primary framework. Respect this completely.
— All cultures: never pathologize spiritual beliefs or community healing practices.

HOW TO OFFER SOLUTIONS:
— Earn the right first by listening fully. Ask permission: "Can I share something that might help?"
— One small specific thing — never a list.
— Ground it in what they told you. Generic advice bounces off. Personal advice lands.
— The smallest viable step. Meet people inside the window of what feels possible to them.

SITUATION-SPECIFIC:
— Anxiety: ground them in the present. Explore what is and isn't in their control. Box breathing: in 4, hold 4, out 4.
— Depression: sit with them first. Never rush to brighten. Ask about one tiny moment that wasn't entirely bad. One small opposite action.
— Grief: do not try to fix it. Be present. Honor what was lost. Grief has no timeline.
— Loneliness: be genuinely present. One tiny reach toward connection. Contribution helps.
— Shame: respond with warmth — shame cannot survive empathy. "A lot of people feel that way."
— Anger: validate first, then explore what's underneath — usually hurt or fear.

CRISIS: If someone mentions suicide or self-harm — respond with deep compassion first, then: "Please reach out now — visit findahelpline.com for a crisis line in your country, or call 988 (US/Canada)."

NEVER: agree someone is worthless or hopeless. Use toxic positivity. Rush past pain. Give more than one question per response. Moralize or preach.

LANGUAGE: Respond in whatever language the user writes in. Be culturally warm and appropriate for that language community.`;

const CRISIS_WORDS = ["suicide","kill myself","end my life","self-harm","want to die","hurt myself","no reason to live","not worth living","take my life"];

export default function App() {
  const [screen, setScreen]     = useState("welcome");
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [crisis, setCrisis]     = useState(false);
  const [online, setOnline]     = useState(navigator.onLine);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const taRef     = useRef(null);

  useEffect(() => {
    const up = () => setOnline(true);
    const dn = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", dn);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", dn); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasCrisis = (t) => CRISIS_WORDS.some(w => t.toLowerCase().includes(w));

  const send = useCallback(async (text) => {
    if (!text?.trim() || loading || !online) return;
    const msg = text.trim();
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
    if (hasCrisis(msg)) setCrisis(true);

    const history = [...messages, { role: "user", content: msg }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setLoading(true);

    try {
      const geminiContents = [
        { role: "user",  parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood. I am Solace, here to listen." }] },
        ...history.slice(-16).map(m => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }))
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: geminiContents })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") continue;
          try {
            const j   = JSON.parse(raw);
            const txt = j.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (txt) {
              setMessages(prev => {
                const u = [...prev];
                u[u.length - 1] = { ...u[u.length - 1], content: u[u.length - 1].content + txt };
                return u;
              });
            }
          } catch { /* ignore parse errors */ }
        }
      }
    } catch (err) {
      setMessages(prev => {
        const u = [...prev];
        u[u.length - 1] = { role: "assistant", content: "Something went wrong. Please try again." };
        return u;
      });
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [messages, loading, online]);

  const startChat = () => {
    setScreen("chat");
    setMessages([{ role: "assistant", content: "Hi, I'm glad you found your way here.\n\nThis is a quiet, private space — just for you. No rush, no judgment.\n\nHow are you feeling right now?" }]);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const reset = () => { setMessages([]); setCrisis(false); setScreen("welcome"); };

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0A0C12; -webkit-font-smoothing: antialiased; }
    .f  { font-family: 'Inter', sans-serif; }
    .fl { font-family: 'DM Serif Display', serif; }

    /* WELCOME */
    .wr { min-height: 100svh; background: #0A0C12; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2.5rem 1.5rem; gap: 0; }
    .logo { font-size: 58px; color: #E3E1F0; letter-spacing: -2px; line-height: 1; margin-bottom: 10px; }
    .logo span { color: #7B6EE8; }
    .tagline { font-size: 16px; color: #8888A8; text-align: center; line-height: 1.75; margin-bottom: 32px; }
    .feats { display: flex; flex-direction: column; gap: 10px; margin-bottom: 36px; width: 100%; max-width: 300px; }
    .feat { display: flex; align-items: center; gap: 10px; color: #525270; font-size: 13.5px; }
    .fdot { width: 5px; height: 5px; border-radius: 50%; background: #52C4A0; flex-shrink: 0; }
    .start { background: #7B6EE8; color: #fff; border: none; padding: 14px 48px; border-radius: 100px; font-size: 15px; font-weight: 500; cursor: pointer; font-family: inherit; transition: opacity .15s; }
    .start:hover { opacity: .86; }
    .disc { font-size: 11.5px; color: #28283C; text-align: center; max-width: 270px; margin-top: 20px; line-height: 1.7; }

    /* CHAT */
    .cr { height: 100svh; background: #0A0C12; display: flex; flex-direction: column; max-width: 700px; margin: 0 auto; }
    .hd { padding: 13px 16px; border-bottom: 1px solid #1C1E2E; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
    .hl { font-size: 24px; color: #E3E1F0; }
    .hl span { color: #7B6EE8; }
    .hr { display: flex; align-items: center; gap: 8px; }
    .hst { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #52C4A0; }
    .sd { width: 6px; height: 6px; border-radius: 50%; background: #52C4A0; }
    .sd.p { animation: pulse 1.8s ease-in-out infinite; }
    .sd.off { background: #555; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.2} }
    .nbtn { font-size: 12px; color: #3A3A58; border: 1px solid #1C1E2E; background: transparent; padding: 5px 10px; border-radius: 100px; cursor: pointer; font-family: inherit; transition: color .15s; }
    .nbtn:hover { color: #8888A8; }
    .cbar { background: #160D20; border-bottom: 1px solid #3A1D50; padding: 10px 16px; font-size: 13px; color: #C090E8; line-height: 1.65; flex-shrink: 0; }
    .cbar a { color: #A070D0; }
    .offbar { background: #1A0D0D; border-bottom: 1px solid #3A1D20; padding: 8px 16px; font-size: 12px; color: #E87B7B; text-align: center; flex-shrink: 0; }
    .msgs { flex: 1; overflow-y: auto; padding: 20px 16px 8px; display: flex; flex-direction: column; gap: 12px; }
    .msgs::-webkit-scrollbar { width: 3px; }
    .msgs::-webkit-scrollbar-thumb { background: #202238; border-radius: 2px; }
    .bw { display: flex; animation: fadeUp .22s ease both; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    .bw.u { justify-content: flex-end; }
    .bl { max-width: 82%; padding: 11px 15px; font-size: 15px; line-height: 1.72; white-space: pre-wrap; word-break: break-word; }
    .bl.u { background: #282543; color: #E0DEED; border-radius: 18px 18px 4px 18px; }
    .bl.a { background: #11131C; color: #D4D2EA; border-radius: 18px 18px 18px 4px; border: 1px solid #1C1E2E; }
    .dots { display: flex; gap: 5px; padding: 2px 0; }
    .dots span { width: 7px; height: 7px; border-radius: 50%; background: #2A2C48; animation: bob 1.1s ease-in-out infinite; }
    .dots span:nth-child(2) { animation-delay: .18s; }
    .dots span:nth-child(3) { animation-delay: .36s; }
    @keyframes bob { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
    .cur { display: inline-block; width: 2px; height: 15px; background: #7B6EE8; margin-left: 2px; vertical-align: middle; animation: blink .75s step-end infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    .qs { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 16px 10px; }
    .qb { font-size: 13px; color: #8888A8; border: 1px solid #1C1E2E; background: transparent; padding: 8px 13px; border-radius: 100px; cursor: pointer; font-family: inherit; transition: all .15s; }
    .qb:hover { border-color: #7B6EE8; color: #E3E1F0; }
    .ia { padding: 10px 16px 16px; border-top: 1px solid #1C1E2E; flex-shrink: 0; display: flex; gap: 8px; align-items: flex-end; }
    .iw { flex: 1; background: #11131C; border: 1px solid #222336; border-radius: 16px; padding: 11px 14px; transition: border-color .15s; }
    .iw:focus-within { border-color: #3A3562; }
    .iw textarea { width: 100%; background: transparent; border: none; outline: none; color: #E3E1F0; font-size: 15px; font-family: inherit; resize: none; line-height: 1.55; max-height: 110px; }
    .iw textarea::placeholder { color: #383858; }
    .sbtn { width: 42px; height: 42px; border-radius: 50%; background: #7B6EE8; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: opacity .15s, transform .1s; }
    .sbtn:hover:not(:disabled) { opacity: .84; }
    .sbtn:active:not(:disabled) { transform: scale(.95); }
    .sbtn:disabled { opacity: .28; cursor: not-allowed; }
    .foot { text-align: center; font-size: 11px; color: #242438; padding: 2px 16px 10px; flex-shrink: 0; }
  `;

  const QUICK_STARTS = [
    "I've been feeling really anxious lately",
    "I'm going through something hard right now",
    "I just need someone to talk to",
    "I've been feeling really low"
  ];

  if (screen === "welcome") return (
    <>
      <style>{CSS}</style>
      <div className="wr f">
        <div className="logo fl">Solace<span>.</span></div>
        <p className="tagline">A quiet space to talk,<br/>whenever you need it.</p>
        <div className="feats">
          {["Available to anyone, anywhere in the world", "No appointments. No waiting rooms.", "Private and judgment-free", "Responds in your language"].map((f, i) => (
            <div key={i} className="feat"><span className="fdot"/>{f}</div>
          ))}
        </div>
        <button className="start f" onClick={startChat}>Start talking</button>
        <p className="disc f">Solace is an AI companion, not a licensed therapist. If you're in crisis, please contact a crisis line immediately.</p>
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="cr f">
        <div className="hd">
          <span className="hl fl">Solace<span>.</span></span>
          <div className="hr">
            <div className="hst">
              <span className={`sd${!online?" off":loading?" p":""}`}/>
              <span style={{color:!online?"#E87B7B":undefined}}>{!online?"offline":loading?"listening…":"here for you"}</span>
            </div>
            <button className="nbtn f" onClick={reset}>New chat</button>
          </div>
        </div>

        {!online && <div className="offbar f">You appear to be offline. Check your connection.</div>}

        {crisis && (
          <div className="cbar f">
            You matter, and you're not alone. Please reach out now — <a href="https://findahelpline.com" target="_blank" rel="noreferrer">findahelpline.com</a> has a crisis line for every country.
          </div>
        )}

        <div className="msgs">
          {messages.map((msg, i) => {
            const isLast    = i === messages.length - 1;
            const thinking  = isLast && loading && msg.role === "assistant" && msg.content === "";
            const streaming = isLast && loading && msg.role === "assistant" && msg.content !== "";
            return (
              <div key={i} className={`bw${msg.role === "user" ? " u" : ""}`}>
                <div className={`bl${msg.role === "user" ? " u" : " a"}`}>
                  {thinking
                    ? <div className="dots"><span/><span/><span/></div>
                    : <>{msg.content}{streaming && <span className="cur"/>}</>
                  }
                </div>
              </div>
            );
          })}
          <div ref={bottomRef}/>
        </div>

        {messages.length <= 1 && (
          <div className="qs">
            {QUICK_STARTS.map((q, i) => (
              <button key={i} className="qb f" onClick={() => send(q)}>{q}</button>
            ))}
          </div>
        )}

        <div className="ia">
          <div className="iw">
            <textarea
              ref={el => { inputRef.current = el; taRef.current = el; }}
              rows={1}
              placeholder="What's on your mind…"
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 110) + "px";
              }}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              disabled={loading}
            />
          </div>
          <button className="sbtn" onClick={() => send(input)} disabled={loading || !input.trim() || !online} aria-label="Send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/>
            </svg>
          </button>
        </div>

        <div className="foot f">Solace is an AI companion, not a licensed therapist. In a crisis, please contact a helpline.</div>
      </div>
    </>
  );
}
