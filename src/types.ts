import React from 'react'

export type ClickEventType =
  | React.MouseEvent<HTMLElement>
  | React.TouchEvent<HTMLElement>

export type Callbacks = {
  singleClick?: (e: ClickEventType) => void
  doubleClick?: (e: ClickEventType) => void
  longClick?: (e: ClickEventType) => void
}

export type Options = {
  isPreventDefault?: boolean
  delayDoubleClick?: number
  delayLongClick?: number
  disableContextMenu?: boolean
}