import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import "./TicketPage.css";

const TicketPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState(location.state?.status || "registered");
  const [isScanning, setIsScanning] = useState(false);
  const [eventName, setEventName] = useState("Loading...");

  /* ======================
     AUTH CHECK
     ====================== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      if (!parsed?.id) throw new Error();
      setUserId(parsed.id);
    } catch {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  /* ======================
     FETCH EVENT DATA
     ====================== */
  useEffect(() => {
    if (!userId) return;

    fetch("https://backendcems.onrender.com/api/events")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const found = data.find(e => e.id === Number(id));
        if (found) setEventName(found.title);
      })
      .catch(() => {});

    fetch(`https://backendcems.onrender.com/api/my-events/${userId}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const ev = data.find(e => e.id === Number(id));
        if (ev?.status) setStatus(ev.status.toLowerCase());
      })
      .catch(() => {});
  }, [id, userId]);

  /* ======================
     QR SCANNER (STABLE)
     ====================== */
  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5Qrcode("qr-reader");

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        markAttendance(decodedText);
        scanner.stop();
      }
    ).catch(() => {
      alert("Camera access failed");
      setIsScanning(false);
    });

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [isScanning]);

  const markAttendance = (qrText) => {
    fetch("https://backendcems.onrender.com/api/mark-attendance-dynamic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        qr_data: qrText,
        user_id: userId
      })
    })
      .then(async res => {
        const text = await res.text();
        if (!text) throw new Error();
        return JSON.parse(text);
      })
      .then(resData => {
        if (resData.success) {
          setStatus("attended");
        } else {
          alert(resData.message || "Invalid QR");
        }
      })
      .catch(() => alert("Server error"))
      .finally(() => setIsScanning(false));
  };

  return (
    <div className="home-wrapper ticket-page" style={{ background: "#fdf4f6", minHeight: "100vh" }}>
      {/* HEADER */}
      <div
        className="ticket-header"
        style={{
          background: "white",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #eee"
        }}
      >
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}
        >
          ←
        </button>
        <h3 style={{ color: "#961c46", margin: 0 }}>
          {status === "attended" ? "Your Certificate" : "Event Check-In"}
        </h3>
        <div style={{ width: 40 }} />
      </div>

      {/* CONTENT */}
      <div className="home-scroll-content centered-content" style={{ padding: "20px", textAlign: "center" }}>
        {status !== "attended" && !isScanning && (
          <div
            className="scan-prompt-card"
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "30px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              marginTop: "20px"
            }}
          >
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>📸</div>
            <h2 style={{ color: "#333" }}>Ready to Scan?</h2>
            <p style={{ color: "#666" }}>
              Scan QR for <br />
              <b style={{ color: "#961c46" }}>{eventName}</b>
            </p>
            <button
              onClick={() => setIsScanning(true)}
              style={{
                background: "#961c46",
                color: "white",
                padding: "18px 30px",
                borderRadius: "35px",
                border: "none",
                fontWeight: "bold",
                width: "100%",
                marginTop: "25px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Open Attendance Scanner
            </button>
          </div>
        )}

        {isScanning && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "black",
              zIndex: 10000
            }}
          >
            <div id="qr-reader" style={{ width: "100%", height: "100%" }} />
            <button
              onClick={() => setIsScanning(false)}
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                padding: "20px",
                background: "white",
                border: "none",
                fontWeight: "bold",
                fontSize: "18px",
                cursor: "pointer"
              }}
            >
              CLOSE SCANNER
            </button>
          </div>
        )}

        {status === "attended" && (
          <div
            className="cert-card"
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "25px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              marginTop: "20px"
            }}
          >
            <div style={{ fontSize: "70px", marginBottom: "20px" }}>🎓</div>
            <h2 style={{ color: "#27ae60" }}>Attendance Verified!</h2>
            <p style={{ color: "#666" }}>
              Download your certificate for <b>{eventName}</b>
            </p>
            <a
              href={`https://backendcems.onrender.com/api/certificate/${id}/${userId}`}
              download
              style={{
                background: "#961c46",
                color: "white",
                textDecoration: "none",
                display: "block",
                padding: "18px",
                borderRadius: "15px",
                fontWeight: "bold",
                marginTop: "25px",
                fontSize: "16px"
              }}
            >
              Get My Certificate ⬇️
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketPage;
