// src/app/page.tsx
import ItemCard, { Item } from "@/components/common/ItemCard";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

// NOTE: You would normally fetch this data from your API.
// Using mock data here for demonstration.
const featuredItems: Item[] = [
  {
    id: "1",
    title: "Vintage Denim Jacket",
    points_cost: 150,
    item_images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1543087902-61618aa12443?ixlib=rb-4.0.3&w=400",
      },
    ],
  },
  {
    id: "2",
    title: "Striped Cotton Tee",
    points_cost: 50,
    item_images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1581655353564-df123a1eb821?ixlib=rb-4.0.3&w=400",
      },
    ],
  },
  {
    id: "3",
    title: "Classic White Sneakers",
    points_cost: 200,
    item_images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&w=400",
      },
    ],
  },
  {
    id: "4",
    title: "Flowy Summer Dress",
    points_cost: 120,
    item_images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&w=400",
      },
    ],
  },
];

export default function LandingPage() {
  return (
    <>
      {" "}
      {/* Using Fragment to avoid needing an extra wrapper div since the top level element is no longer in layout.tsx */}
      {/* 1. Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay */}
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Give Your Wardrobe a Second Life
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200">
            Swap clothes you no longer wear. Join a community committed to
            sustainable fashion and discover unique pre-loved pieces.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3 rounded-full font-semibold text-lg bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
            >
              Start Swapping
            </Link>

            {/* THIS BUTTON NOW HAS THE CONSISTENT STYLE */}
            <Link
              href="/items/add"
              className="px-8 py-3 rounded-full font-semibold text-lg text-white
                         border border-white/20 shadow-lg
                         bg-white/10 backdrop-blur-sm
                         hover:bg-white/20 hover:border-white/40 transition-all"
            >
              List an Item
            </Link>
          </div>
        </div>
      </section>
      {/* 2. Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Tops", "Bottoms", "Dresses", "Outerwear"].map((category) => (
              <div
                key={category}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
              >
                <h3 className="font-semibold text-lg">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* 3. Featured Items Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Clothing Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/browse"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              Browse All Items
            </Link>
          </div>
        </div>
      </section>
      {/* 4. Testimonials Section */}
      <section id="how-it-works" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">What Our Community Says</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic">
                "ReWear completely changed how I think about my closet. It's so
                easy to list old clothes and find new treasures!"
              </p>
              <p className="font-bold mt-4">- Sarah J.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic">
                "The points system is genius! I cleared out so many unused items
                and got points to 'buy' things I actually wanted."
              </p>
              <p className="font-bold mt-4">- Mike R.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic">
                "I love the focus on sustainability. It feels good to
                participate in a circular fashion economy. Highly recommend!"
              </p>
              <p className="font-bold mt-4">- Chloe L.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
