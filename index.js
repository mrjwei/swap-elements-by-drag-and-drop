const items = document.querySelectorAll(".draggable")
let draggingEl
let clientX
let clientY

const handleMouseDown = (event) => {
  draggingEl = event.target

  clientX = event.clientX
  clientY = event.clientY

  document.addEventListener("mousemove", handleMouseMove)
  document.addEventListener("mouseup", handleMouseUp)
}

const handleMouseMove = (event) => {
  draggingEl.style.position = "absolute"
  draggingEl.style.left = `${draggingEl.offsetLeft + event.clientX - clientX}px`
  draggingEl.style.top = `${draggingEl.offsetTop + event.clientY - clientY}px`

  clientX = event.clientX
  clientY = event.clientY
}

const handleMouseUp = () => {
  draggingEl = null
  clientX = null
  clientY = null

  document.removeEventListener("mousemove", handleMouseMove)
  document.removeEventListener("mouseup", handleMouseUp)
}

Array.from(items).forEach(item => {
  item.addEventListener("mousedown", handleMouseDown)
})