/**
 * SkillLink Intelligent Matchmaking & Reciprocal Discovery Engine (Feature 4 & 5)
 *
 * Implements:
 * 1. Dual-Mode Discovery (Reciprocal two-way vs Direct one-way)
 * 2. Semantic Skill Similarity Graph (Vector/domain embeddings approximation)
 * 3. Multi-Factor Ranking Algorithm (overlap, proficiency tier, modality, reputation)
 * 4. AI-Generated Match Rationale, Mutual Benefit Breakdown & Icebreakers (Feature 5)
 * 5. Discovery Filters (department, proficiency, modality, availability, search)
 */

export interface CandidatePeer {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  year: string;
  avatar: string;
  skillsOffered: {
    name: string;
    proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    category: string;
  }[];
  skillsNeeded: {
    name: string;
    priority: "Urgent" | "High" | "Normal";
    category: string;
  }[];
  modality: "In-person" | "Remote" | "Hybrid";
  campusLocation?: string;
  availability: "Weekdays" | "Weekends" | "Flexible" | "Evenings";
  rating: number; // e.g. 4.9
  completedExchanges: number;
  bio: string;
}

export interface ComputedMatch {
  id: string;
  candidate: CandidatePeer;
  name: string;
  initials: string;
  role: string;
  department: string;
  avatar: string;
  kind: "Reciprocal" | "Direct";
  score: number;
  offer: string[]; // What candidate gives to user
  need: string[]; // What candidate receives from user
  modality: "In-person" | "Remote" | "Hybrid";
  campusLocation?: string;
  availability: string;
  rating: number;
  completedExchanges: number;
  explanation: string;
  mutualBenefit: {
    giveSummary: string;
    getSummary: string;
    estimatedTimeSaved: string;
    synergyNote: string;
  };
  icebreakers: string[];
}

export interface MatchFilters {
  kind: "All matches" | "Reciprocal" | "Direct";
  department: string;
  proficiencyTier: "All" | "Beginner-friendly" | "Advanced / Expert";
  modality: "All" | "In-person" | "Remote" | "Hybrid";
  availability: "All" | "Weekdays" | "Weekends" | "Flexible" | "Evenings";
  searchQuery: string;
  sortBy: "score" | "rating" | "exchanges";
}

