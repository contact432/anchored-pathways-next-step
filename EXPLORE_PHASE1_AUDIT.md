# AP Next Step — Explore Phase 1: Read-Only Audit Report

Repository: `contact432/anchored-pathways-next-step` (branch `main`, HEAD `cc15805`)
Scope of this pass: **Step 1 — Read-only audit**, per the Phase 1 brief. No code has been changed yet.

---

## 1. RESULT

**BLOCKED (partial) — audit complete, two decisions needed before Phase 1 build starts.**

The brief itself says: *"STOP and report before implementation if the current architecture materially conflicts with this design."* It does. Details below, with two concrete decisions I need from you before I touch code (Section 14).

---

## 2. CURRENT EXPLORE AUDIT

Everything lives in one file, `index.html` (~4,200 lines, a hand-rolled JS app with no framework, no build step, no backend — it's a hash-routed single-page app rendered with a `SCREEN_MAP` of functions).

**Current Explore is a single linear quiz, not three routes.** From the home screen, "They don't know what to study" → Explore leads to one sequential flow:

| Screen (current) | What it does | Function |
|---|---|---|
| Explore Hub | Intro + progress dots (0–4 of 4 parts done) + jump list | `exploreScreen()` |
| Discover Your Core Values | Pick ≥5 values, then drag-rank top 5 | `valuesScreen()` |
| Discover Your Superpowers | Pick 8 strengths, then pick top 3 | `strengthsScreen()` |
| What's Your Type? | 8 forced-choice A/B questions → 4-letter code (e.g. "ENTJ") + a named type ("The Commander") | `personalityScreen()` |
| What Do You Enjoy? | Pick activities → tallies a RIASEC-style code (R/I/A/S/E/C), keeps top 3 | `interestsScreen()` |
| Your Path Profile | Synthesis screen: "what you shared," descriptive cross-section pattern-noticing (no scores), 2 example careers pulled from a 12-item hardcoded map keyed to the student's top interest code, "Continue to Decide" | `pathProfileScreen()` |
| Vision reflection | One open-text "the life you're imagining" question, asked once, shown back verbatim later | `buildVisionCard()` |

There is no "I have some ideas but don't know what fits" flow and no parent/family reflection flow anywhere in the app today.

## 3. EXISTING VALUES/STRENGTHS/INTERESTS/PERSONALITY/PATH PROFILE FEATURES

- **Values** (`VALUES` array, 12 items) and **Strengths** (`STRENGTHS` array, ~12 items): self-selected chip lists, no scoring, no external instrument claimed. This maps cleanly onto the brief's Screen B ("what matters to me," "what comes naturally to me").
- **Personality** (`PERSONALITY_Q`, 8 forced-choice questions, `TYPE_NAMES`/`TYPE_NAMES_ES`): a home-built Myers-Briggs-style clone. It produces an identity label — literally `"${code} · ${name}"`, e.g. "ENTJ · The Commander" / "El Comandante." The UI does say "This is a short version" but the format (4-letter code + persona name) is exactly the kind of identity labeling the new brief prohibits.
- **Interests** (`RIASEC` array + tally logic in `interestsScreen()`): a home-built, unvalidated 30-second activity-picker that self-labels its output using real RIASEC letters (R/I/A/S/E/C) and real Holland-style category names, without being the actual O*NET instrument. It's presented gently ("your top interest areas"), but it borrows O*NET's own vocabulary for a non-O*NET result.
- **Path Profile synthesis** (`computeSynthesis()`, `patternsSectionCopy()`, `questionsToKeepExploringCopy()`): this part is well-built and already matches the brief's spirit — it compares themes across completed sections and only ever produces descriptive statements ("X keeps showing up for you — does that sound like you?"), never a score, percentage, or "best" answer. No gap/mismatch/conflict score exists anywhere in the codebase.

## 4. LANGUAGE AUDIT (assessment / profile / match / recommendation / fit / strengths / values / interests)

- User-facing copy never uses the word "assessment," "match," "career fit," or "recommendation." Good — this part already follows the brief's spirit.
- The one code **comment** (not shown to users) at line 332 literally reads: `// Career + credential recommendations keyed by RIASEC top code (simplified mapping for demo)` — an internal admission that `CAREER_MAP` is placeholder-quality, not sourced data.
- "Profile" is used only as "Path Profile" / "Family Profile," never "career profile" or "personality profile" — acceptable.
- The personality screen is the one place real "type" identity language appears in user-facing text ("¿Cuál Es Tu Tipo?" / "What's Your Type?").

## 5. EXPLORE STATE VARIABLES (in the global `state` object)

`valuesStep/valuesSelected/valuesRanked`, `strengthsStep/strengthsSelected/strengthsTop3`, `persoStep/persoAnswers`, `interestStep/interestSelected/interestDone`, `completed:{values,strengths,personality,interests}`, `results:{values,strengths,personality,interests}`, `visionAsked/visionReflection`. `resetExploreState()` clears exactly these and nothing else.

## 6–8. PERSISTENCE

- **What's persisted:** only `state.completed` and `state.results` (the four sections' finished/not-finished flags and their outcome objects), under `localStorage` key `ap_explore_progress_v1`. A separate `ap_family_id_v1` key holds a locally-generated reference code (`AP-YYYYMM-###`).
- **Mechanism:** `localStorage` only (`saveExploreProgress()` / `loadExploreProgress()`), wrapped in try/catch so private browsing or disabled storage fails silently and the app still works session-only. No sessionStorage, no URL-encoded state, no backend, no database.
- **Not persisted:** the vision reflection text, in-progress selections mid-quiz, every click, and (once Phase 1 adds it) would-be parent reflection answers — matches the brief's "minimize by default" instruction almost exactly, out of the box.
- **Where it does NOT go:** nowhere off-device automatically. There is no fetch/XHR/API call anywhere tied to Explore data. The only outbound Explore-adjacent data flow is the Family ID getting pre-filled as one *optional* field into two existing Google Forms (see Section 16).

