import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase.js";

const IMAGE_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";
const BUILTIN_EXERCISES = {"Push":[{"name":"Alternating Cable Shoulder Press","equipment":"cable","muscles":["shoulders"],"secondary":["triceps"],"tip":"Move the cables to the bottom of the tower. Press alternately overhead with control, keeping core tight.","imgId":"Alternating_Cable_Shoulder_Press"},{"name":"Arnold Dumbbell Press","equipment":"dumbbell","muscles":["shoulders"],"secondary":["triceps"],"tip":"Palms facing you at chest. Rotate outward as you press overhead. Reverse on descent.","imgId":"Arnold_Dumbbell_Press"},{"name":"Barbell Bench Press","equipment":"barbell","muscles":["chest"],"secondary":["shoulders","triceps"],"tip":"Medium grip, lower bar to mid-chest, press up explosively. Keep shoulder blades retracted.","imgId":"Barbell_Bench_Press_-_Medium_Grip"},{"name":"Barbell Incline Bench Press","equipment":"barbell","muscles":["chest"],"secondary":["shoulders","triceps"],"tip":"Incline bench, medium grip. Lower to upper chest and press. Keep core tight.","imgId":"Barbell_Incline_Bench_Press_-_Medium_Grip"},{"name":"Barbell Shoulder Press","equipment":"barbell","muscles":["shoulders"],"secondary":["chest","triceps"],"tip":"Grip just wider than shoulders, press bar overhead, lower to chin. Don't over-arch.","imgId":"Barbell_Shoulder_Press"},{"name":"Cable Chest Press","equipment":"cable","muscles":["chest"],"secondary":["shoulders","triceps"],"tip":"Upper arms 45 degrees to body. Press forward and squeeze chest at extension.","imgId":"Cable_Chest_Press"},{"name":"Close-Grip Barbell Bench Press","equipment":"barbell","muscles":["triceps"],"secondary":["chest","shoulders"],"tip":"Shoulder-width grip. Lower to mid-chest, elbows close to body. Great tricep compound.","imgId":"Close-Grip_Barbell_Bench_Press"},{"name":"Clean and Press","equipment":"barbell","muscles":["shoulders"],"secondary":["abdominals","calves"],"tip":"Deadlift explosively, clean to shoulders, press overhead. Use moderate weight.","imgId":"Clean_and_Press"},{"name":"Cable Shoulder Press","equipment":"cable","muscles":["shoulders"],"secondary":["triceps"],"tip":"Cables at bottom. Grab at shoulder height, press overhead. Constant tension throughout.","imgId":"Cable_Shoulder_Press"},{"name":"Cable Rope Rear-Delt Rows","equipment":"cable","muscles":["shoulders"],"secondary":["biceps","middle back"],"tip":"Sit at low pulley, use rope. Pull to face keeping elbows high, squeeze rear delts at peak.","imgId":"Cable_Rope_Rear-Delt_Rows"},{"name":"Bent-Arm Dumbbell Pullover","equipment":"dumbbell","muscles":["chest"],"secondary":["lats","shoulders"],"tip":"Lie across flat bench, dumbbell overhead. Lower behind head, elbows slightly bent.","imgId":"Bent-Arm_Dumbbell_Pullover"},{"name":"Bradford/Rocky Presses","equipment":"barbell","muscles":["shoulders"],"secondary":["triceps"],"tip":"Alternate pressing over head then behind neck. Continuous motion, no lockout.","imgId":"Bradford_Rocky_Presses"}],"Pull":[{"name":"Barbell Deadlift","equipment":"barbell","muscles":["lower back"],"secondary":["calves","forearms"],"tip":"Shoulder-width stance. Hinge at hips and knees, grip bar, drive through heels to stand.","imgId":"Barbell_Deadlift"},{"name":"Bent Over Barbell Row","equipment":"barbell","muscles":["middle back"],"secondary":["biceps","lats"],"tip":"Hinge forward, back straight. Pull bar to lower chest/upper abs. Squeeze shoulder blades at top.","imgId":"Bent_Over_Barbell_Row"},{"name":"Close-Grip Front Lat Pulldown","equipment":"cable","muscles":["lats"],"secondary":["biceps","middle back"],"tip":"Pull bar to upper chest, leaning back slightly. Squeeze lats, return with control.","imgId":"Close-Grip_Front_Lat_Pulldown"},{"name":"Drag Curl","equipment":"barbell","muscles":["biceps"],"secondary":["forearms"],"tip":"Drag bar up your torso keeping elbows behind you. Maximizes bicep peak contraction.","imgId":"Drag_Curl"},{"name":"Elevated Cable Rows","equipment":"cable","muscles":["lats"],"secondary":["middle back","traps"],"tip":"Pull to waist keeping elbows close to sides. Full stretch at extension.","imgId":"Elevated_Cable_Rows"},{"name":"Full Range Lat Pulldown","equipment":"cable","muscles":["lats"],"secondary":["biceps","middle back"],"tip":"From high cables, pull hands together and down engaging lats fully.","imgId":"Full_Range-Of-Motion_Lat_Pulldown"},{"name":"High Cable Curls","equipment":"cable","muscles":["biceps"],"secondary":[],"tip":"Arms parallel to floor. Curl handles toward your head — peak contraction isolation.","imgId":"High_Cable_Curls"},{"name":"Dumbbell Incline Row","equipment":"dumbbell","muscles":["middle back"],"secondary":["biceps","forearms"],"tip":"Chest-down on incline bench. Row to sides of chest, squeeze mid-back at top.","imgId":"Dumbbell_Incline_Row"},{"name":"Leverage High Row","equipment":"machine","muscles":["middle back"],"secondary":["lats"],"tip":"Pull down with pronated grip, leading with elbows. Controlled eccentric.","imgId":"Leverage_High_Row"},{"name":"Leverage Iso Row","equipment":"machine","muscles":["lats"],"secondary":["biceps","middle back"],"tip":"Chest against pad, handles at chest level. Each arm works independently.","imgId":"Leverage_Iso_Row"},{"name":"Lying T-Bar Row","equipment":"machine","muscles":["middle back"],"secondary":["biceps","lats"],"tip":"Face-down on T-bar. Pull weight up, elbows flared, squeeze mid-back. Chest on pad.","imgId":"Lying_T-Bar_Row"},{"name":"Kneeling High Pulley Row","equipment":"cable","muscles":["lats"],"secondary":["biceps","middle back"],"tip":"Kneel facing high pulley. Pull rope to forehead keeping elbows wide.","imgId":"Kneeling_High_Pulley_Row"},{"name":"Bent Over Two-Dumbbell Row","equipment":"dumbbell","muscles":["middle back"],"secondary":["biceps","lats"],"tip":"Hinge forward with dumbbells hanging. Row both up to sides simultaneously.","imgId":"Bent_Over_Two-Dumbbell_Row"}],"Legs":[{"name":"Barbell Squat","equipment":"barbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Bar on upper traps. Feet shoulder-width, toes out. Squat to parallel, drive through heels.","imgId":"Barbell_Squat"},{"name":"Barbell Full Squat","equipment":"barbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Descend below parallel. Greater glute and hamstring involvement. Requires good mobility.","imgId":"Barbell_Full_Squat"},{"name":"Barbell Hack Squat","equipment":"barbell","muscles":["quadriceps"],"secondary":["calves","forearms"],"tip":"Hold barbell behind legs at arms length. Squat keeping back straight. Emphasizes quad sweep.","imgId":"Barbell_Hack_Squat"},{"name":"Barbell Lunge","equipment":"barbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Bar on back, step forward into lunge. Back knee near floor. Alternate legs.","imgId":"Barbell_Lunge"},{"name":"Barbell Walking Lunge","equipment":"barbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Walk forward with alternating lunges. Torso upright, knee tracks over toe.","imgId":"Barbell_Walking_Lunge"},{"name":"Barbell Step Ups","equipment":"barbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Bar on back, step onto elevated platform. Drive through heel of lead leg.","imgId":"Barbell_Step_Ups"},{"name":"Cable Deadlifts","equipment":"cable","muscles":["quadriceps"],"secondary":["forearms","glutes"],"tip":"Stand between cable towers. Hinge at hips and knees. Drive through heels. Constant tension.","imgId":"Cable_Deadlifts"},{"name":"Dumbbell Lunges","equipment":"dumbbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Hold dumbbells at sides. Step forward, lower back knee toward floor. Push back to start.","imgId":"Dumbbell_Lunges"},{"name":"Dumbbell Squat","equipment":"dumbbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Dumbbells at sides, feet shoulder-width. Squat to parallel keeping chest up.","imgId":"Dumbbell_Squat"},{"name":"Dumbbell Step Ups","equipment":"dumbbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Hold dumbbells, step onto box. Fully extend lead leg at top, step down with control.","imgId":"Dumbbell_Step_Ups"},{"name":"Dumbbell Clean","equipment":"dumbbell","muscles":["hamstrings"],"secondary":["calves","forearms"],"tip":"Dumbbells at sides, hip-width stance. Explosively drive hips forward and clean to shoulders.","imgId":"Dumbbell_Clean"},{"name":"Dumbbell Rear Lunge","equipment":"dumbbell","muscles":["quadriceps"],"secondary":["calves","glutes"],"tip":"Step backward into lunge. Easier on knees, great for balance and glute emphasis.","imgId":"Dumbbell_Rear_Lunge"},{"name":"Elevated Back Lunge","equipment":"barbell","muscles":["quadriceps"],"secondary":["glutes","hamstrings"],"tip":"Front foot on raised platform, barbell on back. Deep range lunge for maximum quad stretch.","imgId":"Elevated_Back_Lunge"},{"name":"Box Squat with Chains","equipment":"barbell","muscles":["quadriceps"],"secondary":["abductors","adductors"],"tip":"Squat to box behind you, pause briefly, drive up explosively.","imgId":"Box_Squat_with_Chains"}]};

