import { motion } from 'framer-motion'
import { Filter, Search } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery, setIsFilterOpen, isFilterOpen }) => (
  <motion.div
    initial={{ y: -10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2 }}
    className="mb-6 flex gap-3"
  >
    <div className="flex-1 relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search players..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-12 pr-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
    <button
      onClick={() => setIsFilterOpen(!isFilterOpen)}
      className="px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 hover:text-white transition-all backdrop-blur-sm hover:bg-gray-700/50"
    >
      <Filter className="w-5 h-5" />
    </button>
  </motion.div>
);

export default SearchBar;