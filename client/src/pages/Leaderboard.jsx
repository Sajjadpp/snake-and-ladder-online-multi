import React, { useState } from 'react';
import CurrentUserCard from "../components/leaderboard/CurrentUserCard";
import FilterDropdown from "../components/leaderboard/FilterDropdown";
import LeaderboardHeader from "../components/leaderboard/Header";
import SearchBar from "../components/leaderboard/SearchBar";
import LeaderboardTable from "../components/leaderboard/Table";
import TimePeriodTabs from "../components/leaderboard/TimePeriod";
import TopThreePodium from "../components/leaderboard/TopThreePodium";



const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');
  
  // Mock data - replace with your API call
  const [leaderboardData] = useState([
    {
      id: 1, rank: 1, previousRank: 2, username: 'ProGamer123', avatar: '🎮',
      level: 45, score: 15750, wins: 342, winRate: 78, coins: 25000,
      region: 'NA', status: 'online', isPremium: true
    },
    {
      id: 2, rank: 2, previousRank: 1, username: 'QueenOfDice', avatar: '👑',
      level: 43, score: 14920, wins: 318, winRate: 75, coins: 22500,
      region: 'EU', status: 'in-game', isPremium: true
    },
    {
      id: 3, rank: 3, previousRank: 4, username: 'DiceKing99', avatar: '🎲',
      level: 42, score: 14100, wins: 295, winRate: 73, coins: 20000,
      region: 'AS', status: 'online', isPremium: false
    },
    ...Array.from({ length: 17 }, (_, i) => ({
      id: i + 4, rank: i + 4, previousRank: i + 4,
      username: `Player${i + 4}`, avatar: ['🎯', '🏆', '⭐', '🎪', '🎨'][i % 5],
      level: 41 - i, score: 13450 - (i * 500), wins: 278 - (i * 10),
      winRate: 71 - i, coins: 18500 - (i * 800),
      region: ['NA', 'EU', 'AS'][i % 3], status: ['online', 'offline', 'in-game'][i % 3],
      isPremium: i % 3 === 0
    }))
  ]);

  const [currentUserRank] = useState({
    rank: 156, username: 'You', avatar: '😎',
    score: 5420, wins: 89, winRate: 62
  });

  const filteredData = leaderboardData.filter(player => {
    const matchesSearch = player.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || player.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <LeaderboardHeader />
        <TimePeriodTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          setIsFilterOpen={setIsFilterOpen}
          isFilterOpen={isFilterOpen}
        />
        <FilterDropdown 
          isOpen={isFilterOpen} 
          selectedRegion={selectedRegion} 
          setSelectedRegion={setSelectedRegion}
        />
        <TopThreePodium players={filteredData} />
        <LeaderboardTable players={filteredData} />
        <CurrentUserCard currentUserRank={currentUserRank} />
      </div>
    </div>
  );
};


export default Leaderboard;