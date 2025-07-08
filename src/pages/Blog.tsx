import { usePosts } from "@/hooks/use-posts";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Helmet } from "react-helmet";
import Header from "@/components/layouts/Header";
import { BlogPostCard } from "@/components/molecules/blog-post-card";
import Footer from "@/components/layouts/Footer";

export default function Blog() {
  const { posts, loading } = usePosts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Carregando posts...
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog | Ally</title>
        <meta
          name="description"
          content="Conteúdos da Ally sobre medicina, produtividade e inovação no consultório."
        />
      </Helmet>

      <div className="min-h-screen pt-24 px-6 bg-white max-w-5xl mx-auto w-full mb-24">
        <Header />
        <section className="text-center mb-12 mt-4 p-12 rounded-xl bg-gradient-to-r from-ally-blue to-[#00e6e6]">
          <h1 className="text-6xl font-bold mb-2 text-white opacity-95">
            Blog
          </h1>
        </section>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {posts.map((post) => (
            <BlogPostCard post={post} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
