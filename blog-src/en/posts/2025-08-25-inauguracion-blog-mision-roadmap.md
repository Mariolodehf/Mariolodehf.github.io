---
title: "Blog Inauguration: Telecommunications, Cybersecurity, and Building Real-World Skills"
summary: "Purpose of this blog, focus areas (Networks, Cloud Security, Ethical Hacking, IoT), and initial roadmap to turn technical curiosity into real impact."
tags: [introduction, roadmap, cybersecurity]
cover: /assets/img/og-default.svg
date: 2025-08-25
---
Welcome. If you found your way here, we probably share some combination of interests in networks, security, ethical hacking, cloud computing, and IoT. This first article establishes the "why" and the "how" of what I'll be publishing.

## Who's Writing and From What Starting Point?

I'm a Telecommunications Engineering student specializing in Information Security. My technical curiosity started with trying to understand how a bit reliably travels from point A to point B; it evolved into understanding how an attacker can interfere with, observe, or manipulate that transit—and how we can design defenses that actually work.

## Blog Mission

Build a public, structured record of:

1. Applied fundamentals (network models, segmentation, flow control, DNS, TLS, identity) explained with practical examples.
2. Offensive and defensive security: enumeration methodology, exploiting design flaws, gradual hardening, and early detection.
3. Transition to Cloud Security: attack surface in distributed architectures, identity and least privilege, isolation, useful logging (not noise), secure IaC patterns.
4. IoT and insecure edges: BLE, exposed devices, physical threats, and supply chains.
5. Bug Bounty / CTF with a transfer focus: what I learned in a gamified environment and how I apply it to real-world scenarios.

## Learning Philosophy

- Depth over shortcuts: before touching a tool, understand what it abstracts.
- Reproducibility: every lab documented (prerequisites, key commands, cleanup) so anyone can recreate it.
- Incrementalism: improve the same practical case (e.g., a vulnerable web service) by iterating defense layers—not creating dozens of disconnected demos.
- Personal metrics: hours of directed practice > time spent on "passive consumption."

## Formats You'll See

| Format | Purpose | Tentative Cadence |
|--------|---------|-------------------|
| Guided Labs | Reinforce fundamentals with practice | Biweekly |
| Vulnerability Writeups (responsible disclosure) | Communicate impact and process | When permitted |
| Mini Series (e.g., DNS Security, Zero Trust Model) | Break down dense topics | In blocks |
| Checklists | Operationalize concepts | Continuous revision |
| Reflections / Roadmap | Adjust direction and priorities | Quarterly |

## Initial Roadmap (First 6–8 Weeks)

1. Lab: Minimal topology to observe TLS handshake and failure points.
2. Practical introduction to HTTP / DNS enumeration without relying on "black box" tools.
3. Brief series: "Common API Design Mistakes" (weak authentication, partial filtering, lack of multi-tenant data segregation).
4. IoT Lab: basic BLE traffic capture and analysis, pairing risks.
5. Guide: structure of a clear vulnerability report (Title → Impact → PoC → Mitigation).

## Ethical Principles

I will only research systems where explicit authorization exists (Bug Bounty programs, my own environments, or purpose-built labs). All content will follow responsible disclosure best practices, avoiding exposure of sensitive data or replicating risk in production.

## How You Can Leverage This Space

- Replicate labs and modify parameters (latency, MTU size, IAM policies) to observe differences.
- Keep a personal notebook (analog or digital) where you turn each finding into a rule: "If I see X, I try Y."
- Focus on the *ability to explain*: if you can't explain a flow (e.g., how a token is issued, travels, and validates) in a simple diagram, you haven't mastered it yet.

## Next Article

I'll dive deeper into the comparative value of CTF vs. Bug Bounty, supplemented with a mini transition guide: from controlled puzzles to real-world surface audits.

---

Interested in prioritizing a topic (Cloud IAM, Threat Modeling, BLE Security, reporting methodologies)? Drop me a line and I'll move it up the research queue.

Thanks for reading and welcome to the beginning of this continuous learning map.

{% img "/assets/img/og-default.svg", "Illustrative image of connectivity and security" %}
