import { HeroSection } from "../components/home/hero-section";
import { FeaturedCourses } from "../components/home/featured-courses";
import { CourseQuiz } from "../components/home/course-quiz";
import { Features } from "../components/home/features";
import { Testimonials } from "../components/home/testimonials";
import { CallToAction } from "../components/home/call-to-action";
import { Helmet } from "react-helmet";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Wiser Material - Premium Educational Platform for Money-Making Skills</title>
        <meta 
          name="description" 
          content="Learn money-making skills, business strategies, investing techniques, and productivity hacks from industry experts. Transform knowledge into financial success." 
        />
      </Helmet>
      
      <HeroSection />
      <FeaturedCourses />
      <CourseQuiz />
      <Features />
      <Testimonials />
      <CallToAction />
    </>
  );
}
