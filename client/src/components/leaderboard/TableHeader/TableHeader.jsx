const TableHeader = () => (
  <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-700/50">
    <div className="grid grid-cols-12 gap-4 text-gray-400 text-sm font-semibold">
      <div className="col-span-1 text-center">Rank</div>
      <div className="col-span-5 md:col-span-4">Player</div>
      <div className="col-span-2 text-center hidden md:block">Level</div>
      <div className="col-span-3 md:col-span-2 text-center">Score</div>
      <div className="col-span-3 md:col-span-2 text-center">Wins</div>
      <div className="col-span-0 md:col-span-1 text-center hidden md:block">W/R</div>
    </div>
  </div>
);

export default TableHeader