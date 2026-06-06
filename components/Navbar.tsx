"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const path = usePathname();

  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-sm)",
    fontWeight: "var(--fw-medium)",
    color: active ? "var(--accent-text)" : "var(--text-muted)",
    cursor: "pointer",
    transition: "color var(--dur-fast)",
    textDecoration: "none",
  });

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      height: "var(--nav-height)",
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border-subtle)",
    }}>
      <div style={{ maxWidth: "var(--container-wide)", margin: "0 auto", padding: "0 16px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <span style={{ fontSize: "24px" }}>🤟</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "var(--text-lg)", color: "var(--text-primary)" }}>SignLearn</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link href="/learn" style={linkStyle(path.startsWith("/learn"))}>Modules</Link>
          {session && <Link href="/dashboard" style={linkStyle(path === "/dashboard")}>Dashboard</Link>}

          {session ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {session.user?.image && (
                <img src={session.user.image} alt="" style={{ width: "32px", height: "32px", borderRadius: "var(--radius-pill)", border: "2px solid var(--accent)", objectFit: "cover" }} />
              )}
              <button
                onClick={() => signOut()}
                style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                fontFamily: "var(--font-sans)", fontWeight: "var(--fw-medium)", fontSize: "var(--text-sm)",
                background: "var(--white)", color: "var(--slate-900)",
                padding: "8px 16px", borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-strong)",
                cursor: "pointer", boxShadow: "var(--shadow-sm)",
              }}
            >
              <GoogleG size={16} /> Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
