import { useState, useRef, useEffect, useCallback } from "react";

/* ──import─ LANGUAGES ─────────────────────────────────────────────────────────────*/
const LANGS = {
en:  { name:"English",      native:"English",      dir:"ltr", flag:"🇬🇧",
  tagline:"A quiet space to talk,\nwhenever you need it.",
  features:["Available to anyone, anywhere in the world","No appointments. No waiting rooms.","Private and judgment-free","Responds in your language"],
  startBtn:"Start talking", placeholder:"What's on your mind…", hereForYou:"here for you",
  listening:"listening…", newChat:"New chat", namePrompt:"What should I call you?",
  nameHint:"Optional — just for our conversation", nameSkip:"Skip",
  moodPrompt:"How are you feeling right now?", onboardTitle:"Before we begin",
  moodLabels:["Good","Okay","Anxious","Down","Sad","Overwhelmed"],
  quickStarts:["I've been feeling really anxious lately","I'm going through something hard","I just need someone to talk to","I've been feeling really low"],
  crisisBar:"You matter and you're not alone. Visit findahelpline.com for a crisis line in your country.",
  disc:"Solace is an AI companion, not a licensed therapist. If you're in crisis, contact a crisis line immediately.",
  footer:"Solace is an AI companion, not a licensed therapist.",
  first:"Hi, I'm glad you found your way here.\n\nThis is a quiet, private space — just for you. No rush, no judgment.\n\nHow are you feeling right now?",
  breatheBtn:"Breathe", breatheGuide:"Follow the circle. Breathe with it.",
  breatheIn:"Breathe in", breatheHold:"Hold", breatheOut:"Breathe out", breatheRest:"Rest",
  breatheDone:"Well done. How do you feel now?", breatheClose:"Close",
  offline:"You appear to be offline.", retryBtn:"Try again", tryAgain:"Something went wrong. Try again?",
},
ig:  { name:"Igbo",         native:"Igbo",         dir:"ltr", flag:"🇳🇬",
  tagline:"Ebe dị jụụ iji kwuo okwu,\nmgbe ọ bụla ịchọọ ya.",
  features:["Dị ndụ n'ụwa niile","Enweghị njikọ","Nzuzo na enweghị ikpe","Na-aza n'asụsụ gị"],
  startBtn:"Malite ikwu okwu", placeholder:"Gịnị dị n'uche gị…", hereForYou:"ebe a maka gị",
  listening:"na-ege ntị…", newChat:"Ọkọnverseshọn ọhụrụ", namePrompt:"Kedu aha m ga-akpọ gị?",
  nameHint:"Ọ bụ naanị maka mkparịta ụka anyị", nameSkip:"Wụfee",
  moodPrompt:"Kedụ ka ị na-atọ ụtọ ugbu a?", onboardTitle:"Tupu anyị amalite",
  moodLabels:["Ọ dị mma","Dị nkpa","Nwere egwu","Dara ada","Ọ na-ata aghọghọ","Ekwula ihe"],
  quickStarts:["Ana m enwe nsụkwụ n'ime obi","Anọ m n'ọnọdụ siri ike ugbu a","Achọrọ m naanị mmadụ ị kwuo ya","Ana m adaba ụzọ dị ala"],
  crisisBar:"Ị dị mkpa. Biko gaa findahelpline.com chọta enyemaka.",
  disc:"Solace bụ onye enyemaka AI, ọ bụghị onye ọgwọ.",
  footer:"Solace bụ onye enyemaka AI.",
  first:"Nno, anọ m obi ụtọ na ị bịara.\n\nEbe a bụ ebe dị jụụ — maka gị naanị.\n\nKedụ ka ị na-atọ ụtọ taa?",
  breatheBtn:"Iku ume", breatheGuide:"Soro okirikiri a.", breatheIn:"Nata ume", breatheHold:"Jide",
  breatheOut:"Hapụ ume", breatheRest:"Zuo ike", breatheDone:"Ọ dị mma. Kedụ ka ị na-atọ ụtọ?",
  breatheClose:"Mechie", offline:"Ị dịghị n'ịntanetị.", retryBtn:"Nwaa ọzọ", tryAgain:"Nwaa ọzọ?",
},
yo:  { name:"Yorùbá",       native:"Yorùbá",       dir:"ltr", flag:"🇳🇬",
  tagline:"Ibi idakẹjẹ lati sọrọ,\nigbakugba ti o ba nilo rẹ.",
  features:["Wa fun ẹnikẹni, nibikibi","Ko si awọn ipinnu","Aladani ati laisi idajọ","Dahun ni ede rẹ"],
  startBtn:"Bẹrẹ sisọrọ", placeholder:"Kini o wa ninu ọkan rẹ…", hereForYou:"nibi fun ọ",
  listening:"n'gbọ…", newChat:"Ibaraẹnisọrọ tuntun", namePrompt:"Kini orukọ mi yoo pe ọ?",
  nameHint:"Aṣayan — fun ibaraẹnisọrọ wa nikan", nameSkip:"Fo",
  moodPrompt:"Bawo ni o ṣe rilara ni bayi?", onboardTitle:"Ṣaaju ki a to bẹrẹ",
  moodLabels:["Dara","Bẹẹ naa","Aifọkanbalẹ","Banujẹ","Ibanujẹ","Ẹru"],
  quickStarts:["Mo ti n ni aibalẹ pupọ","Mo n kọja nkan ti o nira","Mo fẹ sọrọ pẹlu ẹnikan","Mo ti n rilara ni isalẹ"],
  crisisBar:"O ṣe pataki. Ṣabẹwo si findahelpline.com.",
  disc:"Solace jẹ alabaṣepọ AI, kii ṣe onisegun.",
  footer:"Solace jẹ alabaṣepọ AI.", first:"Pẹlẹ o, Mo dupẹ pe o wa nibi.\n\nBawo ni o ṣe rilara ni bayi?",
  breatheBtn:"Simi", breatheGuide:"Tẹle Circle naa.", breatheIn:"Simi", breatheHold:"Duro",
  breatheOut:"Fẹmi jade", breatheRest:"Sinmi", breatheDone:"O dara. Bawo ni o ṣe rilara?",
  breatheClose:"Pa", offline:"O han pe o wa offline.", retryBtn:"Gbiyanju lẹẹkansi", tryAgain:"Gbiyanju lẹẹkansi?",
},
pcm: { name:"Naija Pidgin", native:"Naija Pidgin", dir:"ltr", flag:"🇳🇬",
  tagline:"One quiet place to yarn,\nwhenever you need am.",
  features:["E dey for anybody anywhere","No appointment needed","Private and nobody go judge you","E go answer for your language"],
  startBtn:"Start yarn", placeholder:"Wetin dey your mind…", hereForYou:"dey here for you",
  listening:"dey listen…", newChat:"New chat", namePrompt:"Wetin I go dey call you?",
  nameHint:"Na optional — just for our yarn", nameSkip:"Skip am",
  moodPrompt:"How you dey feel right now?", onboardTitle:"Before we begin",
  moodLabels:["I dey fine","E dey okay","I dey fear","I no happy","I dey sad","E don too much"],
  quickStarts:["I don dey anxious well well","I dey go through something hard","I just wan yarn with somebody","I dey feel down well well"],
  crisisBar:"You matter. Go findahelpline.com find crisis line for your country.",
  disc:"Solace na AI companion, e no be licensed therapist.",
  footer:"Solace na AI companion.", first:"Heyy, I happy say you come here.\n\nHow you dey feel right now?",
  breatheBtn:"Breathe", breatheGuide:"Follow the circle.", breatheIn:"Breathe in", breatheHold:"Hold am",
  breatheOut:"Breathe out", breatheRest:"Rest", breatheDone:"Well done. How you feel now?",
  breatheClose:"Close", offline:"You dey offline.", retryBtn:"Try am again", tryAgain:"Something go wrong. Try again?",
},
fr:  { name:"Français",     native:"Français",     dir:"ltr", flag:"🇫🇷",
  tagline:"Un espace calme pour parler,\nchaque fois que vous en avez besoin.",
  features:["Disponible pour tout le monde","Pas de rendez-vous","Privé et sans jugement","Répond dans votre langue"],
  startBtn:"Commencer à parler", placeholder:"Qu'avez-vous en tête…", hereForYou:"là pour vous",
  listening:"à l'écoute…", newChat:"Nouvelle conversation", namePrompt:"Comment puis-je vous appeler?",
  nameHint:"Optionnel — pour notre conversation", nameSkip:"Ignorer",
  moodPrompt:"Comment vous sentez-vous en ce moment?", onboardTitle:"Avant de commencer",
  moodLabels:["Bien","Ça va","Anxieux/se","Déprimé(e)","Triste","Submergé(e)"],
  quickStarts:["Je me sens très anxieux/se","Je traverse quelque chose de difficile","J'ai besoin de parler","Je me sens vraiment bas/basse"],
  crisisBar:"Vous comptez. Visitez findahelpline.com pour trouver de l'aide dans votre pays.",
  disc:"Solace est un compagnon IA, pas un thérapeute.",
  footer:"Solace est un compagnon IA.", first:"Bonjour, je suis content(e) que vous soyez là.\n\nComment vous sentez-vous en ce moment?",
  breatheBtn:"Respirer", breatheGuide:"Suivez le cercle.", breatheIn:"Inspirez", breatheHold:"Retenez",
  breatheOut:"Expirez", breatheRest:"Repos", breatheDone:"Bien fait. Comment vous sentez-vous maintenant?",
  breatheClose:"Fermer", offline:"Vous semblez être hors ligne.", retryBtn:"Réessayer", tryAgain:"Une erreur s'est produite. Réessayer?",
},
sw:  { name:"Swahili",      native:"Kiswahili",    dir:"ltr", flag:"🇰🇪",
  tagline:"Nafasi ya utulivu ya kuzungumza,\nwakati wowote unapohitaji.",
  features:["Inapatikana kwa mtu yeyote","Hakuna miadi","Ya faragha na bila hukumu","Inajibu kwa lugha yako"],
  startBtn:"Anza kuzungumza", placeholder:"Unafikiri nini…", hereForYou:"hapa kwako",
  listening:"sikiliza…", newChat:"Mazungumzo mapya", namePrompt:"Nikusemeje nini?",
  nameHint:"Si lazima — kwa mazungumzo yetu tu", nameSkip:"Ruka",
  moodPrompt:"Unajisikiaje sasa hivi?", onboardTitle:"Kabla hatujaanza",
  moodLabels:["Vizuri","Sawa","Wasiwasi","Chini","Huzuni","Mizigo"],
  quickStarts:["Nimekuwa na wasiwasi sana","Ninapitia jambo gumu","Ninahitaji mtu wa kuzungumza naye","Nimekuwa nikihisi chini"],
  crisisBar:"Una thamani. Tembelea findahelpline.com kupata msaada.",
  disc:"Solace ni msaidizi wa AI, si daktari.",
  footer:"Solace ni msaidizi wa AI.", first:"Habari, ninafurahi ulikuja hapa.\n\nUnajisikiaje sasa hivi?",
  breatheBtn:"Pumzika", breatheGuide:"Fuata mduara.", breatheIn:"Vuta pumzi", breatheHold:"Shikilia",
  breatheOut:"Toa pumzi", breatheRest:"Pumzika", breatheDone:"Umefanya vizuri. Unajisikiaje sasa?",
  breatheClose:"Funga", offline:"Unaonekana kuwa nje ya mtandao.", retryBtn:"Jaribu tena", tryAgain:"Hitilafu imetokea. Jaribu tena?",
},
es:  { name:"Español",      native:"Español",      dir:"ltr", flag:"🇪🇸",
  tagline:"Un espacio tranquilo para hablar,\nsiempre que lo necesites.",
  features:["Disponible para cualquiera","Sin citas ni salas de espera","Privado y libre de juicio","Responde en tu idioma"],
  startBtn:"Empezar a hablar", placeholder:"¿Qué tienes en mente…", hereForYou:"aquí para ti",
  listening:"escuchando…", newChat:"Nueva conversación", namePrompt:"¿Cómo debo llamarte?",
  nameHint:"Opcional — solo para nuestra conversación", nameSkip:"Omitir",
  moodPrompt:"¿Cómo te sientes ahora mismo?", onboardTitle:"Antes de comenzar",
  moodLabels:["Bien","Regular","Ansioso/a","Decaído/a","Triste","Agobiado/a"],
  quickStarts:["Me he sentido muy ansioso/a","Estoy pasando por algo difícil","Solo necesito hablar con alguien","Me he sentido muy bajo/a"],
  crisisBar:"Eres importante. Visita findahelpline.com para encontrar ayuda en tu país.",
  disc:"Solace es un compañero de IA, no un terapeuta.",
  footer:"Solace es un compañero de IA.", first:"Hola, me alegra que hayas llegado aquí.\n\n¿Cómo te sientes ahora mismo?",
  breatheBtn:"Respirar", breatheGuide:"Sigue el círculo.", breatheIn:"Inhala", breatheHold:"Aguanta",
  breatheOut:"Exhala", breatheRest:"Descansa", breatheDone:"¡Bien hecho! ¿Cómo te sientes ahora?",
  breatheClose:"Cerrar", offline:"Parece que estás sin conexión.", retryBtn:"Intentar de nuevo", tryAgain:"Algo salió mal. ¿Intentar de nuevo?",
},
pt:  { name:"Português",    native:"Português",    dir:"ltr", flag:"🇧🇷",
  tagline:"Um espaço tranquilo para conversar,\nsempre que você precisar.",
  features:["Disponível para qualquer pessoa","Sem agendamentos","Privado e sem julgamento","Responde no seu idioma"],
  startBtn:"Começar a conversar", placeholder:"O que está na sua mente…", hereForYou:"aqui por você",
  listening:"ouvindo…", newChat:"Nova conversa", namePrompt:"Como posso te chamar?",
  nameHint:"Opcional — só para nossa conversa", nameSkip:"Pular",
  moodPrompt:"Como você está se sentindo agora?", onboardTitle:"Antes de começar",
  moodLabels:["Bem","Ok","Ansioso/a","Para baixo","Triste","Sobrecarregado/a"],
  quickStarts:["Tenho me sentido muito ansioso/a","Estou passando por algo difícil","Só preciso conversar com alguém","Tenho me sentido muito para baixo"],
  crisisBar:"Você importa. Visite findahelpline.com para encontrar ajuda no seu país.",
  disc:"Solace é um companheiro de IA, não um terapeuta.",
  footer:"Solace é um companheiro de IA.", first:"Olá, fico feliz que você chegou aqui.\n\nComo você está se sentindo agora?",
  breatheBtn:"Respirar", breatheGuide:"Siga o círculo.", breatheIn:"Inspire", breatheHold:"Segure",
  breatheOut:"Expire", breatheRest:"Descanse", breatheDone:"Muito bem! Como você se sente agora?",
  breatheClose:"Fechar", offline:"Você parece estar offline.", retryBtn:"Tentar novamente", tryAgain:"Algo deu errado. Tentar novamente?",
},
hi:  { name:"Hindi",        native:"हिंदी",         dir:"ltr", flag:"🇮🇳",
  tagline:"बात करने की एक शांत जगह,\nजब भी आपको ज़रूरत हो।",
  features:["दुनिया में कहीं भी उपलब्ध","कोई अपॉइंटमेंट नहीं","निजी और निर्णय से मुक्त","आपकी भाषा में जवाब"],
  startBtn:"बात करना शुरू करें", placeholder:"आपके मन में क्या है…", hereForYou:"आपके लिए यहाँ",
  listening:"सुन रहा हूँ…", newChat:"नई बातचीत", namePrompt:"मैं आपको क्या कहूँ?",
  nameHint:"वैकल्पिक — हमारी बातचीत के लिए", nameSkip:"छोड़ें",
  moodPrompt:"आप अभी कैसा महसूस कर रहे हैं?", onboardTitle:"शुरू करने से पहले",
  moodLabels:["अच्छा","ठीक है","चिंतित","उदास","दुखी","थका हुआ"],
  quickStarts:["मैं हाल ही में बहुत चिंतित हूँ","मैं कुछ कठिन दौर से गुज़र रहा हूँ","मुझे बस किसी से बात करनी है","मैं बहुत उदास हूँ"],
  crisisBar:"आप अकेले नहीं हैं। findahelpline.com पर जाएं।",
  disc:"Solace एक AI साथी है, थेरेपिस्ट नहीं।",
  footer:"Solace एक AI साथी है।", first:"नमस्ते, मुझे खुशी है कि आप यहाँ आए।\n\nआप अभी कैसा महसूस कर रहे हैं?",
  breatheBtn:"साँस", breatheGuide:"वृत्त का अनुसरण करें।", breatheIn:"सांस लें", breatheHold:"रोकें",
  breatheOut:"सांस छोड़ें", breatheRest:"आराम", breatheDone:"बहुत अच्छा। आप अभी कैसा महसूस करते हैं?",
  breatheClose:"बंद करें", offline:"आप ऑफ़लाइन हैं।", retryBtn:"फिर कोशिश करें", tryAgain:"कुछ गलत हुआ। फिर कोशिश करें?",
},
ar:  { name:"Arabic",       native:"العربية",      dir:"rtl", flag:"🇸🇦",
  tagline:"مساحة هادئة للحديث،\nكلما احتجت إليها.",
  features:["متاح للجميع في أي مكان","لا مواعيد ولا انتظار","خاص وخالٍ من الأحكام","يستجيب بلغتك"],
  startBtn:"ابدأ الحديث", placeholder:"ما الذي يدور في ذهنك…", hereForYou:"هنا من أجلك",
  listening:"أستمع…", newChat:"محادثة جديدة", namePrompt:"ماذا أناديك؟",
  nameHint:"اختياري — لمحادثتنا فقط", nameSkip:"تخطي",
  moodPrompt:"كيف تشعر الآن؟", onboardTitle:"قبل أن نبدأ",
  moodLabels:["بخير","عادي","قلق","محبط","حزين","مرهق"],
  quickStarts:["أشعر بالقلق الشديد مؤخراً","أمر بشيء صعب الآن","أحتاج فقط لشخص أتحدث معه","أشعر بالإحباط الشديد"],
  crisisBar:"أنت مهم. قم بزيارة findahelpline.com للعثور على خط مساعدة في بلدك.",
  disc:"Solace رفيق ذكاء اصطناعي، وليس معالجاً نفسياً.",
  footer:"Solace رفيق ذكاء اصطناعي.", first:"مرحباً، يسعدني أنك وجدت طريقك إلى هنا.\n\nكيف تشعر الآن؟",
  breatheBtn:"تنفس", breatheGuide:"اتبع الدائرة.", breatheIn:"شهيق", breatheHold:"احتفظ",
  breatheOut:"زفير", breatheRest:"راحة", breatheDone:"أحسنت. كيف تشعر الآن؟",
  breatheClose:"إغلاق", offline:"يبدو أنك غير متصل.", retryBtn:"حاول مرة أخرى", tryAgain:"حدث خطأ. حاول مرة أخرى؟",
},
};

