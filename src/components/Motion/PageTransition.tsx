import React from "react"
import { motion } from "framer-motion"
import { pageVariants, emphasizedTransition } from "./variants"

type Props = {
  children: React.ReactNode
  className?: string
}

const PageTransition: React.FC<Props> = ({ children, className }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    transition={emphasizedTransition}
    className={className}
  >
    {children}
  </motion.div>
)

export default PageTransition
