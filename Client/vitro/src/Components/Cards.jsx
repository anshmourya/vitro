import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Autoplay } from "swiper";
function Cards() {
  const [slidesPerView, setSlidesPerView] = useState(1);
  useEffect(() => {
    const updateSlidesPerView = () => {
      const width = window.innerWidth;
      if (width >= 960) {
        setSlidesPerView(3);
      } else if (width >= 600) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };
    window.addEventListener("resize", updateSlidesPerView);
    updateSlidesPerView();
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);
  return (
    <>
      <div className="container">
        <Swiper
          slidesPerView={slidesPerView}
          navigation={true}
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
        >
          {/* for overall attendence */}
          <SwiperSlide>
            <div className="card text-white bg-primary mb-3 cards">
              <div className="card-header">Attendence</div>
              <div className="card-body">
                <h5 className="card-title">Overall Attendence</h5>
                <p className="card-text">The overall attendence is 80%.</p>
              </div>
            </div>
          </SwiperSlide>
          {/* for class missed */}
          <SwiperSlide>
            <div className="card text-white bg-primary mb-3 cards">
              <div className="card-header">Class</div>
              <div className="card-body">
                <h5 className="card-title">Missed Class</h5>
                <p className="card-text">
                  Total class you missed 20 out of 40.
                </p>
              </div>
            </div>
          </SwiperSlide>
          {/* Current Rank */}
          <SwiperSlide>
            <div className="card text-white bg-primary mb-3 cards">
              <div className="card-header">Rank</div>
              <div className="card-body">
                <h5 className="card-title">Current Rank</h5>
                <p className="card-text">The current position of is #5 </p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
}

export default Cards;