// Initial peer pool on campus
export const campusPeers: CandidatePeer[] = [
  {
    id: "rahul",
    name: "Rahul Mehta",
    initials: "RM",
    role: "Computer Science · 3rd year",
    department: "Computer Science",
    year: "3rd year",
    avatar: "#e7c6af",
    skillsOffered: [
      { name: "UI/UX Design", proficiency: "Advanced", category: "Design" },
      { name: "Figma & Prototyping", proficiency: "Expert", category: "Design" },
      { name: "Web Design", proficiency: "Intermediate", category: "Design" },
    ],
    skillsNeeded: [
      { name: "Python", priority: "Urgent", category: "Programming" },
      { name: "Flask", priority: "High", category: "Web Backend" },
      { name: "Backend Development", priority: "Normal", category: "Web Backend" },
    ],
    modality: "In-person",
    campusLocation: "Library Innovation Commons",
    availability: "Weekdays",
    rating: 4.9,
    completedExchanges: 14,
    bio: "Product designer turning complex codebases into intuitive interfaces. Looking to sharpen backend skills for my capstone project.",
  },
  {
    id: "aisha",
    name: "Aisha Khan",
    initials: "AK",
    role: "Visual Communication · 2nd year",
    department: "Design & Visual Communication",
    year: "2nd year",
    avatar: "#c3dce5",
    skillsOffered: [
      { name: "Video Editing", proficiency: "Advanced", category: "Creative Media" },
      { name: "Visual storytelling", proficiency: "Advanced", category: "Design" },
      { name: "Photography & Photo Editing", proficiency: "Intermediate", category: "Creative Media" },
    ],
    skillsNeeded: [
      { name: "Frontend Development", priority: "High", category: "Web" },
      { name: "React.js", priority: "Urgent", category: "Web" },
      { name: "JavaScript", priority: "Normal", category: "Web" },
    ],
    modality: "Remote",
    campusLocation: "Google Meet / Discord",
    availability: "Evenings",
    rating: 4.8,
    completedExchanges: 9,
    bio: "Motion designer and storyteller. I create high-impact video pitches for student startups and hackathons.",
  },
  {
    id: "dev",
    name: "Dev Patel",
    initials: "DP",
    role: "Information Systems · 4th year",
    department: "Information Systems",
    year: "4th year",
    avatar: "#d4dbb0",
    skillsOffered: [
      { name: "Data Science & Analytics", proficiency: "Expert", category: "Data" },
      { name: "Database Design", proficiency: "Advanced", category: "Data" },
      { name: "Python", proficiency: "Advanced", category: "Programming" },
    ],
    skillsNeeded: [
      { name: "UI/UX Design", priority: "High", category: "Design" },
      { name: "Visual storytelling", priority: "Urgent", category: "Design" },
    ],
    modality: "Hybrid",
    campusLocation: "Turing Lab, Room 204",
    availability: "Flexible",
    rating: 4.7,
    completedExchanges: 12,
    bio: "Senior analyst focused on data pipelines and relational schema tuning. Need design help to present findings clearly.",
  },
  {
    id: "priya",
    name: "Priya Sharma",
    initials: "PS",
    role: "Software Engineering · 2nd year",
    department: "Computer Science",
    year: "2nd year",
    avatar: "#d8c8e3",
    skillsOffered: [
      { name: "Docker & Containers", proficiency: "Advanced", category: "DevOps" },
      { name: "DevOps", proficiency: "Intermediate", category: "DevOps" },
      { name: "Kubernetes", proficiency: "Beginner", category: "Cloud" },
    ],
    skillsNeeded: [
      { name: "Python", priority: "Urgent", category: "Programming" },
      { name: "Flask", priority: "Normal", category: "Web Backend" },
      { name: "Machine Learning", priority: "High", category: "AI/ML" },
    ],
    modality: "In-person",
    campusLocation: "Student Center, 3rd Floor Lounge",
    availability: "Weekends",
    rating: 4.95,
    completedExchanges: 8,
    bio: "Container enthusiast and Linux tinkerer. Building reproducible cloud dev environments for campus clubs.",
  },
  {
    id: "sonia",
    name: "Sonia Roy",
    initials: "SR",
    role: "Data Science & AI · Graduate",
    department: "Data Science & AI",
    year: "Graduate",
    avatar: "#f6cfb2",
    skillsOffered: [
      { name: "Machine Learning", proficiency: "Expert", category: "AI/ML" },
      { name: "Python", proficiency: "Expert", category: "AI/ML" },
      { name: "Data Science & Analytics", proficiency: "Advanced", category: "Data" },
    ],
    skillsNeeded: [
      { name: "Figma & Prototyping", priority: "High", category: "Design" },
      { name: "Frontend Development", priority: "Normal", category: "Web" },
    ],
    modality: "In-person",
    campusLocation: "Research Block A, Room 112",
    availability: "Evenings",
    rating: 5.0,
    completedExchanges: 16,
    bio: "Grad researcher working on neural networks and model interpretability. Happy to pair on ML architecture.",
  },
  {
    id: "marcus",
    name: "Marcus Vance",
    initials: "MV",
    role: "Interactive Media · 3rd year",
    department: "Design & Visual Communication",
    year: "3rd year",
    avatar: "#c8dfd0",
    skillsOffered: [
      { name: "UI/UX Design", proficiency: "Advanced", category: "Design" },
      { name: "Web Design", proficiency: "Advanced", category: "Design" },
      { name: "Figma & Prototyping", proficiency: "Intermediate", category: "Design" },
    ],
    skillsNeeded: [
      { name: "C++", priority: "Urgent", category: "Systems" },
      { name: "Backend Development", priority: "High", category: "Web Backend" },
    ],
    modality: "Remote",
    campusLocation: "Discord / Zoom",
    availability: "Flexible",
    rating: 4.65,
    completedExchanges: 7,
    bio: "Game UI artist and web designer. Building interactive web prototypes, learning systems programming.",
  },
  {
    id: "kevin",
    name: "Kevin Zhang",
    initials: "KZ",
    role: "Computer Engineering · 3rd year",
    department: "Computer Engineering",
    year: "3rd year",
    avatar: "#d5dfc6",
    skillsOffered: [
      { name: "C++", proficiency: "Expert", category: "Systems" },
      { name: "Backend Development", proficiency: "Advanced", category: "Web Backend" },
      { name: "Database Design", proficiency: "Intermediate", category: "Data" },
    ],
    skillsNeeded: [
      { name: "UI/UX Design", priority: "High", category: "Design" },
      { name: "Figma & Prototyping", priority: "Normal", category: "Design" },
    ],
    modality: "In-person",
    campusLocation: "Engineering Quad Cafe",
    availability: "Weekdays",
    rating: 4.85,
    completedExchanges: 11,
    bio: "Low-level systems nerd and competitive programmer. Want to learn good design hygiene for portfolio apps.",
  }
];

