import "./navbar.css";
import Logo from "./assets/speechify-logo-light.svg";

export default function NavBar() {
  return (
    <nav>
      <img src={Logo} alt="Speechify Logo" />
    </nav>
  );
}
