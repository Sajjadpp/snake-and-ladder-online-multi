import { Award, Calendar, Target } from "lucide-react";
import {motion} from 'framer-motion'
const TimePeriodTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'weekly', label: 'This Week', icon: Calendar },
    { id: 'monthly', label: 'This Month', icon: Target },
    { id: 'allTime', label: 'All Time', icon: Award }
  ];

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="mb-6"
    >
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/50 inline-flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">
              {tab.id === 'weekly' ? 'Week' : tab.id === 'monthly' ? 'Month' : 'All'}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
export default TimePeriodTabs;