# Ana's Storefront

Ana's is a static fashion storefront built with HTML, CSS, and vanilla JavaScript. It includes a home page, product listings, a product detail page, a browser-based shopping cart, and store information pages.

## Getting started

No build step or package installation is required.

1. Open `index.html` in a browser, or serve this folder with a local web server.
2. Browse products through **Shop** or the home page.
3. Use a product's cart button to add it to the cart. On the product detail page, select a size and quantity first.
4. Open the shopping bag to review items, edit quantities, remove products, and view the updated total.
5. Select **Proceed to checkout** to open the payment demonstration page.

For a local server with Python installed, run this command from the project folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000> in a browser.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home page with featured products and promotions |
| `shop.html` | Product listing |
| `sproduct.html` | Product detail with size and quantity selection |
| `cart.html` | Cart items, quantities, and order total |
| `payment.html` | Demo checkout with BHIM / UPI payment choices and order summary |
| `blog.html` | Style journal and collection links |
| `about.html` | Store, mission, team, and visit information |
| `contact.html` | Store contact details and message form |

## Project files

- `script.js` contains shared cart storage, product add-to-cart handlers, cart rendering, quantity updates, and mobile navigation behavior.
- `style.css` contains shared storefront, product, cart, blog, and responsive styles.
- `style2.css` styles the About page.
- `style3.css` styles the Contact page.
- `payment.css` styles the demo checkout page using the existing storefront colors and typography.
- `footer.css` styles the shared responsive footer.
- `img/` contains the logos, product photos, banners, blog images, and other page assets.

## Cart behavior

Cart data is saved in the browser's `localStorage` using the key `ana-store-cart`, so it remains available across the site's pages in that browser. Matching product images and sizes are combined into one cart row with an updated quantity. Different sizes are kept as separate rows. The total is calculated from each item's price and quantity; shipping is shown as free.

The cart and checkout are front-end demonstrations. Cart data is stored in the current browser only. The payment page displays the cart total and lets a visitor select **BHIM / UPI** or **Other UPI app** as a demonstration. Continuing displays an under-development message. It does not connect to NPCI, BHIM, a bank, or a payment gateway; it does not open a UPI app, request a UPI PIN or payment credentials, create a transaction, or move money. No payment details are collected or saved.

The Contact form does not submit to a server. Real orders, payment processing, and contact submissions require backend services and an authorized payment provider integration. The demo should not be presented as a live or officially affiliated NPCI/BHIM payment service.

## Checkout demonstration files

- `payment.html` contains the checkout layout, BHIM / UPI demo method choices, development notice, and order summary.
- `payment.css` styles the payment page and includes tablet and mobile layouts.
- `script.js` reads the current cart total for checkout. Submitting the demo form only displays a status message; it does not submit data or make a payment.

## External resources

The pages load Font Awesome icons from cdnjs, and the shared stylesheet imports Google Fonts. Those resources require an internet connection; locally stored page and image assets do not.
