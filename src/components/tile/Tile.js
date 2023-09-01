import "./Tile.css"

export const Tile = ({pieceName, row, column, availableMove}) => {
    let tileColour;
    if (availableMove) {
        tileColour = "red"
    } else if ((row + column + 2) % 2 === 0) {
        tileColour = "white";
    } else {
        tileColour = "black";
    }
    return <div className={`tile" + ${tileColour}-tile`}>{pieceName}</div>
}
