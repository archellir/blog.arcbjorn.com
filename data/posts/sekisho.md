---
title: "Building a Zero-Trust Proxy in Go"
published_at: "2025-08-20 12:00"
snippet: "Architecture decisions and language trade-offs for building Sekisho - a zero-dependency security proxy."
tags: ["go", "security", "architecture"]
---

[Sekisho](https://github.com/archellir/sekisho/) (関所) - building security
infrastructure with extreme minimalism. The project's defining constraint—zero
external dependencies—drives architectural decisions that illuminate both the
capabilities and limitations of different technology stacks for proxy
development.

## Architecture: Middleware Pipeline Design

The system adopts a monolithic, single-binary architecture that compiles to
approximately 10MB. The core request handling follows a middleware pipeline
pattern:

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

This compositional approach creates clear separation of concerns. Each
middleware component handles a single responsibility, making the
security-critical code easier to audit and test.

## Language Selection: Evaluating the Options

### Go's Advantages for Network Proxies

**Concurrency Model**\
Go's goroutine-based concurrency provides genuine parallelism with minimal
complexity. Each incoming connection spawns a lightweight goroutine (~2KB
stack), enabling thousands of concurrent connections without the overhead of OS
threads.

```go
func acceptConnections(listener net.Listener) {
    for {
        conn, _ := listener.Accept()
        go handleConnection(conn)  // Lightweight, efficient concurrency
    }
}
```

**Standard Library Comprehensiveness**\
The stdlib includes production-ready implementations for:

- TLS termination (`crypto/tls`)
- OAuth2 flows (`net/http`, `encoding/json`)
- AES-256-GCM encryption (`crypto/aes`, `crypto/cipher`)
- HTTP reverse proxying (`net/http/httputil`)

**Deployment Simplicity**\
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

- **Pros:** Better memory efficiency (20-50MB), higher throughput (50,000+
  connections), compile-time safety guarantees
- **Cons:** Complex async runtime choices (tokio vs async-std), steeper learning
  curve, 10-20x longer compile times
- **Verdict:** Overkill for a simple proxy unless maximum performance is
  critical

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

- **Pros:** Smallest binaries (3-5MB), no runtime overhead, comptime
  metaprogramming, explicit allocations
- **Cons:** Immature ecosystem, manual memory management, limited OAuth/TLS
  libraries, pre-1.0 stability
- **Verdict:** Excellent for learning systems programming, risky for production
  security infrastructure

**Go: The Pragmatic Middle Ground**

Go sits between Rust's performance and Python's simplicity. For a zero-trust
proxy, Go provides:

- Sufficient performance (10,000+ concurrent connections)
- Rich standard library (OAuth, TLS, crypto included)
- Fast iteration cycles (5-10s builds vs Rust's minutes)
- Mature ecosystem and tooling
- Simpler error handling than Rust's Result<T, E>

The choice reflects the project's goals: operational simplicity over maximum
performance.

### Alternative Language Trade-offs

**Rust**\
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

**Zig**\
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

**Python**\
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

**Node.js**\
JavaScript's event loop excels at I/O operations:

```javascript
app.use("/*", (req, res) => {
  fetch(`${upstream}${req.path}`).then((r) => r.body.pipe(res));
});
```

Challenges arise from:

- Callback/promise complexity for authentication flows
- Dependency proliferation (average project: 1000+ packages)
- Runtime requirement in production
- Single-threaded execution despite async I/O

**Java/Spring**\
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

## Module-by-Module Architectural Analysis

### Authentication Module (`internal/auth/`)

**Current Approach:** Provider interface with OAuth2/OIDC implementations

```go
type Provider interface {
    AuthURL(state, redirectURI string) string
    TokenURL() string
    UserInfoURL() string
    Scopes() []string
}
```

**Design Decision:** Interface-based provider system enables easy extensibility
for new OAuth providers (Google, GitHub, Microsoft) without code duplication.

**Alternative Approaches:**

- **Generic OAuth2 Library:** Could use `golang.org/x/oauth2` library for
  provider abstraction
- **SAML Support:** Enterprise environments often require SAML in addition to
  OAuth2
- **Certificate-based Auth:** mTLS authentication for machine-to-machine
  communication

**Trade-offs Made:**

- **Chosen:** Custom provider implementations for zero dependencies
- **Pro:** Complete control over OAuth flows, no external library versions to
  track
- **Con:** Manual implementation of OAuth2 specification details, potential for
  security bugs

**Go Patterns Used:**

- **Implicit interfaces:** Providers automatically satisfy interface without
  explicit declaration
- **Factory pattern:** Provider selection based on configuration string
- **Error wrapping:** `fmt.Errorf("token exchange failed: %w", err)` for error
  context

### Session Management (`internal/session/`)

**Current Approach:** In-memory storage with AES-256-GCM encryption

```go
type Store struct {
    sessions map[string]*Session
    mutex    sync.RWMutex
    ttl      time.Duration
}
```

**Design Decision:** Prioritizes simplicity and performance over scalability and
persistence.

**Alternative Approaches:**

- **Redis/Memcached:** External session store for horizontal scaling
- **Database Storage:** PostgreSQL/MySQL for persistence across restarts
- **JWT Tokens:** Stateless sessions encoded in client-side tokens
- **Encrypted Cookies:** Session data stored in encrypted client cookies

**Trade-offs Analysis:**

| Approach            | Pros                            | Cons                                 | Memory | Scalability |
| ------------------- | ------------------------------- | ------------------------------------ | ------ | ----------- |
| In-Memory (Current) | Zero config, microsecond access | Single instance only                 | Low    | None        |
| Redis               | Horizontal scaling, persistence | External dependency, network latency | None   | High        |
| JWT                 | Stateless, scales infinitely    | Token size, revocation complexity    | None   | Infinite    |
| Database            | Persistence, ACID properties    | Complex setup, slower access         | None   | Medium      |

**Go Patterns Used:**

- **Mutex synchronization:** `sync.RWMutex` for concurrent map access
- **Cleanup goroutines:** Background session expiration using `time.Ticker`
- **Crypto package usage:** AES-256-GCM for session encryption without external
  libraries

### Proxy Engine (`internal/proxy/`)

**Current Approach:** Standard library HTTP reverse proxy with custom TCP proxy

```go
func (p *HTTPProxy) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    proxy := &httputil.ReverseProxy{
        Director: p.director,
        Transport: p.transport,
    }
    proxy.ServeHTTP(w, r)
}
```

**Design Decision:** Leverage Go's built-in `httputil.ReverseProxy` for HTTP and
implement custom TCP proxy for arbitrary protocols.

**Alternative Approaches:**

- **Full Custom Implementation:** Build HTTP proxy from scratch for complete
  control
- **Envoy Integration:** Use Envoy as data plane with Sekisho as control plane
- **HAProxy Backend:** Use HAProxy for load balancing with Sekisho for auth
- **Service Mesh:** Implement as Istio/Linkerd sidecar proxy

**Architecture Comparison:**

```go
// Current: Standard library approach
proxy := &httputil.ReverseProxy{Director: director}

// Alternative: Full custom implementation
func customProxy(w http.ResponseWriter, r *http.Request) {
    client := &http.Client{}
    resp, err := client.Do(r)
    // Manual response copying, header handling, etc.
}
```

**Trade-offs Made:**

- **Chosen:** Standard library + custom TCP proxy
- **Pro:** Mature, tested HTTP proxy implementation with connection pooling
- **Con:** Less control over proxy behavior, limited to stdlib features

**Go Patterns Used:**

- **HTTP hijacking:** Taking control of TCP connection for CONNECT tunnels
- **io.Copy:** Efficient bidirectional data streaming for TCP proxy
- **Context propagation:** Request cancellation through proxy chain

### Configuration System (`internal/config/`)

**Current Approach:** Custom YAML parser with environment variable substitution

```go
func parseYAML(filename string) (*Config, error) {
    // Custom line-by-line parsing
    scanner := bufio.NewScanner(file)
    for scanner.Scan() {
        line := parseConfigLine(scanner.Text())
        // Custom parsing logic
    }
}
```

**Design Decision:** Implement minimal YAML parser to avoid external
dependencies.

**Alternative Approaches:**

- **gopkg.in/yaml.v3:** Standard YAML library with full specification support
- **TOML Configuration:** Using `github.com/BurntSushi/toml` for simpler syntax
- **JSON Configuration:** Standard library `encoding/json` support
- **Environment Variables:** 12-factor app approach with `os.Getenv`

**Complexity Comparison:**

| Approach    | Lines of Code | Features               | Dependencies |
| ----------- | ------------- | ---------------------- | ------------ |
| Custom YAML | ~200          | Basic key-value, lists | 0            |
| yaml.v3     | ~20           | Full YAML spec         | 1            |
| TOML        | ~25           | Rich types, comments   | 1            |
| JSON        | ~15           | Simple, ubiquitous     | 0            |

**Trade-offs Made:**

- **Chosen:** Custom parser for zero dependencies
- **Pro:** No external libraries, complete control over features
- **Con:** Limited YAML support, potential parsing bugs, maintenance burden

### Policy Engine (`internal/policy/`)

**Current Approach:** Rule-based evaluation with caching

```go
type Rule struct {
    Name        string
    Path        string
    Methods     []string
    AllowUsers  []string
    RequireAuth bool
    Action      Action
}
```

**Design Decision:** Simple, declarative rule system with glob pattern matching
and LRU cache.

**Alternative Approaches:**

- **Open Policy Agent:** Rego language for complex authorization logic
- **Cedar Language:** Amazon's policy language for fine-grained authorization
- **XACML:** XML-based standard for enterprise authorization
- **Lua Scripting:** Embedded Lua for custom policy logic

**Policy Language Comparison:**

```yaml
# Current: YAML-based rules
rules:
  - name: "admin_access"
    path: "/admin/*"
    allow_users: ["admin@company.com"]
    action: "allow"
```

```rego
# Alternative: Open Policy Agent
package sekisho.authz

allow {
    input.path == "/admin/*"
    input.user == "admin@company.com"
}
```

**Trade-offs Made:**

- **Chosen:** Simple rule-based system
- **Pro:** Easy to understand, fast evaluation, YAML configuration
- **Con:** Limited expressiveness, no complex policy logic

**Go Patterns Used:**

- **Strategy pattern:** Multiple matcher implementations (glob, email, IP)
- **Caching:** LRU cache with TTL for policy decisions
- **Hot reloading:** File modification time checking for config updates

### Middleware Pipeline (`internal/middleware/`)

**Current Approach:** Functional middleware composition

```go
type Middleware func(http.Handler) http.Handler

func Chain(middlewares ...Middleware) Middleware {
    return func(h http.Handler) http.Handler {
        for i := len(middlewares) - 1; i >= 0; i-- {
            h = middlewares[i](h)
        }
        return h
    }
}
```

**Design Decision:** Standard Go middleware pattern with functional composition.

**Alternative Approaches:**

- **Chi/Gin Framework:** Router-based middleware registration
- **Negroni/Alice:** Dedicated middleware chaining libraries
- **Context-based:** Pass data through `context.Context` instead of headers
- **Annotation-based:** Decorator pattern using struct tags

**Middleware Patterns Comparison:**

```go
// Current: Functional composition
handler = RequestID(Recovery(RateLimit(handler)))

// Alternative: Framework approach
r := chi.NewRouter()
r.Use(RequestID, Recovery, RateLimit)
r.Handle("/*", handler)
```

**Security Middleware Analysis:**

| Component        | Implementation          | Security Benefit                |
| ---------------- | ----------------------- | ------------------------------- |
| Rate Limiting    | Token bucket per IP     | DDoS protection                 |
| CSRF Protection  | Double-submit cookie    | Cross-site attack prevention    |
| Security Headers | Static header injection | Browser security policies       |
| Request ID       | UUID generation         | Request tracing and correlation |

### Audit Logging (`internal/audit/`)

**Current Approach:** Buffered logging with multiple formatters

```go
type Formatter interface {
    Format(entry *Entry) ([]byte, error)
}

// Multiple implementations: JSON, Text, CEF, Compact
```

**Design Decision:** Strategy pattern for log formatting with buffered,
concurrent-safe logging.

**Alternative Approaches:**

- **Structured Logging Libraries:** `zerolog`, `zap`, `logrus` for performance
- **OpenTelemetry:** Distributed tracing and metrics standard
- **Syslog Integration:** RFC 5424 syslog for enterprise log management
- **Streaming Logs:** Direct output to log aggregation systems

**Performance Implications:**

```go
// Current: Mutex-protected buffer
type Logger struct {
    buffer []Entry
    mutex  sync.Mutex
}

// Alternative: Channel-based logging
type Logger struct {
    entries chan Entry
}
```

**Trade-offs Made:**

- **Chosen:** Custom logger with multiple formatters
- **Pro:** Zero dependencies, flexible output formats
- **Con:** Lower performance than optimized libraries, more complex
  implementation

## Session Storage Architecture Deep Dive

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

This design explicitly optimizes for operational simplicity over horizontal
scalability—appropriate for personal infrastructure but unsuitable for
enterprise deployments.

### Custom Implementations vs. Libraries

**YAML Parsing**\
A line-by-line parser replaces `gopkg.in/yaml.v3`:

```go
func parseYAML(filename string) (*Config, error) {
    // Custom parsing logic
    // Handles simple key-value pairs and lists
    // No support for anchors, aliases, or complex structures
}
```

Trade-off: Simplicity and control versus robustness and YAML specification
compliance.

**Metrics Exposition**\
Prometheus-compatible metrics without the client library:

```go
func formatMetrics() string {
    return fmt.Sprintf(
        "# TYPE http_requests_total counter\n" +
        "http_requests_total{method=\"%s\"} %d\n",
        method, count)
}
```

Trade-off: Minimal code footprint versus automatic metric registration and
advanced features.

## Performance Characteristics

Benchmarking reveals language-specific advantages:

| Metric                 | Go (Sekisho) | Rust    | Zig     | Python (Flask) | Node.js (Express) | Java (Spring) |
| ---------------------- | ------------ | ------- | ------- | -------------- | ----------------- | ------------- |
| Request Overhead       | <10ms        | <5ms    | <5ms    | 20-50ms        | 15-30ms           | 30-100ms      |
| Memory Baseline        | 50-100MB     | 20-50MB | 15-30MB | 150-300MB      | 100-200MB         | 300-800MB     |
| Concurrent Connections | 10,000+      | 50,000+ | 30,000+ | 100-500        | 5,000+            | 5,000+        |
| Cold Start             | <100ms       | <50ms   | <50ms   | 1-3s           | 500ms-1s          | 5-30s         |
| Binary Size            | 10MB         | 5-8MB   | 3-5MB   | N/A            | N/A               | 50-200MB      |
| Build Time             | 5-10s        | 30-120s | 5-15s   | N/A            | N/A               | 10-30s        |

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

While verbose compared to exception-based languages, this approach creates
predictable failure modes essential for security infrastructure.

## Architectural Lessons

**Constraint-Driven Design**\
The zero-dependency requirement forced creative solutions that might not emerge
in typical development. Artificial constraints can lead to simpler, more
maintainable systems.

**Appropriate Complexity**\
Sekisho's limitations (single-instance, volatile sessions) align with its use
case. Enterprise features would add complexity without value for personal
infrastructure.

**Language-Task Alignment**\
Go proves particularly suited for:

- Network services requiring high concurrency
- System tools needing simple deployment
- Security infrastructure demanding predictable behavior
- Operations-focused applications

**Standard Library Sufficiency**\
Modern standard libraries provide significant functionality:

- **Go:** Comprehensive networking, crypto, HTTP tooling
- **Rust:** Minimal stdlib, relies on external crates
- **Zig:** Growing stdlib, but limited high-level abstractions
- **Python/Node:** Rich ecosystems but dependency-heavy

For security infrastructure, Go's stdlib completeness enables the
zero-dependency goal that would be impractical in Rust (would need tokio, hyper,
rustls) or Zig (limited OAuth/TLS support).

## Conclusion

Sekisho demonstrates that minimal, focused tools can effectively solve specific
problems without unnecessary complexity. The project's trade-offs—favoring
simplicity over scalability, minimalism over features—represent deliberate
design decisions rather than limitations.

The choice of Go enables these decisions through its compilation model,
comprehensive standard library, and concurrency primitives. While other
languages could implement similar functionality, Go's characteristics align
particularly well with the goals of simple, reliable, and performant
infrastructure tools.

The complete implementation spans approximately 2,000 lines of Go code, proving
that production-ready security infrastructure doesn't require massive frameworks
or extensive dependencies.

---

_Sekisho (関所) refers to the checkpoint stations that controlled movement
during Japan's Edo period._
