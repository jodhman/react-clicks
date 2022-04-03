import { useEffect } from 'react'

type Props = {
  disableContextMenu?: boolean
}

export const useContextMenu = ({ disableContextMenu }: Props) => {
  const preventContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    return false
  }

  useEffect(() => {
    if (disableContextMenu) {
      document.body.addEventListener('contextmenu', preventContextMenu)
    }
    return () =>
      document.body.removeEventListener('contextmenu', preventContextMenu)
  }, [disableContextMenu])
}