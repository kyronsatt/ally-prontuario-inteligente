// src/routes/BlogPost.tsx
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import fm from "front-matter";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import Header from "@/components/layouts/Header";
import { BlogPostCard } from "@/components/molecules/blog-post-card";
import Footer from "@/components/layouts/Footer";

const postFiles = import.meta.glob("/src/posts/*.md", {
  as: "raw",
  eager: true,
});

interface PostFrontmatter {
  title: string;
  excerpt: string;
  date: string;
  image?: string;
  tags?: string[];
}

interface PostData {
  slug: string;
  frontmatter: PostFrontmatter;
  image: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState("");
  const [frontmatter, setFrontmatter] = useState<PostFrontmatter>({
    title: "",
    excerpt: "",
    date: "",
  });
  const [relatedPosts, setRelatedPosts] = useState<PostData[]>([]);

  useEffect(() => {
    if (!slug) return;

    // Carrega o post atual
    const match = Object.entries(postFiles).find(([path]) =>
      path.includes(`${slug}.md`)
    );

    if (match) {
      const raw = match[1] as string;
      const parsed = fm<PostFrontmatter>(raw);
      setFrontmatter(parsed.attributes);
      setContent(parsed.body);

      // Carrega posts relacionados (excluindo o atual)
      const allPosts = Object.entries(postFiles)
        .map(([path, file]): PostData => {
          const postSlug = path.split("/").pop()?.replace(".md", "") || "";
          const parsed = fm<PostFrontmatter>(file as string);
          return {
            slug: postSlug,
            frontmatter: parsed.attributes,
            ...parsed.attributes,
          };
        })
        .filter((post) => post.slug !== slug)
        .sort(
          (a, b) =>
            new Date(b.frontmatter.date).getTime() -
            new Date(a.frontmatter.date).getTime()
        )
        .slice(0, 3); // Pega os 3 mais recentes

      setRelatedPosts(allPosts);
    }
  }, [slug]);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: frontmatter.title,
            datePublished: frontmatter.date,
            description: frontmatter.excerpt,
            author: {
              "@type": "Organization",
              name: "Ally",
            },
          })}
        </script>

        <title>{frontmatter.title} | Ally Blog</title>
        <meta
          name="description"
          content={frontmatter.excerpt || "Leia este post no blog Ally"}
        />
        <meta property="og:title" content={frontmatter.title} />
        <meta property="og:description" content={frontmatter.excerpt || ""} />
        <meta property="og:type" content="article" />
        {frontmatter.image && (
          <meta property="og:image" content={frontmatter.image} />
        )}
      </Helmet>
      <Header />
      <article className="max-w-full mt-20">
        {/* Cabeçalho com imagem em full-width */}
        {frontmatter.image && (
          <header className="relative w-full h-96 sm:h-[36rem]">
            <img
              src={frontmatter.image}
              alt={`Capa do post: ${frontmatter.title}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-12">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  {frontmatter.title}
                </h1>
                {frontmatter.date && (
                  <p className="text-gray-300">
                    Publicado em{" "}
                    {new Date(frontmatter.date).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            </div>
          </header>
        )}

        {/* Conteúdo do post */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
          <div className="prose dark:prose-invert prose-lg max-w-none text-gray-700">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => <p className="my-4" {...props} />,
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-3xl font-bold mt-12 mb-6 pb-2 border-b border-border"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-2xl font-bold mt-8 mb-3" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-5 my-4" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-5 my-4" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-s-ally-blue pl-4 italic my-4 text-gray-600 dark:text-gray-300"
                    {...props}
                  />
                ),
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <code
                      className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm"
                      {...props}
                    />
                  ) : (
                    <pre
                      className="bg-gray-100 dark:bg-gray-800 rounded p-4 my-4 overflow-x-auto"
                      {...props}
                    />
                  ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto">
                    <table className="min-w-full my-4" {...props} />
                  </div>
                ),
                img: ({ node, ...props }) => (
                  <img className="rounded-lg my-6 mx-auto" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    {...props}
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Posts relacionados */}
        {relatedPosts.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Outros posts que você pode gostar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <BlogPostCard post={post} />
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
      <Footer />
    </>
  );
}
