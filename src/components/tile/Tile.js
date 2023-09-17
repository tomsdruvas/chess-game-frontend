import "./Tile.css"
import {Button, Grid, Popup} from 'semantic-ui-react'

export const Tile = ({
                         pieceName,
                         row,
                         column,
                         selectTileCallback,
                         availableMoves,
                         isPawnPromotionAvailable,
                         latestMove,
                         userLoggedInActivePlayer,
                         handlePromotePawnCallback
                     }) => {
    let tileColour;
    if (isPawnPromotionAvailable && latestMove.row === row && latestMove.column === column && userLoggedInActivePlayer) {
        tileColour = "pawnPromotion"
    } else if (availableMoves?.find(element => element.row === row && element.column === column)) {
        tileColour = "available"
    } else if ((row + column + 2) % 2 === 0) {
        tileColour = "white";
    } else {
        tileColour = "black";
    }

    const handleCallback = () => {
        return selectTileCallback({
            row: row,
            column: column
        });
    };

    if (isPawnPromotionAvailable && latestMove.row === row && latestMove.column === column && userLoggedInActivePlayer) {
        pieceName = <Popup wide trigger={<Button content='Promote Pawn'/>} on='click'>
            <Grid divided columns='equal'>
                <Grid.Column>
                    <Popup
                        trigger={<Button
                            onClick={() => handlePromotePawnCallback("Queen")}
                            color='blue' content='Queen' fluid/>}
                        position='bottom center'
                        size='tiny'
                        inverted
                    />
                </Grid.Column>
                <Grid.Column>
                    <Popup
                        trigger={<Button
                            onClick={() => handlePromotePawnCallback("Rook")}
                            color='red' content='Rook' fluid/>}
                        position='bottom center'
                        size='tiny'
                        inverted
                    />
                </Grid.Column>
                <Grid.Column>
                    <Popup
                        trigger={<Button
                            onClick={() => handlePromotePawnCallback("Bishop")}
                            color='red' content='Bishop'
                                         fluid/>}
                        position='bottom center'
                        size='tiny'
                        inverted
                    />
                </Grid.Column>
                <Grid.Column>
                    <Popup
                        trigger={<Button
                            onClick={() => handlePromotePawnCallback("Knight")}
                            color='red' content='Knight'
                                         fluid/>}
                        position='bottom center'
                        size='tiny'
                        inverted
                    />
                </Grid.Column>
            </Grid>
        </Popup>
    }

    return <div onClick={handleCallback} className={`tile" + ${tileColour}-tile`}>{pieceName}</div>
}
