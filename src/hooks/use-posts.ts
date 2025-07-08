import fm from "front-matter";

const postFiles = import.meta.glob("/src/posts/*.md", {
  as: "raw",
  eager: true,
});

export function usePosts() {
  const posts = Object.entries(postFiles).map(([path, raw]) => {
    const { attributes } = fm(raw as string);
    const slug = path.split("/").pop()?.replace(".md", "");
    return { slug, ...attributes };
  });

  return { posts, loading: false };
}
