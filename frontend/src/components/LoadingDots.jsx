export default function LoadingDots() {
    return (
      <div className="flex items-center space-x-1 my-2">
        <div className="loading-dot w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full"></div>
        <div className="loading-dot w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full"></div>
        <div className="loading-dot w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full"></div>
      </div>
    );
  }