const TC = { Push:"#FF6B35", Pull:"#3B9EFF", Legs:"#22C55E" };
const TG = { Push:"linear-gradient(135deg,#FF6B35,#FF8C42)", Pull:"linear-gradient(135deg,#3B9EFF,#60B4FF)", Legs:"linear-gradient(135deg,#22C55E,#4ADE80)" };
const TBG = { Push:"rgba(255,107,53,0.08)", Pull:"rgba(59,158,255,0.08)", Legs:"rgba(34,197,94,0.08)" };

function getProgression(sessions, exName, setIndex) {
  const history = sessions.map(s=>s.exercises?.find(e=>e.name===exName)?.sets?.[setIndex]).filter(Boolean);
  if (!history.length) return {weight:null,reps:6,targetReps:6,note:"First time — pick a comfortable weight",phase:"new"};
  const last=history[history.length-1], lastW=parseFloat(last.weight)||0, lastR=parseInt(last.reps)||0, lastTgt=parseInt(last.targetReps)||6;
  if (!lastW) return {weight:null,reps:6,targetReps:6,note:"Log a weight to start tracking",phase:"new"};
  if (lastR>=lastTgt) {
    if (lastTgt>=10) { const bump=lastW>=60?5:2.5; return {weight:lastW+bump,reps:6,targetReps:6,note:`🔥 Increase to ${lastW+bump}kg — you crushed 10 reps!`,phase:"weight-up"}; }
    const nextT=lastTgt===6?8:10;
    return {weight:lastW,reps:nextT,targetReps:nextT,note:`📈 Great work! Now aim for ${nextT} reps`,phase:"reps-up"};
  }
  return {weight:lastW,reps:lastTgt,targetReps:lastTgt,note:`Keep at ${lastW}kg — hit ${lastTgt} reps to progress`,phase:"hold"};
}

