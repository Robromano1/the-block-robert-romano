interface ConditionBadgeProps {
  grade: number
  showScale?: boolean
}

export function ConditionBadge({ grade, showScale = false }: ConditionBadgeProps) {
  let color = 'bg-red-100 text-red-700'
  if (grade >= 4) color = 'bg-green-100 text-green-700'
  else if (grade >= 3) color = 'bg-yellow-100 text-yellow-700'

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
      {grade.toFixed(1)}{showScale && ' / 5.0'}
    </span>
  )
}
