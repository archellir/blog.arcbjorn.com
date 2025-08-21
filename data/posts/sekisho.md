---
title: "Building a Zero-Dependency Proxy in Go"
published_at: "2025-08-20 12:00"
snippet: "Architecture decisions and language trade-offs for building Sekisho - a zero-dependency security proxy."
tags: ["go", "security", "architecture"]
---

[Sekisho](https://github.com/archellir/sekisho/) (関所) - building security infrastructure with extreme minimalism. The project's defining constraint—zero external dependencies—drives architectural decisions that illuminate both the capabilities and limitations of different technology stacks for proxy development.

## Architecture: Middleware Pipeline Design

The system adopts a monolithic, single-binary architecture that compiles to approximately 10MB. The core request handling follows a middleware pipeline pattern:

```go
func setupMiddleware() http.Handler {
    return RequestID(
        Recovery(
            RateLimiter(
                SecurityHeaders(
                    AuthMiddleware(
                        PolicyMiddleware(
                            ProxyHandler()))))))
}
```

This compositional approach creates clear separation of concerns. Each middleware component handles a single responsibility, making the security-critical code easier to audit and test.

## Language Selection: Evaluating the Options

### Go's Advantages for Network Proxies

**Concurrency Model**  
Go's goroutine-based concurrency provides genuine parallelism with minimal complexity. Each incoming connection spawns a lightweight goroutine (~2KB stack), enabling thousands of concurrent connections without the overhead of OS threads.

```go
func acceptConnections(listener net.Listener) {
    for {
        conn, _ := listener.Accept()
        go handleConnection(conn)  // Lightweight, efficient concurrency
    }
}
```

**Standard Library Comprehensiveness**  
The stdlib includes production-ready implementations for:
- TLS termination (`crypto/tls`)
- OAuth2 flows (`net/http`, `encoding/json`)
- AES-256-GCM encryption (`crypto/aes`, `crypto/cipher`)
- HTTP reverse proxying (`net/http/httputil`)

**Deployment Simplicity**  
Static binary compilation enables minimal container images:

```dockerfile
FROM scratch
COPY sekisho /
ENTRYPOINT ["/sekisho"]
```

No runtime, interpreter, or package manager required—just the executable.

### Systems Languages Comparison

**Rust: Maximum Performance, Maximum Complexity**

Rust could deliver superior performance with zero-cost abstractions:

```rust
use hyper::{Client, Request, Response, Body};

async fn proxy_handler(req: Request<Body>) -> Result<Response<Body>> {
    let client = Client::new();
    client.request(req).await
}
```

For this use case, Rust presents trade-offs:
- **Pros:** Better memory efficiency (20-50MB), higher throughput (50,000+ connections), compile-time safety guarantees
- **Cons:** Complex async runtime choices (tokio vs async-std), steeper learning curve, 10-20x longer compile times
- **Verdict:** Overkill for a simple proxy unless maximum performance is critical

**Zig: Radical Simplicity, Radical Control**

Zig offers explicit control without hidden complexity:

```zig
const std = @import("std");

fn handleRequest(server: *Server, conn: std.net.Connection) !void {
    var buf: [4096]u8 = undefined;
    const n = try conn.read(&buf);
    try server.upstream.write(buf[0..n]);
}
```

Zig considerations:
- **Pros:** Smallest binaries (3-5MB), no runtime overhead, comptime metaprogramming, explicit allocations
- **Cons:** Immature ecosystem, manual memory management, limited OAuth/TLS libraries, pre-1.0 stability
- **Verdict:** Excellent for learning systems programming, risky for production security infrastructure

**Go: The Pragmatic Middle Ground**

Go sits between Rust's performance and Python's simplicity. For a zero-trust proxy, Go provides:
- Sufficient performance (10,000+ concurrent connections)
- Rich standard library (OAuth, TLS, crypto included)
- Fast iteration cycles (5-10s builds vs Rust's minutes)
- Mature ecosystem and tooling
- Simpler error handling than Rust's Result<T, E>

The choice reflects the project's goals: operational simplicity over maximum performance.

### Alternative Language Trade-offs

**Rust**  
Rust offers memory safety without garbage collection:

```rust
async fn proxy_handler(req: Request<Body>) -> Result<Response<Body>> {
    let client = Client::new();
    let (parts, body) = req.into_parts();
    let upstream_req = Request::from_parts(parts, body);
    client.request(upstream_req).await
}
```

Advantages:
- Zero-cost abstractions and no runtime overhead
- Memory safety guarantees at compile time
- Excellent performance (often faster than Go)
- Smaller binaries (5-8MB possible)

Challenges:
- Steep learning curve (borrow checker, lifetimes)
- Longer compile times (minutes vs seconds)
- Async ecosystem fragmentation (tokio vs async-std)
- More verbose for simple tasks

**Zig**  
Zig provides low-level control with modern ergonomics:

```zig
fn handleConnection(conn: net.Connection) !void {
    var buffer: [4096]u8 = undefined;
    const bytes_read = try conn.read(&buffer);
    try upstream.write(buffer[0..bytes_read]);
}
```

Advantages:
- No hidden allocations or runtime
- Compile-time code execution
- C interoperability without FFI overhead
- Explicit error handling like Go

Challenges:
- Immature ecosystem (pre-1.0)
- Limited library availability
- Manual memory management complexity
- Smaller community and documentation

**Python**  
While Python offers cleaner syntax for simple cases:

```python
@app.route('/<path:path>')
@oauth_required
def proxy(path):
    return requests.get(f"{upstream}/{path}")
```

Limitations include:
- GIL prevents true parallelism for CPU-bound operations
- Virtual environment complexity in production
- 50-100MB interpreter overhead
- 10-100x slower startup times affecting container orchestration

**Node.js**  
JavaScript's event loop excels at I/O operations:

```javascript
app.use('/*', (req, res) => {
    fetch(`${upstream}${req.path}`).then(r => r.body.pipe(res))
})
```

Challenges arise from:
- Callback/promise complexity for authentication flows
- Dependency proliferation (average project: 1000+ packages)
- Runtime requirement in production
- Single-threaded execution despite async I/O

**Java/Spring**  
Enterprise frameworks provide comprehensive features:

```java
@Bean
RouteLocator routes(RouteLocatorBuilder builder) {
    return builder.routes()
        .route(r -> r.path("/**").filters(f -> f.oauth2()).uri(upstream))
        .build();
}
```

Overhead considerations:
- 200-500MB baseline JVM memory
- Complex build systems (Maven/Gradle)
- 5-30 second cold start times
- Framework abstraction layers

## Implementation Decisions and Trade-offs

### Session Storage Architecture

The system uses in-memory session storage with mutex synchronization:

```go
type Store struct {
    sessions map[string]*Session
    mutex    sync.RWMutex
}
```

**Benefits:**
- Zero configuration overhead
- Microsecond lookup times
- No network latency
- No external dependencies

**Limitations:**
- Single-instance restriction
- Session loss on restart
- Linear memory growth without cleanup
- No cross-datacenter capabilities

This design explicitly optimizes for operational simplicity over horizontal scalability—appropriate for personal infrastructure but unsuitable for enterprise deployments.

### Custom Implementations vs. Libraries

**YAML Parsing**  
A line-by-line parser replaces `gopkg.in/yaml.v3`:

```go
func parseYAML(filename string) (*Config, error) {
    // Custom parsing logic
    // Handles simple key-value pairs and lists
    // No support for anchors, aliases, or complex structures
}
```

Trade-off: Simplicity and control versus robustness and YAML specification compliance.

**Metrics Exposition**  
Prometheus-compatible metrics without the client library:

```go
func formatMetrics() string {
    return fmt.Sprintf(
        "# TYPE http_requests_total counter\n" +
        "http_requests_total{method=\"%s\"} %d\n",
        method, count)
}
```

Trade-off: Minimal code footprint versus automatic metric registration and advanced features.

## Performance Characteristics

Benchmarking reveals language-specific advantages:

| Metric | Go (Sekisho) | Rust | Zig | Python (Flask) | Node.js (Express) | Java (Spring) |
|--------|--------------|------|-----|----------------|-------------------|---------------|
| Request Overhead | <10ms | <5ms | <5ms | 20-50ms | 15-30ms | 30-100ms |
| Memory Baseline | 50-100MB | 20-50MB | 15-30MB | 150-300MB | 100-200MB | 300-800MB |
| Concurrent Connections | 10,000+ | 50,000+ | 30,000+ | 100-500 | 5,000+ | 5,000+ |
| Cold Start | <100ms | <50ms | <50ms | 1-3s | 500ms-1s | 5-30s |
| Binary Size | 10MB | 5-8MB | 3-5MB | N/A | N/A | 50-200MB |
| Build Time | 5-10s | 30-120s | 5-15s | N/A | N/A | 10-30s |

These numbers reflect:
- Compiled binary efficiency (Go, Rust, Zig)
- Runtime overhead differences
- Memory management strategies
- Concurrency model implications

## Go-Specific Patterns

### Interface-Based Extensibility

OAuth provider abstraction leverages Go's implicit interfaces:

```go
type Provider interface {
    AuthURL(state, redirect string) string
    TokenURL() string
    UserInfoURL() string
}

// Implementations automatically satisfy the interface
type GitHubProvider struct{}
type GoogleProvider struct{}
```

### Context-Based Lifecycle Management

Graceful shutdown using context propagation:

```go
ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
defer cancel()
server.Shutdown(ctx)  // Coordinated shutdown across goroutines
```

### Explicit Error Handling

Every error path requires explicit handling:

```go
session, err := store.Create(userID)
if err != nil {
    return nil, fmt.Errorf("session creation failed: %w", err)
}

if err := setCookie(w, session); err != nil {
    store.Delete(session.ID)  // Cleanup on partial failure
    return nil, fmt.Errorf("cookie setting failed: %w", err)
}
```

While verbose compared to exception-based languages, this approach creates predictable failure modes essential for security infrastructure.

## Architectural Lessons

**Constraint-Driven Design**  
The zero-dependency requirement forced creative solutions that might not emerge in typical development. Artificial constraints can lead to simpler, more maintainable systems.

**Appropriate Complexity**  
Sekisho's limitations (single-instance, volatile sessions) align with its use case. Enterprise features would add complexity without value for personal infrastructure.

**Language-Task Alignment**  
Go proves particularly suited for:
- Network services requiring high concurrency
- System tools needing simple deployment
- Security infrastructure demanding predictable behavior
- Operations-focused applications

**Standard Library Sufficiency**  
Modern standard libraries provide significant functionality:
- **Go:** Comprehensive networking, crypto, HTTP tooling
- **Rust:** Minimal stdlib, relies on external crates
- **Zig:** Growing stdlib, but limited high-level abstractions
- **Python/Node:** Rich ecosystems but dependency-heavy

For security infrastructure, Go's stdlib completeness enables the zero-dependency goal that would be impractical in Rust (would need tokio, hyper, rustls) or Zig (limited OAuth/TLS support).

## Conclusion

Sekisho demonstrates that minimal, focused tools can effectively solve specific problems without unnecessary complexity. The project's trade-offs—favoring simplicity over scalability, minimalism over features—represent deliberate design decisions rather than limitations.

The choice of Go enables these decisions through its compilation model, comprehensive standard library, and concurrency primitives. While other languages could implement similar functionality, Go's characteristics align particularly well with the goals of simple, reliable, and performant infrastructure tools.

The complete implementation spans approximately 2,000 lines of Go code, proving that production-ready security infrastructure doesn't require massive frameworks or extensive dependencies.

---

*Sekisho (関所) refers to the checkpoint stations that controlled movement during Japan's Edo period.*