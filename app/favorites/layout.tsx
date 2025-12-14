import { EmptyState } from "@/components/miscellaneous/EmptyState";
import Filtration_bar from "@/components/miscellaneous/Filtration-bar";
import SelectBar from "@/components/miscellaneous/Select-bar";
import { TabsContent } from "@/components/ui/tabs";
import Container from "@/components/utils/Container";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Container>
        <div className=" mb-6">
          <h2 className="text-xl sm:text-3xl font-bold my-4 capitalize font-work-sans leading-4 text-foreground  text-balance">
            Your Favorites
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Explore and manage your saved blogs and followed topics
          </p>
        </div>

        <Filtration_bar />

        {children}
      </Container>
    </>
  );
};

export default layout;
