import { describe, it, expect } from "vitest";
import {
  getSemanticSimilarity,
  computeCampusMatches,
  type MatchFilters,
} from "./matchmakingEngine";

describe("matchmakingEngine", () => {
  it("calculates semantic similarity correctly", () => {
    // Exact match
    expect(getSemanticSimilarity("Python", "Python")).toBe(1.0);
    // Substring match
    expect(getSemanticSimilarity("UI/UX Design", "UI/UX")).toBe(0.9);
    // Cluster domain affinity (Python stack)
    expect(getSemanticSimilarity("Python", "Flask")).toBe(0.75);
    // Cluster domain affinity (Design & Frontend)
    expect(getSemanticSimilarity("Figma & Prototyping", "UI/UX Design")).toBe(0.75);
    // Unrelated skills
    expect(getSemanticSimilarity("Python", "Photography & Photo Editing")).toBe(0.0);
  });

  it("computes reciprocal and direct matches dynamically based on user inventory", () => {
    const userOffers = [
      { name: "Python", proficiency: "Advanced", category: "Programming" },
      { name: "Flask", proficiency: "Intermediate", category: "Backend" },
    ];
    const userGoals = [
      { name: "UI/UX Design", priority: "Urgent" },
      { name: "Figma & Prototyping", priority: "High" },
    ];

    const defaultFilters: MatchFilters = {
      kind: "All matches",
      department: "All",
      proficiencyTier: "All",
      modality: "All",
      availability: "All",
      searchQuery: "",
      sortBy: "score",
    };

    const matches = computeCampusMatches(userOffers, userGoals, [], defaultFilters);

    expect(matches.length).toBeGreaterThan(0);

    // Top match should be Rahul Mehta (needs Python/Flask, offers UI/UX & Figma)
    const rahulMatch = matches.find(m => m.id === "rahul");
    expect(rahulMatch).toBeDefined();
    expect(rahulMatch?.kind).toBe("Reciprocal");
    expect(rahulMatch?.score).toBeGreaterThan(85);
    expect(rahulMatch?.mutualBenefit.estimatedTimeSaved).toBeDefined();
    expect(rahulMatch?.icebreakers.length).toBe(3);
  });

  it("filters matches by modality and department accurately", () => {
    const userOffers = [
      { name: "Python", proficiency: "Advanced", category: "Programming" },
    ];
    const userGoals = [
      { name: "UI/UX Design", priority: "High" },
      { name: "Docker & Containers", priority: "Urgent" },
    ];

    const inPersonFilters: MatchFilters = {
      kind: "All matches",
      department: "All",
      proficiencyTier: "All",
      modality: "In-person",
      availability: "All",
      searchQuery: "",
      sortBy: "score",
    };

    const inPersonMatches = computeCampusMatches(userOffers, userGoals, [], inPersonFilters);
    expect(inPersonMatches.every(m => m.modality === "In-person")).toBe(true);

    const csFilters: MatchFilters = {
      kind: "All matches",
      department: "Computer Science",
      proficiencyTier: "All",
      modality: "All",
      availability: "All",
      searchQuery: "",
      sortBy: "score",
    };

    const csMatches = computeCampusMatches(userOffers, userGoals, [], csFilters);
    expect(csMatches.every(m => m.department.includes("Computer Science"))).toBe(true);
  });
});
