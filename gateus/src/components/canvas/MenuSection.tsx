import { type ReactNode } from "react";

interface MenuSectionProps {
  sectionHeader: string;
  children: ReactNode;
}

export default function MenuSection({ sectionHeader, children }: MenuSectionProps) {
  return (
    <div className="w-full mb-4">
      <h3 className="mb-2 font-medium">{sectionHeader}</h3>
      <section className="w-full rounded-lg bg-slate-100 border border-slate-300">
        <div className="p-3">{children}</div>
      </section>
    </div>
  );
}
