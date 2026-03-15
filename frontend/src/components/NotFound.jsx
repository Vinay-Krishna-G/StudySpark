import { motion } from "framer-motion"
import { Link } from "react-router-dom"


export default function NotFound() {
  return (
    <main className="flex items-center justify-center bg-white dark:bg-zinc-900 px-6">
      
      <div className="text-center max-w-xl w-full">

        {/* 404 GIF */}
        <motion.img
          src="/404NotFound.gif" 
          alt="404 Not Found"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-48 sm:w-56 md:w-full h-auto object-contain mb-10"
        />

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white"
        >
          404 — Page Not Found
        </motion.h1>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-4 text-zinc-600 dark:text-zinc-400 text-base sm:text-lg"
        >
          The page you're looking for doesn’t exist or may have been moved.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-2 text-sm text-zinc-500 dark:text-zinc-500"
        >
          Let’s get you back on track.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 mb-8 border-t border-zinc-200 dark:border-zinc-700"
        />

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >

          {/* Primary CTA */}
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-[1.03] shadow-md hover:shadow-lg"
          >
            Go Back Home
          </Link>

          {/* Secondary CTA */}
          <Link
            to="/subjects"
            className="w-full sm:w-auto px-8 py-3 border border-zinc-300 dark:border-zinc-600 text-black dark:text-white font-medium rounded-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-md"
          >
            Explore Resources
          </Link>

        </motion.div>

      </div>
    </main>
  )
}
