import { A11y, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import type { ContentItem } from "../../data/content";
import type { RecommendedContent } from "../../content/recommendations";
import { ContentCard } from "./ContentCard";

export function RecommendedContentSwiper({
  items,
  openedIds,
  onOpen,
}: {
  items: RecommendedContent[];
  openedIds: string[];
  onOpen: (item: ContentItem) => void;
}) {
  return (
    <Swiper
      key={items.map((pick) => pick.item.id).join("-")}
      dir="rtl"
      className="recommended-content-swiper"
      modules={[A11y, Pagination]}
      slidesPerView="auto"
      spaceBetween={12}
      slidesOffsetBefore={20}
      slidesOffsetAfter={20}
      grabCursor
      threshold={8}
      resistanceRatio={0.72}
      speed={420}
      watchOverflow
      pagination={{ clickable: true }}
      a11y={{
        enabled: true,
        containerMessage: "محتوى موصى لك",
        containerRoleDescriptionMessage: "عارض محتوى",
        itemRoleDescriptionMessage: "محتوى",
        firstSlideMessage: "هذا هو المحتوى الأول",
        lastSlideMessage: "هذا هو المحتوى الأخير",
        nextSlideMessage: "المحتوى التالي",
        prevSlideMessage: "المحتوى السابق",
        slideLabelMessage: "المحتوى {{index}} من {{slidesLength}}",
        paginationBulletMessage: "انتقل إلى المحتوى {{index}}",
      }}
    >
      {items.map(({ item, why }) => (
        <SwiperSlide key={item.id} className="!h-auto !w-[10.5rem] pb-1">
          <ContentCard
            item={item}
            why={why}
            className="h-full"
            opened={openedIds.includes(item.id)}
            onClick={() => onOpen(item)}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
