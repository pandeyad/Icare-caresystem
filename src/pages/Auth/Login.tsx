import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Login.scss"
import { STRINGS } from "../../i18n/strings"
import { identityService } from "../../services"
import { setAuthToken } from "../../services/gateway/tokenStore"

/**
 * AUTH-001 — Sign in.
 *
 * Submits through `identityService.login` so the UI talks to IdSvc via
 * the gateway client (mocked in the prototype, real JWT in prod). On
 * success we persist the returned token via `setAuthToken` so every
 * downstream gateway call automatically carries the bearer header, then
 * navigate to the app shell. The AppShell's AuthContext bootstrap
 * (`Promise.all([getMe, getMyPermissions])`) picks up the fresh token.
 *
 * Copy follows docs/02-ui-ux/13-content-and-microcopy.md: warm, plain,
 * no "oops".
 */

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    void identityService
      .login({ email, password })
      .then((res) => {
        // TODO(integration): when the real endpoint is live, setAuthToken
        // will carry the JWT into every subsequent gateway request via
        // the Bearer header (cookies optional). The mock JWT is still
        // accepted by the mock gateway, so dev flow is unchanged.
        setAuthToken(res.token)
        navigate("/")
      })
      .catch((err: unknown) => {
        setBusy(false)
        setError(
          err instanceof Error && err.message
            ? err.message
            : "We couldn't sign you in — please try again."
        )
      })
  }

  return (
    <div className="login">
      <div className="login__backdrop" aria-hidden="true" />
      <div className="login__card-wrap">
        <div className="login__brand">
          <div className="login__logo" aria-hidden="true">I</div>
          <div>
            <div className="login__brand-name">{STRINGS.app.name}</div>
            <div className="login__brand-tag">{STRINGS.app.tagline}</div>
          </div>
        </div>

        <form className="login__card" onSubmit={onSubmit} noValidate>
          <div className="login__heading">
            <h1>{STRINGS.auth.login.title}</h1>
            <p>{STRINGS.auth.login.subtitle}</p>
          </div>

          <label className="login__field">
            <span className="login__label">{STRINGS.auth.login.emailLabel}</span>
            <input
              type="email"
              autoComplete="username"
              required
              placeholder={STRINGS.auth.login.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="login__field">
            <span className="login__label-row">
              <span className="login__label">{STRINGS.auth.login.passwordLabel}</span>
              <a className="login__forgot" href="#forgot">
                {STRINGS.auth.login.forgot}
              </a>
            </span>
            <input
              type="password"
              autoComplete="current-password"
              required
              placeholder={STRINGS.auth.login.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className="login__remember">
            <input type="checkbox" defaultChecked />
            <span>{STRINGS.auth.login.rememberMe}</span>
          </label>

          {error && (
            <div role="alert" className="login__error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn--primary login__submit"
            disabled={busy}
          >
            {busy ? STRINGS.common.loading : STRINGS.auth.login.submit}
          </button>

          <div className="login__divider" aria-hidden="true">
            <span>{STRINGS.auth.login.ssoDivider}</span>
          </div>

          <div className="login__sso">
            <button type="button" className="btn btn--secondary">
              <span aria-hidden="true">⬢</span> {STRINGS.auth.login.ssoMicrosoft}
            </button>
            <button type="button" className="btn btn--secondary">
              <span aria-hidden="true">◉</span> {STRINGS.auth.login.ssoGoogle}
            </button>
          </div>

          <p className="login__security">{STRINGS.auth.login.helpSecurity}</p>
        </form>

        <p className="login__footer">
          {STRINGS.auth.login.helpFooter}{" "}
          <Link to="/">Skip to demo →</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
