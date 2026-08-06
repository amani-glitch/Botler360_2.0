import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Demo from "./pages/Demo";
import Contact from "./pages/Contact";
import Solutions from "./pages/Solutions";
import Tourisme from "./pages/sectors/Tourisme";
import Viticulture from "./pages/sectors/Viticulture";
import Restaurants from "./pages/sectors/Restaurants";
import Boulangerie from "./pages/sectors/Boulangerie";
import Immobilier from "./pages/sectors/Immobilier";
import Hebergements from "./pages/sectors/Hebergements";
import Websites from "./pages/Websites";
import MobileApps from "./pages/MobileApps";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import MentionsLegales from "./pages/MentionsLegales";
import CGV from "./pages/CGV";
import FloatingChat from "./components/FloatingChat";

// Route table shared between the FR (default) paths and their `/en` prefixed
// twins. Content stays French this pass (see brief Q4) — the `/en` prefix is
// i18n route scaffolding only, so a later wave can fill in English content
// without touching the URL structure.
const routeDefs: Array<{ path: string; component: React.ComponentType<any> }> = [
  { path: "/", component: Home },
  { path: "/demo", component: Demo },
  { path: "/demo/:sector", component: Demo },
  { path: "/contact", component: Contact },
  { path: "/solutions", component: Solutions },
  { path: "/tourisme", component: Tourisme },
  { path: "/viticulture", component: Viticulture },
  { path: "/restaurants", component: Restaurants },
  { path: "/boulangerie", component: Boulangerie },
  { path: "/immobilier", component: Immobilier },
  { path: "/hebergements", component: Hebergements },
  { path: "/websites", component: Websites },
  { path: "/applications-mobiles", component: MobileApps },
  { path: "/privacy-policy", component: PrivacyPolicy },
  { path: "/politique-de-confidentialite", component: PrivacyPolicy },
  { path: "/mentions-legales", component: MentionsLegales },
  { path: "/cgv", component: CGV },
];

function enPath(path: string) {
  return path === "/" ? "/en" : `/en${path}`;
}

// Switches the stored language preference to English when landing on an
// `/en/*` route, without touching it otherwise (so FR visitors keep their
// preference when navigating a plain path).
function useSyncLangFromRoute() {
  const [location] = useLocation();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (location === "/en" || location.startsWith("/en/")) {
      if (language !== "en") setLanguage("en");
    }
  }, [location]);
}

function Router() {
  useSyncLangFromRoute();
  return (
    <Switch>
      {routeDefs.map(({ path, component }) => (
        <Route key={path} path={path} component={component} />
      ))}
      {routeDefs.map(({ path, component }) => (
        <Route key={`en:${path}`} path={enPath(path)} component={component} />
      ))}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <FloatingChat />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
