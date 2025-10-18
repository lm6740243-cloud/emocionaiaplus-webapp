import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Web3Provider } from "@/contexts/Web3Context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Web3Provider>
      <App />
    </Web3Provider>
  </QueryClientProvider>
);
