import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUserAction } from '../../redux/action/userAction'
import './LoginPage.scss'

function LoginPage({ onRouteChange }) {
  const dispatch = useDispatch()
  const { error, status } = useSelector((state) => state.user)
  const [form, setForm] = useState({ loginId: '', password: '' })
  const isLoading = status === 'loading'

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await dispatch(loginUserAction(form))

    if (loginUserAction.fulfilled.match(result)) {
      onRouteChange('dashboard')
    }
  }

  return (
    <div className="login-page">
      <section className="login-panel">
        <div>
          <span className="page-kicker">Protected access</span>
          <h1>Certificate desk login</h1>
          <p>
            Sign in with username/email and password to open certificate search
            and dashboard pages.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>Username / Email</span>
            <input
              autoComplete="username"
              placeholder="admin@example.com"
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
          </label>
          <label>
            <span>Password</span>
            <input
              autoComplete="current-password"
              placeholder="Enter password"
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
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button disabled={isLoading} type="submit">
            {isLoading ? 'Checking...' : 'Login'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default LoginPage
