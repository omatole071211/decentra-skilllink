import { startLogin } from "@/const";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { ArrowRight, Award, Bell, BookOpen, Check, CheckCircle2, ChevronRight, CircleHelp, Clock, Compass, Copy, ExternalLink, FilePlus2, Filter, Globe, GraduationCap, Handshake, LayoutDashboard, Link2, Loader2, MapPin, Menu, MessageCircle, MoreHorizontal, NotebookPen, Plus, Search, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Star, Target, Trash2, X, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { computeCampusMatches, type ComputedMatch, type MatchFilters } from "@/lib/matchmakingEngine";

const navItems = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "Discover matches", path: "/matches", icon: Compass, count: "5" },
  { label: "My requests", path: "/requests", icon: NotebookPen, count: "2" },
  { label: "Active exchanges", path: "/exchanges", icon: Handshake, count: "1" },
  { label: "Exchange history", path: "/history", icon: BookOpen },
  { label: "Profile & record", path: "/profile", icon: Award },
];

const history = [
  { with: "Maya Chen", initials: "MC", skill: "Presentation design", date: "Sep 26", color: "#c8dcbf" },
  { with: "Arjun Rao", initials: "AR", skill: "Git & GitHub", date: "Sep 18", color: "#ead2b8" },
  { with: "Leena Bose", initials: "LB", skill: "Photography basics", date: "Sep 04", color: "#c5d9e7" },
];

const viewMeta: Record<string, { eyebrow: string; title: string; description: string }> = {
  "/": { eyebrow: "Tuesday, October 3 · Campus commons", title: "Make your next useful connection.", description: "You have skills someone nearby needs — and a few things you want to learn next." },
  "/matches": { eyebrow: "Discover · reciprocal first", title: "People who make sense for you.", description: "Every recommendation includes the give-and-get behind the match, not just a score." },
  "/requests": { eyebrow: "Your requests · 2 open", title: "Turn a need into a clear ask.", description: "Describe what you are working on. SkillLink translates the context into useful matches." },
  "/exchanges": { eyebrow: "In motion · 1 active", title: "Keep the exchange moving.", description: "A lightweight workspace for agreeing on the swap, scheduling, and closing the loop." },
  "/history": { eyebrow: "Your record · 12 exchanges", title: "Proof of showing up.", description: "Your history is not a star rating — it is a record of skills contributed, learned, and completed." },
  "/profile": { eyebrow: "Your SkillLink profile", title: "A profile built from contribution.", description: "Share what you know, what you are learning, and the evidence that you follow through." },
};

