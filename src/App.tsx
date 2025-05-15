import React from "react";
//import logo from './logo.svg';
import { ToastContainer } from "react-toastify";
import "./App.css";
import { UserPage } from "./pages/UsersPage";

function App() {
  return (
    <div className="App bg-theme-color-2 text-theme-color-1">
      <header /* className="App-header" */>
        <div className="min-h-10 max-h-14 py-10 ml-12">
          <div className="w-28" /* data-ste-element="Logo" */>
            <a
              /* tabIndex="0" */
              title="Siemens"
              aria-label="Siemens"
              href="https://www.siemens.com/hu/en.html"
              target="_self" /* data-ste-element="logo" */
            >
              <div className="bg-[url('/src/assets/logo.svg')] w-28 h-5 bg-no-repeat bg-contain logo__logoSiemens logo__logoSiemens--white"></div>
            </a>
          </div>
        </div>
      </header>

      <main className="py-10 mx-auto w-3/4">
        <UserPage />

        <ToastContainer />
      </main>
    </div>
  );
}

export default App;
