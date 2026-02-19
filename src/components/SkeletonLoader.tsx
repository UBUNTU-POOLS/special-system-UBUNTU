import React from 'react';

export function PoolCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#252826] rounded-[40px] border-2 border-[#F1F0EE] dark:border-[#3A3D3B] p-8 space-y-6 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-3/4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
        </div>
        <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-3xl w-full"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-3xl w-full"></div>
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-3xl w-full"></div>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
      <div className="flex gap-3">
        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl flex-grow"></div>
        <div className="h-14 w-12 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-64 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl w-96 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <PoolCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
