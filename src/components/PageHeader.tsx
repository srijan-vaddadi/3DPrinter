import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
}

export default function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-dark to-[#2d1b69] pt-[120px] pb-[60px] text-center">
      <h1 className="text-white text-4xl font-extrabold mb-2">{title}</h1>
      <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span>/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="text-white/70 hover:text-accent transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span>{crumb.label}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