// Semantic skill similarity clusters
const semanticClusters: Record<string, string[]> = {
  python_stack: ["Python", "Flask", "FastAPI", "Data Science & Analytics", "Machine Learning", "Backend Development"],
  design_ux: ["UI/UX Design", "Figma & Prototyping", "Web Design", "Visual storytelling", "Frontend Development"],
  web_frontend: ["React.js", "Frontend Development", "JavaScript", "TypeScript", "Web Design", "UI/UX Design"],
  devops_cloud: ["Docker & Containers", "DevOps", "Kubernetes", "Backend Development", "Linux"],
  data_ai: ["Data Science & Analytics", "Machine Learning", "Python", "Database Design"],
  systems_cpp: ["C++", "Systems & Algorithms", "Backend Development", "Linux"],
  media_creative: ["Video Editing", "Visual storytelling", "Photography & Photo Editing", "UI/UX Design"],
};

/**
 * Calculates semantic similarity between two skill strings (0.0 to 1.0).
 */
export function getSemanticSimilarity(skillA: string, skillB: string): number {
  const normA = skillA.toLowerCase().trim();
  const normB = skillB.toLowerCase().trim();

  if (normA === normB) return 1.0;
  if (normA.includes(normB) || normB.includes(normA)) return 0.9;

  // Check cluster membership
  for (const cluster of Object.values(semanticClusters)) {
    const hasA = cluster.some(s => s.toLowerCase().includes(normA) || normA.includes(s.toLowerCase()));
    const hasB = cluster.some(s => s.toLowerCase().includes(normB) || normB.includes(s.toLowerCase()));
    if (hasA && hasB) {
      return 0.75; // strong domain synergy
    }
  }

  return 0.0;
}

/**
 * Multi-factor matchmaking calculation engine.
 */
