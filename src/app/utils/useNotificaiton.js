import { getToken } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import axios from "axios";
import { toast } from "react-toastify";

export const enableNotification = async () => {

  const permission = await Notification.requestPermission();
  console.log(permission)
  const token = localStorage.getItem("codeflam01_token");
  try {
     if (permission === "granted") {
    const fcmtoken = await getToken(messaging, {
      vapidKey: "BOvn9PI5E7TjXhGcqD6weOmti9J3nLHRb8Kzjbzs9-13y9lSj5F35vhV2e64EDKUf_q_fJ15lH_pJ2kYPMboU6Y"
    });

  const response =  await axios.post("http://13.53.160.202/api/v1/notification/save-token", {
      fcmToken: fcmtoken,
      device: "WEB"
    },
   { headers: { Authorization: `Bearer ${token}` } });
   console.log("Notification token saved:", response);
  }else{
    alert("You have denied notification permission");
  }
  } catch (error) {
    console.log(error);
     toast.error("failed to notification")
  }
 
};
