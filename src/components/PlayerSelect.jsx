import { motion } from "framer-motion";

export default function PlayerSelect({ onSelect }) {
  const container = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  };

  const buttonVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      className="p-6 text-center"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Choose Your Class
      </motion.h1>

      <motion.div className="flex justify-center gap-4" variants={container}>
        {[
          { label: "Warrior", className: "bg-red-600 hover:bg-red-700" },
          { label: "Mage", className: "bg-blue-600 hover:bg-blue-700" },
          { label: "Tank", className: "bg-green-600 hover:bg-green-700" },
        ].map(({ label, className }) => (
          <motion.button
            key={label}
            onClick={() => onSelect(label)}
            className={`px-4 py-2 ${className} rounded-lg shadow`}
            variants={buttonVariant}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {label}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
