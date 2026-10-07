interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

export default function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-brav-lg border border-brav-border bg-white p-6">
      <p className="text-sm text-brav-muted">
        {title}
      </p>

      <h3 className="mt-2 text-3xl font-bold text-brav-foreground">
        {value}
      </h3>

      <p className="mt-2 text-sm text-brav-muted">
        {description}
      </p>
    </div>
  );
}