# SkillLink implementation plan

## Product direction
SkillLink is a college-first exchange workspace where students discover peers who can mutually help each other, not a generic social feed. The MVP is represented as an interactive, deterministic demo backed by realistic domain entities and ready for future Manus OAuth, database, REST and LLM integration.

## Design system

- **Design movement:** Editorial campus commons — a warm, print-inspired interface with quiet confidence and practical product density.
- **Core principles:** (1) Make reciprocity visible, (2) turn trust into evidence, (3) use generous whitespace around high-signal actions, (4) prefer explanations over opaque scores.
- **Color philosophy:** Warm paper `#F6F3EC` gives the workspace a shared-notebook feeling; deep ink `#17221E` grounds navigation and key actions; ownable signal lime `#C6F36B` marks mutual value and completion; muted blue `#BFD7EE` distinguishes learning requests without looking corporate.
- **Layout paradigm:** A slim editorial rail anchors the left edge while the main canvas uses asymmetric “briefing” rows, an offset feature panel, and compact evidence strips instead of a centered card grid.
- **Signature elements:** Lime reciprocity arrows, underlined “match reasoning” labels, and small mono metadata labels that make the product feel like a well-organized studio board.
- **Interaction philosophy:** Every important action should answer “what happens next?” Buttons use plain verbs, match cards reveal the reason before the action, and status changes are immediately reflected in the exchange timeline.
- **Animation:** Short ease-out fades and 180ms lift on hover; no looping decoration. Progress and score changes animate once to reinforce completion without distracting from work.
- **Typography:** `DM Sans` for approachable UI copy; `Space Grotesk` for headings, navigation and key metrics; uppercase `IBM Plex Mono`-style metadata treatment via system monospace.
- **Brand essence:** “The campus network for trading what you know for what you want to learn.” Personality: generous, grounded, optimistic.
- **Brand voice:** Headlines are direct and encouraging; CTAs sound like invitations to collaborate. Examples: “Your next useful person is probably on campus.” and “Trade a strength for a next step.”
- **Wordmark & logo:** A linked-S mark made from two offset rounded strokes, suggesting a chain of give/receive arrows. In code, the mark is rendered as a compact lime loop icon beside the SkillLink wordmark.
- **Signature brand color:** Signal lime `#C6F36B`.

## Implementation approach

- Replace the starter `Home` page with a responsive dashboard shell that demonstrates overview, discover/matches, request creation, active exchanges, exchange history and profile/reputation views.
- Keep deterministic data in `client/src/pages/Home.tsx` for a stable, useful preview. The structures mirror the brief’s `User`, `Skill`, `SkillRequest`, `Match`, `Exchange`, `Feedback` and `ContributionRecord` entities.
- Use stateful UI interactions for view switching, filtering, match explanation, request creation, collaboration request, exchange completion and feedback submission. Toasts communicate each transition.
- Preserve the generated server, auth, Drizzle schema and deployment configuration so the demo can later move its data and login flow into real procedures without a frontend rewrite.
- Serve `public/manus-routes.json` for the documented route manifest and add `app.config.ts` with a durable project logo URL placeholder only if needed by the platform.

## Project structure

- `client/src/App.tsx`: route map and global providers.
- `client/src/pages/Home.tsx`: the SkillLink dashboard experience and deterministic domain data.
- `client/src/index.css`: editorial campus commons tokens, responsive layout utilities and interaction polish.
- `public/manus-routes.json`: current page route declarations.
- `server/`, `drizzle/`: generated server/auth/database foundation retained for future persistence.
- `plan.md`, `TODO.md`: implementation decisions and outcome criteria.
