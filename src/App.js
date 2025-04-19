import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Post from "./pages/Post/Post";
import AboutUs from "./pages/Aboutus/Aboutus";
import Gallery from "./pages/Gallery/Gallery";
import CreatePost from "./pages/CreatePost/CreatePost";
import LetsChat from "./pages/LetsChat/LetsChat";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import LoginForm from "./components/LoginForm/LoginForm";
import Destinations from "./pages/Destinations/Destinations";
import Articles from "./pages/Articles/Articles";


import "./styles/styles.css";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Header />
        <Routes>
          <Route path="/podoroj/" element={<Articles />} />
          <Route path="/podoroj/articles" element={<Articles />} />
          <Route path="/podoroj/destinations" element={<Destinations />} />
          <Route path="/podoroj/post/:id" element={<Post />} />
          <Route path="/podoroj/about" element={<AboutUs />} />
          <Route path="/podoroj/gallery" element={<Gallery />} />
          <Route path="/podoroj/create-post" element={<CreatePost />} />
          <Route path="/podoroj/letschat" element={<LetsChat />} />
          <Route path="/podoroj/register" element={<RegistrationForm />} />
          <Route path="/podoroj/login" element={<LoginForm />} />
          <Route path="/podoroj/favorites/:userId" element={<Articles />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
