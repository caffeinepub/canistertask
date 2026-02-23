import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthGate from './components/AuthGate';
import WorkerDashboard from './pages/WorkerDashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Cookies from './pages/Cookies';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import AdminDashboard from './pages/AdminDashboard';
import Notifications from './pages/Notifications';
import MyProfile from './pages/MyProfile';
import PublicProfile from './pages/PublicProfile';
import Workers from './pages/Workers';
import CookieConsentBanner from './components/CookieConsentBanner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsentBanner />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <AuthGate>
      <WorkerDashboard />
    </AuthGate>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <AuthGate>
      <WorkerDashboard />
    </AuthGate>
  ),
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: () => (
    <AuthGate>
      <Analytics />
    </AuthGate>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <AuthGate>
      <Settings />
    </AuthGate>
  ),
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sobre',
  component: About,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacidade',
  component: PrivacyPolicy,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/termos',
  component: TermsOfService,
});

const cookiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cookies',
  component: Cookies,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: () => (
    <AuthGate>
      <PaymentSuccess />
    </AuthGate>
  ),
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: () => (
    <AuthGate>
      <PaymentFailure />
    </AuthGate>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AuthGate>
      <AdminDashboard />
    </AuthGate>
  ),
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: () => (
    <AuthGate>
      <Notifications />
    </AuthGate>
  ),
});

const myProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/perfil',
  component: () => (
    <AuthGate>
      <MyProfile />
    </AuthGate>
  ),
});

const publicProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/perfil/$userId',
  component: () => (
    <AuthGate>
      <PublicProfile />
    </AuthGate>
  ),
});

const workersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workers',
  component: () => (
    <AuthGate>
      <Workers />
    </AuthGate>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  analyticsRoute,
  settingsRoute,
  aboutRoute,
  privacyRoute,
  termsRoute,
  cookiesRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  adminRoute,
  notificationsRoute,
  myProfileRoute,
  publicProfileRoute,
  workersRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RouterProvider router={router} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
