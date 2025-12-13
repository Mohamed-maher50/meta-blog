import Container from "@/components/utils/Container";
import HeroSection from "@/components/HeroSections";

import HomeTopicsSwiper from "@/components/topics/TopicsSwiper";
import HomeBlogSection from "@/components/sections/HomeBlogSection";
import { prisma } from "@/prisma";

const Home = async () => {
  return (
    <main className="min-h-screen transition-transform duration-500  font-work-sans">
      <HeroSection />
      <Container>
        <HomeTopicsSwiper
          query="&sort=-topPosition"
          desc="Explore and discover content you love"
          label="🔥Popular Topics"
        />
        <div
          id={"blog_categories"}
          className="relative flex-col flex gap-10  w-full"
        >
          <HomeBlogSection
            query="sort=createdAt&&omit=content&"
            label={"Latest articles 🚀"}
          />
          <HomeBlogSection
            query="sort=-views_count&omit=content&"
            label="Most views"
          />
          <HomeBlogSection
            query="sort=-BlogLike&omit=content&"
            label="Most Loved Articles ❤️"
          />
        </div>
      </Container>
    </main>
  );
};
export default Home;
