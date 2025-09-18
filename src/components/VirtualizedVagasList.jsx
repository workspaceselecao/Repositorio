'use client'

import { useState, useMemo  } from 'react'
import VirtualizedList from './VirtualizedList'
import VagaCard from './VagaCard'
import VagaCardExpansivel from './VagaCardExpansivel'
// Vaga type removed - using object directly

export default function VirtualizedVagasList({
  vagas,
  onEdit,
  onDelete,
  onExport,
  containerHeight = 600,
  itemHeight = 200,
  className = ''
}) {
  const [expandedCards, setExpandedCards] = useState(new Set())

  const toggleExpanded = (vagaId) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(vagaId)) {
        newSet.delete(vagaId)
      } else {
        newSet.add(vagaId)
      }
      return newSet
    })
  }

  const renderItem = (vaga, index) => {
    const isExpanded = expandedCards.has(vaga.id)
    const actualItemHeight = isExpanded ? 400 : itemHeight

    return (
      <div 
        className="p-2"
        style={{ height: actualItemHeight }}
      >
        <VagaCard
          vaga={vaga}
          onEdit={onEdit}
          onDelete={onDelete}
          onExport={onExport}
        />
      </div>
    )
  }

  // Memoizar a lista para evitar re-renders desnecessários
  const memoizedVagas = useMemo(() => vagas, [vagas])

  if (memoizedVagas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhuma vaga encontrada</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <VirtualizedList
        items={memoizedVagas}
        itemHeight={itemHeight}
        containerHeight={containerHeight}
        overscan={3}
        renderItem={renderItem}
        className="border border-gray-200 rounded-lg"
      />
    </div>
  )
}
