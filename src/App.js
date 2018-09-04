import React from 'react';
asdfg

// top-most, parent component
// pulls together main app functions as well as rendering of alerts, navbar, shop and cart
class App extends React.Component {
	constructor() {
		super();
		this.appName = "Shopping Cart Demo"; // Navbar app name
		this.state = {
			cart: [], // customer inventory
			totalPrice: 0, // total price of customer inventory
			alerts: [] // array of alerts to display
		}
	}

	// adds an alert to display
	onShowAlert = alert => {
		this.setState({
			// note: write logic later to delete old alerts from Virtual DOM
			alerts: [...this.state.alerts, alert] // tacks alert on, don't want to overwrite older alert if still displaying
		});
	}

	// adds a new item or adds quantity of item to pre-existing item to customer inventory
	onAddItem = newItem => {
		let newCart = this.state.cart; // create copy of cart to avoid directly altering

		if( newCart.some( e => e.product_id === newItem.product_id ) ) { // add item quantity

			// note: this can be fixed by using webpack
			// this doesn't even work in IE 11!
			// let index = newCart.findIndex( e => { return e.product_id === newItem.product_id } );

			// for IE 11 - 8 compatibility
			// find index of pre-existing item in cart
			let index = -1;
			for(let i=0; i<newCart.length; i++){
				if(newCart[i].product_id === newItem.product_id){
					index = i;
				}
			}

			// update item quantity
			newCart[index].quantity += newItem.quantity;

			// update item price total
			newCart[index].price_total += newItem.price_total;

			// assign new cart
			this.setState({cart: newCart});
		}
		else{ // add new item
			this.setState({
				// add item to end of cart
				cart: [...this.state.cart, newItem]
			});
		}

		// add new item's price total to cart's price total
		this.setState({totalPrice: this.state.totalPrice + newItem.price_total});

		// note: this is bad practice, fix this later to conform to React standards
		// cart pop animation
		document.getElementById('cart-icon').classList.add('pop');
		setTimeout(function(){
		    document.getElementById('cart-icon').classList.remove('pop');
		}, 400);

		// display alert to show success of cart item added
		this.onShowAlert({
			type: "success",
			length: 5,
			title: "Success!",
			message: newItem.quantity + " " + newItem.name + "(s) added to your cart!"
		});
	}

	// note: in-progress
	// will add all items in shop with a quantity > 0 to cart at once
	/*onAddAllItems = () => {
	}*/

	// removes item from cart according to object's ID
	// note: there is probably a better way to do this other than with the DOM object's ID.
	onRemoveItem = id => {
		// copy cart
		let newCart = this.state.cart;

		// note: this can be fixed by using webpack
		// this doesn't even work in IE 11!
		//let index = newCart.findIndex( e => { return e.product_id === parseInt(id) } );

		// for IE 11 - 8 compatibility
		let index = -1;
		for(let i=0; i<newCart.length; i++){
			if(newCart[i].product_id === parseInt(id, 10)){
				index = i;
			}
		}

		// update total price
		this.setState({totalPrice: this.state.totalPrice - newCart[index].price_total});

		// remove found item from cart
		newCart.splice(index, 1);

		// update to new cart
		this.setState({cart: newCart});
	}

	// clears entire cart and total price
	onClearCart = () => {
		this.setState({
			cart: [],
			totalPrice: 0
		});
	}

	render() {
		return(
			<div className="container-fluid p-0 bg-light">
				<AlertContainer alerts={this.state.alerts} />
				<Navbar appName={this.appName} cartLength={this.state.cart.length} />
				<Shop onAddItem={this.onAddItem} onAddAllItems={this.onAddAllItems} />
				<Cart cart={this.state.cart} onRemoveItem={this.onRemoveItem} onClearCart={this.onClearCart} totalPrice={this.state.totalPrice} />
			</div>
		);
	}
}

// page navigation bar
class Navbar extends React.Component {
	render() {
		return(
			<nav className="navbar navbar-white bg-white sticky-top border-bottom">
				<span className="navbar-brand mb-0 h1">
					{this.props.appName}
				</span>

				<ul className="navbar-nav ml-auto navbar-expand-sm">
					<li className="nav-item">
						<button id="cart-button" className="btn btn btn-outline-primary" data-toggle="modal" data-target="#exampleModal">
							<i id="cart-icon" className="fas fa-shopping-cart"></i>
							<span className="badge ml-1">
								{this.props.cartLength}
							</span>
						</button>
					</li>
				</ul>
			</nav>
		);
	}
}

// container for all alerts
class AlertContainer extends React.Component {
	render() {
		// maps through entire array of alerts to render them
		let content = this.props.alerts.map((alert, index) => (
			<Alert key={index} content={alert} />
		));

		return(
			<div id="alert-container" className="fixed-top ml-auto">
				{content}
			</div>
		);
	}
}

