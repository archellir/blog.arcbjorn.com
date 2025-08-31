---
title: "Debugging Smart Contracts"
published_at: "2025-08-31 12:00"
snippet: "Notes from building CrossPay"
tags: ["solidity", "debugging", "blockchain"]
---

Seems like it's less about clever code and more about disciplined problem‑solving under uncertainty. Here's some debugging notes when building [CrossPay](https://github.com/arcbjorn/crosspay) during [Aleph Hackathon](https://dorahacks.io/hackathon/aleph-hackathon/detail).

## Complexity

came from three directions:

- Privacy: encrypted amounts and selective disclosure (FHE) that don’t fit neatly into standard EVM execution.
- Consensus: validator approvals with threshold signatures and BFT assumptions.
- Economics: risk‑stratified vaults, slashing, and liquidation with strict accounting guarantees.

The key was to preserve core invariants while taming integration edges (batch flows, cross‑chain messages, UI expectations).

## Core Principles

- Safety over convenience: prefer strict checks, adjust tests and integrations to match production behavior.
- Trust boundaries first: define who can do what, from which surfaces, and why it’s safe.
- Fewer footguns: avoid patterns like relying on transaction origin; prefer explicit, auditable entrypoints.
- Deterministic behavior: reverts and error messages must be predictable; tests assert against intended production semantics.
- Gated novelty: integrate bleeding‑edge features (FHE, BLS) behind safe abstractions and environment flags.

## A Bit of Theory

- Cryptographic vs economic security:
    - Cryptographic: signature verification, encrypted arithmetic (FHE), proofs.
    - Economic: incentive alignment, slashing, waterfall allocation; these protect when cryptography and operations are sound but actors misbehave.
- BFT consensus basics: with n validators and tolerating f faults, you need at least 2f+1 signatures for safety—hence “two‑thirds majority” thresholds.
- FHE in EVM: FHE is compute‑heavy; on-chain synchronous decryption is unsuitable. Treat encryption/decryption as asynchronous, with homomorphic ops where viable and client‑side or gateway support.
- Invariants matter more than tests:
    - Accounting must balance.
    - Signature provenance must be unambiguous.
    - Liquidation must never underflow balances.
    - Pause/permissions must fence off critical surfaces.
- Trust boundaries: design explicit, allow‑listed adapter entrypoints to separate cross‑domain inputs from user flows without watering down core checks.

## Tactics That Worked

- **Preserve strict invariants:**
    - Exact ETH/token accounting; no "close enough" values.
    - Signatures must either verify under threshold aggregation or recover to the expected signer; no leniency.
    - Liquidation steps must be capped by available liquidity per tranche; no arithmetic hand‑waving.

- **Draw clean integration seams:**
    - Introduce explicit, allow‑listed “adapter” entrypoints to handle cross‑chain or system messages. Core flows stay strict; adapters are audited and tightly permissioned.
    - For batch operations, provide a "deposit on behalf" path that respects user approvals without relying on implicit behaviors.

- **Gate advanced cryptography:**
    - Keep homomorphic arithmetic paths and disclosure logic, but avoid on‑chain decrypts in standard EVM environments. Toggle fhEVM‑specific behavior with environment checks.
    - Align validator tests with real signing (private key ↔ address correspondence), not shortcuts.

- **Make failures clear:**
    - Use predictable revert reasons (“paused”, insufficient amount, invalid signature).
    - Prefer explicit checks and early returns over optimistic flows.

## Concrete Outcomes

- Validator approvals for high‑value transactions became robust and predictable: strict signature checks, threshold enforcement, on‑chain aggregated proof validation.
- Cross‑chain and batch flows no longer bypassed invariants: trusted adapter entrypoints and deposit‑on‑behalf flows enabled integration without weakening core checks.
- Liquidations no longer risked underflows: tranche‑level caps and state updates made economic safety verifiable.
- FHE support remained future‑proof: encrypted arithmetic pathways exist; environment‑sensitive decrypt/reencrypt is deferred to gateways/client‑side.

## Playbook For Similar Problems

- Start with invariants: write down what must always be true across the system. Make tests prove those, not implementation quirks.
- Separate interfaces: user, adapter, and admin surfaces should be different functions with different permissions and different assumptions.
- Assert adversarial models: pick explicit BFT thresholds, define fault assumptions, and enforce them in tests (e.g., honest majority).
- Respect the EVM: if a feature doesn’t belong on‑chain synchronously (e.g., FHE decrypt), design around it rather than forcing it.
- Keep it observable: deterministic reverts and events make both tests and operations easier.

## The Payoff

Ended with contracts that are strict where they must be, flexible where it’s safe, and ready for incremental upgrades. Privacy flows, validator approvals, vault mechanics, and cross‑chain
integrations now work together coherently—and the tests reflect the same security guarantees users rely on in production.
