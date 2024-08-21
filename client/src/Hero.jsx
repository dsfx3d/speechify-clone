import "./hero.css";
import Logo from "./assets/speechify-logo-light.svg";

export default function Hero() {
  return (
    <aside>
      <img src={Logo} alt="Speechify Logo" />
      <h1>Free Speech to Text Online</h1>
      <p>
        Try text to speech online and enjoy the best AI voices that sound human.
        TTS is great for Google Docs, emails, PDFs, any website, and more.
      </p>
      <button>Try for Free</button>
    </aside>
  );
}
