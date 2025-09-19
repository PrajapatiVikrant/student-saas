import Link from "next/link";
import { IconType } from "react-icons";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: IconType;
}

export default function ToolCard({ title, description, href, icon: Icon }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:scale-105 transition transform duration-200"
    >
      <Icon className="text-indigo-600 mb-4" size={50} />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 text-center">{description}</p>
    </Link>
  );
}
