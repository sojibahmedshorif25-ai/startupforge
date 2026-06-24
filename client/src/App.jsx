import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import Loader from './components/Loader';
import Home from './pages/public/Home';
import BrowseStartups from './pages/public/BrowseStartups';
import StartupDetails from './pages/public/StartupDetails';
import BrowseOpportunities from './pages/public/BrowseOpportunities';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import NotFound from './pages/public/NotFound';
import FounderOverview from './pages/dashboard/Founder/Overview';
import MyStartup from './pages/dashboard/Founder/MyStartup';
import AddOpportunity from './pages/dashboard/Founder/AddOpportunity';
import ManageOpportunities from './pages/dashboard/Founder/ManageOpportunities';
import Applications from './pages/dashboard/Founder/Applications';
import CollaboratorOverview from './pages/dashboard/Collaborator/Overview';
import MyApplications from './pages/dashboard/Collaborator/MyApplications';
import Profile from './pages/dashboard/Profile';
import AdminOverview from './pages/dashboard/Admin/Overview';
import ManageUsers from './pages/dashboard/Admin/ManageUsers';
import ManageStartups from './pages/dashboard/Admin/ManageStartups';
import Transactions from './pages/dashboard/Admin/Transactions';
import PaymentSuccess from './pages/public/PaymentSuccess';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen bg-gray-50">{children}</main>
    <Footer />
  </>
);

const DashboardLayout = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/" />;
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 md:ml-64 pb-16 md:pb-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const { loading } = useAuth();
  if (loading) return <Loader />;

  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/startups" element={<PublicLayout><BrowseStartups /></PublicLayout>} />
      <Route path="/startups/:id" element={<PublicLayout><StartupDetails /></PublicLayout>} />
      <Route path="/opportunities" element={<PublicLayout><BrowseOpportunities /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      <Route path="/payment/success" element={<PublicLayout><PaymentSuccess /></PublicLayout>} />
      <Route path="/payment/cancel" element={<PublicLayout><Home /></PublicLayout>} />

      <Route path="/dashboard/founder" element={
        <PrivateRoute roles={['founder']}>
          <DashboardLayout allowedRoles={['founder']}><FounderOverview /></DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/dashboard/founder/my-startup" element={
        <PrivateRoute roles={['founder']}>
          <DashboardLayout allowedRoles={['founder']}><MyStartup /></DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/dashboard/founder/add-opportunity" element={
        <PrivateRoute roles={['founder']}>
          <DashboardLayout allowedRoles={['founder']}><AddOpportunity /></DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/dashboard/founder/manage-opportunities" element={
        <PrivateRoute roles={['founder']}>
          <DashboardLayout allowedRoles={['founder']}><ManageOpportunities /></DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/dashboard/founder/applications" element={
        <PrivateRoute roles={['founder']}>
          <DashboardLayout allowedRoles={['founder']}><Applications /></DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/dashboard/collaborator" element={
        <PrivateRoute roles={['collaborator']}>
          <DashboardLayout allowedRoles={['collaborator']}><CollaboratorOverview /></DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/dashboard/collaborator/applications" element={
        <PrivateRoute roles={['collaborator']}>
          <DashboardLayout allowedRoles={['collaborator']}><MyApplications /></DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/dashboard/profile" element={
        <PrivateRoute roles={['founder', 'collaborator', 'admin']}>
          <DashboardLayout allowedRoles={['founder', 'collaborator', 'admin']}><Profile /></DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/dashboard/admin" element={
        <PrivateRoute roles={['admin']}>
          <DashboardLayout allowedRoles={['admin']}><AdminOverview /></DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/dashboard/admin/users" element={
        <PrivateRoute roles={['admin']}>
          <DashboardLayout allowedRoles={['admin']}><ManageUsers /></DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/dashboard/admin/startups" element={
        <PrivateRoute roles={['admin']}>
          <DashboardLayout allowedRoles={['admin']}><ManageStartups /></DashboardLayout>
        </PrivateRoute>
      } />
      <Route path="/dashboard/admin/transactions" element={
        <PrivateRoute roles={['admin']}>
          <DashboardLayout allowedRoles={['admin']}><Transactions /></DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  );
}
