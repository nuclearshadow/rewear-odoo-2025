'use client'

import { useState, useEffect } from 'react'
import Spinner from '@/components/common/Spinner'
import Pagination from '@/components/ui/Pagination'

export default function SpinnerPaginationTest() {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timeout)
  }, [currentPage])

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">🧪 Spinner + Pagination Test</h2>

      {loading ? (
        <div className="flex items-center gap-2">
          <Spinner size={28} className="border-blue-500" />
          <span>Loading page {currentPage}...</span>
        </div>
      ) : (
        <p>Showing content for page {currentPage}</p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={5}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  )
}
