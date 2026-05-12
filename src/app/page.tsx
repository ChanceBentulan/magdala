import { db } from "@/db";
import { photos } from "@/db/schema";
import { createPhoto } from "./actions";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const allPhotos = await db.select().from(photos);

  async function handleLogout() {
    "use server";
    await signOut({redirectTo: "/login"});
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Magdala Photo Memorial
        </h1>

        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600">
            Logged in as: <span className="font-medium">{session.user.name}</span> ({session.user.email})
          </p>
          <form action={handleLogout}>
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Logout
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4"> Add New Photo</h2>
          <form action={createPhoto} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                required
                placeholder="https://example.com/photo.jpg"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium mb-1">
                Year
              </label>
              <input
                type="number"
                id="year"
                name="year"
                required
                placeholder="2024"
                className="w-full border rounded px-3 py-3"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Add Photo
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            photos ({allPhotos.length})
          </h2>
          {allPhotos.length === 0 ? (
            <p className="text-gray-500"> No photos yet. Add one above!</p>
          ): (
            <div className="space-y-4">
              {
                allPhotos.map((photo) => (
                  <div key={photo.id} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-semibold">{photo.title}</h3>
                    <p className="text-sm text-gray-600">{photo.description}</p>
                    <p className="text-sm text-gray-500">Year: {photo.year}</p>
                    <p className="text-xs text-gray-400">
                      Added: {photo.createdAt?.toISOString().split('T')[0]}
                    </p>
                    <a
                      href={photo.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      View Image
                    </a>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
