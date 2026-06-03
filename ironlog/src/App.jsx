import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase.js";

const IMAGE_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

// ── Exercise Library ──────────────────────────────────────────────────────────
const BUILTIN = {
  Push: [
    {name:"Barbell Bench Press",       equipment:"barbell",      muscles:["chest"],     secondary:["shoulders","triceps"], tip:"Medium grip, lower bar to mid-chest, press up explosively. Keep shoulder blades retracted.", imgId:"Barbell_Bench_Press_-_Medium_Grip"},
    {name:"Smith Machine Bench Press", equipment:"smith machine", muscles:["chest"],     secondary:["shoulders","triceps"], tip:"Set bar at chest height. Lie back, unrack, lower to mid-chest. Smith guides the path — focus on squeezing the chest.", imgId:"Smith_Machine_Bench_Press"},
    {name:"Barbell Incline Bench Press",equipment:"barbell",     muscles:["chest"],     secondary:["shoulders","triceps"], tip:"Incline bench, medium grip. Lower to upper chest and press. Keep core tight.", imgId:"Barbell_Incline_Bench_Press_-_Medium_Grip"},
    {name:"Smith Machine Incline Press",equipment:"smith machine",muscles:["chest"],     secondary:["shoulders","triceps"], tip:"Set bench to 30–45°. Lower the bar to upper chest, drive up. Great for upper chest isolation.", imgId:"Smith_Machine_Incline_Bench_Press"},
    {name:"Arnold Dumbbell Press",     equipment:"dumbbell",     muscles:["shoulders"], secondary:["triceps"],             tip:"Palms facing you at chest. Rotate outward as you press overhead. Reverse on descent.", imgId:"Arnold_Dumbbell_Press"},
    {name:"Barbell Shoulder Press",    equipment:"barbell",      muscles:["shoulders"], secondary:["chest","triceps"],     tip:"Grip just wider than shoulders, press bar overhead, lower to chin.", imgId:"Barbell_Shoulder_Press"},
    {name:"Lateral Raises",            equipment:"dumbbell",     muscles:["shoulders"], secondary:[],                      tip:"Slight bend in elbows, raise to shoulder height, pause, lower slowly. Control is everything.", imgId:"Side_Lateral_Raise"},
    {name:"Cable Rope Rear-Delt Rows", equipment:"cable",        muscles:["shoulders"], secondary:["middle back"],         tip:"Sit at low pulley. Pull to face keeping elbows high, squeeze rear delts at peak.", imgId:"Cable_Rope_Rear-Delt_Rows"},
    {name:"Tricep Pushdown",           equipment:"cable",        muscles:["triceps"],   secondary:[],                      tip:"Elbows pinned to sides, push bar down to full extension. Squeeze at the bottom. Don't let elbows flare.", imgId:"Triceps_Pushdown"},
    {name:"Tricep Pushdown (Rope)",    equipment:"cable",        muscles:["triceps"],   secondary:[],                      tip:"Use rope attachment, push down and flare hands out at the bottom for full contraction.", imgId:"Triceps_Pushdown_-_Rope"},
    {name:"Skull Crushers",            equipment:"barbell",      muscles:["triceps"],   secondary:[],                      tip:"Lower bar to forehead with elbows pointing up. Extend fully. Keep upper arms vertical.", imgId:"Lying_Triceps_Press"},
    {name:"Dips (Assisted/Weighted)",  equipment:"machine",      muscles:["triceps"],   secondary:["chest","shoulders"],   tip:"For assisted: set counterweight to reduce load. For weighted: add belt. Full range, chest slightly forward for chest emphasis.", imgId:"Assisted_Tricep_Dips"},
    {name:"Bent-Arm Dumbbell Pullover",equipment:"dumbbell",     muscles:["chest"],     secondary:["lats","shoulders"],    tip:"Lie across flat bench, dumbbell overhead. Lower behind head, elbows slightly bent.", imgId:"Bent-Arm_Dumbbell_Pullover"},
    {name:"Clean and Press",           equipment:"barbell",      muscles:["shoulders"], secondary:["abdominals"],          tip:"Deadlift explosively, clean to shoulders, press overhead. Use moderate weight.", imgId:"Clean_and_Press"},
    {name:"Alternating Cable Shoulder Press",equipment:"cable",  muscles:["shoulders"], secondary:["triceps"],             tip:"Move cables to bottom. Press alternately overhead with control.", imgId:"Alternating_Cable_Shoulder_Press"},
  ],
  Pull: [
    {name:"Barbell Deadlift",          equipment:"barbell",      muscles:["lower back"],  secondary:["glutes","hamstrings"], tip:"Shoulder-width stance. Hinge at hips and knees, grip bar, drive through heels to stand.", imgId:"Barbell_Deadlift"},
    {name:"Bent Over Barbell Row",     equipment:"barbell",      muscles:["middle back"], secondary:["biceps","lats"],       tip:"Hinge forward, back straight. Pull bar to lower chest/upper abs. Squeeze shoulder blades.", imgId:"Bent_Over_Barbell_Row"},
    {name:"Pull-Ups (Assisted/Weighted)",equipment:"machine",    muscles:["lats"],        secondary:["biceps","middle back"],tip:"Assisted: set counterweight to reduce load. Weighted: add belt. Full hang, pull chin above bar, lower with control.", imgId:"Pullups"},
    {name:"Close-Grip Front Lat Pulldown",equipment:"cable",     muscles:["lats"],        secondary:["biceps","middle back"],tip:"Pull bar to upper chest, leaning back slightly. Squeeze lats, return with control.", imgId:"Close-Grip_Front_Lat_Pulldown"},
    {name:"Seated Cable Row",          equipment:"cable",        muscles:["middle back"], secondary:["biceps","lats"],       tip:"Sit tall, pull handle to abdomen, elbows close. Squeeze mid-back at peak contraction.", imgId:"Seated_Cable_Rows"},
    {name:"Elevated Cable Rows",       equipment:"cable",        muscles:["lats"],        secondary:["middle back","traps"], tip:"Pull to waist keeping elbows close to sides. Full stretch at extension.", imgId:"Elevated_Cable_Rows"},
    {name:"Full Range Lat Pulldown",   equipment:"cable",        muscles:["lats"],        secondary:["biceps","middle back"],tip:"From high cables, pull hands together and down engaging lats fully.", imgId:"Full_Range-Of-Motion_Lat_Pulldown"},
    {name:"Bicep Curl (Barbell)",      equipment:"barbell",      muscles:["biceps"],      secondary:["forearms"],            tip:"Elbows fixed at sides. Curl to shoulder, squeeze at top, lower slowly. Don't swing.", imgId:"Barbell_Curl"},
    {name:"Bicep Curl (Dumbbell)",     equipment:"dumbbell",     muscles:["biceps"],      secondary:["forearms"],            tip:"Alternate or together. Supinate at the top for full contraction. Keep wrists neutral.", imgId:"Dumbbell_Bicep_Curl"},
    {name:"Cable Drag Curl",           equipment:"cable",        muscles:["biceps"],      secondary:["forearms"],            tip:"Drag the cable bar up your torso keeping elbows behind you. Maximizes bicep peak contraction.", imgId:"Drag_Curl"},
    {name:"High Cable Curls",          equipment:"cable",        muscles:["biceps"],      secondary:[],                      tip:"Arms parallel to floor. Curl handles toward your head — peak contraction isolation.", imgId:"High_Cable_Curls"},
    {name:"Hammer Curls",              equipment:"dumbbell",     muscles:["biceps"],      secondary:["forearms"],            tip:"Neutral grip (palms facing each other). Curl up, keeping wrists firm. Hits brachialis.", imgId:"Hammer_Curls"},
    {name:"Dumbbell Incline Row",      equipment:"dumbbell",     muscles:["middle back"], secondary:["biceps","forearms"],   tip:"Chest-down on incline bench. Row to sides of chest, squeeze mid-back at top.", imgId:"Dumbbell_Incline_Row"},
    {name:"Leverage High Row",         equipment:"machine",      muscles:["middle back"], secondary:["lats"],                tip:"Pull down with pronated grip, leading with elbows. Controlled eccentric.", imgId:"Leverage_High_Row"},
    {name:"Lying T-Bar Row",           equipment:"machine",      muscles:["middle back"], secondary:["biceps","lats"],       tip:"Face-down on T-bar. Pull weight up, elbows flared, squeeze mid-back.", imgId:"Lying_T-Bar_Row"},
    {name:"Bent Over Two-Dumbbell Row",equipment:"dumbbell",     muscles:["middle back"], secondary:["biceps","lats"],       tip:"Hinge forward with dumbbells. Row both up to sides simultaneously.", imgId:"Bent_Over_Two-Dumbbell_Row"},
    {name:"Face Pulls",                equipment:"cable",        muscles:["shoulders"],   secondary:["middle back"],         tip:"High pulley, rope attachment. Pull to face with elbows flared high. Great for rear delts.", imgId:"Face_Pull"},
  ],
  Legs: [
    {name:"Barbell Squat",             equipment:"barbell",      muscles:["quadriceps"], secondary:["glutes","hamstrings"], tip:"Bar on upper traps. Feet shoulder-width, toes out. Squat to parallel, drive through heels.", imgId:"Barbell_Squat"},
    {name:"Barbell Full Squat",        equipment:"barbell",      muscles:["quadriceps"], secondary:["glutes","hamstrings"], tip:"Descend below parallel. Greater glute and hamstring involvement. Requires good mobility.", imgId:"Barbell_Full_Squat"},
    {name:"Leg Press",                 equipment:"machine",      muscles:["quadriceps"], secondary:["glutes","hamstrings"], tip:"Feet shoulder-width on platform. Lower until 90°, drive through heels. Don't lock knees.", imgId:"Leg_Press"},
    {name:"Leg Extension",             equipment:"machine",      muscles:["quadriceps"], secondary:[],                      tip:"Sit back, pads on ankles. Extend fully and hold briefly at top. Lower with control.", imgId:"Leg_Extensions"},
    {name:"Leg Curl",                  equipment:"machine",      muscles:["hamstrings"], secondary:[],                      tip:"Lie face down or seated. Curl heels to glutes. Squeeze at peak, lower slowly.", imgId:"Lying_Leg_Curls"},
    {name:"Romanian Deadlift",         equipment:"barbell",      muscles:["hamstrings"], secondary:["glutes","lower back"], tip:"Hinge at hips, push them back. Bar stays close to legs. Feel the hamstring stretch, drive hips forward.", imgId:"Romanian_Deadlift_with_Dumbbells"},
    {name:"Barbell Lunge",             equipment:"barbell",      muscles:["quadriceps"], secondary:["glutes","hamstrings"], tip:"Bar on back, step forward into lunge. Back knee near floor. Alternate legs.", imgId:"Barbell_Lunge"},
    {name:"Barbell Step Ups",          equipment:"barbell",      muscles:["quadriceps"], secondary:["glutes"],              tip:"Bar on back, step onto elevated platform. Drive through heel of lead leg.", imgId:"Barbell_Step_Ups"},
    {name:"Dumbbell Lunges",           equipment:"dumbbell",     muscles:["quadriceps"], secondary:["glutes"],              tip:"Hold dumbbells at sides. Step forward, lower back knee toward floor.", imgId:"Dumbbell_Lunges"},
    {name:"Dumbbell Clean",            equipment:"dumbbell",     muscles:["hamstrings"], secondary:["glutes","lower back"], tip:"Explosively drive hips forward and clean dumbbells to shoulders.", imgId:"Dumbbell_Clean"},
    {name:"Dumbbell Rear Lunge",       equipment:"dumbbell",     muscles:["quadriceps"], secondary:["glutes"],              tip:"Step backward into lunge. Easier on knees, great for glute emphasis.", imgId:"Dumbbell_Rear_Lunge"},
    {name:"Calf Raises",               equipment:"machine",      muscles:["calves"],     secondary:[],                      tip:"Full range of motion — all the way up, all the way down. Hold at top for 1 second.", imgId:"Standing_Calf_Raises"},
    {name:"Hip Thrust",                equipment:"barbell",      muscles:["glutes"],     secondary:["hamstrings"],          tip:"Bar across hips, shoulders on bench. Drive hips up, squeeze glutes hard at top.", imgId:"Barbell_Hip_Thrust"},
    {name:"Hack Squat (Machine)",      equipment:"machine",      muscles:["quadriceps"], secondary:["glutes"],              tip:"Feet shoulder-width, low on platform. Full range squat. Knees track over toes.", imgId:"Hack_Squat"},
  ]
};

