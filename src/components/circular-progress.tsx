export const CircularProgress = ({ percentage, textPercentage = true }: { percentage: number, textPercentage?: boolean }) => {
  return (
    <div className="relative w-full h-5 flex items-center gap-1">
      <div
        className="w-5 h-5 rounded-full"
        style={{
          background: `radial-gradient(closest-side, white 50%, transparent 60%),
                       conic-gradient(#3b82f6 ${percentage * 3.6}deg, #e5e7eb 0deg)`,
        }}
      ></div>
      {
        textPercentage && (
          <span className="text-lg font-bold text-gray-700">
            {percentage}%
          </span>
        )
      }
    </div >
  )
};
