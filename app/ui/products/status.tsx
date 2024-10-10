

export default function ProductStatus({ status }: { status: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
        status ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}
    >
      {status ? (
        <>
          库存充足
          {/* <CheckIcon className="ml-1 w-4 text-white" /> */}
        </>
      ) : (
        <>
          货品短缺
          {/* <XMarkIcon className="ml-1 w-4 text-white" /> */}
        </>
      )}
    </span>
  );
}
