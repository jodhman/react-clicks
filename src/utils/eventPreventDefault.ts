const isTouchEvent = (ev: Event): ev is TouchEvent => 'touches' in ev

export const eventPreventDefault = (ev: Event) => {
  if (!isTouchEvent(ev)) return

  if (ev.touches.length < 2 && ev.preventDefault) {
    ev.preventDefault()
  }
}