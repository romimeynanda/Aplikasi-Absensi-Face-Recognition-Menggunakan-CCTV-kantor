# Mikrotik Optimization Verification Checklist

Use this checklist to verify that the Active-Active Load Balancing, CAKE QoS, and Failover scripts are working correctly.

## 1. Check Mangle & Routing (Active-Active)
**Goal:** Ensure traffic is balanced and session stability is maintained.

*   **Open WebFig/Winbox:** Go to `IP` -> `Firewall` -> `Mangle`.
*   **Check "Bytes/Packets" Columns:**
    *   Observe the 11 PCC rules (`3_PCC_ISP1...` and `3_PCC_ISP2...`).
    *   **Verify:** Counters should be increasing on BOTH ISP groups (e.g., slot0 has traffic, slot6 has traffic). This indicates Load Balancing is active.
*   **Check IP Stability (Crucial):**
    *   Open a browser and visit: `https://www.whatismyip.com`
    *   Refresh the page 5-10 times.
    *   **Verify:** The IP Address should **NOT CHANGE** during refreshes (it should stay sticky to either ISP 1 or ISP 2).
    *   *If it changes:* PCC mode might still be `both-addresses-and-ports` (incorrect).
    *   *If it stays:* PCC mode is `both-addresses` (Correct/Stable).

## 2. Check Cloudflare Tunnel Stability
**Goal:** Ensure the tunnel utilizes the Active-Active setup.

*   **Open aaPanel Terminal:** Check `cloudflared` status.
    ```bash
    journalctl -u cloudflared -f
    ```
*   **Verify:** Status should be "Healthy" or "Connected".
*   **Failover Test:**
    1.  Reconnect ISP 2 (if disconnected).
    2.  Wait 1 minute.
    3.  Disconnect ISP 1 (Simulate Main ISP failure).
    4.  **Verify:** Access the server via its domain from an external network. It should remain accessible.

## 3. Check CAKE QoS (Anti-Lag)
**Goal:** Ensure the smart bandwidth limiter is active.

*   **Open WebFig/Winbox:** Go to `Queues` -> `Simple Queues`.
*   **Check Queue `01_Total_Office_CAKE`:**
    *   Icon should be **Green** (or Yellow/Red if traffic is high).
    *   Double click -> **Advanced** tab.
    *   **Verify:** `Queue Type` for Upload/Download is set to `cake-upload` and `cake-download`.
*   **Bufferbloat Test:**
    *   Visit `https://www.waveform.com/tools/bufferbloat`
    *   **Verify:** Grade A or B. Latency under load should not spike significantly compared to idle latency.

## 4. Check Router Self-Traffic
**Goal:** Ensure the router can communicate with the internet correctly via both WANs.

*   **Open Terminal (Mikrotik):**
    ```mikrotik
    /ping 8.8.8.8 count=4 interface=ether1
    /ping 8.8.8.8 count=4 interface=ether2
    ```
*   **Verify:** Both commands must return **Reply**. If Timeout, the Input/Output Mangle rules are not working.

## 5. Check Script Failover & Netwatch
**Goal:** Ensure automatic status updates.

*   **Open WebFig/Winbox:** Go to `System` -> `Scripts` -> `Environment` tab.
*   **Check Variables:** `ISP1Status` and `ISP2Status`.
*   **Verify Status:**
    *   If ISP 1 is UP and ISP 2 is Disconnected: `ISP1Status="up"`, `ISP2Status="down"`.
    *   If ISP 2 is reconnected: `ISP2Status` should change to `"up"` within 1-2 minutes (Netwatch interval).
