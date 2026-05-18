const samples = []

// médias amostrais
const sampleMeans = []

let kSlider
let speedSlider

let distributionSelect

const HIST_X = 60
const HIST_Y = 100

const HIST_W = 900
const HIST_H = 320

// histograma das médias
const MEAN_HIST_Y = 470
const MEAN_HIST_H = 160

const NUM_BINS = 60

// tamanho da média amostral
const SAMPLE_MEAN_SIZE = 50

function setup() {

    const canvas =
        createCanvas(1020, 820)

    canvas.parent(
        "canvas-container"
    )

    frameRate(30)

    textFont("JetBrains Mono")

    textSize(15)

    // ====================================
    // sliders
    // ====================================

    kSlider =
        createSlider(0.5, 6, 2, 0.1)

    kSlider.parent(
        "k-slider"
    )

    speedSlider =
        createSlider(1, 5000, 100, 1)

    speedSlider.parent(
        "speed-slider"
    )

    distributionSelect =
        select("#distribution-select")
}

function draw() {

    background(2, 6, 23)

    const speed =
        speedSlider.value()

    // ====================================
    // gera amostras
    // ====================================

    for (let i = 0; i < speed; i++) {

        const value =
            generateSample()

        samples.push(value)
    }

    // ====================================
    // gera médias amostrais
    // ====================================

    for (let i = 0; i < speed; i++) {

        let sum = 0

        for (
            let j = 0;
            j < SAMPLE_MEAN_SIZE;
            j++
        ) {
            sum += generateSample()
        }

        sampleMeans.push(
            sum / SAMPLE_MEAN_SIZE
        )
    }

    // ====================================
    // limite memória
    // ====================================

    if (samples.length > 200000) {

        samples.splice(
            0,
            samples.length - 200000
        )
    }

    if (sampleMeans.length > 100000) {

        sampleMeans.splice(
            0,
            sampleMeans.length - 100000
        )
    }

    // ====================================
    // estatísticas população
    // ====================================

    const mean =
        computeMean(samples)

    const variance =
        computeVariance(
            samples,
            mean
        )

    const std =
        sqrt(variance)

    // ====================================
    // estatísticas médias amostrais
    // ====================================

    const sampleMeanMean =
        computeMean(sampleMeans)

    const sampleMeanVariance =
        computeVariance(
            sampleMeans,
            sampleMeanMean
        )

    const theoreticalVariance =
        variance / SAMPLE_MEAN_SIZE

    // ====================================
    // chebyshev
    // ====================================

    const k =
        kSlider.value()

    const lower =
        mean - k * std

    const upper =
        mean + k * std

    let outside = 0

    for (const x of samples) {

        if (
            x < lower ||
            x > upper
        ) {
            outside++
        }
    }

    const realProbability =
        outside / max(samples.length, 1)

    const chebyshevBound =
        1 / (k * k)

    // ====================================
    // draw
    // ====================================

    drawHistogram(
        samples,
        HIST_Y,
        HIST_H,
        mean,
        lower,
        upper,
        false
    )

    drawHistogram(
        sampleMeans,
        MEAN_HIST_Y,
        MEAN_HIST_H,
        sampleMeanMean,
        sampleMeanMean - k * sqrt(sampleMeanVariance),
        sampleMeanMean + k * sqrt(sampleMeanVariance),
        true
    )

    drawStats(
        mean,
        variance,
        std,
        realProbability,
        chebyshevBound,
        sampleMeanVariance,
        theoreticalVariance,
        k
    )
}

// ====================================
// SAMPLE GENERATION
// ====================================

function generateSample() {

    const mode =
        distributionSelect.value()

    // normal

    if (mode === "normal") {

        return randomGaussian(0, 1)
    }

    // uniforme

    if (mode === "uniform") {

        return random(-2, 2)
    }

    // exponencial

    if (mode === "exponential") {

        return -Math.log(1 - random())
    }

    // outliers

    if (mode === "outliers") {

        if (random() < 0.97) {

            return randomGaussian(0, 1)

        } else {

            return randomGaussian(0, 15)
        }
    }

    return 0
}

// ====================================
// HISTOGRAM
// ====================================

