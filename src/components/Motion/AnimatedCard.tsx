import React from "react"
import { motion } from "framer-motion"
import { standardTransition } from "./variants"

type Props = {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  as?: "div" | "button" | "article"
  /** Disable hover animation (e.g. for non-interactive cards) */
  noHover?: boolean
}

const AnimatedCard: React.FC<Props> = ({
  children,
  className,
  onClick,
  as = "div",
  noHover = false,
}) => {
  const Component = motion.create(as)
  return (
    <Component
      className={className}
      onClick={onClick}
      whileHover={noHover ? undefined : { y: -2, transition: { duration: 0.15 } }}
      whileTap={onClick ? { scale: 0.995 } : undefined}
      transition={standardTransition}
    >
      {children}
    </Component>
  )
}

export default AnimatedCard
