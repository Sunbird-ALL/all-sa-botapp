// components/AnimatedPage.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const variants = {
  hidden: { opacity: 0, x: -200, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
};

interface AnimatedPageProps {
  transitionType?: string;
  children: ReactNode;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({
  transitionType,
  children,
}) => (
  <motion.div
    initial="hidden"
    animate="enter"
    exit="exit"
    variants={variants}
    transition={{ type: transitionType ? transitionType : 'tween' }}
    className="page"
  >
    {children}
  </motion.div>
);

export default AnimatedPage;
