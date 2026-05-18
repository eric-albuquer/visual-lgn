# Weak Law of Large Numbers Visualization

Interactive visualization of the Weak Law of Large Numbers using multiple stochastic trajectories.

---

## Overview

This simulation demonstrates how the probability of large deviations from the expected value decreases as the number of samples increases.

Each trajectory represents the cumulative average of repeated independent Bernoulli trials (coin tosses):

- Heads → `1`
- Tails → `0`

Over time, the trajectories progressively concentrate around the expected mean:

```math
\mu = 0.5
```

This visually illustrates the convergence behavior described by the Weak Law of Large Numbers.

---

## Mathematical Idea

For independent random variables:

```math
\overline{X}_n = \frac{1}{n}\sum_{i=1}^{n}X_i
```

the Weak Law states that:

```math
P\left(|\overline{X}_n - \mu| > \varepsilon\right) \to 0
```

as:

```math
n \to \infty
```

This means that the probability of observing large deviations from the expected value becomes increasingly small.

---

## Visualization

The simulation displays:

- Multiple independent trajectories
- Running sample means
- Expected mean line
- Epsilon convergence band
- Probability estimate of trajectories outside the interval
- Real-time convergence behavior

Trajectories inside the convergence band are shown in green, while trajectories outside are shown in red.

---

## Features

- Real-time stochastic simulation
- Adjustable simulation speed
- Adjustable epsilon interval
- Logarithmic time compression
- Efficient sparse-history rendering
- Probability estimation in real time
- Interactive controls
- High-performance visualization using p5.js

---

## Concepts Demonstrated

- Weak Law of Large Numbers
- Convergence in Probability
- Bernoulli Random Variables
- Statistical Concentration
- Sample Means
- Stochastic Processes
- Probabilistic Convergence

---

## Controls

| Control | Description |
|---|---|
| Samples / Frame | Controls simulation speed |
| Epsilon (ε) | Controls convergence interval width |

---

## File Structure

```txt
weak-law-visualization/
│
├── index.html
├── sketch.js
├── style.css
└── README.md
```

---

## Running Locally

Open `index.html` directly in a browser or run a local server:

```bash
python -m http.server
```

Then access:

```txt
http://localhost:8000
```

---

## Performance Notes

The simulation uses:

- logarithmic compression on the time axis
- sparse bucket storage
- fixed-width rendering

to efficiently visualize long-term convergence without excessive memory usage.

---

## Educational Goal

The purpose of this visualization is to transform an abstract probabilistic theorem into an intuitive visual process.

Instead of only observing formulas, users can directly see probability concentration emerging over time through stochastic behavior.

---

## License

MIT License
