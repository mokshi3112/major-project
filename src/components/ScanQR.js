import React, { useRef, useState } from "react";
import "./Modals.css";
import QrReader from "react-qr-reader";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

function ScanQR(props) {
  const fileInputRef = useRef(null);
  const [scanRes, setScanRes] = useState("");
  const [forward, setforward] = useState(false);
  const [error, setError] = useState("");

  const handleError = (err) => {
    console.error("QR Scanner Error:", err);
    setError("Error scanning QR code. Please try again.");
  };

  const handleScan = (data) => {
    if (data) {
      setScanRes(data);
      props.handleAddAddress(data);
      setError("");
    }
  };

  const onUploadQR = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const jsQR = (await import("jsqr")).default;
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
              setScanRes(code.data);
              props.handleAddAddress(code.data);
              setError("");
            } else {
              setError("No QR code found in image");
            }
          } catch (err) {
            console.error("Error decoding QR from image:", err);
            setError("Failed to decode QR code from image");
          }
        };
        img.onerror = () => {
          setError("Failed to load image");
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error reading file:", err);
      setError("Failed to read file");
    }
  };

  return (
    <Modal
      closeIcon
      open={props.isOpen}
      onClose={() => props.closeScanQRModal()}
    >
      <Header icon="qrcode" content="Scan QR Code" />
      <Modal.Content>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "20px" }}>
            <Button.Group>
              <Button
                positive={!forward}
                onClick={() => setforward(false)}
              >
                Upload QR Image
              </Button>
              <Button.Or />
              <Button
                positive={forward}
                onClick={() => setforward(true)}
              >
                Use Camera
              </Button>
            </Button.Group>
          </div>

          {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </div>
          )}

          {!forward ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <Button
                primary
                icon
                labelPosition="left"
                onClick={onUploadQR}
                size="large"
              >
                <Icon name="upload" />
                Choose QR Code Image
              </Button>
            </div>
          ) : (
            <div style={{ maxWidth: "500px", margin: "0 auto" }}>
              <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "100%" }}
              />
            </div>
          )}

          {scanRes && (
            <div style={{ marginTop: "20px", wordBreak: "break-all" }}>
              <strong>Scanned Result:</strong>
              <div style={{
                padding: "10px",
                background: "#f0f0f0",
                borderRadius: "5px",
                marginTop: "10px"
              }}>
                {scanRes}
              </div>
            </div>
          )}
        </div>
      </Modal.Content>
    </Modal>
  );
}

export default ScanQR;
