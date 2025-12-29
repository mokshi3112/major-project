// src/components/ScanQR.js
import React, { useRef, useState, useEffect } from "react";
import "./Modals.css";
import QrReader from "react-qr-reader";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

/**
 * Props:
 *  - isOpen (bool)
 *  - handleAddAddress(addr: string)
 *  - closeScanQRModal()
 *
 * Behavior:
 *  - legacyMode upload (openImageDialog) for file upload
 *  - live camera scan when toggled
 *  - safe-guards for qrRef being null
 *  - validates and extracts Ethereum address before calling handleAddAddress
 */

const isEthAddress = (s) => {
  if (!s || typeof s !== "string") return false;
  const m = s.match(/0x[a-fA-F0-9]{40}/);
  return m ? m[0] : false;
};

function ScanQR(props) {
  const qrRef = useRef(null);
  const [scanRes, setScanRes] = useState("");
  const [forward, setForward] = useState(false); // false -> upload, true -> live scan
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleError = (err) => {
    console.warn("QR ERROR:", err);
  };

  const handleScan = (res) => {
    if (!res) return;
    // extract an ethereum address if present
    const extracted = isEthAddress(res);
    if (extracted) {
      setScanRes(extracted);
      if (props.handleAddAddress) props.handleAddAddress(extracted);
      // do NOT auto-close here unless you want to - caller can close
    } else {
      // try to handle if QR contains other metadata with address inside
      const maybe = res.match(/0x[a-fA-F0-9]{40}/i);
      if (maybe && maybe[0]) {
        setScanRes(maybe[0]);
        if (props.handleAddAddress) props.handleAddAddress(maybe[0]);
      } else {
        setScanRes(res); // still show raw to user
        // optionally notify user externally that it's invalid
      }
    }
  };

  const onUploadQR = () => {
    // only call when mounted and ref exists
    if (qrRef.current && typeof qrRef.current.openImageDialog === "function") {
      qrRef.current.openImageDialog();
      return;
    }

    // sometimes the modal toggles and QrReader hasn't mounted yet; retry shortly
    let attempts = 0;
    const tryOpen = () => {
      attempts += 1;
      if (qrRef.current && typeof qrRef.current.openImageDialog === "function") {
        qrRef.current.openImageDialog();
      } else if (attempts < 6) {
        setTimeout(tryOpen, 150);
      } else {
        console.warn("QR reader not ready after retries. Ensure modal is open and QrReader is mounted.");
      }
    };
    tryOpen();
  };

  return (
    <Modal size="tiny" className="modal-des" open={!!props?.isOpen} onClose={() => props?.closeScanQRModal?.()}>
      <Icon
        name={!forward ? "arrow alternate circle right outline" : "arrow alternate circle left outline"}
        size="big"
        style={{ float: "right", marginTop: "30px", marginRight: "20px", cursor: "pointer" }}
        onClick={() => setForward((f) => !f)}
      />

      <Header
        className="modal-heading"
        icon="qrcode"
        content={!forward ? "Upload QR (file)" : "Scan QR (camera)"}
        as="h2"
      />

      {!forward ? (
        <Modal.Content className="modal-content pos-middle-qr">
          <Button
            type="button"
            icon="upload"
            content="Upload QR"
            onClick={onUploadQR}
          />

          <div style={{ width: "220px", height: "220px", margin: "20px auto", textAlign: "center" }}>
            <QrReader
              ref={qrRef}
              delay={300}
              onError={handleError}
              onScan={handleScan}
              legacyMode={true}
            />
          </div>

          <h4 style={{ textAlign: "center", wordBreak: "break-all" }}>Uploaded Address: {scanRes}</h4>
        </Modal.Content>
      ) : (
        <Modal.Content className="modal-content pos-middle-qr">
          <div style={{ width: "260px", height: "260px", margin: "20px auto", textAlign: "center" }}>
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
            />
          </div>

          <h4 style={{ textAlign: "center", wordBreak: "break-all" }}>Scanned Address: {scanRes}</h4>
        </Modal.Content>
      )}

      <Modal.Actions className="modal-actions">
        <Button
          className="close-button"
          type="button"
          color="red"
          icon="times"
          content="Close"
          onClick={() => props?.closeScanQRModal?.()}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default ScanQR;
