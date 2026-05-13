export default class CartModel{
    constructor(productId, userId, quantity, id){
        this.productId = productId,
        this.userId = userId,
        this.quantity = quantity,
        this.id = id
    };

    static getAllCartItems(userId){
        return cart.filter((u)=> u.userId == userId);
    }

    static addProductInCart(productId, userId,quantity){
        const existingItem = cart.find(
            (i) => i.productId == productId && i.userId == userId
        );

        if(existingItem){
            existingItem.quantity = Number(quantity);
            return existingItem;
        }else{
            const cartItem = new CartModel(productId, userId, quantity);
            cart.push(cartItem);

            cartItem.cartItemId = cart.length + 1;
            return cartItem;
        }
        
    }

    static deleteCartItem(cartItemId, userId){
        const cartItemIndex = cart.findIndex((i)=> i.id == cartItemId && i.userId == userId);
        if(cartItemIndex == -1){
            return "Item not found";
        }else{
            cart.splice(cartItemIndex,1);
        }
    }
}

const cart = [
    new CartModel(1,
        2,
        3,
        1
    ),
    new CartModel(
        2,
        1,
        44,
        2
    ),
]