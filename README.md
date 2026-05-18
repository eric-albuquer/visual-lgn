# visual-lgn

Interactive statistical and stochastic simulations built with p5.js.

## Overview

visual-lgn is a collection of interactive visual simulations focused on concepts from statistics, probability, stochastic processes, and numerical methods.

The project was created as an educational and experimental environment for visualizing mathematical convergence and randomness through real-time simulations.

Each simulation is independent and includes:
- Interactive controls
- Real-time visualization
- Statistical metrics
- Graphs and convergence analysis
- Modular implementation

---

## Topics Covered

- Law of Large Numbers (LGN)
- Monte Carlo Methods
- Central Limit Theorem
- Random Walks
- Probability Distributions
- Sampling and Estimation
- Variance and Convergence
- Stochastic Processes

---

## Technologies

- p5.js
- JavaScript
- HTML5 Canvas
- CSS3

---

## Project Structure

```txt
visual-lgn/
│
├── assets/
├── shared/
├── simulations/
│   ├── monte-carlo-pi/
│   ├── law-large-numbers/
│   ├── central-limit-theorem/
│   ├── random-walk/
│   └── gaussian-distribution/
│
└── website/
```

---

## Simulations

| Simulation | Concept |
|---|---|
| Monte Carlo π | Stochastic approximation |
| Law of Large Numbers | Statistical convergence |
| Random Walk | Stochastic processes |
| Central Limit Theorem | Emergent normal distributions |

---

## Running Locally

Clone the repository:

```bash
git clone https://github.com/your-username/visual-lgn.git
```

Open any simulation folder and run a local server.

Example:

```bash
cd simulations/monte-carlo-pi
```

Then open `index.html` or run a local server:

```bash
python -m http.server
```

---

## Educational Goals

The goal of this project is to make abstract statistical concepts intuitive through interactive visualization.

Instead of only presenting formulas, the simulations allow users to observe:
- convergence
- randomness
- variance
- sampling behavior
- probabilistic phenomena

in real time.

---

## Future Simulations

Planned additions include:
- Bootstrap resampling
- Poisson processes
- Brownian motion
- Numerical integration
- Bayesian simulations
- Markov chains
- Queue systems
- Diffusion systems

---

## License

MIT License
