import type { Variants } from 'framer-motion';

type HeroMotionConfig = {
  container: Variants;
  eyebrow: Variants;
  title: Variants;
  body: Variants;
  background: Variants;
  shimmer: Variants;
};

export const getHeroMotionConfig = (reducedMotion: boolean): HeroMotionConfig => {
  if (reducedMotion) {
    return {
      container: {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { duration: 0 } },
      },
      eyebrow: {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0, transition: { duration: 0 } },
      },
      title: {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0, transition: { duration: 0 } },
      },
      body: {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0, transition: { duration: 0 } },
      },
      background: {
        hidden: { opacity: 1, scale: 1 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0 } },
      },
      shimmer: {
        hidden: { opacity: 0, x: '-12%' },
        visible: { opacity: 0.14, x: '12%', transition: { duration: 0 } },
      },
    };
  }

  return {
    container: {
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.06,
          delayChildren: 0.04,
        },
      },
    },
    eyebrow: {
      hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      },
    },
    title: {
      hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      },
    },
    body: {
      hidden: { opacity: 0, y: 18 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      },
    },
    background: {
      hidden: { opacity: 0.6, scale: 1.05 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      },
    },
    shimmer: {
      hidden: { opacity: 0, x: '-12%' },
      visible: {
        opacity: 0.14,
        x: '12%',
        transition: { duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] },
      },
    },
  };
};