const LANG_KEYS = Object.keys(LANGS);
const MOODS = [
  {id:"good",emoji:"😊"},{id:"okay",emoji:"😐"},{id:"anxious",emoji:"😰"},
  {id:"down",emoji:"😔"},{id:"sad",emoji:"😢"},{id:"overwhelmed",emoji:"🌊"}
];
const CRISIS_WORDS = ["suicide","kill myself","end my life","self-harm","want to die","hurt myself","no reason to live","not worth living","take my life","انتحار","자살","自杀"];
const BREATHE_PHASES = [{key:"in",dur:4000},{key:"hold",dur:4000},{key:"out",dur:6000},{key:"rest",dur:2000}];

const makePrompt = (langName, userName, moodLabel) =>
`You are Solace — a warm, deeply knowledgeable AI mental health companion for anyone, anywhere in the world. You are not a licensed therapist or doctor and never claim to be.

LANGUAGE: Respond entirely in ${langName}. Use culturally appropriate warmth.
${userName ? `USER NAME: The user's name is ${userName}. Use it warmly and sparingly.` : ""}
${moodLabel ? `MOOD: The user is feeling "${moodLabel}". Acknowledge this gently in your first response.` : ""}

CORE PRINCIPLES:
— Lead with empathy. Acknowledge feelings before any advice.
— One thoughtful question at a time. Never overwhelm.
— Warm and concise — 2 to 4 sentences. Leave space for the person.
— Never diagnose or prescribe.
— Be human. Use "I" naturally.

