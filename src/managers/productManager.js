import fs from 'fs';

export default class ProductManager {
    
    constructor(path){
        this.path = path
    }

    async addProduct( product ) {

        product.id = await this.#getMaxId() + 1;
        const products = await this.getProducts();
        products.push( product );

        try {
            await fs.promises.writeFile( this.path, JSON.stringify( products ) );
            return product;
        } catch ( error ) {
            console.log( error );
        }

    }

    async #getMaxId(){
        try {
            const products = await this.getProducts();
            const ids = products.map(product => product.id)
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

    async getProducts() {
        
        try {
            if( fs.existsSync( this.path ) ) {
                const products = await fs.promises.readFile( this.path, 'utf-8' );
                const productsJs = JSON.parse( products );
                return productsJs;
            } else {
                return [];
            }
        } catch ( error ) {
            console.log( error );
        }

    }

    async getProductById( id ) {

        const products = await this.getProducts();

        let encontrado;
        if( id ) {
            encontrado = products.find( prod => prod.id == id );
            return encontrado || 'INEXISTENTE';
        }
        return 'NO_ID';
    }

    async deleteProduct( id ) {

        try {
            if( fs.existsSync( this.path ) ) {
                const products = await this.getProducts();
                const productsUpdate = products.filter( prod => prod.id != id );
                if( products.length == productsUpdate.length ) {
                    return "Inexistente";
                } else {
                    await fs.promises.writeFile( this.path, JSON.stringify( productsUpdate ) );
                    return "Borrado";
                }
            }
        } catch ( error ) {
            console.log( error );
        }

    }

    async updateProduct( id = -1, fields ) {

        try{

            const products = await this.getProducts();
    
            let idx = products.findIndex( prod => prod.id == id );
            if( idx >= 0 ) {
                const modificado =  { ...products[idx], ...fields };
                products[idx] = modificado;
                await fs.promises.writeFile( this.path, JSON.stringify( products ) );
            } else {
                return `Error, no existe producto con id = ${id}`;
            }

        } catch ( error ){
            console.log( error );
        }

    }

}