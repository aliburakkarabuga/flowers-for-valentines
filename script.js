const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const hint = document.getElementById("hint")
const loveText = document.getElementById("loveText")
const pop = document.getElementById("pop")

function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  drawBackground()
}
window.addEventListener("resize", resize)
resize()

let flowers = []
let grasses = []
let stars = []
let time = 0
let totalClicks = 0

/* 🌇 Akşam üstü arka plan */
function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height)
  g.addColorStop(0, "#3a0f2a")
  g.addColorStop(0.55, "#ff8c42")
  g.addColorStop(1, "#1b3a2b")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

/* 🌙 Yıldızlar */
function createStars() {
  stars = []
  for (let i = 0; i < 40; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.35,
      r: Math.random() * 1.5 + 0.5,
      o: Math.random() * 0.5 + 0.2
    })
  }
}
createStars()

function drawStars() {
  stars.forEach(s => {
    ctx.globalAlpha = s.o
    ctx.fillStyle = "#fff"
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalAlpha = 1
}

/* 🌱 Çimen */
const GRASS_COLORS = ["#2f8f46", "#3fa34d", "#4caf50", "#5cbf70"]

class Grass {
  constructor(x) {
    this.x = x + (Math.random() - 0.5) * 80
    this.h = 25 + Math.random() * 45
    this.curve = (Math.random() - 0.5) * 20
    this.offset = Math.random() * Math.PI * 2
    this.color = GRASS_COLORS[Math.floor(Math.random() * GRASS_COLORS.length)]
    this.w = Math.random() * 1.5 + 0.5
  }
  draw() {
    const sway = Math.sin(time + this.offset) * 3
    ctx.strokeStyle = this.color
    ctx.lineWidth = this.w
    ctx.beginPath()
    ctx.moveTo(this.x, canvas.height)
    ctx.quadraticCurveTo(
      this.x + this.curve + sway,
      canvas.height - this.h / 2,
      this.x + sway,
      canvas.height - this.h
    )
    ctx.stroke()
  }
}

/* 🌸 Çiçek */
const COLORS = [
  "#ff5fa2", "#ff6b6b", "#f72585",
  "#c77dff", "#9d4edd", "#ff8fab",
  "#ffb3c1", "#ffd6e0", "#ff9f1c"
]

class Flower {
  constructor(x) {
    this.x = x
    this.h = 160 + Math.random() * 180
    this.p = 0
    this.curve = (Math.random() - 0.5) * 140
    this.swing = Math.random() * Math.PI * 2
    this.petals = 5 + Math.floor(Math.random() * 5)
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
  }

  draw() {
    const sway = Math.sin(time + this.swing) * 6
    const topY = canvas.height - this.h * this.p

    ctx.strokeStyle = "#4caf50"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(this.x, canvas.height)
    ctx.quadraticCurveTo(
      this.x + this.curve + sway,
      canvas.height - this.h / 2,
      this.x + sway,
      topY
    )
    ctx.stroke()

    if (this.p > 0.6) {
      ctx.fillStyle = this.color
      for (let i = 0; i < this.petals; i++) {
        const a = (Math.PI * 2 / this.petals) * i
        ctx.beginPath()
        ctx.arc(
          this.x + Math.cos(a) * 12 + sway,
          topY + Math.sin(a) * 12,
          7,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }

      ctx.globalAlpha = 0.25
      ctx.beginPath()
      ctx.arc(this.x + sway, topY, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1

      ctx.fillStyle = "#ffd166"
      ctx.beginPath()
      ctx.arc(this.x + sway, topY, 5, 0, Math.PI * 2)
      ctx.fill()
    }

    if (this.p < 1) this.p += 0.02
  }
}

/* 👉 Dokunma */
document.addEventListener("pointerdown", e => {
  totalClicks++

  // 1. tık → giriş yazısı gider
  if (totalClicks === 1) {
    hint.classList.add("hidden")
    return
  }

  // 3. tık → seni seviyorum görünür
  if (totalClicks === 3) {
    loveText.classList.add("show")
  }

  const x = e.clientX

  for (let i = 0; i < 24; i++) grasses.push(new Grass(x))

  const count = 4 + Math.floor(Math.random() * 2)
  for (let i = 0; i < count; i++) {
    flowers.push(new Flower(x + (Math.random() - 0.5) * 120))
  }
})

/* 🔁 Loop */
function loop() {
  drawBackground()
  drawStars()
  time += 0.02

  grasses.forEach(g => g.draw())
  flowers.forEach(f => f.draw())

  requestAnimationFrame(loop)
}
loop()
