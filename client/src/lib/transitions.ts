import { Variants } from "framer-motion";

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 30 },
};

export const scaleIn: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
};

export const cardFloat: Variants = {
  initial: { x: 0, y: 0, rotate: 0, opacity: 0 },
  animate: (custom: { x: number; y: number; rotate: number }) => ({
    x: custom.x,
    y: custom.y,
    rotate: custom.rotate,
    opacity: 1,
    transition: { delay: custom.y / 100, duration: 0.6, ease: "easeOut" },
  }),
};

export const buttonPulse = {
  scale: [1, 1.05, 1],
  transition: { duration: 1, repeat: Infinity },
};

export const transition = {
  default: { duration: 0.3, ease: "easeInOut" },
  smooth: { duration: 0.5, ease: "easeOut" },
  bounce: { duration: 0.6, type: "spring", bounce: 0.4 },
};
