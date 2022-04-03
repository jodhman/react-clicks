import React, { useCallback, useEffect, useRef } from 'react'

import { eventPreventDefault, noop } from './utils'

export type ClickEventType =
  | React.MouseEvent<HTMLElement>
  | React.TouchEvent<HTMLElement>

interface Callbacks {
  singleClick?: (e: ClickEventType) => void
  doubleClick?: (e: ClickEventType) => void
  longClick?: (e: ClickEventType) => void
}

interface Options {
  isPreventDefault?: boolean
  delayDoubleClick?: number
  delayLongClick?: number
  disableContextMenu?: boolean
}

export const useClicks = (
  { singleClick = noop, doubleClick = noop, longClick = noop }: Callbacks,
  {
    isPreventDefault = true,
    delayLongClick = 300,
    delayDoubleClick = 200,
    disableContextMenu = true,
  }: Options = {}
) => {
  const timeoutLongClick = useRef<number>()
  const timeoutDoubleClick = useRef<number>()
  const target = useRef<EventTarget>()
  const numberOfClicks = useRef<number>(0)
  const isSwiping = useRef<boolean>(false)

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

    if (isPreventDefault && target.current) {
      target.current.removeEventListener('touchend', eventPreventDefault)
    }
  }, [isPreventDefault])

  const handleMouseDown = useCallback(
    (event: ClickEventType) => {
      const preventMobileGhostClick = (event: ClickEventType) => {
        // prevent ghost click on mobile devices
        if (isPreventDefault && event.target) {
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
      isPreventDefault,
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

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    return false
  }

  useEffect(() => {
    if (disableContextMenu) {
      document.body.addEventListener('contextmenu', handleContextMenu)
    }
    return () =>
      document.body.removeEventListener('contextmenu', handleContextMenu)
  }, [disableContextMenu])

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