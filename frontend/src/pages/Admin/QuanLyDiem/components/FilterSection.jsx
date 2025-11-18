export default function FilterSection({ query, onQueryChange, status, onStatusChange }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Tìm kiếm theo mã HP, tên học phần, giảng viên..."
            className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
        >
          <option>Tất cả</option>
          <option>Chờ duyệt</option>
          <option>Đã duyệt</option>
          <option>Đã trả lại</option>
        </select>
      </div>
    </div>
  );
}
