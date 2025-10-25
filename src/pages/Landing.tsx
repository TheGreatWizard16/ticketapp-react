import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function Landing() {
  return (
    <Layout>
      <section className="hero card" aria-label="Welcome">
        <img
          className="circle"
          src="/assets/circle.svg"
          alt=""
          aria-hidden="true"
        />
        <div style={{ padding: "48px 24px", display: "grid", gap: 16 }}>
          <h1>Welcome to TicketApp</h1>
          <p>
            Manage your tickets effortlessly. Consistent UI, secure routes, and
            full CRUD functionality.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="btn" to="/auth/login">
              Get Started
            </Link>
            <Link className="btn secondary" to="/auth/signup">
              Create Account
            </Link>
          </div>
        </div>
        <svg
          className="wave"
          viewBox="0 0 1440 200"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 C240,140 480,0 720,60 C960,120 1200,40 1440,100 L1440,200 L0,200 Z"
            fill="currentColor"
            opacity=".08"
          />
        </svg>
      </section>

      <section style={{ marginTop: 24 }} className="grid cols-3">
        <div className="card">
          <h3>Consistent UI</h3>
          <p>Same layout across React, Vue, Twig.</p>
        </div>
        <div className="card">
          <h3>Protected Routes</h3>
          <p>Auth simulated via <code>ticketapp_session</code>.</p>
        </div>
        <div className="card">
          <h3>Full CRUD</h3>
          <p>Create, edit, and delete tickets easily.</p>
        </div>
      </section>
    </Layout>
  );
}
