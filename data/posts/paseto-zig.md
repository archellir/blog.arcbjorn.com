---
title: "Implementating PASETO in Zig"
published_at: "2025-08-21 12:00"
snippet: "PASETO v4 in Zig, exploring cryptographic security through type safety and zero-cost abstractions."
tags: ["zig", "crypto", "security"]
---

Platform-Agnostic Security Tokens (PASETO) represent a modern alternative to
JWT, designed with security as the primary concern. Here is
[implementation of PASETO v4 in Zig](https://github.com/archellir/blog.arcbjorn.com)
with additional insights about both the protocol's design and Zig's unique
strengths for cryptographic software.

## Why PASETO Over JWT?

Before diving into the implementation, it's worth understanding why PASETO
exists. JWT's flexibility has led to numerous security vulnerabilities:

- **Algorithm confusion attacks**: Tokens signed with RS256 verified as HS256
- **None algorithm acceptance**: Bypassing signature verification entirely
- **Weak cryptographic choices**: Outdated algorithms still supported for
  "compatibility"

PASETO eliminates these issues through **Algorithm Lucidity** - each token
version specifies exactly one cryptographic suite. No choices, no confusion, no
vulnerabilities.

## Architecture: Security Through Type Safety

The Zig implementation leverages the language's type system to enforce security
at compile time:

```zig
pub const LocalKey = struct {
    key: [32]u8,
    version: Version = .v4,
    purpose: Purpose = .local,
    
    pub fn isKeyValidFor(self: *const Self, version: Version, purpose: Purpose) bool {
        return self.version == version and self.purpose == purpose;
    }
};

pub const SecretKey = struct {
    key: [64]u8, // Ed25519 secret key
    version: Version = .v4,
    purpose: Purpose = .public,
    // ...
};
```

This design makes algorithm confusion attacks **impossible at compile time**.
Try to encrypt with a signing key? The compiler stops you:

```zig
// This won't compile - type mismatch
const token = try v4.local.encrypt(allocator, payload, &signing_key, null, null);
//                                                    ^
//                                            Wrong key type!
```

Compare this to typical JWT libraries where such mistakes are only caught at
runtime (if at all).

## The XChaCha20 Challenge: When Standard Libraries Fall Short

PASETO v4 mandates XChaCha20 encryption, but Zig's standard library only
provides ChaCha20IETF. This presented an interesting choice: compromise the
specification or implement XChaCha20 manually.

Correctness over convenience, implementing XChaCha20 using the HChaCha20
construction:

```zig
fn xchachaEncrypt(output: []u8, input: []const u8, key: [32]u8, nonce: [24]u8) !void {
    // Step 1: Derive subkey using HChaCha20
    const subkey = hchacha20(key, nonce[0..16].*);
    
    // Step 2: Use ChaCha20IETF with derived subkey
    const chacha_nonce = [12]u8{
        nonce[16], nonce[17], nonce[18], nonce[19],
        nonce[20], nonce[21], nonce[22], nonce[23],
        0, 0, 0, 0  // Counter starts at 0
    };
    
    crypto.stream.chacha.ChaCha20IETF.xor(output, input, 0, subkey, chacha_nonce);
}
```

This manual implementation highlights both Zig's power and its philosophy: when
you need precise control, the language doesn't hide complexity behind
abstractions.

## Memory Management: Explicit but Safe

Zig's manual memory management shines in cryptographic applications. Every
function requires an allocator parameter, giving users complete control:

```zig
// Arena allocator for short-lived operations
var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
defer arena.deinit();

const token = try builder.buildLocal(&key);
// Arena automatically frees everything at scope end
```

The `defer` statement ensures cleanup even if errors occur. For sensitive data,
explicit zeroing prevents memory disclosure:

```zig
pub fn deinit(self: *Self) void {
    utils.secureZero(&self.key);  // Zero out sensitive data
    if (self.original_seed) |*original| {
        utils.secureZero(original);
    }
}
```

## Error Handling: Making Failures Explicit

Zig's error sets make all failure modes explicit and typed. Instead of generic
exceptions, here are specific error conditions:

```zig
pub const Error = error {
    InvalidToken,
    InvalidHeader,
    InvalidFooter,
    InvalidSignature,
    InvalidKeyLength,
    KeyTypeMismatch,        // Algorithm Lucidity violation
    FooterTooLarge,         // Security limit exceeded
    FooterTooDeep,          // JSON nesting limit
    InvalidTimestamp,
    TokenExpired,
    TokenNotYetValid,
    // ... etc
};
```

This approach forces proper error handling and makes debugging significantly
easier.

## The Builder Pattern: Fluent APIs in Zig

Creating tokens safely requires managing multiple parameters and applying secure
defaults. The builder pattern provides a fluent interface:

```zig
var builder = paseto.createLocalBuilder(allocator);
defer builder.deinit();

_ = try builder.withDefaults()              // 1-hour expiration, issued-at now
    .setIssuer("api-server")
    .setSubject("user-123")
    .setAudience("client-app")
    .setClaimNumber("user_id", 12345)
    .setFooter("public-metadata");

const token = try builder.buildLocal(&key);
```

The `withDefaults()` method applies security best practices automatically -
short expiration times and automatic timestamp management.

## Testing: Security as a First-Class Concern

The test suite includes dedicated security testing that goes beyond functional
correctness:

```zig
// Test constant-time comparison
test "timing attack resistance" {
    const equal_a = [_]u8{ 1, 2, 3, 4 };
    const equal_b = [_]u8{ 1, 2, 3, 4 };
    const different = [_]u8{ 1, 2, 3, 5 };
    
    // These should take similar time regardless of where they differ
    try testing.expect(utils.constantTimeEqual(&equal_a, &equal_b));
    try testing.expect(!utils.constantTimeEqual(&equal_a, &different));
}
```

Security edge cases receive explicit testing coverage, including nonce
uniqueness, key zeroing verification, and tampering detection.

## Language Comparisons: Where Zig Excels

**vs. Go**: While Go's garbage collector simplifies memory management, it makes
secure key handling challenging. You can't reliably zero memory that the GC
might move around. Zig's manual memory management provides precise control over
sensitive data.

**vs. Rust**: Both languages provide excellent safety guarantees. Rust's borrow
checker automates memory safety, while Zig makes it explicit. For cryptographic
code, Zig's approach often feels more natural - you know exactly when and how
memory is managed.

**vs. C**: Zig provides C-like control with significantly better safety. The
allocator abstraction prevents many common memory bugs, while defer statements
ensure cleanup happens reliably.

**vs. JavaScript/Python**: These languages make cryptographic implementations
challenging due to their high-level nature. Zig's systems-level control enables
precise implementations of cryptographic algorithms.

## Interesting Problems and Solutions

### Footer Validation: Preventing DoS Attacks

PASETO footers can contain arbitrary data, potentially enabling
denial-of-service attacks through oversized payloads. The implementation
includes security limits:

```zig
const MAX_FOOTER_LENGTH = 2048;
const MAX_FOOTER_JSON_DEPTH = 2;
const MAX_FOOTER_JSON_KEYS = 16;

pub fn validateFooter(footer: []const u8) !void {
    if (footer.len > MAX_FOOTER_LENGTH) {
        return errors.Error.FooterTooLarge;
    }
    // Additional JSON structure validation...
}
```

These limits prevent resource exhaustion while maintaining functionality.

### Ed25519 to X25519 Key Conversion

PASERK (PASETO Key Serialization) includes "seal" operations that encrypt
payloads to public keys. This requires converting Ed25519 signing keys to X25519
encryption keys - a non-trivial cryptographic operation that the implementation
handles carefully.

### PAE (Pre-Authentication Encoding)

PASETO's security relies on Pre-Authentication Encoding, which ensures all token
components are cryptographically bound:

```zig
pub fn pae(allocator: Allocator, pieces: []const []const u8) ![]u8 {
    // Encode length + each piece length + pieces
    var total_len: usize = 8; // 8 bytes for piece count
    for (pieces) |piece| {
        total_len += 8 + piece.len; // 8 bytes length + data
    }
    
    var result = try allocator.alloc(u8, total_len);
    // ... encoding implementation
}
```

This encoding prevents length extension attacks and ensures tamper-evident
tokens.

## Performance Characteristics

The Zig implementation prioritizes security over raw speed, but still achieves
excellent performance:

- **Zero-copy operations**: Direct byte manipulation minimizes allocation
- **Stack allocation**: Fixed-size cryptographic values avoid heap pressure
- **Minimal abstractions**: Critical paths avoid unnecessary indirection
- **Compile-time optimizations**: Zig's comptime features enable zero-cost
  abstractions

Benchmarks show performance comparable to C implementations while maintaining
memory safety.

## Lessons Learned

### Type Safety as Security

Using distinct types for different cryptographic purposes prevents entire
classes of vulnerabilities. This is more than just good practice - it's a
security design principle.

### Explicit Resource Management

Manual memory management isn't a burden in cryptographic code - it's a
requirement. Sensitive data needs precise lifecycle control that garbage
collectors can't provide.

### Testing Security Properties

Functional tests aren't enough for cryptographic code. Security properties like
constant-time behavior and secure memory handling need explicit verification.

### Specification Compliance Matters

Implementing exactly what the specification requires, even when inconvenient,
ensures interoperability and security. The XChaCha20 implementation was complex
but necessary.

## Future Directions

The implementation demonstrates Zig's potential for cryptographic software, but
several areas offer improvement:

- **Hardware acceleration**: Leveraging CPU crypto instructions
- **Formal verification**: Using tools to verify cryptographic properties
- **Performance optimization**: Specialized implementations for high-throughput
  scenarios
- **Standard library integration**: Contributing XChaCha20 implementation
  upstream

## Conclusion

Building PASETO in Zig revealed the language's exceptional fitness for
cryptographic work. The combination of:

- **Type safety** preventing algorithm confusion
- **Manual memory management** enabling secure key handling
- **Explicit error handling** making failures visible
- **Systems-level control** allowing precise implementations

...creates a compelling platform for security-critical software.

The implementation showcases how Zig's philosophy - explicit is better than
implicit, performance is important, and safety doesn't require complexity -
translates beautifully to cryptographic protocols.

For developers building secure systems, Zig offers a unique sweet spot: the
control and performance of C with safety guarantees approaching Rust, wrapped in
a syntax that doesn't fight you. In the world of cryptographic implementations,
these properties aren't just nice to have - they're essential.

---

_The complete PASETO Zig implementation is available on GitHub, including
comprehensive tests and examples. It demonstrates full PASETO v4 and PASERK
compatibility with extensive security testing._
