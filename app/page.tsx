import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Shop Mars Backend</h1>
      <p className="text-xl mb-8">Your e-commerce backend is up and running!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <Link href="/api/products" className="p-6 border rounded-lg hover:bg-gray-100 transition-colors">
          <h2 className="text-2xl font-semibold mb-2">Products API →</h2>
          <p>Access your product catalog through the REST API.</p>
        </Link>

        <Link
          href="https://github.com/Wassim01-3/Shop-Mars"
          className="p-6 border rounded-lg hover:bg-gray-100 transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">Frontend Repository →</h2>
          <p>Connect this backend to your Shop Mars frontend.</p>
        </Link>

        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Authentication</h2>
          <p>Secure user authentication and authorization system.</p>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Orders & Cart</h2>
          <p>Complete e-commerce functionality with cart and order management.</p>
        </div>
      </div>
    </main>
  )
}
