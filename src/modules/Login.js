import "../App.css";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const users = [
  {name: "Adam", email: "adam@gmail.com", contactId: "73eb39c9-afa3-4b1a-bd1f-6c1248fff842"},
  {name: "Smith", email: "smith@gmail.com", contactId: "e62a214f-d318-42a3-83a5-d28e7a8df22e"},
  {name: "Test", email: "test@gmail.com", contactId: "4946e8a7-f3d3-470e-a43d-f55f2abbb7d7"},
  {name: "RFT", email: "RFT@gmail.com", contactId: "4946e8a7-f3a3-470e-a45d-f5528abbb7dq"},
  {name: "xyz", email: "xyz@gmail.com", contactId: "4946e8w5-f3a3-470e-a45d-f5528abbb852"},
  {name: "test1", email: "test1@gmail.com", contactId: "4946e8w5-f3a3-a70e-a45d-f5528ab66552"},
  {name: "test2", email: "test1@gmail.com", contactId: "1236e8w5-f3a3-a70e-a45d-f5528ab66552"},
  {name: "test3", email: "email@email.com", contactId: "12362222-f3a3-a70e-a45d-f5528ab66552"},
  {name: "test4", email: "email@email.com", contactId: "12222334-f3a3-a70e-a45d-f5528ab66552"},
  {name: "test5", email: "email@email.com", contactId: "65422333-f3a3-a70e-a45d-f5528ab66552"},
  {name: "test6", email: "email@email.com", contactId: "13455222-f3a3-a70e-a45d-f5528ab66552"},
  {name: "test7", email: "email@email.com", contactId: "12377222-f3a3-a70e-a45d-f5528ab66552"},
]

function Login() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const user = users.filter(item => item.name.toLowerCase() === name.toLowerCase())[0];
    if (user) {
      navigate("/payment", { state: { name: user.name, email: user.email, contactId: user.contactId} });
    }
    else{
      alert("Wrong user name provided!");
    }
  };
  return (
    <>
      <div>
        <form id="payment-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Enter User Name</label>
          <input
            id="name"
            onChange={e => {
              setName(e.target.value);
            }}
          />

          <button onClick={handleSubmit}>Confirm</button>
        </form>
      </div>
    </>
  );
}

export default Login;
