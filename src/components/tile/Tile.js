import "./Tile.css"

export const Tile = ({pieceName, row, column, selectPieceCallback, pieceSelected, availableMoves}) => {
    let tileColour;
    if (availableMoves.find(element => element.row === row && element.column === column)) {
        tileColour = "available"
    } else if ((row + column + 2) % 2 === 0) {
        tileColour = "white";
    } else {
        tileColour = "black";
    }

    const handleCallback = () => {
        // if (Object.keys(pieceSelected).length !== 0) {
        //     return selectPieceCallback({});
        // } else {
            return selectPieceCallback({
                row: row,
                column: column
            });
        // }
    };

    return <div onClick={handleCallback} className={`tile" + ${tileColour}-tile`}>{pieceName}</div>
}
