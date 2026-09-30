"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Bell, LayoutDashboard, LogOut, Menu, Search, Settings, UsersRound, Trophy, CreditCard, X } from "lucide-react";
import { toast } from "sonner";
import { errorMessage, logoutApi, notifications } from "@/lib/api";
import { DashboardView, ContentView, GamificationView, SubscriptionView, SettingView } from "@/components/views";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/content", label: "Content Management", icon: UsersRound },
  { href: "/gamification", label: "Gamification Control", icon: Trophy },
  { href: "/subscription", label: "Subscription", icon: CreditCard },
  { href: "/setting", label: "Setting", icon: Settings },
  { href: "/logout", label: "Log Out", icon: LogOut },
];
export function DashboardShell() {
  const path = usePathname(); const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false); const [search, setSearch] = useState(""); const [loggingOut, setLoggingOut] = useState(false); const [showNotifications,setShowNotifications]=useState(false);
  const noticeQuery=useQuery({queryKey:["notifications"],queryFn:notifications,enabled:showNotifications});
  async function logout() { setLoggingOut(true); try { await logoutApi(); } catch(e) { toast.error(errorMessage(e)); } finally { await signOut({ callbackUrl: "/login" }); setLoggingOut(false); } }
  const active = nav.find(item => path.startsWith(item.href))?.href || "/dashboard";
  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
      <Link href="/dashboard" className="brand" onClick={() => setMenuOpen(false)}><span className="brand-symbol">V<span>✦</span></span><strong>VOCE</strong></Link>
      <nav aria-label="Main navigation">{nav.map(item => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={`nav-link ${active === item.href ? "active" : ""}`}><item.icon size={22} strokeWidth={1.7}/><span>{item.label}</span></Link>)}</nav>
    </aside>
    {menuOpen && <button className="sidebar-scrim" onClick={() => setMenuOpen(false)} aria-label="Close navigation"/>}
    <div className="main-column"><header className="topbar">
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open navigation">{menuOpen ? <X/> : <Menu/>}</button>
      <div className="search-box"><input aria-label="Search current page" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} /><Search size={23}/></div>
      <div className="top-profile"><button className="notification" aria-label="Notifications" onClick={() => setShowNotifications(!showNotifications)}><Bell size={22}/></button>{showNotifications&&<div className="notification-panel"><strong>Notifications</strong>{noticeQuery.isLoading?<p>Loading...</p>:noticeQuery.data?.docs?.length?noticeQuery.data.docs.map(n=><p key={n._id}>{n.title||n.message||"Notification"}</p>):<p>No notifications</p>}</div>}<div className="avatar">{session?.user?.image ? <Image unoptimized width={42} height={42} src={session.user.image} alt=""/> : (session?.user?.name || "A").slice(0,1).toUpperCase()}</div><div className="profile-name"><strong>{session?.user?.name || "Admin"}</strong><small>@Admin</small></div></div>
    </header><main className="workarea">
      {active === "/dashboard" && <DashboardView search={search}/>}
      {active === "/content" && <ContentView search={search}/>}
      {active === "/gamification" && <GamificationView search={search}/>}
      {active === "/subscription" && <SubscriptionView search={search}/>}
      {active === "/setting" && <SettingView/>}
      {active === "/logout" && <div className="logout-view"><h2>Logging Out</h2><p>Do you want to log out?</p><Button onClick={logout} disabled={loggingOut}>{loggingOut ? "Logging out..." : "Log Out"}</Button></div>}
    </main></div>
  </div>;
}
