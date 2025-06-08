import ArticleCard from "@/components/ArticleCard";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className=" font-[family-name:var(--font-work-sans)]">
      <Container>
        <div className="flex flex-col gap-y-8">
          <div className="grid gap-5 grid-cols-3">
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
          </div>
          <Button
            className="mx-auto block text-secondary-foreground"
            variant={"outline"}
          >
            View All Articles
          </Button>
        </div>
      </Container>
    </div>
  );
}