class Alert extends React.Component {
	constructor(props) {
		super(props);
		// note: this is hacky, fix later
		this.classesTemp = "mt-2 mb-2 mr-2 alert alert-" + this.props.content.type;
		this.state = {
			show: true,
			classes: this.classesTemp
		}
	}

	// fires when component is done rendering
	// provides fade-out animation
	// hides component
	componentDidMount() {
		setTimeout( () => this.setState({classes: "hideAlert mt-2 mb-2 mr-2 alert alert-" + this.props.content.type}), (this.props.content.length-1)*1000 );
		setTimeout( () => this.setState({show: false}), (this.props.content.length*1000) );
	}

	render() {
		// show component only while necessary, returns null when not.
		if(this.state.show){
			return(
				<div className={this.state.classes} role="alert">
					<b>{this.props.content.title}</b> {this.props.content.message}
				</div>
			);
		}else{
			return null;
		}
	}
}

// shop, handles display and interaction of items in the shop
class Shop extends React.Component {
	render() {
		// note: in progress
		/*const addAllButton = (
			<div className="row mb-5 add-all-button-container">
				<button className="btn btn btn-outline-success mr-1 mx-auto add-all-to-cart" onClick={this.props.onAddAllItems}>
					Add All to Cart
				</button>
			</div>
		);*/
		return(
			<div id="shop-container" className="container">

				<div className="row mb-5">

					{/* note: create array of javascript objects to .map through here instead copy-pasting items over and over */}

					<Item item={{
						product_id: 1,
						name: "Apple",
						image: "images/apple.png",
						image_altText: "Apple",
						price: 0.90,
						price_total: 0
					}} 	onAddItem={this.props.onAddItem} />

					<Item item={{
						product_id: 2,
						name: "Orange",
						image: "images/orange.png",
						image_altText: "Orange",
						price: 0.75,
						price_total: 0
					}} 	onAddItem={this.props.onAddItem} />

					<Item item={{
						product_id: 3,
						name: "Carrot",
						image: "images/carrot.png",
						image_altText: "Carrot",
						price: 0.35,
						price_total: 0
					}} 	onAddItem={this.props.onAddItem} />

					<Item item={{
						product_id: 4,
						name: "Banana",
						image: "images/banana.png",
						image_altText: "Banana",
						price: 0.95,
						price_total: 0
					}} 	onAddItem={this.props.onAddItem} />

					<Item item={{
						product_id: 5,
						name: "Potato",
						image: "images/potato.png",
						image_altText: "Potato",
						price: 0.30,
						price_total: 0
					}} 	onAddItem={this.props.onAddItem} />

					<Item item={{
						product_id: 6,
						name: "Stick Beans",
						image: "images/stickbeans.png",
						image_altText: "Stick Beans",
						price: 0.25,
						price_total: 0
					}} 	onAddItem={this.props.onAddItem} />

					<Item item={{
						product_id: 7,
						name: "Garlic",
						image: "images/garlic.png",
						image_altText: "Garlic",
						price: 0.15,
						price_total: 0
					}} 	onAddItem={this.props.onAddItem} />

					<Item item={{
						product_id: 8,
						name: "Watermelon",
						image: "images/watermelon.png",
						image_altText: "Watermelon",
						price: 3.75,
						price_total: 0
					}} 	onAddItem={this.props.onAddItem} />

					<Item item={{
						product_id: 9,
						name: "Cherry",
						image: "images/cherry.png",
						image_altText: "Cherry",
						price: 0.10,
						price_total: 0
					}} 	onAddItem={this.props.onAddItem} />

					<Item item={{
						product_id: 10,
						name: "Broccoli",
						image: "images/broccoli.png",
						image_altText: "Broccoli",
						price: 0.80,
						price_total: 0
					}} 	onAddItem={this.props.onAddItem} />

					<Item item={{
						product_id: 11,
						name: "Green Pepper",
						image: "images/greenpepper.png",
						image_altText: "Green Pepper",
						price: 0.90,
						price_total: 0
					}} 	onAddItem={this.props.onAddItem} />

					<Item item={{
						product_id: 12,
						name: "Asparagus",
						image: "images/asparagus.png",
						image_altText: "Asparagus",
						price: 1.10,
						price_total: 0
					}} 	onAddItem={this.props.onAddItem} />
				</div>

			</div>
		);
	}
}

// items in the shop
class Item extends React.Component {
	constructor() {
		super();
		this.state = {
			quantity: 0
		}
	}	

	// updates quantity of item selected in shop
	updateQty = e => {
		let val = parseInt(e.target.value, 10);
		this.setState({
			quantity: val
		});
	};

