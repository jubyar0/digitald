import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: ReactNode
  trend?: {
    value: string
    positive: boolean
  }
}

export function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <div className="relative">
      <Card className="hover:shadow-lg transition-shadow rounded-xl">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">
            {trend ? (
              <span className={trend.positive ? "text-green-500" : "text-red-500"}>
                {trend.value}
              </span>
            ) : null}
            {trend && description ? " " : ""}
            {description}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}