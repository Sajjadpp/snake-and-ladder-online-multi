import { Crown, Medal, Minus, TrendingDown, TrendingUp } from "lucide-react";

export const getRankIcon = (rank) => {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 fill-yellow-400" />;
    case 2:
      return <Medal className="w-5 h-5 md:w-6 md:h-6 text-gray-300 fill-gray-300" />;
    case 3:
      return <Medal className="w-5 h-5 md:w-6 md:h-6 text-orange-400 fill-orange-400" />;
    default:
      return null;
  }
};

export const getRankChange = (rank, previousRank) => {
  if (previousRank === rank) {
    return <Minus className="w-4 h-4 text-gray-400" />;
  } else if (previousRank > rank) {
    return <TrendingUp className="w-4 h-4 text-green-400" />;
  } else {
    return <TrendingDown className="w-4 h-4 text-red-400" />;
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'in-game':
      return 'bg-orange-500';
    case 'offline':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};
