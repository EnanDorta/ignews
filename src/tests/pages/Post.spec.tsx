import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Posts, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'

const post = {
  slug: 'my-new-post',
  title: 'My post title',
  content: 'My post have this description...',
  updatedAt: '29 de janeiro de 2023',
}

jest.mock('next-auth/react')
jest.mock('next/router')
jest.mock('../../services/prismic')

describe('Post preview page', () => {

  it('renders correctly', () => {

    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })

    render(<Posts post={post} />)
    
    expect(screen.getByText('29 de janeiro de 2023')).toBeInTheDocument()
    expect(screen.getByText('My post title')).toBeInTheDocument()
    expect(screen.getByText('My post have this description...')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects user if subscription is found', async () => {
    const useSessionMocked = jest.mocked(useSession)
    const useRouterMocked = jest.mocked(useRouter)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {},
        expires: '123',
        activeSubscription: 'fake-subscription'
      },
      status: 'authenticated'
     })

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(<Posts post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
   
  })

  it('loads initial data', async () => {
    const getPrismicClienteMocked = jest.mocked(getPrismicClient)

    getPrismicClienteMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: 'My post title',
          content: [
            { type: 'paragraph', text: 'My post have this description...' }
          ],
        },
        last_publication_date: '01-29-2023'
      })
    } as any)

    const response = await getStaticProps({
      params: {
        slug: 'my-new-post'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My post title',
            content: '<p>My post have this description...</p>',
            updatedAt: '29 de janeiro de 2023',
          }
        }
      })
    )

  })
})