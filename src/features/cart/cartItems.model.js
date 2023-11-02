// productID, userID, quantity
export default class CartItemModel{
    constructor(productId,userID,quantity,id)
    {
        this.productId = productId;
        this.userID = userID;
        this.quantity = quantity;
        this.id = id;
    }

    static add(productID,userID,quantity)
    {
        const cartItem = new CartItemModel(productID,userID,quantity);
        cartItem.id = cartItems.length+1;
        cartItems.push(cartItem);
        return cartItem;
    }

    static get(userID)
    {
        const items = cartItems.filter(i=>i.userID=userID);
        return items;
    }

    static delete(cartItemID,userID)
    {
        const cartItemIndex = cartItems.findIndex((i)=>i.id==cartItemID && i.userID==userID);
        if(cartItemID == -1)
        {
            return 'Item not found';
        }else{
            cartItems.splice(cartItemIndex,1);
        }
    }
}

var cartItems = [new CartItemModel(1,2,1,1)];