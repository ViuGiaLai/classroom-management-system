import Header from "@/pages/Home/Header";
import HomeContent from "@/pages/Home/HomeContent";
import Footer from "@/pages/Home/Footer";

const Home = () => {
  return (
    <div className="container-fluid overflow-hidden">
      <Header />
      <HomeContent />
      <Footer />
    </div>
  );
};

export default Home;