export function computeCampusMatches(
  userOfferedSkills: { name: string; proficiency: string; category?: string }[],
  userLearningGoals: { name: string; priority: string }[],
  activeRequestSkills: string[] = [],
  filters: MatchFilters
): ComputedMatch[] {
  // Aggregate user needs: from learning goals + any active request
  const userNeeds = [
    ...userLearningGoals.map(g => ({ name: g.name, priority: g.priority })),
    ...activeRequestSkills.map(s => ({ name: s, priority: "Urgent" as const })),
  ];

  const results: ComputedMatch[] = [];

  for (const peer of campusPeers) {
    // 1. Calculate Give Synergy: How well user skills satisfy peer's needed skills
    let giveSynergyScore = 0;
    const matchedGiveSkills: string[] = [];

    for (const peerNeed of peer.skillsNeeded) {
      for (const userOffer of userOfferedSkills) {
        const sim = getSemanticSimilarity(userOffer.name, peerNeed.name);
        if (sim >= 0.7) {
          const weight = peerNeed.priority === "Urgent" ? 1.2 : peerNeed.priority === "High" ? 1.0 : 0.8;
          giveSynergyScore += sim * weight;
          if (!matchedGiveSkills.includes(userOffer.name)) {
            matchedGiveSkills.push(userOffer.name);
          }
        }
      }
    }

    // 2. Calculate Get Synergy: How well peer skills satisfy user needs
    let getSynergyScore = 0;
    const matchedGetSkills: string[] = [];

    for (const userNeed of userNeeds) {
      for (const peerOffer of peer.skillsOffered) {
        const sim = getSemanticSimilarity(peerOffer.name, userNeed.name);
        if (sim >= 0.7) {
          const weight = userNeed.priority === "Urgent" ? 1.25 : userNeed.priority === "High" ? 1.0 : 0.8;
          // Proficiency tier boost
          const profMultiplier = peerOffer.proficiency === "Expert" ? 1.2 : peerOffer.proficiency === "Advanced" ? 1.1 : 1.0;
          getSynergyScore += sim * weight * profMultiplier;
          if (!matchedGetSkills.includes(peerOffer.name)) {
            matchedGetSkills.push(peerOffer.name);
          }
        }
      }
    }

    // Determine Match Type: Reciprocal vs Direct
    const isReciprocal = giveSynergyScore > 0.5 && getSynergyScore > 0.5;
    const isDirect = getSynergyScore > 0.5 && !isReciprocal;

    // If no meaningful overlap either way, skip
    if (!isReciprocal && !isDirect) continue;

    // 3. Multi-Factor Score Calculation
    let baseScore = isReciprocal
      ? 75 + Math.min(18, (giveSynergyScore + getSynergyScore) * 6)
      : 68 + Math.min(18, getSynergyScore * 8);

    // Reputation bonus (+2 to +4)
    if (peer.rating >= 4.9) baseScore += 4;
    else if (peer.rating >= 4.8) baseScore += 2;

    // Proximity / modality bonus (+2)
    if (peer.modality === "In-person") baseScore += 2;

    const finalScore = Math.min(98, Math.round(baseScore));

    // What candidate offers user
    const candidateOffersForUser = matchedGetSkills.length > 0
      ? matchedGetSkills
      : peer.skillsOffered.map(s => s.name).slice(0, 2);

    // What candidate needs from user
    const candidateNeedsFromUser = matchedGiveSkills.length > 0
      ? matchedGiveSkills
      : peer.skillsNeeded.map(s => s.name).slice(0, 2);

    // Generate Feature 5 AI Rationale
    const firstGet = candidateOffersForUser[0] || peer.skillsOffered[0].name;
    const firstGive = candidateNeedsFromUser[0] || (userOfferedSkills[0]?.name ?? "Python");

    const explanation = isReciprocal
      ? `${peer.name} offers ${firstGet}, which matches your active learning goals. In return, your expertise in ${firstGive} directly unblocks their upcoming project.`
      : `${peer.name} is a high-confidence match for ${firstGet}. This is a direct exchange where you gain practical guidance from their ${peer.skillsOffered[0].proficiency.toLowerCase()} background.`;

    const estimatedHours = isReciprocal ? "~4 to 6 hours saved" : "~3 hours of targeted guidance";

    const synergyNote = isReciprocal
      ? `Two-way balance: Both participants exchange high-priority skills with complementary experience depths.`
      : `Focused mentorship: Targeted pair-programming or review session on specific roadblocks.`;

    // Generate Collaborative Icebreakers (Feature 5)
    const icebreakers = [
      `"Saw you're working on ${firstGive} — I've built a few projects with it and would love to walk through the architecture."`,
      `"How's your current milestone going for ${peer.department}? I'm looking to level up on ${firstGet} for an upcoming deliverable."`,
      `"Are you free for an initial 30-min sync at ${peer.campusLocation || "campus"} to map out what we can swap?"`,
    ];

    results.push({
      id: peer.id,
      candidate: peer,
      name: peer.name,
      initials: peer.initials,
      role: peer.role,
      department: peer.department,
      avatar: peer.avatar,
      kind: isReciprocal ? "Reciprocal" : "Direct",
      score: finalScore,
      offer: candidateOffersForUser,
      need: candidateNeedsFromUser,
      modality: peer.modality,
      campusLocation: peer.campusLocation,
      availability: peer.availability,
      rating: peer.rating,
      completedExchanges: peer.completedExchanges,
      explanation,
      mutualBenefit: {
        giveSummary: `You share: ${candidateNeedsFromUser.join(", ")}`,
        getSummary: `They share: ${candidateOffersForUser.join(", ")}`,
        estimatedTimeSaved: estimatedHours,
        synergyNote,
      },
      icebreakers,
    });
  }

  // 4. Apply Filters
  let filtered = results;

  // Filter: Kind
  if (filters.kind !== "All matches") {
    filtered = filtered.filter(m => m.kind === filters.kind);
  }

  // Filter: Department
  if (filters.department && filters.department !== "All") {
    filtered = filtered.filter(m => m.department.toLowerCase().includes(filters.department.toLowerCase()));
  }

  // Filter: Proficiency Tier
  if (filters.proficiencyTier === "Advanced / Expert") {
    filtered = filtered.filter(m =>
      m.candidate.skillsOffered.some(s => s.proficiency === "Advanced" || s.proficiency === "Expert")
    );
  } else if (filters.proficiencyTier === "Beginner-friendly") {
    filtered = filtered.filter(m =>
      m.candidate.skillsOffered.some(s => s.proficiency === "Beginner" || s.proficiency === "Intermediate")
    );
  }

  // Filter: Modality
  if (filters.modality !== "All") {
    filtered = filtered.filter(m => m.modality === filters.modality);
  }

  // Filter: Availability
  if (filters.availability !== "All") {
    filtered = filtered.filter(m => m.availability === filters.availability);
  }

  // Filter: Search Query
  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q) ||
      m.offer.some(s => s.toLowerCase().includes(q)) ||
      m.need.some(s => s.toLowerCase().includes(q))
    );
  }

  // 5. Apply Sorting
  filtered.sort((a, b) => {
    if (filters.sortBy === "rating") return b.rating - a.rating;
    if (filters.sortBy === "exchanges") return b.completedExchanges - a.completedExchanges;
    return b.score - a.score; // default: compatibility score
  });

  return filtered;
}
