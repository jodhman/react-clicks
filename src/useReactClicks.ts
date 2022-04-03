import { useCallback, useRef } from 'react'

import { eventPreventDefault, noop } from './utils'
import { Callbacks, ClickEventType, Options } from './types'
import { useContextMenu } from './useContextMenu'

export const useReactClicks = (
  { singleClick = noop, doubleClick = noop, longClick = noop }: Callbacks,
  {
    delayLongClick = 300,
    delayDoubleClick = 200,
    disableContextMenu = true,
  }: Options = {}
) => {
  const numberOfClicks = useRef<number>(0)
  const isSwiping = useRef<boolean>(false)

  const timeoutLongClick = useRef<number>()
  const timeoutDoubleClick = useRef<number>()
  const target = useRef<EventTarget>()

  useContextMenu({ disableContextMenu })

  const singleClickHandler = useCallback(
    (event: ClickEventType) => {
      if (numberOfClicks.current === 1) {
        singleClick(event)
        numberOfClicks.current = 0
      }
    },
    [singleClick]
  )

  const longClickHandler = useCallback(
    (event: ClickEventType) => {
      if (isSwiping.current) {
        return
      }
      longClick(event)
      numberOfClicks.current = 0
    },
    [longClick]
  )

  const clearLongClick = useCallback(() => {
    if (timeoutLongClick.current) {
      clearTimeout(timeoutLongClick.current)
    }

    if (target.current) {
      target.current.removeEventListener('touchend', eventPreventDefault)
    }
  }, [])

  const handleMouseDown = useCallback(
    (event: ClickEventType) => {
      const preventMobileGhostClick = (event: ClickEventType) => {
        // prevent ghost click on mobile devices
        if (event.target) {
          event.target.addEventListener('touchend', eventPreventDefault, {
            passive: false,
          })
          target.current = event.target
        }
      }

      isSwiping.current = false
      numberOfClicks.current = numberOfClicks.current + 1
      if (numberOfClicks.current === 2) {
        clearLongClick()
        if (timeoutDoubleClick.current) {
          clearTimeout(timeoutDoubleClick.current)
        }
        numberOfClicks.current = 0
        return doubleClick(event)
      }
      preventMobileGhostClick(event)
      timeoutLongClick.current = window.setTimeout(
        () => longClickHandler(event),
        delayLongClick
      )
    },
    [
      longClickHandler,
      doubleClick,
      clearLongClick,
      delayLongClick,
    ]
  )

  const handleMouseUp = (event: ClickEventType) => {
    clearLongClick()
    isSwiping.current = false
    if (numberOfClicks.current === 1) {
      timeoutDoubleClick.current = window.setTimeout(
        () => singleClickHandler(event),
        delayDoubleClick
      )
    }
  }

  const handleTouchStart = useCallback(
    (event: ClickEventType) => {
      isSwiping.current = false
      if (numberOfClicks.current === 1) {
        timeoutDoubleClick.current = window.setTimeout(
          () => singleClickHandler(event),
          delayDoubleClick
        )
      }
      timeoutLongClick.current = window.setTimeout(
        () => longClickHandler(event),
        delayLongClick
      )
    },
    [delayDoubleClick, delayLongClick, longClickHandler, singleClickHandler]
  )

  const handleTouchEnd = () => {
    clearLongClick()
    isSwiping.current = false
  }

  const handleMouseMove = () => {
    isSwiping.current = true
  }

  const handleTouchMove = () => {
    isSwiping.current = true
  }

  return {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: clearLongClick,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  } as const
}