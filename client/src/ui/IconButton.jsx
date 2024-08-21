import "./IconButton.css";

export default function IconButton({ children, variant, ...props }) {
  return (
    <span className={`icon-button ${variant}`} {...props}>
      {children}
    </span>
  );
}
