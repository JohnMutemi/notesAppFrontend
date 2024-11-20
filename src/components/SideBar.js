import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-dark text-white p-4 flex-shrink-0 w-64 min-h-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-primary">Notes App</h2>
      </div>
      <ul className="space-y-4">
        <li>
          <Link to="/" className="block py-2 px-4 rounded-lg hover:bg-primary">
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/html"
            className="block py-2 px-4 rounded-lg hover:bg-primary">
            HTML Notes
          </Link>
        </li>
        <li>
          <Link
            to="/css"
            className="block py-2 px-4 rounded-lg hover:bg-primary">
            CSS Notes
          </Link>
        </li>
        <li>
          <Link
            to="/js"
            className="block py-2 px-4 rounded-lg hover:bg-primary">
            JavaScript Notes
          </Link>
        </li>
        <li>
          <Link
            to="/react"
            className="block py-2 px-4 rounded-lg hover:bg-primary">
            React Notes
          </Link>
        </li>
        <li>
          <Link
            to="/python"
            className="block py-2 px-4 rounded-lg hover:bg-primary">
            Python Notes
          </Link>
        </li>
        <li>
          <Link
            to="/flask"
            className="block py-2 px-4 rounded-lg hover:bg-primary">
            Flask Notes
          </Link>
        </li>
      </ul>
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-grow bg-light p-6">{children}</main>
    </div>
  );
};

export default Layout;
