const { formatPrice } = require("./utils")

// carrinho fica guardado na sessão (req.session)
const Cart = {
  init(oldCart) {
    if (oldCart) {
      this.items = oldCart.items
      this.total = oldCart.total
    } else {
      this.items = []
      this.total = {
        quantity: 0,
        price: 0,
        formattedPrice: formatPrice(0)
      }
    }

    return this
  },
  addOne(product) {
    let inCart = this.getCartItem(product.id)

    if (!inCart) {
      inCart = {
        product: {
          ...product,
          formattedPrice: formatPrice(product.price)
        },
        quantity: 0,
        price: 0,
        formattedPrice: formatPrice(0)
      }

      this.items.push(inCart)
    }

    //check quantity
    if (inCart.quantity >= product.quantity) return this

    //update item
    inCart.quantity++
    inCart.price = inCart.product.price * inCart.quantity
    inCart.formattedPrice = formatPrice(inCart.price)

    //update cart
    this.total.quantity++
    this.total.price += inCart.product.price
    this.total.formattedPrice = formatPrice(this.total.price)

    return this
  },
  removeOne(productID) {
    const inCart = this.getCartItem(productID)

    if (!inCart) return this

    //update item
    inCart.quantity--
    inCart.price = inCart.product.price * inCart.quantity
    inCart.formattedPrice = formatPrice(inCart.price)

    //update cart
    this.total.quantity--
    this.total.price -= inCart.product.price
    this.total.formattedPrice = formatPrice(this.total.price)

    if (inCart.quantity < 1) {
      this.items = this.item.filter(item => item.product.id != inCart.product.id)
      return this
    }

    return this
  },
  delete(productID) {
    const inCart = this.getCartItem(productID)

    if (!inCart) return this

    if (this.items.length > 0) {
      this.total.quantity -= inCart.quantity
      this.total.price -= (inCart.product.price * inCart.quantity)
      this.total.formattedPrice = formatPrice(this.total.price)
    }

    this.items = this.items.filter(item => inCart.product.id != item.product.id)
    return this

  },
  getCartItem(productID) {
    return this.items.find(item => item.product.id == productID)
  }
}

module.exports = Cart