## 9. CAREER COST & PAY EXPLORER — HOW IT'S REACHED AND STRUCTURED

- Reached from Decide via a card/button, and separately from the main nav. It's a fully separate 15-occupation dataset (`OCCUPATION_DATA`), each mapped to one real O*NET-SOC code, sourced BLS wage data (national only; Houston-area intentionally null pending Patch 3B), and 1+ costed training `pathways` per occupation with named institutions and sourced costs. This is the "extensively sourced" tool the brief refers to — confirmed real.
- **Explore does not currently link into it at all.** The 12-item `CAREER_MAP` used on the Path Profile screen is a completely separate, unsourced, uncosted mini-list with no click-through and no shared IDs with `OCCUPATION_DATA`.
- **Overlap check:** of `CAREER_MAP`'s 12 example careers, only 2 (HVAC Technician, Electrician) plus a near-match (Registered Nurse) exist in `OCCUPATION_DATA`. Teacher, Social Worker, Graphic Designer, Accounting Technician, Medical Records/Billing, Small Business Owner, Business/Sales, Lab Technician, and Radio/Media Production are **not represented** in the Career Cost & Pay Explorer at all. Per the brief, I will not fabricate data to fill these gaps — see Section 14/Item 15 in the follow-up build.

## 10. RANKING / MATCHING / SCORING CHECK

- Nothing in the codebase ranks careers, calculates a match score, or implies validated psychometric precision for career selection. `CAREER_MAP[topCode]` is a flat, unordered 2-item lookup by top RIASEC-style letter — a category filter, not a ranking algorithm.
- The one place a **scored, labeled output** does exist is the Personality screen's 4-letter type + persona name. That's not a career match, but it is exactly the "identity labeling" / "personality type" pattern the new brief explicitly forbids building.

## 11–12. REUSE / RELABEL vs. REBUILD

| Component | Verdict |
|---|---|
| Values chip-pick + rank | **KEEP**, reuse near-verbatim as part of the new Screen B reflection |
| Strengths chip-pick (8→top 3) | **KEEP**, reuse near-verbatim as part of Screen B |
| Vision reflection (open text) | **KEEP**, reuse as Screen A's "tell us more" or optional Screen B prompt |
| Path Profile synthesis engine (`computeSynthesis`, theme copy) | **KEEP**, this is exactly the "descriptive overlap only" pattern the brief wants for Our Conversation later |
| Explore progress persistence (`localStorage`, `EXPLORE_PROGRESS_KEY`) | **KEEP**, extend its shape, don't replace the mechanism |
| Family ID / AP Reference Code + Google Form prefill | **KEEP**, reuse as the low-tech "Share With My Navigator" mechanism |
| Interests (home-built RIASEC tally) | **CHANGE** — reframe copy to stop implying a validated instrument, and treat it as the fallback if O*NET Mini-IP isn't wired up this phase (see Section 13) |
| Personality ("What's Your Type?") | **CHANGE or REMOVE from Explore** — conflicts with brief; needs your call (Section 14, Decision 1) |
| `CAREER_MAP` (12-item list) | **CHANGE** — keep as a thin "why this shows up" category bridge, but link out to Career Cost & Pay Explorer wherever an occupation exists there instead of duplicating |
| Three-route entry (Explore for Me / Compare My Ideas / Explore Together) | **ADD** — doesn't exist |
| Compare My Ideas (2–4 user-named ideas) | **ADD** — doesn't exist; Decide's 3-path comparison is a different, fixed feature and stays untouched |
| Parent/Explore Together reflection | **ADD** — doesn't exist |
| Our Conversation (student+parent shared view) | **ADD** — doesn't exist |
| My Explore Profile (renamed/extended Path Profile) | **CHANGE** — extend existing Path Profile rather than building a parallel screen |
| Share With My Navigator (explicit screen) | **ADD** — the underlying mechanism (Family ID + form prefill) already exists; needs a dedicated entry point/copy |
| O*NET Mini-IP | **ADD, pending your decision** — see Section 13 |
| Career Cost & Pay Explorer data/logic | **DO NOT TOUCH** — per the brief and confirmed necessary; only add links in |

