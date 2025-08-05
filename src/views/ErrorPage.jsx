import { Link, useRouteError } from "react-router-dom";
import "../styles/error.css";

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-page-container">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="error-status">
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to="/" className="error-home-link">
        Back To Home
      </Link>
    </div>
  );
}

export default ErrorPage;