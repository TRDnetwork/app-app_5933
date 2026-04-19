import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="py-8 px-6 text-center text-[#7a7060] text-sm safe-area-inset-bottom" role="contentinfo">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        © {new Date().getFullYear()} Alex Morgan. Crafted with care.
      </motion.p>
    </footer>
  );
};

export default Footer;