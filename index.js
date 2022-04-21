const items = document.querySelectorAll(".draggable")
let draggingEl
let elementWidth
let elementHeight
let clientX
let clientY
let placeholder
let isDraggingStarted = false

const handleMouseDown = (event) => {
  draggingEl = event.target

  elementWidth = draggingEl.offsetWidth
  elementHeight = draggingEl.offsetHeight
  clientX = event.clientX
  clientY = event.clientY

  document.addEventListener("mousemove", handleMouseMove)
  document.addEventListener("mouseup", handleMouseUp)
}

const handleMouseMove = (event) => {
  if (!isDraggingStarted) {
    isDraggingStarted = true
    // placeholder
    placeholder = document.createElement("div")
    placeholder.classList.add("placeholder")
    placeholder.style.width = `${elementWidth}px`
    placeholder.style.height = `${elementHeight}px`
    draggingEl.parentNode.insertBefore(placeholder, draggingEl.nextSibling)
  }
  draggingEl.style.position = "absolute"
  draggingEl.style.left = `${draggingEl.offsetLeft + event.clientX - clientX}px`
  draggingEl.style.top = `${draggingEl.offsetTop + event.clientY - clientY}px`

  clientX = event.clientX
  clientY = event.clientY
}

const handleMouseUp = () => {
  draggingEl = null
  elementWidth = null
  elementHeight = null
  clientX = null
  clientY = null
  isDraggingStarted = false

  document.removeEventListener("mousemove", handleMouseMove)
  document.removeEventListener("mouseup", handleMouseUp)
}

Array.from(items).forEach(item => {
  item.addEventListener("mousedown", handleMouseDown)
})