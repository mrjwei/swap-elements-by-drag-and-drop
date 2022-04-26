class SwapByDragAndDrop {
  constructor(elements, isTouchEvent) {
    this.elements = elements
    this.isTouchEvent = isTouchEvent
    this.startEvent = isTouchEvent === true ? "touchstart" : "mousedown"
    this.moveEvent = isTouchEvent === true ? "touchmove" : "mousemove"
    this.endEvent = isTouchEvent === true ? "touchend" : "mouseup"
    this.draggingEl = null
    this.elementWidth = null
    this.elementHeight = null
    this.elementY = null
    this.clientX = null
    this.clientY = null
    this.placeholder = null
    this.isDraggingStarted = false
    this.touch = null
    this.moveHandler = null
    this.endHandler = null
  }

  setPlaceholder = () => {
    this.placeholder = document.createElement("li")
  }

  configPlaceholder = () => {
    if (this.placeholder === null) return

    this.placeholder.classList.add("placeholder")
    this.placeholder.style.width = `${this.elementWidth}px`
    this.placeholder.style.height = `${this.elementHeight}px`
  }

  insertPlaceholder = () => {
    this.draggingEl.parentNode.insertBefore(this.placeholder, this.draggingEl.nextSibling)
  }

  swapElements = () => {
    Array.from(this.elements).forEach(element => {
      if (element !== this.draggingEl) {
        /**
         * if draggingEl overlaps with this element vertically,
         * swap this element with placeholder
         */
        if (element.offsetTop === this.draggingEl.offsetTop) {
          if (this.draggingEl.offsetTop < this.elementY) { // dragging upwards
            this.draggingEl.parentNode.insertBefore(this.placeholder, element)
          } else {
            this.draggingEl.parentNode.insertBefore(element, this.placeholder)
          }
        }
      }
    })
  }

  handleStart = (event) => {
    this.draggingEl = event.target

    this.draggingEl.style.color = "red"
    this.draggingEl.style.borderColor = "red"

    this.elementWidth = this.draggingEl.offsetWidth
    this.elementHeight = this.draggingEl.offsetHeight
    this.elementY = this.draggingEl.offsetTop

    this.moveHandler = this.handleMove
    this.endHandler = this.handleEnd

    if (this.isTouchEvent) {
      this.touch = event.changedTouches[0]
      this.clientX = this.touch.clientX
      this.clientY = this.touch.clientY
    } else {
      this.clientX = event.clientX
      this.clientY = event.clientY
    }

    document.addEventListener(this.moveEvent, this.moveHandler)
    document.addEventListener(this.endEvent, this.endHandler)
  }

  handleMove = (event) => {
    if (!this.isDraggingStarted) { // only create placeholder once
      this.isDraggingStarted = true

      this.setPlaceholder()
      this.configPlaceholder()
      this.insertPlaceholder()
    }

    this.draggingEl.style.position = "absolute"

    if (this.isTouchEvent) {
      this.touch = event.changedTouches[0]
      this.draggingEl.style.left = `${this.draggingEl.offsetLeft + this.touch.clientX - this.clientX}px`
      this.draggingEl.style.top = `${this.draggingEl.offsetTop + this.touch.clientY - this.clientY}px`
    } else {
      this.draggingEl.style.left = `${this.draggingEl.offsetLeft + event.clientX - this.clientX}px`
      this.draggingEl.style.top = `${this.draggingEl.offsetTop + event.clientY - this.clientY}px`
    }

    this.swapElements()

    if (this.isTouchEvent) {
      this.touch = event.changedTouches[0]
      this.clientX = this.touch.clientX
      this.clientY = this.touch.clientY
    } else {
      this.clientX = event.clientX
      this.clientY = event.clientY
    }
  }

  handleEnd = () => {
    if (this.isDraggingStarted) {
      this.draggingEl.style.removeProperty("top")
      this.draggingEl.style.removeProperty("left")
      this.draggingEl.style.removeProperty("position")

      // fix draggingEl at placeholder's current position
      this.draggingEl.parentNode.insertBefore(this.draggingEl, this.placeholder)

      this.placeholder && this.draggingEl.parentNode.removeChild(this.placeholder)
      this.placeholder = null

      this.isDraggingStarted = false
    }

    this.elementWidth = null
    this.elementHeight = null
    this.elementY = null
    this.clientX = null
    this.clientY = null
    this.touch = null

    /**
     * Falls back to styles specified in css and
     * hover styles applies properly.
     * Using:
     *   draggingEl.style.color = "grey"
     *   draggingEl.style.borderColor = "grey"
     * will override hover styles.
    */
    this.draggingEl.style.removeProperty("color")
    this.draggingEl.style.removeProperty("border-color")

    this.draggingEl = null

    document.removeEventListener(this.moveEvent, this.moveHandler)
    document.removeEventListener(this.endEvent, this.endHandler)

    this.moveHandler = null
    this.endHandler = null
  }
}

const handler = () => {
  const elements = document.querySelectorAll(".item")
  const swapByDragAndDropWithMouse = new SwapByDragAndDrop(elements, false)
  const swapByDragAndDropWithTouch = new SwapByDragAndDrop(elements, true)

  Array.from(elements).forEach(element => {
    element.addEventListener(swapByDragAndDropWithMouse.startEvent, swapByDragAndDropWithMouse.handleStart)
    element.addEventListener(swapByDragAndDropWithTouch.startEvent, swapByDragAndDropWithTouch.handleStart)
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", handler)
} else {
  handler()
}