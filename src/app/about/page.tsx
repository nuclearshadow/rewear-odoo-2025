'use client';

export default function AboutUs() {
  return (
    <div className="py-16 bg-blue-50">
      <section className="max-w-4xl mx-auto bg-white text-gray-900 p-8 rounded-lg shadow-md space-y-8">
        <h1 className="text-gray-500 text-3xl font-bold">About Us</h1>

        <p>
          At <strong>Rewear</strong>, we believe fashion shouldn't cost the planet. Our platform empowers people to exchange gently-used clothing through direct swaps or a point-based system, helping extend the lifecycle of garments while reducing textile waste.
        </p>

        <p>
          Whether you're cleaning out your closet or looking for unique pieces, Rewear makes it easy to refresh your wardrobe sustainably. Every item you list earns you points, which you can use to redeem items shared by others. You can also swap directly with other users for mutual benefit.
        </p>

        <p>
          Our mission is to promote circular fashion, reduce fast fashion’s impact, and build a conscious community of fashion lovers who care about people and the planet.
        </p>

        <div className="border-t border-gray-300 pt-6">
          <h2 className="text-xl font-semibold mb-2">Why Choose Rewear?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>🌱 Promote sustainable living through clothing reuse</li>
            <li>♻️ Reduce landfill waste by giving garments a second life</li>
            <li>💬 Connect with like-minded individuals who value eco-conscious fashion</li>
            <li>💡 Earn & spend points or swap directly — your choice!</li>
          </ul>
        </div>

        <p className="text-sm text-gray-500 pt-4">
          Built with ❤️ using Next.js, Tailwind CSS, TypeScript, and Supabase.
        </p>
      </section>
    </div>
  );
}
