import {
  Children,
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";

export interface QuestionCardDeckHandle {
  next: () => void;
  previous: () => void;
}

interface QuestionCardDeckProps {
  children: ReactNode;
  initialIndex?: number;
  canGoForward: boolean;
  onIndexChange: (index: number) => void;
  label?: string;
}

/**
 * Shared assessment deck. Swiper owns both the drag gesture and the card-stack
 * transform, while each flow keeps control of answer validation and progress.
 */
export const QuestionCardDeck = forwardRef<QuestionCardDeckHandle, QuestionCardDeckProps>(
  function QuestionCardDeck(
    {
      children,
      initialIndex = 0,
      canGoForward,
      onIndexChange,
      label = "أسئلة التقييم",
    },
    ref,
  ) {
    const swiperRef = useRef<SwiperInstance | null>(null);
    const canGoForwardRef = useRef(canGoForward);
    const [activeIndex, setActiveIndex] = useState(initialIndex);

    function syncForwardLock(swiper: SwiperInstance, enabled: boolean) {
      swiper.allowSlideNext = enabled;
      swiper.params.allowSlideNext = enabled;
    }

    useEffect(() => {
      canGoForwardRef.current = canGoForward;
      if (swiperRef.current) syncForwardLock(swiperRef.current, canGoForward);
    }, [canGoForward]);

    useImperativeHandle(ref, () => ({
      next: () => {
        const swiper = swiperRef.current;
        if (!swiper || !canGoForwardRef.current) return;
        syncForwardLock(swiper, true);
        swiper.slideNext();
      },
      previous: () => swiperRef.current?.slidePrev(),
    }));

    return (
      <Swiper
        dir="rtl"
        className="question-card-deck h-full w-full"
        modules={[A11y, EffectCards]}
        effect="cards"
        cardsEffect={{
          perSlideOffset: 7,
          perSlideRotate: 1.5,
          rotate: true,
          slideShadows: true,
        }}
        initialSlide={initialIndex}
        allowSlideNext={canGoForward}
        allowSlidePrev
        grabCursor
        resistanceRatio={0.72}
        threshold={10}
        speed={520}
        preventClicks
        preventClicksPropagation
        noSwipingSelector="input, textarea, select, [data-no-swipe]"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          syncForwardLock(swiper, canGoForwardRef.current);
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
          onIndexChange(swiper.activeIndex);
        }}
        onTransitionEnd={(swiper) => {
          swiper.animating = false;
          syncForwardLock(swiper, canGoForwardRef.current);
        }}
        a11y={{
          enabled: true,
          containerMessage: label,
          containerRoleDescriptionMessage: "مجموعة بطاقات أسئلة",
          itemRoleDescriptionMessage: "سؤال",
          firstSlideMessage: "هذا هو السؤال الأول",
          lastSlideMessage: "هذا هو السؤال الأخير",
          nextSlideMessage: "السؤال التالي",
          prevSlideMessage: "السؤال السابق",
          slideLabelMessage: "السؤال {{index}} من {{slidesLength}}",
        }}
      >
        {Children.map(children, (child, index) => (
          <SwiperSlide
            key={isValidElement(child) && child.key != null ? child.key : index}
            className="question-card-slide"
          >
            {Math.abs(index - activeIndex) <= 4 ? child : null}
          </SwiperSlide>
        ))}
      </Swiper>
    );
  },
);
