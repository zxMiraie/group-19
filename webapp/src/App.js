import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Private } from "./components/ProtectedRoute/ProtectedRoute";
import { history } from "./helpers/helpers";
import { Navbar } from "./components/Navbar";
import { Signup } from "./components/Signup";
import { Signin } from "./components/Signin";
import { Account } from "./components/Account";
import Home from "./pages";
import Publications from "./pages/publications";
import NewPublication from "./pages/newPublication";
import Events from "./pages/events";
import NewEvent from "./pages/newEvent";
import {Signout} from "./components/Signout";
import {SimulatorEditor, SimulatorRunner} from "./components/Simulator";
import EditPublication from "./pages/editPublication";
import EditEvent from "./pages/editEvent";


function App() {
  return (
      <Router history={history}>
        <div>
          <Navbar />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route exact path='/publications' element={<Publications/>}/>
              <Route path='/newPublication' element={<NewPublication />} />
              <Route exact path='/events' element={<Events/>}/>
              <Route path='/newEvent' element={<NewEvent />} />
              <Route path='/editEvent' element={<EditEvent />} />
              <Route path="/simulator/edit" element={<SimulatorEditor />} />
              <Route path="/simulator/run" element={<SimulatorRunner />} />
              <Route path='/editPublication' element={<EditPublication />} />
              <Route path="/sign-up" element={<Signup />} />
              <Route path="/sign-in" element={<Signin />} />
              <Route path="/" element={<Private />}>
              <Route path="/account" element={<Account />} />
              <Route path="/Sign-out" element={<Signout />} />
            </Route>
            <Route
                path="*"
                element={
                  <main style={{ padding: "1rem" }}>
                    <p>You've hit a blank page :(</p>
                  </main>
                }
            />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