const TC  = { Push:"#FF6B35", Pull:"#3B9EFF", Legs:"#22C55E" };
const TG  = { Push:"linear-gradient(135deg,#FF6B35,#FF8C42)", Pull:"linear-gradient(135deg,#3B9EFF,#60B4FF)", Legs:"linear-gradient(135deg,#22C55E,#4ADE80)" };
const TBG = { Push:"rgba(255,107,53,0.1)", Pull:"rgba(59,158,255,0.1)", Legs:"rgba(34,197,94,0.1)" };
const MOODS = ["💀 Destroyed","😤 Hard","😊 Good","😌 Easy","⚡ PB Day"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function allExercises(customEx, hiddenEx) {
  return ["Push","Pull","Legs"].map(day => {
    const builtins = (BUILTIN[day]||[]).filter(e => !(hiddenEx||{})[e.name]).map(e=>({...e,day,custom:false}));
    const customs  = (customEx[day]||[]).map(c=>({name:c.name,equipment:"custom",muscles:["custom"],secondary:[],tip:"",imgId:null,custom:true,dbId:c.id,day}));
    return { day, exercises:[...builtins,...customs] };
  });
}
function exForDay(day, customEx, hiddenEx) {
  const builtins = (BUILTIN[day]||[]).filter(e=>!(hiddenEx||{})[e.name]).map(e=>({...e,day,custom:false}));
  const customs  = (customEx[day]||[]).map(c=>({name:c.name,equipment:"custom",muscles:["custom"],secondary:[],tip:"",imgId:null,custom:true,dbId:c.id,day}));
  return [...builtins,...customs];
}
function findEx(name, customEx, hiddenEx) {
  for (const day of ["Push","Pull","Legs"]) {
    const f = exForDay(day,customEx,hiddenEx).find(e=>e.name===name);
    if (f) return f;
  }
  return null;
}
function getProgression(sessions, exName, setIndex) {
  const history = sessions.map(sess=>sess.exercises?.find(e=>e.name===exName)?.sets?.[setIndex]).filter(Boolean);
  if (!history.length) return {weight:null,reps:null,targetReps:6,note:"First time — pick a comfortable weight",phase:"new"};
  const last=history[history.length-1], lastW=parseFloat(last.weight)||0, lastR=parseInt(last.reps)||0, lastTgt=parseInt(last.targetReps)||6;
  if (!lastW) return {weight:null,reps:null,targetReps:6,note:"Log a weight to start tracking",phase:"new"};
  if (lastR>=lastTgt) {
    if (lastTgt>=10){const bump=lastW>=60?5:2.5;return{weight:lastW+bump,reps:null,targetReps:6,note:`🔥 Try ${lastW+bump}kg — you hit 10 reps last time!`,phase:"weight-up"};}
    const nextT=lastTgt===6?8:10;
    return{weight:lastW,reps:null,targetReps:nextT,note:`📈 Aim for ${nextT} reps — up from ${lastTgt} last time`,phase:"reps-up"};
  }
  return{weight:lastW,reps:null,targetReps:lastTgt,note:`Same weight — push for ${lastTgt} reps to progress`,phase:"hold"};
}

// ── Storage helpers ───────────────────────────────────────────────────────────
async function storageGet(key){try{const r=await window.storage.get(key);return r?JSON.parse(r.value):null;}catch{return null;}}
async function storageSet(key,val){try{await window.storage.set(key,JSON.stringify(val));return true;}catch{return false;}}

// ── Add Exercise Modal ────────────────────────────────────────────────────────
function AddExerciseModal({onSave,onClose}) {
  const [name,setName]=useState(""), [day,setDay]=useState("Push"), [err,setErr]=useState("");
  function save(){const n=name.trim();if(!n||n.length<2){setErr("Enter a valid name");return;}onSave({name:n,day});}
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}}>
      <div style={{width:"100%",maxWidth:380,background:"#1C1C1E",borderRadius:24,padding:28,boxShadow:"0 24px 60px rgba(0,0,0,0.6)"}}>
        <div style={{fontSize:20,fontWeight:700,color:"#fff",marginBottom:6}}>Add Custom Exercise</div>
        <div style={{fontSize:14,color:"#888",marginBottom:24,lineHeight:1.5}}>Tracks progression just like built-in exercises.</div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:"#666",fontWeight:600,letterSpacing:1,marginBottom:8}}>EXERCISE NAME</div>
          <input autoFocus value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&save()} placeholder="e.g. Cable Crunch..."
            style={{width:"100%",background:"#2C2C2E",border:"1.5px solid #3A3A3C",borderRadius:12,padding:"13px 16px",color:"#fff",fontSize:15,outline:"none",fontFamily:"inherit"}}/>
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,color:"#666",fontWeight:600,letterSpacing:1,marginBottom:8}}>WORKOUT DAY</div>
          <div style={{display:"flex",gap:8}}>
            {["Push","Pull","Legs"].map(d=>(
              <button key={d} onClick={()=>setDay(d)} style={{flex:1,padding:"12px 0",borderRadius:12,border:`2px solid ${day===d?TC[d]:"#3A3A3C"}`,background:day===d?TBG[d]:"transparent",color:day===d?TC[d]:"#666",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>{d}</button>
            ))}
          </div>
        </div>
        {err&&<div style={{background:"rgba(255,59,48,0.1)",border:"1px solid rgba(255,59,48,0.3)",borderRadius:10,padding:"10px 14px",color:"#FF3B30",fontSize:13,marginBottom:16}}>{err}</div>}
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:"13px",background:"#2C2C2E",border:"none",borderRadius:12,color:"#888",fontWeight:600,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          <button onClick={save}    style={{flex:2,padding:"13px",background:TG[day],border:"none",borderRadius:12,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>Add Exercise</button>
        </div>
      </div>
    </div>
  );
}

// ── Finish Session Modal ──────────────────────────────────────────────────────
function FinishModal({sessionType, onConfirm, onCancel}) {
  const [mood,setMood]=useState(""), [notes,setNotes]=useState("");
  const today=new Date().toISOString().slice(0,10);
  const [date,setDate]=useState(today);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(12px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,padding:20}}>
      <div style={{width:"100%",maxWidth:500,background:"#1C1C1E",borderRadius:24,padding:28,boxShadow:"0 -8px 40px rgba(0,0,0,0.6)",marginBottom:80}}>
        <div style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:4}}>Finish Session 💪</div>
        <div style={{fontSize:14,color:"#888",marginBottom:24}}>Almost done — log how it went</div>

        <div style={{marginBottom:18}}>
          <div style={{fontSize:11,color:"#666",fontWeight:600,letterSpacing:1,marginBottom:8}}>SESSION DATE</div>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            style={{width:"100%",background:"#2C2C2E",border:"1.5px solid #3A3A3C",borderRadius:12,padding:"12px 16px",color:"#fff",fontSize:15,outline:"none",fontFamily:"inherit",colorScheme:"dark"}}/>
        </div>

        <div style={{marginBottom:18}}>
          <div style={{fontSize:11,color:"#666",fontWeight:600,letterSpacing:1,marginBottom:10}}>HOW DID IT FEEL?</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {MOODS.map(m=>(
              <button key={m} onClick={()=>setMood(m===mood?"":m)}
                style={{padding:"9px 14px",borderRadius:20,border:`1.5px solid ${m===mood?TC[sessionType]:"#3A3A3C"}`,background:m===mood?TBG[sessionType]:"transparent",color:m===mood?TC[sessionType]:"#888",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div style={{marginBottom:22}}>
          <div style={{fontSize:11,color:"#666",fontWeight:600,letterSpacing:1,marginBottom:8}}>NOTES (optional)</div>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="e.g. Felt strong on bench, left shoulder a bit tight..."
            style={{width:"100%",background:"#2C2C2E",border:"1.5px solid #3A3A3C",borderRadius:12,padding:"12px 16px",color:"#fff",fontSize:14,outline:"none",fontFamily:"inherit",resize:"none",height:80,lineHeight:1.5}}/>
        </div>

        <div style={{display:"flex",gap:10}}>
          <button onClick={onCancel} style={{flex:1,padding:"14px",background:"#2C2C2E",border:"none",borderRadius:14,color:"#888",fontWeight:600,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>Back</button>
          <button onClick={()=>onConfirm({date:date+"T12:00:00.000Z",mood,notes})}
            style={{flex:2,padding:"14px",background:TG[sessionType],border:"none",borderRadius:14,color:"#fff",fontWeight:700,fontSize:16,cursor:"pointer",fontFamily:"inherit"}}>
            Save Session ✓
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Auth Screen ───────────────────────────────────────────────────────────────
function AuthScreen() {
  const [loading,setLoading]=useState(false),[error,setError]=useState("");
  async function signIn(){
    setLoading(true);setError("");
    const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:"https://gym-workout-bay.vercel.app"}});
    if(error){setError(error.message);setLoading(false);}
  }
  return (
    <div style={{minHeight:"100vh",background:"#000",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div style={{width:"100%",maxWidth:400,textAlign:"center"}}>
        <div style={{fontSize:56,fontWeight:900,letterSpacing:-2,marginBottom:8}}>
          <span style={{color:"#fff"}}>Iron</span>
          <span style={{background:"linear-gradient(135deg,#FF6B35,#FF8C42)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Log</span>
        </div>
        <div style={{fontSize:17,color:"#666",marginBottom:48}}>Your personal lifting companion</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:40,textAlign:"left"}}>
          {[{e:"📈",t:"Progressive Overload",d:"Auto-tracks your rep cycles"},{e:"🏋️",t:"40+ Exercises",d:"Animated visuals & tips"},{e:"👥",t:"Multi-user",d:"Private per account"},{e:"📊",t:"Progress Charts",d:"See your strength gains"}].map(f=>(
            <div key={f.t} style={{background:"#111",borderRadius:16,padding:16,border:"1px solid #1C1C1E"}}>
              <div style={{fontSize:24,marginBottom:8}}>{f.e}</div>
              <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:4}}>{f.t}</div>
              <div style={{fontSize:12,color:"#555",lineHeight:1.4}}>{f.d}</div>
            </div>
          ))}
        </div>
        {error&&<div style={{background:"rgba(255,59,48,0.1)",border:"1px solid rgba(255,59,48,0.3)",borderRadius:12,padding:"12px 16px",color:"#FF3B30",fontSize:14,marginBottom:16}}>{error}</div>}
        <button onClick={signIn} disabled={loading} style={{width:"100%",padding:"16px",background:"#fff",border:"none",borderRadius:16,color:"#000",fontWeight:700,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:12,fontFamily:"inherit",opacity:loading?0.7:1}}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {loading?"Redirecting...":"Continue with Google"}
        </button>
        <div style={{fontSize:12,color:"#333",marginTop:20}}>Your data is private and only visible to you.</div>
      </div>
    </div>
  );
}
function Splash({name}){return(<div style={{minHeight:"100vh",background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',system-ui,sans-serif"}}><div style={{fontSize:36,fontWeight:900,letterSpacing:-1,marginBottom:8}}><span style={{color:"#fff"}}>Iron</span><span style={{background:"linear-gradient(135deg,#FF6B35,#FF8C42)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Log</span></div><div style={{fontSize:14,color:"#555"}}>{name?`Welcome back, ${name}!`:"Loading..."}</div></div>);}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(null), [authLoading,setAuthLoading]=useState(true);
  const [sessions,setSessions]=useState([]), [customEx,setCustomEx]=useState({Push:[],Pull:[],Legs:[]});
  const [hiddenEx,setHiddenEx]=useState({}), [lastType,setLastType]=useState(null), [dbLoading,setDbLoading]=useState(false);
  const [view,setView]=useState("home");
  // session state
  const [sessionType,setSessionType]=useState(null);
  // NEW FLOW: exercises is a list of {name, sets:[{weight,reps,done}]}
  // user adds exercises one by one and logs sets in-place
  const [activeSession,setActiveSession]=useState([]); // [{name, sets:[]}]
  const [currentEx,setCurrentEx]=useState(null);       // name of exercise being set up
  const [showFinishModal,setShowFinishModal]=useState(false);
  const [imgErrors,setImgErrors]=useState({}), [imgFrame,setImgFrame]=useState({});
  const [toast,setToast]=useState(null), [showAddModal,setShowAddModal]=useState(false);
  const [analysisEx,setAnalysisEx]=useState(null), [expandedDay,setExpandedDay]=useState(null);
  const [pickerOpen,setPickerOpen]=useState(false);  // slide-up exercise picker
  const [pickerFilter,setPickerFilter]=useState(""); // search filter
  const animRef=useRef({});

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setUser(session?.user??null);setAuthLoading(false);});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{setUser(session?.user??null);setAuthLoading(false);});
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    if(!user){setSessions([]);setCustomEx({Push:[],Pull:[],Legs:[]});setLastType(null);return;}
    setDbLoading(true);
    Promise.all([
      supabase.from("sessions").select("*").order("date",{ascending:true}),
      supabase.from("custom_exercises").select("*"),
      supabase.from("user_meta").select("*").eq("user_id",user.id).single()
    ]).then(([s,c,m])=>{
      setSessions(s.data||[]);
      const g={Push:[],Pull:[],Legs:[]};
      (c.data||[]).forEach(e=>{if(g[e.day])g[e.day].push(e);});
      setCustomEx(g);
      setLastType(m.data?.last_type||null);
      setHiddenEx(m.data?.hidden_ex||{});
      setDbLoading(false);
    });
  },[user]);

  // Animate images for current exercise
  useEffect(()=>{
    if(!currentEx) return;
    const ex=findEx(currentEx,customEx,hiddenEx);
    if(!ex?.imgId) return;
    clearInterval(animRef.current[ex.imgId]);
    animRef.current[ex.imgId]=setInterval(()=>setImgFrame(f=>({...f,[ex.imgId]:f[ex.imgId]===1?0:1})),1200);
    return ()=>clearInterval(animRef.current[ex.imgId]);
  },[currentEx]);

  const showToast=(msg,color="#3B9EFF")=>{setToast({msg,color});setTimeout(()=>setToast(null),2800);};

  async function toggleHideExercise(name){
    const n={...hiddenEx};
    if(n[name])delete n[name];else n[name]=true;
    setHiddenEx(n);
    await supabase.from("user_meta").upsert({user_id:user.id,hidden_ex:n},{onConflict:"user_id"});
    showToast(n[name]?`"${name}" hidden`:`"${name}" restored`,"#888");
  }

  async function handleAddExercise({name,day}){
    const all=exForDay(day,customEx,hiddenEx);
    if(all.some(e=>e.name.toLowerCase()===name.toLowerCase())){showToast("Already exists","#FF3B30");return;}
    const {data,error}=await supabase.from("custom_exercises").insert({user_id:user.id,name,day}).select().single();
    if(error){showToast("Failed to save","#FF3B30");return;}
    setCustomEx(prev=>({...prev,[day]:[...prev[day],data]}));
    showToast(`"${name}" added to ${day}!`,TC[day]);
    setShowAddModal(false);
  }

  async function deleteCustomExercise(dbId,day){
    await supabase.from("custom_exercises").delete().eq("id",dbId);
    setCustomEx(prev=>({...prev,[day]:prev[day].filter(e=>e.id!==dbId)}));
    showToast("Removed","#FF3B30");
  }

  async function logout(){await supabase.auth.signOut();setUser(null);setView("home");}

  // ── New session flow ────────────────────────────────────────────────────────
  function startSession(type){
    setSessionType(type);
    setActiveSession([]);
    setCurrentEx(null);
    setPickerOpen(true);
    setView("session");
  }

  function pickExercise(name){
    // If already in session, just switch to it
    setPickerOpen(false);
    setPickerFilter("");
    if(!activeSession.find(e=>e.name===name)){
      setActiveSession(prev=>[...prev,{name,sets:[]}]);
    }
    setCurrentEx(name);
  }

  function addSet(exName,weight,reps){
    if(!weight||!reps){showToast("Enter weight and reps","#FF3B30");return;}
    const si=activeSession.find(e=>e.name===exName)?.sets?.length||0;
    const prog=getProgression(sessions,exName,si);
    const targetReps=prog.targetReps;
    setActiveSession(prev=>prev.map(e=>e.name===exName?{...e,sets:[...e.sets,{weight:String(weight),reps:String(reps),targetReps,done:true}]}:e));
    const r=parseInt(reps);
    showToast(r>=targetReps?(targetReps===10?"🔥 10 reps! Weight up next session":"✅ Hit target!"):"Set logged 💪");
  }

  function removeSet(exName,si){
    setActiveSession(prev=>prev.map(e=>e.name===exName?{...e,sets:e.sets.filter((_,i)=>i!==si)}:e));
  }

  function removeExercise(exName){
    setActiveSession(prev=>prev.filter(e=>e.name!==exName));
    if(currentEx===exName) setCurrentEx(activeSession.find(e=>e.name!==exName)?.name||null);
  }

  async function saveSession({date,mood,notes}){
    const exLog=activeSession.map(e=>({name:e.name,sets:e.sets}));
    const {data:ns}=await supabase.from("sessions").insert({
      user_id:user.id, type:sessionType,
      date, exercises:exLog, mood, notes
    }).select().single();
    if(ns)setSessions(p=>[...p,ns]);
    await supabase.from("user_meta").upsert({user_id:user.id,last_type:sessionType},{onConflict:"user_id"});
    setLastType(sessionType);
    setShowFinishModal(false);
    showToast(`${sessionType} session saved! 💪`,TC[sessionType]);
    setView("home");
  }

  // Analysis helpers
  function getExNames(){const n=new Set();sessions.forEach(sess=>sess.exercises?.forEach(e=>n.add(e.name)));return[...n].sort();}
  function getMaxes(name){const b={};sessions.forEach(sess=>{const ex=sess.exercises?.find(e=>e.name===name);if(!ex)return;const best=ex.sets.reduce((m,set)=>{const w=parseFloat(set.weight)||0;return w>m?w:m;},0);if(best>0)b[sess.date]={weight:best,type:sess.type};});return Object.entries(b).map(([date,{weight,type}])=>({date,weight,type})).sort((a,b)=>new Date(a.date)-new Date(b.date));}
  function getHistory(name){const p=[];sessions.forEach(sess=>{const ex=sess.exercises?.find(e=>e.name===name);if(!ex)return;ex.sets.forEach((set,si)=>{const w=parseFloat(set.weight),r=parseInt(set.reps);if(w&&r)p.push({date:sess.date,setIndex:si,weight:w,reps:r,e1rm:Math.round(w*(1+r/30)*10)/10});});});return p;}

  if(authLoading)return<Splash/>;
  if(!user)return<AuthScreen/>;
  if(dbLoading)return<Splash name={user.user_metadata?.full_name?.split(" ")[0]}/>;

  const suggested={Push:"Pull",Pull:"Legs",Legs:"Push"}[lastType]||"Push";
  const weekCount=sessions.filter(sess=>new Date(sess.date)>new Date(Date.now()-7*86400000)).length;
  const recent=sessions.length?sessions[sessions.length-1]:null;
  const displayName=user.user_metadata?.full_name?.split(" ")[0]||user.email?.split("@")[0]||"Athlete";
  const totalCustom=Object.values(customEx).flat().length;
  const NAV=[{v:"home",i:"🏠",l:"Home"},{v:"history",i:"📋",l:"History"},{v:"analysis",i:"📈",l:"Progress"},{v:"exercises",i:"⚙️",l:"Exercises"}];
  const grouped=allExercises(customEx,hiddenEx);
  const currentExData=currentEx?findEx(currentEx,customEx,hiddenEx):null;
  const currentExSets=activeSession.find(e=>e.name===currentEx)?.sets||[];
  const currentProgIdx=currentExSets.length; // next set index
  const currentProg=currentEx?getProgression(sessions,currentEx,currentProgIdx):null;

  // Filtered exercises for picker
  const filteredGrouped=grouped.map(g=>({
    ...g,
    exercises: g.exercises.filter(e=>
      !pickerFilter || e.name.toLowerCase().includes(pickerFilter.toLowerCase()) || e.muscles.join(" ").toLowerCase().includes(pickerFilter.toLowerCase())
    )
  })).filter(g=>g.exercises.length>0);

  return (
    <div style={{minHeight:"100vh",background:"#000",color:"#fff",fontFamily:"'Inter',system-ui,sans-serif",paddingBottom:80}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#000;overscroll-behavior:none;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        input,textarea{-webkit-appearance:none;}
        ::-webkit-scrollbar{display:none;}
        button{transition:opacity 0.15s,transform 0.1s;font-family:inherit;}
        button:not(:disabled):active{opacity:0.8;transform:scale(0.97);}
      `}</style>

      {toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:toast.color,color:"#fff",padding:"12px 20px",borderRadius:30,fontWeight:600,fontSize:14,zIndex:400,whiteSpace:"nowrap",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>{toast.msg}</div>}
      {showAddModal&&<AddExerciseModal onSave={handleAddExercise} onClose={()=>setShowAddModal(false)}/>}
      {showFinishModal&&<FinishModal sessionType={sessionType} onConfirm={saveSession} onCancel={()=>setShowFinishModal(false)}/>}

      {/* Exercise picker sheet */}
      {pickerOpen&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",zIndex:150}} onClick={()=>activeSession.length>0&&(setPickerOpen(false),setPickerFilter(""))}>
          <div style={{position:"absolute",bottom:0,left:0,right:0,background:"#111",borderRadius:"20px 20px 0 0",maxHeight:"80vh",display:"flex",flexDirection:"column",boxShadow:"0 -8px 40px rgba(0,0,0,0.6)"}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:"20px 20px 0"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontSize:18,fontWeight:700}}>Choose an Exercise</div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setShowAddModal(true)} style={{background:TBG[sessionType],border:`1px solid ${TC[sessionType]}44`,color:TC[sessionType],padding:"6px 12px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:600}}>+ Custom</button>
                  {activeSession.length>0&&<button onClick={()=>{setPickerOpen(false);setPickerFilter("");}} style={{background:"#2C2C2E",border:"none",color:"#888",padding:"6px 12px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:600}}>Done</button>}
                </div>
              </div>
              <input value={pickerFilter} onChange={e=>setPickerFilter(e.target.value)} placeholder="Search exercises or muscle..."
                style={{width:"100%",background:"#2C2C2E",border:"1.5px solid #3A3A3C",borderRadius:12,padding:"11px 14px",color:"#fff",fontSize:14,outline:"none",marginBottom:14}}/>
            </div>
            <div style={{overflowY:"auto",padding:"0 20px 20px"}}>
              {filteredGrouped.map(({day,exercises})=>(
                <div key={day} style={{marginBottom:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <div style={{background:TG[day],borderRadius:6,padding:"2px 10px",fontSize:10,fontWeight:700,color:"#fff"}}>{day}</div>
                    <div style={{height:1,flex:1,background:"#1C1C1E"}}/>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {exercises.map(ex=>{
                      const inSession=activeSession.some(e=>e.name===ex.name);
                      const isActive=currentEx===ex.name;
                      return (
                        <button key={ex.name} onClick={()=>pickExercise(ex.name)}
                          style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",borderRadius:12,background:isActive?TBG[day]:inSession?"#1C1C1E":"#181818",border:`1px solid ${isActive?TC[day]:inSession?"#2C2C2E":"#1C1C1E"}`,cursor:"pointer",textAlign:"left"}}>
                          <div>
                            <div style={{fontSize:13,fontWeight:600,color:isActive?TC[day]:inSession?"#888":"#ccc",marginBottom:2}}>{ex.name}</div>
                            <div style={{fontSize:11,color:"#444"}}>{ex.muscles[0]} · {ex.equipment}</div>
                          </div>
                          <div style={{fontSize:12,color:isActive?TC[day]:inSession?"#555":"#333",fontWeight:600}}>
                            {isActive?"active":inSession?`${activeSession.find(e=>e.name===ex.name)?.sets?.length||0} sets`:"+ Add"}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(0,0,0,0.88)",backdropFilter:"blur(20px)",borderBottom:"1px solid #111",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontWeight:900,fontSize:22,letterSpacing:-0.5}}>Iron<span style={{background:"linear-gradient(135deg,#FF6B35,#FF8C42)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Log</span></div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {user.user_metadata?.avatar_url
            ?<img src={user.user_metadata.avatar_url} referrerPolicy="no-referrer" style={{width:30,height:30,borderRadius:"50%",objectFit:"cover",border:"2px solid #333"}}/>
            :<div style={{width:30,height:30,borderRadius:"50%",background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>👤</div>
          }
          <span style={{fontSize:14,color:"#666"}}>{displayName}</span>
          <button onClick={logout} style={{background:"#1C1C1E",border:"none",color:"#888",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:13}}>Sign out</button>
        </div>
      </div>

      {/* Bottom tab bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:50,background:"rgba(0,0,0,0.92)",backdropFilter:"blur(20px)",borderTop:"1px solid #111",display:"flex",padding:"8px 0 14px"}}>
        {NAV.map(({v,i,l})=>(
          <button key={v} onClick={()=>setView(v)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 0"}}>
            <span style={{fontSize:20}}>{i}</span>
            <span style={{fontSize:10,fontWeight:600,color:view===v?"#fff":"#444",letterSpacing:0.5}}>{l.toUpperCase()}</span>
            {view===v&&<div style={{width:4,height:4,borderRadius:"50%",background:TC[suggested],marginTop:1}}/>}
          </button>
        ))}
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"20px 16px 0"}}>

        {/* ── HOME ──────────────────────────────────────────── */}
        {view==="home"&&(
          <div>
            <div style={{background:`linear-gradient(135deg,${TC[suggested]}20,${TC[suggested]}05)`,border:`1px solid ${TC[suggested]}30`,borderRadius:24,padding:"28px 22px",marginBottom:14,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",right:-30,top:-30,width:160,height:160,borderRadius:"50%",background:`${TC[suggested]}08`}}/>
              <div style={{fontSize:12,color:TC[suggested],fontWeight:600,letterSpacing:0.5,marginBottom:6}}>HEY {displayName.toUpperCase()}, NEXT UP</div>
              <div style={{fontSize:50,fontWeight:900,letterSpacing:-2,color:"#fff",marginBottom:4}}>{suggested}</div>
              <div style={{fontSize:14,color:"#555",marginBottom:22}}>Push → Pull → Legs rotation</div>
              <div style={{display:"flex",gap:10}}>
                {["Push","Pull","Legs"].map(t=>(
                  <button key={t} onClick={()=>startSession(t)} style={{flex:1,padding:"13px 0",borderRadius:14,border:`1.5px solid ${t===suggested?TC[t]:"#222"}`,background:t===suggested?TG[t]:"#111",color:t===suggested?"#fff":"#555",fontWeight:700,fontSize:15,cursor:"pointer"}}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
              {[{l:"Total",v:sessions.length,e:"🏋️"},{l:"This Week",v:weekCount,e:"📅"},{l:"Last",v:recent?recent.type:"—",e:"⏱️"},{l:"Custom",v:totalCustom,e:"✏️"}].map(({l,v,e})=>(
                <div key={l} style={{background:"#111",borderRadius:16,padding:"14px 8px",textAlign:"center",border:"1px solid #1C1C1E"}}>
                  <div style={{fontSize:18,marginBottom:4}}>{e}</div>
                  <div style={{fontSize:20,fontWeight:800}}>{v}</div>
                  <div style={{fontSize:10,color:"#555",fontWeight:600,marginTop:2}}>{l.toUpperCase()}</div>
                </div>
              ))}
            </div>
            {recent&&(
              <div style={{background:"#111",borderRadius:20,padding:18,marginBottom:14,border:"1px solid #1C1C1E"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{background:TG[recent.type],borderRadius:8,padding:"3px 12px",fontSize:12,fontWeight:700,color:"#fff"}}>{recent.type}</div>
                    {recent.mood&&<span style={{fontSize:13}}>{recent.mood.split(" ")[0]}</span>}
                  </div>
                  <span style={{fontSize:12,color:"#555"}}>{new Date(recent.date).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}</span>
                </div>
                {recent.notes&&<div style={{fontSize:13,color:"#666",marginBottom:10,fontStyle:"italic"}}>"{recent.notes}"</div>}
                {(recent.exercises||[]).map(ex=>(
                  <div key={ex.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:"1px solid #1C1C1E"}}>
                    <span style={{fontSize:13,color:"#ccc",fontWeight:500}}>{ex.name}</span>
                    <span style={{fontSize:12,color:"#555"}}>{(ex.sets||[]).map(s=>`${s.weight||"?"}×${s.reps}`).join(" · ")}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{background:"#111",borderRadius:16,padding:"14px 16px",display:"flex",gap:12,alignItems:"flex-start",border:"1px solid #1C1C1E"}}>
              <span style={{fontSize:20}}>📈</span>
              <div>
                <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>Progressive Overload</div>
                <div style={{fontSize:12,color:"#555",lineHeight:1.5}}>6 reps → 8 reps → 10 reps → weight up, back to 6. Each set tracks independently.</div>
              </div>
            </div>
          </div>
        )}

        {/* ── SESSION ───────────────────────────────────────── */}
        {view==="session"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <div style={{fontSize:12,color:TC[sessionType],fontWeight:600,marginBottom:2,letterSpacing:0.5}}>{sessionType.toUpperCase()} DAY</div>
                <div style={{fontSize:26,fontWeight:800}}>{activeSession.length} exercise{activeSession.length!==1?"s":""} · {activeSession.reduce((t,e)=>t+e.sets.length,0)} sets</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setPickerOpen(true)} style={{background:TBG[sessionType],border:`1px solid ${TC[sessionType]}44`,color:TC[sessionType],padding:"8px 14px",borderRadius:12,cursor:"pointer",fontWeight:600,fontSize:14}}>+ Exercise</button>
                <button onClick={()=>setView("home")} style={{width:36,height:36,borderRadius:"50%",background:"#1C1C1E",border:"none",color:"#888",fontSize:16,cursor:"pointer"}}>✕</button>
              </div>
            </div>

            {activeSession.length===0?(
              <div style={{textAlign:"center",padding:"60px 0"}}>
                <div style={{fontSize:48,marginBottom:16}}>🏋️</div>
                <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>Start your workout</div>
                <div style={{fontSize:14,color:"#555",marginBottom:24}}>Tap "+ Exercise" to add your first exercise</div>
                <button onClick={()=>setPickerOpen(true)} style={{background:TG[sessionType],border:"none",color:"#fff",padding:"14px 28px",borderRadius:14,cursor:"pointer",fontWeight:700,fontSize:15}}>Choose Exercise</button>
              </div>
            ):(
              <div>
                {/* Exercise tabs */}
                <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:10,marginBottom:16}}>
                  {activeSession.map(e=>(
                    <button key={e.name} onClick={()=>setCurrentEx(e.name)}
                      style={{padding:"7px 13px",borderRadius:20,border:`1.5px solid ${currentEx===e.name?TC[sessionType]:"#1C1C1E"}`,background:currentEx===e.name?TBG[sessionType]:"#111",color:currentEx===e.name?TC[sessionType]:"#555",fontWeight:600,fontSize:12,whiteSpace:"nowrap",flexShrink:0,cursor:"pointer"}}>
                      {e.name.split(" ")[0]} {e.sets.length>0&&<span style={{opacity:0.7}}>({e.sets.length})</span>}
                    </button>
                  ))}
                </div>

                {/* Active exercise card */}
                {currentEx&&currentExData&&<ExerciseCard
                  exData={currentExData}
                  sets={currentExSets}
                  prog={currentProg}
                  imgSrc={currentExData.imgId&&!imgErrors[currentExData.imgId]?`${IMAGE_BASE}/${currentExData.imgId}/${imgFrame[currentExData.imgId]??0}.jpg`:null}
                  onImgError={()=>setImgErrors(e=>({...e,[currentExData.imgId]:true}))}
                  onAddSet={(w,r)=>addSet(currentEx,w,r)}
                  onRemoveSet={(si)=>removeSet(currentEx,si)}
                  onRemoveExercise={()=>removeExercise(currentEx)}
                  color={TC[sessionType]}
                  gradient={TG[sessionType]}
                  bg={TBG[sessionType]}
                />}

                {/* Finish button */}
                {activeSession.some(e=>e.sets.length>0)&&(
                  <button onClick={()=>setShowFinishModal(true)} style={{width:"100%",padding:"16px",background:TG[sessionType],border:"none",borderRadius:16,color:"#fff",fontWeight:700,fontSize:16,cursor:"pointer",marginTop:16,boxShadow:`0 8px 24px ${TC[sessionType]}40`}}>
                    Finish Session →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── HISTORY ───────────────────────────────────────── */}
        {view==="history"&&(
          <div>
            <div style={{fontSize:26,fontWeight:800,marginBottom:20}}>Session History</div>
            {sessions.length===0
              ?<div style={{textAlign:"center",padding:"48px 0",color:"#555",fontSize:15}}>No sessions yet. Start your first workout! 🏋️</div>
              :[...sessions].reverse().map(sess=>(
                <div key={sess.id} style={{background:"#111",borderRadius:20,padding:18,marginBottom:12,border:"1px solid #1C1C1E"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:sess.notes?8:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{background:TG[sess.type],borderRadius:8,padding:"3px 12px",fontSize:12,fontWeight:700,color:"#fff"}}>{sess.type}</div>
                      {sess.mood&&<span style={{fontSize:13,color:"#888"}}>{sess.mood}</span>}
                    </div>
                    <span style={{fontSize:12,color:"#555"}}>{new Date(sess.date).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"2-digit"})}</span>
                  </div>
                  {sess.notes&&<div style={{fontSize:13,color:"#666",marginBottom:10,fontStyle:"italic",lineHeight:1.4}}>"{sess.notes}"</div>}
                  {(sess.exercises||[]).map(ex=>(
                    <div key={ex.name} style={{paddingTop:10,borderTop:"1px solid #1C1C1E"}}>
                      <div style={{fontSize:13,color:"#888",fontWeight:600,marginBottom:4}}>{ex.name}</div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {(ex.sets||[]).map((set,i)=>(
                          <span key={i} style={{fontSize:12,color:"#555",background:"#1C1C1E",padding:"3px 10px",borderRadius:8}}>{set.weight||"?"}kg × {set.reps}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            }
          </div>
        )}

        {/* ── ANALYSIS ──────────────────────────────────────── */}
        {view==="analysis"&&(
          <div>
            <div style={{fontSize:26,fontWeight:800,marginBottom:6}}>Progress</div>
            <div style={{fontSize:14,color:"#555",marginBottom:20}}>Select an exercise to see your strength curve</div>
            {sessions.length<2
              ?<div style={{textAlign:"center",padding:"48px 0",color:"#555",fontSize:15}}>Complete at least 2 sessions to see trends 📈</div>
              :(
                <div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
                    {getExNames().map(n=>(
                      <button key={n} onClick={()=>setAnalysisEx(n)} style={{padding:"8px 14px",borderRadius:20,border:`1.5px solid ${analysisEx===n?"#fff":"#1C1C1E"}`,background:analysisEx===n?"#1C1C1E":"#111",color:analysisEx===n?"#fff":"#555",fontWeight:500,fontSize:13,cursor:"pointer"}}>{n}</button>
                    ))}
                  </div>
                  {analysisEx&&(()=>{
                    const maxes=getMaxes(analysisEx),history=getHistory(analysisEx);
                    if(!maxes.length)return null;
                    const best=Math.max(...maxes.map(m=>m.weight));
                    const gained=maxes.length>1?(maxes[maxes.length-1].weight-maxes[0].weight).toFixed(1):0;
                    const chartH=100,minW=Math.min(...maxes.map(m=>m.weight)),maxW=Math.max(...maxes.map(m=>m.weight)),range=maxW-minW||1;
                    const pts=maxes.map((m,i)=>({x:maxes.length===1?50:(i/(maxes.length-1))*100,y:chartH-((m.weight-minW)/range)*(chartH-16)-8,...m}));
                    const pl=pts.map(p=>`${p.x},${p.y}`).join(" ");
                    const color=TC[maxes[0]?.type]||"#FF6B35";
                    return(
                      <div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
                          {[{l:"Best",v:`${best}kg`},{l:"Gained",v:`+${gained}kg`},{l:"Sessions",v:maxes.length},{l:"Sets",v:history.length}].map(({l,v})=>(
                            <div key={l} style={{background:"#111",borderRadius:16,padding:"14px 8px",textAlign:"center",border:"1px solid #1C1C1E"}}>
                              <div style={{fontSize:18,fontWeight:800}}>{v}</div>
                              <div style={{fontSize:10,color:"#555",fontWeight:600,marginTop:3}}>{l.toUpperCase()}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{background:"#111",borderRadius:20,padding:20,marginBottom:12,border:"1px solid #1C1C1E"}}>
                          <div style={{fontSize:11,color:"#555",fontWeight:600,letterSpacing:0.5,marginBottom:14}}>WEIGHT OVER TIME (kg)</div>
                          <svg width="100%" height={chartH+24} viewBox={`0 0 100 ${chartH+24}`} preserveAspectRatio="none" style={{overflow:"visible"}}>
                            <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
                            {[0,0.5,1].map(f=><line key={f} x1="0" y1={chartH-f*(chartH-16)-8} x2="100" y2={chartH-f*(chartH-16)-8} stroke="#1C1C1E" strokeWidth="0.8"/>)}
                            <polygon points={`0,${chartH} ${pl} 100,${chartH}`} fill="url(#g)"/>
                            <polyline points={pl} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="3" fill={color}/>)}
                            <text x="0" y={chartH+18} fontSize="4" fill="#444">{new Date(maxes[0]?.date).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</text>
                            {maxes.length>1&&<text x="100" y={chartH+18} fontSize="4" fill="#444" textAnchor="end">{new Date(maxes[maxes.length-1]?.date).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</text>}
                          </svg>
                        </div>
                        <div style={{background:"#111",borderRadius:20,padding:18,border:"1px solid #1C1C1E"}}>
                          <div style={{fontSize:11,color:"#555",fontWeight:600,letterSpacing:0.5,marginBottom:12}}>ALL SETS LOGGED</div>
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

        {/* ── EXERCISES ─────────────────────────────────────── */}
        {view==="exercises"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontSize:26,fontWeight:800}}>Exercises</div>
              <button onClick={()=>setShowAddModal(true)} style={{background:"linear-gradient(135deg,#FF6B35,#FF8C42)",border:"none",color:"#fff",padding:"10px 16px",borderRadius:12,cursor:"pointer",fontWeight:700,fontSize:14}}>+ Add Custom</button>
            </div>
            {["Push","Pull","Legs"].map(day=>{
              const customs=customEx[day]||[], builtins=BUILTIN[day]||[];
              const hiddenCount=builtins.filter(e=>hiddenEx[e.name]).length;
              const isOpen=expandedDay===day;
              return(
                <div key={day} style={{background:"#111",borderRadius:20,marginBottom:12,border:`1px solid ${TC[day]}22`,overflow:"hidden"}}>
                  <button onClick={()=>setExpandedDay(isOpen?null:day)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:18,background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{background:TG[day],borderRadius:8,padding:"4px 14px",fontSize:12,fontWeight:700,color:"#fff"}}>{day}</div>
                      <span style={{fontSize:13,color:"#555"}}>
                        {builtins.length-hiddenCount} visible
                        {hiddenCount>0&&<span style={{color:"#FF3B30"}}>, {hiddenCount} hidden</span>}
                        {customs.length>0&&<span style={{color:TC[day]}}>, {customs.length} custom</span>}
                      </span>
                    </div>
                    <span style={{color:"#555",fontSize:16}}>{isOpen?"▲":"▼"}</span>
                  </button>
                  {customs.length>0&&(
                    <div style={{borderTop:"1px solid #1C1C1E",padding:"0 18px"}}>
                      {customs.map(ex=>(
                        <div key={ex.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #1C1C1E"}}>
                          <div>
                            <span style={{fontSize:14,color:"#ccc",fontWeight:500}}>{ex.name}</span>
                            <span style={{fontSize:10,background:TC[day]+"22",color:TC[day],padding:"1px 6px",borderRadius:4,marginLeft:8,fontWeight:700}}>CUSTOM</span>
                          </div>
                          <button onClick={()=>{if(window.confirm(`Remove "${ex.name}"?`))deleteCustomExercise(ex.id,day);}} style={{background:"rgba(255,59,48,0.1)",border:"1px solid rgba(255,59,48,0.2)",color:"#FF3B30",fontSize:12,padding:"5px 12px",borderRadius:8,cursor:"pointer"}}>Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                  {isOpen&&(
                    <div style={{borderTop:"1px solid #1C1C1E",padding:"8px 18px 12px"}}>
                      <div style={{fontSize:11,color:"#444",fontWeight:600,letterSpacing:0.5,marginBottom:10,marginTop:4}}>BUILT-IN — tap Hide to remove from your picker</div>
                      {builtins.map(ex=>{
                        const hidden=hiddenEx[ex.name];
                        return(
                          <div key={ex.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid #1C1C1E",opacity:hidden?0.4:1}}>
                            <div>
                              <span style={{fontSize:13,color:hidden?"#444":"#888"}}>{ex.name}</span>
                              <span style={{fontSize:10,color:"#444",marginLeft:8}}>{ex.equipment}</span>
                              {hidden&&<span style={{fontSize:10,color:"#FF3B30",marginLeft:8,fontWeight:600}}>HIDDEN</span>}
                            </div>
                            <button onClick={()=>toggleHideExercise(ex.name)} style={{background:hidden?"rgba(34,197,94,0.1)":"rgba(255,59,48,0.08)",border:`1px solid ${hidden?"rgba(34,197,94,0.3)":"rgba(255,59,48,0.2)"}`,color:hidden?"#22C55E":"#FF3B30",fontSize:11,padding:"4px 10px",borderRadius:8,cursor:"pointer",fontWeight:500}}>
                              {hidden?"Restore":"Hide"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

// ── Exercise Card (in-session logging) ────────────────────────────────────────
function ExerciseCard({exData,sets,prog,imgSrc,onImgError,onAddSet,onRemoveSet,onRemoveExercise,color,gradient,bg}) {
  const [weight,setWeight]=useState(prog?.weight?String(prog.weight):"");
  const [reps,setReps]=useState("");
  const [showTip,setShowTip]=useState(false);
  const [imgErr,setImgErr]=useState(false);

  // Reset inputs when exercise changes but keep suggested weight
  useEffect(()=>{
    setWeight(prog?.weight?String(prog.weight):"");
    setReps("");
  },[exData.name]);

  function handleAdd(){
    if(!weight||!reps){return;}
    onAddSet(weight,reps);
    // Keep weight, clear reps for next set
    setReps("");
  }

  return(
    <div style={{background:"#111",borderRadius:20,padding:18,marginBottom:14,border:"1px solid #1C1C1E"}}>
      {/* Header */}
      <div style={{display:"flex",gap:14,marginBottom:14}}>
        <div style={{width:100,height:75,borderRadius:14,overflow:"hidden",background:"#1C1C1E",flexShrink:0}}>
          {imgSrc&&!imgErr
            ?<img src={imgSrc} alt={exData.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={()=>{setImgErr(true);onImgError();}}/>
            :<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34}}>🏋️</div>
          }
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:16,fontWeight:700,marginBottom:5,lineHeight:1.2,color:"#fff"}}>{exData.name}</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:4}}>
            <span style={{fontSize:11,background:bg,color,padding:"2px 8px",borderRadius:6,fontWeight:600}}>{exData.muscles[0]}</span>
            {(exData.secondary||[]).slice(0,2).map(m=><span key={m} style={{fontSize:11,background:"#1C1C1E",color:"#555",padding:"2px 8px",borderRadius:6}}>{m}</span>)}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:11,color:"#444"}}>{exData.equipment}</span>
            {!exData.custom&&<button onClick={()=>setShowTip(t=>!t)} style={{fontSize:11,color,background:"none",border:"none",cursor:"pointer",fontWeight:600,padding:0}}>{showTip?"▲ tip":"▼ tip"}</button>}
            <button onClick={onRemoveExercise} style={{fontSize:11,color:"#FF3B30",background:"none",border:"none",cursor:"pointer",fontWeight:600,padding:0,marginLeft:"auto"}}>Remove</button>
          </div>
        </div>
      </div>

      {showTip&&!exData.custom&&<div style={{background:"#1C1C1E",borderRadius:12,padding:"10px 14px",fontSize:13,color:"#888",lineHeight:1.5,marginBottom:14}}>{exData.tip}</div>}

      {/* Progression hint */}
      {prog&&<div style={{display:"flex",gap:8,alignItems:"center",background:"#1C1C1E",borderRadius:10,padding:"8px 12px",marginBottom:14,fontSize:12,color:"#666"}}>
        <span>{prog.phase==="weight-up"?"🔥":prog.phase==="reps-up"?"📈":prog.phase==="new"?"🆕":"🔄"}</span>
        <span>{prog.note}</span>
      </div>}

      {/* Logged sets */}
      {sets.length>0&&(
        <div style={{marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"28px 1fr 1fr 1fr 28px",gap:8,paddingBottom:6,borderBottom:"1px solid #1C1C1E",marginBottom:6}}>
            {["SET","KG","REPS","TARGET",""].map(h=><div key={h} style={{fontSize:9,color:"#444",fontWeight:700,textAlign:"center",letterSpacing:0.5}}>{h}</div>)}
          </div>
          {sets.map((set,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"28px 1fr 1fr 1fr 28px",gap:8,alignItems:"center",marginBottom:6}}>
              <div style={{fontSize:12,fontWeight:700,color,textAlign:"center"}}>S{i+1}</div>
              <div style={{fontSize:15,fontWeight:700,color:"#ccc",textAlign:"center"}}>{set.weight}kg</div>
              <div style={{fontSize:15,fontWeight:700,color:"#ccc",textAlign:"center"}}>{set.reps}</div>
              <div style={{fontSize:12,color:"#555",textAlign:"center"}}>tgt {set.targetReps}</div>
              <button onClick={()=>onRemoveSet(i)} style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:14,textAlign:"center",padding:0}}>×</button>
            </div>
          ))}
        </div>
      )}

      {/* Add set inputs */}
      <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:10,color:"#555",fontWeight:600,letterSpacing:0.5,marginBottom:5}}>WEIGHT (kg)</div>
          <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder={prog?.weight?String(prog.weight):"0"}
            style={{width:"100%",background:"#1C1C1E",border:`1.5px solid ${weight?"#3A3A3C":"#2C2C2E"}`,borderRadius:10,padding:"12px 10px",color:"#fff",fontSize:18,fontWeight:700,textAlign:"center",outline:"none"}}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:10,color:"#555",fontWeight:600,letterSpacing:0.5,marginBottom:5}}>REPS</div>
          <input type="number" value={reps} onChange={e=>setReps(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd()} placeholder={prog?.targetReps?String(prog.targetReps):"0"}
            style={{width:"100%",background:"#1C1C1E",border:`1.5px solid ${reps?"#3A3A3C":"#2C2C2E"}`,borderRadius:10,padding:"12px 10px",color:"#fff",fontSize:18,fontWeight:700,textAlign:"center",outline:"none"}}/>
        </div>
        <button onClick={handleAdd} disabled={!weight||!reps}
          style={{padding:"12px 18px",background:weight&&reps?gradient:"#2C2C2E",border:"none",borderRadius:10,color:weight&&reps?"#fff":"#444",fontWeight:700,fontSize:15,cursor:weight&&reps?"pointer":"default",whiteSpace:"nowrap"}}>
          + Log Set
        </button>
      </div>
    </div>
  );
}
