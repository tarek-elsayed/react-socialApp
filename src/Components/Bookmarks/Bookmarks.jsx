import { FaBookmark } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getBookmarkedPosts } from "../../Api/getBookmarkedPosts.api";
import CardPost from "../CardPost/CardPost";
import Loader from "../Loader/Loader";

export default function Bookmarks() {
  const { data: bookmarkedPosts = [], isLoading, isError } = useQuery({
    queryKey: ["bookmarkedPosts"],
    queryFn: getBookmarkedPosts,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="mx-auto mt-8 w-[80%] rounded-lg bg-red-100 p-5 text-center text-red-700">
        We could not load your bookmarked posts. Please try again.
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-[80%] pb-10">
      <header className="mx-auto mb-8 max-w-3xl border-b border-gray-200 pb-5">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-blue-100 p-3 text-blue-600">
            <FaBookmark aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saved posts</h1>
            <p className="mt-1 text-sm text-gray-500">
              Posts you saved to come back to later.
            </p>
          </div>
        </div>
      </header>

      {bookmarkedPosts.length === 0 ? (
        <div className="mx-auto max-w-3xl rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
          <FaBookmark className="mx-auto mb-4 text-4xl text-gray-300" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-gray-800">No saved posts yet</h2>
          <p className="mt-2 text-gray-500">
            Bookmark a post from the home feed and it will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5">
          {bookmarkedPosts.map((post) => (
            <CardPost key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}