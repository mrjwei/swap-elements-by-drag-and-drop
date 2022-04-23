function createPlaceholder() {
  return document.createElement("li")
}

function configPlaceholder(placeholderEl, width, height) {
  placeholderEl.classList.add("placeholder")
  placeholderEl.style.width = `${width}px`
  placeholderEl.style.height = `${height}px`
}

function insertPlaceholder(draggingEl, placeholderEl) {
  draggingEl.parentNode.insertBefore(placeholderEl, draggingEl.nextSibling)
}

function swapElements(
  elements,
  draggingEl,
  draggingElInitOffsetTop,
  placeholderEl
) {
  Array.from(elements).forEach(element => {
    if (element !== draggingEl) {
      // checking overlapping is easier than checking position
      if (element.offsetTop === draggingEl.offsetTop) {
        // swap placeholder and element positions
        if (draggingEl.offsetTop < draggingElInitOffsetTop) { // dragging upwards
          draggingEl.parentNode.insertBefore(placeholderEl, element)
        } else {
          draggingEl.parentNode.insertBefore(element, placeholderEl)
        }
      }
    }
  })
}

function swapElementsByDragAndDrop() {
  const items = document.querySelectorAll(".item")
  let draggingEl
  let elementWidth
  let elementHeight
  let elementY
  let clientX
  let clientY
  let placeholder
  let isDraggingStarted = false

  const handleMouseDown = (event) => {
    draggingEl = event.target

    elementWidth = draggingEl.offsetWidth
    elementHeight = draggingEl.offsetHeight
    elementY = draggingEl.offsetTop
    clientX = event.clientX
    clientY = event.clientY

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (event) => {
    if (!isDraggingStarted) { // only create placeholder once
      isDraggingStarted = true

      placeholder = createPlaceholder()
      configPlaceholder(placeholder, elementWidth, elementHeight)
      insertPlaceholder(draggingEl, placeholder)
    }
    draggingEl.style.position = "absolute"
    draggingEl.style.left = `${draggingEl.offsetLeft + event.clientX - clientX}px`
    draggingEl.style.top = `${draggingEl.offsetTop + event.clientY - clientY}px`

    // check if Y position of draggingEl
    // overlaps with another element
    swapElements(
      items,
      draggingEl,
      elementY,
      placeholder
    )

    clientX = event.clientX
    clientY = event.clientY
  }

  const handleMouseUp = () => {
    if (isDraggingStarted) {
      // fix draggingEl at placeholder's current position
      draggingEl.style.removeProperty("top")
      draggingEl.style.removeProperty("left")
      draggingEl.style.removeProperty("position")
      draggingEl.parentNode.insertBefore(draggingEl, placeholder)
      // remove placeholder
      placeholder && draggingEl.parentNode.removeChild(placeholder)

      draggingEl = null
      elementWidth = null
      elementHeight = null
      clientX = null
      clientY = null
      isDraggingStarted = false
    }

    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  Array.from(items).forEach(item => {
    item.addEventListener("mousedown", handleMouseDown)
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", swapElementsByDragAndDrop)
} else {
  swapElementsByDragAndDrop()
}