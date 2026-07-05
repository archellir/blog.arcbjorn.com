---
title: "State of CLI Coding Agents, Mid-2026"
published_at: "2026-07-04 12:00"
snippet: "Open vs. closed, sandbox vs. permission, cloud vs. local."
tags: ["ai", "agents", "cli", "devtools"]
---

The terminal was an unlikely winner. In 2024 the bet was on IDEs — Copilot already lived in the editor, Cursor was climbing, and "agent" still meant chat with shell access bolted on. By mid-2026 the serious usage ran from CI, SSH, and machines with no GUI at all. Scriptable, boring, and the model never fights something else for the window manager.

35 actively maintained CLI coding agents as of July 3, 2026. Crowded field.

[Skip to feature by feature comparison](#feature-by-feature) · [Skip to conclusions](#where-to-start)

## Short history

The 1st wave arrived in 2023, before anyone called these things agents. [gptme](https://github.com/gptme/gptme) (March 2023) let a model run shell commands from the terminal. [Aider](https://github.com/Aider-AI/aider) (mid-2023) built AI pair programming around git, with atomic commits as the unit of change. [Open Interpreter](https://github.com/OpenInterpreter/open-interpreter) (July 2023) generalized the idea to controlling the whole computer. All 3 survive — gptme as a daemon, Aider as a pair programmer, Open Interpreter as a general computer controller.

Anthropic's [Claude Code](https://claude.com/pricing) research preview in February 2025 set the shape: agentic loop, file and shell tools, project memory file, permission prompts, plan mode, hooks, subagents. Everyone else cloned it. OpenAI shipped [Codex CLI](https://developers.openai.com/codex/changelog) in April 2025 (later rewritten in Rust). Google followed with [Gemini CLI](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/) in June 2025 and an aggressive free tier. By the 2nd half of 2025 the releases piled up in one quarter — Cursor, Amp, [Augment](https://www.augmentcode.com/product/cli), Factory, Charm, and 12 open-source teams.

Teams that standardized on Gemini CLI in 2025 still have configs from last fall. December 2025 is when the standards people showed up: the Linux Foundation formed the [Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation) (AAIF), anchored by Anthropic's [Model Context Protocol](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation), OpenAI's AGENTS.md convention, and Block's [Goose](https://goose-docs.ai/blog/2026/04/07/goose-moves-to-aaif/) agent, with backing from Google, Microsoft, AWS, Cloudflare, and Bloomberg. The same month, Sourcegraph spun its agent out as the independent [Amp Inc.](https://sourcegraph.com/blog/why-sourcegraph-and-amp-are-becoming-independent-companies), Mistral entered with [Vibe](https://mistral.ai/news/devstral-2-vibe-cli/) and the Devstral 2 models, and [Codebuff](https://news.codebuff.com/p/codebuff-goes-open-source-beats-claude) open-sourced its multi-agent harness.

The 1st half of 2026 was messier. [Copilot CLI](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) hit GA in February. [Cline](https://www.marktechpost.com/2026/05/14/cline-releases-cline-sdk-an-open-source-agent-runtime-now-powering-its-cli-and-kanban-with-ide-extensions-being-migrated/) shipped CLI 2.0 and peeled off an open SDK. Kilo CLI reached 1.0. [Junie](https://blog.jetbrains.com/junie/2026/06/junie-coding-agent-out-of-beta/) went from [beta](https://blog.jetbrains.com/junie/2026/03/junie-cli-the-llm-agnostic-coding-agent-is-now-in-beta/) to GA in June. Google stole the headline at I/O in May: [Antigravity CLI](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/) launched, and Gemini CLI got a kill date — June 18 for free and consumer-plan users. [Grok Build](https://x.ai/news/grok-build-cli) landed late May. Moonshot replaced its earlier CLI with [Kimi Code](https://github.com/MoonshotAI/kimi-code) in June.

Models kept pace. [DeepSeek V4](https://api-docs.deepseek.com/news/news260424) under MIT in April. [GLM-5.2](https://venturebeat.com/technology/z-ais-open-weights-glm-5-2-beats-gpt-5-5-on-multiple-long-horizon-coding-benchmarks-for-1-6th-the-cost) and [Kimi K2.7 Code](https://www.marktechpost.com/2026/06/12/moonshot-ai-releases-kimi-k2-7-code-a-coding-model-reporting-21-8-on-kimi-code-bench-v2-over-k2-6/) in June, pulling open weights to within a few points of frontier terminal scores. The free tiers started dying around the same time: Qwen Code's hosted tier in April, [Amp Free](https://ampcode.com/news/amp-free) waitlisted, Gemini's consumer path gone by summer.

## Model labs

Lab agents come from the model vendors — harness and model in one box, usually on a subscription line item already there.

| Agent | Maintainer | Debut | Source | Models | Access | Known for |
|---|---|---|---|---|---|---|
| Claude Code | Anthropic | Feb 2025 | Closed | Claude only | Pro/Max plans or API | The category template; deepest orchestration features |
| Codex CLI | OpenAI | Apr 2025 | Apache-2.0, 95k stars | OpenAI Codex models | ChatGPT plans or API | Rust core, OS-level sandboxing, cloud handoff |
| Gemini CLI | Google | Jun 2025 | Apache-2.0, 106k stars | Gemini | API key / enterprise only after Jun 18, 2026 | Consumer access retired in favor of Antigravity CLI |
| Antigravity CLI | Google | May 2026 | Closed | Gemini 3.5 plus selected third-party models | Free public preview | Shares one harness with the Antigravity 2.0 desktop app |
| Grok Build | xAI | May 2026 | Closed | grok-build (256K context) | SuperGrok $30/mo, X Premium+ $40/mo, or API | Up to 8 parallel subagents in isolated git worktrees |
| Mistral Vibe | Mistral AI | Dec 2025 | Apache-2.0, 4.6k stars | Mistral (Medium 3.5, Devstral 2); open weights | Free CLI; Mistral plans/API | European option; remote async agents; ACP |
| Kimi Code CLI | Moonshot AI | Jun 2026 | MIT, 3k stars | Kimi K2.7 Code | Kimi plans or low-cost API | Built-in coder/explore/plan subagents; ACP |
| Qwen Code | Alibaba (Qwen) | Jul 2025 | Apache-2.0, 26k stars | Qwen3-Coder or any endpoint | BYOK; paid plans (free hosted tier ended Apr 2026) | Gemini CLI fork tuned for Qwen's open-weight coders |

[Claude Code](https://claude.com/pricing) still sets the vocabulary — agent teams, hooks, skills, the lot. Experimental agent teams (multiple sessions messaging each other) remain ahead of the pack. The trade is total model lock-in. As of June 2026, headless and SDK usage bill from a separate credit pool. [Terminal-Bench 2.0](https://www.tbench.ai/leaderboard/terminal-bench/2.0) in early July had Anthropic's newest models on top. The bundled pitch is a co-trained model plus harness, and the leaderboard backs it.

[Codex CLI](https://developers.openai.com/codex/changelog) is the strongest counterweight, and it had a busy spring. It's open source, OS-sandboxed, rides ChatGPT's subscriber base, and runs [GPT-5.5](https://blogs.nvidia.com/blog/openai-codex-gpt-5-5-ai-agents/) as its current frontier default. Through the 1st half of 2026 it picked up persistent Goals with token budgets, thread-level delegation to subagents, a plugin marketplace, browser use, encrypted remote execution, and a one-liner to import Claude Code configuration — switching costs are real enough that Codex had to automate them.

If you standardized on [Gemini CLI](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/) in 2025, June 18 was a bad day. Google grew it into one of the most-starred repos in the category, then pointed free and consumer-plan users at the closed-source [Antigravity CLI](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/) instead. Antigravity is a Go rewrite that shares its harness with the Antigravity desktop platform ([Gemini 3.5](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/) at the core), runs async multi-agent workflows, and is free in public preview, with non-Google models on the menu. Free tiers are not foundations.

[Grok Build](https://x.ai/news/grok-build-cli), [Kimi Code](https://github.com/MoonshotAI/kimi-code), and [Mistral Vibe](https://mistral.ai/news/devstral-2-vibe-cli/) showed up late — plan mode, subagents, headless CI already checked off. Grok Build shipped in beta with plan mode, worktree-isolated parallel subagents, and headless CI support on day 1. Kimi Code and Mistral Vibe both lean on unusually cheap, partly open models: Mistral's [Devstral 2](https://mistral.ai/news/devstral-2-vibe-cli/) posts a vendor-reported 72.2 percent on SWE-bench Verified from a 123B model, and Moonshot's K2.7 Code, released mid-June with open weights, undercuts frontier pricing by an order of magnitude. Both adopted ACP so any compatible editor can host them. Qwen Code is the fork case: a Gemini CLI derivative retuned for Qwen's open-weight coders, still alive after its free tier died because the tool is Apache-licensed and endpoint-agnostic.

## Platform and product CLIs

Platform vendors sell the agent as part of a development stack — distribution, integration, governance. Almost all of them are multi-model.

| Agent | Maintainer | Debut | Source | Models | Access | Known for |
|---|---|---|---|---|---|---|
| GitHub Copilot CLI | GitHub | Sep 2025, GA Feb 2026 | Closed | Anthropic, OpenAI, Google, open-weight Kimi K2.7 | Paid Copilot plans (from $10/mo) | Auto-delegating specialist agents; `&` hands work to a cloud agent |
| Cursor CLI | Anysphere | Aug 2025 | Closed | Cursor Composer + frontier models | Cursor plans | Same agent, rules, and MCP config as the Cursor IDE |
| Amp | Amp Inc. (ex-Sourcegraph) | 2025, spun out Dec 2025 | Closed | Curated frontier mix, no model picker | Pay-as-you-go; ad-funded free tier (waitlisted) | Deliberately opinionated; the ad-supported experiment |
| [Auggie CLI](https://www.augmentcode.com/product/cli) | Augment Code | 2025 | Closed | Frontier models via Augment | Augment plans | Context engine that indexes the whole repo before work starts |
| Droid | Factory AI | 2025 | Closed | Multi-model, BYOK supported | Factory plans | Topped the original Terminal-Bench; spans CLI, IDE, web, Slack, ticketing |
| Junie CLI | JetBrains | Beta Mar 2026, GA Jun 2026 | Closed | OpenAI, Anthropic, Google, xAI | JetBrains AI plans | ACP-native; agentic debugging; IDE and database integration |
| Qoder CLI | Alibaba | Platform Aug 2025; CLI 2026 | Closed | Alibaba Model Studio | Pay-as-you-go / coding plans | Quest mode for spec-driven autonomous tasks |
| CodeBuddy Code | Tencent | Sep 2025 | Closed | DeepSeek + Hunyuan | CodeBuddy plans | Skills, plan mode, ACP, sandboxed execution; 12k internal Tencent users |

[Copilot CLI](https://docs.github.com/copilot/concepts/agents/about-copilot-cli) wins on reach. [GA in February 2026](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/), $10/mo entry tier, GitHub's MCP server built in, plugins from repos, per-repo memory, specialist agents for explore/plan/review/build. Prefixing a prompt with `&` pushes the job to GitHub's cloud coding agent. For GitHub-centric teams it's the lazy default, and its model picker makes it one of the most vendor-neutral closed agents. On July 1 Copilot added Moonshot's open-weight [Kimi K2.7 Code](https://www.marktechpost.com/2026/06/12/moonshot-ai-releases-kimi-k2-7-code-a-coding-model-reporting-21-8-on-kimi-code-bench-v2-over-k2-6/) on Azure — the first open-weight model inside a major closed platform agent.

After Copilot, the bets split.

Cursor CLI is the consistency play — same agent, same rules, same MCP config in the IDE, the terminal, and CI. One AGENTS.md driving all three is the whole product.

[Amp](https://sourcegraph.com/blog/why-sourcegraph-and-amp-are-becoming-independent-companies) drops the model picker entirely and swaps models when its team decides the mix should change. The ad-funded [Amp Free](https://ampcode.com/news/amp-free) tier (sponsor-backed, no-training guarantee) is the strangest business model in the list; admission is closed for now.

[Auggie](https://www.augmentcode.com/product/cli) front-loads context: index the whole repo before the first prompt. Pays off on legacy monoliths, less on greenfield repos.

[Droid](https://factory.ai/news/terminal-bench) is the enterprise bundle — specialist agents, heavy parallelism, Slack and ticketing hooks. Factory posted the best [Terminal-Bench](https://www.tbench.ai/leaderboard/terminal-bench/2.0) numbers of any product harness in late 2025.

[Junie](https://blog.jetbrains.com/junie/2026/06/junie-coding-agent-out-of-beta/) drags JetBrains' debugger and database wiring to the terminal over ACP.

Qoder and CodeBuddy are the China stack plays — same 2026 feature checklist as everyone else, different distribution behind the firewall.

## Open-source harnesses

Bring-your-own-key agents are the largest group, and open-weight pricing changed what they cost to run. A decent harness plus GLM, DeepSeek, Qwen3-Coder, Devstral, or Kimi tokens gets you frontier capability for a fraction of the subscription price. The gap closed sharply in June, when Z.ai released [GLM-5.2](https://venturebeat.com/technology/z-ais-open-weights-glm-5-2-beats-gpt-5-5-on-multiple-long-horizon-coding-benchmarks-for-1-6th-the-cost) under MIT: a 744B mixture-of-experts model (about 40B active) with a 1 million-token context that beats GPT-5.5 on several long-horizon coding benchmarks at roughly 1/6 of the price ([Terminal-Bench 2.1 analysis](https://groundy.com/articles/glm-5-2-on-terminal-bench-2-1-strengths-gaps-and-how-to-route-real-coding-tasks/)). It also runs fully offline on high-memory hardware, needing around 245GB of memory at the most aggressive usable quantization.

| Agent | Maintainer | Debut | Source | Models | Known for |
|---|---|---|---|---|---|
| OpenCode | Anomaly (SST team) | 2025 | MIT, 182k stars | 75+ providers | Most-starred agent on GitHub; TUI, desktop, IDE; agents and skills |
| Crush | Charmbracelet | Jul 2025 | FSL-1.1-MIT (source-available), 26k stars | Multi-provider | The best-crafted TUI in the category; LSP context; MCP |
| Goose | AAIF (ex-Block) | Jan 2025 | Apache-2.0, 51k stars | Any, incl. local | MCP-native, local-first, foundation-governed |
| Aider | Aider-AI | Mid-2023 | Apache-2.0, 47k stars | 100+ via LiteLLM | Git-native pair programming; repo map; pace has slowed |
| Cline CLI | Cline | Late 2025; 2.0 Feb 2026 | Apache-2.0, 64k stars | Any provider | Open @cline/sdk runtime; parallel agents; headless CI |
| Kilo CLI | Kilo | 1.0 Feb 2026 | Open source, 26k stars | 500+ models | Architect/Code/Debug/Ask/Orchestrator modes; Memory Bank |
| Continue CLI (cn) | Continue | Sep 2025 | Apache-2.0, 35k stars | Any provider | Headless PR checks and CI agents; pace has slowed |
| OpenHands CLI | OpenHands | CLI May 2026; project 2024 | Open source, 79k stars | Any provider | Agent SDK with event-sourced replay; CLI as stable thin client |
| DeepSeek-Reasonix | esengine | Apr 2026 | MIT, 26k stars | DeepSeek V4 (default) or any endpoint | Cache-first design; extreme budget efficiency |
| Every Code | JustEvery | Aug 2025 | Apache-2.0, 3.8k stars | OpenAI, Anthropic, Google, any | Codex fork orchestrating several vendors' models at once |
| ForgeCode | Antinomy | Dec 2024 | Apache-2.0, 7.4k stars | 300+ models | Rust, shell-native, semantic codebase search |
| Codebuff | Codebuff AI | 2024; open-sourced late 2025 | Apache-2.0, 7.1k stars | Any via OpenRouter | Explicit agent roles: finder, planner, editor, reviewer |
| Kode | shareAI-lab | Jul 2025 | Apache-2.0, 5.2k stars | Multi-model collaboration | @ask a specific model mid-task |
| Nanocoder | Nano Collective | Jul 2025 | Open source, 2.2k stars | Local-first + any endpoint | Community-owned, no telemetry, no company behind it |

[OpenCode](https://opencode.ai/docs/) has the most GitHub stars in the category at 182k — ahead of Gemini CLI and Codex — with 75+ providers, a client-server architecture, and a polished TUI plus desktop and IDE surfaces. It also has the messiest fork story: the original author joined Charm in mid-2025, where that lineage became Crush (prettier TUI, source-available FSL license), while the SST team's OpenCode kept growing. Two healthy projects out of one messy split.

[DeepSeek-Reasonix](https://github.com/esengine/deepseek-reasonix) is the fastest riser: 26k stars in roughly 10 weeks from one static Go binary. The design treats inference cost as an engineering problem. Sessions keep DeepSeek's byte-stable prefix cache hot — stable env summaries at startup, stale tool output pruned before compaction, planner and executor on separate cache-stable threads.

One reported day: 435M input tokens, 99.82% cache hits, about $12. Uncached estimate: $61. Any OpenAI-compatible endpoint, MCP over stdio and HTTP, checkpoints, rewind, and chat-ops bridges to Feishu, Lark, and WeChat. [DeepSeek V4](https://api-docs.deepseek.com/news/news260424) landing the same April under MIT did not hurt.

[Goose](https://goose-docs.ai/blog/2026/04/07/goose-moves-to-aaif/) took a different route to durability: Block donated it to the [Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation), making it the only major agent under neutral foundation governance, alongside the [MCP](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation) and AGENTS.md standards themselves. [Cline](https://www.marktechpost.com/2026/05/14/cline-releases-cline-sdk-an-open-source-agent-runtime-now-powering-its-cli-and-kanban-with-ide-extensions-being-migrated/) matters beyond its user base because of its Apache-licensed SDK, extracted in May 2026, which turned a popular product into infrastructure others can build on; GitHub ([Copilot SDK](https://github.blog/changelog/2026-06-02-copilot-sdk-is-now-generally-available/)), Anthropic (Agent SDK), and [OpenHands](https://docs.openhands.dev/sdk) (a research-grade Python SDK with deterministic replay) made the same move. Kilo and Continue extend IDE-extension franchises into the terminal — Kilo with orchestration modes and 500+ models, Continue with a CI-first angle — though Continue's 2026 commit cadence puts it on the watch list.

[Aider](https://github.com/Aider-AI/aider) invented half the git discipline everyone else copied, and its polyglot benchmark shaped model evaluation for 2 years. It stayed a pair-programming tool while the market went agentic, though, and releases have slowed to a trickle. Still strong at atomic commits; the category moved elsewhere.

The long tail is larger than the headline tools suggest. Every Code out-features its own upstream, orchestrating OpenAI, Anthropic, and Google models on a Codex base. [Codebuff](https://news.codebuff.com/p/codebuff-goes-open-source-beats-claude) decomposes work into explicit finder, planner, editor, and reviewer agents, and claims 61 percent versus 53 for Claude Code on its own 175-task evaluation. Kode lets a session consult a specific model by name mid-task. Nanocoder is for people who want collectively owned, telemetry-free, local-first — no company behind it.

## Minimal cores and pioneers

| Agent | Maintainer | Debut | Source | Known for |
|---|---|---|---|---|
| Pi | Earendil (Mario Zechner) | Aug 2025 | MIT, 67k stars | 4 tools, sub-1,000-token system prompt, TypeScript extension SDK |
| oh-my-pi | can1357 | Dec 2025 | MIT, 16k stars | Maximalist Pi distribution; the largest feature surface in the category |
| mini-SWE-agent | SWE-agent team | Jun 2025 | MIT, 5.6k stars | About 100 lines of Python, bash-only; the research control group |
| gptme | gptme project | Mar 2023 | MIT, 4.4k stars | Oldest tool here; persistent autonomous agents with git-backed memory |
| Open Interpreter | Open Interpreter | Jul 2023 | Open source, 64k stars | Pioneered LLM code execution; broader computer control; quiet in 2026 |

[Pi](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/) is the backlash. Mario Zechner argues a modern model needs 4 tools (read, write, edit, bash), a system prompt under 1,000 tokens, and nothing else in core — MCP included belongs in a TypeScript extension SDK. Personal project to 67k stars in under a year, which says the audience for harness bloat had thinned.

[oh-my-pi](https://github.com/can1357/oh-my-pi) — [Omp](https://omp.sh/) for short — is the opposite bet: a batteries-included Pi distribution that kept adding features until it had the widest feature set in the comparison below. Same community, opposite directions. Pi bets on subtraction, Omp bets on accumulation, and both arguments still have an audience.

[mini-SWE-agent](https://github.com/SWE-agent/mini-swe-agent) is the control group: about 100 lines of Python, bash only, and strong frontier models still clear a large share of SWE-bench. Hard to justify a 50-feature harness without beating that. [gptme](https://github.com/gptme/gptme) and [Open Interpreter](https://github.com/OpenInterpreter/open-interpreter) round out the elders — gptme still in active development and focused on persistent, self-improving agents; Open Interpreter historically important and visibly slowing.

## Feature by feature

By 2025 every serious agent had the same skeleton: edit-run-test loop, project instructions file, MCP, plan mode, permission prompts, headless mode. None of that separates anyone anymore.

What marketing pages still hide is the rest. Five harnesses get the full treatment — Claude Code, Codex CLI, OpenCode, [Omp](https://omp.sh/), plus Copilot CLI as the deployed-at-scale platform pick. Everyone else appears in the notes under each table.

### Context and memory

| | Claude Code | Codex CLI | Copilot CLI | OpenCode | Omp |
|---|---|---|---|---|---|
| Project instructions | CLAUDE.md | AGENTS.md | AGENTS.md + instructions | AGENTS.md | AGENTS.md, plus reads `.claude`, `.cursor`, `.codex`, `.gemini`, `.cline` configs directly |
| Learned memory across sessions | Yes, persistent memory files | Partial: persistent Goals | Yes, Copilot Memory per repo | No, manual AGENTS.md | Yes, Hindsight: retain/recall/reflect over a project SQLite bank |
| Auto-compaction | Yes | Yes | Yes, automatic at 95% plus /compact | Yes | Yes, plus bitmap-frame history compression |
| Checkpoints and rewind | Yes, /rewind | No | No | Undo/redo | Yes, checkpoint/rewind with context pruning |

A year ago project memory meant a markdown file someone on the team updated by hand. Now 3 of the 5 leaders learn on their own: Claude Code accumulates memory files across sessions, Copilot builds a per-repository understanding, and [Omp](https://omp.sh/) writes facts mid-run and synthesizes them later on request. Omp also reads the rules, skills, and MCP registrations other agents leave in a repo. Switching over barely touches config. Elsewhere, Kilo's Memory Bank stores agent state in structured markdown inside the repo, and gptme goes furthest of all with git-backed memory for agents that are meant to run for months.

### Editing and code intelligence

| | Claude Code | Codex CLI | Copilot CLI | OpenCode | Omp |
|---|---|---|---|---|---|
| Anchored or AST-aware edits | No | No | No | No | Yes: hash-anchored patches (~61% fewer output tokens, project-reported) and ast-grep rewrites across 50+ grammars |
| LSP integration | Yes, diagnostics and navigation | No | No | Yes, built-in | Yes, deep: diagnostics, references, code actions, renames that propagate through re-exports |
| Debugger control | No | No | No | No | Yes, DAP: lldb, dlv, debugpy; breakpoints, stepping, variable inspection |
| Beyond-grep code search | Agentic grep | Agentic grep | Grep + GitHub code search | Grep + LSP symbols | In-process ripgrep, tree-sitter structural summaries, fuzzy match |
| Formatter and linter awareness | Via hooks | No | Not documented | Yes, built-in formatter support | Yes, LSP diagnostics and linters feed decisions |

[Omp](https://omp.sh/) leads here by a lot. Hash-anchored editing is aimed at the refactor failure everyone hits — the patch lands on the wrong line because whitespace moved. AST rewrites with preview-then-accept, plus a debugger the agent can drive. No lab agent ships that as of July 2026. Heavier setup than Claude Code; you still pick the model. This is where to look when patches keep landing on the wrong line. The rest of these tools approach code intelligence differently: [Auggie](https://www.augmentcode.com/product/cli)'s context engine builds a semantic index before work begins, Aider's repo map compresses project structure into the prompt, ForgeCode does embedding-based search after a sync step, and Junie leans on the JetBrains indexer — probably the deepest static analysis any agent gets, just not an open one.

### Orchestration

| | Claude Code | Codex CLI | Copilot CLI | OpenCode | Omp |
|---|---|---|---|---|---|
| Subagents | Yes, custom agent definitions | Yes, thread-level delegation (Jun 2026) | Yes, auto-delegating specialists | Yes, custom agents | Yes, fan-out with schema-validated JSON returns |
| Parallel work and isolation | Yes, worktrees; agent teams (experimental) | Cloud tasks; per-thread token budgets | Via cloud agent | Parallel sessions | Yes, filesystem-clone isolation (APFS/btrfs/overlayfs) |
| Agents talking to each other | Yes, teams messaging (experimental) | No | No | No | Yes, IRC-style channel between live agents |
| Second-model oversight | No | No | No | No | Yes, Advisor: a separate model reviews every turn and injects notes |
| Background processes | Yes | Partial | Via cloud | No | Yes, job control |
| Cloud handoff | Yes, web and remote sessions | Yes, Codex cloud; encrypted remote execution | Yes, `&` prefix | Self-hosted server mode | No; /collab shares a live session instead |
| Scheduled and recurring runs | Yes, scheduled cloud agents | Timed reminders (Jun 2026) | Via GitHub Actions | Via CI or server mode | No |

Claude Code and [Omp](https://omp.sh/) let agents coordinate as peers — [agent teams](https://claude.com/pricing) on one side, an in-process chat channel plus a standing Advisor model on the other. Codex and Copilot push parallelism to the cloud — less load on the laptop, more on the ops queue. [Grok Build](https://x.ai/news/grok-build-cli) isn't in the table but shipped worktree-isolated parallel subagents on day 1 (up to 8). [Codebuff](https://news.codebuff.com/p/codebuff-goes-open-source-beats-claude) hardcodes roles. [Mistral Vibe](https://mistral.ai/news/devstral-2-vibe-cli/) keeps remote agents running after the terminal closes. [Amp](https://ampcode.com/news/amp-free)'s oracle — a stronger model for hard steps — is the nearest cousin to Omp's Advisor. Scheduling showed up late: recurring cloud agents on Claude Code, timed reminders on [Codex](https://developers.openai.com/codex/changelog) in June, CI everywhere else.

### Extensibility

| | Claude Code | Codex CLI | Copilot CLI | OpenCode | Omp |
|---|---|---|---|---|---|
| MCP client | Yes | Yes | Yes, GitHub MCP built in | Yes | Yes |
| Plugin or extension API | Yes, plugins and marketplaces | Yes, plugin marketplace (2026) | Yes, /plugin install from repos | Yes, JS/TS plugins | Yes, TypeScript extensions with hot reload |
| Skills | Yes, originated the format | No | No | Yes | Yes, with input/output schemas for chaining |
| Lifecycle hooks | Yes, originated the format | Limited | No | Via plugin events | Yes, plus mid-stream rules that can abort and correct generation live |
| Custom slash commands | Yes | Yes, custom prompts | Not documented | Yes | Yes, extensions register commands and hotkeys |
| Acts as a server/SDK for other apps | Yes, Agent SDK | Yes, MCP server mode and SDK | Yes, Copilot SDK (GA Jun 2026) | Yes, server + SDK | Yes, Node SDK and NDJSON RPC mode |

[MCP](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation) for external tools, plugins for behavior, skills for instructions. That stack is the default now. Claude Code invented two of the three formats. [Omp](https://omp.sh/)'s stream rules are the oddball: a regex on the token stream aborts mid-sentence, injects a correction, resumes. Project rules without stuffing every prompt. [Goose](https://goose-docs.ai/blog/2026/04/07/goose-moves-to-aaif/) is MCP-purist. [Pi](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/) ships no MCP in core and hands everything to a TypeScript extension SDK; 67k stars say that resonated.

### Git and review workflows

| | Claude Code | Codex CLI | Copilot CLI | OpenCode | Omp |
|---|---|---|---|---|---|
| Commit assistance | Yes, git-aware commits and PRs | Yes; cloud tasks commit and open PRs | Yes, PR-native via the cloud agent | Git-backed undo/redo; commits on request | `omp commit` splits unrelated changes into dependency-ordered commits |
| Built-in code review | Yes, /code-review with effort levels | Yes, /review | Yes, dedicated review agent | Via custom agents | Yes, /review: parallel reviewers, P0-P3 ranking, ship verdict |
| PR and issue integration | Via gh and GitHub Actions | GitHub action and Codex cloud | Native to the platform | GitHub and GitLab integrations | PRs and issues addressable as `pr://` and `issue://` paths; watches Actions runs live |
| Merge-conflict tooling | Agentic only | Agentic only | Agentic only | Agentic only | Declarative: write `@ours`, `@theirs`, or `@base` to `conflict://N` |

Git used to be an afterthought. [Aider](https://github.com/Aider-AI/aider) fixed that in 2023 with one atomic commit per AI change; every serious tool followed. The 2026 wrinkles look different. [Copilot CLI](https://docs.github.com/copilot/concepts/agents/about-copilot-cli) owns the platform — review, PRs, issues are native objects. [Omp](https://omp.sh/) treats git as another tool surface: `omp commit` splits unrelated changes into ordered commits, rejects dependency cycles before writing, and turns merge conflicts into files resolved with `@ours` / `@theirs` / `@base` instead of fragile text surgery. Built-in review is baseline now: 4 of the 5 comparison tools ship it; Continue built its CI identity around the same idea.

### Safety and trust

| | Claude Code | Codex CLI | Copilot CLI | OpenCode | Omp |
|---|---|---|---|---|---|
| Granular permissions | Yes, modes and allowlists | Yes, approval and sandbox policies | Yes, per-tool approval | Yes | Yes, preview-then-accept on destructive operations |
| OS-level sandbox | Yes | Yes, Seatbelt/Landlock | Yes, local and cloud sandboxes | No, permissions only | Filesystem-clone workspace isolation |
| Open-source harness | No | Yes, Apache-2.0 | No | Yes, MIT | Yes, MIT |
| Local or self-hosted models | No | Yes, --oss | No | Yes | Yes: Ollama, LM Studio, llama.cpp, vLLM |

There is no clean option. [Codex CLI](https://developers.openai.com/codex/changelog) is the only lab agent that's open source, OS-sandboxed, and local-model-capable at once. Claude Code and Copilot sandbox well but stay closed and cloud-bound. [OpenCode](https://opencode.ai/docs/) and [Omp](https://omp.sh/) are fully open and run local models, but permissions instead of kernel isolation. CodeBuddy sandboxes execution, [OpenHands](https://docs.openhands.dev/sdk) containerizes everything, [Amp Free](https://ampcode.com/news/amp-free) promises no training on your code, OpenCode says it stores no code server-side. Enterprises weight different rows than individual developers — which is half the reason platform CLIs exist.

### Automation and surfaces

| | Claude Code | Codex CLI | Copilot CLI | OpenCode | Omp |
|---|---|---|---|---|---|
| Headless / CI | Yes, -p | Yes, exec | Yes, -p | Yes, server mode | Yes, -p and RPC |
| IDE integration | VS Code, JetBrains extensions | VS Code extension | Copilot ecosystem | IDE extensions | ACP (Zed and other ACP editors) |
| Surfaces beyond terminal and IDE | Desktop, web, mobile | ChatGPT web and mobile | github.com, mobile app | Desktop app | No |

Labs and platforms win on surfaces — desktop, web, mobile, handoff from phone to laptop. Open tools bet on protocols instead. ACP ([Junie](https://blog.jetbrains.com/junie/2026/06/junie-coding-agent-out-of-beta/), [Kimi Code](https://github.com/MoonshotAI/kimi-code), [Mistral Vibe](https://mistral.ai/news/devstral-2-vibe-cli/), CodeBuddy, [Omp](https://omp.sh/)) lets one agent serve any compatible editor. [gptme](https://github.com/gptme/gptme) runs persistent background agents. Continue's `cn` was CI-first before that was trendy. Omp's `/collab` shares a live session over a link with client-side encryption. Strange feature, useful in practice.

### Web, media, and input

| | Claude Code | Codex CLI | Copilot CLI | OpenCode | Omp |
|---|---|---|---|---|---|
| Web search and fetch | Yes, built in | Yes, incl. a server-approved indexed mode | Via MCP | Fetch tool | Chains 18 search providers with site-aware extraction |
| Browser control | Via MCP | Yes, built-in browser use (Apr 2026) | Via MCP | Via MCP | Built-in headless Chromium; the same API drives Electron apps |
| Image input | Yes | Yes | Not documented | Yes, drag-and-drop | Yes, vision analysis via `inspect_image` |
| Rich-document reading | Images, PDFs, notebooks | Images | Not documented | Images | Files, directories, archives, SQLite, PDFs, notebooks, and URLs through one `read` tool |
| Voice and media generation | No | Yes, realtime speech controls | No | No | Image generation and TTS via provider models |

An agent that can't fetch docs, check an issue, or poke a browser hands the work back to a human. [Codex](https://developers.openai.com/codex/changelog) made browser control a first-class tool in April. [Omp](https://omp.sh/) chains 18 search providers and runs headless Chromium that can drive a local Electron app. PDFs, SQLite fixtures, notebooks — minor on a checklist, painful when the alternative is copy-pasting spec pages into the prompt. Aider had voice input years ago; Codex takes speech now; [Open Interpreter](https://github.com/OpenInterpreter/open-interpreter) still means "control the whole machine."

### Cost engineering

| | Claude Code | Codex CLI | Copilot CLI | OpenCode | Omp |
|---|---|---|---|---|---|
| Prompt-cache strategy | Automatic (Anthropic API) | Automatic | Managed by plan | Provider-dependent | Provider-dependent; token budgets counted in real time |
| Cheap-model routing | Per-subagent model choice | Per-thread budgets and profiles | Partial, per-agent models | Per-agent model choice | Role-based: default/smol/slow/plan/commit, with fallback chains and per-path pinning |
| Usage visibility | Yes | Yes, budget tracking views | Plan meter | Yes, per session | Yes, live token counting |

Same refactor prompt, heavy day, [Claude Code](https://claude.com/pricing) vs [Reasonix](https://github.com/esengine/deepseek-reasonix): credit meter on one side, 99.8% cache hit rate and a $12 bill on the other. That gap is why cost engineering became a feature.

Most harnesses treat provider-side caching as luck. Reasonix treats it as design — byte-stable context so [DeepSeek](https://api-docs.deepseek.com/news/news260424)'s prefix cache keeps hitting, 99.82% on heavy days per their reports. Automations too marginal for Claude tokens start to pencil out. [Omp](https://omp.sh/) routes sub-tasks to cheap models by role and rotates credentials. Subscription agents hide the bill until headless usage gets its own meter, which Claude Code added in June.

### Feature leaders

| Area | Leader | Also strong |
|---|---|---|
| Editing precision | Omp (hash-anchored, AST) | Aider (diff formats) |
| Git workflows | Omp (commit splitting, conflict tooling), Aider (atomic commits) | Copilot CLI (PR-native) |
| Code intelligence | Omp, [Auggie](https://www.augmentcode.com/product/cli), Junie | OpenCode, Aider |
| Debugging | Omp (DAP) | Junie (agentic debugging) |
| Orchestration | Claude Code (teams), Omp (IRC + Advisor) | Grok Build, Codebuff, Droid |
| Cloud handoff | Copilot CLI, Codex, Claude Code | Mistral Vibe (remote agents) |
| Memory | Copilot CLI, Claude Code, Omp | Kilo (Memory Bank), gptme |
| Extensibility | Claude Code (skills/hooks), Pi/Omp (TS extensions) | Goose (MCP-native), OpenCode |
| Sandboxing | Codex, Copilot CLI | CodeBuddy, OpenHands (containers) |
| Cost engineering | DeepSeek-Reasonix (cache-first) | Omp (role routing), Amp Free |
| Provider breadth | OpenCode (75+), Kilo (500+ models) | ForgeCode (300+), Omp (40+ plus coding-plan logins) |
| Collaboration | Omp (/collab), Amp (threads) | OpenCode (share links) |
| Web, browser, and media | Omp (Chromium, 18-provider search, image gen, TTS) | Codex (browser use, voice), gptme |

[Omp](https://omp.sh/) has the widest feature set in the comparison. Tiny bus factor, and co-trained models still win on gnarly tasks, so don't bet the company on it. But when [Claude Code](https://claude.com/pricing) ships something new, check Omp first; the community fork often had it earlier.

## Money, benchmarks, and trust

The pricing story split in the 1st half of 2026. Lab agents bundle inference into subscriptions — usually the cheapest frontier access, with lock-in attached. BYOK harnesses trade convenience for freedom and can arbitrage open-weight pricing; [Reasonix](https://github.com/esengine/deepseek-reasonix) built the whole tool around that. Two shifts mattered: free tiers retreated industry-wide (Qwen in April, [Gemini CLI](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)'s consumer access in June, [Amp Free](https://ampcode.com/news/amp-free) waitlisted), and autonomous usage started being metered separately from interactive usage, with Anthropic's June 15 split of [Agent SDK credits](https://claude.com/pricing) the clearest signal that headless fleets are becoming their own billable product.

[Terminal-Bench 2.x](https://www.tbench.ai/leaderboard/terminal-bench/2.0) is the yardstick people actually cite. Early-July snapshots: frontier closed models in the mid-to-high 80s, Anthropic on top, GPT-5.5 and Sakana behind. Open weights moved faster — [GLM-5.2](https://groundy.com/articles/glm-5-2-on-terminal-bench-2-1-strengths-gaps-and-how-to-route-real-coding-tasks/) at 81.0 on Terminal-Bench 2.1 vs Claude Opus 4.8's 85.0 (the prior GLM release was 63.5). Roughly a 20-point gap shrunk to 4. Leaderboards churn every month; [mini-SWE-agent](https://github.com/SWE-agent/mini-swe-agent) keeps proving most of the score is the model anyway. [Factory](https://factory.ai/news/terminal-bench), [Codebuff](https://news.codebuff.com/p/codebuff-goes-open-source-beats-claude), and Mistral publish their own numbers — treat those as marketing until a third party reruns them.

Maintenance risk gets ignored. Aider, Open Interpreter, and Continue all show slowed cadence. Google retired a 106k-star tool's consumer access with a month's notice. Leaders change; on anything load-bearing the exit path weighs as much as the feature list. [MCP](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation), AGENTS.md, and ACP under [AAIF](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation) governance turn that migration into an afternoon, not a quarter.

## Results

| Use case | Strongest options | Why |
|---|---|---|
| Already paying for an AI subscription | Claude Code, Codex CLI, Copilot CLI, Antigravity CLI, Grok Build | Bundled inference is the cheapest frontier access; all 5 are mature |
| Maximum capability, cost secondary | Claude Code; Codex CLI close behind | Co-tuned model and harness; top benchmark cluster; deepest orchestration |
| Most advanced harness features | [Omp](https://omp.sh/) | Anchored edits, debugger, advisor model, durable memory; see feature tables |
| Open-source, any model | OpenCode; Cline and Goose as alternates | 182k stars, 75+ providers, MIT; Cline adds an SDK, Goose adds governance |
| Tightest budget on hosted models | DeepSeek-Reasonix; any harness + open weights | Cache-first design; project-reported ~5x cost reduction on heavy days |
| GitHub-centric teams | Copilot CLI | GA, $10 entry, cloud delegation, repo memory, native review |
| Enterprise governance and scale | Droid, Copilot CLI, Amp, [Auggie](https://www.augmentcode.com/product/cli) | Compliance, observability, multi-surface consistency |
| JetBrains shops | Junie CLI | GA June 2026, ACP-native, agentic debugging |
| Local models and privacy | Goose, Nanocoder, gptme, OpenCode | Local-first defaults, no telemetry; GLM-5.2 and DeepSeek V4 made local near-frontier |
| Hackability and understanding | Pi, mini-SWE-agent | Minimal auditable cores; extension SDK; research-grade simplicity |
| CI and automation pipelines | Continue cn, Cline SDK, Claude Agent SDK, Copilot SDK | Purpose-built headless modes; note Continue's pace and Claude's SDK metering |
| China-based teams | Qwen Code, Kimi Code, Qoder, CodeBuddy, Reasonix | Local models, local compliance, domestic platform integration |

## Where to start

No single one wins. [Claude Code](https://claude.com/pricing), [Codex CLI](https://developers.openai.com/codex/changelog), and [Omp](https://omp.sh/) are close enough in result quality that ranking them as 1-2-3 misses the point. All 3 can read a serious repo, form a plan, edit across files, run checks, recover from failures, and land production-shaped patches. The bigger swing usually comes from task clarity, repository hygiene, permissions, and whether the harness exposes the right tool at the right moment.

Claude Code has the cleanest feel. The planning loop is natural, the model/harness pairing is strong, and ambiguous interactive work still lands well there. The workflow tends to read like the category's default: ask for the change, watch it inspect the repo, let it iterate through tests, read a coherent summary. The tax is lock-in. Claude-only, closed harness, and a billing shape that gets less friendly once interactive work turns into unattended churn.

Codex sits in the same quality band with a different set of strengths. The open harness matters, and the OS sandbox matters even more once real shell access is allowed in messy repos. Browser use, budgets, plugins, remote execution, and Claude-config import give Codex a sharper operational story than "another frontier agent." It is strong for verification passes, test repair, browser-backed checks, risky command execution, and independent review when Claude Code sounds too certain.

[Omp](https://omp.sh/) is the one most likely to outperform the lab agents for reasons outside raw model quality. Its extra features change the shape of the work. Hash-anchored edits and AST rewrites reduce bad patches. Debugger control replaces guesses with runtime facts. Role-based routing can spend cheap tokens on search and reserve stronger models for planning or review. Rich file reading and browser automation remove a lot of manual context ferrying. When those features line up with the job, Omp can produce a better result, and the patches genuinely land cleaner.

Omp has more harness leverage and less institutional margin behind it. Claude Code and Codex have deeper backing and clearer long-term support. Omp's feature surface makes experienced engineers faster, but harder to standardize around as a single foundation. Different risk, not a worse tool.

[OpenCode](https://opencode.ai/docs/) is the model-agnostic base. It does not win the same contest — but it tries harder than anyone to be good with every model, because the company's revenue depends on staying neutral. Bare Pi takes the opposite route to the same goal: strip the harness down to almost nothing — four tools, near-zero bloat — and let the model carry it. Pi is model-agnostic by subtraction; OpenCode is model-agnostic by maintenance, wiring 75+ providers, a polished TUI, desktop and IDE surfaces, and a real product surface into a portable MIT-licensed base, with a clean path to [GLM-5.2](https://venturebeat.com/technology/z-ais-open-weights-glm-5-2-beats-gpt-5-5-on-multiple-long-horizon-coding-benchmarks-for-1-6th-the-cost), [DeepSeek V4](https://api-docs.deepseek.com/news/news260424), [Kimi K2.7 Code](https://www.marktechpost.com/2026/06/12/moonshot-ai-releases-kimi-k2-7-code-a-coding-model-reporting-21-8-on-kimi-code-bench-v2-over-k2-6/), Qwen, Devstral, and whatever cheap strong coder lands next. For batch work, privacy-sensitive jobs, and provider independence, boring portability beats another closed subscription.

Platform agents enter when the platform already owns the workflow. GitHub-heavy orgs: [Copilot CLI](https://docs.github.com/copilot/concepts/agents/about-copilot-cli) because PRs, reviews, repo memory, cloud delegation, and model selection already live there. JetBrains shops: [Junie CLI](https://blog.jetbrains.com/junie/2026/06/junie-coding-agent-out-of-beta/) because the indexer and debugger are part of the value. [Droid](https://factory.ai/news/terminal-bench), [Amp](https://sourcegraph.com/blog/why-sourcegraph-and-amp-are-becoming-independent-companies), and [Auggie](https://www.augmentcode.com/product/cli) show up when procurement asks about governance, compliance, observability, and rollout. They are valid constraints, which is a different question from being the better general-purpose agent.

Stack in practice: Claude Code, Codex, and [Omp](https://omp.sh/) as peer tools for serious work; OpenCode as the portable base for open-model and BYOK usage. Keep [AGENTS.md](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation), [MCP](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation) server lists, task commands, review rules, and project conventions in the repo. The config outlasts the branding. Tool churn becomes survivable when several strong agents can operate from the same context.

---

### Method and sources

The tool list was fixed on July 3, 2026; each repo was checked for active maintenance. Star counts, licenses, and dates from the GitHub API (July 3–4, rounded). Feature claims for the 5 comparison tools checked against docs and changelogs in early July; vendor-reported benchmark numbers are labeled as such in the prose.

Primary sources:

- [Grok Build announcement (xAI)](https://x.ai/news/grok-build-cli)
- [Gemini CLI to Antigravity CLI transition (Google)](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- [Copilot CLI general availability (GitHub)](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) and [Copilot CLI documentation](https://docs.github.com/copilot/concepts/agents/about-copilot-cli)
- [Copilot SDK GA (GitHub)](https://github.blog/changelog/2026-06-02-copilot-sdk-is-now-generally-available/)
- [Agentic AI Foundation formation (Linux Foundation)](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)
- [MCP donation (Anthropic)](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation) and [Goose moves to AAIF](https://goose-docs.ai/blog/2026/04/07/goose-moves-to-aaif/)
- [Devstral 2 and Mistral Vibe (Mistral)](https://mistral.ai/news/devstral-2-vibe-cli/)
- [Junie CLI beta](https://blog.jetbrains.com/junie/2026/03/junie-cli-the-llm-agnostic-coding-agent-is-now-in-beta/) and [Junie GA (JetBrains)](https://blog.jetbrains.com/junie/2026/06/junie-coding-agent-out-of-beta/)
- [Amp and Sourcegraph separation](https://sourcegraph.com/blog/why-sourcegraph-and-amp-are-becoming-independent-companies) and [Amp Free](https://ampcode.com/news/amp-free)
- [Droid Terminal-Bench results (Factory)](https://factory.ai/news/terminal-bench)
- [GPT-5.3-Codex (OpenAI)](https://openai.com/index/introducing-gpt-5-3-codex/) and [Codex changelog](https://developers.openai.com/codex/changelog)
- [Terminal-Bench 2.0 leaderboard](https://www.tbench.ai/leaderboard/terminal-bench/2.0)
- [Kimi Code CLI (Moonshot)](https://github.com/MoonshotAI/kimi-code)
- [Pi design notes (Mario Zechner)](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/), [oh-my-pi (can1357)](https://github.com/can1357/oh-my-pi), and [Omp](https://omp.sh/)
- [DeepSeek-Reasonix (esengine)](https://github.com/esengine/deepseek-reasonix) and [DeepSeek V4 preview (DeepSeek)](https://api-docs.deepseek.com/news/news260424)
- [GLM-5.2 coverage (VentureBeat)](https://venturebeat.com/technology/z-ais-open-weights-glm-5-2-beats-gpt-5-5-on-multiple-long-horizon-coding-benchmarks-for-1-6th-the-cost) and [GLM-5.2 on Terminal-Bench 2.1](https://groundy.com/articles/glm-5-2-on-terminal-bench-2-1-strengths-gaps-and-how-to-route-real-coding-tasks/)
- [Kimi K2.7 Code release (MarkTechPost)](https://www.marktechpost.com/2026/06/12/moonshot-ai-releases-kimi-k2-7-code-a-coding-model-reporting-21-8-on-kimi-code-bench-v2-over-k2-6/)
- [Gemini 3.5 announcement (Google)](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/)
- [GPT-5.5 powering Codex (NVIDIA)](https://blogs.nvidia.com/blog/openai-codex-gpt-5-5-ai-agents/)
- [Auggie CLI (Augment Code)](https://www.augmentcode.com/product/cli) and [auggie on GitHub](https://github.com/augmentcode/auggie)
- [OpenCode documentation](https://opencode.ai/docs/)
- [Codebuff open-source announcement](https://news.codebuff.com/p/codebuff-goes-open-source-beats-claude)
- [Cline SDK release](https://www.marktechpost.com/2026/05/14/cline-releases-cline-sdk-an-open-source-agent-runtime-now-powering-its-cli-and-kanban-with-ide-extensions-being-migrated/)
- [OpenHands Agent SDK](https://docs.openhands.dev/sdk)
- [Claude Code pricing](https://claude.com/pricing)
