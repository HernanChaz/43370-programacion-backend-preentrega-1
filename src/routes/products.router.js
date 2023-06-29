import { Router } from 'express';
const router = Router();

import ProductManager from '../managers/productManager.js';
const productManager = new ProductManager('./src/db/products.json')
import { uploader } from '../middlewares/multer.js';

//Get all products
router.get('/', async(req, res)=>{
    try {
        const products = await productManager.getProducts();
        const { limit } = req.query;
        if( limit > 0 ){
            const productsSlice = products.slice(0, limit);
            res.status(200).json(productsSlice); 
        } else {
            res.status(200).json(products); 
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//Get product by ID
router.get('/:idProduct', async(req, res)=>{
    try {
        const { idProduct } = req.params;
        const product = await productManager.getProductById(Number(idProduct));
        if(product){
            res.json(product)
        } else {
            res.status(400).json({message: 'Product not found'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//Create a new product
router.post('/', uploader.array('thumbnails'), async(req, res)=>{
    try {
        const productData = req.body;
        const thumbs = req.files;
        // console.log(product);
        // console.log(thumbs);
        const product = {
            ...productData,
            status: true,
            thumbnails: []
        }
        if(thumbs) {
            thumbs.forEach(file => product.thumbnails.push(file.path));
        }
        const newProduct = await productManager.addProduct(product);
        res.status(200).json(newProduct);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//Update a product
router.put('/:pid', async(req, res)=>{
    try {
        const { pid } = req.params;
        const prodId = parseInt(pid);
        //TODO
        productManager.updateProduct();

        console.log(prodId);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//Delete a product
router.delete('/:pid', async(req, res)=>{
    try {
        const { pid } = req.params;
        const prodId = parseInt(pid);
        const deleteStatus = await productManager.deleteProduct(prodId);
        console.log("deleteStatus ", deleteStatus);
        if(deleteStatus == "Borrado"){
            res.status(200).json(`Se ha borrado el producto id: ${prodId}`);
        } else {
            res.status(200).json(`No se ha encontrado el producto id: ${prodId}`);
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router;