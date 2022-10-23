import React, {useEffect} from "react";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../state/slices/authSlice";
import { useHistory } from "react-router-dom";

let web3 = undefined;
const apiURL = "http://localhost:8000";

export default function Login() {
  const history = useHistory();
  const token = useSelector(s => s.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    token && history.push('/profile')
  }, [token])

  const handleAuthenticate = ({ publicAddress, signature }) =>
    fetch(`${apiURL}/auth`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((response) => response.json());

  const handleSignMessage = async ({ publicAddress, nonce }) => {
    try {
      const signature = await web3?.eth.personal.sign(
        `I am signing my one-time nonce: ${nonce}`,
        publicAddress,
        "" // MetaMask will ignore the password argument here
      );

      return { publicAddress, signature };
    } catch (err) {
      throw new Error("You need to sign the message to be able to log in.");
    }
  };

  const handleSignup = (publicAddress) =>
    fetch(`${apiURL}/users`, {
      body: JSON.stringify({ publicAddress }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((response) => response.json());

  const handleClick = async () => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      window.alert("Please install MetaMask first.");
      return;
    }

    if (!web3) {
      try {
        // Request account access if needed
        await window.ethereum.enable();

        // We don't know window.web3 version, so we use our own instance of Web3
        // with the injected provider given by MetaMask
        web3 = new Web3(window.ethereum);
      } catch (error) {
        window.alert("You need to allow MetaMask.");
        return;
      }
    }

    const coinbase = await web3.eth.getCoinbase();
    if (!coinbase) {
      window.alert("Please activate MetaMask first.");
      return;
    }

    const publicAddress = coinbase.toLowerCase();

    // Look if user with current publicAddress is already present on backend
    fetch(`${apiURL}/users?publicAddress=${publicAddress}`)
      .then((response) => response.json())
      // If yes, retrieve it. If no, create it.
      .then((user) => (user?.nonce ? user : handleSignup(publicAddress)))
      // Popup MetaMask confirmation modal to sign message
      .then(handleSignMessage)
      // // Send signature to backend on the /auth route
      .then(handleAuthenticate)
      .then((auth) => {
        dispatch(setToken(auth.accessToken));
        history.push("/profile");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="wrapper">
      <button onClick={handleClick}>Connect with metamask</button>
    </div>
  );
}
