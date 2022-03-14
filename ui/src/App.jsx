/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */
/* eslint "no-alert": "off" */

// eslint-disable-next-line react/prefer-stateless-function

const BASE_URL = "http://localhost:3000";

class ProductAdd extends React.Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		const product = {
			Category: document.getElementById("category").value,
			Price: document.getElementById("price").value.slice(1),
			Name: document.getElementById("name").value,
			Image: document.getElementById("image").value
		}
		this.props.addProduct(product);
		document.getElementById("category").value = "";
		document.getElementById("price").value = "";
		document.getElementById("name").value = "";
		document.getElementById("image").value = "";
	}

	render() {
		return (
			<section>
				<p>Add a new product to inventory</p>
				<hr />
				<form>
					<div className="input-group">
						<label htmlFor="category">Category:</label>
						<select name="category" id="category">
							<option value=""></option>
							<option value="Accessories">Accessories</option>
							<option value="Shirts">Shirts</option>
							<option value="Jeans">Jeans</option>
							<option value="Jackets">Jackets</option>
							<option value="Sweaters">Sweaters</option>
						</select>
					</div>
					<div className="input-group">
						<label htmlFor="price">Price:</label>
						<input type="text" id="price" defaultValue="$" />
					</div>
					<div className="input-group">
						<label htmlFor="name">Product Name:</label>
						<input type="text" id="name" />
					</div>
					<div className="input-group">
						<label htmlFor="image">Image URL:</label>
						<input type="text" id="image" />
					</div>

					<button type="submit" onClick={this.onSubmit}>Add Product</button>
				</form>
			</section>
		)
	}
}

class ProductRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { Name, Price, Category, Image } = this.props.product;
		return (
			<tr>
				<td>{ Name }</td>
				<td>${ Price }</td>
				<td>{ Category }</td>
				<td><a href={ Image } target="_blank">View</a></td>
			</tr>
		)
	}
}

class ProductTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const rows = this.props.products.map(p => <ProductRow product={p} key={p.id} />)
		return (
			<section>
				<p>Showing all available products</p>
				<hr />
				<table>
					<thead>
						<tr>
							<td>Product Name</td>
							<td>Price</td>
							<td>Category</td>
							<td>Image</td>
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</table>
			</ section>
		)
	}
}

class ProductList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products: []
		}
		this.addProduct = this.addProduct.bind(this);
		this.getProducts()
	}

	getProducts() {
		const query = `
		query {
			productList {
				_id
				id
				Category
				Price
				Name
				Image
			}
		}
		`;

		fetch(BASE_URL + "/graphql", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query })
		})
		.then(res => res.json())
		.then((res) => {
			this.setState((state, props) => {
				state.products = res.data.productList;
				return state;
			})
		})
		.catch(err => console.error(err))
	}

	addProduct(product) {
		const query = `
		mutation {
			addProduct (
				Category: [` + product.Category + `]
				Name: "` + product.Name + `"
				Price: ` + product.Price + `
				Image: "` + product.Image + `"
			) {
				_id
				id
				Category
				Price
				Name
				Image
			}
		}
		`;

		fetch(BASE_URL + "/graphql", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query })
		})
		.then(res => res.json())
		.then((res) => {
			this.setState((state, props) => {
				state.products.push(res.data.addProduct);
				return state;
			})
		})
		.catch(err => console.error(err))
	}

	render() {
		return (
			<React.Fragment>
				<h2>My Company Inventory</h2>
				<ProductTable products={this.state.products} />
				<ProductAdd addProduct={this.addProduct} />
			</React.Fragment>
		)
	}
}

class App extends React.Component {
	render() {
		return (
			<React.Fragment>
				<ProductList />
			</React.Fragment>
		)
	}
}

ReactDOM.render(React.createElement(App), document.getElementById("root"));