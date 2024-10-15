import React from "react";
import Slider from "react-slick";
import "./CategoryCarousel.css"; // Import CSS tùy chỉnh



const CategoryCarousel = ({ categories }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 20000,
    arrows: true, 
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="category-carousel">
      <Slider {...settings}>
        {categories.map((category, index) => (
          <div key={index} className="category-item">
            <div className="profile-card">
              <img src={`../../../../src/assets/images/avatars/`+category.avatar} alt={category.name} className="profile-image" />
              <div className="profile-info">
                <h3>{category.name}</h3>
                <p>{category.role === 'true' ? 'Huynh Trưởng' : 'Đoàn Sinh'}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CategoryCarousel;
