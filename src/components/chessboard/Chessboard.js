import React, {useState} from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./Chessboard.css"
import {Tile} from "../tile/Tile";

const BOARD_URL = "/board";
const verticalAxis = [7, 6, 5, 4, 3, 2, 1, 0];
const horizontalAxis = [0, 1, 2, 3, 4, 5, 6, 7];
let squares = [];

export const Chessboard = () => {
    const axiosPrivate = useAxiosPrivate();
    const [chessBoard, setChessBoard] = useState([]);

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
            console.log(JSON.stringify(squares));
        } catch (err) {
            console.log(JSON.stringify(err));
        }
    }

    const getPieceName = (row, column) => {
        return chessBoard?.at(row)?.at(column)?.piece?.name;
    }

    let board = [];

    for (let j = verticalAxis.length - 1; j >= 0; j--) {
        for (const column of horizontalAxis) {
            const pieceName = getPieceName(verticalAxis[j], column);
            board.push(<Tile row={verticalAxis[j]} column={column} pieceName={pieceName}/>)
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