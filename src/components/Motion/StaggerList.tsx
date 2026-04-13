import React from "react"
import { motion } from "framer-motion"
import { staggerContainer, staggerItem, standardTransition } from "./variants"

type StaggerListProps = {
  children: React.ReactNode
  className?: string
  as?: "ul" | "ol" | "div"
}

export const StaggerList: React.FC<StaggerListProps> = ({
  children,
  className,
  as = "ul",
}) => {
  const Component = motion.create(as)
  return (
    <Component
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children}
    </Component>
  )
}

type StaggerItemProps = {
  children: React.ReactNode
  className?: string
  as?: "li" | "div"
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className,
  as = "li",
}) => {
  const Component = motion.create(as)
  return (
    <Component
      variants={staggerItem}
      transition={standardTransition}
      className={className}
    >
      {children}
    </Component>
  )
}
