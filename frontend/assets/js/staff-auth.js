(function () {
  const api = (path) => String(window.APP_API_BASE || "").replace(/\/$/, "") + path;

  const loginForm = document.getElementById("form-staff-login");
  const loginAlert = document.getElementById("login-alert");

  function showLogin(msg, isError) {
    if (!loginAlert) return;
    loginAlert.textContent = msg;
    loginAlert.classList.add("alert--show");
    loginAlert.classList.toggle("alert--error", isError);
    loginAlert.classList.toggle("alert--success", !isError);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      loginAlert.classList.remove("alert--show", "alert--error", "alert--success");
      const fd = new FormData(loginForm);
      const body = {
        email: fd.get("email").trim(),
        password: fd.get("password"),
      };

      try {
        const res = await fetch(api("/api/auth/login"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.success || !data.token) {
          showLogin(data.message || "Login failed.", true);
          return;
        }

        try {
          localStorage.setItem("staff_token", data.token);
          if (data.staff) {
            localStorage.setItem("staff_profile", JSON.stringify(data.staff));
          }
        } catch {
          /* ignore */
        }

        showLogin(data.message || "Signed in. Add a staff dashboard route when ready.", false);
      } catch {
        showLogin("Network error. Is the API running?", true);
      }
    });
  }

  const regForm = document.getElementById("form-staff-register");
  const regAlert = document.getElementById("register-alert");

  function showReg(msg, isError) {
    if (!regAlert) return;
    regAlert.textContent = msg;
    regAlert.classList.add("alert--show");
    regAlert.classList.toggle("alert--error", isError);
    regAlert.classList.toggle("alert--success", !isError);
  }

  if (regForm) {
    regForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      regAlert.classList.remove("alert--show", "alert--error", "alert--success");
      const fd = new FormData(regForm);
      const body = {
        full_name: fd.get("full_name").trim(),
        email: fd.get("email").trim(),
        password: fd.get("password"),
        role: fd.get("role").trim() || "staff",
      };

      try {
        const res = await fetch(api("/api/auth/register"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.success) {
          showReg(data.message || "Registration failed.", true);
          return;
        }

        showReg(data.message || "Registered. You can sign in above.", false);
        regForm.reset();
      } catch {
        showReg("Network error.", true);
      }
    });
  }
})();
