import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase.js";

// ─── Exercise Database ────────────────────────────────────────────────────────
const IMAGE_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";
const BUILTIN_EXERCISES = {"Push":[{"name":"Alternating Cable Shoulder Press","equipment":"cable","muscles":["shoulders"],"secondary":["triceps"],"tip":"Move the cables to the bottom of the tower. Press alternately overhead with control, keeping core tight.","imgId":"Alternating_Cable_Shoulder_Press"},{"name":"Arnold Dumbbell Press","equipment":"dumbbell","muscles":["shoulders"],"secondary":["triceps"],"tip":"Palms facing you at chest. Rotate outward as you press overhead. Reverse on descent.","imgId":"Arnold_Dumbbell_Press"},{"name":"Barbell Bench Press","equipment":"barbell","muscles":["chest"],"secondary":["shoulders","triceps"],"tip":"Medium grip, lower bar to mid-chest, press up explosively. Keep shoulder blades retracted.","imgId":"Barbell_Bench_Press_-_Medium_Grip"},{"name":"Barbell Incline Bench Press","equipment":"barbell","muscles":["chest"],"secondary":["shoulders","triceps"],"tip":"Incline bench, medium grip. Lower to upper chest and press. Keep core tight.","imgId":"Barbell_Incline_Bench_Press_-_Medium_Grip"},{"name":"Barbell Shoulder Press","equipment":"barbell","muscles":["shoulders"],"secondary":["chest","triceps"],"tip":"Grip just wider than shoulders, press bar overhead, lower to chin. Don't over-arch.","imgId":"Barbell_Shoulder_Press"},{"name":"Cable Chest Press","equipment":"cable","muscles":["chest"],"secondary":["shoulders","triceps"],"tip":"Upper arms 45 degrees to body. Press forward and squeeze chest at extension.","imgId":"Cable_Chest_Press"},{"name":"Close-Grip Barbell Bench Press","equipment":"barbell","muscles":["triceps"],"secondary":["chest","shoulders"],"tip":"Shoulder-width grip. Lower to mid-chest, elbows close to body. Great tricep compound.","imgId":"Close-Grip_Barbell_Bench_Press"},{"name":"Clean and Press","equipment":"barbell","muscles":["shoulders"],"secondary":["abdominals","calves"],"tip":"Deadlift explosively, clean to shoulders, press overhead. Use moderate weight.","imgId":"Clean_and_Press"},{"name":"Cable Shoulder Press","equipment":"cable","muscles":["shoulders"],"secondary":["triceps"],"tip":"Cables at bottom. Grab at shoulder height, press overhead. Constant tension throughout.","imgId":"Cable_Shoulder_Press"},{"name":"Cable Rope Rear-Delt Rows","equipment":"cable","muscles":["shoulders"],"secondary":["biceps","middle back"],"tip":"Sit at low pulley, use rope. Pull to face keeping elbows high, squeeze rear delts at peak.","imgId":"Cable_Rope_Rear-Delt_Rows"},{"name":"Bent-Arm Dumbbell Pullover","equipment":"dumbbell","muscles":["chest"],"secondary":["lats","shoulders"],"tip":"Lie across flat bench, dumbbell overhead. Lower behind head, elbows slightly bent.","imgId":"Bent-Arm_Dumbbell_Pullover"},{"name":"Bradford/Rocky Presses","equipment":"barbell","muscles":["shoulders"],"secondary":["triceps"],"tip":"Alternate pressing over head then behind neck. Continuous motion, no lockout.","imgId":"Bradford_Rocky_Presses"}],"Pull":[{"name":"Barbell Deadlift","equipment":"barbell","muscles":["lower back"],"secondary":["calves","forearms"],"tip":"Shoulder-width stance. Hinge at hips and knees, grip bar, drive through heels to stand.","imgId":"Barbell_Deadlift"},{"name":"Bent Over Barbell Row","equipment":"barbell","muscles":["middle back"],"secondary":["biceps","lats"],"tip":"Hinge forward, back straight. Pull bar to lower chest/upper abs. Squeeze shoulder blades at top.","imgId":"Bent_Over_Barbell_Row"},{"name":"Close-Grip Front Lat Pulldown","equipment":"cable","muscles":["lats"],"secondary":["biceps","middle back"],"tip":"Pull bar to upper chest, leaning back slightly. Squeeze lats, return with control.","imgId":"Close-Grip_Front_Lat_Pulldown"},{"name":"Drag Curl","equipment":"barbell","muscles":["biceps"],"secondary":["forearms"],"tip":"Drag bar up your torso keeping elbows behind you. Maximizes bicep peak contraction.","imgId":"Drag_Curl"},{"name":"Elevated Cable Rows","equipment":"cable","muscles":["lats"],"secondary":["middle back","traps"],"tip":"Pull to waist keeping elbows close to sides. Full stretch at extension.","imgId":"Elevated_Cable_Rows"},{"name":"Full Range Lat Pulldown","equipment":"cable","muscles":["lats"],"secondary":["biceps","middle back"],"tip":"From high cables, pull hands together and down engaging lats fully.","imgId":"Full_Range-Of-Motion_Lat_Pulldown"},{"name":"High Cable Curls","equipment":"cable","muscles":["biceps"],"secondary":[],"tip":"Arms parallel to floor. Curl handles toward your head — peak contraction isolation.","imgId":"High_Cable_Curls"},{"name":"Dumbbell Incline Row","equipment":"dumbbell","muscles":["middle back"],"secondary":["biceps","forearms"],"tip":"Chest-down on incline bench. Row to sides of chest, squeeze mid-back at top.","imgId":"Dumbbell_Incline_Row"},{"name":"Leverage High Row","equipment":"machine","muscles":["middle back"],"secondary":["lats"],"tip":"Pull down with pronated grip, leading with elbows. Controlled eccentric.","imgId":"Leverage_High_Row"},{"name":"Leverage Iso Row","equipment":"machine","muscles":["lats"],"secondary":["biceps","middle back"],"tip":"Chest against pad, handles at chest level. Each arm works independently.","imgId":"Leverage_Iso_Row"},{"name":"Lying T-Bar Row","equipment":"machine","muscles":["middle back"],"secondary":["biceps","lats"],"tip":"Face-down on T-bar. Pull weight up, elbows flared, squeeze mid-back. Chest on pad.","imgId":"Lying_T-Bar_Row"},{"name":"Kneeling High Pulley Row","equipment":"cable","muscles":["lats"],"secondary":["biceps","middle back"],"tip":"Kneel facing high pulley. Pull rope to forehead keeping elbows wide.","imgId":"Kneeling_High_Pulley_Row"},{"name":"Bent Over Two-Dumbbell Row","equipment":"dumbbell","muscles":["middle back"],"secondary":["biceps","lats"],"tip":"Hinge forward with dumbbells hanging. Row both up to sides simultaneously.","imgId":"Bent_Over_Two-Dumbbell_Row"}],"Legs":[{"name":"Barbell Squat","equipment":"barbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Bar on upper traps. Feet shoulder-width, toes out. Squat to parallel, drive through heels.","imgId":"Barbell_Squat"},{"name":"Barbell Full Squat","equipment":"barbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Descend below parallel. Greater glute and hamstring involvement. Requires good mobility.","imgId":"Barbell_Full_Squat"},{"name":"Barbell Hack Squat","equipment":"barbell","muscles":["quadriceps"],"secondary":["calves","forearms"],"tip":"Hold barbell behind legs at arms length. Squat keeping back straight. Emphasizes quad sweep.","imgId":"Barbell_Hack_Squat"},{"name":"Barbell Lunge","equipment":"barbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Bar on back, step forward into lunge. Back knee near floor. Alternate legs.","imgId":"Barbell_Lunge"},{"name":"Barbell Walking Lunge","equipment":"barbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Walk forward with alternating lunges. Torso upright, knee tracks over toe.","imgId":"Barbell_Walking_Lunge"},{"name":"Barbell Step Ups","equipment":"barbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Bar on back, step onto elevated platform. Drive through heel of lead leg.","imgId":"Barbell_Step_Ups"},{"name":"Cable Deadlifts","equipment":"cable","muscles":["quadriceps"],"secondary":["forearms","glutes"],"tip":"Stand between cable towers. Hinge at hips and knees. Drive through heels. Constant tension.","imgId":"Cable_Deadlifts"},{"name":"Dumbbell Lunges","equipment":"dumbbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Hold dumbbells at sides. Step forward, lower back knee toward floor. Push back to start.","imgId":"Dumbbell_Lunges"},{"name":"Dumbbell Squat","equipment":"dumbbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Dumbbells at sides, feet shoulder-width. Squat to parallel keeping chest up.","imgId":"Dumbbell_Squat"},{"name":"Dumbbell Step Ups","equipment":"dumbbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Hold dumbbells, step onto box. Fully extend lead leg at top, step down with control.","imgId":"Dumbbell_Step_Ups"},{"name":"Dumbbell Clean","equipment":"dumbbell","muscles":["hamstrings"],"secondary":["calves","forearms"],"tip":"Dumbbells at sides, hip-width stance. Explosively drive hips forward and clean to shoulders.","imgId":"Dumbbell_Clean"},{"name":"Dumbbell Rear Lunge","equipment":"dumbbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Step backward into lunge. Easier on knees, great for balance and glute emphasis.","imgId":"Dumbbell_Rear_Lunge"},{"name":"Elevated Back Lunge","equipment":"barbell","muscles":["quadriceps"],"secondary":["glutes","hamstrings"],"tip":"Front foot on raised platform, barbell on back. Deep range lunge for maximum quad stretch.","imgId":"Elevated_Back_Lunge"},{"name":"Box Squat with Chains","equipment":"barbell","muscles":["quadriceps"],"secondary":["abductors","adductors"],"tip":"Squat to box behind you, pause briefly, drive up explosively.","imgId":"Box_Squat_with_Chains"}]};

