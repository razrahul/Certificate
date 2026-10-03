import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { loginUserAction } from '../../redux/action/userAction'
import './LoginPage.scss'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { error, status } = useSelector((state) => state.user)
  const [form, setForm] = useState({ loginId: '', password: '', rememberMe: false })
  const isLoading = status === 'loading'

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await dispatch(loginUserAction(form))

    if (loginUserAction.fulfilled.match(result)) {
      const user = result.payload
      const destination = location.state?.from || (user?.role === 'USER' ? '/home' : '/certificate')
      navigate(destination, { replace: true })
    }
  }

  return (
    <div className="login-page-container">
      <div className="login-card">
        
        {/* Left Side: Welcome Panel */}
        <div className="login-left-panel">
          <div className="logo-wrapper">
            <img src="/Logo.png" alt="BSMEB Logo" className="board-logo" />
          </div>
          <span className="panel-kicker">Protected Portal Access</span>
          <h2>BSMEB Certificate Desk</h2>
          <p>
            Authenticate using your registered administrator or operator credentials to search, verify, modify, and print student marksheets.
          </p>
          <div className="panel-footer-info">
            <span>Bihar State Madarsa Education Board, Patna</span>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="login-right-panel">
          <div className="form-header">
            <h3>Account Sign In</h3>
            <p>Enter details below to access the secure database</p>
          </div>

          <form className="login-form-element" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="loginId">Username or Email</label>
              <input
                id="loginId"
                autoComplete="username"
                placeholder="Enter username or email"
                required
                type="text"
                value={form.loginId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    loginId: event.target.value,
                  }))
                }
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                autoComplete="current-password"
                placeholder="Enter account password"
                required
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
              />
            </div>

            <div className="remember-me-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      rememberMe: event.target.checked,
                    }))
                  }
                />
                <span className="checkbox-text">Remember me for 7 days</span>
              </label>
            </div>

            {error && <p className="form-error-msg">{error}</p>}

            <button disabled={isLoading} type="submit" className="login-btn-submit">
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default LoginPage
