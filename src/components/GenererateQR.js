import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./Modals.css";
import { Button, Header, Modal } from "semantic-ui-react";

const GenererateQR = ({ isOpen, closeQRModal }) => {
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    const loadQR = async () => {
      console.log("GenererateQR: loadQR called");
      try {
        if (!window.web3) {
          console.error("GenererateQR: Web3 not initialized");
          return;
        }
        const accounts = await window.web3.eth.getAccounts();
        console.log("GenererateQR: Accounts found", accounts);
        if (accounts && accounts[0]) {
          setQrData(accounts[0]);
          console.log("GenererateQR: qrData set to", accounts[0]);
        } else {
          console.error("GenererateQR: No accounts found");
        }
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    if (isOpen) {
      loadQR();
    }
  }, [isOpen]);

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = url;
      link.click();
    }
  };

  return (
    <Modal size="tiny" className="modal-des" open={isOpen}>
      <Header
        className="modal-heading"
        icon="qrcode"
        content="Scan or Download"
        as="h2"
      />
      <Modal.Content className="modal-content pos-middle-qr">
        {qrData && <QRCodeCanvas value={qrData} size={200} />}
      </Modal.Content>
      <Modal.Actions className="modal-actions">
        <Button
          className="close-button"
          type="button"
          color="red"
          icon="times"
          content="Close"
          onClick={closeQRModal}
        />
        <Button
          type="button"
          color="green"
          icon="download"
          content="Download"
          onClick={handleDownload}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default GenererateQR;