function AddExerciseModal({onSave,onClose}) {
  const [name,setName]=useState(""), [day,setDay]=useState("Push"), [error,setError]=useState("");
  function save() { const n=name.trim(); if(!n||n.length<2){setError("Enter a valid name");return;} onSave({name:n,day}); }
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}}>
      <div style={{width:"100%",maxWidth:380,background:"#1C1C1E",borderRadius:24,padding:28,boxShadow:"0 24px 60px rgba(0,0,0,0.5)"}}>
        <div style={{fontSize:20,fontWeight:700,marginBottom:6,color:"#fff"}}>Add Custom Exercise</div>
        <div style={{fontSize:14,color:"#888",marginBottom:24}}>It'll appear in your exercise picker and track progression just like built-in ones.</div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:12,color:"#888",fontWeight:600,marginBottom:8,letterSpacing:1}}>EXERCISE NAME</div>
          <input style={{width:"100%",background:"#2C2C2E",border:"1.5px solid #3A3A3C",borderRadius:12,padding:"13px 16px",color:"#fff",fontSize:15,outline:"none",fontFamily:"inherit"}}
            value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Cable Crunch, Nordic Curl..." autoFocus onKeyDown={e=>e.key==="Enter"&&save()} />
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:12,color:"#888",fontWeight:600,marginBottom:8,letterSpacing:1}}>WORKOUT DAY</div>
          <div style={{display:"flex",gap:8}}>
            {["Push","Pull","Legs"].map(d=>(
              <button key={d} onClick={()=>setDay(d)} style={{flex:1,padding:"12px 0",borderRadius:12,border:`2px solid ${day===d?TC[d]:"#3A3A3C"}`,background:day===d?TBG[d]:"transparent",color:day===d?TC[d]:"#888",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>{d}</button>
            ))}
          </div>
        </div>
        {error&&<div style={{background:"rgba(255,59,48,0.1)",border:"1px solid rgba(255,59,48,0.3)",borderRadius:10,padding:"10px 14px",color:"#FF3B30",fontSize:13,marginBottom:16}}>{error}</div>}
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:"13px",background:"#2C2C2E",border:"none",borderRadius:12,color:"#888",fontWeight:600,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          <button onClick={save} style={{flex:2,padding:"13px",background:TG[day],border:"none",borderRadius:12,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>Add Exercise</button>
        </div>
      </div>
    </div>
  );
}

function AuthScreen() {
  const [loading,setLoading]=useState(false), [error,setError]=useState("");
  async function signIn() {
    setLoading(true); setError("");
    const {error} = await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:"https://gym-workout-bay.vercel.app"}});
    if (error) { setError(error.message); setLoading(false); }
  }
  return (
    <div style={{minHeight:"100vh",background:"#000",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div style={{width:"100%",maxWidth:400,textAlign:"center"}}>
        <div style={{fontSize:56,fontWeight:900,letterSpacing:-2,marginBottom:8}}>
          <span style={{color:"#fff"}}>Iron</span><span style={{background:"linear-gradient(135deg,#FF6B35,#FF8C42)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Log</span>
        </div>
        <div style={{fontSize:18,color:"#888",marginBottom:48,fontWeight:400}}>Your personal lifting companion</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:40}}>
          {[{e:"📈",t:"Progressive Overload",d:"Auto-tracks your 6→8→10 rep progression"},{e:"🏋️",t:"40+ Exercises",d:"With animated visuals and form tips"},{e:"👥",t:"Multi-user",d:"Each friend has their own private data"},{e:"📊",t:"Progress Charts",d:"See your strength gains over time"}].map(f=>(
            <div key={f.t} style={{background:"#111",borderRadius:16,padding:16,textAlign:"left",border:"1px solid #222"}}>
              <div style={{fontSize:24,marginBottom:8}}>{f.e}</div>
              <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:4}}>{f.t}</div>
              <div style={{fontSize:12,color:"#666",lineHeight:1.4}}>{f.d}</div>
            </div>
          ))}
        </div>
        {error&&<div style={{background:"rgba(255,59,48,0.1)",border:"1px solid rgba(255,59,48,0.3)",borderRadius:12,padding:"12px 16px",color:"#FF3B30",fontSize:14,marginBottom:16}}>{error}</div>}
        <button onClick={signIn} disabled={loading} style={{width:"100%",padding:"16px",background:"#fff",border:"none",borderRadius:16,color:"#000",fontWeight:700,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:12,fontFamily:"inherit",opacity:loading?0.7:1,transition:"opacity 0.2s"}}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {loading ? "Redirecting..." : "Continue with Google"}
        </button>
        <div style={{fontSize:12,color:"#444",marginTop:20,lineHeight:1.6}}>Your workout data is private and only visible to you.</div>
      </div>
    </div>
  );
}

