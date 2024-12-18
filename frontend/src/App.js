import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import FindPage from "./pages/FindPage";
import EditPage from "./pages/EditPage";
import 'font-awesome/css/font-awesome.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/find" element={<FindPage />} />
        <Route path="/edit/:uniqueLink" element={<EditPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/items/:uniqueLink" element={<ItemDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
