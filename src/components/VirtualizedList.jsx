'use client'

import { useState, useEffect, useMemo } from 'react'

export default function VirtualizedList({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5
}) {
  const [scrollTop, setScrollTop] = useState(0)

  const totalHeight = items.length * itemHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = useMemo(() => {
    const result = []
    for (let i = startIndex; i <= endIndex; i++) {
      if (items[i]) {
        result.push({
          index: i,
          item: items[i],
          style: {
            position: 'absolute',
            top: i * itemHeight,
            left: 0,
            right: 0,
            height: itemHeight
          }
        })
      }
    }
    return result
  }, [items, startIndex, endIndex, itemHeight])

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop)
  }

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${startIndex * itemHeight}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map(({ index, item, style }) => (
            <div key={index} style={style}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}