export default function StatusTabs({ statusTabs, activeTab, onTabClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statusTabs.map((tab) => (
        <button
          key={tab.title}
          onClick={() => onTabClick(tab.title)}
          className={`p-4 border rounded-lg transition-colors ${
            activeTab === tab.title
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="font-medium">
                {tab.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{tab.subtitle}</p>
            </div>
            <div className="text-2xl font-bold">
              {tab.count}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
