const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const hint = document.getElementById("hint")
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
let hearts = []
let stars = []
let time = 0
let firstTouch = true

/* 🌇 AKŞAM ÜSTÜ ARKA PLAN */
function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height)
  g.addColorStop(0, "#3a0f2a")
  g.addColorStop(0.55, "#ff8c42")
  g.addColorStop(1, "#1b3a2b")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

/* 🌙 YILDIZLAR */
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
  ctx.fillStyle = "#ffffff"
  stars.forEach(s => {
    ctx.globalAlpha = s.o
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalAlpha = 1
}

/* 🎨 ÇİMEN RENKLERİ */
const GRASS_COLORS = ["#2f8f46", "#3fa34d", "#4caf50", "#5cbf70"]

/* 🌱 GERÇEKÇİ ÇİMEN */
class Grass {
  constructor(x) {
    this.x = x + (Math.random() - 0.5) * 80
    this.baseY = canvas.height
    this.height = 25 + Math.random() * 45
    this.curve = (Math.random() - 0.5) * 20
    this.offset = Math.random() * Math.PI * 2
    this.color = GRASS_COLORS[Math.floor(Math.random() * GRASS_COLORS.length)]
    this.width = Math.random() * 1.5 + 0.5
  }

  draw() {
    const sway = Math.sin(time + this.offset) * 3
    ctx.strokeStyle = this.color
    ctx.lineWidth = this.width
    ctx.beginPath()
    ctx.moveTo(this.x, this.baseY)
    ctx.quadraticCurveTo(
      this.x + this.curve + sway,
      this.baseY - this.height / 2,
      this.x + sway,
      this.baseY - this.height
    )
    ctx.stroke()
  }
}

/* 🎨 ÇİÇEK RENKLERİ */
const COLORS = [
  "#ff5fa2", "#ff6b6b", "#f72585",
  "#c77dff", "#9d4edd", "#ff8fab",
  "#ffb3c1", "#ffd6e0", "#ff9f1c"
]

/* 🌸 SOYUT ÇİÇEK */
class Flower {
  constructor(x) {
    this.x = x
    this.baseY = canvas.height
    this.height = 160 + Math.random() * 180
    this.progress = 0
    this.curve = (Math.random() - 0.5) * 140
    this.swing = Math.random() * Math.PI * 2
    this.petals = 5 + Math.floor(Math.random() * 5)
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
  }

  draw() {
    const sway = Math.sin(time + this.swing) * 6
    const topY = this.baseY - this.height * this.progress

    ctx.strokeStyle = "#4caf50"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(this.x, this.baseY)
    ctx.quadraticCurveTo(
      this.x + this.curve + sway,
      this.baseY - this.height / 2,
      this.x + sway,
      topY
    )
    ctx.stroke()

    if (this.progress > 0.6) {
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
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(this.x + sway, topY, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1

      ctx.fillStyle = "#ffd166"
      ctx.beginPath()
      ctx.arc(this.x + sway, topY, 5, 0, Math.PI * 2)
      ctx.fill()
    }

    if (this.progress < 1) this.progress += 0.02
  }
}

/* 💓 KALP */
class Heart {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.life = 1
  }
  draw() {
    this.y -= 1
    this.life -= 0.02
    ctx.globalAlpha = this.life
    ctx.fillStyle = "#ff5fa2"
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.bezierCurveTo(this.x - 6, this.y - 6, this.x - 12, this.y + 6, this.x, this.y + 12)
    ctx.bezierCurveTo(this.x + 12, this.y + 6, this.x + 6, this.y - 6, this.x, this.y)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

/* 👉 DOKUNMA */
document.addEventListener("pointerdown", e => {
  hint.classList.add("hidden")

  if (firstTouch) {
    pop.volume = 0.25
    firstTouch = false
  }
  pop.currentTime = 0
  pop.play().catch(() => {})
  if (navigator.vibrate) navigator.vibrate(15)

  const baseX = e.clientX

  // 🌱 DAHA SIK ÇİMEN
  for (let i = 0; i < 24; i++) {
    grasses.push(new Grass(baseX))
  }

  // 🌸 4–5 çiçek
  const count = 4 + Math.floor(Math.random() * 2)
  for (let i = 0; i < count; i++) {
    flowers.push(
      new Flower(baseX + (Math.random() - 0.5) * 120)
    )
  }

  hearts.push(new Heart(baseX, canvas.height - 240))
})

/* 🔁 LOOP */
function loop() {
  drawBackground()
  drawStars()
  time += 0.02

  grasses.forEach(g => g.draw())
  flowers.forEach(f => f.draw())

  hearts = hearts.filter(h => h.life > 0)
  hearts.forEach(h => h.draw())

  requestAnimationFrame(loop)
}
loop()