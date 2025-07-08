import { Link } from "react-router-dom";
import { format } from "date-fns";

export function BlogPostCard({ post }) {
  return (
    <Link
      key={post.slug}
      to={`/blog/${post.slug}`}
      className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200"
    >
      <div className="relative w-full aspect-[4/5]">
        <div className="h-1 w-full absolute bg-gradient-to-r from-ally-blue to-[#00e6e6] z-20" />
        <img
          src={post.image}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 pt-24">
          <h2 className="text-white text-lg font-semibold">{post.title}</h2>
          {post.excerpt && (
            <p className="text-sm text-white/80 mt-1 line-clamp-2">
              {post.excerpt}
            </p>
          )}
          {post.date && (
            <div className="">
              <span className="text-xs text-white/30">
                {format(new Date(post.date), "dd/MM/yyyy")}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