	// submits item to shop, then up to app component to add item to cart or add quantity to pre-existing item
	onSubmitClick = () => {
		const newItem = {
			product_id: this.props.item.product_id,
			name: this.props.item.name,
			price: this.props.item.price,
			quantity: this.state.quantity,
			price_total: 0
		}

		// error checking, and defaulting 0 to 1
		if(newItem.quantity <= 0)
			newItem.quantity = 1;

		// calculate items total price
		newItem.price_total = newItem.quantity * newItem.price;

		// send off
		this.props.onAddItem(newItem);

		// reset item quantity in shop
		this.setState({
			quantity: 0
		});
	};

	// handles plus button, adds 1 to quantity
	addQuantity = () => {
		let num = this.state.quantity;
		num++;
		this.setState({quantity: num});
	}

	// handles minus button, subtracts 1 from quantity as long as quantity is greater than 0
	subtractQuantity = () => {
		let num = this.state.quantity;
		if(num > 0){
			num--;
			this.setState({quantity: num});
		}
	}

	render() {
		const { item } = this.props;

		return(
			<div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
				<div className="card item mx-auto mt-5">
					<div className="card-img-top-container mx-auto">
						<img className="card-img-top" src={item.image} alt={item.image_altText} />
					</div>

					<div className="card-body">
						<h5 className="card-title text-center">{item.name}</h5>

						<p className="card-text text-center text-success">${item.price.toFixed(2)}</p>

						<div className="form-group text-center">
							<div className="row">
								<div className="col-3 p-0 text-center">
									<i className="fas fa-minus-circle" onClick={this.subtractQuantity}></i>
								</div>
								<div className="col-6">
									<input id={"product_id_"+item.product_id} className="col-12 text-center item-input" type="number" min="0" max="50" value={this.state.quantity} onChange={this.updateQty}/>
								</div>
								<div className="col-3 p-0 text-center">
									<i className="fas fa-plus-circle" onClick={this.addQuantity}></i>
								</div>
							</div>

							<div className="row mt-3">
								<div className="col-12">
									<button className="btn btn-success" pattern="^(0|[1-9][0-9]*)$" onClick={this.onSubmitClick}>Add To Cart</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

// cart, shows customer what they have selected
class Cart extends React.Component {
	constructor() {
		super();
		this.state = {
			itemEditID: -1 // default state
		}
	}

	// handles click of 'x' button, removes item from cart
	onRemoveClick = e => {
		this.props.onRemoveItem(e.target.id);
	}

	// in progress
	// getting hacky here...
	/*editQuantityClick = e => {
		var product_id = e.target.id.substring( e.target.id.indexOf('id_') + 3 );
		this.setState({itemEditID: parseInt(product_id, 10)})
	}*/

	render() {
		const { cart } = this.props;
		let content = '';
		let total = '';

		if(cart.length < 1){
			content = <h6 className="text-center m-2">Your cart is empty! :(</h6>
		}else{
			content = cart.map((item, index) => (
				<div className="row mt-2 pb-2 border-bottom cart-item" key={"product_id_"+item.product_id}>
					<div className="col-10">
						<div className="row">
							<div className="col-6">
								Item: <span className="text-primary">{item.name}</span>
							</div>
							<div className="col-6">
								Quantity: <span className="text-primary">{item.quantity}</span>
								{/*<a id={"edit_product_id_"+item.product_id} href="#" className="ml-1" onClick={this.editQuantityClick} data-toggle="modal" data-target="#exampleModal2">Edit</a>*/}
							</div>
						</div>

						<div className="row">
							<div className="col-6">
								Price: <span className="text-success">${item.price.toFixed(2)}</span>
							</div>
							<div className="col-6">
								Sub Total: <span className="text-success">${item.price_total.toFixed(2)}</span>
							</div>
						</div>
					</div>
					<div className="col-2">
						<span id={item.product_id} className="item-remove" aria-hidden="true" onClick={this.onRemoveClick} >&times;</span>
					</div>
				</div>
			));
		}

		if(this.props.totalPrice > 0){
			total = (
				<div className="row">
					<div className="col-6 mt-3">
						<h6 className="m-0">Total Price: <span className="text-success">${this.props.totalPrice.toFixed(2)}</span></h6>
						<button type="button" className="mt-2 btn btn-sm btn-danger" onClick={this.props.onClearCart}>Clear Cart</button>
					</div>
				</div>
			);
		}else{
			total = '';
		}

		return(
			<div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Cart</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							{content}
							{total}
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
							<button type="button" className="btn btn-success">Proceed to Checkout</button>
						</div>
					</div>
				</div>
			</div>
			
		);
	}
}

// render app
ReactDOM.render(
	<App />,
	document.getElementById('root')
);