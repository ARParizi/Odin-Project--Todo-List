export class ManagedArray {
    constructor(type) {
        this.type = type;
        this.#array = [];
    }
    #array;
    addItem(item) {
        if (!item instanceof this.type)
            throw new Error("Wrong type in function addItem");
        this.#array.push(item);
    }
    removeItemById(itemId) {
        for (let ii = 0; ii < this.#array.length; ii++) {
            if (this.#array[ii].id === itemId) {
                this.#array.splice(ii, 1);
                return;
            }
        }
        throw new Error ("item to remove not found");
    }
    getItemById(itemId) {
        for (let ii = 0; ii < this.#array.length; ii++) {
            if (this.#array[ii].id === itemId) {
                return this.#array[ii];
            }
        }
        throw new Error ("item to return not found");
    }
    getArray = () => this.#array.map(i => i);
    get length(){
        return this.#array.length;
    }
    getLastItem() {
        return this.#array[this.#array.length - 1];
    }
}