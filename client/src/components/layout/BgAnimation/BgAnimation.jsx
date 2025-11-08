import { motion } from "framer-motion";
const BackgroundAnimation = () => {
    return (
        
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20,
            }}
            animate={{
              y: -20,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 8,
            }}
          />
        ))}
      </div>
    )
};

export default BackgroundAnimation;