import Link from "next/link";

interface MenuItemParams {
  params: {
    icon: React.ReactElement;
    title: string;
    description?: string;
    href: string;
  };
}

export default function MenuItem({ params }: MenuItemParams) {
  const { href, icon, title, description } = params;

  return (
    <Link href={href}>
      <a className={`flex items-center mb-7 px-2 `}>
        {icon}
        <div>
          <p className="text-lg text-gray-300">{title}</p>
          {!!description && <p className="text-gray-400 text-xs">{description}</p>}
        </div>
      </a>
    </Link>
  );
}
