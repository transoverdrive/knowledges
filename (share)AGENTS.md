# {PROJECT_NAME} 

Version: 2.0.x
Scope: Repository‑wide (root)

This guide gives agents and contributors a concise, enforceable overview for working in this repo. Part 1 summarizes the product and architecture as implemented. Part 2 summarizes engineering rules. Full, canonical rules are included below so this file ([AGENTS.md](http://agents.md/)) is the single source of truth.

---

## Part 0) Conventions & Working Principles

### Naming Conventions

- Python (backend)
    - variables/functions: snake_case
    - classes: PascalCase
    - constants: UPPER_SNAKE_CASE
    - files/modules: snake_case.py, packages lowercase with underscores
    - imports: standard → third‑party → local (grouped, sorted)
- TypeScript/Next.js (frontend)
    - variables/functions: camelCase
    - classes/types/components: PascalCase
    - constants: UPPER_SNAKE_CASE
    - files: kebab-case for general modules; PascalCase allowed for React components; follow Next.js routing
    - tsconfig: enable `"strict": true` (noImplicitAny, strictNullChecks)

### DO
- Layer separation
    - Backend: API → Service → Analyzer/Repository → Infra
    - Frontend: UI → Service(State/API clients) → API client
- Domain‑first: business logic stays in services/analyzers, not in UI/controllers
- Interface‑first: define API/domain contracts before implementation
- Type safety: TS strict; Python typing on public APIs
- Single responsibility: one clear purpose per module/class

### DON’T
- Create circular dependencies
- Put business logic into UI/controllers
- Hard‑code secrets/config (use env/secret store)
- Abuse `any` (TS) or ship untyped public APIs (Python)
- Leave duplicate code (extract utilities/modules)

### Agent Workflow
- Central principles
    - Keep it concise, direct, friendly; prefer existing context/policy; avoid magic numbers (externalize to config/YAML)
- Tools
    - Edits: `apply_patch` only (add/modify/delete); avoid large pastes
    - Search: `rg` preferred; split file reads ≤ 250 lines
    - Approvals: when needed, use `with_escalated_permissions: true` + 1‑sentence justification
    - Planning: `update_plan` with exactly one `in_progress` step
    - Preambles: 1–2 sentences before grouped commands
- Message format
    - Bullets first; minimal headers
    - Wrap commands/paths/code in backticks; clickable paths like `python-api/src/api/main.py:42`
    - No ANSI output; prefer local doc links
- Testing standard
    - Container‑first: `docker exec kyma-python-api python -m pytest -q`
    - Details: `docs/04_TESTS/TESTING_GUIDE.md`
    - Local vEnv only as secondary option
- Change/verification
    - TDD bias: unit → integration → E2E; include performance guards when relevant
    - Maintain traceability: update `docs/04_TESTS/TRACEABILITY_MATRIX.md`
    - Plans/docs should link `docs/06_CR_TASKS/PLAN_TEMPLATE.md` or `docs/05_EPICS/PLAN_TEMPLATE.md`
- Sandbox/approval policy
    - Current harness: workspace‑write, network restricted, approvals on‑request
    - Avoid destructive actions; escalate if necessary with clear reason
- Implementation guide
    - Minimize changes; preserve existing naming/paths/styles
    - Update related docs; meet performance goals or record exceptions

---

## Part 1) Project Overview

### Purpose & Value

### Architecture 

### API Endpoints

### Security & Access


## Part 2) Engineering Rules (summary)
Use this as your daily checklist. Details live in Part 3.

- Scope & enforcement
    - Applies repo‑wide; adapt legacy at boundaries first
    - CI gates: unit tests, import rules, code‑gen drift
- Layering & ports/adapters
    - DTOs vs domain models; controllers only map
    - One‑way deps: Domain → Application → API → Infrastructure (Clean Architecture)
    - Logic depends on ports; infra provides adapters (import‑linter enforces)
- Progressive adoption
    - Phase 0: declare boundaries, add unit gate, import contracts (warn → error)
    - Phase 1: convert one use‑case path end‑to‑end
    - Phase 2: strangler pattern; add CQRS for complex reads
    - Phase 3: UoW, Outbox, safe migrations
- CI/CD guardrails
    - `pytest -m "unit"` must pass before integration/E2E
    - import‑linter violations fail after grace period
    - `gen:api` must produce no diffs
- Governance
    - ADRs for significant decisions → `docs/adr/YYYYMMDD-<slug>.md`
    - DoR: clear acceptance/testability/value; DoD: code+tests+docs+review
- Testing
    - TDD: Red → Green → Refactor; regression tests first
    - Pyramid as guidance (tune per system)
- Operability
    - Observability: Logs/Metrics/Traces with correlation IDs; maintain dashboards/alerts
    - Resilience defaults: timeouts, idempotent retries, circuit breakers, bulkheads, fallbacks
- Security (DevSecOps)
    - SCA/SBOM; container scans/signatures; secrets scanning/managed; license checks

---

Authoritative rules: see full text below.

---

## Part 3) Full Engineering Rules (verbatim)

# Core Programming Rules

## 🎯 Core Philosophy

### Priority Principles

```
Practicality > Theoretical perfection
Simplicity > Complexity
Clarity > Brevity
Testability > Performance optimization
Incremental improvement > Big bang changes

```

## ⚡ Immediate Application Rules

### 1. Architecture Boundary Definition

- **DTO/Entity Separation**: API schema and domain models managed separately
- **Layer Dependencies**: Domain → Application → API → Infrastructure (reverse dependency forbidden)
- **Ports/Adapters Pattern**: Business logic depends on interfaces, implementations in infrastructure layer

### 2. Test-First Development

- **TDD Cycle**: Red(failing test) → Green(minimal implementation) → Refactor(improvement)
- **Test Pyramid(Guide)**: Recommend 70% unit / 20% integration / 10% E2E, adjust per team/system
- **Regression Prevention**: Add tests first when modifying existing code

### 3. Code Quality Standards

- **Function Size**: Basic guide ~20 lines, ≤3 parameters (exceptions allowed for algorithms/IO boundaries)
- **Single Responsibility**: One function/class has only one reason to change
- **Naming Rules**: Names that clearly reveal intent (searchable, consistent vocabulary)

## 🏗️ Design Principles

### SOLID Principles (Required)

```python
# S - Single Responsibility
class UserService:  # Only handles user management
    def create_user(): ...
    # ❌ def send_email(): ...  # Email should be separate service

# O - Open/Closed
class PaymentProcessor:
    def process(payment: Payment): ...  # Depends on interface
    # Add new payment methods by adding new classes without modifying existing code

# L - Liskov Substitution
# Subtypes must be completely substitutable for their base types

# I - Interface Segregation
class Printable: ...
class Scannable: ...
# ❌ class MultiFunctionDevice: ...  # Interface too large

# D - Dependency Inversion
class ReportGenerator:
    def __init__(self, reader: DataReader): ...  # Depend on abstraction
    # ❌ def __init__(self, db: DatabaseReader): ...  # Concrete class dependency

```

### Practical Principles

- **KISS**: Keep it as simple as possible (remove unnecessary complexity)
- **DRY**: Eliminate duplication (every piece of knowledge should occur exactly once)
- **YAGNI**: No excessive generalization for the future (implement when needed)
- **Clarity First**: Prioritize readability and intent over brevity (separate details into comments/docs)

## 🔄 Progressive Transition Strategy

### Clean Architecture Introduction (Phased)

```yaml
Phase 0: # Immediate application (no code movement)
  - Declare DTO/entity separation
  - Add test gates
  - Boundary validation with import-linter

Phase 1: # Sample path transition
  - Select one feature to separate use cases
  - Define ports and extract repositories
  - Verify with unit tests

Phase 2: # Expansion
  - New features 100% clean path
  - Wrap legacy with Adapters
  - Read separation (partial CQRS): separate complex queries with Query handlers/read-only ports
  - Gradual migration

Phase 3: # Infrastructure decoupling (DB/external APIs)
  - UoW(Unit of Work): use cases clearly control transaction boundaries (e.g., with uow:)
  - Outbox pattern: domain events→Outbox table→async worker for final delivery
  - Safe migration: add nullable → backfill → make non-null → remove (2+ release split)

```

### Phase 3: Infrastructure Decoupling Principles

- Use cases control transaction boundaries through UoW, encapsulate infrastructure details with ports/adapters.
- Domain events go to Outbox and external publishing in separate workers (retry/idempotency assured).
- Schema changes are split into reversible phases with deployment and monitoring between each phase.

## 📝 Development Workflow

### Agile Practices

- **User Stories**: "As <user> I want <feature> for <goal>"
- **INVEST Criteria**: Independent, Negotiable, Valuable, Estimable, Small, Testable
- **Definition of Ready (DoR)**: Clear acceptance criteria, testability, business value confirmed means 'ready'
- **Definition of Done (DoD)**: Code complete + tests pass + documentation + review complete

### CI/CD Pipeline

```yaml
CI: # Continuous Integration
  1. Code commit
  2. Automated build
  3. Unit tests
  4. Static analysis (SAST)
  5. Integration tests

CD: # Continuous Deployment
  6. Staging deployment
  7. E2E tests
  8. Canary release (1% → 10% → 100%)
  9. Monitoring & rollback preparation

```

### Architecture Contracts/CI Gates (Execution & Enforcement)

- Unit test gate: Forbid integration/E2E execution before `pytest -m "unit"` passes (Fail Fast).
- import-linter: Initially run as warnings, escalate to CI failures after 2 weeks for violations.
- Prevent code generation output drift: Fail when changes detected after `gen:api` execution.

Example: Minimal `.importlinter` contract

```
[importlinter]
root_package = .

[contract:layers]
name = Clean Layers
layers =
    core.domain
    core.application
    api
    infra
containers =
    core.domain -> core.application -> api -> infra

[contract:forbidden]
name = No framework in domain
source_modules =
    core.domain
forbidden_modules =
    fastapi
    pydantic
    sqlalchemy

```

### ADR(Architecture Decision Record)

- Record major architecture/schema/operational decisions in `docs/adr/YYYYMMDD-<slug>.md` (background/decision/alternatives/impact/follow-up actions).

## 🛡️ Security Principles

### Basic Security Rules

- **Least Privilege**: Grant only the minimum necessary privileges (PoLP)
- **Zero Trust**: Verify all access (don't trust internal networks either)
- **Input Validation**: Whitelist validation for all external inputs
- **Output Encoding**: HTML encoding to prevent XSS

### DevSecOps Practices

```yaml
Design: Threat modeling (STRIDE)
Develop: Secure coding, SAST
Test: DAST, penetration testing
Deploy: Vulnerability scanning
Monitor: Real-time security monitoring

```

### DevSecOps Checklist (Supply Chain/Secrets Management)

- Integrate SCA (dependency vulnerabilities) scanning and SBOM generation/serving into CI.
- Container image scanning (including base image vulnerabilities) and signature verification.
- Secrets scanning (both commits/PRs) and integration with secrets management systems (environment variables/vault).
- Third-party license review and policy violation blocking.

## 📊 Quality Metrics

### Measurable Targets

- **Code Coverage**: Unit tests 80% or higher
- **Complexity**: Cyclomatic complexity 10 or lower
- **Technical Debt**: 5% or less of total code
- **Build Time**: Within 5 minutes
- **Deployment Frequency**: 1+ times per day

### SRE 4 Golden Signals

1. **Latency**: Response time (p95 < 500ms)
2. **Traffic**: Requests per second
3. **Errors**: Error rate (< 0.1%)
4. **Saturation**: Resource utilization (< 80%)

### Operations/Observability

- Collect all 3 types of Logs/Metrics/Traces from the design stage, propagate request correlation IDs (Trace/Span ID) throughout.
- Define essential dashboards (performance/errors/resources) and alert criteria, update together when code/infrastructure changes.

### Resilience Basic Rules

- All external calls require timeouts, apply exponential backoff retry only for idempotent operations.
- Block failure propagation with circuit breakers and bulkheads, define fallback strategies in advance.

## 🚨 Risk Management

### Gradual Migration

- **Feature Flag**: Gradual activation of new features
- **Parallel Operations**: Run existing/new paths simultaneously then switch
- **Rollback Plan**: Immediate recovery plan for all changes

### When to Stop?

- Domain rules are very simple CRUD level
- Small team size and infrequent changes
- Limited deployment environment
→ Maintain only minimal testing and documentation

## 💡 Key Summary

```yaml
Immediate Practice:
  - Write tests first
  - Functions ~20 lines (exceptions when needed)
  - Validate all inputs
  - Code review required

Gradual Improvement:
  - Clean architecture from new features
  - Wrap legacy with adapters
  - Measure and improve

Absolutely Forbidden:
  - Big bang refactoring
  - Deployment without tests
  - Hard-coded configuration values
  - Undocumented APIs

```

---

*These rules are a minimal set of practice-tested principles. Adjust to project characteristics while maintaining core principles.*
