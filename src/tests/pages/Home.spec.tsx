import { render, screen } from '@testing-library/react'
import { stripe } from '../../services/stripe'
import Home, { getStaticProps } from '../../pages'

jest.mock('next/router')
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
jest.mock('../../services/stripe')

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{ amount: '$10.00', priceId: 'fake-price-id' }} />)

    expect(screen.getByText('for $10.00 month')).toBeInTheDocument()
  })

  it('loads initial data', async () => {

    const retriveStripePricesMocked = jest.mocked(stripe.prices.retrieve)

    retriveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00',
          }
        }
      })
    )
  })

})