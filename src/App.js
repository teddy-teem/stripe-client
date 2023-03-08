import "./App.css";
import Stripe from "./modules/Stripe";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./modules/Login";

const publicKey = ;
const stripePromise = loadStripe(publicKey);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/payment"
            element={
              <Elements stripe={stripePromise}>
                <Stripe />
              </Elements>
            }
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
