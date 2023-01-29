import { render, screen } from '@testing-library/react'
import { Header } from '../../components/Header'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return {
        data: null,
        status: 'unauthorized'
      }
    }
  }
})

describe('Header Component', () => {
  it('renders correctly', () => {
    render(<Header />)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Posts')).toBeInTheDocument()
  })
})
