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
          <Route path="/" element={<Articles />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/letschat" element={<LetsChat />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />

        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
