import { AnimatePresence, motion } from "framer-motion";
import { Users } from "lucide-react";

const FilterDropdown = ({ isOpen, selectedRegion, setSelectedRegion }) => {
  const regions = ['all', 'NA', 'EU', 'AS'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mb-6 overflow-hidden"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Filter by Region
            </h3>
            <div className="flex gap-2 flex-wrap">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedRegion === region
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-white'
                  }`}
                >
                  {region === 'all' ? 'All Regions' : region}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default FilterDropdown