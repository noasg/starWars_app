import { useState } from "react";

export default function TestPanel() {
  const [output, setOutput] = useState<string>("");

  const log = (title: string, data: unknown) => {
    setOutput(
      (prev) => prev + `\n\n=== ${title} ===\n` + JSON.stringify(data, null, 2)
    );
  };

  const testLogin = async () => {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "adrian@starwars.com",
        password: "jedi",
      }),
    });

    log("LOGIN RESULT", await res.json());
  };

  const testLoginInvalid = async () => {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "wrong@mail.com",
        password: "nope",
      }),
    });

    log("INVALID LOGIN RESULT", await res.json());
  };

  const testRefresh = async () => {
    const res = await fetch("/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: "mock_refresh_token" }),
    });

    log("REFRESH RESULT", await res.json());
  };

  const testExpiredRefresh = async () => {
    const res = await fetch("/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: "expired_token" }),
    });

    log("EXPIRED REFRESH RESULT", await res.json());
  };

  // const testProtected = async () => {
  //   const res = await fetch("/protected/secret", {
  //     headers: { Authorization: "Bearer mock_access_token" },
  //   });

  //   log("PROTECTED RESULT", await res.json());
  // };

  // const testProtectedExpired = async () => {
  //   const res = await fetch("/protected/secret", {
  //     headers: { Authorization: "Bearer expired_token" },
  //   });

  //   log("EXPIRED TOKEN PROTECTED RESULT", await res.json());
  // };

  const clearLog = () => setOutput("");

  return (
    <div
      style={{
        padding: "20px",
        background: "#111",
        color: "#0f0",
        fontFamily: "monospace",
        borderRadius: "8px",
        margin: "20px",
      }}
    >
      <h2> MSW Test Panel</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <button onClick={testLogin}>Login</button>
        <button onClick={testLoginInvalid}>Invalid Login</button>
        <button onClick={testRefresh}>Refresh Token</button>
        <button onClick={testExpiredRefresh}>Expired Refresh</button>
        {/* <button onClick={testProtected}>Protected</button> */}
        {/* <button onClick={testProtectedExpired}>Expired Protected</button> */}
        <button onClick={clearLog}>Clear Log</button>
      </div>

      <pre style={{ whiteSpace: "pre-wrap" }}>
        {output || "Click a button to test an endpoint."}
      </pre>
    </div>
  );
}