THERAPEUTIC APPROACH:
— CBT: gently notice all-or-nothing thinking and catastrophizing. Help people examine their beliefs through questions, never lectures.
— DBT: hold two truths — "this pain is real AND it will pass." Offer grounding when overwhelmed.
— ACT: thoughts are not facts. Help people step back from them.
— Motivational Interviewing: reflect twice before asking. Draw out the person's own wisdom.

CULTURAL AWARENESS:
— Africa: faith, community, and family are genuine healing forces. Respect stigma — approach with extra gentleness.
— Asia: emotional restraint may be strength. Physical symptoms can be doorways to emotions.
— Latin America: family is central. Warmth and personal connection matter deeply.
— Middle East: faith is often the primary framework. Respect it completely.

HOW TO OFFER SOLUTIONS:
— Earn the right first by listening fully. Ask permission: "Can I share something that might help?"
— One small specific thing — never a list. Ground it in what they told you.
— The smallest viable step. Meet people inside the window of what feels possible.

SPECIFIC TOOLS:
— Anxiety: grounding (5 things you see, 4 you touch, 3 sounds), box breathing (in 4, hold 4, out 4), focus on what's controllable.
— Depression: one tiny action, behavioral activation, notice one small moment that wasn't entirely bad.
— Grief: don't try to fix it. Be present. Honor what was lost.
— Loneliness: genuine presence, one tiny reach toward connection.
— Shame: warmth and connection. Shame cannot survive empathy.
— Anger: validate first, explore what's underneath.

