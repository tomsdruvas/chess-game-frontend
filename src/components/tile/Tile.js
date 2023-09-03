import "./Tile.css"

export const Tile = ({pieceName, row, column, selectPieceCallback, availableMoves}) => {
    let tileColour;
    if (availableMoves?.find(element => element.row === row && element.column === column)) {
        tileColour = "available"
    } else if ((row + column + 2) % 2 === 0) {
        tileColour = "white";
    } else {
        tileColour = "black";
    }

    const handleCallback = () => {
            return selectPieceCallback({
                row: row,
                column: column
            });
    };

    return <div onClick={handleCallback} className={`tile" + ${tileColour}-tile`}>{pieceName}</div>
}
