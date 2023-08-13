import React from 'react';
import PropTypes from 'prop-types';
import './Layout.css'; // Import your CSS for styling

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <main className="main">{children}</main>
      <footer className="footer">Footer Content</footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;