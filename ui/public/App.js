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
		};
		this.props.addProduct(product);
		document.getElementById("category").value = "";
		document.getElementById("price").value = "";
		document.getElementById("name").value = "";
		document.getElementById("image").value = "";
	}

	render() {
		return React.createElement(
			"section",
			null,
			React.createElement(
				"p",
				null,
				"Add a new product to inventory"
			),
			React.createElement("hr", null),
			React.createElement(
				"form",
				null,
				React.createElement(
					"div",
					{ className: "input-group" },
					React.createElement(
						"label",
						{ htmlFor: "category" },
						"Category:"
					),
					React.createElement(
						"select",
						{ name: "category", id: "category" },
						React.createElement("option", { value: "" }),
						React.createElement(
							"option",
							{ value: "Accessories" },
							"Accessories"
						),
						React.createElement(
							"option",
							{ value: "Shirts" },
							"Shirts"
						),
						React.createElement(
							"option",
							{ value: "Jeans" },
							"Jeans"
						),
						React.createElement(
							"option",
							{ value: "Jackets" },
							"Jackets"
						),
						React.createElement(
							"option",
							{ value: "Sweaters" },
							"Sweaters"
						)
					)
				),
				React.createElement(
					"div",
					{ className: "input-group" },
					React.createElement(
						"label",
						{ htmlFor: "price" },
						"Price:"
					),
					React.createElement("input", { type: "text", id: "price", defaultValue: "$" })
				),
				React.createElement(
					"div",
					{ className: "input-group" },
					React.createElement(
						"label",
						{ htmlFor: "name" },
						"Product Name:"
					),
					React.createElement("input", { type: "text", id: "name" })
				),
				React.createElement(
					"div",
					{ className: "input-group" },
					React.createElement(
						"label",
						{ htmlFor: "image" },
						"Image URL:"
					),
					React.createElement("input", { type: "text", id: "image" })
				),
				React.createElement(
					"button",
					{ type: "submit", onClick: this.onSubmit },
					"Add Product"
				)
			)
		);
	}
}

class ProductRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { Name, Price, Category, Image } = this.props.product;
		return React.createElement(
			"tr",
			null,
			React.createElement(
				"td",
				null,
				Name
			),
			React.createElement(
				"td",
				null,
				"$",
				Price
			),
			React.createElement(
				"td",
				null,
				Category
			),
			React.createElement(
				"td",
				null,
				React.createElement(
					"a",
					{ href: Image, target: "_blank" },
					"View"
				)
			)
		);
	}
}

class ProductTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const rows = this.props.products.map(p => React.createElement(ProductRow, { product: p, key: p.id }));
		return React.createElement(
			"section",
			null,
			React.createElement(
				"p",
				null,
				"Showing all available products"
			),
			React.createElement("hr", null),
			React.createElement(
				"table",
				null,
				React.createElement(
					"thead",
					null,
					React.createElement(
						"tr",
						null,
						React.createElement(
							"td",
							null,
							"Product Name"
						),
						React.createElement(
							"td",
							null,
							"Price"
						),
						React.createElement(
							"td",
							null,
							"Category"
						),
						React.createElement(
							"td",
							null,
							"Image"
						)
					)
				),
				React.createElement(
					"tbody",
					null,
					rows
				)
			)
		);
	}
}

class ProductList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products: []
		};
		this.addProduct = this.addProduct.bind(this);
		this.getProducts();
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
		}).then(res => res.json()).then(res => {
			this.setState((state, props) => {
				state.products = res.data.productList;
				return state;
			});
		}).catch(err => console.error(err));
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
		}).then(res => res.json()).then(res => {
			this.setState((state, props) => {
				state.products.push(res.data.addProduct);
				return state;
			});
		}).catch(err => console.error(err));
	}

	render() {
		return React.createElement(
			React.Fragment,
			null,
			React.createElement(
				"h2",
				null,
				"My Company Inventory"
			),
			React.createElement(ProductTable, { products: this.state.products }),
			React.createElement(ProductAdd, { addProduct: this.addProduct })
		);
	}
}

class App extends React.Component {
	render() {
		return React.createElement(
			React.Fragment,
			null,
			React.createElement(ProductList, null)
		);
	}
}

ReactDOM.render(React.createElement(App), document.getElementById("root"));