function LogoMark() { return <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#c6f36b] text-[#17221e] shadow-[0_0_0_4px_rgba(198,243,107,.12)]"><Link2 size={17} strokeWidth={3} /></div>; }
function Tag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "green" | "blue" | "lime" }) {
  const styles = { neutral: "bg-[#eeece5] text-[#536159]", green: "bg-[#e1efc4] text-[#496724]", blue: "bg-[#dbeaf5] text-[#365970]", lime: "bg-[#c6f36b] text-[#24331e]" };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[tone]}`}>{children}</span>;
}
function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) { return <div className="mb-4 flex items-end justify-between gap-4"><div><p className="meta-label text-[#779643]">{eyebrow}</p><h2 className="display-font mt-1 text-[22px] font-semibold tracking-[-.04em] text-[#17221e]">{title}</h2></div>{action}</div>; }
function Metric({ value, label, note, tone = "dark" }: { value: string; label: string; note: string; tone?: "dark" | "lime" | "blue" }) {
  const bg = tone === "lime" ? "bg-[#c6f36b]" : tone === "blue" ? "bg-[#dbeaf5]" : "bg-[#17221e]";
  return <div className={`rounded-2xl ${bg} p-5 ${tone === "dark" ? "text-[#f6f3ec]" : "text-[#17221e]"}`}><p className="display-font text-[31px] font-semibold tracking-[-.08em]">{value}</p><p className="mt-1 text-sm font-semibold">{label}</p><p className={`mt-3 text-xs ${tone === "dark" ? "text-[#b8c6ba]" : "text-[#536159]"}`}>{note}</p></div>;
}

// Additional Feature 4 & 5: Enhanced Match Card with Modality, Schedule & Reciprocity
function MatchCard({ match, onOpen, onConnect, proposalSent }: { match: ComputedMatch; onOpen: () => void; onConnect: () => void; proposalSent?: boolean }) {
  return (
    <article className="lift rounded-2xl border border-[#d9ddd1] bg-[#fffdf8] p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
              <AvatarFallback style={{ background: match.avatar }} className="text-sm font-bold text-[#17221e]">{match.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="display-font font-semibold text-[#17221e]">{match.name}</h3>
              <p className="mt-0.5 text-xs text-[#718078]">{match.role}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="display-font text-2xl font-semibold tracking-[-.06em] text-[#17221e]">{match.score}%</p>
            <p className={`meta-label ${match.kind === "Reciprocal" ? "text-[#779643]" : "text-[#557991]"}`}>{match.kind} match</p>
          </div>
        </div>

        {/* Modality & Campus Availability Metadata */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1 rounded-full bg-[#f1f4ea] px-2.5 py-0.5 font-medium text-[#496724]">
            <MapPin size={11} className="text-[#779643]" /> {match.modality} {match.campusLocation ? `· ${match.campusLocation}` : ""}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-[#f4f3ed] px-2.5 py-0.5 font-medium text-[#536159]">
            <Clock size={11} className="text-[#718078]" /> {match.availability}
          </span>
        </div>

        {/* Reciprocity Exchange Flow */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#536159]">
          <span className="font-semibold text-[#17221e]">You give</span>
          {match.need.map(skill => <Tag key={skill} tone="blue">{skill}</Tag>)}
          <ArrowRight size={13} className="text-[#9bab9b]" />
          <span className="font-semibold text-[#17221e]">They give</span>
          {match.offer.map(skill => <Tag key={skill} tone="green">{skill}</Tag>)}
        </div>

        {/* AI Match Explanation */}
        <div className="mt-4 rounded-xl bg-[#f1f4ea] p-3.5">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#779643]" />
            <span className="text-xs font-bold text-[#3d552d]">Why this surfaced</span>
          </div>
          <p className="mt-1.5 text-xs leading-5 text-[#526056]">{match.explanation}</p>
          <button className="focus-ring mt-2 text-xs font-bold text-[#526e2d] underline decoration-[#a5c36d] underline-offset-4" onClick={onOpen}>
            See full match reasoning & icebreakers
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0eee6] pt-3.5">
        <div className="flex items-center gap-1.5 text-xs text-[#718078]">
          <CheckCircle2 size={14} className="text-[#759b3e]" />
          <span className="font-medium text-[#17221e]">{match.rating.toFixed(1)}</span> record ({match.completedExchanges} swaps)
        </div>
        <Button className="h-9 rounded-full bg-[#17221e] px-4 text-xs text-[#f6f3ec] hover:bg-[#2c4034]" onClick={onConnect} disabled={proposalSent}>
          {proposalSent ? <><Check size={14} /> Proposal sent</> : <>Propose exchange <ArrowRight size={14} /></>}
        </Button>
      </div>
    </article>
  );
}

export default function Home() {
  const [location, setLocation] = useLocation();
  const [mobileNav, setMobileNav] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<ComputedMatch | null>(null);
  const [matchOpen, setMatchOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [exchangeComplete, setExchangeComplete] = useState(false);

  // Additional Feature 4: Discovery Filters State
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<MatchFilters>({
    kind: "All matches",
    department: "All",
    proficiencyTier: "All",
    modality: "All",
    availability: "All",
    searchQuery: "",
    sortBy: "score",
  });
  const [requestText, setRequestText] = useState("");
  const [requestTitle, setRequestTitle] = useState("");
  const [feedbackNote, setFeedbackNote] = useState("");
  const [createdRequest, setCreatedRequest] = useState<{ title: string; description: string } | null>(null);
  const [proposalSent, setProposalSent] = useState<string | null>(null);
  const [feedbackSignals, setFeedbackSignals] = useState<string[]>([]);
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Additional Feature 3: AI-Powered Skill Extraction
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<{ id: string, name: string, type: "need" | "offer", confidence: number }[]>([]);

  // Expanded taxonomy: keyword → canonical skill name
  const taxonomyMap: { keywords: string[], skill: string }[] = [
    { keywords: ["react", "reactjs", "react.js"], skill: "React.js" },
    { keywords: ["frontend", "front-end", "front end"], skill: "Frontend Development" },
    { keywords: ["javascript", "js"], skill: "JavaScript" },
    { keywords: ["typescript", "ts"], skill: "TypeScript" },
    { keywords: ["k8s", "kubernetes"], skill: "Kubernetes" },
    { keywords: ["docker", "containers", "containerization"], skill: "Docker & Containers" },
    { keywords: ["devops", "ci/cd", "cicd"], skill: "DevOps" },
    { keywords: ["figma", "prototyping"], skill: "Figma & Prototyping" },
    { keywords: ["ui", "ux", "ui/ux", "interface design", "user interface"], skill: "UI/UX Design" },
    { keywords: ["web design", "visual design"], skill: "Web Design" },
    { keywords: ["video editing", "video edit", "premiere", "after effects", "final cut", "davinci", "motion"], skill: "Video Editing" },
    { keywords: ["photography", "photo editing", "lightroom", "photoshop"], skill: "Photography & Photo Editing" },
    { keywords: ["machine learning", "ml", "deep learning", "neural network"], skill: "Machine Learning" },
    { keywords: ["data science", "data analysis", "analytics"], skill: "Data Science & Analytics" },
    { keywords: ["python"], skill: "Python" },
    { keywords: ["node", "nodejs", "node.js", "express"], skill: "Node.js / Express" },
    { keywords: ["backend", "back-end", "server side", "server-side"], skill: "Backend Development" },
    { keywords: ["sql", "database", "postgres", "mysql", "mongodb"], skill: "Database Design" },
    { keywords: ["blockchain", "crypto", "web3", "solidity", "smart contract"], skill: "Web3 & Blockchain" },
    { keywords: ["flutter", "dart"], skill: "Flutter / Dart" },
    { keywords: ["android", "kotlin"], skill: "Android Development" },
    { keywords: ["ios", "swift", "swiftui"], skill: "iOS / Swift" },
    { keywords: ["presentation", "pitching", "slides", "storytelling"], skill: "Presentation & Storytelling" },
    { keywords: ["copywriting", "writing", "content writing"], skill: "Content Writing" },
    { keywords: ["graphic design", "illustration", "branding", "logo"], skill: "Graphic Design" },
    { keywords: ["3d", "blender", "3d modeling"], skill: "3D Modeling / Blender" },
    { keywords: ["rust", "c++", "cpp", "systems programming"], skill: "Systems Programming" },
    { keywords: ["java", "spring boot"], skill: "Java / Spring Boot" },
    { keywords: ["research", "literature review"], skill: "Academic Research" },
  ];

  // Need-signal words — if a sentence contains one, skills found in it are "needs"
  const needSignals = ["need", "want", "looking for", "require", "seeking", "wish", "learn", "learning", "improve", "want to", "struggling", "help with"];
  // Offer-signal words — if a sentence contains one, skills found in it are "offers"
  const offerSignals = ["have", "know", "can", "offer", "experienced", "built", "expertise", "good at", "proficient", "background in", "worked on", "skilled", "i do", "i am a"];

  const mockExtractSkills = (text: string) => {
    // Split into sentences
    const sentences = text
      .split(/[.!?\n]+/)
      .map(s => s.trim())
      .filter(Boolean);

    const foundSkills: { name: string, type: "need" | "offer" }[] = [];

    sentences.forEach(sentence => {
      const lower = sentence.toLowerCase();

      // Determine the dominant signal in this sentence
      const isNeedSentence = needSignals.some(w => lower.includes(w));
      const isOfferSentence = offerSignals.some(w => lower.includes(w));

      // Default: if both or neither signal present, try to infer from whole sentence
      let sentenceType: "need" | "offer" | null = null;
      if (isNeedSentence && !isOfferSentence) sentenceType = "need";
      else if (isOfferSentence && !isNeedSentence) sentenceType = "offer";
      else if (isNeedSentence && isOfferSentence) {
        // Ambiguous — use whichever signal appears first
        const firstNeed = Math.min(...needSignals.map(w => lower.indexOf(w)).filter(i => i >= 0));
        const firstOffer = Math.min(...offerSignals.map(w => lower.indexOf(w)).filter(i => i >= 0));
        sentenceType = firstNeed < firstOffer ? "need" : "offer";
      }

      // If no signals, skip this sentence (don't guess randomly)
      if (!sentenceType) return;

      taxonomyMap.forEach(({ keywords, skill }) => {
        if (keywords.some(kw => lower.includes(kw))) {
          if (!foundSkills.find(s => s.name === skill)) {
            foundSkills.push({ name: skill, type: sentenceType! });
          }
        }
      });
    });

    // Fallback if nothing was found at all
    if (foundSkills.length === 0) {
      foundSkills.push({ name: "General Collaboration", type: "need" });
    }

    return foundSkills.map((s, i) => ({
      ...s,
      id: Date.now().toString() + i,
      confidence: Math.floor(Math.random() * 12) + 87 // 87–98%
    }));
  };

  const handleAnalyzeRequest = () => {
    if (!requestTitle.trim() || !requestText.trim()) return;
    setIsAnalyzing(true);
    
    setTimeout(() => {
       const skills = mockExtractSkills(requestTitle + " " + requestText);
       setExtractedSkills(skills);
       setIsAnalyzing(false);
       setAnalysisComplete(true);
    }, 1500);
  };

  const handleRemoveExtractedSkill = (id: string) => {
    setExtractedSkills(prev => prev.filter(s => s.id !== id));
  };


  // Additional Feature 2: Student Profile & Skill Inventory System
  const [profile, setProfile] = useState({
    name: "Ananya Kapoor",
    initials: "AK",
    role: "Computer Science · 3rd year",
    institution: "Northbridge University",
    department: "Computer Science",
    graduationYear: "2026",
    bio: "Building useful things with Python and learning how to make them feel clear, warm, and easy to use.",
    contactEmail: "ananya.k@northbridge.edu",
    discord: "ananya_k#4120",
    telegram: "@ananyak",
    linkedin: "linkedin.com/in/ananyakapoor",
    visibility: "campus_only" as "campus_only" | "public" | "department_only",
  });

  const [skillsOffered, setSkillsOffered] = useState([
    { id: "1", name: "Python", proficiency: "Advanced" as "Beginner" | "Intermediate" | "Advanced" | "Expert", category: "Programming & ML", projectUrl: "https://github.com/ananya/fastapi-demo" },
    { id: "2", name: "Flask", proficiency: "Intermediate" as "Beginner" | "Intermediate" | "Advanced" | "Expert", category: "Web Backend", projectUrl: "https://github.com/ananya/flask-auth" },
    { id: "3", name: "C++", proficiency: "Intermediate" as "Beginner" | "Intermediate" | "Advanced" | "Expert", category: "Systems & Algorithms", projectUrl: "" },
  ]);

  const [learningGoalsList, setLearningGoalsList] = useState([
    { id: "1", name: "UI/UX", priority: "Urgent" as "Urgent" | "High" | "Normal", note: "Hackathon project UI" },
    { id: "2", name: "Figma", priority: "High" as "Urgent" | "High" | "Normal", note: "Design system components" },
    { id: "3", name: "Visual storytelling", priority: "Normal" as "Urgent" | "High" | "Normal", note: "Pitching & presentations" },
  ]);

  const [profileOpen, setProfileOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<"details" | "skills" | "goals">("details");
  const [editProfile, setEditProfile] = useState({ ...profile });

  // Skill CRUD form state
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProficiency, setNewSkillProficiency] = useState<"Beginner" | "Intermediate" | "Advanced" | "Expert">("Intermediate");
  const [newSkillCategory, setNewSkillCategory] = useState("");
  const [newSkillProjectUrl, setNewSkillProjectUrl] = useState("");

  // Goal CRUD form state
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalPriority, setNewGoalPriority] = useState<"Urgent" | "High" | "Normal">("High");
  const [newGoalNote, setNewGoalNote] = useState("");

  const handleSaveProfile = () => {
    const initials = editProfile.name
      .split(" ")
      .filter(Boolean)
      .map(part => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AK";
    const updated = {
      ...editProfile,
      initials,
      role: `${editProfile.department || "Student"} · Class of ${editProfile.graduationYear || "2026"}`,
    };
    setProfile(updated);
    setProfileOpen(false);
    notify("Profile updated", "Your academic info, handles, and privacy settings are saved.");
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill = {
      id: Date.now().toString(),
      name: newSkillName.trim(),
      proficiency: newSkillProficiency,
      category: newSkillCategory.trim() || "General",
      projectUrl: newSkillProjectUrl.trim(),
    };
    setSkillsOffered(prev => [...prev, newSkill]);
    setNewSkillName("");
    setNewSkillCategory("");
    setNewSkillProjectUrl("");
    notify("Skill added to portfolio", `${newSkill.name} (${newSkill.proficiency}) is now in your offered inventory.`);
  };

  const handleRemoveSkill = (id: string) => {
    setSkillsOffered(prev => prev.filter(s => s.id !== id));
    notify("Skill removed", "Skill removed from your offered inventory.");
  };

  const handleAddGoal = () => {
    if (!newGoalName.trim()) return;
    const newGoal = {
      id: Date.now().toString(),
      name: newGoalName.trim(),
      priority: newGoalPriority,
      note: newGoalNote.trim() || "Target learning goal",
    };
    setLearningGoalsList(prev => [...prev, newGoal]);
    setNewGoalName("");
    setNewGoalNote("");
    notify("Learning goal added", `Wishlist updated with ${newGoal.name} (${newGoal.priority}).`);
  };

  const handleRemoveGoal = (id: string) => {
    setLearningGoalsList(prev => prev.filter(g => g.id !== id));
    notify("Learning goal removed", "Goal removed from your wishlist.");
  };

  const activePath = location === "/dashboard" ? "/" : location;
  const meta = viewMeta[activePath] ?? viewMeta["/"];
  const currentSection = activePath === "/" ? "overview" : activePath.slice(1);

  // Additional Feature 4: Compute Dynamic Matches with Semantic Engine
  const computedMatches = useMemo(() => {
    const activeReqSkills = [
      ...extractedSkills.filter(s => s.type === "need").map(s => s.name),
      ...(createdRequest ? [createdRequest.title] : [])
    ];
    return computeCampusMatches(skillsOffered, learningGoalsList, activeReqSkills, filters);
  }, [skillsOffered, learningGoalsList, extractedSkills, createdRequest, filters]);

  const activeMatch = selectedMatch || computedMatches[0] || null;
  const topMatch = computedMatches[0] || null;

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.kind !== "All matches") count++;
    if (filters.department !== "All") count++;
    if (filters.proficiencyTier !== "All") count++;
    if (filters.modality !== "All") count++;
    if (filters.availability !== "All") count++;
    if (filters.searchQuery.trim()) count++;
    if (filters.sortBy !== "score") count++;
    return count;
  }, [filters]);

  const workspaceNavItems = [
    { label: "Overview", path: "/", icon: LayoutDashboard },
    { label: "Discover matches", path: "/matches", icon: Compass, count: computedMatches.length.toString() },
    { label: "My requests", path: "/requests", icon: NotebookPen, count: createdRequest ? "3" : "2" },
    { label: "Active exchanges", path: "/exchanges", icon: Handshake, count: exchangeComplete ? "0" : "1" },
    { label: "Exchange history", path: "/history", icon: BookOpen },
    { label: "Profile & record", path: "/profile", icon: Award },
  ];

  const notify = (message: string, description?: string) => toast.success(message, { description });
  const go = (path: string) => { setLocation(path); setMobileNav(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const propose = (match?: ComputedMatch | null) => {
    const target = match || activeMatch;
    if (!target) return;
    setSelectedMatch(target);
    setProposalSent(target.id);
    notify("Exchange proposal sent", `${target.name} will see your offer to trade ${target.need[0] || "skills"} for ${target.offer[0] || "guidance"}.`);
  };
  const createRequest = () => { 
    if (!requestTitle.trim() || !requestText.trim()) return; 
    setCreatedRequest({ title: requestTitle.trim(), description: requestText.trim() }); 
    setRequestOpen(false); 
    notify("Request added to your board", `SkillLink tagged ${extractedSkills.length} skills and refreshed your matches.`); 
    setRequestTitle(""); 
    setRequestText(""); 
    setAnalysisComplete(false);
    setExtractedSkills([]);
    go("/requests"); 
  };

  const completeExchange = () => { setExchangeComplete(true); notify("Exchange marked complete", "Your contribution record is ready for feedback."); setFeedbackOpen(true); };
  const sendFeedback = () => { setFeedbackOpen(false); setFeedbackSent(true); setFeedbackSignals([]); setFeedbackNote(""); notify("Feedback added to your record", "Thanks for closing the loop with Rahul."); };

  return <div className="min-h-screen bg-[#f6f3ec] text-[#17221e]">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[278px] flex-col bg-[#17221e] px-4 py-5 text-[#edf1e9] transition-transform lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center justify-between px-3"><div className="flex items-center gap-3"><LogoMark /><span className="display-font text-[18px] font-semibold tracking-[-.04em]">SkillLink</span></div><button className="lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18} /></button></div>
      <div className="mt-8 rounded-2xl border border-[#314239] bg-[#213128] p-3.5"><div className="flex items-start gap-2.5"><div className="mt-0.5 rounded-full bg-[#c6f36b] p-1 text-[#17221e]"><Zap size={12} fill="currentColor" /></div><div><p className="text-xs font-semibold text-[#dce8d9]">Your reciprocity streak</p><p className="mt-1 text-[12px] leading-4 text-[#9eb19e]">2 exchanges completed this month.</p><div className="mt-3 flex gap-1"><span className="h-1.5 w-8 rounded-full bg-[#c6f36b]" /><span className="h-1.5 w-8 rounded-full bg-[#c6f36b]" /><span className="h-1.5 w-8 rounded-full bg-[#556e5c]" /><span className="h-1.5 w-8 rounded-full bg-[#556e5c]" /></div></div></div></div>
      <div className="mt-8"><p className="meta-label px-3 text-[#819487]">Workspace</p><nav className="mt-2 space-y-1">{workspaceNavItems.map(item => { const active = item.path === activePath; return <button key={item.path} onClick={() => go(item.path)} className={`focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${active ? "bg-[#c6f36b] font-bold text-[#17221e]" : "text-[#b7c6b9] hover:bg-[#263a2e] hover:text-white"}`}><item.icon size={17} strokeWidth={active ? 2.5 : 1.8} /><span className="flex-1">{item.label}</span>{item.count && <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? "bg-[#17221e] text-[#c6f36b]" : "bg-[#34493a] text-[#c7d7c7]"}`}>{item.count}</span>}</button>; })}</nav></div>
      <div className="mt-auto"><div className="mb-5 border-t border-[#314239] pt-4"><button onClick={() => notify("Settings are coming next", "Your exchange preferences will live here.")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#b7c6b9] hover:bg-[#263a2e] hover:text-white"><Settings2 size={17} /><span>Exchange preferences</span></button></div><div className="flex items-center gap-3 rounded-2xl bg-[#213128] p-3"><Avatar className="h-9 w-9 border border-[#5b7763]"><AvatarFallback className="bg-[#e7c6af] text-xs font-bold text-[#17221e]">{profile.initials}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{profile.name}</p><p className="truncate text-[11px] text-[#9eb19e]">{profile.institution}</p></div><button onClick={() => go("/profile")} className="text-[#9eb19e] hover:text-[#c6f36b]" aria-label="Open profile"><ChevronRight size={16} /></button></div></div>
    </aside>
    {mobileNav && <button className="fixed inset-0 z-30 bg-[#17221e]/40 lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation overlay" />}
    <main className="min-h-screen lg:pl-[278px]">
      <header className="sticky top-0 z-20 border-b border-[#dedfd6]/80 bg-[#f6f3ec]/90 backdrop-blur-md"><div className="container flex h-[72px] items-center justify-between gap-4"><div className="flex items-center gap-3"><button className="rounded-lg p-2 hover:bg-[#e8e6de] lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="hidden items-center gap-2 text-sm text-[#718078] sm:flex"><span className="h-2 w-2 rounded-full bg-[#c6f36b]" /><span>{profile.institution}</span><span className="text-[#b0b8ad]">/</span><span className="text-[#17221e]">Student workspace</span></div><div className="sm:hidden"><p className="display-font font-semibold">SkillLink</p></div></div><div className="flex items-center gap-2 sm:gap-3"><button onClick={() => notify("No new notifications", "You are all caught up.")} className="relative rounded-full p-2 text-[#536159] hover:bg-[#e8e6de]" aria-label="Notifications"><Bell size={18} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#b95142]" /></button><div className="hidden h-7 w-px bg-[#d9ddd1] sm:block" /><Button variant="outline" onClick={() => { try { startLogin(); } catch { notify("Preview mode is active", "Manus login will be available when this project is connected."); } }} className="h-9 rounded-full border-[#cdd5c8] bg-transparent px-3 text-xs font-semibold text-[#3f5547] hover:bg-[#e8e6de]">Sign in <ArrowRight size={13} /></Button></div></div></header>
      <div className="container py-8 lg:py-11"><div className="fade-up flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="meta-label text-[#779643]">{meta.eyebrow}</p><h1 className="display-font mt-2 max-w-[700px] text-[34px] font-semibold leading-[1.03] tracking-[-.065em] text-[#17221e] sm:text-[46px]">{meta.title}</h1><p className="mt-3 max-w-[620px] text-[15px] leading-6 text-[#65746b]">{meta.description}</p></div><Button onClick={() => setRequestOpen(true)} className="h-11 shrink-0 rounded-full bg-[#17221e] px-5 text-sm font-semibold text-[#f6f3ec] shadow-[0_8px_20px_rgba(23,34,30,.13)] hover:bg-[#2c4034]"><Plus size={16} /> New request</Button></div>

        {currentSection === "overview" && <div className="mt-10 space-y-10"><section className="grid gap-4 sm:grid-cols-3"><Metric value="12" label="Exchanges completed" note="+3 since September" /><Metric value="4.8/5" label="Peer feedback" note="Across 11 completed swaps" tone="lime" /><Metric value="86%" label="Follow-through" note="Your strongest signal" tone="blue" /></section><section className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]"><div><SectionHeading eyebrow="Recommended next" title="A strong two-way fit" action={<button onClick={() => go("/matches")} className="hidden items-center gap-1 text-xs font-bold text-[#536f32] sm:flex">View all {computedMatches.length} matches <ArrowRight size={14} /></button>} />{topMatch ? (<div className="rounded-[22px] border border-[#ccd8c4] bg-[#e8f2d2] p-5 sm:p-6"><div className="flex flex-col justify-between gap-5 sm:flex-row"><div><div className="flex items-center gap-2"><Tag tone="lime">{topMatch.score}% indicative</Tag><span className="meta-label text-[#779643]">{topMatch.kind}</span></div><div className="mt-4 flex items-center gap-3"><Avatar className="h-12 w-12 border-2 border-white"><AvatarFallback style={{ background: topMatch.avatar }} className="font-bold text-[#17221e]">{topMatch.initials}</AvatarFallback></Avatar><div><h3 className="display-font text-xl font-semibold tracking-[-.04em]">{topMatch.name}</h3><p className="text-xs text-[#65746b]">{topMatch.role}</p></div></div></div><div className="rounded-2xl bg-[#f7faef]/80 p-4 sm:max-w-[235px]"><p className="meta-label text-[#779643]">The exchange</p><div className="mt-2 flex items-center gap-2 text-sm font-semibold"><span>{topMatch.need[0] || "Python"}</span><ArrowRight size={14} className="text-[#779643]" /><span>{topMatch.offer[0] || "UI/UX"}</span></div><p className="mt-2 text-xs leading-4 text-[#65746b]">{topMatch.mutualBenefit.synergyNote}</p></div></div><Separator className="my-5 bg-[#c9d9bc]" /><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><p className="max-w-[540px] text-sm leading-5 text-[#526056]"><Sparkles size={14} className="mr-1 inline text-[#779643]" /><strong className="text-[#34482b]">Why now?</strong> {topMatch.explanation}</p><div className="flex gap-2"><Button variant="outline" onClick={() => { setSelectedMatch(topMatch); setMatchOpen(true); }} className="h-9 rounded-full border-[#b9cba8] bg-transparent text-xs font-semibold hover:bg-[#f7faef]">Reasoning</Button><Button onClick={() => propose(topMatch)} disabled={proposalSent === topMatch.id} className="h-9 rounded-full bg-[#17221e] text-xs text-[#f6f3ec] hover:bg-[#2c4034]">{proposalSent === topMatch.id ? "Proposal sent" : "Propose exchange"}</Button></div></div></div>) : (<div className="rounded-[22px] border border-[#d9ddd1] bg-[#fffdf8] p-6 text-center text-xs text-[#718078]">Update your skill inventory or learning goals to generate recommendations.</div>)}</div><div><SectionHeading eyebrow="Your board" title="Open requests" action={<button onClick={() => go("/requests")} className="hidden items-center gap-1 text-xs font-bold text-[#536f32] sm:flex">Manage <ArrowRight size={14} /></button>} /><div className="space-y-3"><div className="lift rounded-2xl border border-[#d9ddd1] bg-[#fffdf8] p-4"><div className="flex items-start justify-between gap-4"><div className="flex gap-3"><div className="rounded-xl bg-[#dbeaf5] p-2.5 text-[#365970]"><Target size={17} /></div><div><h3 className="font-semibold">UI for hackathon website</h3><p className="mt-1 text-xs text-[#718078]">Need UI/UX · 2 responses</p></div></div><MoreHorizontal size={17} className="text-[#9aa69c]" /></div><div className="mt-4 flex items-center justify-between"><span className="text-xs font-semibold text-[#536159]">Open for matching</span><span className="text-xs text-[#718078]">Updated 2h ago</span></div></div><div className="lift rounded-2xl border border-[#d9ddd1] bg-[#fffdf8] p-4"><div className="flex items-start gap-3"><div className="rounded-xl bg-[#ece6d1] p-2.5 text-[#776643]"><GraduationCap size={17} /></div><div><h3 className="font-semibold">Practice product storytelling</h3><p className="mt-1 text-xs text-[#718078]">Want to learn · 1 response</p></div></div><div className="mt-4 flex items-center justify-between"><span className="text-xs font-semibold text-[#536159]">Open for matching</span><span className="text-xs text-[#718078]">Updated yesterday</span></div></div></div></div></section><section><SectionHeading eyebrow="Keep the loop going" title="Recent exchanges" action={<button onClick={() => go("/history")} className="flex items-center gap-1 text-xs font-bold text-[#536f32]">Full history <ArrowRight size={14} /></button>} /><div className="overflow-hidden rounded-2xl border border-[#d9ddd1] bg-[#fffdf8]"><div className="hidden grid-cols-[1.4fr_1fr_1fr_100px] gap-4 border-b border-[#e3e5dd] px-5 py-3 sm:grid"><span className="meta-label text-[#9aa69c]">Collaborator</span><span className="meta-label text-[#9aa69c]">Exchange</span><span className="meta-label text-[#9aa69c]">Date</span><span className="meta-label text-right text-[#9aa69c]">Status</span></div>{history.map(exchange => <div key={exchange.with} className="grid gap-3 border-b border-[#e9eae4] px-5 py-4 last:border-0 sm:grid-cols-[1.4fr_1fr_1fr_100px] sm:items-center sm:gap-4"><div className="flex items-center gap-3"><Avatar className="h-8 w-8"><AvatarFallback style={{ background: exchange.color }} className="text-[10px] font-bold text-[#17221e]">{exchange.initials}</AvatarFallback></Avatar><span className="text-sm font-semibold">{exchange.with}</span></div><span className="text-sm text-[#65746b]">{exchange.skill}</span><span className="text-sm text-[#65746b]">{exchange.date}</span><span className="flex items-center gap-1.5 text-xs font-semibold text-[#618033] sm:justify-end"><CheckCircle2 size={14} /> Completed</span></div>)}</div></section></div>}

        {currentSection === "matches" && (
          <div className="mt-10">
            {/* Additional Feature 4: Filter & Search Bar */}
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                {(["All matches", "Reciprocal", "Direct"] as const).map(value => (
                  <button
                    key={value}
                    onClick={() => setFilters(prev => ({ ...prev, kind: value }))}
                    className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                      filters.kind === value
                        ? "border-[#17221e] bg-[#17221e] text-[#f6f3ec]"
                        : "border-[#d1d8cc] bg-transparent text-[#65746b] hover:bg-[#e8e6de]"
                    }`}
                  >
                    {value === "Reciprocal" ? "Reciprocal (Two-Way)" : value === "Direct" ? "Direct (One-Way)" : "All matches"}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-[220px]">
                  <Search size={13} className="absolute left-3 top-3 text-[#718078]" />
                  <Input
                    value={filters.searchQuery}
                    onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    placeholder="Search peers or skills..."
                    className="h-9 pl-8 text-xs border-[#d1d8cc] bg-[#fffdf8]"
                  />
                  {filters.searchQuery && (
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, searchQuery: "" }))}
                      className="absolute right-2.5 top-2.5 text-[#718078] hover:text-[#17221e]"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setFiltersOpen(true)}
                  className="h-9 rounded-full border-[#cbd4c6] text-xs font-semibold hover:bg-[#eef4ea] flex items-center gap-1.5"
                >
                  <SlidersHorizontal size={13} />
                  <span>Refine matching</span>
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-[#17221e] px-1.5 py-0.2 text-[10px] font-bold text-[#c6f36b]">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#536159]">
                <span className="font-semibold text-[#17221e]">Active filters:</span>
                {filters.department !== "All" && (
                  <span className="flex items-center gap-1 rounded-full bg-[#f1f4ea] px-2.5 py-1 text-[11px] font-medium text-[#496724]">
                    Dept: {filters.department}
                    <button onClick={() => setFilters(prev => ({ ...prev, department: "All" }))}><X size={11} /></button>
                  </span>
                )}
                {filters.proficiencyTier !== "All" && (
                  <span className="flex items-center gap-1 rounded-full bg-[#f1f4ea] px-2.5 py-1 text-[11px] font-medium text-[#496724]">
                    Tier: {filters.proficiencyTier}
                    <button onClick={() => setFilters(prev => ({ ...prev, proficiencyTier: "All" }))}><X size={11} /></button>
                  </span>
                )}
                {filters.modality !== "All" && (
                  <span className="flex items-center gap-1 rounded-full bg-[#f1f4ea] px-2.5 py-1 text-[11px] font-medium text-[#496724]">
                    Modality: {filters.modality}
                    <button onClick={() => setFilters(prev => ({ ...prev, modality: "All" }))}><X size={11} /></button>
                  </span>
                )}
                {filters.availability !== "All" && (
                  <span className="flex items-center gap-1 rounded-full bg-[#f1f4ea] px-2.5 py-1 text-[11px] font-medium text-[#496724]">
                    Schedule: {filters.availability}
                    <button onClick={() => setFilters(prev => ({ ...prev, availability: "All" }))}><X size={11} /></button>
                  </span>
                )}
                <button
                  onClick={() => setFilters({
                    kind: "All matches",
                    department: "All",
                    proficiencyTier: "All",
                    modality: "All",
                    availability: "All",
                    searchQuery: "",
                    sortBy: "score",
                  })}
                  className="text-[11px] text-[#b95142] hover:underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results Grid */}
            {computedMatches.length > 0 ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {computedMatches.map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    proposalSent={proposalSent === match.id}
                    onOpen={() => {
                      setSelectedMatch(match);
                      setMatchOpen(true);
                    }}
                    onConnect={() => propose(match)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#b9c5b8] bg-[#f8f7f1] p-10 text-center">
                <Compass size={32} className="mx-auto text-[#718078]" />
                <h3 className="display-font mt-3 text-lg font-semibold text-[#17221e]">No matching campus peers found</h3>
                <p className="mt-1 text-xs text-[#718078] max-w-[360px] mx-auto leading-5">
                  We couldn't find anyone matching your current filter criteria. Try resetting filters or adding more skills you want to learn.
                </p>
                <Button
                  onClick={() => setFilters({
                    kind: "All matches",
                    department: "All",
                    proficiencyTier: "All",
                    modality: "All",
                    availability: "All",
                    searchQuery: "",
                    sortBy: "score",
                  })}
                  className="mt-4 h-9 rounded-full bg-[#17221e] px-4 text-xs text-[#f6f3ec]"
                >
                  Reset all filters
                </Button>
              </div>
            )}
          </div>
        )}

        {currentSection === "requests" && <div className="mt-10"><div className="mb-6 flex items-center justify-between"><p className="text-sm text-[#65746b]">Requests are the starting point for your next exchange.</p><Button onClick={() => setRequestOpen(true)} className="h-10 rounded-full bg-[#17221e] text-xs text-[#f6f3ec] hover:bg-[#2c4034]"><FilePlus2 size={15} /> New request</Button></div><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-[#ccd8c4] bg-[#e8f2d2] p-5"><div className="flex items-center justify-between"><Tag tone="lime">Open · 2 responses</Tag><MoreHorizontal size={17} className="text-[#65746b]" /></div><h3 className="display-font mt-5 text-xl font-semibold tracking-[-.04em]">UI for hackathon website</h3><p className="mt-2 text-sm leading-5 text-[#526056]">I have the product flow and frontend logic, but I need help turning it into a clear visual system with Figma-ready screens.</p><div className="mt-5 flex flex-wrap gap-2"><Tag tone="blue">UI/UX</Tag><Tag tone="blue">Figma</Tag><Tag tone="blue">Web design</Tag></div><Separator className="my-5 bg-[#c9d9bc]" /><div className="flex items-center justify-between text-xs text-[#65746b]"><span className="flex items-center gap-1.5"><Sparkles size={13} /> AI understood 4 related skills</span><span>Updated 2h ago</span></div></div>{createdRequest && <div className="rounded-2xl border border-[#ccd8c4] bg-[#eef4e7] p-5"><div className="flex items-center justify-between"><Tag tone="lime">New · matching now</Tag><Sparkles size={16} className="text-[#779643]" /></div><h3 className="display-font mt-5 text-xl font-semibold tracking-[-.04em]">{createdRequest.title}</h3><p className="mt-2 text-sm leading-5 text-[#526056]">{createdRequest.description}</p><div className="mt-5 flex items-center gap-2 text-xs text-[#65746b]"><Sparkles size={13} /> AI understood related skills · Refreshing matches</div></div>}<button onClick={() => setRequestOpen(true)} className="lift flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#b9c5b8] bg-[#f8f7f1] p-6 text-center hover:border-[#7ca93a] hover:bg-[#f4f8eb]"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e1efc4] text-[#58792a]"><Plus size={20} /></span><span className="mt-4 display-font font-semibold">Add another request</span><span className="mt-1 max-w-[220px] text-xs leading-5 text-[#718078]">Projects, learning goals, hackathon gaps — start with the context.</span></button></div></div>}

        {currentSection === "exchanges" && <div className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_.9fr]"><section className="rounded-[22px] border border-[#d9ddd1] bg-[#fffdf8] p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><Tag tone="lime">{exchangeComplete ? "Completed" : "In progress"}</Tag><h2 className="display-font mt-4 text-2xl font-semibold tracking-[-.05em]">Python ↔ UI/UX</h2><p className="mt-1 text-sm text-[#718078]">with Rahul Mehta · Started Sep 29</p></div><div className="rounded-2xl bg-[#e8f2d2] px-3 py-2 text-right"><p className="meta-label text-[#779643]">Next session</p><p className="mt-1 text-sm font-bold">Thu, 5:30 PM</p></div></div><div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-[#eef4e7] p-4"><p className="meta-label text-[#779643]">You are giving</p><p className="mt-2 font-semibold">Python · Flask setup</p><p className="mt-1 text-xs leading-5 text-[#65746b]">A 45-minute walkthrough of your API structure and local setup.</p></div><div className="rounded-2xl bg-[#e6f0f7] p-4"><p className="meta-label text-[#557991]">You are learning</p><p className="mt-2 font-semibold">UI/UX · Figma foundations</p><p className="mt-1 text-xs leading-5 text-[#65746b]">Turn the hackathon flow into a simple, testable screen system.</p></div></div><div className="mt-7"><p className="meta-label text-[#9aa69c]">Exchange progress</p><div className="mt-3 flex items-center gap-2"><div className="h-2 flex-1 rounded-full bg-[#e3e6dc]"><div className={`h-2 rounded-full bg-[#7ca93a] ${exchangeComplete ? "w-full" : "w-2/3"}`} /></div><span className="text-xs font-bold text-[#58792a]">{exchangeComplete ? "3 / 3" : "2 / 3"}</span></div><div className="mt-4 space-y-3 text-sm"><div className="flex items-center gap-3 text-[#536159]"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c6f36b] text-[#17221e]"><Check size={13} strokeWidth={3} /></span> Agreed what we will exchange</div><div className="flex items-center gap-3 text-[#536159]"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c6f36b] text-[#17221e]"><Check size={13} strokeWidth={3} /></span> Scheduled the working session</div><div className={`flex items-center gap-3 ${exchangeComplete ? "text-[#536159]" : "text-[#9aa69c]"}`}><span className={`flex h-6 w-6 items-center justify-center rounded-full ${exchangeComplete ? "bg-[#c6f36b] text-[#17221e]" : "border border-[#cbd4c6] text-[#9aa69c]"}`}>{exchangeComplete ? <Check size={13} strokeWidth={3} /> : "3"}</span> Mark the exchange complete</div></div></div><div className="mt-7 flex flex-col gap-3 border-t border-[#e3e5dd] pt-5 sm:flex-row"><Button variant="outline" onClick={() => { void navigator.clipboard?.writeText("https://meet.google.com/skilllink-demo"); notify("Meeting link copied", "https://meet.google.com/skilllink-demo"); }} className="h-10 rounded-full border-[#cbd4c6] text-xs font-semibold"><ExternalLink size={14} /> Open meeting link</Button><Button onClick={completeExchange} disabled={exchangeComplete} className="h-10 rounded-full bg-[#17221e] text-xs text-[#f6f3ec] hover:bg-[#2c4034]">{exchangeComplete ? <><Check size={14} /> Completed</> : <>Mark exchange complete <ArrowRight size={14} /></>}</Button></div></section><aside className="rounded-[22px] bg-[#17221e] p-6 text-[#edf1e9]"><div className="flex items-center gap-2 text-[#c6f36b]"><CircleHelp size={16} /><span className="meta-label">Keep it fair</span></div><h3 className="display-font mt-4 text-2xl font-semibold leading-tight tracking-[-.05em]">The best exchanges leave both people with a next step.</h3><p className="mt-4 text-sm leading-6 text-[#b7c6b9]">Close the loop even if the session was small. Your feedback helps the next person understand how you collaborate — not who you are as a person.</p><div className="mt-8 rounded-2xl border border-[#3b5142] bg-[#203027] p-4"><div className="flex items-center gap-3"><Avatar className="h-9 w-9 border border-[#5b7763]"><AvatarFallback className="bg-[#e7c6af] text-xs font-bold text-[#17221e]">RM</AvatarFallback></Avatar><div><p className="text-sm font-semibold">{feedbackSent ? "Feedback is part of your record" : "Rahul is waiting on your feedback"}</p><p className="mt-0.5 text-xs text-[#9eb19e]">{feedbackSent ? "Thanks for closing the loop" : "Takes about 60 seconds"}</p></div></div></div></aside></div>}

        {currentSection === "history" && <div className="mt-10"><div className="grid gap-4 sm:grid-cols-3"><Metric value="12" label="Completed" note="Across 9 skills" /><Metric value="11" label="Successful" note="92% completion rate" tone="lime" /><Metric value="1" label="Incomplete" note="No permanent label" tone="blue" /></div><div className="mt-8 overflow-hidden rounded-2xl border border-[#d9ddd1] bg-[#fffdf8]"><div className="border-b border-[#e3e5dd] p-5"><div className="flex items-center gap-2"><Award size={17} className="text-[#779643]" /><h2 className="display-font font-semibold">Contribution history</h2></div><p className="mt-1 text-sm text-[#718078]">A practical record of what you have contributed and learned on SkillLink.</p></div>{[...history, { with: "Priya Nair", initials: "PN", skill: "Research synthesis", date: "Aug 22", color: "#d8c8e3" }].map(exchange => <div key={exchange.with} className="flex flex-col justify-between gap-3 border-b border-[#e9eae4] px-5 py-4 last:border-0 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><Avatar className="h-9 w-9"><AvatarFallback style={{ background: exchange.color }} className="text-[10px] font-bold text-[#17221e]">{exchange.initials}</AvatarFallback></Avatar><div><p className="text-sm font-semibold">{exchange.skill}</p><p className="mt-0.5 text-xs text-[#718078]">with {exchange.with} · {exchange.date}</p></div></div><div className="flex items-center gap-4"><span className="text-xs text-[#65746b]">Skills exchanged</span><span className="flex items-center gap-1.5 text-xs font-semibold text-[#618033]"><CheckCircle2 size={14} /> Completed</span></div></div>)}</div></div>}

        {currentSection === "profile" && <div className="mt-10 grid gap-6 xl:grid-cols-[.85fr_1.15fr]"><section className="rounded-[22px] border border-[#d9ddd1] bg-[#fffdf8] p-6"><div className="flex items-center gap-4"><Avatar className="h-16 w-16 border-4 border-[#e8f2d2]"><AvatarFallback className="bg-[#e7c6af] text-xl font-bold text-[#17221e]">{profile.initials}</AvatarFallback></Avatar><div><h2 className="display-font text-2xl font-semibold tracking-[-.05em]">{profile.name}</h2><p className="mt-1 text-sm text-[#718078]">{profile.department} · {profile.institution}</p><p className="text-xs text-[#9aa69c]">Class of {profile.graduationYear}</p></div></div><p className="mt-5 text-sm leading-6 text-[#536159]">{profile.bio}</p>

        {/* Academic & Contact Metadata Strip */}
        <div className="mt-6 rounded-2xl border border-[#d9ddd1] bg-[#f8f7f1] p-4 text-xs space-y-2">
          <div className="flex items-center justify-between"><span className="font-semibold text-[#17221e] flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#779643]" /> Discovery Visibility</span><span className="rounded-full bg-[#e1efc4] px-2 py-0.5 text-[10px] font-bold text-[#496724]">{profile.visibility === "campus_only" ? "Verified campus peers" : profile.visibility === "department_only" ? "Department only" : "All colleges"}</span></div>
          <div className="flex items-center justify-between"><span className="text-[#718078]">Campus Email</span><span className="font-medium text-[#17221e]">{profile.contactEmail}</span></div>
          <div className="flex items-center justify-between"><span className="text-[#718078]">Discord / Telegram</span><span className="font-medium text-[#17221e]">{profile.discord} · {profile.telegram}</span></div>
          {profile.linkedin && <div className="flex items-center justify-between"><span className="text-[#718078]">LinkedIn</span><span className="font-medium text-[#17221e]">{profile.linkedin}</span></div>}
        </div>

        {/* Interactive Skill Portfolio */}
        <div className="mt-6"><div className="flex items-center justify-between"><p className="meta-label text-[#779643]">I can contribute ({skillsOffered.length})</p><button onClick={() => { setActiveProfileTab("skills"); setProfileOpen(true); }} className="text-xs font-semibold text-[#536f32] hover:underline flex items-center gap-1"><Plus size={13} /> Manage skills</button></div><div className="mt-3 space-y-2">{skillsOffered.map(skill => <div key={skill.id} className="flex items-center justify-between rounded-xl bg-[#f1f4ea] p-2.5 text-xs"><div className="flex items-center gap-2"><span className="font-semibold text-[#17221e]">{skill.name}</span><span className="rounded-full bg-[#c6f36b] px-2 py-0.5 text-[10px] font-bold text-[#17221e]">{skill.proficiency}</span><span className="text-[11px] text-[#718078]">({skill.category})</span></div>{skill.projectUrl ? <a href={skill.projectUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11px] font-medium text-[#536f32] hover:underline"><ExternalLink size={12} /> Project</a> : <span className="text-[11px] text-[#9aa69c]">No link</span>}</div>)}</div></div>

        {/* Learning Goals & Target Interests */}
        <div className="mt-6"><div className="flex items-center justify-between"><p className="meta-label text-[#557991]">I want to learn ({learningGoalsList.length})</p><button onClick={() => { setActiveProfileTab("goals"); setProfileOpen(true); }} className="text-xs font-semibold text-[#365970] hover:underline flex items-center gap-1"><Plus size={13} /> Manage wishlist</button></div><div className="mt-3 space-y-2">{learningGoalsList.map(goal => <div key={goal.id} className="flex items-center justify-between rounded-xl bg-[#eef4f9] p-2.5 text-xs"><div className="flex items-center gap-2"><span className="font-semibold text-[#17221e]">{goal.name}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${goal.priority === "Urgent" ? "bg-[#fcdcd7] text-[#a53b2d]" : goal.priority === "High" ? "bg-[#fed8b1] text-[#964e16]" : "bg-[#dbeaf5] text-[#365970]"}`}>{goal.priority}</span></div><span className="truncate max-w-[170px] text-[11px] text-[#718078]">{goal.note}</span></div>)}</div></div>

        <Button variant="outline" onClick={() => { setEditProfile(profile); setActiveProfileTab("details"); setProfileOpen(true); }} className="mt-7 h-10 w-full rounded-full border-[#cbd4c6] text-xs font-semibold hover:bg-[#eef4ea]"><Settings2 size={14} /> Edit profile & skill inventory</Button></section><section className="space-y-4"><div className="rounded-[22px] bg-[#17221e] p-6 text-[#edf1e9]"><div className="flex items-start justify-between"><div><p className="meta-label text-[#9eb19e]">SkillLink Contribution Record</p><h2 className="display-font mt-3 text-3xl font-semibold tracking-[-.06em]">Built by showing up.</h2></div><Award size={24} className="text-[#c6f36b]" /></div><p className="mt-3 max-w-[540px] text-sm leading-6 text-[#b7c6b9]">A platform-specific record of your collaboration behaviour — not a claim about your character or a perfect measure of skill.</p><div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[#26382c] p-4"><p className="display-font text-2xl font-semibold text-[#c6f36b]">12</p><p className="mt-1 text-xs text-[#b7c6b9]">exchanges completed</p></div><div className="rounded-2xl bg-[#26382c] p-4"><p className="display-font text-2xl font-semibold text-[#c6f36b]">{skillsOffered.length + 3}</p><p className="mt-1 text-xs text-[#b7c6b9]">skills contributed</p></div><div className="rounded-2xl bg-[#26382c] p-4"><p className="display-font text-2xl font-semibold text-[#c6f36b]">4.8</p><p className="mt-1 text-xs text-[#b7c6b9]">peer feedback</p></div></div></div><div className="rounded-[22px] border border-[#d9ddd1] bg-[#fffdf8] p-6"><div className="flex items-center justify-between"><div><p className="meta-label text-[#9aa69c]">Signals from peers</p><h3 className="display-font mt-1 text-xl font-semibold">How you collaborate</h3></div><Star size={19} className="fill-[#c6f36b] text-[#91af4a]" /></div>{[["Reliability", 96], ["Helpful context", 91], ["Communication", 88]].map(([label, value]) => <div key={label} className="mt-5"><div className="mb-2 flex justify-between text-xs font-semibold"><span>{label}</span><span className="text-[#658638]">{value}%</span></div><Progress value={value as number} className="h-2 bg-[#e8e9e2] [&>div]:bg-[#8daf50]" /></div>)}<div className="mt-6 flex items-start gap-2 rounded-xl bg-[#f1f4ea] p-3 text-xs leading-5 text-[#536159]"><MessageCircle size={14} className="mt-0.5 shrink-0 text-[#779643]" /> “Ananya made the hard parts feel easy to ask about.” — Maya, presentation design exchange</div></div></section></div>}
      </div>
    </main>

    {/* Additional Feature 4 & 5: AI Match Rationale, Mutual Benefit Breakdown & Icebreakers */}
    <Dialog open={matchOpen} onOpenChange={setMatchOpen}>
      <DialogContent className="max-w-[620px] max-h-[85vh] overflow-y-auto rounded-[24px] border-[#d9ddd1] bg-[#fffdf8] p-0">
        {activeMatch && (
          <>
            <div className="bg-[#e8f2d2] p-6">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#c6f36b] px-2.5 py-0.5 text-[10px] font-bold text-[#17221e]">Feature 4 & 5</span>
                  <Tag tone="lime">{activeMatch.score}% compatibility</Tag>
                  <span className="meta-label text-[#779643]">{activeMatch.kind} synergy</span>
                </div>
                <DialogTitle className="display-font mt-3 text-3xl tracking-[-.06em]">
                  Why {activeMatch.name}?
                </DialogTitle>
                <DialogDescription className="mt-1 text-xs leading-5 text-[#526056]">
                  SkillLink explains the algorithmic rationale and mutual value — AI surfaces the synergy, you decide to connect.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="space-y-5 p-6">
              {/* Candidate Info Strip */}
              <div className="flex items-start justify-between gap-4 rounded-2xl border border-[#dce0d5] bg-[#fdfcf9] p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarFallback style={{ background: activeMatch.avatar }} className="font-bold text-[#17221e]">
                      {activeMatch.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-[#17221e]">{activeMatch.name}</p>
                    <p className="text-xs text-[#718078]">{activeMatch.role} · {activeMatch.department}</p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-[#55695a]">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin size={11} className="text-[#779643]" /> {activeMatch.modality} {activeMatch.campusLocation ? `(${activeMatch.campusLocation})` : ""}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-[#718078]" /> {activeMatch.availability}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-xs font-bold text-[#17221e]">
                    <CheckCircle2 size={13} className="text-[#759b3e]" /> {activeMatch.rating.toFixed(1)} / 5.0
                  </div>
                  <p className="text-[10px] text-[#718078] mt-0.5">{activeMatch.completedExchanges} exchanges</p>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-xs italic text-[#617066] bg-[#f8f7f1] p-3 rounded-xl border border-[#e8ebe3]">
                "{activeMatch.candidate.bio}"
              </p>

              {/* Side by Side Skills */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-[#eef4e7] p-4 border border-[#d6e3cb]">
                  <p className="meta-label text-[#779643]">They offer you</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {activeMatch.offer.map(skill => (
                      <Tag key={skill} tone="green">{skill}</Tag>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-[#e6f0f7] p-4 border border-[#c9dded]">
                  <p className="meta-label text-[#557991]">You offer them</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {activeMatch.need.map(skill => (
                      <Tag key={skill} tone="blue">{skill}</Tag>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Match Explanation */}
              <div className="rounded-xl border border-[#d8dec9] bg-[#f4f7ee] p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#3d552d]">
                  <Sparkles size={14} className="text-[#779643]" /> Algorithmic Match Explanation
                </div>
                <p className="mt-2 text-xs leading-5 text-[#536159]">{activeMatch.explanation}</p>
              </div>

              {/* Feature 5: Mutual Benefit Breakdown */}
              <div className="rounded-xl border border-[#d9ddd1] bg-[#fffdf8] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#17221e] flex items-center gap-1.5">
                    <Target size={14} className="text-[#536f32]" /> Mutual Benefit Breakdown
                  </p>
                  <span className="rounded-full bg-[#c6f36b] px-2.5 py-0.5 text-[10px] font-bold text-[#17221e]">
                    {activeMatch.mutualBenefit.estimatedTimeSaved}
                  </span>
                </div>
                <p className="text-xs text-[#526056] leading-5">{activeMatch.mutualBenefit.synergyNote}</p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="rounded-lg bg-[#f8f7f1] p-2 text-[#536159]">
                    <span className="font-semibold text-[#17221e]">Your Contribution:</span> {activeMatch.mutualBenefit.giveSummary}
                  </div>
                  <div className="rounded-lg bg-[#f8f7f1] p-2 text-[#536159]">
                    <span className="font-semibold text-[#17221e]">Their Contribution:</span> {activeMatch.mutualBenefit.getSummary}
                  </div>
                </div>
              </div>

              {/* Feature 5: Collaborative Icebreakers */}
              <div>
                <p className="text-xs font-bold text-[#17221e] mb-2 flex items-center gap-1.5">
                  <MessageCircle size={14} className="text-[#779643]" /> Suggested Conversation Starters & Icebreakers
                </p>
                <div className="space-y-2">
                  {activeMatch.icebreakers.map((icebreaker, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 rounded-xl border border-[#e2e6dc] bg-[#fbfaf6] p-3 text-xs">
                      <p className="text-[#526056] italic">{icebreaker}</p>
                      <button
                        onClick={() => {
                          void navigator.clipboard?.writeText(icebreaker.replace(/^"|"$/g, ""));
                          notify("Icebreaker copied", "You can paste this starter message in your exchange proposal.");
                        }}
                        className="shrink-0 flex items-center gap-1 rounded-md bg-[#eef3e6] px-2 py-1 text-[10px] font-bold text-[#496724] hover:bg-[#e1eccf]"
                        title="Copy to clipboard"
                      >
                        <Copy size={11} /> Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-[#e3e5dd] p-5 flex items-center justify-between">
              <Button variant="outline" onClick={() => setMatchOpen(false)} className="rounded-full border-[#cbd4c6] text-xs">
                Not now
              </Button>
              <Button
                onClick={() => {
                  setMatchOpen(false);
                  propose(activeMatch);
                }}
                disabled={proposalSent === activeMatch.id}
                className="rounded-full bg-[#17221e] text-xs text-[#f6f3ec] hover:bg-[#2c4034]"
              >
                {proposalSent === activeMatch.id ? (
                  <><Check size={14} /> Proposal sent</>
                ) : (
                  <>Propose exchange <ArrowRight size={14} /></>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>

    {/* Additional Feature 4: Discovery Filters Modal */}
    <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
      <DialogContent className="max-w-[560px] max-h-[85vh] overflow-y-auto rounded-[24px] border-[#d9ddd1] bg-[#fffdf8] p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#c6f36b] px-2.5 py-0.5 text-[10px] font-bold text-[#17221e]">Feature 4</span>
            <p className="meta-label text-[#779643]">Discovery & Matchmaking Engine</p>
          </div>
          <DialogTitle className="display-font text-3xl tracking-[-.06em]">Refine Campus Matching</DialogTitle>
          <DialogDescription className="text-sm leading-6">
            Filter candidate peers by campus department, exchange modality, mentor proficiency tier, and schedule.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          {/* Search Query */}
          <div>
            <label className="mb-1 block font-bold text-[#536159]">Search by keyword or skill</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-[#718078]" />
              <Input
                value={filters.searchQuery}
                onChange={e => setFilters({ ...filters, searchQuery: e.target.value })}
                placeholder="e.g. Python, Figma, Docker, Computer Science..."
                className="h-10 pl-9 border-[#d1d8cc] bg-[#f8f7f1]"
              />
            </div>
          </div>

          {/* Match Mode */}
          <div>
            <label className="mb-1.5 block font-bold text-[#536159]">Match Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(["All matches", "Reciprocal", "Direct"] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFilters({ ...filters, kind: mode })}
                  className={`rounded-xl border p-2 text-xs font-semibold ${
                    filters.kind === mode
                      ? "border-[#17221e] bg-[#17221e] text-[#f6f3ec]"
                      : "border-[#cbd4c6] bg-[#f8f7f1] text-[#536159]"
                  }`}
                >
                  {mode === "Reciprocal" ? "Reciprocal (Two-Way)" : mode === "Direct" ? "Direct (One-Way)" : "All Matches"}
                </button>
              ))}
            </div>
          </div>

          {/* Academic Department */}
          <div>
            <label className="mb-1.5 block font-bold text-[#536159]">Academic Department / School</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { value: "All", label: "All Departments" },
                { value: "Computer Science", label: "Computer Science" },
                { value: "Design & Visual Communication", label: "Design & Media" },
                { value: "Information Systems", label: "Information Systems" },
                { value: "Data Science & AI", label: "Data Science & AI" },
                { value: "Computer Engineering", label: "Computer Engineering" },
              ].map(dept => (
                <button
                  key={dept.value}
                  type="button"
                  onClick={() => setFilters({ ...filters, department: dept.value })}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    filters.department === dept.value
                      ? "bg-[#779643] text-white"
                      : "bg-[#f1f4ea] text-[#536159] hover:bg-[#e4edd7]"
                  }`}
                >
                  {dept.label}
                </button>
              ))}
            </div>
          </div>

          {/* Proficiency Tier */}
          <div>
            <label className="mb-1.5 block font-bold text-[#536159]">Proficiency Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {(["All", "Beginner-friendly", "Advanced / Expert"] as const).map(tier => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setFilters({ ...filters, proficiencyTier: tier })}
                  className={`rounded-xl border p-2 text-xs font-semibold ${
                    filters.proficiencyTier === tier
                      ? "border-[#779643] bg-[#e1efc4] text-[#496724]"
                      : "border-[#cbd4c6] bg-[#f8f7f1] text-[#536159]"
                  }`}
                >
                  {tier === "All" ? "Any Proficiency" : tier}
                </button>
              ))}
            </div>
          </div>

          {/* Modality */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-bold text-[#536159]">Exchange Modality</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(["All", "In-person", "Remote", "Hybrid"] as const).map(mod => (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => setFilters({ ...filters, modality: mod })}
                    className={`rounded-xl border p-2 text-xs font-semibold ${
                      filters.modality === mod
                        ? "border-[#536f32] bg-[#c6f36b] text-[#17221e]"
                        : "border-[#cbd4c6] bg-[#f8f7f1] text-[#536159]"
                    }`}
                  >
                    {mod}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-bold text-[#536159]">Availability Window</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(["All", "Weekdays", "Weekends", "Flexible", "Evenings"] as const).map(avail => (
                  <button
                    key={avail}
                    type="button"
                    onClick={() => setFilters({ ...filters, availability: avail })}
                    className={`rounded-xl border p-2 text-xs font-semibold ${
                      filters.availability === avail
                        ? "border-[#365970] bg-[#bfd7ee] text-[#1a384f]"
                        : "border-[#cbd4c6] bg-[#f8f7f1] text-[#536159]"
                    }`}
                  >
                    {avail}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="mb-1.5 block font-bold text-[#536159]">Sort Ranking Order</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "score", label: "Compatibility Score" },
                { value: "rating", label: "Highest Peer Rating" },
                { value: "exchanges", label: "Most Exchanges" },
              ].map(sort => (
                <button
                  key={sort.value}
                  type="button"
                  onClick={() => setFilters({ ...filters, sortBy: sort.value as any })}
                  className={`rounded-xl border p-2 text-xs font-semibold ${
                    filters.sortBy === sort.value
                      ? "border-[#17221e] bg-[#17221e] text-[#f6f3ec]"
                      : "border-[#cbd4c6] bg-[#f8f7f1] text-[#536159]"
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-[#e3e5dd] pt-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setFilters({
                kind: "All matches",
                department: "All",
                proficiencyTier: "All",
                modality: "All",
                availability: "All",
                searchQuery: "",
                sortBy: "score",
              });
              notify("Filters reset", "Showing all campus matches.");
            }}
            className="rounded-full border-[#cbd4c6] text-xs"
          >
            Reset all
          </Button>
          <Button
            onClick={() => {
              setFiltersOpen(false);
              notify("Matching criteria updated", `Showing ${computedMatches.length} matching peers.`);
            }}
            className="rounded-full bg-[#17221e] text-xs text-[#f6f3ec] hover:bg-[#2c4034]"
          >
            Apply filters ({computedMatches.length} results) <Check size={14} className="ml-1" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={requestOpen} onOpenChange={(val) => { setRequestOpen(val); if(!val) { setAnalysisComplete(false); setExtractedSkills([]); } }}><DialogContent className="max-w-[560px] rounded-[24px] border-[#d9ddd1] bg-[#fffdf8]">
      <DialogHeader>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#c6f36b] px-2.5 py-0.5 text-[10px] font-bold text-[#17221e]">Feature 3</span>
          <p className="meta-label text-[#779643]">AI-Powered Extraction</p>
        </div>
        <DialogTitle className="display-font text-3xl tracking-[-.06em]">{analysisComplete ? "Review Extracted Skills" : "Start with the context."}</DialogTitle>
        <DialogDescription className="text-sm leading-6">{analysisComplete ? "Our AI engine parsed your request into standard taxonomy skills. Adjust them if needed." : "Write it like you would to a helpful classmate. SkillLink will surface related skills and people."}</DialogDescription>
      </DialogHeader>

      {!analysisComplete ? (
        <div className="space-y-4 py-3">
          <div><label className="mb-2 block text-xs font-bold text-[#536159]">What are you working on?</label><Input value={requestTitle} onChange={event => setRequestTitle(event.target.value)} placeholder="e.g. UI for my hackathon website" className="h-11 border-[#d1d8cc] bg-[#f8f7f1]" /></div>
          <div><label className="mb-2 block text-xs font-bold text-[#536159]">Describe what you need and what you can offer</label><Textarea value={requestText} onChange={event => setRequestText(event.target.value)} placeholder="I have the product flow and frontend logic, but I need help..." className="min-h-[126px] resize-none border-[#d1d8cc] bg-[#f8f7f1]" /></div>
          <div className="rounded-xl bg-[#f1f4ea] p-3 text-xs leading-5 text-[#536159]">
            <Sparkles size={14} className="mr-1 inline text-[#779643]" /> The Requirement Refinement Assistant will intelligently map your text to standard taxonomy skills.
          </div>
        </div>
      ) : (
        <div className="space-y-4 py-3">
          <div className="rounded-2xl border border-[#ccd8c4] bg-[#e8f2d2] p-4 mb-4">
            <h3 className="font-semibold text-[#17221e]">{requestTitle}</h3>
            <p className="mt-1 text-xs text-[#526056] line-clamp-2">{requestText}</p>
          </div>
          
          <div>
            <p className="text-xs font-bold text-[#365970] mb-2 flex items-center gap-1.5"><Target size={14} /> Identified Needs</p>
            <div className="flex flex-wrap gap-2">
              {extractedSkills.filter(s => s.type === "need").length > 0 ? extractedSkills.filter(s => s.type === "need").map(skill => (
                <div key={skill.id} className="flex items-center gap-1 rounded-full bg-[#dbeaf5] pl-2.5 pr-1 py-1 border border-[#b8d4e8]">
                  <span className="text-xs font-semibold text-[#1a384f]">{skill.name}</span>
                  <span className="text-[9px] text-[#4d738f] ml-1">{skill.confidence}% match</span>
                  <button onClick={() => handleRemoveExtractedSkill(skill.id)} className="ml-1 rounded-full p-0.5 hover:bg-[#b8d4e8] text-[#365970]"><X size={12} /></button>
                </div>
              )) : <span className="text-xs text-[#718078] italic">No needs extracted</span>}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-bold text-[#496724] mb-2 flex items-center gap-1.5"><Award size={14} /> Identified Offers</p>
            <div className="flex flex-wrap gap-2">
              {extractedSkills.filter(s => s.type === "offer").length > 0 ? extractedSkills.filter(s => s.type === "offer").map(skill => (
                <div key={skill.id} className="flex items-center gap-1 rounded-full bg-[#e1efc4] pl-2.5 pr-1 py-1 border border-[#c5e09f]">
                  <span className="text-xs font-semibold text-[#294012]">{skill.name}</span>
                  <span className="text-[9px] text-[#58792a] ml-1">{skill.confidence}% match</span>
                  <button onClick={() => handleRemoveExtractedSkill(skill.id)} className="ml-1 rounded-full p-0.5 hover:bg-[#c5e09f] text-[#496724]"><X size={12} /></button>
                </div>
              )) : <span className="text-xs text-[#718078] italic">No offers extracted</span>}
            </div>
          </div>

          <div className="rounded-xl border border-[#e0e4db] p-3 text-xs leading-5 text-[#536159] mt-4 flex items-start gap-2">
            <CircleHelp size={14} className="mt-0.5 shrink-0 text-[#779643]" />
            Intelligent Taxonomy Mapping connected jargon from your request to standardized platform skills to improve matching.
          </div>
        </div>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={() => { setRequestOpen(false); setAnalysisComplete(false); setExtractedSkills([]); }} className="rounded-full border-[#cbd4c6] text-xs">Cancel</Button>
        {!analysisComplete ? (
          <Button onClick={handleAnalyzeRequest} disabled={!requestTitle.trim() || !requestText.trim() || isAnalyzing} className="rounded-full bg-[#17221e] text-xs text-[#f6f3ec] hover:bg-[#2c4034]">
            {isAnalyzing ? <><Loader2 size={14} className="animate-spin mr-1" /> Analyzing...</> : <><Sparkles size={14} className="mr-1" /> Extract skills</>}
          </Button>
        ) : (
          <Button onClick={createRequest} className="rounded-full bg-[#779643] text-xs text-[#f6f3ec] hover:bg-[#58792a]">
            Confirm & post request <Check size={14} className="ml-1" />
          </Button>
        )}
      </DialogFooter>
    </DialogContent></Dialog>

    <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}><DialogContent className="max-w-[520px] rounded-[24px] border-[#d9ddd1] bg-[#fffdf8]"><DialogHeader><p className="meta-label text-[#779643]">Close the loop</p><DialogTitle className="display-font text-3xl tracking-[-.06em]">How was the exchange?</DialogTitle><DialogDescription className="text-sm leading-6">Your feedback is exchange-specific and helps future collaborators understand the working experience.</DialogDescription></DialogHeader><div className="space-y-5 py-3"><div><p className="mb-2 text-xs font-bold text-[#536159]">Quick signals</p><div className="grid grid-cols-3 gap-2"><button onClick={() => setFeedbackSignals(values => values.includes("Reliable") ? values.filter(value => value !== "Reliable") : [...values, "Reliable"])} className={`rounded-xl border p-3 text-xs font-semibold ${feedbackSignals.includes("Reliable") ? "border-[#779643] bg-[#e1efc4] text-[#496724]" : "border-[#cbd4c6] bg-[#f1f4ea] text-[#536159]"}`}>Reliable</button><button onClick={() => setFeedbackSignals(values => values.includes("Helpful") ? values.filter(value => value !== "Helpful") : [...values, "Helpful"])} className={`rounded-xl border p-3 text-xs font-semibold ${feedbackSignals.includes("Helpful") ? "border-[#779643] bg-[#e1efc4] text-[#496724]" : "border-[#cbd4c6] bg-[#f1f4ea] text-[#536159]"}`}>Helpful</button><button onClick={() => setFeedbackSignals(values => values.includes("Clear") ? values.filter(value => value !== "Clear") : [...values, "Clear"])} className={`rounded-xl border p-3 text-xs font-semibold ${feedbackSignals.includes("Clear") ? "border-[#779643] bg-[#e1efc4] text-[#496724]" : "border-[#cbd4c6] bg-[#f1f4ea] text-[#536159]"}`}>Clear</button></div></div><div><label className="mb-2 block text-xs font-bold text-[#536159]">One useful note (optional)</label><Textarea value={feedbackNote} onChange={event => setFeedbackNote(event.target.value)} placeholder="What made the exchange work?" className="min-h-[96px] resize-none border-[#d1d8cc] bg-[#f8f7f1]" /></div></div><DialogFooter><Button variant="outline" onClick={() => setFeedbackOpen(false)} className="rounded-full border-[#cbd4c6] text-xs">Skip for now</Button><Button onClick={sendFeedback} className="rounded-full bg-[#17221e] text-xs text-[#f6f3ec] hover:bg-[#2c4034]">Add feedback <Check size={14} /></Button></DialogFooter></DialogContent></Dialog>

    {/* Additional Feature 2: Profile & Skill Inventory Modal */}
    <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
      <DialogContent className="max-w-[640px] max-h-[85vh] overflow-y-auto rounded-[24px] border-[#d9ddd1] bg-[#fffdf8] p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#c6f36b] px-2.5 py-0.5 text-[10px] font-bold text-[#17221e]">Feature 2</span>
            <p className="meta-label text-[#779643]">Self-serve student portfolio</p>
          </div>
          <DialogTitle className="display-font text-3xl tracking-[-.06em]">Student Profile & Inventory</DialogTitle>
          <DialogDescription className="text-sm leading-6">
            Manage your academic credentials, contact handles, offered skills with proficiency, and learning wishlist.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="mt-2 flex gap-2 border-b border-[#e2e6dc] pb-3">
          {[
            { id: "details", label: "Academic Profile & Handles" },
            { id: "skills", label: `Skills Portfolio (${skillsOffered.length})` },
            { id: "goals", label: `Learning Goals (${learningGoalsList.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveProfileTab(tab.id as any)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeProfileTab === tab.id
                  ? "bg-[#17221e] text-[#f6f3ec]"
                  : "bg-[#f1f4ea] text-[#526356] hover:bg-[#e4ebd8]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Academic Profile & Handles */}
        {activeProfileTab === "details" && (
          <div className="space-y-4 py-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#536159]">Full Name</label>
                <Input
                  value={editProfile.name}
                  onChange={e => setEditProfile({ ...editProfile, name: e.target.value })}
                  placeholder="Your Name"
                  className="h-10 border-[#d1d8cc] bg-[#f8f7f1]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#536159]">University / Institution</label>
                <Input
                  value={editProfile.institution}
                  onChange={e => setEditProfile({ ...editProfile, institution: e.target.value })}
                  placeholder="e.g. Northbridge University"
                  className="h-10 border-[#d1d8cc] bg-[#f8f7f1]"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#536159]">Department / Major</label>
                <Input
                  value={editProfile.department}
                  onChange={e => setEditProfile({ ...editProfile, department: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="h-10 border-[#d1d8cc] bg-[#f8f7f1]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#536159]">Graduation Year</label>
                <Input
                  value={editProfile.graduationYear}
                  onChange={e => setEditProfile({ ...editProfile, graduationYear: e.target.value })}
                  placeholder="e.g. 2026"
                  className="h-10 border-[#d1d8cc] bg-[#f8f7f1]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#536159]">Student Bio</label>
              <Textarea
                value={editProfile.bio}
                onChange={e => setEditProfile({ ...editProfile, bio: e.target.value })}
                placeholder="What you are working on, what you love building..."
                className="min-h-[80px] resize-none border-[#d1d8cc] bg-[#f8f7f1]"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#536159]">Campus Email</label>
                <Input
                  value={editProfile.contactEmail}
                  onChange={e => setEditProfile({ ...editProfile, contactEmail: e.target.value })}
                  placeholder="name@college.edu"
                  className="h-10 border-[#d1d8cc] bg-[#f8f7f1]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#536159]">Discord Handle</label>
                <Input
                  value={editProfile.discord}
                  onChange={e => setEditProfile({ ...editProfile, discord: e.target.value })}
                  placeholder="handle#0000"
                  className="h-10 border-[#d1d8cc] bg-[#f8f7f1]"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#536159]">Telegram Username</label>
                <Input
                  value={editProfile.telegram}
                  onChange={e => setEditProfile({ ...editProfile, telegram: e.target.value })}
                  placeholder="@username"
                  className="h-10 border-[#d1d8cc] bg-[#f8f7f1]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#536159]">LinkedIn Profile</label>
                <Input
                  value={editProfile.linkedin}
                  onChange={e => setEditProfile({ ...editProfile, linkedin: e.target.value })}
                  placeholder="linkedin.com/in/username"
                  className="h-10 border-[#d1d8cc] bg-[#f8f7f1]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#536159]">Privacy & Discovery Visibility</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "campus_only", label: "Campus only" },
                  { value: "department_only", label: "Department only" },
                  { value: "public", label: "Public to all" },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setEditProfile({ ...editProfile, visibility: opt.value as any })}
                    className={`rounded-xl border p-2.5 text-xs font-semibold ${
                      editProfile.visibility === opt.value
                        ? "border-[#779643] bg-[#e1efc4] text-[#496724]"
                        : "border-[#cbd4c6] bg-[#f8f7f1] text-[#536159]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Skills Portfolio Manager (CRUD) */}
        {activeProfileTab === "skills" && (
          <div className="space-y-4 py-3">
            <div>
              <p className="text-xs font-bold text-[#536159]">Current Skills Offered ({skillsOffered.length})</p>
              <div className="mt-2 space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {skillsOffered.map(skill => (
                  <div key={skill.id} className="flex items-center justify-between rounded-xl border border-[#dce0d5] bg-[#fbfaf6] p-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#17221e]">{skill.name}</span>
                        <span className="rounded-full bg-[#c6f36b] px-2 py-0.5 text-[10px] font-bold text-[#17221e]">{skill.proficiency}</span>
                        <span className="text-[11px] text-[#718078]">· {skill.category}</span>
                      </div>
                      {skill.projectUrl ? <p className="mt-1 truncate max-w-[280px] text-[11px] text-[#536f32]">{skill.projectUrl}</p> : null}
                    </div>
                    <button
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="rounded-lg p-1.5 text-[#b95142] hover:bg-[#fae6e3]"
                      title="Remove skill"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Skill Form */}
            <div className="rounded-2xl border border-[#ccd8c4] bg-[#eef4e7] p-4 space-y-3">
              <p className="text-xs font-bold text-[#34482b] flex items-center gap-1.5"><Plus size={14} /> Add Skill to Portfolio</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  placeholder="Skill name (e.g. Next.js, Rust)"
                  className="h-9 border-[#cbd4c6] bg-white text-xs"
                />
                <Input
                  value={newSkillCategory}
                  onChange={e => setNewSkillCategory(e.target.value)}
                  placeholder="Category (e.g. Web, AI/ML)"
                  className="h-9 border-[#cbd4c6] bg-white text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#536159]">Proficiency Level</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["Beginner", "Intermediate", "Advanced", "Expert"] as const).map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setNewSkillProficiency(level)}
                      className={`rounded-lg border py-1.5 text-xs font-semibold ${
                        newSkillProficiency === level
                          ? "border-[#536f32] bg-[#c6f36b] text-[#17221e]"
                          : "border-[#cbd4c6] bg-white text-[#536159]"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                value={newSkillProjectUrl}
                onChange={e => setNewSkillProjectUrl(e.target.value)}
                placeholder="Portfolio or GitHub project link (optional)"
                className="h-9 border-[#cbd4c6] bg-white text-xs"
              />
              <Button
                onClick={handleAddSkill}
                disabled={!newSkillName.trim()}
                className="h-9 w-full rounded-full bg-[#17221e] text-xs text-[#f6f3ec] hover:bg-[#2c4034]"
              >
                + Add skill to portfolio
              </Button>
            </div>
          </div>
        )}

        {/* Tab 3: Learning Goals Wishlist (CRUD) */}
        {activeProfileTab === "goals" && (
          <div className="space-y-4 py-3">
            <div>
              <p className="text-xs font-bold text-[#536159]">Current Learning Wishlist ({learningGoalsList.length})</p>
              <div className="mt-2 space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {learningGoalsList.map(goal => (
                  <div key={goal.id} className="flex items-center justify-between rounded-xl border border-[#dce0d5] bg-[#fbfaf6] p-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#17221e]">{goal.name}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          goal.priority === "Urgent"
                            ? "bg-[#fcdcd7] text-[#a53b2d]"
                            : goal.priority === "High"
                            ? "bg-[#fed8b1] text-[#964e16]"
                            : "bg-[#dbeaf5] text-[#365970]"
                        }`}>
                          {goal.priority}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#718078]">{goal.note}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveGoal(goal.id)}
                      className="rounded-lg p-1.5 text-[#b95142] hover:bg-[#fae6e3]"
                      title="Remove goal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Learning Goal Form */}
            <div className="rounded-2xl border border-[#cbd8e6] bg-[#eef4fa] p-4 space-y-3">
              <p className="text-xs font-bold text-[#234257] flex items-center gap-1.5"><Plus size={14} /> Add Skill You Want to Learn</p>
              <Input
                value={newGoalName}
                onChange={e => setNewGoalName(e.target.value)}
                placeholder="Topic or Skill (e.g. Docker, Smart Contracts, Blender)"
                className="h-9 border-[#cbd4c6] bg-white text-xs"
              />
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#536159]">Priority Marker</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Urgent", "High", "Normal"] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewGoalPriority(p)}
                      className={`rounded-lg border py-1.5 text-xs font-semibold ${
                        newGoalPriority === p
                          ? "border-[#365970] bg-[#bfd7ee] text-[#1a384f]"
                          : "border-[#cbd4c6] bg-white text-[#536159]"
                      }`}
                    >
                      {p === "Urgent" ? "Urgent (Hackathon)" : p === "High" ? "High Priority" : "General Interest"}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                value={newGoalNote}
                onChange={e => setNewGoalNote(e.target.value)}
                placeholder="Context or note (e.g. Needed for semester capstone project)"
                className="h-9 border-[#cbd4c6] bg-white text-xs"
              />
              <Button
                onClick={handleAddGoal}
                disabled={!newGoalName.trim()}
                className="h-9 w-full rounded-full bg-[#17221e] text-xs text-[#f6f3ec] hover:bg-[#2c4034]"
              >
                + Add to learning wishlist
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="border-t border-[#e3e5dd] pt-4 flex items-center justify-between">
          <Button variant="outline" onClick={() => setProfileOpen(false)} className="rounded-full border-[#cbd4c6] text-xs">
            Close
          </Button>
          <Button onClick={handleSaveProfile} className="rounded-full bg-[#17221e] text-xs text-[#f6f3ec] hover:bg-[#2c4034]">
            Save profile changes <Check size={14} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>;
}
