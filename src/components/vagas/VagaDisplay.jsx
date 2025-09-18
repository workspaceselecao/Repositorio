'use client'

import VirtualizedVagasList from '../VirtualizedVagasList'
import VagaCardExpansivel from '../VagaCardExpansivel'
import VagaCard from '../VagaCard'
import Pagination from '../Pagination'

export default function VagaDisplay({
  vagas,
  viewMode,
  pagination,
  onEdit,
  onDelete,
  onExport,
  itemsPerPage,
  totalVagasRaw
}) {
  if (pagination.totalItems === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhuma vaga encontrada</p>
        {totalVagasRaw === 0 && (
          <p className="text-gray-400 text-sm mt-2">
            Importe os dados do JSON para começar
          </p>
        )}
      </div>
    )
  }

  if (viewMode === 'virtualized') {
    return (
      <VirtualizedVagasList
        vagas={vagas}
        onEdit={onEdit}
        onDelete={onDelete}
        onExport={onExport}
        containerHeight={600}
        itemHeight={200}
      />
    )
  }

  if (viewMode === 'expanded') {
    return (
      <>
        <div className="space-y-6">
          {pagination.paginatedData.map((vaga) => (
            <VagaCardExpansivel
              key={vaga.id}
              vaga={vaga}
              onEdit={onEdit}
              onDelete={onDelete}
              onExport={onExport}
            />
          ))}
        </div>

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
          onNext={pagination.nextPage}
          onPrev={pagination.prevPage}
          canGoNext={pagination.canGoNext}
          canGoPrev={pagination.canGoPrev}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalItems={pagination.totalItems}
          itemsPerPage={itemsPerPage}
        />
      </>
    )
  }

  // Default to paginated view
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {pagination.paginatedData.map(vaga => (
          <VagaCard
            key={vaga.id}
            vaga={vaga}
            onEdit={onEdit}
            onDelete={onDelete}
            onExport={onExport}
          />
        ))}
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.goToPage}
        onNext={pagination.nextPage}
        onPrev={pagination.prevPage}
        canGoNext={pagination.canGoNext}
        canGoPrev={pagination.canGoPrev}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        totalItems={pagination.totalItems}
        itemsPerPage={itemsPerPage}
      />
    </>
  )
}