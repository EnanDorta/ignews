import { render, screen, fireEvent } from '@testing-library/react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { SubscribeButton } from '../../components/SubscribeButton'

jest.mock('next-auth/react')
jest.mock('next/router')

describe('SubscribeButton Component', () => {
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })
 
    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe Now')).toBeInTheDocument()
  })

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = jest.mocked(signIn)
    const useSessionMocked = jest.mocked(useSession) 
    
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe Now');

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirects to posts when user already has a susbscription', () => {
    const useRouterMocked = jest.mocked(useRouter);
    const useSessionMocked = jest.mocked(useSession);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({ 
        data: {
          user: {
            name: 'John Doe',
            email: 'john@example.com'
          },
          activeSubscription: 'fake-active-subscription',
          expires: 'fake-expired',
        },
        status: 'authenticated'
      })

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe Now');

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith('/posts')

  })
})
