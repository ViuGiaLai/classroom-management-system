import Header from "../components/Home/Header";
import HomeContent from "../components/Home/HomeContent";
import Footer from "../components/Home/Footer";

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
