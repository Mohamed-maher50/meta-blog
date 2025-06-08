import ArticleCard from "@/components/ArticleCard";
import Container from "@/components/Container";

export default function Home() {
  return (
    <div className=" font-[family-name:var(--font-work-sans)]">
      <Container>
        <div className="grid gap-5 grid-cols-3">
          <ArticleCard />
          <ArticleCard />
          <ArticleCard />
        </div>
      </Container>
    </div>
  );
}
