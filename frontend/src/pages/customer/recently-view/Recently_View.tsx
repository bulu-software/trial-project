import { Link } from "react-router-dom";
import { useRecentlyViewed } from "../../context/RecentlyViewedContext";

const Recently_View = () => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p>No recently viewed products yet.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recently Viewed</h2>
        <button
          onClick={clearRecentlyViewed}
          className="text-sm text-red-500 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {recentlyViewed.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="border rounded-lg p-2 hover:shadow-md transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 object-cover rounded"
            />
            <p className="mt-2 text-sm font-medium truncate">{product.name}</p>
            <p className="text-sm text-gray-500">₹{product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Recently_View;