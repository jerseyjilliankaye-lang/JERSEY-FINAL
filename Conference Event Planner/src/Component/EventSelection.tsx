import { useState } from 'react'

type Product = {
  id: string
  name: string
  price: number
  category: 'room' | 'audio' | 'meal'
  icon: string
  description: string
}

const products: Product[] = [
  { id: 'auditorium', name: 'Auditorium Hall', price: 550, category: 'room', icon: '🏛️', description: 'Large venue for keynote sessions' },
  { id: 'conference', name: 'Conference Room', price: 350, category: 'room', icon: '🏢', description: 'Flexible space for focused meetings' },
  { id: 'presentation', name: 'Presentation Room', price: 200, category: 'room', icon: '📽️', description: 'Intimate room for presentations' },
  { id: 'projector', name: 'Projector', price: 150, category: 'audio', icon: '📽️', description: 'Bright HD projection setup' },
  { id: 'speaker', name: 'Speaker', price: 35, category: 'audio', icon: '🔊', description: 'Clear sound for any room size' },
  { id: 'microphone', name: 'Microphone', price: 45, category: 'audio', icon: '🎤', description: 'Wireless audio for speakers' },
  { id: 'lunch', name: 'Lunch', price: 25, category: 'meal', icon: '🍽️', description: 'Fresh lunch per guest' },
  { id: 'dinner', name: 'Dinner', price: 40, category: 'meal', icon: '🥘', description: 'Full dinner per guest' },
  { id: 'coffee', name: 'Coffee Break', price: 15, category: 'meal', icon: '☕', description: 'Coffee and refreshments' },
]

const categoryNames = {
  room: 'Venue spaces',
  audio: 'Audio & visual',
  meal: 'Food & refreshments',
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)

type ProductSectionProps = {
  onBack: () => void
}

export function ProductSection({ onBack }: ProductSectionProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const changeQuantity = (product: Product, amount: number) => {
    setQuantities((currentQuantities) => {
      const nextQuantity = Math.max(0, (currentQuantities[product.id] ?? 0) + amount)

      if (nextQuantity === 0) {
        const updatedQuantities = { ...currentQuantities }
        delete updatedQuantities[product.id]
        return updatedQuantities
      }

      return {
        ...currentQuantities,
        [product.id]: nextQuantity,
      }
    })
  }

  const selectedItems = products.filter((product) => (quantities[product.id] ?? 0) > 0)
  const itemCount = Object.values(quantities).reduce((total, quantity) => total + quantity, 0)
  const subtotal = selectedItems.reduce(
    (total, product) => total + product.price * (quantities[product.id] ?? 0),
    0,
  )

  return (
    <section className="planner" id="products">
      <nav className="planner-nav" aria-label="Planner navigation">
        <button className="brand brand-button" type="button" onClick={onBack}>
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>JILL's Conference</span>
        </button>
        <div className="nav-links">
          <a className="active" href="#venue">Venues</a>
          <a href="#addons">Equipment</a>
          <a href="#meals">Catering</a>
        </div>
        <a className="show-details" href="#cart" aria-label={`${itemCount} items in your plan`}>
          <span>{itemCount}</span>
        </a>
      </nav>

      <div className="planner-body">
        <main className="catalog">
          <header className="planner-heading">
            <div>
      
              <h1>Plan your event</h1>
            </div>
            <p className="selection-count">{itemCount} item{itemCount === 1 ? '' : 's'} selected</p>
          </header>

          {(['room', 'audio', 'meal'] as const).map((category) => (
            <section
              className="category"
              id={category === 'room' ? 'venue' : category === 'audio' ? 'addons' : 'meals'}
              key={category}
            >
              <div className="category-heading">
                <h2>{categoryNames[category]}</h2>
                <span>{products.filter((product) => product.category === category).length} options</span>
              </div>
              <div className="product-grid">
                {products
                  .filter((product) => product.category === category)
                  .map((product) => {
                    const quantity = quantities[product.id] ?? 0
                    return (
                      <article className={`product-card${quantity > 0 ? ' is-selected' : ''}`} key={product.id}>
                        <div className="product-card-top">
                          <div className="product-icon" aria-hidden="true">{product.icon}</div>
                          {quantity > 0 && <span className="selected-badge">Selected</span>}
                        </div>
                        <div className="product-info">
                          <h3>{product.name}</h3>
                          <p>{product.description}</p>
                        </div>
                        <div className="product-footer">
                          <div>
                            <span className="price-label">From</span>
                            <strong className="product-price">{formatCurrency(product.price)}</strong>
                          </div>
                          <div className="quantity-controls" aria-label={`Quantity for ${product.name}`}>
                            <button
                              type="button"
                              onClick={() => changeQuantity(product, -1)}
                              disabled={quantity === 0}
                              aria-label={`Remove one ${product.name}`}
                            >
                              −
                            </button>
                            <span aria-live="polite">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => changeQuantity(product, 1)}
                              aria-label={`Add one ${product.name}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </article>
                    )
                  })}
              </div>
            </section>
          ))}
        </main>

        <aside className="cart-summary" id="cart" aria-label="Event summary">
          {selectedItems.length > 0 && (
            <div className="cart-items">
              {selectedItems.map((product) => (
                <div className="cart-row" key={product.id}>
                  <div className="cart-row-name">
                    <span className="cart-row-icon" aria-hidden="true">{product.icon}</span>
                    <div>
                      <strong>{product.name}</strong>
                      <span>{quantities[product.id]} × {formatCurrency(product.price)}</span>
                    </div>
                  </div>
                  <strong>{formatCurrency(product.price * (quantities[product.id] ?? 0))}</strong>
                </div>
              ))}
            </div>
          )}
          {selectedItems.length > 0 && (
            <>
              <div className="cart-totals">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
                <div className="total">
                  <span>Estimated total</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
              </div>
              <button className="continue-button" type="button">
                Continue
              </button>
            </>
          )}
        </aside>
      </div>
    </section>
  )
}
