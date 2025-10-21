import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// نقطة الدخول الأساسية
app.post("/proxy", async (req, res) => {
  try {
    // العنوان اللي عايز توصله من APEX
    const targetUrl = req.query.url; // يجي في الاستدعاء كـ ?url=https://api.target.com/receive

    // تحقق إن الرابط موجود
    if (!targetUrl) {
      return res.status(400).send("Missing target URL (use ?url=...)");
    }

    // إرسال الطلب للـ API الخارجي
    const apiResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
      },
      body: JSON.stringify(req.body),
    });

    const data = await apiResponse.text();
    res.status(apiResponse.status).send(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error: " + err.message);
  }
});

app.listen(3000, () => console.log("✅ Proxy API running on port 3000"));
