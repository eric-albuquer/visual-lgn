// ====================================
// ESTADO
// ====================================

let inside = 0
let total = 0

let history = []

let speedSlider
let pauseButton
let resetButton

let paused = false

const centerX = 300
const centerY = 350
const radius = 250

// ====================================
// SETUP
// ====================================

function setup() {

    const canvas = createCanvas(1000, 700)

    canvas.parent("canvas-container")

    textFont("JetBrains Mono")

    textSize(18)

    // ====================================
    // Fundo fixo
    // ====================================

    drawStaticScene()

    // ====================================
    // Slider
    // ====================================

    speedSlider = createSlider(
        1,      // mínimo
        10000,  // máximo
        1,      // inicial
        1       // step
    )

    speedSlider.parent(
        document.querySelector(".controls")
    )

    // ====================================
    // Pause
    // ====================================

    pauseButton = createButton("Pause")

    pauseButton.parent(
        document.querySelector(".controls")
    )

    pauseButton.mousePressed(() => {

        paused = !paused

        pauseButton.html(
            paused ? "Resume" : "Pause"
        )
    })

    // ====================================
    // Reset
    // ====================================

    resetButton = createButton("Reset")

    resetButton.parent(
        document.querySelector(".controls")
    )

    resetButton.mousePressed(resetSimulation)
}

// ====================================
// FUNDO ESTÁTICO
// ====================================

function drawStaticScene() {

    background(0)

    // gradiente

    for (let y = 0; y < height; y += 2) {

        const inter = map(y, 0, height, 0, 1)

        const c = lerpColor(
            color(5, 10, 20),
            color(0, 0, 0),
            inter
        )

        stroke(c)

        line(0, y, width, y)
    }

    // quadrado

    stroke(255)

    strokeWeight(2)

    noFill()

    rect(
        centerX - radius,
        centerY - radius,
        radius * 2,
        radius * 2
    )

    // círculo

    stroke(100, 150, 255)

    circle(
        centerX,
        centerY,
        radius * 2
    )
}

// ====================================
// RESET
// ====================================

function resetSimulation() {

    inside = 0
    total = 0

    history = []

    drawStaticScene()
}

// ====================================
// DRAW
// ====================================

function draw() {

    const samplesPerFrame =
        speedSlider.value()

    // ====================================
    // Monte Carlo
    // ====================================

    if (!paused) {

        noStroke()

        const pointSize = map(
            Math.log10(samplesPerFrame),
            0,
            Math.log10(10000),
            4,
            1
        )

        for (let i = 0; i < samplesPerFrame; i++) {

            const x = random(
                centerX - radius,
                centerX + radius
            )

            const y = random(
                centerY - radius,
                centerY + radius
            )

            const dx = x - centerX
            const dy = y - centerY

            const isInside =
                dx * dx + dy * dy <= radius * radius

            if (isInside) {

                fill(0, 255, 120, 180)

                inside++

            } else {

                fill(255, 80, 80, 180)
            }

            total++

            rect(
                x,
                y,
                pointSize,
                pointSize
            )
        }
    }

    // ====================================
    // Estatísticas
    // ====================================

    const estimate =
        4 * inside / max(total, 1)

    const error =
        abs(Math.PI - estimate)

    const predictedError =
        1 / sqrt(max(total, 1))

    // histórico atualizado menos vezes

    if (frameCount % 5 === 0 && !paused) {

        history.push(estimate)

        if (history.length > 1000) {
            history.shift()
        }
    }

    // ====================================
    // Limpa apenas a UI
    // ====================================

    clearUIArea()

    // ====================================
    // Redesenha UI
    // ====================================

    drawUIPanel(
        estimate,
        error,
        predictedError,
        samplesPerFrame
    )

    drawGraph()

    drawFPS()
}

// ====================================
// LIMPA ÁREA UI
// ====================================

function clearUIArea() {

    noStroke()

    // painel esquerdo

    fill(0, 0, 0)

    rect(10, 10, 480, 300)

    // gráfico

    rect(600, 40, 360, 580)

    // fps

    rect(0, height - 40, 150, 40)
}

// ====================================
// PAINEL UI
// ====================================

function drawUIPanel(
    estimate,
    error,
    predictedError,
    samplesPerFrame
) {

    noStroke()

    fill(10, 10, 20, 230)

    rect(20, 20, 450, 280, 18)

    fill(255)

    text(
        `Estimativa π: ${estimate.toFixed(10)}`,
        40,
        60
    )

    text(
        `PI real: ${Math.PI.toFixed(10)}`,
        40,
        95
    )

    text(
        `Erro absoluto: ${error.toExponential(4)}`,
        40,
        130
    )

    text(
        `Erro previsto: ${predictedError.toExponential(4)}`,
        40,
        165
    )

    text(
        `Pontos totais: ${total}`,
        40,
        200
    )

    text(
        `Pontos/frame: ${samplesPerFrame}`,
        40,
        235
    )

    // barra erro

    fill(40)

    rect(40, 255, 320, 16, 8)

    const errorBar = constrain(
        map(error, 0, 0.2, 0, 320),
        0,
        320
    )

    fill(255, 80, 80)

    rect(40, 255, errorBar, 16, 8)
}

// ====================================
// GRÁFICO
// ====================================

function drawGraph() {

    const graphX = 620
    const graphY = 80

    const graphW = 330
    const graphH = 520

    fill(5, 5, 10, 230)

    stroke(255)

    rect(
        graphX,
        graphY,
        graphW,
        graphH,
        18
    )

    // linha PI real

    const piY = map(
        Math.PI,
        2.5,
        4,
        graphY + graphH,
        graphY
    )

    stroke(255, 255, 0)

    line(
        graphX,
        piY,
        graphX + graphW,
        piY
    )

    noStroke()

    fill(255, 255, 0)

    text(
        "PI real",
        graphX + 10,
        piY - 10
    )

    // curva

    noFill()

    stroke(0, 255, 255)

    strokeWeight(2)

    beginShape()

    for (let i = 0; i < history.length; i++) {

        const x = map(
            i,
            0,
            history.length - 1,
            graphX,
            graphX + graphW
        )

        const y = map(
            history[i],
            2.5,
            4,
            graphY + graphH,
            graphY
        )

        vertex(x, y)
    }

    endShape()

    fill(255)

    noStroke()

    text(
        "Convergência de π",
        graphX + 50,
        graphY - 25
    )
}

// ====================================
// FPS
// ====================================

function drawFPS() {

    fill(180)

    noStroke()

    text(
        `FPS: ${floor(frameRate())}`,
        20,
        height - 20
    )
}