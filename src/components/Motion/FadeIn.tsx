import React from "react"
import { motion } from "framer-motion"
import { fadeInUp, standardTransition } from "./variants"

type Props = {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: keyof React.JSX.IntrinsicElements
}

const FadeIn: React.FC<Props> = ({
  children,
  className,
  delay = 0,
  as = "div",
}) => {
  const Component = motion.create(as as "div")
  return (
    <Component
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ ...standardTransition, delay }}
      className={className}
    >
      {children}
    </Component>
  )
}

export default FadeIn