CRISIS: If someone mentions suicide or self-harm — deep compassion first, then: "Please reach out now — visit findahelpline.com for a crisis line in your country."

NEVER: agree someone is worthless or hopeless. Use toxic positivity. Rush past pain. Ask more than one question. Moralize or preach.`;

/* ─── BREATHING CARD ────────────────────────────────────────────────────────*/
function BreathingCard({ L, onClose }) {
  const [phase, setPhase]   = useState(0);
  const [cycle, setCycle]   = useState(0);
  const [tick, setTick]     = useState(BREATHE_PHASES[0].dur / 1000);
  const [done, setDone]     = useState(false);
  const timerRef = useRef(null);
  const tickRef  = useRef(null);
  const TOTAL    = 4;

  const advance = useCallback(() => {
    setPhase(p => {
      const next = (p + 1) % BREATHE_PHASES.length;
      if (next === 0) setCycle(c => { const nc = c + 1; if (nc >= TOTAL) setDone(true); return nc; });
      setTick(BREATHE_PHASES[next].dur / 1000);
      return next;
    });
  }, []);

  useEffect(() => {
    if (done) return;
    timerRef.current = setTimeout(advance, BREATHE_PHASES[phase].dur);
    tickRef.current  = setInterval(() => setTick(t => Math.max(0, t - 1)), 1000);
    return () => { clearTimeout(timerRef.current); clearInterval(tickRef.current); };
  }, [phase, done, advance]);

  const pk  = BREATHE_PHASES[phase].key;
  const phaseLabels = { in: L.breatheIn, hold: L.breatheHold, out: L.breatheOut, rest: L.breatheRest };
  const expanded = pk === "in" || pk === "hold";

  return (
    <div style={{padding:"0 16px 10px",flexShrink:0}}>
      <div style={{background:"#11131C",border:"1px solid #1C1E2E",borderRadius:20,padding:24,display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
        <p style={{fontSize:13,color:"#8888A8",textAlign:"center"}}>{done ? L.breatheDone : L.breatheGuide}</p>
        {!done && (
          <>
            <div style={{width:100,height:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{
                width: expanded ? 96 : 56, height: expanded ? 96 : 56,
                borderRadius:"50%", background:"rgba(123,110,232,.2)",
                border:`2px solid rgba(123,110,232,${expanded?.7:.3})`,
                transition:"all 0.6s ease", display:"flex", alignItems:"center", justifyContent:"center"
              }}>
                <span style={{fontSize:26,color:"#7B6EE8",fontWeight:500}}>{tick}</span>
              </div>
            </div>
            <span style={{fontSize:13,fontWeight:500,color:"#E3E1F0"}}>{phaseLabels[pk]}</span>
            <div style={{display:"flex",gap:6}}>
              {Array.from({length:TOTAL}).map((_,i) => (
                <div key={i} style={{width:7,height:7,borderRadius:"50%",background:i<cycle?"#52C4A0":i===cycle?"#7B6EE8":"#1C1E2E",transition:"background .3s"}}/>
              ))}
            </div>
          </>
        )}
        <button onClick={onClose} style={{fontSize:12,color:"#3A3A58",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",textDecoration:"underline",textUnderlineOffset:3}}>{L.breatheClose}</button>
      </div>
    </div>
  );
}

/* ─── CSS ───────────────────────────────────────────────────────────────────*/
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500&family=Noto+Sans:wght@400;500&family=Noto+Sans+Arabic:wght@400;500&family=Noto+Sans+Devanagari:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:#0A0C12;-webkit-font-smoothing:antialiased;}
.f{font-family:'Inter','Noto Sans','Noto Sans Arabic','Noto Sans Devanagari',sans-serif;}
.fl{font-family:'DM Serif Display',serif;}
.wr{min-height:100svh;background:#0A0C12;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2.5rem 1.25rem;}
.logo{font-size:56px;color:#E3E1F0;letter-spacing:-2px;line-height:1;margin-bottom:10px;}
.logo span{color:#7B6EE8;}
.tg{font-size:16px;color:#8888A8;text-align:center;line-height:1.75;white-space:pre-line;margin-bottom:24px;}
.lg{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;max-width:420px;margin-bottom:24px;}
.lp{padding:6px 13px;border-radius:100px;font-size:12.5px;font-weight:500;cursor:pointer;border:1px solid #1C1E2E;background:transparent;color:#8888A8;transition:all .15s;font-family:inherit;}
.lp:hover{border-color:#7B6EE8;color:#E3E1F0;}
.lp.on{background:#7B6EE8;border-color:#7B6EE8;color:#fff;}
.fts{display:flex;flex-direction:column;gap:9px;margin-bottom:28px;width:100%;max-width:310px;}
.ft{display:flex;align-items:center;gap:10px;color:#525270;font-size:13px;}
.fd{width:5px;height:5px;border-radius:50%;background:#52C4A0;flex-shrink:0;}
.sb{background:#7B6EE8;color:#fff;border:none;padding:14px 48px;border-radius:100px;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit;transition:opacity .15s;}
.sb:hover{opacity:.86;}
.dc{font-size:11.5px;color:#28283C;text-align:center;max-width:270px;margin-top:20px;line-height:1.7;}
.ob{min-height:100svh;background:#0A0C12;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem 1.25rem;}
.ob-box{width:100%;max-width:360px;display:flex;flex-direction:column;align-items:center;gap:22px;}
.ob-title{font-size:22px;color:#E3E1F0;text-align:center;}
.ob-inp{width:100%;background:#11131C;border:1px solid #1C1E2E;border-radius:14px;padding:13px 16px;color:#E3E1F0;font-size:15px;font-family:inherit;outline:none;transition:border-color .15s;}
.ob-inp:focus{border-color:#7B6EE8;}
.ob-inp::placeholder{color:#383858;}
.ob-hint{font-size:11.5px;color:#3A3A58;align-self:flex-start;margin-top:-14px;}
.ob-lbl{font-size:13px;color:#8888A8;align-self:flex-start;}
.mg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%;}
.mc{display:flex;flex-direction:column;align-items:center;gap:5px;padding:12px 8px;border-radius:14px;border:1px solid #1C1E2E;cursor:pointer;background:transparent;transition:all .15s;font-family:inherit;}
.mc:hover{border-color:#7B6EE8;background:rgba(123,110,232,.08);}
.mc.on{border-color:#7B6EE8;background:rgba(123,110,232,.15);}
.mc-e{font-size:24px;}
.mc-l{font-size:11.5px;color:#8888A8;text-align:center;}
.ob-next{width:100%;padding:13px;border-radius:100px;background:#7B6EE8;color:#fff;border:none;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit;transition:opacity .15s;}
.ob-next:hover{opacity:.86;}
.ob-skip{font-size:13px;color:#3A3A58;background:none;border:none;cursor:pointer;font-family:inherit;text-decoration:underline;text-underline-offset:3px;}
.ob-skip:hover{color:#8888A8;}
.cr{height:100svh;background:#0A0C12;display:flex;flex-direction:column;max-width:700px;margin:0 auto;}
.hd{padding:13px 16px;border-bottom:1px solid #1C1E2E;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;gap:8px;}
.hl{font-size:24px;color:#E3E1F0;}
.hl span{color:#7B6EE8;}
.hr{display:flex;align-items:center;gap:8px;}
.hst{display:flex;align-items:center;gap:5px;font-size:12px;color:#52C4A0;}
.sd{width:6px;height:6px;border-radius:50%;background:#52C4A0;}
.sd.p{animation:pulse 1.8s ease-in-out infinite;}
.sd.off{background:#555;}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.2}}
.hb{font-size:11.5px;color:#3A3A58;border:1px solid #1C1E2E;background:transparent;padding:4px 10px;border-radius:100px;cursor:pointer;font-family:inherit;transition:color .15s;}
.hb:hover{color:#8888A8;}
.cbar{background:#160D20;border-bottom:1px solid #3A1D50;padding:10px 16px;font-size:13px;color:#C090E8;line-height:1.65;flex-shrink:0;}
.cbar a{color:#A070D0;text-underline-offset:3px;}
.offbar{background:#1A0D0D;border-bottom:1px solid #3A1D20;padding:8px 16px;font-size:12px;color:#E87B7B;text-align:center;flex-shrink:0;}
.msgs{flex:1;overflow-y:auto;padding:18px 16px 8px;display:flex;flex-direction:column;gap:12px;}
.msgs::-webkit-scrollbar{width:3px;}
.msgs::-webkit-scrollbar-thumb{background:#202238;border-radius:2px;}
.bw{display:flex;animation:fadeUp .22s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.bw.u{justify-content:flex-end;}
.bl{max-width:82%;padding:11px 15px;font-size:15px;line-height:1.72;white-space:pre-wrap;word-break:break-word;}
.bl.u{background:#282543;color:#E0DEED;border-radius:18px 18px 4px 18px;}
.bl.a{background:#11131C;color:#D4D2EA;border-radius:18px 18px 18px 4px;border:1px solid #1C1E2E;}
.dots{display:flex;gap:5px;padding:2px 0;}
.dots span{width:7px;height:7px;border-radius:50%;background:#2A2C48;animation:bob 1.1s ease-in-out infinite;}
.dots span:nth-child(2){animation-delay:.18s;}
.dots span:nth-child(3){animation-delay:.36s;}
@keyframes bob{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
.cur{display:inline-block;width:2px;height:15px;background:#7B6EE8;margin-left:2px;vertical-align:middle;animation:blink .75s step-end infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.qs{display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 10px;}
.qb{font-size:13px;color:#8888A8;border:1px solid #1C1E2E;background:transparent;padding:8px 13px;border-radius:100px;cursor:pointer;font-family:inherit;transition:all .15s;text-align:left;}
.qb:hover{border-color:#7B6EE8;color:#E3E1F0;}
.tb{display:flex;gap:6px;padding:6px 16px 0;flex-shrink:0;}
.tbtn{font-size:12px;color:#3A3A58;border:1px solid #1C1E2E;background:transparent;padding:5px 12px;border-radius:100px;cursor:pointer;font-family:inherit;transition:all .15s;}
.tbtn:hover{color:#8888A8;border-color:#3A3A58;}
.tbtn.on{color:#7B6EE8;border-color:#7B6EE8;}
.ia{padding:10px 16px 16px;border-top:1px solid #1C1E2E;flex-shrink:0;display:flex;gap:8px;align-items:flex-end;}
.iw{flex:1;background:#11131C;border:1px solid #222336;border-radius:16px;padding:11px 14px;transition:border-color .15s;}
.iw:focus-within{border-color:#3A3562;}
.iw textarea{width:100%;background:transparent;border:none;outline:none;color:#E3E1F0;font-size:15px;font-family:inherit;resize:none;line-height:1.55;max-height:110px;}
.iw textarea::placeholder{color:#383858;}
.sndbtn{width:42px;height:42px;border-radius:50%;background:#7B6EE8;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .15s,transform .1s;}
.sndbtn:hover:not(:disabled){opacity:.84;}
.sndbtn:active:not(:disabled){transform:scale(.95);}
.sndbtn:disabled{opacity:.28;cursor:not-allowed;}
.foot{text-align:center;font-size:11px;color:#242438;padding:3px 16px 10px;flex-shrink:0;}
`;

