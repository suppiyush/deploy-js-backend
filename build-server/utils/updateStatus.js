import { config } from "./config.js";
import jwt from "jsonwebtoken";

export async function updateStatus(status) {
  try {
    const tokenPayload = {
      role: "BUILD_SERVER",
    };

    const token = jwt.sign(tokenPayload, config.BUILD_SERVER_TOKEN_SECRET, {
      expiresIn: config.BUILD_SERVER_TOKEN_EXPIRY,
    });

    const response = await fetch(`${config.API_SERVER_URL}/deployment/${config.DEPLOYMENT_ID}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
      }),
    });

    const parsedResponse = await response.json();
    if (!response.ok) throw new Error();

    console.log(parsedResponse.data.message);
  } catch (err) {
    console.error("API-SERVER Request failed, Couldn't update Deployment Status");
  }
}
