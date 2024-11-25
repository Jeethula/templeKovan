import { Suspense } from "react";
import { getServices, getLatestPost } from "./actions";
import WelcomeCard from "@/components/WelcomeCard";
import SpecialEventsCard from "@/components/SpecialEventsCard";
import ContributionSection from "@/components/ContributionSection";
import SevaCards from "@/components/SevaCards";
import LatestAnnouncement from "@/components/LatestAnnouncement";
import { 
  WelcomeCardSkeleton, 
  SpecialEventsCardSkeleton,
  ContributionSectionSkeleton,
  SevaCardsSkeleton 
} from "@/components/Skeletons";
import { CarouselWrapper } from "@/components/CarouselWrapper";

async function HomePage() {
  const [servicesData, postsData] = await Promise.all([
    getServices(),
    getLatestPost()
  ]);

  const hasSpecialEvents = servicesData.services.some(service => !service.isSeva);

  return (
    <div className="bg-[#fdf0f4] w-full h-full min-w-screen min-h-screen flex flex-col justify-start px-2 md:px-6 lg:px-12">
      <div className="w-full max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mt-3">
          {hasSpecialEvents ? (
            <>
              <Suspense fallback={<WelcomeCardSkeleton />}>
                <WelcomeCard isPosUser={false} />
              </Suspense>

              <Suspense fallback={<SpecialEventsCardSkeleton />}>
                <SpecialEventsCard services={servicesData.services} />
              </Suspense>
            </>
          ) : (
            <div className="col-span-2">
              <Suspense fallback={<WelcomeCardSkeleton />}>
                <WelcomeCard isPosUser={false} />
              </Suspense>
            </div>
          )}

          <Suspense fallback={<ContributionSectionSkeleton />}>
            <ContributionSection />
          </Suspense>
        </div>

        {/* Mobile Layout with CSS-based Carousel */}
        <div className="md:hidden mt-2">
          {hasSpecialEvents ? (
            <CarouselWrapper>
              <Suspense fallback={<WelcomeCardSkeleton />}>
                <WelcomeCard isPosUser={false} />
              </Suspense>
              <Suspense fallback={<SpecialEventsCardSkeleton />}>
                <SpecialEventsCard services={servicesData.services} />
              </Suspense>
            </CarouselWrapper>
          ) : (
            <Suspense fallback={<WelcomeCardSkeleton />}>
              <WelcomeCard isPosUser={false} />
            </Suspense>
          )}
        </div>

        {/* Seva Cards Section */}
        <div className="text-black flex items-center font-semibold mt-6 text-xl gap-x-2"> Book Seva </div>
        <Suspense fallback={<SevaCardsSkeleton />}>
          <SevaCards services={servicesData.services} />
        </Suspense>

        {/* Latest Announcement Section */}
        <div className="text-black  font-semibold mt-6 text-xl"> Recent Announcement </div>
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <Suspense>
            <LatestAnnouncement post={postsData.posts[0]} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default HomePage;