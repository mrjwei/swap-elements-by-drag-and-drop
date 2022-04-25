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

function animateDraggingElIn(draggingEl) {
  return draggingEl.animate(
    [
      {color: "grey", borderColor: "grey"},
      {color: "red", borderColor: "red"}
    ],
    {
      duration: 200,
      fill: 'forwards',
      easing: "ease-in"
    }
  )
}

function animateDraggingElOut(draggingEl) {
  return draggingEl.animate(
    [
      {color: "red", borderColor: "red"},
      {color: "grey", borderColor: "grey"}
    ],
    {
      duration: 200,
      fill: 'forwards',
      easing: "ease-in"
    }
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
  let touch
  let moveHandler
  let endHandler
  let inAnimation
  let outAnimation

  const handleStart = (isTouchEvent = false) => {
    return (event) => {
      draggingEl = event.target

      elementWidth = draggingEl.offsetWidth
      elementHeight = draggingEl.offsetHeight
      elementY = draggingEl.offsetTop

      inAnimation = animateDraggingElIn(draggingEl)

      if (isTouchEvent) {
        touch = event.changedTouches[0]
        moveHandler = handleMove(true)
        endHandler = handleEnd(true)
        clientX = touch.clientX
        clientY = touch.clientY
        document.addEventListener("touchmove", moveHandler)
        document.addEventListener("touchend", endHandler)
      } else {
        clientX = event.clientX
        clientY = event.clientY
        moveHandler = handleMove()
        endHandler = handleEnd()
        document.addEventListener("mousemove", moveHandler)
        document.addEventListener("mouseup", endHandler)
      }
    }
  }

  const handleMove = (isTouchEvent = false) => {
    return (event) => {
      if (!isDraggingStarted) { // only create placeholder once
        isDraggingStarted = true

        placeholder = createPlaceholder()
        configPlaceholder(placeholder, elementWidth, elementHeight)
        insertPlaceholder(draggingEl, placeholder)
      }

      draggingEl.style.position = "absolute"

      if (isTouchEvent) {
        touch = event.changedTouches[0]
        draggingEl.style.left = `${draggingEl.offsetLeft + touch.clientX - clientX}px`
        draggingEl.style.top = `${draggingEl.offsetTop + touch.clientY - clientY}px`
      } else {
        draggingEl.style.left = `${draggingEl.offsetLeft + event.clientX - clientX}px`
        draggingEl.style.top = `${draggingEl.offsetTop + event.clientY - clientY}px`
      }

      swapElements(
        items,
        draggingEl,
        elementY,
        placeholder
      )

      if (isTouchEvent) {
        touch = event.changedTouches[0]
        clientX = touch.clientX
        clientY = touch.clientY
      } else {
        clientX = event.clientX
        clientY = event.clientY
      }
    }
  }

  const handleEnd = (isTouchEvent = false) => {
    return (event) => {
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

      if (isTouchEvent) {
        document.removeEventListener("touchmove", moveHandler)
        document.removeEventListener("touchend", endHandler)
      } else {
        document.removeEventListener("mousemove", moveHandler)
        document.removeEventListener("mouseup", endHandler)
      }

      inAnimation.finished
        .then(() => {
          outAnimation = animateDraggingElOut(draggingEl)
          outAnimation.finished
            .then(() => {
              draggingEl = null
          })
        })

      elementWidth = null
      elementHeight = null
      elementY = null
      clientX = null
      clientY = null
      touch = null
      moveHandler = null
      endHandler = null
    }
  }

  Array.from(items).forEach(item => {
    item.addEventListener("mousedown", handleStart())
    item.addEventListener("touchstart", handleStart(true))
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", swapElementsByDragAndDrop)
} else {
  swapElementsByDragAndDrop()
}