const TYPE_COLOR = { Push:"#ff6b35", Pull:"#00d4ff", Legs:"#c8ff3e" };
const TYPE_DARK  = { Push:"#2d1a0e", Pull:"#0a1f2d", Legs:"#1a2200" };

// ─── Progressive overload ─────────────────────────────────────────────────────
function getProgression(sessions, exName, setIndex) {
  const history = sessions.map(s => s.exercises?.find(e=>e.name===exName)?.sets?.[setIndex]).filter(Boolean);
  if (!history.length) return { weight:null, reps:6, targetReps:6, note:"First time — start comfortable", phase:"new" };
  const last=history[history.length-1], lastW=parseFloat(last.weight)||0, lastR=parseInt(last.reps)||0, lastTgt=parseInt(last.targetReps)||6;
  if (!lastW) return { weight:null, reps:6, targetReps:6, note:"Log a weight to track progression", phase:"new" };
  if (lastR>=lastTgt) {
    if (lastTgt>=10) { const bump=lastW>=60?5:2.5; return { weight:lastW+bump, reps:6, targetReps:6, note:`🔥 Weight up! ${lastW}kg×10 → ${lastW+bump}kg×6`, phase:"weight-up" }; }
    const nextT=lastTgt===6?8:10;
    return { weight:lastW, reps:nextT, targetReps:nextT, note:`📈 Hit ${lastTgt} reps → aim for ${nextT}`, phase:"reps-up" };
  }
  return { weight:lastW, reps:lastTgt, targetReps:lastTgt, note:`Same weight — hit ${lastTgt} reps to progress`, phase:"hold" };
}

