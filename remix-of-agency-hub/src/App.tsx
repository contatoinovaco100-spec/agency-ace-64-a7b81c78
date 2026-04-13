// trigger fresh sync 2
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AgencyProvider } from "@/contexts/AgencyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import ClientsPage from "./pages/ClientsPage";
import CRMPage from "./pages/CRMPage";
import TasksPage from "./pages/TasksPage";
import TeamPage from "./pages/TeamPage";
import ClientContentPage from "./pages/ClientContentPage";
import LoginPage from "./pages/LoginPage";
import PermissionsPage from "./pages/PermissionsPage";
import ContractsPage from "./pages/ContractsPage";
import ContractSignPage from "./pages/ContractSignPage";
import ReportsPage from "./pages/ReportsPage";
import PortfolioPage from "./pages/PortfolioPage";
import ShootingSchedulePage from "./pages/ShootingSchedulePage";
import WhiteboardPage from "./pages/WhiteboardPage";
import ContentPlanningPage from "@/pages/ContentPlanningPage";
import ProspectionPage from "@/pages/ProspectionPage";
import SalesLP from "@/pages/SalesLP";
import SalesEditorPage from "@/pages/SalesEditorPage";
import DiagnosticEditorPage from "@/pages/DiagnosticEditorPage";
import DiagnosticLP from "@/pages/DiagnosticLP";

import PublicPortfolioPage from "./pages/PublicPortfolioPage";
import ClientPortalPage from "./pages/ClientPortalPage";
import NotFound from "./pages/NotFound";
import BriefingFormPage from "./pages/BriefingFormPage";
import BriefingsPage from "./pages/BriefingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import { RealtimeNotifications } from "@/components/RealtimeNotifications";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const isPublicPage = location.pathname.startsWith('/conteudo/') || 
                       location.pathname.startsWith('/portal/') || 
                       location.pathname.startsWith('/contrato/') || 
                       location.pathname.startsWith('/vitrine') || 
                       location.pathname.startsWith('/briefing') ||
                       location.pathname.startsWith('/proposta') ||
                       (location.pathname.startsWith('/diagnostico') && !location.pathname.startsWith('/diagnostico/editar'));

  if (isPublicPage) {
    return (
      <Routes>
        <Route path="/conteudo/:taskId" element={<ClientContentPage />} />
        <Route path="/portal/:clientId" element={<ClientPortalPage />} />
        <Route path="/contrato/:contractId" element={<ContractSignPage />} />
        <Route path="/vitrine" element={<PublicPortfolioPage />} />
        <Route path="/briefing" element={<BriefingFormPage />} />
        <Route path="/proposta" element={<SalesLP />} />
        <Route path="/proposta/:slug" element={<SalesLP />} />
        <Route path="/proposta/editar" element={<SalesEditorPage />} />
        <Route path="/diagnostico" element={<DiagnosticLP />} />
        <Route path="/diagnostico/:slug" element={<DiagnosticLP />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/clientes" element={<ClientsPage />} />
                <Route path="/crm" element={<CRMPage />} />
                <Route path="/tarefas" element={<TasksPage />} />
                <Route path="/planejamento" element={<ContentPlanningPage />} />
                <Route path="/permissoes" element={<PermissionsPage />} />
                <Route path="/contratos" element={<ContractsPage />} />
                <Route path="/briefings" element={<BriefingsPage />} />
                <Route path="/relatorios" element={<ReportsPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/gravacoes" element={<ShootingSchedulePage />} />
                <Route path="/whiteboard" element={<WhiteboardPage />} />
                <Route path="/prospeccao" element={<ProspectionPage />} />
                <Route path="/proposta/editar" element={<SalesEditorPage />} />
                <Route path="/diagnostico/editar" element={<DiagnosticEditorPage />} />
                <Route path="/notificacoes" element={<NotificationsPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <RealtimeNotifications />
        <AgencyProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AgencyProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
