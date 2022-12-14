import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { deleteToken } from "../state/slices/authSlice";

export default function Profile() {
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);

  useEffect(() => {
    !token && history.push("/");
  }, [history, token]);

  const handleLogout = () => {
    dispatch(deleteToken());
    history.push("/");
  };

  return (
    <>
      <p>token: {token}</p>
      <button onClick={handleLogout}>Log out</button>
    </>
  );
}
