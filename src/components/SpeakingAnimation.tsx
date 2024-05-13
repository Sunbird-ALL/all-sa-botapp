import React, { useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface SpeakingAnimationProps {
  currentVolume: number;
  isAnimating: boolean;
}

const SpeakingAnimation: React.FC<SpeakingAnimationProps> = ({ currentVolume, isAnimating }) => {
  const maxVolume = 50;
  const controls = useAnimation();

  const startAnimations = useCallback(() => {
    if (isAnimating) {
      controls.start({
        scale: [1.2, 1.12, 1.14, 1.16, 1.18, 1.2, 1.18, 1.16, 1.14, 1.12, 1.2],
        transition: { duration: 1 },
      });
    } else {
      controls.stop();
    }
  }, [controls, isAnimating]);

  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  return (
    <motion.div
      className={`${isAnimating ? 'ripler' : ''}`}
      animate={controls}
    />
  );
};

export default SpeakingAnimation;
