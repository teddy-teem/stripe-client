import "../App.css";
import axios from "axios";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "./components/loader"

function Stripe() {
  const location = useLocation();
  const elements = useElements();
  const stripe = useStripe();
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);
    const { token } = await stripe.createToken(
      elements.getElement(CardElement)
    );
    const requestBody = {
      token: token.id,
      name: location.state.name,
      contactId: location.state.contactId,
      email: location.state.email,
      amount: Number(amount) * 100,
      currency: "USD"
    };

    const response = await axios
      .post("http://192.168.11.234:2021/client-payment", requestBody)
      .then(response => {
        setAmount(0);
        setLoading(false);
        return response.data;
      })
      .catch(err => {
        setLoading(false);
        setErrorMessage(err.message || "Failed to make payment");
        setError(true);
        console.log(err);
      });
    if (response.data && response.data.status && response.data.status === "requires_action") {
      //For 3DS
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        response.data.client_secret
      );
      if (error) {
        setLoading(false);
        setErrorMessage("Failed to confirm payment");
        setError(true);
        return;
      }
      if (paymentIntent.status === "succeeded") {
        setLoading(false);
        setSuccess(true);
        return;
      }
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  const updateBalance = async () => {
    //FIXME->make sure webhook url is placed in the dashboard
    //FIXME->and ddb is available for fs-service
    const customer = await axios
      .get(`http://192.168.1.123:2021/customer/${location.state.contactId}`)
      .then(response => response.data.data)
      .catch(err => {
        setError(true);
        setErrorMessage("Failed to fetch balance");
      });
    const balance = customer ? customer.balance || 0 : 0;
    setBalance(Number(balance));
  };
  useEffect(() => {
    (async () => {
      await updateBalance();
    })();
  }, [location.state.contactId, success]);

  useEffect(() => {
    setTimeout(async () => {
      await updateBalance();
    }, 3000);
  }, [success]);

  return (
    <>
      <div>
        <h2>Logged in user: {location.state.name}</h2>
        <h2>User balance: {balance}</h2>
      </div>
      <div>
        <form id="payment-form">
          <label htmlFor="amount">Enter Amount ($)</label>
          <input
            id="amount"
            onChange={e => {
              setAmount(e.target.value);
            }}
            value={amount}
          />
          <label htmlFor="card-element">Card</label>
          <CardElement id="card-element" />
          {isLoading && <Loader />}
          <button onClick={handleSubmit} disabled={isLoading}>Pay</button>
          {success && <h4 className="success-payment">Payment Done!</h4>}
          {error && <h4 className="error-payment">{errorMessage || "Unknown error occured!"} </h4>}
        </form>
      </div>
    </>
  );
}

export default Stripe;
