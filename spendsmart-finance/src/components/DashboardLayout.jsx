// src/components/DashboardLayout.jsx
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Topbar />
      <main className="ml-64 mt-16 min-h-[calc(100vh-64px)] bg-surface-container-low/40">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
