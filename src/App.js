import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Articles from './pages/Articles/Articles';
import Post from './pages/Post/Post';
import AboutUs from "./pages/Aboutus/Aboutus";
import Gallery from './pages/Gallery/Gallery';
import CreatePost from "./pages/CreatePost/CreatePost";
import LetsChat from "./pages/LetsChat/LetsChat";
import RegistrationForm from "./pages/RegistrationForm/RegistrationForm";

import "./styles/styles.css"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Articles />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/post/:id" element={<Post />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/letschat" element={<LetsChat />} />
                <Route path="/register" element={<RegistrationForm />} />
                {/*<Route path="/edit-post/:id" element={<EditPost />} />*/}
                {/* Додайте інші маршрути для gallery, aboutus, letschat тощо */}
            </Routes>
        </Router>
    );
}

export default App;