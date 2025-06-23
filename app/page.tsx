import ArticleCard from "@/components/ArticleCard";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { AuthorBlog } from "@/types";

export default async function Home() {
  // const session = await auth();
  const res = await fetch("http://localhost:3000/api/blogs?omit[]=content", {
    // cache: "force-cache",
  });
  if (!res.ok) throw new Error(`can't fetch blogs`);
  const blogs: AuthorBlog[] = await res.json();
  console.log(blogs);
  console.log(blogs);

  return (
    <main className=" font-[family-name:var(--font-work-sans)]">
      <Container>
        <div className=" h-72">
          {/* <Image
            src={blogs[0].images[0].url}
            width={1920}
            height={1080}
            alt=""
          /> */}
        </div>
        <div className="flex flex-col gap-y-8">
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {blogs.map((b) => {
              return <ArticleCard {...b} key={b.id} />;
            })}
          </div>
          <Button
            className="mx-auto block text-secondary-foreground"
            variant={"outline"}
          >
            View All Articles
          </Button>
        </div>
      </Container>
    </main>
  );
}
