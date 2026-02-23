import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ChatProvider } from "./contexts/ChatContext";

const BotlerChat = lazy(() => import("./components/BotlerChat"));

// Eager: landing page (critical path)
import Home from "./pages/Home";

// Lazy: everything else
const Demo = lazy(() => import("./pages/Demo"));
const Contact = lazy(() => import("./pages/Contact"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Faq = lazy(() => import("./pages/Faq"));
const Tourisme = lazy(() => import("./pages/sectors/Tourisme"));
const Viticulture = lazy(() => import("./pages/sectors/Viticulture"));
const Restaurants = lazy(() => import("./pages/sectors/Restaurants"));
const Boulangerie = lazy(() => import("./pages/sectors/Boulangerie"));
const Immobilier = lazy(() => import("./pages/sectors/Immobilier"));
const Hebergements = lazy(() => import("./pages/sectors/Hebergements"));
const Websites = lazy(() => import("./pages/Websites"));
const MobileApps = lazy(() => import("./pages/MobileApps"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const CGV = lazy(() => import("./pages/CGV"));
const PolitiqueConfidentialite = lazy(() => import("./pages/PolitiqueConfidentialite"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/demo"} component={Demo} />
      <Route path={"/demo/:sector"} component={Demo} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/faq"} component={Faq} />
      <Route path={"/solutions"} component={Solutions} />
      <Route path={"/tourisme"} component={Tourisme} />
      <Route path={"/viticulture"} component={Viticulture} />
      <Route path={"/restaurants"} component={Restaurants} />
      <Route path={"/boulangerie"} component={Boulangerie} />
      <Route path={"/immobilier"} component={Immobilier} />
      <Route path={"/hebergements"} component={Hebergements} />
      <Route path={"/websites"} component={Websites} />
      <Route path={"/applications-mobiles"} component={MobileApps} />
      <Route path={"/mentions-legales"} component={MentionsLegales} />
      <Route path={"/cgv"} component={CGV} />
      <Route path={"/politique-confidentialite"} component={PolitiqueConfidentialite} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="dark" switchable>
          <LanguageProvider>
            <ChatProvider>
              <TooltipProvider>
                <Toaster />
                <main>
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>}>
                    <Router />
                  </Suspense>
                </main>
                <Suspense fallback={null}>
                  <BotlerChat />
                </Suspense>
              </TooltipProvider>
            </ChatProvider>
          </LanguageProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
