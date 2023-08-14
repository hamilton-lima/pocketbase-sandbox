import React, { useEffect } from "react";
import { useLocation, Location } from "react-router-dom";
import { saveNavigation } from "../utils/persistence";

const handleRouteChange = (location:Location) => {
  saveNavigation({ location: location.pathname });
  console.log("Route changed:", location.pathname);
};

const Header = () => {
  const location = useLocation();

  useEffect(() => {
    handleRouteChange(location);
  }, [location]);

  return <div>Header of the application</div>;
};

export default Header;