export default function App() {
  const [user,setUser]=useState(null), [authLoading,setAuthLoading]=useState(true);
  const [sessions,setSessions]=useState([]), [customEx,setCustomEx]=useState({Push:[],Pull:[],Legs:[]});
  const [lastType,setLastType]=useState(null), [dbLoading,setDbLoading]=useState(false);
  const [view,setView]=useState("home"), [sessionType,setSessionType]=useState(null);
  const [step,setStep]=useState("pick"), [selectedEx,setSelectedEx]=useState([]);
  const [loggedSets,setLoggedSets]=useState({}), [activeExIdx,setActiveExIdx]=useState(0);
  const [toast,setToast]=useState(null), [imgErrors,setImgErrors]=useState({});
  const [showTip,setShowTip]=useState(false), [imgFrame,setImgFrame]=useState({});
  const [analysisEx,setAnalysisEx]=useState(null), [showAddModal,setShowAddModal]=useState(false);
  const animRef=useRef({});

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setUser(session?.user??null);setAuthLoading(false);});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{setUser(session?.user??null);setAuthLoading(false);});
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    if (!user){setSessions([]);setCustomEx({Push:[],Pull:[],Legs:[]});setLastType(null);return;}
    setDbLoading(true);
    Promise.all([
      supabase.from("sessions").select("*").order("date",{ascending:true}),
      supabase.from("custom_exercises").select("*"),
      supabase.from("user_meta").select("*").eq("user_id",user.id).single()
    ]).then(([s,c,m])=>{
      setSessions(s.data||[]);
      const g={Push:[],Pull:[],Legs:[]};
      (c.data||[]).forEach(e=>{if(g[e.day])g[e.day].push(e);});
      setCustomEx(g); setLastType(m.data?.last_type||null); setDbLoading(false);
    });
  },[user]);

  useEffect(()=>{
    if (view!=="session"||step!=="log") return;
    const ex=mergedEx(sessionType).find(e=>e.name===selectedEx[activeExIdx]);
    if (!ex?.imgId) return;
    clearInterval(animRef.current[ex.imgId]);
    animRef.current[ex.imgId]=setInterval(()=>setImgFrame(f=>({...f,[ex.imgId]:f[ex.imgId]===1?0:1})),1200);
    return ()=>clearInterval(animRef.current[ex.imgId]);
  },[activeExIdx,view,step,sessionType]);

  const toast2=(msg,color="#3B9EFF")=>{setToast({msg,color});setTimeout(()=>setToast(null),2800);};

  function mergedEx(type) {
    if (!type) return [];
    return [...(BUILTIN_EXERCISES[type]||[]),(customEx[type]||[]).map(c=>({name:c.name,equipment:"custom",muscles:["custom"],secondary:[],tip:"",imgId:null,custom:true,dbId:c.id}))];
  }

  async function handleAddExercise({name,day}) {
    if (mergedEx(day).some(e=>e.name.toLowerCase()===name.toLowerCase())) {toast2("Already exists","#FF3B30");return;}
    const {data,error}=await supabase.from("custom_exercises").insert({user_id:user.id,name,day}).select().single();
    if (error){toast2("Failed to save","#FF3B30");return;}
    setCustomEx(prev=>({...prev,[day]:[...prev[day],data]}));
    toast2(`"${name}" added to ${day}! 💪`,TC[day]); setShowAddModal(false);
  }

  async function deleteCustomExercise(dbId,day) {
    await supabase.from("custom_exercises").delete().eq("id",dbId);
    setCustomEx(prev=>({...prev,[day]:prev[day].filter(e=>e.id!==dbId)}));
    toast2("Exercise removed","#FF3B30");
  }

  async function logout(){await supabase.auth.signOut();setUser(null);setView("home");}

  function startSession(type){setSessionType(type);setSelectedEx([]);setLoggedSets({});setActiveExIdx(0);setStep("pick");setShowTip(false);setView("session");}
  function toggleEx(name){setSelectedEx(p=>p.includes(name)?p.filter(n=>n!==name):p.length<6?[...p,name]:p);}

  function confirmPick(){
    if (selectedEx.length<2){toast2("Pick at least 2 exercises","#FF3B30");return;}
    const init={};
    selectedEx.forEach(name=>{init[name]=[0,1,2].map(si=>{const p=getProgression(sessions,name,si);return {weight:p.weight!==null?String(p.weight):"",reps:String(p.reps),targetReps:p.targetReps,done:false};});});
    setLoggedSets(init);setStep("log");setActiveExIdx(0);setShowTip(false);
  }

  function updateSet(name,si,field,val){setLoggedSets(p=>{const u={...p};u[name]=u[name].map((s,i)=>i===si?{...s,[field]:val}:s);return u;});}

  function markDone(name,si){
    const set=loggedSets[name][si];
    if (!set.weight){toast2("Enter a weight first","#FF3B30");return;}
    setLoggedSets(p=>{const u={...p};u[name]=u[name].map((s,i)=>i===si?{...s,done:true}:s);return u;});
    const r=parseInt(set.reps),t=set.targetReps;
    toast2(r>=t?(t===10?"🔥 Weight goes up next session!":"✅ Reps go up next session!"):"Logged! Push harder next time 💪");
  }

  async function finishSession(){
    const exLog=selectedEx.map(name=>({name,sets:(loggedSets[name]||[]).map(s=>({...s}))}));
    const {data:ns}=await supabase.from("sessions").insert({user_id:user.id,type:sessionType,date:new Date().toISOString(),exercises:exLog}).select().single();
    if (ns) setSessions(p=>[...p,ns]);
    await supabase.from("user_meta").upsert({user_id:user.id,last_type:sessionType},{onConflict:"user_id"});
    setLastType(sessionType); toast2(`${sessionType} day saved! Great work 💪`,TC[sessionType]); setView("home");
  }

  function getExNames(){const names=new Set();sessions.forEach(sess=>sess.exercises?.forEach(e=>names.add(e.name)));return[...names].sort();}
  function getMaxes(name){const b={};sessions.forEach(sess=>{const ex=sess.exercises?.find(e=>e.name===name);if(!ex)return;const best=ex.sets.reduce((m,set)=>{const w=parseFloat(set.weight)||0;return w>m?w:m;},0);if(best>0)b[sess.date]={weight:best,type:sess.type};});return Object.entries(b).map(([date,{weight,type}])=>({date,weight,type})).sort((a,b)=>new Date(a.date)-new Date(b.date));}
  function getHistory(name){const p=[];sessions.forEach(sess=>{const ex=sess.exercises?.find(e=>e.name===name);if(!ex)return;ex.sets.forEach((set,si)=>{const w=parseFloat(set.weight),r=parseInt(set.reps);if(w&&r)p.push({date:sess.date,setIndex:si,weight:w,reps:r,e1rm:Math.round(w*(1+r/30)*10)/10});});});return p;}

  if (authLoading) return <Splash/>;
  if (!user) return <AuthScreen/>;
  if (dbLoading) return <Splash name={user.user_metadata?.full_name?.split(" ")[0]}/>;

  const suggested={Push:"Pull",Pull:"Legs",Legs:"Push"}[lastType]||"Push";
  const allEx=mergedEx(sessionType);
  const activeExName=selectedEx[activeExIdx];
  const activeExData=allEx.find(e=>e.name===activeExName);
  const imgSrc=activeExData?.imgId?`${IMAGE_BASE}/${activeExData.imgId}/${imgFrame[activeExData.imgId]??0}.jpg`:null;
  const weekCount=sessions.filter(s=>new Date(s.date)>new Date(Date.now()-7*86400000)).length;
  const recent=sessions.length?sessions[sessions.length-1]:null;
  const name=user.user_metadata?.full_name?.split(" ")[0]||user.email?.split("@")[0]||"Athlete";
  const totalCustom=Object.values(customEx).flat().length;
  const NAV=[{v:"home",i:"🏠",l:"Home"},{v:"history",i:"📋",l:"History"},{v:"analysis",i:"📈",l:"Progress"},{v:"exercises",i:"⚙️",l:"Exercises"}];

  return (
    <div style={{minHeight:"100vh",background:"#000",color:"#fff",fontFamily:"'Inter',system-ui,sans-serif",paddingBottom:80}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#000;overscroll-behavior:none;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        input{-webkit-appearance:none;}
        ::-webkit-scrollbar{display:none;}
        button{transition:opacity 0.15s,transform 0.1s;}
        button:active{opacity:0.8;transform:scale(0.97);}
        .chip:hover{opacity:0.85;}
      `}</style>

      {toast&&(
        <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:toast.color,color:"#fff",padding:"12px 20px",borderRadius:30,fontWeight:600,fontSize:14,zIndex:300,whiteSpace:"nowrap",boxShadow:"0 8px 32px rgba(0,0,0,0.4)",backdropFilter:"blur(10px)"}}>
          {toast.msg}
        </div>
      )}
      {showAddModal&&<AddExerciseModal onSave={handleAddExercise} onClose={()=>setShowAddModal(false)}/>}

      {/* Top nav */}
      <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(20px)",borderBottom:"1px solid #111",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontWeight:900,fontSize:22,letterSpacing:-0.5}}>
          Iron<span style={{background:"linear-gradient(135deg,#FF6B35,#FF8C42)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Log</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {user.user_metadata?.avatar_url
            ?<img src={user.user_metadata.avatar_url} style={{width:32,height:32,borderRadius:"50%",objectFit:"cover",border:"2px solid #222"}} referrerPolicy="no-referrer"/>
            :<div style={{width:32,height:32,borderRadius:"50%",background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>👤</div>
          }
          <span style={{fontSize:14,color:"#888",fontWeight:500}}>{name}</span>
          <button onClick={logout} style={{background:"#1C1C1E",border:"none",color:"#888",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:500,fontFamily:"inherit"}}>Sign out</button>
        </div>
      </div>

      {/* Bottom tab bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:50,background:"rgba(0,0,0,0.9)",backdropFilter:"blur(20px)",borderTop:"1px solid #111",display:"flex",padding:"8px 0 12px"}}>
        {NAV.map(({v,i,l})=>(
          <button key={v} onClick={()=>setView(v)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 0",fontFamily:"inherit"}}>
            <span style={{fontSize:20}}>{i}</span>
            <span style={{fontSize:10,fontWeight:600,color:view===v?"#fff":"#555",letterSpacing:0.5}}>{l.toUpperCase()}</span>
            {view===v&&<div style={{width:4,height:4,borderRadius:"50%",background:TC[suggested]}}/>}
          </button>
        ))}
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"20px 16px 0"}}>

        {/* ── HOME ─────────────────────────────────────────────── */}
        {view==="home"&&(
          <div>
            {/* Hero card */}
            <div style={{background:`linear-gradient(135deg, ${TC[suggested]}22, ${TC[suggested]}08)`,border:`1px solid ${TC[suggested]}33`,borderRadius:24,padding:"28px 24px",marginBottom:16,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",right:-20,top:-20,width:150,height:150,borderRadius:"50%",background:`${TC[suggested]}08`}}/>
              <div style={{fontSize:13,color:TC[suggested],fontWeight:600,marginBottom:6,letterSpacing:0.5}}>HEY {name.toUpperCase()}, NEXT UP</div>
              <div style={{fontSize:52,fontWeight:900,color:"#fff",letterSpacing:-2,marginBottom:4}}>{suggested}</div>
              <div style={{fontSize:14,color:"#666",marginBottom:24}}>Push → Pull → Legs rotation</div>
              <div style={{display:"flex",gap:10}}>
                {["Push","Pull","Legs"].map(t=>(
                  <button key={t} onClick={()=>startSession(t)} className="chip" style={{flex:1,padding:"13px 0",borderRadius:14,border:`1.5px solid ${t===suggested?TC[t]:"#2C2C2E"}`,background:t===suggested?TG[t]:"#111",color:t===suggested?"#fff":"#555",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
              {[{l:"Total",v:sessions.length,e:"🏋️"},{l:"This Week",v:weekCount,e:"📅"},{l:"Last",v:recent?recent.type:"—",e:"⏱️"},{l:"Custom",v:totalCustom,e:"✏️"}].map(({l,v,e})=>(
                <div key={l} style={{background:"#111",borderRadius:16,padding:"14px 10px",textAlign:"center",border:"1px solid #1C1C1E"}}>
                  <div style={{fontSize:18,marginBottom:4}}>{e}</div>
                  <div style={{fontSize:20,fontWeight:800,color:"#fff"}}>{v}</div>
                  <div style={{fontSize:10,color:"#555",fontWeight:600,marginTop:2,letterSpacing:0.5}}>{l.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Recent session */}
            {recent&&(
              <div style={{background:"#111",borderRadius:20,padding:20,marginBottom:16,border:"1px solid #1C1C1E"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{background:TG[recent.type],borderRadius:10,padding:"4px 12px",fontSize:12,fontWeight:700,color:"#fff"}}>{recent.type}</div>
                    <span style={{fontSize:13,color:"#555",fontWeight:500}}>Last session</span>
                  </div>
                  <span style={{fontSize:12,color:"#555"}}>{new Date(recent.date).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}</span>
                </div>
                {(recent.exercises||[]).map(ex=>(
                  <div key={ex.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:"1px solid #1C1C1E"}}>
                    <span style={{fontSize:13,color:"#ccc",fontWeight:500}}>{ex.name}</span>
                    <span style={{fontSize:12,color:"#555"}}>{(ex.sets||[]).map(s=>`${s.weight||"?"}×${s.reps}`).join(" · ")}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tip */}
            <div style={{background:"#111",borderRadius:16,padding:"14px 16px",display:"flex",gap:12,alignItems:"flex-start",border:"1px solid #1C1C1E"}}>
              <span style={{fontSize:20}}>📈</span>
              <div>
                <div style={{fontSize:13,color:"#fff",fontWeight:600,marginBottom:2}}>Progressive Overload</div>
                <div style={{fontSize:12,color:"#555",lineHeight:1.5}}>6 reps → 8 reps → 10 reps → weight up, back to 6. Each set tracks independently.</div>
              </div>
            </div>
          </div>
        )}

        {/* ── SESSION ──────────────────────────────────────────── */}
        {view==="session"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <div style={{fontSize:13,color:TC[sessionType],fontWeight:600,marginBottom:2}}>{step==="pick"?"CHOOSE EXERCISES":"IN PROGRESS"}</div>
                <div style={{fontSize:28,fontWeight:800,color:"#fff"}}>{sessionType} Day</div>
              </div>
              <button onClick={()=>setView("home")} style={{width:36,height:36,borderRadius:"50%",background:"#1C1C1E",border:"none",color:"#888",fontSize:16,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
            </div>

            {step==="pick"?(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <span style={{fontSize:14,color:"#888"}}>Select 4–6 exercises</span>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:14,fontWeight:700,color:TC[sessionType]}}>{selectedEx.length}/6</span>
                    <button onClick={()=>setShowAddModal(true)} style={{background:TBG[sessionType],border:`1px solid ${TC[sessionType]}44`,color:TC[sessionType],padding:"6px 12px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>+ Custom</button>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
                  {allEx.map(ex=>{
                    const sel=selectedEx.includes(ex.name), dis=!sel&&selectedEx.length>=6;
                    const hasH=sessions.some(s=>s.exercises?.some(e=>e.name===ex.name));
                    return (
                      <button key={ex.name} className="chip" disabled={dis} onClick={()=>toggleEx(ex.name)} style={{padding:"14px 12px",borderRadius:16,textAlign:"left",border:`1.5px solid ${sel?TC[sessionType]:"#1C1C1E"}`,background:sel?TBG[sessionType]:"#111",opacity:dis?0.3:1,cursor:dis?"not-allowed":"pointer",fontFamily:"inherit"}}>
                        <div style={{fontSize:13,fontWeight:600,color:sel?TC[sessionType]:"#ccc",marginBottom:4,lineHeight:1.3}}>
                          {ex.name}
                          {ex.custom&&<span style={{fontSize:9,background:TC[sessionType]+"22",color:TC[sessionType],padding:"1px 5px",borderRadius:4,marginLeft:5,fontWeight:700}}>CUSTOM</span>}
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:11,color:"#555"}}>{ex.equipment}</span>
                          {hasH&&<span style={{fontSize:11,color:TC[sessionType],fontWeight:600}}>✓ tracked</span>}
                        </div>
                        <div style={{fontSize:11,color:"#333",marginTop:2}}>{[...ex.muscles,...(ex.secondary||[]).slice(0,1)].join(", ")}</div>
                      </button>
                    );
                  })}
                </div>
                <button onClick={confirmPick} style={{width:"100%",padding:"16px",background:TG[sessionType],border:"none",borderRadius:16,color:"#fff",fontWeight:700,fontSize:16,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 8px 24px ${TC[sessionType]}44`}}>
                  Start Session →
                </button>
              </div>
            ):(
              <div>
                {/* Exercise tabs */}
                <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:12,marginBottom:16}}>
                  {selectedEx.map((n,i)=>{
                    const sets=loggedSets[n]||[], done=sets.every(s=>s.done), partial=sets.some(s=>s.done);
                    return (
                      <button key={n} onClick={()=>{setActiveExIdx(i);setShowTip(false);}} style={{padding:"8px 14px",borderRadius:20,border:`1.5px solid ${activeExIdx===i?TC[sessionType]:done?"#2C2C2E":"#1C1C1E"}`,background:activeExIdx===i?TBG[sessionType]:"#111",color:done?"#22C55E":activeExIdx===i?TC[sessionType]:"#555",fontWeight:600,fontSize:12,whiteSpace:"nowrap",flexShrink:0,cursor:"pointer",fontFamily:"inherit"}}>
                        {done?"✓ ":partial?"· ":""}{n.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>

                {activeExData&&(
                  <div style={{background:"#111",borderRadius:20,padding:18,marginBottom:14,border:"1px solid #1C1C1E"}}>
                    {/* Exercise header */}
                    <div style={{display:"flex",gap:14,marginBottom:16}}>
                      <div style={{width:110,height:80,borderRadius:14,overflow:"hidden",background:"#1C1C1E",flexShrink:0}}>
                        {activeExData.imgId&&!imgErrors[activeExData.imgId]
                          ?<img src={imgSrc} alt={activeExName} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={()=>setImgErrors(e=>({...e,[activeExData.imgId]:true}))}/>
                          :<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>🏋️</div>
                        }
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:17,fontWeight:700,color:"#fff",marginBottom:6,lineHeight:1.2}}>
                          {activeExName}
                          {activeExData.custom&&<span style={{fontSize:10,background:TC[sessionType]+"22",color:TC[sessionType],padding:"2px 6px",borderRadius:6,marginLeft:6,fontWeight:700}}>CUSTOM</span>}
                        </div>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>
                          <span style={{fontSize:11,background:TBG[sessionType],color:TC[sessionType],padding:"2px 8px",borderRadius:6,fontWeight:600}}>{activeExData.muscles[0]}</span>
                          {(activeExData.secondary||[]).slice(0,2).map(m=><span key={m} style={{fontSize:11,background:"#1C1C1E",color:"#555",padding:"2px 8px",borderRadius:6}}>{m}</span>)}
                        </div>
                        <div style={{fontSize:11,color:"#444"}}>{activeExData.equipment}</div>
                        {!activeExData.custom&&(
                          <button onClick={()=>setShowTip(t=>!t)} style={{fontSize:12,color:TC[sessionType],background:"none",border:"none",cursor:"pointer",fontWeight:600,padding:0,marginTop:4,fontFamily:"inherit"}}>
                            {showTip?"▲ Hide tip":"▼ Form tip"}
                          </button>
                        )}
                      </div>
                    </div>
                    {showTip&&!activeExData.custom&&(
                      <div style={{background:"#1C1C1E",borderRadius:12,padding:"12px 14px",fontSize:13,color:"#888",lineHeight:1.5,marginBottom:14}}>
                        {activeExData.tip}
                      </div>
                    )}

                    {/* Sets */}
                    <div style={{display:"grid",gridTemplateColumns:"32px 1fr 1fr 56px 56px",gap:8,paddingBottom:8,borderBottom:"1px solid #1C1C1E",marginBottom:8}}>
                      {["SET","KG","REPS","TARGET",""].map(h=><div key={h} style={{fontSize:10,color:"#444",fontWeight:700,textAlign:"center",letterSpacing:0.5}}>{h}</div>)}
                    </div>
                    {(loggedSets[activeExName]||[]).map((set,si)=>{
                      const prog=getProgression(sessions,activeExName,si);
                      return (
                        <div key={si} style={{display:"grid",gridTemplateColumns:"32px 1fr 1fr 56px 56px",gap:8,alignItems:"center",marginBottom:10,opacity:set.done?0.5:1}}>
                          <div style={{fontSize:13,fontWeight:700,color:TC[sessionType],textAlign:"center"}}>S{si+1}</div>
                          <input style={{background:"#1C1C1E",border:`1.5px solid ${set.done?"#2C2C2E":"#2C2C2E"}`,borderRadius:10,padding:"11px 8px",color:"#fff",fontSize:16,fontWeight:700,textAlign:"center",width:"100%",outline:"none",fontFamily:"inherit"}}
                            type="number" placeholder={prog.weight!==null?String(prog.weight):"kg"} value={set.weight} disabled={set.done} onChange={e=>updateSet(activeExName,si,"weight",e.target.value)}/>
                          <input style={{background:"#1C1C1E",border:"1.5px solid #2C2C2E",borderRadius:10,padding:"11px 8px",color:"#fff",fontSize:16,fontWeight:700,textAlign:"center",width:"100%",outline:"none",fontFamily:"inherit"}}
                            type="number" value={set.reps} disabled={set.done} onChange={e=>updateSet(activeExName,si,"reps",e.target.value)}/>
                          <div style={{fontSize:14,fontWeight:700,color:"#444",textAlign:"center"}}>×{set.targetReps}</div>
                          <button onClick={()=>!set.done&&markDone(activeExName,si)} style={{padding:"11px 6px",borderRadius:10,border:"none",background:set.done?"#1C2E1C":TG[sessionType],color:set.done?"#22C55E":"#fff",fontWeight:700,fontSize:13,cursor:set.done?"default":"pointer",fontFamily:"inherit"}}>
                            {set.done?"✓":"Log"}
                          </button>
                        </div>
                      );
                    })}
                    {(()=>{const p=getProgression(sessions,activeExName,0);return(
                      <div style={{display:"flex",gap:8,alignItems:"flex-start",paddingTop:10,borderTop:"1px solid #1C1C1E"}}>
                        <span style={{fontSize:14}}>{p.phase==="weight-up"?"🔥":p.phase==="reps-up"?"📈":p.phase==="new"?"🆕":"🔄"}</span>
                        <span style={{fontSize:12,color:"#666",lineHeight:1.4}}>{p.note}</span>
                      </div>
                    );})()}
                  </div>
                )}

                <div style={{display:"flex",gap:10,marginBottom:12}}>
                  <button disabled={activeExIdx===0} onClick={()=>{setActiveExIdx(i=>i-1);setShowTip(false);}} style={{flex:1,padding:"13px",background:"#111",border:"1px solid #1C1C1E",color:"#888",borderRadius:14,cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"inherit"}}>← Prev</button>
                  <button disabled={activeExIdx===selectedEx.length-1} onClick={()=>{setActiveExIdx(i=>i+1);setShowTip(false);}} style={{flex:1,padding:"13px",background:"#111",border:"1px solid #1C1C1E",color:"#888",borderRadius:14,cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"inherit"}}>Next →</button>
                </div>
                <button onClick={finishSession} style={{width:"100%",padding:"16px",background:TG[sessionType],border:"none",borderRadius:16,color:"#fff",fontWeight:700,fontSize:16,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 8px 24px ${TC[sessionType]}44`}}>
                  Finish Session 💪
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── HISTORY ──────────────────────────────────────────── */}
        {view==="history"&&(
          <div>
            <div style={{fontSize:28,fontWeight:800,marginBottom:20}}>Session History</div>
            {sessions.length===0
              ?<Empty text="No sessions yet. Start your first workout! 🏋️"/>
              :[...sessions].reverse().map(s=>(
                <div key={s.id} style={{background:"#111",borderRadius:20,padding:18,marginBottom:12,border:"1px solid #1C1C1E"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div style={{background:TG[s.type],borderRadius:10,padding:"4px 14px",fontSize:12,fontWeight:700,color:"#fff"}}>{s.type}</div>
                    <span style={{fontSize:12,color:"#555"}}>{new Date(s.date).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"2-digit"})}</span>
                  </div>
                  {(s.exercises||[]).map(ex=>(
                    <div key={ex.name} style={{paddingTop:10,borderTop:"1px solid #1C1C1E"}}>
                      <div style={{fontSize:13,color:"#888",fontWeight:600,marginBottom:4}}>{ex.name}</div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {(ex.sets||[]).map((set,i)=>(
                          <span key={i} style={{fontSize:12,color:"#555",background:"#1C1C1E",padding:"3px 10px",borderRadius:8}}>
                            {set.weight||"?"}kg × {set.reps}
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

        {/* ── ANALYSIS ─────────────────────────────────────────── */}
        {view==="analysis"&&(
          <div>
            <div style={{fontSize:28,fontWeight:800,marginBottom:6}}>Progress</div>
            <div style={{fontSize:14,color:"#555",marginBottom:20}}>Select an exercise to see your strength curve</div>
            {sessions.length<2
              ?<Empty text="Complete at least 2 sessions to see your progress trends 📈"/>
              :(
                <div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
                    {getExNames().map(n=>(
                      <button key={n} className="chip" onClick={()=>setAnalysisEx(n)} style={{padding:"8px 14px",borderRadius:20,border:`1.5px solid ${analysisEx===n?"#fff":"#1C1C1E"}`,background:analysisEx===n?"#1C1C1E":"#111",color:analysisEx===n?"#fff":"#555",fontWeight:500,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{n}</button>
                    ))}
                  </div>
                  {analysisEx&&(()=>{
                    const maxes=getMaxes(analysisEx), history=getHistory(analysisEx);
                    const best=Math.max(...maxes.map(m=>m.weight));
                    const gained=maxes.length>1?(maxes[maxes.length-1].weight-maxes[0].weight).toFixed(1):0;
                    const chartH=100, minW=Math.min(...maxes.map(m=>m.weight)), maxW=Math.max(...maxes.map(m=>m.weight)), range=maxW-minW||1;
                    const pts=maxes.map((m,i)=>({x:maxes.length===1?50:(i/(maxes.length-1))*100,y:chartH-((m.weight-minW)/range)*(chartH-16)-8,...m}));
                    const pl=pts.map(p=>`${p.x},${p.y}`).join(" ");
                    const color=TC[maxes[0]?.type]||"#FF6B35";
                    return (
                      <div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
                          {[{l:"Best",v:`${best}kg`},{l:"Gained",v:`+${gained}kg`},{l:"Sessions",v:maxes.length},{l:"Total Sets",v:history.length}].map(({l,v})=>(
                            <div key={l} style={{background:"#111",borderRadius:16,padding:"14px 10px",textAlign:"center",border:"1px solid #1C1C1E"}}>
                              <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>{v}</div>
                              <div style={{fontSize:10,color:"#555",fontWeight:600,marginTop:3,letterSpacing:0.5}}>{l.toUpperCase()}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{background:"#111",borderRadius:20,padding:20,marginBottom:12,border:"1px solid #1C1C1E"}}>
                          <div style={{fontSize:12,color:"#555",fontWeight:600,letterSpacing:0.5,marginBottom:14}}>WEIGHT OVER TIME (kg)</div>
                          <svg width="100%" height={chartH+24} viewBox={`0 0 100 ${chartH+24}`} preserveAspectRatio="none" style={{overflow:"visible"}}>
                            <defs>
                              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
                                <stop offset="100%" stopColor={color} stopOpacity="0"/>
                              </linearGradient>
                            </defs>
                            {[0,0.5,1].map(f=><line key={f} x1="0" y1={chartH-f*(chartH-16)-8} x2="100" y2={chartH-f*(chartH-16)-8} stroke="#1C1C1E" strokeWidth="0.8"/>)}
                            <polygon points={`0,${chartH} ${pl} 100,${chartH}`} fill="url(#g)"/>
                            <polyline points={pl} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="3" fill={color}/>)}
                            <text x="0" y={chartH+18} fontSize="4" fill="#444">{new Date(maxes[0]?.date).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</text>
                            {maxes.length>1&&<text x="100" y={chartH+18} fontSize="4" fill="#444" textAnchor="end">{new Date(maxes[maxes.length-1]?.date).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</text>}
                          </svg>
                        </div>
                        <div style={{background:"#111",borderRadius:20,padding:18,border:"1px solid #1C1C1E"}}>
                          <div style={{fontSize:12,color:"#555",fontWeight:600,letterSpacing:0.5,marginBottom:12}}>ALL SETS LOGGED</div>
                          <div style={{maxHeight:280,overflowY:"auto"}}>
                            {[...history].reverse().slice(0,30).map((h,i)=>(
                              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:"1px solid #1C1C1E"}}>
                                <span style={{fontSize:12,color:"#555"}}>{new Date(h.date).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</span>
                                <span style={{fontSize:12,color:"#555"}}>Set {h.setIndex+1}</span>
                                <span style={{fontSize:14,fontWeight:700,color:"#ccc"}}>{h.weight}kg × {h.reps}</span>
                                <span style={{fontSize:11,color:"#FF6B35",fontWeight:600}}>~{h.e1rm}kg 1RM</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )
            }
          </div>
        )}

        {/* ── MY EXERCISES ─────────────────────────────────────── */}
        {view==="exercises"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontSize:28,fontWeight:800}}>Exercises</div>
              <button onClick={()=>setShowAddModal(true)} style={{background:"linear-gradient(135deg,#FF6B35,#FF8C42)",border:"none",color:"#fff",padding:"10px 16px",borderRadius:12,cursor:"pointer",fontWeight:700,fontSize:14,fontFamily:"inherit"}}>+ Add Custom</button>
            </div>
            {["Push","Pull","Legs"].map(day=>{
              const customs=customEx[day]||[];
              return (
                <div key={day} style={{background:"#111",borderRadius:20,padding:18,marginBottom:12,border:`1px solid ${TC[day]}22`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:customs.length?14:0}}>
                    <div style={{background:TG[day],borderRadius:10,padding:"4px 14px",fontSize:12,fontWeight:700,color:"#fff"}}>{day}</div>
                    <span style={{fontSize:13,color:"#555"}}>{customs.length?`${customs.length} custom exercise${customs.length>1?"s":""}`:BUILTIN_EXERCISES[day].length+" built-in exercises"}</span>
                  </div>
                  {customs.map(ex=>(
                    <div key={ex.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12,borderTop:"1px solid #1C1C1E"}}>
                      <span style={{fontSize:14,color:"#ccc",fontWeight:500}}>{ex.name}</span>
                      <button onClick={()=>{if(window.confirm(`Remove "${ex.name}"?`))deleteCustomExercise(ex.id,day);}} style={{background:"rgba(255,59,48,0.1)",border:"1px solid rgba(255,59,48,0.2)",color:"#FF3B30",fontSize:12,padding:"6px 12px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>Remove</button>
                    </div>
                  ))}
                </div>
              );
            })}
            <div style={{background:"#111",borderRadius:20,padding:18,border:"1px solid #1C1C1E"}}>
              <div style={{fontSize:12,color:"#555",fontWeight:600,letterSpacing:0.5,marginBottom:12}}>BUILT-IN LIBRARY</div>
              {["Push","Pull","Legs"].map(day=>(
                <div key={day} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:"1px solid #1C1C1E"}}>
                  <div style={{background:TG[day],borderRadius:8,padding:"3px 10px",fontSize:11,fontWeight:700,color:"#fff"}}>{day}</div>
                  <span style={{fontSize:13,color:"#555"}}>{BUILTIN_EXERCISES[day].length} exercises</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Splash({name}) {
  return (
    <div style={{minHeight:"100vh",background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div style={{fontSize:36,fontWeight:900,letterSpacing:-1,marginBottom:8}}>
        <span style={{color:"#fff"}}>Iron</span><span style={{background:"linear-gradient(135deg,#FF6B35,#FF8C42)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Log</span>
      </div>
      <div style={{fontSize:14,color:"#555"}}>{name?`Welcome back, ${name}!`:"Loading..."}</div>
    </div>
  );
}

function Empty({text}) {
  return <div style={{textAlign:"center",padding:"48px 0",color:"#555",fontSize:15,lineHeight:1.6}}>{text}</div>;
}
