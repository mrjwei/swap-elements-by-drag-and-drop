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

function animateDraggingEl(draggingEl) {
  return draggingEl.animate(
    [
      {color: "grey", borderColor: "grey"},
      {color: "red", borderColor: "red"},
      {color: "grey", borderColor: "grey"},
    ],
    1000
  )
}

function swapElements(
  elements,
  draggingEl,
  draggingElInitOffsetTop,
  placeholderEl
) {
  Array.from(elements).forEach(element => {
    if (element !== draggingEl) {
      /**
       * if draggingEl overlaps with this element vertically,
       * swap this element with placeholder
       */
      if (element.offsetTop === draggingEl.offsetTop) {
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

    draggingEl.style.color = "red"
    draggingEl.style.borderColor = "red"

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
      draggingEl.style.removeProperty("top")
      draggingEl.style.removeProperty("left")
      draggingEl.style.removeProperty("position")

      // fix draggingEl at placeholder's current position
      draggingEl.parentNode.insertBefore(draggingEl, placeholder)

      placeholder && draggingEl.parentNode.removeChild(placeholder)
      placeholder = null

      isDraggingStarted = false
    }

    elementWidth = null
    elementHeight = null
    elementY = null
    clientX = null
    clientY = null

    /**
     * Falls back to styles specified in css and
     * hover styles applies properly.
     * Using:
     *   draggingEl.style.color = "grey"
     *   draggingEl.style.borderColor = "grey"
     * will override hover styles.
    */
    draggingEl.style.removeProperty("color")
    draggingEl.style.removeProperty("border-color")

    draggingEl = null

    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const handleTouchStart = (event) => {
    draggingEl = event.target

    const touch = event.changedTouches[0]

    elementWidth = draggingEl.offsetWidth
    elementHeight = draggingEl.offsetHeight
    elementY = draggingEl.offsetTop
    clientX = touch.clientX
    clientY = touch.clientY

    draggingEl.style.color = "red"
    draggingEl.style.borderColor = "red"

    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchUp)
  }

  const handleTouchMove = (event) => {
    const touch = event.changedTouches[0]

    if (!isDraggingStarted) { // only create placeholder once
      isDraggingStarted = true

      placeholder = createPlaceholder()
      configPlaceholder(placeholder, elementWidth, elementHeight)
      insertPlaceholder(draggingEl, placeholder)
    }
    draggingEl.style.position = "absolute"
    draggingEl.style.left = `${draggingEl.offsetLeft + touch.clientX - clientX}px`
    draggingEl.style.top = `${draggingEl.offsetTop + touch.clientY - clientY}px`

    swapElements(
      items,
      draggingEl,
      elementY,
      placeholder
    )

    clientX = touch.clientX
    clientY = touch.clientY
  }

  const handleTouchUp = (event) => {
    if (isDraggingStarted) {
      draggingEl.style.removeProperty("top")
      draggingEl.style.removeProperty("left")
      draggingEl.style.removeProperty("position")

      // fix draggingEl at placeholder's current position
      draggingEl.parentNode.insertBefore(draggingEl, placeholder)

      placeholder && draggingEl.parentNode.removeChild(placeholder)
      placeholder = null

      isDraggingStarted = false
    }

    elementWidth = null
    elementHeight = null
    elementY = null
    clientX = null
    clientY = null

    /**
     * Falls back to styles specified in css and
     * hover styles applies properly.
     * Using:
     *   draggingEl.style.color = "grey"
     *   draggingEl.style.borderColor = "grey"
     * will override hover styles.
    */
    draggingEl.style.removeProperty("color")
    draggingEl.style.removeProperty("border-color")

    draggingEl = null

    document.removeEventListener("touchmove", handleTouchMove)
    document.removeEventListener("touchend", handleTouchUp)
  }

  Array.from(items).forEach(item => {
    item.addEventListener("mousedown", handleMouseDown)
    item.addEventListener("touchstart", handleTouchStart)
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", swapElementsByDragAndDrop)
} else {
  swapElementsByDragAndDrop()
}