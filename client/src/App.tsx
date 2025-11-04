import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TelegramProvider } from "@/contexts/TelegramProvider";
import { AuthProvider } from "@/contexts/AuthProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";

import { Main } from "@/pages/Main";
import { Profile } from "@/pages/Profile";
import Onboarding1 from "@/pages/Onboarding1";
import Onboarding2 from "@/pages/Onboarding2";
import Onboarding3 from "@/pages/Onboarding3";
import Onboarding4 from "@/pages/Onboarding4";
import Cases from "@/pages/Cases";
import CaseDetail from "@/pages/CaseDetail";
import Games from "@/pages/Games";
import Upgrade from "@/pages/Upgrade";
import Coinflip from "@/pages/Coinflip";
import Crash from "@/pages/Crash";
import Wallet from "@/pages/Wallet";
import Support from "@/pages/Support";

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        <Route path="/" component={Onboarding1} />
        <Route path="/onboarding-2" component={Onboarding2} />
        <Route path="/onboarding-3" component={Onboarding3} />
        <Route path="/onboarding-4" component={Onboarding4} />
        <Route path="/main" component={Main} />
        <Route path="/cases" component={Cases} />
        <Route path="/cases/:id" component={CaseDetail} />
        <Route path="/games" component={Games} />
        <Route path="/games/upgrade" component={Upgrade} />
        <Route path="/games/coinflip" component={Coinflip} />
        <Route path="/games/crash" component={Crash} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/profile" component={Profile} />
        <Route path="/support" component={Support} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </TelegramProvider>
    </QueryClientProvider>
  );
}

export default App;
