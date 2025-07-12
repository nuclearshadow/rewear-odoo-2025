'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home } from 'lucide-react'

type BreadcrumbsProps = {
  ignoreRoutes?: string[] // optional: ignore certain segments like 'dashboard'
}

export default function Breadcrumbs({ ignoreRoutes = [] }: BreadcrumbsProps) {
  const pathname = usePathname()
  const pathParts = pathname.split('/').filter((part) => part && !ignoreRoutes.includes(part))

  const buildPath = (index: number) => '/' + pathParts.slice(0, index + 1).join('/')

  return (
    <nav className="text-sm text-gray-600 dark:text-gray-300 my-4">
      <ol className="flex items-center space-x-1">
        <li>
          <Link href="/" className="flex items-center gap-1 hover:underline">
            <Home className="w-4 h-4" />
            Home
          </Link>
        </li>

        {pathParts.map((segment, index) => {
          const href = buildPath(index)
          const label = segment.charAt(0).toUpperCase() + segment.slice(1)

          return (
            <li key={href} className="flex items-center space-x-1">
              <span>/</span>
              {index === pathParts.length - 1 ? (
                <span className="font-medium text-gray-800 dark:text-white">{label}</span>
              ) : (
                <Link href={href} className="hover:underline capitalize">
                  {label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
