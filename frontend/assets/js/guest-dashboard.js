(function () {
  const api = (path) => String(window.APP_API_BASE || "").replace(/\/$/, "") + path;

  const submitForm = document.getElementById("form-submit-ticket");
  const submitAlert = document.getElementById("submit-alert");
  const trackForm = document.getElementById("form-track-ticket");
  const trackAlert = document.getElementById("track-alert");
  const trackResult = document.getElementById("track-result");

  function show(el, cls, html) {
    el.classList.add("alert--show", cls === "success" ? "alert--success" : "alert--error");
    el.classList.remove(cls === "success" ? "alert--error" : "alert--success");
    el.textContent = html;
  }

  function hideAlerts() {
    [submitAlert, trackAlert].forEach((el) => {
      if (!el) return;
      el.classList.remove("alert--show", "alert--success", "alert--error");
      el.textContent = "";
    });
  }

  if (submitForm) {
    submitForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideAlerts();
      const fd = new FormData(submitForm);
      const body = {
        category_id: fd.get("category_id").trim(),
        subject: fd.get("subject").trim(),
        description: fd.get("description").trim(),
        submitter_email: fd.get("submitter_email").trim() || null,
      };

      try {
        const res = await fetch(api("/api/tickets/submit"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.success) {
          show(submitAlert, "error", data.message || "Could not submit ticket.");
          return;
        }

        show(
          submitAlert,
          "success",
          `${data.message || "Submitted."} Code: ${data.ticket_code}`
        );
        submitForm.reset();
      } catch {
        show(submitAlert, "error", "Network error. Is the API running?");
      }
    });
  }

  if (trackForm && trackResult) {
    trackForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideAlerts();
      trackResult.classList.remove("track-result--show");
      trackResult.innerHTML = "";

      const code = (
        trackForm.querySelector('[name="ticket_code"]').value || ""
      ).trim();
      if (!code) {
        show(trackAlert, "error", "Enter a ticket code.");
        return;
      }

      try {
        const enc = encodeURIComponent(code);
        const res = await fetch(api(`/api/tickets/track/${enc}`));
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.success || !data.ticket) {
          show(trackAlert, "error", data.message || "Ticket not found.");
          return;
        }

        const t = data.ticket;
        const cat =
          (t.categories && (t.categories.name || t.categories[0]?.name)) || "—";

        trackResult.innerHTML = `
          <dl>
            <dt>Ticket code</dt><dd>${escapeHtml(String(t.ticket_code))}</dd>
            <dt>Subject</dt><dd>${escapeHtml(String(t.subject))}</dd>
            <dt>Status</dt><dd>${escapeHtml(String(t.status))}</dd>
            <dt>Priority</dt><dd>${escapeHtml(String(t.priority || "—"))}</dd>
            <dt>Category</dt><dd>${escapeHtml(String(cat))}</dd>
            <dt>Updated</dt><dd>${escapeHtml(String(t.updated_at || "—"))}</dd>
          </dl>
        `;
        trackResult.classList.add("track-result--show");
      } catch {
        show(trackAlert, "error", "Network error.");
      }
    });
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }
})();
