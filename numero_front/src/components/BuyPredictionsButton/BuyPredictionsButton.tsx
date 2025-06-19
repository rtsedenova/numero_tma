import React from "react";
import WebApp from "@twa-dev/sdk";
import { api, API_ENDPOINTS } from "@/config/api";

type BuyPredictionsButtonProps = {
  price: number;
};

interface InvoiceResponse {
  success: boolean;
  invoiceLink?: string;
  error?: string;
}

const validPrices = [3, 4, 5]; 

const BuyPredictionsButton: React.FC<BuyPredictionsButtonProps> = ({
  price,
}) => {
  const handleBuy = async () => {
    if (!validPrices.includes(price)) {
      WebApp.showPopup({
        title: "Error",
        message: "Invalid price",
        buttons: [{ type: "close" }],
      });
      return;
    }

    const userFromTelegram = WebApp.initDataUnsafe?.user;
    const userId = userFromTelegram?.id;

    if (!userId) {
      WebApp.showPopup({
        title: "Error",
        message: "User not found",
        buttons: [{ type: "close" }],
      });
      return;
    }

    try {
      const response = await api.post<InvoiceResponse>(API_ENDPOINTS.payment.createInvoice, {
        payload: `User_${userId}_${Date.now()}`,
        currency: "XTR",
        prices: [{ amount: price }],
      });

      if (response.data.success && response.data.invoiceLink) {
        WebApp.openInvoice(response.data.invoiceLink, (status) => {
          console.log("Payment status:", status);
          if (status === "paid") {
            WebApp.showPopup({
              title: "Success!",
              message: "You successfully bought predictions",
              buttons: [{ type: "ok" }],
            });
          }
        });
      } else {
        WebApp.showPopup({
          title: "Error",
          message: `Invoice creation failed: ${response.data.error || "Unknown error"}`,
          buttons: [{ type: "close" }],
        });
      }
    } catch (error) {
      console.error("Invoice creation error:", error);
      WebApp.showPopup({
        title: "Error",
        message: "Something went wrong while creating the invoice.",
        buttons: [{ type: "close" }],
      });
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleBuy}>
      Buy predictions for {price}⭐
    </button>
  );
};

export default BuyPredictionsButton;
