

interface IUtilHelper {

    createRandomText(length: number): string
}

class UtilHelper implements IUtilHelper {

    createRandomText(length: number): string {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        let word = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * letters.length);
            word += letters[randomIndex];
        }
        return word.toUpperCase();
    }

}


export default UtilHelper