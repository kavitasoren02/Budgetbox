interface AnalyticsCardProps {
  title: string
  value: string
  subtitle: string
  color: "success" | "destructive" | "warning" | "primary"
}

const colorClasses = {
  success: "bg-success/10 text-success border-success/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  primary: "bg-primary/10 text-primary border-primary/20",
}

export default function AnalyticsCard({ title, value, subtitle, color }: AnalyticsCardProps) {
  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]} bg-card`}>
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
    </div>
  )
}
