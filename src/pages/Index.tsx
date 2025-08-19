import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "./Dashboard";
import Pipeline from "./Pipeline";
import Contacts from "./Contacts";
import QuickReplies from "./QuickReplies";
import Sessions from "./Sessions";
import MassMessaging from "./MassMessaging";
import Settings from "./Settings";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "BeastCRM Clone – Dashboard y Pipeline";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "CRM moderno estilo BeastCRM con dashboard, pipeline y contactos.");
  }, []);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pipeline" element={<Pipeline />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="quick-replies" element={<QuickReplies />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="mass-messaging" element={<MassMessaging />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default Index;