## 13. O*NET INTEREST PROFILER MINI-IP — VERIFICATION RESULT

Checked directly against current official O*NET documentation ([onetcenter.org/IP.html](https://www.onetcenter.org/IP.html), [services.onetcenter.org/ip](https://services.onetcenter.org/ip), [services.onetcenter.org/reference/mnm/ip](https://services.onetcenter.org/reference/mnm/ip)):

- **Widget availability:** Yes, the Mini-IP (30-question) has an embeddable HTML widget, in English and Spanish, plus a direct-link option (`https://onetinterestprofiler.org/` English, `https://onetinterestprofiler.org/es/` Spanish) that requires no registration at all.
- **Registration:** To receive the actual widget embed code (or API access), you must sign up for O*NET's free developer program ("Sign up now for our free developer program, and you'll receive HTML code..."). This is an owner action — I cannot do this on your behalf, and there's no indication it requires anything beyond a standard sign-up.
- **Result capture — this is the blocker:** Official documentation describes score/result retrieval ("providing scores and career suggestions") as a capability of the **Web Services API**, not of the plain embeddable widget. Nothing in current O*NET documentation states that the embeddable widget returns RIASEC scores to the host page via callback, postMessage, or any other mechanism. Per the brief's own instruction ("do not invent a workaround"), I'm treating programmatic result capture as **unconfirmed** for the widget path.
- **Attribution:** The tool is Creative Commons–licensed with a "Career Exploration Tools License" governing redistribution, but the page doesn't spell out exact required attribution wording/placement — that would need confirming once you're in the developer portal.
- **Production URL registration:** Nothing in current documentation says a production URL must be pre-registered/allowlisted.

**Owner action required, if you want the real O*NET Mini-IP wired into Explore with captured results:** create an account in O*NET's free developer program at [services.onetcenter.org](https://services.onetcenter.org/) and request Web Services API access (not just the widget). I can build the integration once that access exists; I should not build a fake capture layer in the meantime.

## 14. TWO DECISIONS I NEED BEFORE STARTING THE BUILD

**Decision 1 — the existing Personality quiz.** "What's Your Type?" produces an MBTI-style 4-letter code + persona name (e.g., "ENTJ · The Commander"). This is the one part of current Explore that actively conflicts with the new brief (which explicitly forbids proprietary personality tests and identity labeling). It isn't mentioned anywhere in your brief, so I want your call rather than guessing:
   - (a) Remove it from the new Explore for Me flow entirely (Values + Strengths + Interests already cover "what matters" and "what comes naturally"); leave the code in the repo but unlinked, in case you want it elsewhere later.
   - (b) Keep it in Explore for Me, but soften it — drop the persona name/label, show only a plain, low-key reflection sentence.
   - (c) Leave it exactly as-is and out of scope for this patch.

**Decision 2 — O*NET Mini-IP for Screen C.** Given the registration requirement above:
   - (a) Ship Phase 1 with a direct link out to the official O*NET Mini-IP (onetinterestprofiler.org, English/Spanish, no registration needed) with a "tell us what stood out" manual follow-up field instead of automatic capture, and revisit embedding once you've signed up for API access.
   - (b) Hold Screen C entirely until you've completed O*NET developer registration, and use the app's existing home-built interest picker (relabeled honestly, not as O*NET) as the interim placeholder.
   - (c) You'll do the O*NET developer sign-up first, then have me build the real embed/API integration in a follow-up patch.

Once I have your answer on both, I'll proceed through the rest of the Implementation Order (three-route entry, Compare My Ideas, Explore Together/parent reflection, Our Conversation, My Explore Profile, Share With My Navigator, the `exploreSummary` schema, and full EN/ES + mobile/desktop + regression testing) on a feature branch, and come back with the full final report — without merging or publishing, per the brief.
