// ... 保留文件中的其他代码 ...
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function EditFormSkeleton() {
    return (
      <div className={`${shimmer} relative overflow-hidden rounded-md bg-gray-100 p-4 shadow-sm`}>
        <div className="space-y-6">
          {/* 借款人 */}
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-10 w-full rounded bg-gray-200" />
          </div>
  
          {/* 借款人电话 */}
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-10 w-full rounded bg-gray-200" />
          </div>
  
          {/* 借款金额 */}
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-10 w-full rounded bg-gray-200" />
          </div>
  
          {/* 待还金额 */}
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-10 w-full rounded bg-gray-200" />
          </div>
  
          {/* 当日还款 */}
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-10 w-full rounded bg-gray-200" />
          </div>
  
          {/* 还款日期 */}
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-10 w-full rounded bg-gray-200" />
          </div>
        </div>
  
        {/* 按钮 */}
        <div className="mt-6 flex justify-end gap-4">
          <div className="h-10 w-20 rounded bg-gray-200" />
          <div className="h-10 w-24 rounded bg-gray-200" />
        </div>
      </div>
    );
  }