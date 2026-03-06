interface AboutSectionProps {
  icon: React.ReactNode;
  title: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}

export function AboutSection({ icon, title, trailing, children }: AboutSectionProps) {
  return (
    <section>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <span className="text-primary-600 dark:text-primary-400">{icon}</span> {title}
        {trailing}
      </h3>
      {children}
    </section>
  );
}
