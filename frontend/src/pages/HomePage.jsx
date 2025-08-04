import CategoryItem from "../components/CategoryItem";
import { categories } from "../constants/categories";


const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Explore Our Categories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Discover the latest trends in eco-friendly fashion
        </p>
        <div className="grid grid-col-1 sm:grid-col-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
