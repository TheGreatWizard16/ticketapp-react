import { Link, useNavigate } from "react-router-dom";
import { clearSession, getSession } from "../lib/session";

export default function Layout({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();
  const session = getSession();
  const logout = () => {
    clearSession();
    nav("/");
  };

  return (
    <div>
      <header>
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <Link to="/" style={{ fontWeight: 700, fontSize: 18 }}>
            TicketApp
          </Link>
          <nav style={{ display: "flex", gap: 16 }}>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/tickets">Tickets</Link>
            {session ? (
              <button className="btn ghost" onClick={logout} aria-label="Logout">
                Logout
              </button>
            ) : (
              <Link className="btn" to="/auth/login">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="container" style={{ paddingBottom: "64px" }}>
        {children}
      </main>
      <footer>
        <div className="container">
          © {new Date().getFullYear()} TicketApp • Max-width 1440px
        </div>
      </footer>
    </div>
  );
}
