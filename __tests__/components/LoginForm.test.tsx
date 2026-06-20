import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '@/components/auth/LoginForm'

// Mock the server actions - vi.mock is hoisted so we use vi.fn() inside
vi.mock('@/actions/auth', () => ({
  signIn: vi.fn().mockResolvedValue({}),
  signUp: vi.fn().mockResolvedValue({}),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email and password fields', () => {
    render(<LoginForm />)
    expect(screen.getByPlaceholderText('firstname.lastname@karimjee.com')).toBeTruthy()
    expect(screen.getByPlaceholderText('••••••••')).toBeTruthy()
  })

  it('renders Sign In button by default', () => {
    render(<LoginForm />)
    expect(screen.getByText('Sign In')).toBeTruthy()
  })

  it('shows error for non-karimjee.com email', async () => {
    render(<LoginForm />)

    const emailInput = screen.getByPlaceholderText('firstname.lastname@karimjee.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByText('Sign In')

    fireEvent.change(emailInput, { target: { value: 'user@gmail.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    const errorMsg = await screen.findByText('Only @karimjee.com email addresses are allowed.')
    expect(errorMsg).toBeTruthy()
  })

  it('shows Create an account link', () => {
    render(<LoginForm />)
    expect(screen.getByText('Create an account')).toBeTruthy()
  })

  it('switches to signup mode when clicking Create an account', () => {
    render(<LoginForm />)
    const createLink = screen.getByText('Create an account')
    fireEvent.click(createLink)
    expect(screen.getByText('Create Account')).toBeTruthy()
    expect(screen.getByPlaceholderText('e.g. Jane Mwaka')).toBeTruthy()
  })

  it('does not call signIn when email is invalid', async () => {
    const authModule = await import('@/actions/auth')
    render(<LoginForm />)

    const emailInput = screen.getByPlaceholderText('firstname.lastname@karimjee.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')

    fireEvent.change(emailInput, { target: { value: 'bad@gmail.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(screen.getByText('Sign In'))

    expect(authModule.signIn).not.toHaveBeenCalled()
  })
})
