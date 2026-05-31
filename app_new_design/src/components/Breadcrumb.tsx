import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const schemaItems = items.map((item, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: item.label,
    ...(item.href && { item: `https://carna.online${item.href}` })
  }))

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: schemaItems
        })}
      </script>

      <nav aria-label="breadcrumb" className="flex items-center gap-xs text-text-muted font-body-sm text-body-sm mb-lg">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-xs">
            {item.href ? (
              <Link to={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-text-primary">{item.label}</span>
            )}
            {idx < items.length - 1 && (
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            )}
          </div>
        ))}
      </nav>
    </>
  )
}
