import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
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

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/demo"} component={Demo} />
      <Route path={"/demo/:sector"} component={Demo} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/solutions"} component={Solutions} />
      <Route path={"/tourisme"} component={Tourisme} />
      <Route path={"/viticulture"} component={Viticulture} />
      <Route path={"/restaurants"} component={Restaurants} />
      <Route path={"/boulangerie"} component={Boulangerie} />
      <Route path={"/immobilier"} component={Immobilier} />
      <Route path={"/hebergements"} component={Hebergements} />
      <Route path={"/websites"} component={Websites} />
      <Route path={"/applications-mobiles"} component={MobileApps} />
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
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
