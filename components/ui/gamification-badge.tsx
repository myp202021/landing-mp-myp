'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Sparkles, Target, Users, Zap, Award } from 'lucide-react'

export type BadgeType = 'first_contribution' | 'power_user' | 'top_performer' | 'community_builder' | 'consistent' | 'early_adopter'

interface BadgeProps {
  type: BadgeType
  size?: 'sm' | 'md' | 'lg'
  unlocked?: boolean
  showLabel?: boolean
  animated?: boolean
}

const badgeConfig: Record<BadgeType, {
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  bgColor: string
}> = {
  first_contribution: {
    name: 'Primer Aporte',
    description: 'Compartiste tus primeras métricas',
    icon: Sparkles,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  power_user: {
    name: 'Usuario Avanzado',
    description: '5+ contribuciones',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  top_performer: {
    name: 'Top Performer',
    description: 'En el top 10% de tu industria',
    icon: Trophy,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  community_builder: {
    name: 'Constructor de Comunidad',
    description: 'Compartiste el link con 3+ personas',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  consistent: {
    name: 'Consistente',
    description: 'Contribuciones en 3 meses consecutivos',
    icon: Target,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  early_adopter: {
    name: 'Early Adopter',
    description: 'Entre los primeros 100 usuarios',
    icon: Award,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
}

export default function Badge({
  type,
  size = 'md',
  unlocked = true,
  showLabel = true,
  animated = true
}: BadgeProps) {
  const config = badgeConfig[type]
  const Icon = config.icon

  const sizeConfig = {
    sm: { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-xs' },
    md: { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-sm' },
    lg: { container: 'w-24 h-24', icon: 'w-12 h-12', text: 'text-base' },
  }

  const sizes = sizeConfig[size]

  const BadgeContent = () => (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizes.container} rounded-full flex items-center justify-center transition-all duration-300 ${
          unlocked
            ? `${config.bgColor} ${config.color} shadow-lg`
            : 'bg-gray-200 text-gray-400'
        }`}
      >
        <Icon className={sizes.icon} />
      </div>
      {showLabel && (
        <div className="text-center max-w-[120px]">
          <div className={`font-semibold ${sizes.text} ${unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
            {config.name}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {config.description}
          </div>
        </div>
      )}
    </div>
  )

  if (!animated || !unlocked) {
    return <BadgeContent />
  }

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 0.2,
      }}
      whileHover={{ scale: 1.1 }}
      className="cursor-pointer"
    >
      <BadgeContent />
    </motion.div>
  )
}

// Badge showcase component
export function BadgeShowcase({ earnedBadges }: { earnedBadges: BadgeType[] }) {
  const allBadges: BadgeType[] = [
    'first_contribution',
    'power_user',
    'top_performer',
    'community_builder',
    'consistent',
    'early_adopter',
  ]

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {allBadges.map((badgeType) => (
        <Badge
          key={badgeType}
          type={badgeType}
          size="md"
          unlocked={earnedBadges.includes(badgeType)}
          showLabel={true}
          animated={earnedBadges.includes(badgeType)}
        />
      ))}
    </div>
  )
}
