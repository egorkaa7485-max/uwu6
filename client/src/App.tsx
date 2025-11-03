import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";

import { Main } from "@/pages/Main";
import { Profile } from "@/pages/Profile";
import { Onboarding } from "@/pages/Onboarding";
import Onboarding1 from "@/pages/Onboarding1";
import Onboarding2 from "@/pages/Onboarding2";
import Onboarding3 from "@/pages/Onboarding3";
import Onboarding4 from "@/pages/Onboarding4";

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        {/* Add pages below */}
        <Route path="/" component={Onboarding1} />
        <Route path="/onboarding-2" component={Onboarding2} />
        <Route path="/onboarding-3" component={Onboarding3} />
        <Route path="/onboarding-4" component={Onboarding4} />
        <Route path="/main" component={Main} />
        <Route path="/profile" component={Profile} />
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
