import Container from "@/components/utils/Container";
import HeroSection from "@/components/HeroSections";

import HomeTopicsSwiper from "@/components/topics/TopicsSwiper";
import HomeBlogSection from "@/components/sections/HomeBlogSection";
import UsersSmallCardsSwiper from "@/components/users/UsersSmallCardsSwiper";

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
          <UsersSmallCardsSwiper
            query="&omit=Social,bio,followers,likedUsers"
            label="Discover Creators You'll Love ✨"
            desc="Find talented creators and expand your network"
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
