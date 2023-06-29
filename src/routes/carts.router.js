import { Router } from 'express';
const router = Router();

import CartManager from '../managers/cartManager.js';
import ProductManager from '../managers/productManager.js';
const cartManager = new CartManager('./src/db/carts.json');
const productManager = new ProductManager('./src/db/products.json')

//Create a new Cart
router.post('/', async (req, res)=>{
    try {
        const newCart = await cartManager.addCart();
        res.status(200).json(newCart); 
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//Get all prodructs from a Cart
router.get('/:cid', async (req, res)=>{
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);
        if(cart != 'INEXISTENTE'){
            res.status(200).json(cart.products); 
        } else {
            res.status(400).json({msg: `No existe carrito id:${cid}`}); 
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/:cid/product/:pid', async (req, res)=>{
    try {
        const { cid, pid } = req.params;
        const prod = await productManager.getProductById(pid);
        if(prod == 'INEXISTENTE'){
            res.status(400).json({msg: `No existe el producto de id: ${pid}`});
        } else {
            const cart = await cartManager.getCartById(cid);
            if(cart == 'INEXISTENTE'){
                res.status(400).json({msg: `No existe el carrito de id: ${cid}`});
            }else{
                let idx = cart.products.findIndex( prod => prod.id == pid );
                if(idx >= 0) {
                    cart.products[idx].quantity++;
                } else {
                    cart.products.push({ id: pid, quantity: 1});
                }
                await cartManager.updateCart(cart);
                res.status(200).json(`Se agregó el producto ${pid} al carrito ${cid}`);
            }
        }
         
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router;