function drawHistogram(
    data,
    histY,
    histH,
    mean,
    lower,
    upper,
    isSampleMean
) {

    fill(8, 15, 30)

    stroke(255)

    rect(
        HIST_X,
        histY,
        HIST_W,
        histH,
        20
    )

    const bins =
        new Array(NUM_BINS).fill(0)

    const minX = -10
    const maxX = 10

    // ====================================
    // bins
    // ====================================

    for (const value of data) {

        const index =
            floor(
                map(
                    value,
                    minX,
                    maxX,
                    0,
                    NUM_BINS
                )
            )

        if (
            index >= 0 &&
            index < NUM_BINS
        ) {
            bins[index]++
        }
    }

    const maxBin =
        max(...bins, 1)

    // ====================================
    // barras
    // ====================================

    noStroke()

    for (let i = 0; i < NUM_BINS; i++) {

        const x =
            map(
                i,
                0,
                NUM_BINS,
                HIST_X,
                HIST_X + HIST_W
            )

        const h =
            map(
                bins[i],
                0,
                maxBin,
                0,
                histH - 20
            )

        const binCenter =
            map(
                i + 0.5,
                0,
                NUM_BINS,
                minX,
                maxX
            )

        if (
            binCenter >= lower &&
            binCenter <= upper
        ) {

            if (isSampleMean) {

                fill(
                    0,
                    180,
                    255,
                    180
                )

            } else {

                fill(
                    0,
                    255,
                    150,
                    180
                )
            }

        } else {

            fill(
                255,
                80,
                80,
                180
            )
        }

        rect(
            x,
            histY + histH - h,
            HIST_W / NUM_BINS - 2,
            h
        )
    }

    // ====================================
    // linhas
    // ====================================

    drawVerticalLine(
        mean,
        color(255,255,0),
        "μ",
        histY,
        histH
    )

    drawVerticalLine(
        lower,
        color(0,255,255),
        "-kσ",
        histY,
        histH
    )

    drawVerticalLine(
        upper,
        color(0,255,255),
        "+kσ",
        histY,
        histH
    )

    fill(255)

    noStroke()

    if (isSampleMean) {

        text(
            "Distribution of Sample Means",
            HIST_X + 20,
            histY - 15
        )

    } else {

        text(
            "Original Distribution",
            HIST_X + 20,
            histY - 15
        )
    }
}

// ====================================
// LINES
// ====================================

function drawVerticalLine(
    value,
    c,
    label,
    histY,
    histH
) {

    const minX = -10
    const maxX = 10

    const x =
        map(
            value,
            minX,
            maxX,
            HIST_X,
            HIST_X + HIST_W
        )

    stroke(c)

    line(
        x,
        histY,
        x,
        histY + histH
    )

    noStroke()

    fill(c)

    text(
        label,
        x + 5,
        histY + 20
    )
}

// ====================================
// STATS
// ====================================

function drawStats(
    mean,
    variance,
    std,
    realProbability,
    chebyshevBound,
    sampleMeanVariance,
    theoreticalVariance,
    k
) {

    noStroke()

    fill(10, 15, 30, 230)

    rect(
        40,
        640,
        940,
        190,
        18
    )

    // ====================================
    // EXPRESSÃO DA DESIGUALDADE
    // ====================================

    const inequalityText =
        `P(|X - ${mean.toFixed(2)}| ≥ ${k.toFixed(2)} · ${std.toFixed(2)}) ≤ ${(chebyshevBound).toFixed(4)}`

    fill(0, 255, 150)

    textAlign(CENTER)

    textSize(22)

    text(
        inequalityText,
        width / 2,
        680
    )

    // ====================================
    // PROBABILIDADE MEDIDA
    // ====================================

    fill(255)

    textSize(18)

    text(
        `Measured probability: ${realProbability.toFixed(4)}`,
        width / 2,
        715
    )

    // ====================================
    // VERIFICAÇÃO VISUAL
    // ====================================

    const valid =
        realProbability <= chebyshevBound

    if (valid) {

        fill(0,255,120)

        text(
            `✓ ${realProbability.toFixed(4)} ≤ ${chebyshevBound.toFixed(4)}`,
            width / 2,
            745
        )

    } else {

        fill(255,80,80)

        text(
            `✗ ${realProbability.toFixed(4)} > ${chebyshevBound.toFixed(4)}`,
            width / 2,
            745
        )
    }

    // ====================================
    // ESTATÍSTICAS
    // ====================================

    textAlign(LEFT)

    fill(255)

    textSize(15)

    // esquerda

    text(
        `Mean (μ): ${mean.toFixed(4)}`,
        70,
        780
    )

    text(
        `Variance (σ²): ${variance.toFixed(4)}`,
        70,
        805
    )

    text(
        `Std (σ): ${std.toFixed(4)}`,
        320,
        780
    )

    text(
        `k = ${k.toFixed(2)}`,
        320,
        805
    )

    // direita

    text(
        `Var(sample means): ${sampleMeanVariance.toFixed(5)}`,
        560,
        780
    )

    text(
        `σ² / n: ${theoreticalVariance.toFixed(5)}`,
        560,
        805
    )

    text(
        `Samples: ${samples.length}`,
        820,
        780
    )

    text(
        `FPS: ${floor(frameRate())}`,
        820,
        805
    )
}

// ====================================
// MATH
// ====================================

function computeMean(arr) {

    let sum = 0

    for (const x of arr) {
        sum += x
    }

    return sum / max(arr.length, 1)
}

function computeVariance(
    arr,
    mean
) {

    let sum = 0

    for (const x of arr) {

        const d = x - mean

        sum += d * d
    }

    return (
        sum / max(arr.length, 1)
    )
}