export class ManagedArray {
    constructor(type) {
        this.type = type;
        this.#array = [];
    }
    #array;
    addItem(item) {
        if (typeof item !== this.type)
            throw new Error("Wrong type in function addItem");
        this.#array.push();
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
    getArray = () => this.#array.map(i => i);
}