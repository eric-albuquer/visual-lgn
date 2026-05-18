# Monte Carlo π Simulation

Interactive visualization of π approximation using the Monte Carlo method.

## Overview

This simulation estimates the value of π by randomly sampling points inside a square and checking whether they fall inside an inscribed circle.

As the number of samples increases, the approximation converges toward the real value of π.

---

## Mathematical Idea

The simulation uses the ratio:

```math
\pi \approx 4 \cdot \frac{\text{points inside circle}}{\text{total points}}
```

Because:

```math
\frac{\text{Area of Circle}}{\text{Area of Square}}
=
\frac{\pi r^2}{(2r)^2}
=
\frac{\pi}{4}
```

Therefore:

```math
\pi \approx 4 \cdot \frac{N_{\text{inside}}}{N_{\text{total}}}
```

---

## Features

- Real-time Monte Carlo simulation
- Adjustable simulation speed
- Convergence graph
- Error estimation
- FPS counter
- Pause and reset controls
- Persistent point rendering
- Interactive visualization using p5.js

---

## Concepts Demonstrated

- Monte Carlo Methods
- Random Sampling
- Statistical Convergence
- Approximation Error
- Law of Large Numbers
- Stochastic Estimation

---

## Controls

| Control | Description |
|---|---|
| Slider | Controls points generated per frame |
| Pause | Stops simulation |
| Reset | Clears simulation and restarts |

---

## Files

```txt
monte-carlo-pi/
│
├── index.html
├── sketch.js
├── style.css
└── README.md
```

---

## Running

Open `index.html` in a browser or run a local server:

```bash
python -m http.server
```

---

## Visualization

The simulation displays:
- Random points
- Circle and square geometry
- Current π approximation
- Absolute error
- Predicted Monte Carlo error
- Convergence graph

---

## Theoretical Error

Monte Carlo convergence behaves approximately as:

```math
\text{Error} \sim \frac{1}{\sqrt{n}}
```

where:

- `n` is the number of samples

This means convergence is relatively slow, requiring many samples for high precision.

---

## License

MIT License
