let c = document.getElementById("canvas")
let ctx = c.getContext("2d")
let width = c.scrollWidth
let height = c.scrollHeight
let mineImg = new Image()
mineImg.src = "mine.png"
let flagImg = new Image()
flagImg.src = "flag.png"
let x, y
let condition = false
let mines = []
let uncovered = []
let flagged = []
let cell = 15
let moves = 0
let minesAround = 1

ctx.strokeStyle = "black"
ctx.globalAlpha = 1
ctx.lineWidth = 1

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

//drawGrid()
function drawGrid() {
  for (let i = 1; i < cell; i++) {
    ctx.beginPath() //col
    ctx.moveTo((width / cell) * i + 0.5, 0)
    ctx.lineTo((width / cell) * i + 0.5, height)
    ctx.stroke()

    ctx.beginPath() //row
    ctx.moveTo(0, (height / cell) * i + 0.5)
    ctx.lineTo(width, (height / cell) * i + 0.5)
    ctx.stroke()
  }
}

function conditionFn(i, x, y) {
  if (i > 1) {
    condition = mines.some((e) => e.x == x && e.y == y)
  }
}

function createRndMine(num) {
  ctx.globalAlpha = 0.8
  for (let i = 0; i < num; i++) {
    //add one for dummy mine
    do {
      y = Math.round(getRandomInt(0, 450) / (width / cell)) * (width / cell)
      x = Math.round(getRandomInt(0, 450) / (width / cell)) * (width / cell)
      conditionFn(i, x, y)
    } while (condition)

    mines.push({
      x: x,
      y: y,
    })

    // ctx.drawImage(mineImg, mines[i].x, mines[i].y, width / box, width / box)
  }
}

createTiles()
function createTiles() {
  ctx.globalAlpha = 1

  for (let i = 0; i < cell; i++) {
    for (let j = 0; j < cell; j++) {
      if ((i + j) % 2 == 0) ctx.fillStyle = "#8ECC39"
      else ctx.fillStyle = "#A7D948"

      ctx.beginPath()
      ctx.fillRect(
        (width / cell) * i,
        (width / cell) * j,
        width / cell,
        width / cell
      )
      ctx.stroke()
    }
  }
  // drawGrid()
}

function onClick(e) {
  moves++
  minesAround = 0
  ctx.globalAlpha = 1
  let rect = c.getBoundingClientRect()
  let xC = e.clientX - rect.left
  let yC = e.clientY - rect.top
  let xRound = Math.floor(xC / (width / cell)) * (width / cell)
  let yRound = Math.floor(yC / (width / cell)) * (width / cell)
  uncovered.push({ x: xRound, y: yRound })

  if ((yRound / (width / cell) + xRound / (width / cell)) % 2 == 0)
    ctx.fillStyle = "#D7B899"
  else ctx.fillStyle = "#e6ccb3"

  if (moves == 1) {
    mines.push({ x: xRound, y: yRound })
    createRndMine(20)
    mines.shift() //removes first element (dummy)
  }

  ctx.beginPath()
  ctx.roundRect(xRound, yRound, width / cell, width / cell, 2)
  ctx.fill()

  if (mines.some((e) => xRound == e.x && yRound == e.y)) {
    //if clicked on a cell with mine
    ctx.drawImage(mineImg, xRound, yRound, width / cell, width / cell)
    // ctx.fillStyle = "black";
    // ctx.font = " bold 50px Arial";
    // ctx.fillText("OVER", width / 2, width / 2)
  } else {
    if (mines.some((e) => xRound + width / cell == e.x && yRound == e.y)) {
      minesAround++
    }
    if (mines.some((e) => xRound - width / cell == e.x && yRound == e.y)) {
      minesAround++
    }
    if (mines.some((e) => yRound + width / cell == e.y && xRound == e.x)) {
      minesAround++
    }
    if (mines.some((e) => yRound - width / cell == e.y && xRound == e.x)) {
      minesAround++
    }
    if (
      mines.some(
        (e) => xRound + width / cell == e.x && yRound + width / cell == e.y
      )
    ) {
      minesAround++
    }
    if (
      mines.some(
        (e) => xRound + width / cell == e.x && yRound - width / cell == e.y
      )
    ) {
      minesAround++
    }
    if (
      mines.some(
        (e) => xRound - width / cell == e.x && yRound + width / cell == e.y
      )
    ) {
      minesAround++
    }
    if (
      mines.some(
        (e) => xRound - width / cell == e.x && yRound - width / cell == e.y
      )
    ) {
      minesAround++
    }
    createNumbers(xRound, yRound)
  }
  // drawGrid()
}

function createNumbers(x, y) {
  switch (minesAround) {
    case 0:
      return
    case 1:
      ctx.fillStyle = "#1976D2"
      break
    case 2:
      ctx.fillStyle = "#388E3C"
      break
    case 3:
      ctx.fillStyle = "#D32F2F"
      break
    case 4:
      ctx.fillStyle = "#7B1FA2"
      break
    case 5:
      ctx.fillStyle = "#EDBD0D"
      break
    case 6:
      ctx.fillStyle = "#48E6F1"
      break
    case 7:
      ctx.fillStyle = "#ED44B5"
      break
    case 8:
      ctx.fillStyle = "orange"
      break
    default:
      ctx.fillStyle = "black"
      break
  }

  ctx.globalAlpha = 1
  ctx.font = "bold 28px Tahoma"
  let textWidth = ctx.measureText(minesAround).width
  ctx.fillText(minesAround, x + textWidth / 2 + 2, y + 30)
}

function createFlag(e) {
  const rect = c.getBoundingClientRect()
  const xR = e.clientX - rect.left
  const yR = e.clientY - rect.top
  let xRoundR = Math.floor(xR / (width / cell)) * (width / cell)
  let yRoundR = Math.floor(yR / (width / cell)) * (width / cell)

  if (!uncovered.some((e) => xRoundR == e.x && yRoundR == e.y)) {
    ctx.drawImage(flagImg, xRoundR, yRoundR, width / cell, width / cell)

    if (flagged.some((e) => xRoundR == e.x && yRoundR == e.y)) {
      flagged.splice(flagged.indexOf({ x: xRoundR, y: yRoundR }), 1)

      if ((yRoundR / (width / cell) + xRoundR / (width / cell)) % 2 == 0)
        ctx.fillStyle = "#8ECC39"
      else ctx.fillStyle = "#A7D948"

      ctx.beginPath()
      ctx.roundRect(xRoundR, yRoundR, width / cell, width / cell, 2)
      ctx.fill()
    } else flagged.push({ x: xRoundR, y: yRoundR })
  }
}

c.addEventListener("click", (e) => {
  onClick(e)
})

c.addEventListener("contextmenu", (e) => {
  createFlag(e)
})