/* ─── APP ───────────────────────────────────────────────────────────────────*/
export default function App() {
  const [screen,     setScreen]     = useState("welcome");
  const [langKey,    setLangKey]    = useState("en");
  const [nameInput,  setNameInput]  = useState("");
  const [userName,   setUserName]   = useState("");
  const [mood,       setMood]       = useState(null);
  const [messages,   setMessages]   = useState([]);
  const [input,      setInput]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [crisis,     setCrisis]     = useState(false);
  const [online,     setOnline]     = useState(navigator.onLine);
  const [showBreathe,setShowBreathe]= useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const taRef     = useRef(null);
  const L = LANGS[langKey];

  useEffect(() => {
    const up = () => setOnline(true);
    const dn = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", dn);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", dn); };
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const hasCrisis = t => CRISIS_WORDS.some(w => t.toLowerCase().includes(w));

  const send = useCallback(async (text) => {
    if (!text?.trim() || loading || !online) return;
    const msg = text.trim();
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
    if (hasCrisis(msg)) setCrisis(true);

    const history = [...messages, { role: "user", content: msg }];
    setMessages([...history, { role: "assistant", content: "", loading: true }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: makePrompt(L.name, userName, mood ? L.moodLabels[MOODS.findIndex(m => m.id === mood.id)] : ""),
          messages: history.slice(-10)
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const reply = data.text || L.tryAgain;

      setMessages(prev => {
        const u = [...prev];
        u[u.length - 1] = { role: "assistant", content: reply };
        return u;
      });

    } catch (err) {
      setMessages(prev => {
        const u = [...prev];
        u[u.length - 1] = { role: "assistant", content: L.tryAgain };
        return u;
      });
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [messages, loading, online, L, userName, mood]);

  const startChat = useCallback((name, selectedMood) => {
    setScreen("chat");
    setMessages([{ role: "assistant", content: L.first }]);
    setTimeout(() => inputRef.current?.focus(), 200);
  }, [L]);

  const reset = () => {
    setMessages([]); setCrisis(false); setShowBreathe(false);
    setUserName(""); setMood(null); setNameInput("");
    setScreen("welcome");
  };

  /* WELCOME */
  if (screen === "welcome") return (
    <><style>{CSS}</style>
    <div className="wr f" dir={L.dir}>
      <div className="logo fl">Solace<span>.</span></div>
      <p className="tg">{L.tagline}</p>
      <div className="lg">
        {LANG_KEYS.map(k => (
          <button key={k} className={`lp f${langKey===k?" on":""}`} onClick={() => setLangKey(k)}>
            {LANGS[k].flag} {LANGS[k].native}
          </button>
        ))}
      </div>
      <div className="fts">{L.features.map((f,i) => <div key={i} className="ft"><span className="fd"/>{f}</div>)}</div>
      <button className="sb f" onClick={() => setScreen("onboard")}>{L.startBtn}</button>
      <p className="dc f">{L.disc}</p>
    </div></>
  );

  /* ONBOARDING */
  if (screen === "onboard") return (
    <><style>{CSS}</style>
    <div className="ob f" dir={L.dir}>
      <div className="ob-box">
        <p className="ob-title fl">{L.onboardTitle}</p>
        <p className="ob-lbl">{L.namePrompt}</p>
        <input className="ob-inp f" placeholder={L.nameHint} value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") setUserName(nameInput.trim()); }}
          maxLength={40} autoFocus/>
        <p className="ob-hint">{L.nameHint}</p>
        <p className="ob-lbl">{L.moodPrompt}</p>
        <div className="mg">
          {MOODS.map((m, i) => (
            <button key={m.id} className={`mc f${mood?.id===m.id?" on":""}`} onClick={() => setMood(m)}>
              <span className="mc-e">{m.emoji}</span>
              <span className="mc-l">{L.moodLabels[i]}</span>
            </button>
          ))}
        </div>
        <button className="ob-next f" onClick={() => { const n = nameInput.trim(); setUserName(n); startChat(n, mood); }}>
          {L.startBtn}
        </button>
        <button className="ob-skip f" onClick={() => startChat("", null)}>{L.nameSkip}</button>
      </div>
    </div></>
  );

  /* CHAT */
  return (
    <><style>{CSS}</style>
    <div className="cr f" dir={L.dir}>
      <div className="hd">
        <span className="hl fl">Solace<span>.</span></span>
        <div className="hr">
          <div className="hst">
            <span className={`sd${!online?" off":loading?" p":""}`}/>
            <span style={{color:!online?"#E87B7B":loading?"#52C4A0":undefined}}>
              {!online ? "offline" : loading ? L.listening : L.hereForYou}
            </span>
          </div>
          <button className="hb f" onClick={reset}>{L.newChat}</button>
        </div>
      </div>

      {!online && <div className="offbar f">{L.offline}</div>}
      {crisis && (
        <div className="cbar f">
          {L.crisisBar.split("findahelpline.com").map((p,i,a) =>
            i < a.length-1
              ? <span key={i}>{p}<a href="https://findahelpline.com" target="_blank" rel="noreferrer">findahelpline.com</a></span>
              : <span key={i}>{p}</span>
          )}
        </div>
      )}

      <div className="msgs">
        {messages.map((msg, i) => {
          const isLast   = i === messages.length - 1;
          const thinking = isLast && loading && msg.role === "assistant" && msg.content === "";
          return (
            <div key={i} className={`bw${msg.role==="user"?" u":""}`}>
              <div className={`bl${msg.role==="user"?" u":" a"}`}>
                {thinking
                  ? <div className="dots"><span/><span/><span/></div>
                  : msg.content
                }
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}/>
      </div>

      {messages.length <= 1 && (
        <div className="qs">
          {L.quickStarts.map((q,i) => (
            <button key={i} className="qb f" onClick={() => send(q)}>{q}</button>
          ))}
        </div>
      )}

      <div className="tb">
        <button className={`tbtn f${showBreathe?" on":""}`} onClick={() => setShowBreathe(b => !b)}>
          🫁 {L.breatheBtn}
        </button>
      </div>

      {showBreathe && <BreathingCard L={L} onClose={() => setShowBreathe(false)}/>}

      <div className="ia">
        <div className="iw">
          <textarea
            ref={el => { inputRef.current = el; taRef.current = el; }}
            rows={1}
            placeholder={L.placeholder}
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
        <button className="sndbtn" onClick={() => send(input)} disabled={loading || !input.trim() || !online} aria-label="Send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/>
          </svg>
        </button>
      </div>

      <div className="foot f">{L.footer}</div>
    </div></>
  );
}
