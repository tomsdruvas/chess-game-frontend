import React, {useState} from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./Chessboard.css"
import {Tile} from "../tile/Tile";
import useAuth from "../../hooks/useAuth";

const BOARD_URL = "/board";
const verticalAxis = [7, 6, 5, 4, 3, 2, 1, 0];
const horizontalAxis = [0, 1, 2, 3, 4, 5, 6, 7];

export const Chessboard = () => {
    const axiosPrivate = useAxiosPrivate();
    const [chessBoard, setChessBoard] = useState([]);
    const [pieceSelected, setPieceSelected] = useState({});
    const [availableMoves, setAvailableMoves] = useState([]);
    const { auth } = useAuth();



    const handleStartGame = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosPrivate.post(BOARD_URL, {},
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            setChessBoard(response?.data?.Squares);
        } catch (err) {
            console.log(JSON.stringify(err));
        }
    }

    const getPieceName = (row, column) => {
        return chessBoard?.at(row)?.at(column)?.piece?.name;
    }

    const selectPieceCallback = (pieceSelected) => {
        if(chessBoard?.at(pieceSelected.row)?.at(pieceSelected.column)?.piece.type !== "emptypiece") {
            setPieceSelected(pieceSelected)
            findAvailableMoves(pieceSelected)
            console.log(JSON.stringify("Setting piece selected active"))
            console.log(JSON.stringify(pieceSelected))
            // console.log(JSON.stringify(auth))
        }
    }

    const findAvailableMoves = (pieceSelected) => {
        if(pieceSelected) {
            setAvailableMoves(chessBoard?.at(pieceSelected.row)?.at(pieceSelected.column)?.piece?.legalMoves.map(({row, column}) => {
                console.log(JSON.stringify("Finding legal moves " + row + column))
                return {row: row, column: column};
            }))
        }
    }

    let board = [];

    for (let j = verticalAxis.length - 1; j >= 0; j--) {
        for (const column of horizontalAxis) {
            const pieceName = getPieceName(verticalAxis[j], column);
            board.push(<Tile row={verticalAxis[j]}
                             column={column}
                             pieceName={pieceName}
                             pieceSelected={pieceSelected}
                             selectPieceCallback={selectPieceCallback}
                             availableMoves={availableMoves}/>)
        }
    }

    return (
        <>
            <p>Welcome to your Chessboard</p>
            <button onClick={handleStartGame}>Start game</button>
            <div id="chessboard">
                {board}
            </div>
        </>
    )
}