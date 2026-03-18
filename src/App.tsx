// src/App.jsx
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Critical components - load immediately
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Contact from "./components/Contact.jsx";
import VideoBackground from "./components/VideoBackground.jsx";
import PinkCursor from "./components/PinkCursor.jsx";

// Lazy load non-critical components
const BlogPage = lazy(() => import("./components/BlogPage.js"));
const BlogPost = lazy(() => import("./components/BlogPost.jsx"));
const AboutPage = lazy(() => import("./components/AboutPage.js"));
const MusicPage = lazy(() => import("./components/MusicPage.jsx"));

// Loading fallback component
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh",
      color: "#ff69b4",
    }}
  >
    <div className="spinner"></div>
  </div>
);

function AppContent() {
  return (
    <div className="app-container">
      <PinkCursor />
      <VideoBackground />
      <div className="content-container">
        <Header />
        <main>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Route for your homepage */}
              <Route
                path="/"
                element={
                  <>
                    <div className="single-screen-layout">
                      <Hero />
                    </div>
                    <Contact />
                  </>
                }
              />
              {/* Route for the about page */}
              <Route path="/about" element={<AboutPage />} />
              {/* Route for the music page */}
              <Route path="/music" element={<MusicPage />} />
              {/* Route for the blog list page */}
              <Route path="/blog" element={<BlogPage />} />
              {/* Route for a single, dynamic blog post. This is crucial. */}
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
