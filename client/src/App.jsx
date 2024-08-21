import "./App.css";
import NavBar from "./NavBar";
import Hero from "./Hero";
import Transcriber from "./Transcriber";

function App() {
  return (
    <main>
      <NavBar />
      <div>
        <Hero />
        <Transcriber />
      </div>
    </main>
  );
}

export default App;