// ─── Add Custom Exercise Modal ────────────────────────────────────────────────
function AddExerciseModal({ onSave, onClose }) {
  const [name,setName]=useState(""), [day,setDay]=useState("Push"), [error,setError]=useState("");
  function save() { const n=name.trim(); if(!n||n.length<2){setError("Enter a valid name");return;} onSave({name:n,day}); }
  return (
    <div style={M.overlay}>
      <div style={M.modal}>
        <div style={M.title}>ADD CUSTOM EXERCISE</div>
        <div style={M.field}><label style={M.label}>EXERCISE NAME</label>
          <input style={M.input} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Cable Crunch..." autoFocus onKeyDown={e=>e.key==="Enter"&&save()} /></div>
        <div style={M.field}><label style={M.label}>WORKOUT DAY</label>
          <div style={M.dayRow}>{["Push","Pull","Legs"].map(d=>(
            <button key={d} onClick={()=>setDay(d)} style={{...M.dayBtn,background:day===d?TYPE_COLOR[d]:"#111",color:day===d?"#000":"#555",border:`1px solid ${day===d?TYPE_COLOR[d]:"#222"}`}}>{d}</button>
          ))}</div></div>
        {error&&<div style={M.error}>{error}</div>}
        <div style={M.actions}>
          <button style={M.cancel} onClick={onClose}>Cancel</button>
          <button style={{...M.save,background:TYPE_COLOR[day]}} onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
const M={overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20},modal:{width:"100%",maxWidth:360,background:"#0f0f0f",border:"1px solid #2a2a2a",borderRadius:16,padding:"28px 24px"},title:{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,letterSpacing:2,marginBottom:24,color:"#ddd"},field:{marginBottom:18},label:{display:"block",fontSize:10,color:"#444",letterSpacing:2,fontWeight:700,marginBottom:8},input:{width:"100%",background:"#141414",border:"1px solid #222",borderRadius:10,padding:"13px 14px",color:"#e8e4dc",fontSize:15,fontFamily:"'Barlow',sans-serif",outline:"none"},dayRow:{display:"flex",gap:8},dayBtn:{flex:1,padding:"11px 0",borderRadius:8,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,letterSpacing:1},error:{background:"#2a0a0a",border:"1px solid #5a1a1a",borderRadius:8,padding:"10px 12px",color:"#ff6b6b",fontSize:13,marginBottom:14},actions:{display:"flex",gap:10,marginTop:4},cancel:{flex:1,background:"none",border:"1px solid #222",color:"#555",borderRadius:8,padding:"12px",cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:14},save:{flex:2,border:"none",color:"#000",borderRadius:8,padding:"12px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,letterSpacing:1}};

// ─── Auth Screen ──────────────────────────────────────────────────────────────
function AuthScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function signInWithGoogle() {
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://gym-workout-g61a3slo2-jiale-s-projects1.vercel.app" }
    });
    if (error) { setError(error.message); setLoading(false); }
  }

  return (
    <div style={Au.root}>
      <div style={Au.card}>
        <div style={Au.logo}>IRON<span style={{color:"#ff6b35"}}>LOG</span></div>
        <div style={Au.sub}>Track your gains. Beat your last session.</div>
        <div style={Au.features}>
          {["📈 Progressive overload tracking","🏋️ 40+ exercises with visuals","👥 Separate data per user","📊 Progress analysis & charts"].map(f=>(
            <div key={f} style={Au.feature}>{f}</div>
          ))}
        </div>
        {error && <div style={Au.error}>{error}</div>}
        <button style={{...Au.googleBtn, opacity:loading?0.7:1}} onClick={signInWithGoogle} disabled={loading}>
          {loading ? "Redirecting..." : (
            <><span style={Au.googleIcon}>G</span> Continue with Google</>
          )}
        </button>
        <div style={Au.note}>Your workout data is private and isolated to your account.</div>
      </div>
    </div>
  );
}
const Au={root:{minHeight:"100vh",background:"#080808",display:"flex",alignItems:"center",justifyContent:"center",padding:20},card:{width:"100%",maxWidth:380,background:"#0d0d0d",border:"1px solid #1e1e1e",borderRadius:20,padding:"40px 28px"},logo:{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:48,letterSpacing:2,marginBottom:8},sub:{fontSize:14,color:"#555",marginBottom:28,lineHeight:1.5},features:{marginBottom:32,display:"flex",flexDirection:"column",gap:8},feature:{fontSize:13,color:"#444",padding:"8px 12px",background:"#111",borderRadius:8,borderLeft:"2px solid #1e1e1e"},error:{background:"#2a0a0a",border:"1px solid #5a1a1a",borderRadius:8,padding:"10px 14px",color:"#ff6b6b",fontSize:13,marginBottom:16},googleBtn:{width:"100%",background:"#fff",border:"none",borderRadius:10,padding:"14px",color:"#111",fontFamily:"'Barlow',sans-serif",fontWeight:700,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:16},googleIcon:{width:20,height:20,background:"#ff6b35",borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:12},note:{fontSize:11,color:"#333",textAlign:"center",lineHeight:1.5}};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]             = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessions, setSessions]     = useState([]);
  const [customEx, setCustomEx]     = useState({Push:[],Pull:[],Legs:[]});
  const [lastType, setLastType]     = useState(null);
  const [dbLoading, setDbLoading]   = useState(false);
  const [view, setView]             = useState("home");
  const [sessionType, setSessionType] = useState(null);
  const [step, setStep]             = useState("pick");
  const [selectedEx, setSelectedEx] = useState([]);
  const [loggedSets, setLoggedSets] = useState({});
  const [activeExIdx, setActiveExIdx] = useState(0);
  const [toast, setToast]           = useState(null);
  const [imgErrors, setImgErrors]   = useState({});
  const [showTip, setShowTip]       = useState(false);
  const [imgFrame, setImgFrame]     = useState({});
  const [analysisEx, setAnalysisEx] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const animRef = useRef({});

  // ── Auth listener ───────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Load data when user logs in ─────────────────────────────────────────────
  useEffect(() => {
    if (!user) { setSessions([]); setCustomEx({Push:[],Pull:[],Legs:[]}); setLastType(null); return; }
    setDbLoading(true);
    Promise.all([
      supabase.from("sessions").select("*").order("date", { ascending: true }),
      supabase.from("custom_exercises").select("*"),
      supabase.from("user_meta").select("*").eq("user_id", user.id).single()
    ]).then(([sessRes, custRes, metaRes]) => {
      setSessions(sessRes.data || []);
      // Group custom exercises by day
      const grouped = {Push:[],Pull:[],Legs:[]};
      (custRes.data||[]).forEach(e => { if(grouped[e.day]) grouped[e.day].push(e); });
      setCustomEx(grouped);
      setLastType(metaRes.data?.last_type || null);
      setDbLoading(false);
    });
  }, [user]);

  // ── Image animation ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (view!=="session"||step!=="log") return;
    const exName = selectedEx[activeExIdx];
    const allEx  = mergedExercises(sessionType);
    const ex = allEx?.find(e=>e.name===exName);
    if (!ex?.imgId) return;
    clearInterval(animRef.current[ex.imgId]);
    animRef.current[ex.imgId] = setInterval(() =>
      setImgFrame(f=>({...f,[ex.imgId]:f[ex.imgId]===1?0:1})), 1200);
    return () => clearInterval(animRef.current[ex.imgId]);
  }, [activeExIdx, view, step, sessionType]);

  const showToast = (msg, color="#00d4ff") => { setToast({msg,color}); setTimeout(()=>setToast(null),2800); };

  function mergedExercises(type) {
    if (!type) return [];
    const customs = (customEx[type]||[]).map(c=>({name:c.name,equipment:"custom",muscles:["custom"],secondary:[],tip:"",imgId:null,custom:true,dbId:c.id}));
    return [...(BUILTIN_EXERCISES[type]||[]), ...customs];
  }

  async function handleAddExercise({name,day}) {
    const all = mergedExercises(day);
    if (all.some(e=>e.name.toLowerCase()===name.toLowerCase())) { showToast("Already exists","#ff6b35"); return; }
    const { data, error } = await supabase.from("custom_exercises").insert({ user_id:user.id, name, day }).select().single();
    if (error) { showToast("Failed to save","#ff6b35"); return; }
    setCustomEx(prev=>({...prev,[day]:[...prev[day],data]}));
    showToast(`"${name}" added to ${day} 💪`, TYPE_COLOR[day]);
    setShowAddModal(false);
  }

  async function deleteCustomExercise(dbId, day, name) {
    await supabase.from("custom_exercises").delete().eq("id", dbId);
    setCustomEx(prev=>({...prev,[day]:prev[day].filter(e=>e.id!==dbId)}));
    showToast("Removed","#ff6b35");
  }

  async function logout() { await supabase.auth.signOut(); setUser(null); setView("home"); }

  function startSession(type) {
    setSessionType(type); setSelectedEx([]); setLoggedSets({});
    setActiveExIdx(0); setStep("pick"); setShowTip(false); setView("session");
  }

  function toggleExercise(name) {
    setSelectedEx(prev=>prev.includes(name)?prev.filter(n=>n!==name):prev.length<6?[...prev,name]:prev);
  }

  function confirmPick() {
    if (selectedEx.length<2) { showToast("Pick at least 2","#ff6b35"); return; }
    const init={};
    selectedEx.forEach(name=>{
      init[name]=[0,1,2].map(si=>{
        const p=getProgression(sessions,name,si);
        return {weight:p.weight!==null?String(p.weight):"",reps:String(p.reps),targetReps:p.targetReps,done:false};
      });
    });
    setLoggedSets(init); setStep("log"); setActiveExIdx(0); setShowTip(false);
  }

  function updateSet(name,si,field,val) {
    setLoggedSets(prev=>{const u={...prev};u[name]=u[name].map((s,i)=>i===si?{...s,[field]:val}:s);return u;});
  }

  function markDone(name,si) {
    const set=loggedSets[name][si];
    if (!set.weight){showToast("Enter a weight first","#ff6b35");return;}
    setLoggedSets(prev=>{const u={...prev};u[name]=u[name].map((s,i)=>i===si?{...s,done:true}:s);return u;});
    const r=parseInt(set.reps),t=set.targetReps;
    showToast(r>=t?(t===10?"🔥 Weight up next session!":"✅ +reps next session!"):"Logged — push harder next time 💪");
  }

  async function finishSession() {
    const exercisesLog = selectedEx.map(name=>({name,sets:(loggedSets[name]||[]).map(s=>({...s}))}));
    const { data: newSession } = await supabase.from("sessions").insert({
      user_id: user.id, type: sessionType,
      date: new Date().toISOString(), exercises: exercisesLog
    }).select().single();

    if (newSession) setSessions(prev=>[...prev,newSession]);

    // Update last_type in user_meta (upsert)
    await supabase.from("user_meta").upsert({ user_id:user.id, last_type:sessionType }, { onConflict:"user_id" });
    setLastType(sessionType);
    showToast(`${sessionType} day saved! 💪`, TYPE_COLOR[sessionType]);
    setView("home");
  }

  // ── Analysis helpers ────────────────────────────────────────────────────────
  function getExerciseNames() {
    const names=new Set();
    sessions.forEach(s=>s.exercises?.forEach(e=>names.add(e.name)));
    return [...names].sort();
  }
  function getSessionMaxes(name) {
    const byDate={};
    sessions.forEach(s=>{ const ex=s.exercises?.find(e=>e.name===name); if(!ex) return;
      const best=ex.sets.reduce((m,s)=>{const w=parseFloat(s.weight)||0;return w>m?w:m;},0);
      if(best>0) byDate[s.date]=best; });
    return Object.entries(byDate).map(([date,weight])=>({date,weight})).sort((a,b)=>new Date(a.date)-new Date(b.date));
  }
  function getExerciseHistory(name) {
    const pts=[];
    sessions.forEach(s=>{ const ex=s.exercises?.find(e=>e.name===name); if(!ex) return;
      ex.sets.forEach((set,si)=>{ const w=parseFloat(set.weight),r=parseInt(set.reps);
        if(w&&r) pts.push({date:s.date,setIndex:si,weight:w,reps:r,e1rm:Math.round(w*(1+r/30)*10)/10}); }); });
    return pts;
  }

  // ── Guards ──────────────────────────────────────────────────────────────────
  if (authLoading) return <Splash text="Loading..." />;
  if (!user) return <AuthScreen />;
  if (dbLoading) return <Splash text={`Welcome, ${user.user_metadata?.full_name?.split(" ")[0] || "athlete"}! Loading your data...`} />;

  const suggested   = {Push:"Pull",Pull:"Legs",Legs:"Push"}[lastType]||"Push";
  const allExForDay = mergedExercises(sessionType);
  const activeExName= selectedEx[activeExIdx];
  const activeExData= allExForDay.find(e=>e.name===activeExName);
  const frameIdx    = activeExData?.imgId?(imgFrame[activeExData.imgId]??0):0;
  const imgSrc      = activeExData?.imgId?`${IMAGE_BASE}/${activeExData.imgId}/${frameIdx}.jpg`:null;
  const weekCount   = sessions.filter(s=>new Date(s.date)>new Date(Date.now()-7*86400000)).length;
  const recent      = sessions.length?sessions[sessions.length-1]:null;
  const totalCustom = Object.values(customEx).flat().length;
  const displayName = user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "Athlete";

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#080808;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        input{-webkit-appearance:none;caret-color:#ff6b35;}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-track{background:#111;}
        ::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:2px;}
        button:not(:disabled):active{transform:scale(0.97);}
        .chip:hover{border-color:#444!important;}
      `}</style>

      {toast&&<div style={{...S.toast,background:toast.color}}>{toast.msg}</div>}
      {showAddModal&&<AddExerciseModal onSave={handleAddExercise} onClose={()=>setShowAddModal(false)} />}

      {/* Nav */}
      <nav style={S.nav}>
        <span style={S.logo}>IRON<span style={{color:"#ff6b35"}}>LOG</span></span>
        <div style={S.navRight}>
          {user.user_metadata?.avatar_url
            ? <img src={user.user_metadata.avatar_url} style={S.avatar} alt="avatar" referrerPolicy="no-referrer"/>
            : <span style={S.userBadge}>👤 {displayName}</span>
          }
          {[{v:"home",i:"🏠"},{v:"history",i:"📋"},{v:"analysis",i:"📈"},{v:"exercises",i:"⚙️"}].map(({v,i})=>(
            <button key={v} style={view===v?S.navActive:S.navBtn} onClick={()=>setView(v)}>{i}</button>
          ))}
          <button style={S.navBtn} onClick={logout} title="Sign out">↩</button>
        </div>
      </nav>

      <div style={S.page}>

        {/* ── HOME ─────────────────────────────────────────────────────────── */}
        {view==="home"&&(
          <div>
            <div style={{...S.hero,borderColor:TYPE_COLOR[suggested]+"44"}}>
              <div style={S.heroLabel}>HEY {displayName.toUpperCase()}, NEXT UP</div>
              <div style={{...S.heroType,color:TYPE_COLOR[suggested]}}>{suggested}</div>
              <div style={S.heroSub}>DAY</div>
              <div style={S.pillRow}>
                {["Push","Pull","Legs"].map(t=>(
                  <button key={t} onClick={()=>startSession(t)} style={{...S.startPill,background:t===suggested?TYPE_COLOR[t]:"#111",color:t===suggested?"#000":"#555",border:`1px solid ${t===suggested?TYPE_COLOR[t]:"#222"}`,fontWeight:t===suggested?800:500}}>
                    {t===suggested?"▶ ":""}{t}
                  </button>
                ))}
              </div>
            </div>
            <div style={S.statsRow}>
              {[{label:"TOTAL",value:sessions.length},{label:"THIS WEEK",value:weekCount},{label:"LAST",value:recent?recent.type:"—"},{label:"CUSTOM",value:totalCustom}].map(({label,value})=>(
                <div key={label} style={S.statBox}><div style={S.statVal}>{value}</div><div style={S.statLabel}>{label}</div></div>
              ))}
            </div>
            {recent&&(
              <div style={{...S.card,borderColor:TYPE_COLOR[recent.type]+"33"}}>
                <div style={S.cardHead}>
                  <span style={{...S.badge,background:TYPE_COLOR[recent.type],color:"#000"}}>{recent.type}</span>
                  <span style={S.cardDate}>{new Date(recent.date).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}</span>
                </div>
                {(recent.exercises||[]).map(ex=>(
                  <div key={ex.name} style={S.recentRow}>
                    <span style={S.recentName}>{ex.name}</span>
                    <span style={S.recentSets}>{(ex.sets||[]).map(s=>`${s.weight||"?"}×${s.reps}`).join(" · ")}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={S.tipBox}>
              <span>📈</span>
              <span style={{fontSize:12,color:"#555",lineHeight:1.5}}>Progressive overload: 6 → 8 → 10 reps → weight up, back to 6. Each set tracks independently.</span>
            </div>
          </div>
        )}

        {/* ── SESSION ──────────────────────────────────────────────────────── */}
        {view==="session"&&(
          <div>
            <div style={S.sessHead}>
              <div>
                <span style={{...S.badge,background:TYPE_COLOR[sessionType],color:"#000",fontSize:10}}>{sessionType}</span>
                <span style={{...S.sessTitle,color:TYPE_COLOR[sessionType]}}>{step==="pick"?" Select Exercises":" In Progress"}</span>
              </div>
              <button style={S.closeBtn} onClick={()=>setView("home")}>✕</button>
            </div>

            {step==="pick"?(
              <div>
                <div style={S.pickInfo}>
                  Choose 4–6 exercises
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{...S.pickCount,color:TYPE_COLOR[sessionType]}}>{selectedEx.length}/6</span>
                    <button style={{...S.addExBtn,borderColor:TYPE_COLOR[sessionType],color:TYPE_COLOR[sessionType]}} onClick={()=>setShowAddModal(true)}>+ Custom</button>
                  </div>
                </div>
                <div style={S.exGrid}>
                  {allExForDay.map(ex=>{
                    const sel=selectedEx.includes(ex.name), dis=!sel&&selectedEx.length>=6;
                    const hasHist=sessions.some(s=>s.exercises?.some(e=>e.name===ex.name));
                    return (
                      <button key={ex.name} className="chip" disabled={dis} onClick={()=>toggleExercise(ex.name)} style={{...S.exChip,background:sel?TYPE_DARK[sessionType]:"#0f0f0f",border:`1px solid ${sel?TYPE_COLOR[sessionType]:"#1e1e1e"}`,opacity:dis?0.3:1,cursor:dis?"not-allowed":"pointer"}}>
                        <div style={S.exChipName}>{ex.name}{ex.custom&&<span style={{fontSize:9,color:TYPE_COLOR[sessionType],marginLeft:4,fontWeight:700}}>CUSTOM</span>}</div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                          <span style={S.exChipEquip}>{ex.equipment}</span>
                          {hasHist&&<span style={{fontSize:10,color:TYPE_COLOR[sessionType],fontWeight:700}}>✓</span>}
                        </div>
                        <div style={S.exChipMuscle}>{[...ex.muscles,...(ex.secondary||[]).slice(0,1)].join(", ")}</div>
                      </button>
                    );
                  })}
                </div>
                <button style={{...S.confirmBtn,background:TYPE_COLOR[sessionType]}} onClick={confirmPick}>START SESSION →</button>
              </div>
            ):(
              <div>
                <div style={S.tabScroll}>
                  {selectedEx.map((name,i)=>{
                    const sets=loggedSets[name]||[], done=sets.every(s=>s.done), partial=sets.some(s=>s.done);
                    return <button key={name} onClick={()=>{setActiveExIdx(i);setShowTip(false);}} style={{...S.tab,background:activeExIdx===i?TYPE_COLOR[sessionType]+"22":"#0f0f0f",border:`1px solid ${activeExIdx===i?TYPE_COLOR[sessionType]:done?"#2a2a2a":"#1a1a1a"}`,color:done?"#2a4a2a":activeExIdx===i?TYPE_COLOR[sessionType]:"#555"}}>{done?"✓ ":partial?"· ":""}{name.split(" ")[0]}</button>;
                  })}
                </div>
                {activeExData&&(
                  <div style={S.exCard}>
                    <div style={S.exTop}>
                      <div style={S.exImage}>
                        {activeExData.imgId&&!imgErrors[activeExData.imgId]
                          ?<img src={imgSrc} alt={activeExName} style={S.exImg} onError={()=>setImgErrors(e=>({...e,[activeExData.imgId]:true}))}/>
                          :<div style={S.exImgFallback}><span style={{fontSize:32}}>🏋️</span></div>}
                      </div>
                      <div style={S.exInfo}>
                        <div style={S.exName}>{activeExName}{activeExData.custom&&<span style={{fontSize:10,color:TYPE_COLOR[sessionType],marginLeft:6,fontWeight:700,letterSpacing:1}}>CUSTOM</span>}</div>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:4}}>
                          <span style={{...S.muscleBadge,background:TYPE_COLOR[sessionType]+"22",color:TYPE_COLOR[sessionType]}}>{activeExData.muscles[0]}</span>
                          {(activeExData.secondary||[]).slice(0,2).map(m=><span key={m} style={S.muscleBadgeSec}>{m}</span>)}
                        </div>
                        <div style={{fontSize:11,color:"#444",marginBottom:6}}>{activeExData.equipment}</div>
                        {!activeExData.custom&&<button style={{...S.tipToggle,color:TYPE_COLOR[sessionType]}} onClick={()=>setShowTip(t=>!t)}>{showTip?"▲ Hide tip":"▼ Form tip"}</button>}
                      </div>
                    </div>
                    {showTip&&!activeExData.custom&&<div style={S.tipCard}>{activeExData.tip}</div>}
                    <div style={S.setHeader}>{["SET","KG","REPS","TARGET",""].map(h=><span key={h} style={S.setColLabel}>{h}</span>)}</div>
                    {(loggedSets[activeExName]||[]).map((set,si)=>{
                      const prog=getProgression(sessions,activeExName,si);
                      return (
                        <div key={si} style={{...S.setRow,opacity:set.done?0.5:1}}>
                          <div style={{...S.setNum,color:TYPE_COLOR[sessionType]}}>S{si+1}</div>
                          <input style={S.setInput} type="number" placeholder={prog.weight!==null?String(prog.weight):"kg"} value={set.weight} disabled={set.done} onChange={e=>updateSet(activeExName,si,"weight",e.target.value)}/>
                          <input style={S.setInput} type="number" value={set.reps} disabled={set.done} onChange={e=>updateSet(activeExName,si,"reps",e.target.value)}/>
                          <div style={S.targetReps}>×{set.targetReps}</div>
                          <button onClick={()=>!set.done&&markDone(activeExName,si)} style={{...S.logBtn,background:set.done?"#0a2a0a":TYPE_COLOR[sessionType],color:set.done?"#2a6a2a":"#000",border:`1px solid ${set.done?"#1a4a1a":TYPE_COLOR[sessionType]}`}}>{set.done?"✓":"LOG"}</button>
                        </div>
                      );
                    })}
                    {(()=>{const p=getProgression(sessions,activeExName,0);return <div style={S.progHint}><span>{p.phase==="weight-up"?"🔥":p.phase==="reps-up"?"📈":p.phase==="new"?"🆕":"🔄"}</span><span style={{fontSize:12,color:"#555"}}>{p.note}</span></div>;})()}
                  </div>
                )}
                <div style={S.exNav}>
                  <button style={S.exNavBtn} disabled={activeExIdx===0} onClick={()=>{setActiveExIdx(i=>i-1);setShowTip(false);}}>← Prev</button>
                  <button style={S.exNavBtn} disabled={activeExIdx===selectedEx.length-1} onClick={()=>{setActiveExIdx(i=>i+1);setShowTip(false);}}>Next →</button>
                </div>
                <button style={{...S.confirmBtn,background:TYPE_COLOR[sessionType]}} onClick={finishSession}>FINISH SESSION 💪</button>
              </div>
            )}
          </div>
        )}

        {/* ── HISTORY ──────────────────────────────────────────────────────── */}
        {view==="history"&&(
          <div>
            <div style={S.pageTitle}>SESSION LOG</div>
            {sessions.length===0?<div style={S.empty}>No sessions yet. Hit the gym! 🏋️</div>
              :[...sessions].reverse().map(s=>(
                <div key={s.id} style={{...S.card,borderColor:TYPE_COLOR[s.type]+"33",marginBottom:12}}>
                  <div style={S.cardHead}>
                    <span style={{...S.badge,background:TYPE_COLOR[s.type],color:"#000"}}>{s.type}</span>
                    <span style={S.cardDate}>{new Date(s.date).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"2-digit"})}</span>
                  </div>
                  {(s.exercises||[]).map(ex=>(
                    <div key={ex.name} style={S.recentRow}>
                      <span style={S.recentName}>{ex.name}</span>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {(ex.sets||[]).map((set,i)=>(
                          <span key={i} style={{fontSize:11,color:"#444",background:"#111",border:"1px solid #1a1a1a",padding:"2px 8px",borderRadius:6}}>
                            {set.weight||"?"}kg×{set.reps}<span style={{color:"#333"}}> t{set.targetReps||6}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            }
          </div>
        )}

        {/* ── ANALYSIS ─────────────────────────────────────────────────────── */}
        {view==="analysis"&&(
          <div>
            <div style={S.pageTitle}>PROGRESS</div>
            {sessions.length<2?<div style={S.empty}>Complete at least 2 sessions to see trends 📈</div>:(
              <div>
                <div style={{marginBottom:16}}>
                  <div style={S.label}>SELECT EXERCISE</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {getExerciseNames().map(name=>(
                      <button key={name} className="chip" onClick={()=>setAnalysisEx(name)} style={{...S.anaChip,background:analysisEx===name?"#1a1a1a":"#0f0f0f",border:`1px solid ${analysisEx===name?"#888":"#1e1e1e"}`,color:analysisEx===name?"#ddd":"#555"}}>{name}</button>
                    ))}
                  </div>
                </div>
                {analysisEx&&(()=>{
                  const maxes=getSessionMaxes(analysisEx),history=getExerciseHistory(analysisEx);
                  const best=Math.max(...maxes.map(m=>m.weight));
                  const gained=maxes.length>1?(maxes[maxes.length-1].weight-maxes[0].weight).toFixed(1):0;
                  const chartH=80,minW=Math.min(...maxes.map(m=>m.weight)),maxW=Math.max(...maxes.map(m=>m.weight)),range=maxW-minW||1;
                  const pts=maxes.map((m,i)=>({x:maxes.length===1?50:(i/(maxes.length-1))*100,y:chartH-((m.weight-minW)/range)*(chartH-10)-5,...m}));
                  const polyline=pts.map(p=>`${p.x},${p.y}`).join(" ");
                  return (
                    <div>
                      <div style={{display:"flex",gap:10,marginBottom:16}}>
                        {[{label:"BEST",value:`${best}kg`},{label:"GAINED",value:`+${gained}kg`},{label:"SESSIONS",value:maxes.length},{label:"SETS",value:history.length}].map(({label,value})=>(
                          <div key={label} style={{flex:1,background:"#0c0c0c",border:"1px solid #1a1a1a",borderRadius:10,padding:"12px 6px",textAlign:"center"}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:20,color:"#ddd"}}>{value}</div>
                            <div style={{fontSize:9,color:"#444",letterSpacing:2,marginTop:2,fontWeight:700}}>{label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{...S.card,marginBottom:12}}>
                        <div style={{fontSize:10,color:"#444",letterSpacing:2,fontWeight:700,marginBottom:12}}>WEIGHT OVER TIME (kg)</div>
                        <svg width="100%" height={chartH+20} viewBox={`0 0 100 ${chartH+20}`} preserveAspectRatio="none" style={{overflow:"visible"}}>
                          <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff6b35"/><stop offset="100%" stopColor="#ff6b35" stopOpacity="0"/></linearGradient></defs>
                          {[0,0.5,1].map(f=><line key={f} x1="0" y1={chartH-f*(chartH-10)-5} x2="100" y2={chartH-f*(chartH-10)-5} stroke="#1a1a1a" strokeWidth="0.5"/>)}
                          <polygon points={`0,${chartH} ${polyline} 100,${chartH}`} fill="url(#ag)" opacity="0.25"/>
                          <polyline points={polyline} fill="none" stroke="#ff6b35" strokeWidth="1.5" strokeLinejoin="round"/>
                          {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#ff6b35"/>)}
                          <text x="0" y={chartH+16} fontSize="3.5" fill="#444">{new Date(maxes[0]?.date).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</text>
                          {maxes.length>1&&<text x="100" y={chartH+16} fontSize="3.5" fill="#444" textAnchor="end">{new Date(maxes[maxes.length-1]?.date).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</text>}
                        </svg>
                      </div>
                      <div style={S.card}>
                        <div style={{fontSize:10,color:"#444",letterSpacing:2,fontWeight:700,marginBottom:12}}>ALL SETS LOGGED</div>
                        <div style={{maxHeight:260,overflowY:"auto"}}>
                          {[...history].reverse().slice(0,30).map((h,i)=>(
                            <div key={i} style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid #111",alignItems:"center"}}>
                              <span style={{fontSize:11,color:"#555"}}>{new Date(h.date).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</span>
                              <span style={{fontSize:11,color:"#555"}}>Set {h.setIndex+1}</span>
                              <span style={{fontSize:13,fontWeight:700,color:"#aaa"}}>{h.weight}kg×{h.reps}</span>
                              <span style={{fontSize:10,color:"#ff6b35"}}>~{h.e1rm}kg 1RM</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ── MY EXERCISES ─────────────────────────────────────────────────── */}
        {view==="exercises"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={S.pageTitle}>MY EXERCISES</div>
              <button style={{...S.addExBtn,borderColor:"#ff6b35",color:"#ff6b35",padding:"8px 14px",fontSize:13}} onClick={()=>setShowAddModal(true)}>+ Add Custom</button>
            </div>
            {["Push","Pull","Legs"].map(day=>{
              const customs=customEx[day]||[];
              return (
                <div key={day} style={{...S.card,marginBottom:12,borderColor:TYPE_COLOR[day]+"33"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:customs.length?12:0}}>
                    <span style={{...S.badge,background:TYPE_COLOR[day],color:"#000"}}>{day}</span>
                    <span style={{fontSize:12,color:"#444"}}>{customs.length?`${customs.length} custom`:"No custom exercises yet"}</span>
                  </div>
                  {customs.map(ex=>(
                    <div key={ex.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:8,borderTop:"1px solid #141414"}}>
                      <span style={{fontSize:13,color:"#ccc",fontWeight:600}}>{ex.name}</span>
                      <button onClick={()=>{if(window.confirm(`Remove "${ex.name}"?`))deleteCustomExercise(ex.id,day,ex.name);}} style={{background:"none",border:"1px solid #2a2a2a",color:"#555",fontSize:11,padding:"4px 10px",borderRadius:6,cursor:"pointer",fontFamily:"'Barlow',sans-serif"}}>Remove</button>
                    </div>
                  ))}
                </div>
              );
            })}
            <div style={{...S.card,marginTop:8,borderColor:"#1a1a1a"}}>
              <div style={{fontSize:10,color:"#444",letterSpacing:2,fontWeight:700,marginBottom:10}}>BUILT-IN EXERCISES</div>
              {["Push","Pull","Legs"].map(day=>(
                <div key={day} style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid #111"}}>
                  <span style={{...S.badge,background:TYPE_COLOR[day],color:"#000",fontSize:9}}>{day}</span>
                  <span style={{fontSize:12,color:"#555"}}>{BUILTIN_EXERCISES[day].length} exercises</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function Splash({text}) {
  return <div style={{minHeight:"100vh",background:"#080808",display:"flex",alignItems:"center",justifyContent:"center",color:"#444",fontFamily:"'Barlow',sans-serif",fontSize:15}}>{text}</div>;
}

const S={root:{minHeight:"100vh",background:"#080808",color:"#e8e4dc",fontFamily:"'Barlow',sans-serif",paddingBottom:60},nav:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",borderBottom:"1px solid #141414",position:"sticky",top:0,background:"#080808",zIndex:20,flexWrap:"wrap",gap:8},logo:{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:24,letterSpacing:2},navRight:{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"},avatar:{width:28,height:28,borderRadius:"50%",objectFit:"cover",marginRight:4},userBadge:{fontSize:12,color:"#555",fontWeight:600,marginRight:4},navBtn:{background:"none",border:"1px solid #1e1e1e",color:"#555",padding:"6px 10px",borderRadius:6,cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontSize:12,fontWeight:500},navActive:{background:"#141414",border:"1px solid #333",color:"#ddd",padding:"6px 10px",borderRadius:6,cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontSize:12,fontWeight:600},page:{padding:"18px 16px 0",maxWidth:520,margin:"0 auto"},toast:{position:"fixed",top:70,left:"50%",transform:"translateX(-50%)",padding:"10px 20px",borderRadius:30,color:"#000",fontWeight:700,fontSize:13,zIndex:100,whiteSpace:"nowrap",boxShadow:"0 4px 24px rgba(0,0,0,0.6)",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1},hero:{background:"#0c0c0c",border:"1px solid #1a1a1a",borderRadius:16,padding:"24px 20px 18px",marginBottom:14},heroLabel:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:3,color:"#444",marginBottom:4},heroType:{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:66,lineHeight:0.9,letterSpacing:-1},heroSub:{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:66,lineHeight:0.9,color:"#161616",marginBottom:20},pillRow:{display:"flex",gap:8,marginTop:20},startPill:{flex:1,padding:"11px 0",borderRadius:8,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,letterSpacing:1,transition:"all 0.1s",border:"none"},statsRow:{display:"flex",gap:8,marginBottom:14},statBox:{flex:1,background:"#0c0c0c",border:"1px solid #141414",borderRadius:10,padding:"12px 6px",textAlign:"center"},statVal:{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:24,color:"#ddd"},statLabel:{fontSize:9,color:"#444",letterSpacing:1.5,marginTop:2,fontWeight:700},card:{background:"#0c0c0c",border:"1px solid #1a1a1a",borderRadius:12,padding:14},cardHead:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10},badge:{display:"inline-block",fontSize:10,fontWeight:800,letterSpacing:2,padding:"3px 10px",borderRadius:20,fontFamily:"'Barlow Condensed',sans-serif"},cardDate:{fontSize:12,color:"#444"},recentRow:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",paddingTop:8,borderTop:"1px solid #141414",gap:8},recentName:{fontSize:12,color:"#888",fontWeight:600,flexShrink:0,maxWidth:"45%"},recentSets:{fontSize:11,color:"#444",textAlign:"right"},tipBox:{background:"#0c0c0c",border:"1px solid #141414",borderRadius:10,padding:"11px 14px",display:"flex",gap:10,alignItems:"flex-start",marginTop:14},sessHead:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18},sessTitle:{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:20,letterSpacing:1},closeBtn:{background:"#141414",border:"1px solid #222",color:"#666",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:13,fontWeight:600},pickInfo:{fontSize:13,color:"#666",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"},pickCount:{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:20},addExBtn:{background:"none",border:"1px solid",borderRadius:6,cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:11,padding:"5px 10px"},exGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18},exChip:{padding:"11px 10px",borderRadius:10,textAlign:"left",fontFamily:"'Barlow',sans-serif",transition:"border-color 0.1s"},exChipName:{fontSize:12,fontWeight:600,color:"#ccc",marginBottom:4,lineHeight:1.2},exChipEquip:{fontSize:10,color:"#444",fontWeight:500},exChipMuscle:{fontSize:10,color:"#333"},confirmBtn:{width:"100%",padding:"15px",border:"none",color:"#000",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:19,letterSpacing:2,borderRadius:10,cursor:"pointer"},tabScroll:{display:"flex",gap:6,overflowX:"auto",paddingBottom:10,marginBottom:14},tab:{padding:"6px 11px",borderRadius:20,cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontSize:11,fontWeight:600,whiteSpace:"nowrap",flexShrink:0,transition:"all 0.1s"},exCard:{background:"#0c0c0c",border:"1px solid #1a1a1a",borderRadius:14,padding:14,marginBottom:12},exTop:{display:"flex",gap:12,marginBottom:14},exImage:{width:100,height:75,borderRadius:10,overflow:"hidden",background:"#141414",flexShrink:0},exImg:{width:"100%",height:"100%",objectFit:"cover"},exImgFallback:{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"#141414"},exInfo:{flex:1},exName:{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:17,lineHeight:1.2,marginBottom:6,color:"#ddd"},muscleBadge:{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,letterSpacing:0.5},muscleBadgeSec:{fontSize:10,color:"#444",background:"#141414",padding:"2px 8px",borderRadius:20},tipToggle:{fontSize:11,background:"none",border:"none",cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontWeight:600,padding:0},tipCard:{background:"#111",border:"1px solid #1e1e1e",borderRadius:8,padding:"10px 12px",fontSize:12,color:"#666",lineHeight:1.5,marginBottom:12},setHeader:{display:"grid",gridTemplateColumns:"28px 1fr 1fr 50px 50px",gap:6,marginBottom:6,paddingBottom:6,borderBottom:"1px solid #141414"},setColLabel:{fontSize:9,color:"#333",fontWeight:700,letterSpacing:1,textAlign:"center"},setRow:{display:"grid",gridTemplateColumns:"28px 1fr 1fr 50px 50px",gap:6,alignItems:"center",marginBottom:8},setNum:{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,textAlign:"center"},setInput:{background:"#141414",border:"1px solid #222",borderRadius:8,padding:"10px 6px",color:"#ddd",fontSize:15,fontWeight:700,fontFamily:"'Barlow',sans-serif",textAlign:"center",width:"100%",outline:"none"},targetReps:{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,color:"#444",textAlign:"center"},logBtn:{padding:"10px 4px",borderRadius:8,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,letterSpacing:1,textAlign:"center"},progHint:{display:"flex",gap:8,alignItems:"flex-start",paddingTop:10,borderTop:"1px solid #141414",marginTop:4,fontSize:12},exNav:{display:"flex",gap:10,marginBottom:10},exNavBtn:{flex:1,padding:"11px",background:"#0f0f0f",border:"1px solid #1e1e1e",color:"#888",borderRadius:8,cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontSize:13,fontWeight:600},pageTitle:{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:34,letterSpacing:1,marginBottom:16},empty:{color:"#444",textAlign:"center",padding:"48px 0",fontSize:16},label:{fontSize:10,color:"#444",letterSpacing:2,fontWeight:700,marginBottom:8,display:"block"},anaChip:{padding:"6px 12px",borderRadius:20,cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontSize:12,fontWeight:500,transition:"all 0.1s"}};
