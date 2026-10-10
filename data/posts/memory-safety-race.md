---
title: "Apple MIE vs GrapheneOS MTE Implementation"
published_at: "2025-09-28 12:00"
snippet: "Comparing two distinct approaches to Arm memory tagging in production."
tags: ["security", "mobile"]
---

_Updated October 2026: corrected errors about GrapheneOS's MTE modes, tag usage and page size, Arm's Enhanced MTE, and WebKit's MTE status, pointed out by the GrapheneOS project. Removed hardened_malloc details unrelated to MTE._

[GrapheneOS](https://grapheneos.org/) shipped hardware memory tagging ([MTE](https://grapheneos.org/features#exploit-mitigations)) in production in late 2023, about a month after the Pixel 8 launched. Apple announced [Memory Integrity Enforcement](https://security.apple.com/blog/memory-integrity-enforcement) (MIE) with the iPhone 17 in September 2025. Both build on the same Arm architecture feature, but differ in hardware, tag check modes, and coverage.

## Two-Year Gap

The Pixel 8 was the first phone with MTE hardware. Within about a month, GrapheneOS enabled it for everything it builds except its browser, then extended it to the browser and the kernel. Apple spent the same period co-designing the A19 and A19 Pro with MIE, and shipped synchronous Enhanced MTE across the kernel and over 70 userland processes at launch.

## Synchronous, Asynchronous, Asymmetric

[Arm's MTE](https://newsroom.arm.com/blog/memory-safety-arm-memory-tagging-extension) assigns a 4-bit tag to each 16-byte memory granule and to the top bits of each pointer, and compares them on access. A mismatch is reported in one of three modes ([Linux docs](https://docs.kernel.org/arch/arm64/memory-tagging-extension.html)):

- **Synchronous**: the access is not performed and the fault is raised immediately
- **Asynchronous**: the access goes through and the fault is raised later
- **Asymmetric**: reads are handled synchronously, writes asynchronously

### Apple: Strictly Synchronous

From Apple's [security blog](https://security.apple.com/blog/memory-integrity-enforcement): "We believe memory safety protections need to be strictly synchronous, on by default, and working continuously." Asynchronous reporting leaves "a race window open for attackers". Apple designed its silicon to make always-on synchronous checking affordable.

### GrapheneOS: Synchronous Kernel, Asymmetric Userspace

GrapheneOS uses synchronous mode in the kernel and asymmetric mode in userspace. It doesn't use asynchronous mode. When it [first enabled MTE](https://grapheneos.org/releases#2023103000), it chose asymmetric mode "to provide much higher security than asynchronous mode without much more overhead unlike the very expensive synchronous mode without any clear security benefits over asymmetric".

The mode is a performance trade-off, not a compatibility one. An app with a memory corruption bug faults in any mode. What asymmetric mode gives up is synchronous checking of writes, the window Apple's design rules out.

## Tag Confidentiality

Random tags only protect memory if attackers can't learn them, so every MTE deployment has to defend against tag leaks through side channels. This isn't an Apple-specific concern. Research such as [TikTag](https://arxiv.org/abs/2406.08719) showed speculative-execution tag leaks on Pixel 8 hardware, bypassing MTE in Chrome and the Linux kernel.

Apple designs its own cores, so it addressed this in silicon and software:

- Cores designed so "tag values can't influence speculative execution in any way"
- Secure Page Table Monitor (SPTM) protecting "the kernel allocator backing store and tag storage"
- Frequent re-seeding of the pseudo-random generator that selects new tags
- A Spectre V1 mitigation where attackers "would typically need 25 or more V1 sequences to reach more than 95 percent exploitability rate"

Pixels use Arm-designed Cortex cores, so their speculative behavior is fixed by Arm's design. hardened_malloc's deterministic guarantees don't rely on secret tags, though: a linear overflow faults because neighboring slots are guaranteed different tags, and a dangling pointer faults because freed slots get the reserved `0` tag. Leaked tags weaken the probabilistic layer, not those guarantees.

## Enhanced MTE Is FEAT_MTE4

The original MTE specification doesn't check accesses to non-tagged memory, such as global variables. Apple's Enhanced MTE (EMTE) requires that "accessing non-tagged memory from a tagged memory region requires knowing that region's tag".

EMTE isn't proprietary. Apple worked with Arm on the specification, released in 2022 and standardized as [FEAT_MTE4](https://developer.arm.com/documentation/109697/0100/Feature-descriptions/The-Armv8-9-architecture-extension?lang=en#md454-the-armv89-architecture-extension__FEAT_MTE4). Its canonical tag checking (`FEAT_MTE_CANONICAL_TAGS`) is what extends checks to untagged memory. FEAT_MTE4 also adds store-only checking and full fault address reporting. Any Arm core can implement it; it isn't tied to Apple silicon.

## Allocator Integration

### Apple: Typed Allocators Plus EMTE

MIE builds on Apple's secure allocators: kalloc_type in the kernel, xzone malloc in userspace, and WebKit's libpas. They segregate memory by type, but "page-level protections are too coarse to defend against attacks within the same type bucket, and we use memory tagging to close this gap." The allocator also uses different tags for neighboring allocations to catch buffer overflows.

### GrapheneOS: hardened_malloc

[hardened_malloc](https://github.com/GrapheneOS/hardened_malloc#memory-tagging) is the system allocator in GrapheneOS's Bionic libc. It sets random tags on slab allocations (128 KiB and below), excluding four values:

1. The standard reserved `0` tag
2. The slot's previous tag
3. The current or previous tag of the slot to the left
4. The current or previous tag of the slot to the right

Freeing a slot sets it back to the reserved `0` tag. There's no extra dedicated tag for freed memory. This provides:

- Deterministic detection of linear overflows
- Deterministic use-after-free detection until the slot has been reused twice, passing through the random and FIFO quarantines each time
- No access to slab allocations through untagged pointers

Larger allocations rely on guard regions and quarantines instead of tags.

## Hardware Investment

Apple dedicated "an extraordinary amount of Apple silicon resources to security — more than ever before — including CPU area, CPU speed, and memory for tag storage". The A19 and A19 Pro were co-designed with MIE's software.

GrapheneOS runs MTE on the Pixel 8, 9 and 10 series, whose Tensor chips use standard Arm cores. Its work is in the OS: enabling MTE nearly everywhere, integrating it into the allocator and kernel, and picking modes these cores run efficiently. That makes two viable paths: silicon built around the feature, and deep OS integration on off-the-shelf cores.

The dependency on Google's hardware cuts both ways. The Pixel 11 shipped in August 2026 without MTE support, and GrapheneOS [said](https://x.com/GrapheneOS/status/2093731615243411862) it can't complete a port without it.

## Browser Implementation Status

GrapheneOS's [Vanadium](https://grapheneos.org/features#vanadium), its Chromium-based browser and WebView, has MTE enabled for its main allocator.

Apple's MIE announcement lists WebKit's libpas among its secure allocators, but Apple hasn't integrated MTE into WebKit and Safari to the same degree and is only now doing so. WebKit's public history shows libpas MTE support landing from late 2025, with full tagging applied to [hardened processes](https://github.com/WebKit/WebKit/pull/52248) such as Lockdown Mode's. A dedicated tagged heap was "compiled in but unused" until it was [enabled](https://github.com/WebKit/WebKit/pull/67907) in September 2026.

## Kernel Protection Mechanisms

Apple uses SPTM to protect "the kernel allocator backing store and tag storage", and ensures "that when the kernel accesses memory on behalf of an application, it's subject to the same tag-checking rules as userspace."

GrapheneOS uses MTE in the kernel's main allocators (slab, page_alloc and non-executable vmalloc) via [hardware tag-based KASAN](https://www.kernel.org/doc/html/latest/dev-tools/kasan.html), running synchronously. That provides probabilistic detection of use-after-free and inter-object overflows, plus deterministic use-after-free detection until memory is reallocated. GrapheneOS plans to add deterministic detection of linear overflows like hardened_malloc's.

## Deployment Models

**Apple MIE**: Always on for the kernel and over 70 userland processes on iPhone 17 and iPhone Air, with no user toggle. Third-party developers can opt their apps into EMTE through Xcode's Enhanced Security settings.

**Stock Android**: Off by default. Supported Pixels expose MTE as a developer option, and Android 16's Advanced Protection mode turns it on.

**GrapheneOS**: Always on for the kernel and nearly the entire base OS, including Vanadium, with no option to disable it there. User-installed apps get it if they have no native code or opt in themselves. A setting extends it to all user-installed apps, and a per-app [exploit protection compatibility mode](https://grapheneos.org/usage#bugs-uncovered-by-security-features) disables it for apps with latent memory corruption bugs.

## Performance Characteristics

Apple says careful planning "made it possible to maintain synchronous tag checking for all the demanding workloads of our platforms, delivering groundbreaking security with minimal performance impact".

On Pixel hardware, GrapheneOS's mode split is the performance strategy: synchronous checking in the kernel, asymmetric mode in userspace. GrapheneOS [describes](https://grapheneos.social/@GrapheneOS/113223464600916471) asymmetric mode's overhead as very low. Latent memory corruption bugs in apps, not overhead, are what keep it from being on by default for every user-installed app.

## Page Size

iOS uses 16 KB pages, which Apple's post mentions as the granularity of allocator page-level protections. Page size has no significant impact on MTE, which tags 16-byte granules either way. Pixel hardware [supports 16 KB pages](https://developer.android.com/guide/practices/page-sizes) too.

GrapheneOS stays on 4 KB pages by choice: smaller pages give finer-grained page protection and higher-entropy ASLR. hardened_malloc could support 16 KB pages, but its slab sizes are currently tuned for 4 KB.

## Implementation Validation

Apple evaluated MIE against "exceptionally sophisticated mercenary spyware attacks from the last three years" and says it "could not rebuild any of these chains to work around MIE."

GrapheneOS has run MTE in production since late 2023. It doesn't collect telemetry. When MTE catches memory corruption, the OS notifies the user, who decides whether to report it. MTE keeps catching latent memory corruption bugs in user-installed apps during regular use.

## Technical Implications

Both systems make memory corruption exploitation much harder. The differences are more specific than "custom silicon versus software":

- **Hardware**: Apple's cores are built for always-on synchronous EMTE and resist speculative tag leaks. Pixels use Arm's cores, where synchronous checking is costly.
- **Modes**: Apple is synchronous everywhere. GrapheneOS is synchronous in the kernel and asymmetric in userspace.
- **Coverage**: GrapheneOS covers the kernel, nearly the whole base OS, its browser and many user-installed apps. Apple covers the kernel and over 70 processes, lets third-party apps opt in, and is only now bringing MTE into WebKit.
- **Allocators**: Both pair tagging with hardened allocators that give neighbors distinct tags, making linear overflows deterministic.

---

## Resources

- [Apple Memory Integrity Enforcement Security Blog](https://security.apple.com/blog/memory-integrity-enforcement)
- [GrapheneOS Features Overview](https://grapheneos.org/features#exploit-mitigations)
- [GrapheneOS Hardened Malloc: Memory Tagging](https://github.com/GrapheneOS/hardened_malloc#memory-tagging)
- [Arm FEAT_MTE4 (Enhanced MTE)](https://developer.arm.com/documentation/109697/0100/Feature-descriptions/The-Armv8-9-architecture-extension?lang=en#md454-the-armv89-architecture-extension__FEAT_MTE4)
- [ARM Memory Tagging Extension Overview](https://newsroom.arm.com/blog/memory-safety-arm-memory-tagging-extension)
- [Linux Kernel MTE Documentation](https://docs.kernel.org/arch/arm64/memory-tagging-extension.html)
- [TikTag: Breaking ARM's Memory Tagging Extension with Speculative Execution](https://arxiv.org/abs/2406.08719)
- [Linux Kernel KASAN Documentation](https://www.kernel.org/doc/html/latest/dev-tools/kasan.html)
