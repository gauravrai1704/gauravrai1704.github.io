export const links = {
  email: 'gr377@snu.edu.in',
  github: 'https://github.com/gauravrai1704',
  linkedin: 'https://www.linkedin.com/in/gaurav-rai-4a39602ba',
  leetcode: 'https://leetcode.com/u/Gaurav_Rai_1704/',
  kaggle: 'https://www.kaggle.com/gauravrai1704',
  resume: '/Gaurav_Rai_Resume.pdf',
  location: 'New Delhi, India',
};

export const nav = [
  { label: 'Research', href: '#research' },
  { label: 'Projects', href: '#projects' },
  { label: 'Academics', href: '#academics' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export const research = [
  {
    id: 'pact-kv',
    tier: 'T1 · Systems',
    title: 'PACT-KV',
    subtitle: 'Phase-Aware Cost-Optimal Tiering for Memory-Constrained LLM Inference',
    blurb:
      "The KV cache is the hard capacity wall in LLM inference — confine it to GPU VRAM and you cap context length. PACT-KV tiers KV blocks across GPU VRAM (T1) and CPU DRAM (T2) using a hardware-derived cost signal instead of recency, so offloading stops costing latency.",
    stats: [
      { value: '2.7×', label: 'servable context extension' },
      { value: '100%', label: 'KV-cache hit rate, every workload' },
      { value: '<0.5%', label: 'throughput overhead on real HW' },
      { value: '98.0%', label: 'APF prefetch accuracy' },
    ],
    stack: ['Python', 'C++', 'CUDA', 'Rust', 'FastAPI'],
    links: [
      { label: 'Repository', href: 'https://github.com/gauravrai1704/tier-aware-kv-cache' },
    ],
    quant: [
      'On an RTX A4000 running Mistral-7B-v0.1 (FP16), extends servable context 2.7× — from a 2,560-token vLLM T1-only ceiling to 8,192+ tokens — at under 0.5% throughput overhead.',
      'Across a seven-system, five-workload, hardware-calibrated simulation (ShareGPT, LongBench, Alpaca, 2WikiMultihopQA, RULER), PACT-KV is the only system holding a 1.000 KV-cache hit rate on every dataset — including 2WikiMultihopQA, a retrieval-augmented workload where LRU and LMCache collapse to a 0.028 hit rate.',
      'Under RULER at 76.4% T2 utilization, PACT-KV sustains 1.438ms TPOT versus 19.9ms for LRU and 9.1ms for LMCache under identical pressure.',
      'The Attention Pattern Forecasting (LSTM) prefetcher reaches 98.0% mean prefetch accuracy vs. 77.3% for a recency/attention-sink heuristic — a 20.7-point improvement.',
      'A VRAM-budget sweep (400MB → 100MB) shows PACT-KV\u2019s hit rate is flat at 1.000 regardless of budget, while every reactive baseline degrades further as budget shrinks — cost-aware eviction fails predictably instead of arbitrarily.',
      'Ablating the prefetcher (PACT-KV w/o APF) isolates its contribution: TTFT drops from 5.18ms to 4.82ms with APF enabled — within 0.04ms of the vLLM T1-only floor — at the cost of T2 utilization rising from 3.9% to 45.0%.',
    ],
    qual: [
      'Three mechanisms share one cost signal (AOL — Amortized Offcore Latency, adapted from CPU-tiering literature to the GPU–CPU boundary): pressure-driven demotion and AOL-gated promotion for steady state, phase-aware migration that proactively moves blocks at the prefill→decode boundary, and the APF prefetcher for shifting access patterns within decode.',
      'A CUDA VMM abstraction (cuMemAddressReserve / cuMemMap) makes tier migration transparent to the attention kernel — the virtual address never changes, so cross-tier transfers cost nothing at the kernel level. Validated empirically: throughput delta stays flat even as T2 utilization exceeds 900%.',
      'The evaluation is deliberately split into two tracks with different evidentiary status: Track 1 (hardware pilot) supplies real, measured timing constants; Track 2 (calibrated simulation) is the comparative evidence base built on those constants — every claim in the paper is labeled by which track produced it.',
      'A Strata deep-dive shows the comparison is workload-dependent, not a uniform win: transfer-engineering (Strata) wins when T2 pressure is negligible (ShareGPT, Alpaca), while cost-aware placement (PACT-KV) wins as pressure rises (LongBench, 2WikiMultihopQA, RULER) — read as evidence the two approaches are complementary rather than competing.',
      'Explicit limitation acknowledged in the paper: all results are measured under single-request load; whether APF/PDD/PAM DMA traffic contends with itself under concurrent multi-request serving is untested and flagged as the immediate next step.',
    ],
  },
  {
    id: 'hybridfluxir',
    tier: 'T2 · Vision',
    title: 'A Lightweight Quantization-Aware Degradation-Guided Image Super-Resolution Framework',
    venue: 'Under Review @ ICVGIP 2026',
    blurb:
      'Diffusion-based super-resolution methods deliver strong perceptual quality but carry hundreds of millions of adapter parameters — unusable on CCTV nodes and edge cameras. This framework reaches competitive perceptual quality with a 9.61M-parameter, backbone-free network trained fully end-to-end, quantized to INT8 for edge deployment.',
    stats: [
      { value: '9.61M', label: 'total parameters, no frozen backbone' },
      { value: '19.65', label: 'GFLOPs @ 128×96' },
      { value: '40×', label: 'smaller than FluxIR\u2019s ~400M adapter' },
      { value: '0.2dB', label: 'PSNR drop under INT8 quantization' },
    ],
    stack: ['PyTorch', 'CUDA', 'Quantization-Aware Training'],
    links: [],
    quant: [
      'On DIV2K-Val (synthetic, in-distribution), the full model (FP32) reaches 23.73dB PSNR / 0.902 SSIM / 0.079 LPIPS, outperforming an FDI-ablated variant across all three metrics (20.26dB / 0.546 / 0.757).',
      'INT8 quantization-aware training introduces only a 0.14dB PSNR drop (23.73 → 23.59) and a marginal LPIPS increase (0.079 → 0.104) on DIV2K-Val — a highly bounded degradation from full precision.',
      'On real-world benchmarks (RealSR, DRealSR), the model reaches 19.46 / 19.91 dB PSNR and 0.851 / 0.852 SSIM, trailing PSNR-optimized baselines on pixel fidelity while leading them on SSIM and LPIPS by a wide margin — consistent with the perception-distortion tradeoff.',
      'Feature-space clustering (Davies–Bouldin index) shows both model variants score 4.03 and 4.41 — the two best (lowest) scores among six compared methods, indicating markedly lower intra-class variance than baselines including Real-ESRGAN (4.65).',
      'Parameter accounting: the degradation-conditioning pathway (FDI module + adapter) accounts for 67.0% of total parameters but only a 5.1% increase in GFLOPs over the ablated variant — conditioning is computed once per image and broadcast, while the 8-block transformer backbone dominates compute regardless.',
    ],
    qual: [
      'Architecture bypasses explicit degradation estimation entirely: a Feature Difference Instruction (FDI) module computes the feature-space residual between degraded and clean inputs via a lightweight Q-Former, then injects that signal through an SE-style gating mechanism in 8 latent transformer blocks and an AdaIN-based decoder modulator — no frozen diffusion backbone anywhere in the pipeline.',
      'Trained on a fully synthetic, privacy-safe data engine: ~350K FLUX-generated high-resolution images, degraded via a Real-ESRGAN-style pipeline (blur, down-up scaling, additive noise, JPEG compression) and filtered to the top 5% by a combined CLIP-IQA / MANIQA / MUSIQ quality score.',
      'Explicitly separates two effects that could otherwise be conflated: the real-world PSNR gap against baselines is attributed to a synthetic-to-real domain shift (no real sensor noise in training data), while the SSIM/LPIPS-vs-PSNR divergence between model variants is attributed to the perception-distortion tradeoff — the FDI module deliberately trades pixel-wise fidelity for sharper, more realistic high-frequency detail.',
      'Corrected during a rigorous internal audit (from an earlier erroneous compute figure): true cost is 78.59 GFLOPs at the paper\u2019s actual 256×192 evaluation resolution, alongside fixes to a model-checkpoint naming inversion and a dead, unused gating submodule flagged during a code-vs-paper cross-check.',
      'Reproducibility discipline: an exact, cross-validated parameter breakdown (9,611,107 params for the full model, 4,676,611 for the ablated variant) matches the paper\u2019s reported figures to full precision, backed by a full formula derivation for GFLOPs accounting.',
    ],
  },
];

export const projects = [
  {
    title: 'ChaseFlow AI',
    period: '2026',
    description:
      'A multi-agent orchestration system automating financial-advisory workflows. A predictive delay engine uses pattern recognition to flag at-risk client follow-ups before they slip, reclaiming 15+ hours a week per advisor.',
    stats: ['80%+ automation rate', '60% shorter completion cycles'],
    stack: ['Python', 'FastAPI', 'React', 'SQLAlchemy', 'WebSockets', 'Vite'],
    repo: 'https://github.com/gauravrai1704/Agentic-Chaser-ChaseFlow-AI',
    live: 'https://agentic-chaser-chase-flow-ai.vercel.app',
  },
  {
    title: 'Real-Time ML Inference & Custom KV-Store Engine',
    period: '2025',
    description:
      'A polyglot microservice pairing a DistilBERT sentiment model with a custom, thread-safe Java KV-store built directly over TCP — an LRU cache via doubly-linked list and separate chaining sits in front of inference to cut redundant compute.',
    stats: ['80K+ QPS, P99 < 1ms (KV-store)', '62% lower mean inference latency (152ms → 58ms)', '75% cache hit rate'],
    stack: ['Java', 'Python', 'FastAPI', 'PyTorch', 'Docker'],
    repo: 'https://github.com/gauravrai1704/ml-kvstore-system',
    live: null,
  },
  {
    title: 'VPP-Orchestrate',
    period: '2026',
    description:
      'A Virtual Power Plant database orchestration system utilizing spatial data types and automated triggers to manage and coordinate distributed energy resources efficiently.',
      stats: [
        'ACID-Compliant Schema', /*[cite: 1] */
        'SHA-256 Hash Chain Ledger', /*[cite: 1] */
        'R-Tree Spatial Indexes', /*[cite: 1] */
        'Recursive CTEs', /*[cite: 1] */
        'Virtual KPI Columns' /*[cite: 1] */
      ],
    stack: ['MySQL 8.0', 'Express.js', 'Node.js', 'React 18+', 'Tailwind CSS', 'Zustand'],
    repo: 'https://github.com/gauravrai1704/VPP-Orchestrate',
    live: null,
  },
  {
    title: 'Handwritten Digit Recognition',
    period: '2025',
    description:
      'A CNN trained on MNIST with data augmentation and dropout to control overfitting, served behind a low-latency FastAPI inference endpoint.',
    stats: ['99.5% accuracy on MNIST', '85% reduction in overfitting', '<50ms inference latency'],
    stack: ['Python', 'TensorFlow', 'FastAPI', 'Docker'],
    repo: 'https://github.com/gauravrai1704/Handwritten-digit-recognition',
    live: null,
  },
];

export const academics = {
  degree: 'B.Tech, Computer Science and Engineering',
  school: 'Shiv Nadar University, Delhi NCR',
  period: '2024 – 2028',
  stats: [
    { value: '9.52', label: 'CGPA' },
    { value: 'Top 10% in CSE Department', label: "Dean's List Scholar" },
    { value: '2nd Runner-up', label: 'HPE Think-a-Thon 2026' },
  ],
  extras: [
    'HCLTech Campus Ambassador',
    'ACM Student Chapter — AI-ML team Member',
    'TEDx university team — contributed to organizing the 2024 event',
  ],
};

export const experience = [
  {
    role: 'HPE CPP2 Program',
    org: 'Hewlett Packard Enterprise',
    period: 'Jun 2026 – Present',
    description: 'Real-Time AI Network Troubleshooter for BGP Switches: Architecting an end-to-end AI diagnostic pipeline utilizing Netmiko and TextFSM for CLI telemetry extraction, a Scikit-learn anomaly detection engine, and a Streamlit remediation dashboard.',
  },
  {
    role: 'Undergraduate Researcher, OUR Program',
    org: 'Shiv Nadar University · advised by Dr. Pooja Singh',
    period: 'Oct 2025 – Present',
    description:
      'Developing a lightweight, quantization-aware, degradation-guided image super-resolution framework for resource-constrained edge deployment.',
  },
];
