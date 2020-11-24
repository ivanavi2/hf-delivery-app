module.exports = function Cart(cart) {
    this.items = cart.items || [];
    this.totalItems = cart.totalItems || 0.00;
    this.totalPrice = cart.totalPrice || 0.00;
    console.log("cart store id in function" + cart.storeId);

    this.add = function(item) {

        const itemIndex = this.items.findIndex((p) => p.productId == item._id);
        console.log(itemIndex);
        if (itemIndex > -1) {
            // if product exists in the cart, update the quantity
            this.items[itemIndex].qty++;
            this.items[itemIndex].price = (this.items[itemIndex].qty * item.price).toFixed(2);
            this.totalItems++;
            this.totalPrice += item.price;
          } else {
            // if product does not exists in cart, find it in the db to retrieve its price and add new item
            console.log("PUSHIING");
            this.items.push({
              productId: item._id,
              qty: 1,
              price: item.price,
              name: item.name,
              description: item.description,
              image: item.image,
            });      
            this.totalItems++;
            this.totalPrice += item.price;
        }            

    };

    this.remove = function(item) {
        const itemIndex = this.items.findIndex((p) => p.productId == item._id);
        console.log(itemIndex);

        if(itemIndex > -1){
            this.items[itemIndex].qty--;
            this.items[itemIndex].price = this.items[itemIndex].qty * item.price;
            this.totalItems--;
            this.totalPrice -= item.price;
        }

        //Delete items from cart is qty is 0 
        if(this.items[itemIndex].qty <= 0){
            this.items.splice(itemIndex,1);
        }

    };
    
    this.getItems = function() {
        var arr = [];
        for (var i in this.items) {
            arr.push(this.items[i]);
        }
        return arr;
    };
};