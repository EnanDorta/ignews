import { render, screen } from '@testing-library/react'
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'

const posts = [{
  slug: 'my-new-post',
  title: 'My post title',
  excerpt: 'My post have this description...',
  updatedAt: '29 de janeiro de 2023',
}]

jest.mock('../../services/prismic')

describe('Posts page', () => {

  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('29 de janeiro de 2023')).toBeInTheDocument()
    expect(screen.getByText('My post title')).toBeInTheDocument()
    expect(screen.getByText('My post have this description...')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClienteMocked = jest.mocked(getPrismicClient)

    getPrismicClienteMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: 'My post title',
              content: [
                { type: 'paragraph', text: 'My post have this description...' }
              ],
            },
            last_publication_date: '01-29-2023'
          }
        ]
      }),
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{ 
            slug: 'my-new-post',
            title: 'My post title',
            excerpt: 'My post have this description...',
            updatedAt: '29 de janeiro de 2023'
          }]
        }
      })
    )
  })

})