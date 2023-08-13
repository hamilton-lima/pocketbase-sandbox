import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const handleRouteChange = (location) => {
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
