# Cheat sheet react - basic 

- Download node https://nodejs.org
- Create react app named web - `npx create-react-app web`
- Source code is in `web/src`
- Install react routing - `npm install react-router-dom`
- Generate static content - `npm run build`

- Folder structure
```
src/
|-- components/
|   |-- Header/
|   |   |-- Header.js
|   |   |-- Header.css
|-- pages/
|   |-- Home/
|   |   |-- HomePage.js
|   |   |-- HomePage.css
|-- services/
|   |-- api.js
|   |-- auth.js
|-- utils/
|   |-- helpers.js
|   |-- constants.js
|-- App.js
|-- index.js
|-- index.css
|-- ...
```

- Name your components starting with upper case 
  - `Route` and `PrivateRoute` are custom React components.
  - `<div>`, `<span>`, `<h1>`, etc., are standard HTML elements.

- Each file will be a page 

   ```jsx
   // src/components/Navigation.js
   import React from 'react';
   import { Link } from 'react-router-dom';

   const Navigation = () => {
     return (
       <nav>
         <ul>
           <li><Link to="/">Home</Link></li>
           <li><Link to="/about">About</Link></li>
         </ul>
       </nav>
     );
   };

   export default Navigation;
   ```
- Update `src/App.js` to include the routing 

   ```jsx
   import React from 'react';
   import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
   import HomePage from './pages/HomePage';
   import AboutPage from './pages/AboutPage';
   import Navigation from './components/Navigation';

   const App = () => {
     return (
       <Router>
         <Navigation />
         <Switch>
           <Route exact path="/" component={HomePage} />
           <Route path="/about" component={AboutPage} />
         </Switch>
       </Router>
     );
   };

   export default App;
   ```

2. **Create a Context for Authentication and Authorization:**
   Create a context that holds the user's authentication status and role information. You can also include functions to check the user's roles and permissions.

   ```jsx
   // AuthContext.js
   import React, { createContext, useContext, useState } from 'react';

   const AuthContext = createContext();

   export const AuthProvider = ({ children }) => {
     const [user, setUser] = useState(null); // user object with roles/permissions

     const login = (userData) => {
       // Logic to set user data after successful login
       setUser(userData);
     };

     const logout = () => {
       // Logic to clear user data on logout
       setUser(null);
     };

     const hasPermission = (permission) => {
       // Logic to check if the user has the required permission
       return user?.permissions?.includes(permission);
     };

     return (
       <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
         {children}
       </AuthContext.Provider>
     );
   };

   export const useAuth = () => {
     return useContext(AuthContext);
   };
   ```

3. **Protect Routes with Role-Based Guards:**
   In your route configuration, you can use the `useAuth` hook from the AuthContext to protect routes based on the user's roles or permissions.

   ```jsx
   // App.js
   import React from 'react';
   import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
   import { AuthProvider } from './AuthContext';
   import Home from './Home';
   import AdminPage from './AdminPage';
   import ProfilePage from './ProfilePage';

   const PrivateRoute = ({ component: Component, roles, ...rest }) => {
     const { user, hasPermission } = useAuth();

     return (
       <Route
         {...rest}
         render={(props) =>
           user && (roles ? roles.some((role) => hasPermission(role)) : true) ? (
             <Component {...props} />
           ) : (
             <Redirect to="/login" />
           )
         }
       />
     );
   };

   const App = () => {
     return (
       <AuthProvider>
         <Router>
           <Route exact path="/" component={Home} />
           <PrivateRoute path="/admin" component={AdminPage} roles={['admin']} />
           <PrivateRoute path="/profile" component={ProfilePage} />
         </Router>
       </AuthProvider>
     );
   };

   export default App;
   ```

In this example, the `PrivateRoute` component checks if the user is authenticated and has the required roles to access the route. If the user doesn't meet the criteria, they are redirected to the login page or another appropriate page.

Please note that this example provides a basic implementation of role-based access control in React using context and routing. In a real-world application, you might want to integrate more advanced authentication mechanisms and manage user roles and permissions more robustly.
