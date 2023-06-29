import fs from 'fs';

export default class CartManager {
    
    constructor(path){
        this.path = path
    }

    //Creat a new Cart
    async addCart() {

        try {
            const carts = await this.getCarts();
            const newCart = {
                id: await this.#getMaxId() + 1,
                products: []
            }
            carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return newCart;
        } catch (error) {
            console.log(error);
        }

    }

    //Get Max ID
    async #getMaxId(){

        try {
            const carts = await this.getCarts();
            const ids = carts.map(cart => cart.id)
            if(ids.length > 0) {
                return Math.max(...ids);
            } else {
                return 0;
            }
        }
        catch (error){
            console.log(error);
        } 
    }

    //Get all carts
    async getCarts() {
        
        try {
            if( fs.existsSync( this.path ) ) {
                const carts = await fs.promises.readFile( this.path, 'utf-8' );
                const cartsJs = JSON.parse( carts );
                return cartsJs;
            } else {
                return [];
            }
        } catch ( error ) {
            console.log( error );
        }

    }

    //Get Cart by ID
    async getCartById( id ) {

        const carts = await this.getCarts();

        let encontrado;
        if( id ) {
            encontrado = carts.find( cart => cart.id == id );
            return encontrado || 'INEXISTENTE';
        }
        return "Debe proporcionar un id para la búsqueda";
    }

    //Delete Cart by ID
    async deleteCart( id ) {

        try {
            if( fs.existsSync( this.path ) ) {
                const carts = await this.getCarts();
                const cartsUpdate = carts.filter( cart => cart.id != id );
                if( carts.length == cartsUpdate.length ) {
                    return "Inexistente";
                } else {
                    await fs.promises.writeFile( this.path, JSON.stringify( cartsUpdate ) );
                    return "Borrado";
                }
            }
        } catch ( error ) {
            console.log( error );
        }

    }

    async updateCart( cart ) {
        try{
            if( fs.existsSync( this.path ) ) {
                const carts = await this.getCarts();
                let idx = carts.findIndex( cartFile => cartFile.id == cart.id );
                if( idx >= 0 ) {
                    const cartModificado =  { ...cart };
                    carts[idx] = cartModificado;
                    await fs.promises.writeFile( this.path, JSON.stringify( carts ) );
                }
            }
        } catch (error){
             console.log(error);
        }
    }

}