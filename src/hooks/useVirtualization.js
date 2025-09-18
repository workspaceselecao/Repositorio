import { useState, useEffect, useMemo, useCallback  } from 'react'

export function useVirtualization(
  items,
  options
) {
  const { itemHeight, containerHeight, overscan = 5 } = options
  const [scrollTop, setScrollTop] = useState(0)

  const totalHeight = items.length * itemHeight

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )

    return { startIndex, endIndex }
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan])

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1)
  }, [items, visibleRange.startIndex, visibleRange.endIndex])

  const offsetY = visibleRange.startIndex * itemHeight

  const scrollToIndex = useCallback((index) => {
    const targetScrollTop = index * itemHeight
    setScrollTop(targetScrollTop)
  }, [itemHeight])

  const scrollToTop = useCallback(() => {
    setScrollTop(0)
  }, [])

  const scrollToBottom = useCallback(() => {
    setScrollTop(totalHeight - containerHeight)
  }, [totalHeight, containerHeight])

  return {
    startIndex: visibleRange.startIndex,
    endIndex: visibleRange.endIndex,
    totalHeight,
    offsetY,
    visibleItems,
    scrollToIndex,
    scrollToTop,
    scrollToBottom
  }
}
