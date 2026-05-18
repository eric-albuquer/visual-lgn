const NUM_PATHS = 100

const paths = []

let speedSlider
let epsilonSlider

const GRAPH_X = 60
const GRAPH_Y = 80

const GRAPH_W = 900
const GRAPH_H = 500

// quantidade máxima teórica de amostras
// usada apenas para compressão logarítmica
const MAX_SAMPLES = 1_000_000_000

// ====================================
// PATH
// ====================================

class Path {

    constructor() {

        this.sum = 0

        this.n = 0

        // sparse array:
        // só armazena buckets utilizados
        this.history = {}
    }

    step() {

        // moeda justa
        const value =
            random() < 0.5 ? 1 : 0

        this.sum += value

        this.n++

        const mean =
            this.sum / this.n

        // ====================================
        // bucket logarítmico
        // ====================================

        const bucket =
            floor(
                map(
                    Math.log(this.n + 1),
                    0,
                    Math.log(MAX_SAMPLES),
                    0,
                    GRAPH_W - 1
                )
            )

        // sobrescreve o bucket
        // mantém apenas o estado mais recente
        this.history[bucket] = mean
    }

    latestMean() {

        return this.sum / max(this.n, 1)
    }
}

// ====================================
// SETUP
// ====================================

function setup() {

    const canvas =
        createCanvas(1020, 700)

    canvas.parent(
        "canvas-container"
    )

    frameRate(60)

    textFont("JetBrains Mono")

    textSize(15)

    // ====================================
    // sliders
    // ====================================

    speedSlider =
        createSlider(1, 500, 5, 1)

    speedSlider.parent(
        "speed-slider"
    )

    epsilonSlider =
        createSlider(
            0.01,
            0.30,
            0.05,
            0.01
        )

    epsilonSlider.parent(
        "epsilon-slider"
    )

    // ====================================
    // cria trajetórias
    // ====================================

    for (
        let i = 0;
        i < NUM_PATHS;
        i++
    ) {

        paths.push(
            new Path()
        )
    }
}

// ====================================
// DRAW
// ====================================

function draw() {

    background(2, 6, 23)

    drawGraph()

    const speed =
        speedSlider.value()

    const epsilon =
        epsilonSlider.value()

    // ====================================
    // atualiza trajetórias
    // ====================================

    for (let s = 0; s < speed; s++) {

        for (const path of paths) {

            path.step()
        }
    }

    // ====================================
    // desenha trajetórias
    // ====================================

    let outsideCount = 0

    for (const path of paths) {

        const latest =
            path.latestMean()

        if (
            abs(latest - 0.5)
            >
            epsilon
        ) {
            outsideCount++
        }

        drawPath(path)
    }

    // ====================================
    // estatísticas
    // ====================================

    drawStats(
        outsideCount,
        epsilon
    )
}

// ====================================
// GRAPH
// ====================================

function drawGraph() {

    fill(8, 15, 30)

    stroke(255)

    rect(
        GRAPH_X,
        GRAPH_Y,
        GRAPH_W,
        GRAPH_H,
        20
    )

    // ====================================
    // linha média esperada
    // ====================================

    const meanY =
        map(
            0.5,
            0,
            1,
            GRAPH_Y + GRAPH_H,
            GRAPH_Y
        )

    stroke(255, 255, 0)

    line(
        GRAPH_X,
        meanY,
        GRAPH_X + GRAPH_W,
        meanY
    )

    // ====================================
    // faixa epsilon
    // ====================================

    const epsilon =
        epsilonSlider.value()

    const upper =
        0.5 + epsilon

    const lower =
        0.5 - epsilon

    const upperY =
        map(
            upper,
            0,
            1,
            GRAPH_Y + GRAPH_H,
            GRAPH_Y
        )

    const lowerY =
        map(
            lower,
            0,
            1,
            GRAPH_Y + GRAPH_H,
            GRAPH_Y
        )

    noStroke()

    fill(0, 255, 150, 40)

    rect(
        GRAPH_X,
        upperY,
        GRAPH_W,
        lowerY - upperY
    )

    // ====================================
    // labels
    // ====================================

    fill(255)

    text(
        "Expected Mean = 0.5",
        GRAPH_X + 10,
        meanY - 10
    )

    text(
        "1.0",
        GRAPH_X - 40,
        GRAPH_Y + 10
    )

    text(
        "0.5",
        GRAPH_X - 40,
        meanY + 5
    )

    text(
        "0.0",
        GRAPH_X - 40,
        GRAPH_Y + GRAPH_H
    )
}

// ====================================
// DRAW PATH
// ====================================

function drawPath(path) {

    noFill()

    const latest =
        path.latestMean()

    if (
        abs(latest - 0.5)
        <=
        epsilonSlider.value()
    ) {

        stroke(
            0,
            255,
            150,
            70
        )

    } else {

        stroke(
            255,
            80,
            80,
            90
        )
    }

    beginShape()

    for (const key in path.history) {

        const bucket =
            Number(key)

        const x =
            GRAPH_X + bucket

        const y =
            map(
                path.history[bucket],
                0,
                1,
                GRAPH_Y + GRAPH_H,
                GRAPH_Y
            )

        vertex(x, y)
    }

    endShape()
}

// ====================================
// STATS
// ====================================

function drawStats(
    outsideCount,
    epsilon
) {

    const probability =
        outsideCount / NUM_PATHS

    noStroke()

    fill(10, 15, 30, 230)

    rect(
        40,
        610,
        940,
        70,
        18
    )

    fill(255)

    text(
        `P(|X̄ₙ - μ| > ε) ≈ ${probability.toFixed(4)}`,
        60,
        640
    )

    text(
        `ε = ${epsilon.toFixed(2)}`,
        60,
        665
    )

    text(
        `Trajectories outside interval: ${outsideCount}/${NUM_PATHS}`,
        400,
        640
    )

    text(
        `Samples per frame: ${speedSlider.value()}`,
        400,
        665
    )

    text(
        `Total samples: ${paths[0]?.n ?? 0}`,
        700,
        640
    )

    text(
        `FPS: ${floor(frameRate())}`,
        700,
        665
    )
}