import React from 'react';
import HomeSection from './HomeSection';
import HeroBanner from '../homepage/HeroBanner';
import CategoriesShowcase from './CategoriesShowcase';
import FeaturedProducts from '../orderpage/FeaturedProducts';
import FlashDeals from './FlashDeals';
import Categories from './Categories';
import Blog from './Blog';
const Home = () => {
    return (
        <div>
           
            <HeroBanner/>
            <CategoriesShowcase/>
            <FeaturedProducts/>
            <FlashDeals/>
          <Categories/>
          <Blog/>
             <HomeSection/>

        </div>
    );
};

export default Home;