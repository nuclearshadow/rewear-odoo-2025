'use client'

import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center mt-4 space-x-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-800 disabled:opacity-50"
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md text-sm border 
            ${
              page === currentPage
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'hover:bg-gray-100 dark:hover:bg-zinc-800'
            } 
            border-gray-300 dark:border-zinc-700`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-800 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}
