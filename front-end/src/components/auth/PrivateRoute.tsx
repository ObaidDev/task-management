import { useKeycloak } from "@react-keycloak/web";
import { Loader2 } from "lucide-react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();

  // Show loading while Keycloak is initializing
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If authenticated, show the protected content
  if (keycloak.authenticated) {
    return <>{children}</>;
  }

  // If not authenticated, redirect to login
  keycloak.login();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default PrivateRoute;