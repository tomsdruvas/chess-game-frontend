import React, {useRef, useState} from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./Chessboard.css"
import {Tile} from "../tile/Tile";
import useAuth from "../../hooks/useAuth";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const BOARD_URL = "/board";
const MAKE_MOVE_URL = "/make-a-move/";
const JOIN_GAME_URL = "/add-player-two-board/"
const PAWN_PROMOTION_URL = "/promote-pawn/"

const verticalAxis = [0, 1, 2, 3, 4, 5, 6, 7];
const horizontalAxis = [0, 1, 2, 3, 4, 5, 6, 7];

export const Chessboard = () => {
    const axiosPrivate = useAxiosPrivate();
    const userRef = useRef();

    const [chessBoard, setChessBoard] = useState([]);
    const [chessBoardPlayers, setChessBoardPlayers] = useState({});
    const [currentPlayerColour, setCurrentPlayerColour] = useState("");
    const [chessBoardId, setChessBoardId] = useState("");
    const [tileSelected, setTileSelected] = useState({});
    const [isTileSelected, setTileIsSelected] = useState(false);
    const [availableMoves, setAvailableMoves] = useState([]);
    const [isPawnPromotionAvailable, setIsPawnPromotionAvailable] = useState(false);
    const [latestMove, setLatestMove] = useState({});

    const {auth} = useAuth();

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
            setChessBoardStates(response)
            connectToWs(response?.data?.BoardId)
        } catch (err) {
            console.log(JSON.stringify(err));
        }
    }

    const handleMovePiece = async (destinationSquare) => {
        try {
            const response = await axiosPrivate.post(MAKE_MOVE_URL + chessBoardId, {
                    "currentRow": tileSelected.row,
                    "currentColumn": tileSelected.column,
                    "newRow": destinationSquare.row,
                    "newColumn": destinationSquare.column
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            // setChessBoardStates(response)
        } catch (err) {
            console.log(JSON.stringify(err));
        }
    }

    const handlePromotePawnCallback = async (upgradedPieceName) => {
        try {
            const response = await axiosPrivate.post(PAWN_PROMOTION_URL + chessBoardId, {
                    "upgradedPieceName": upgradedPieceName
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            setChessBoardStates(response)
        } catch (err) {
            console.log(JSON.stringify(err));
        }
    }

    const handleJoinGame = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosPrivate.post(JOIN_GAME_URL + chessBoardId, {},
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            setChessBoardStates(response)
            connectToWs(chessBoardId)
        } catch (err) {
            console.log(JSON.stringify(err));
        }
    }

    const getPieceType = (row, column) => {
        let type = chessBoard?.at(row)?.at(column)?.piece?.type;
        let colour = chessBoard?.at(row)?.at(column)?.piece?.colour;
        type = type ?? "";
        colour = colour ?? "";

        if (type === "emptypiece") {
            return "";
        }
        return colour + " " + type;
    }

    const selectTileCallback = async (newTileSelected) => {
        if (checkIfAlreadySelectedTileIsBeingSelected(newTileSelected)) {
            resetTileSelectedState()
        } else if (checkIfTileHasOwnPlayersPieceOnIt(newTileSelected)) {
            if (checkIfLoggedInUserIsTheActivePlayer()) {
                if (checkIfPlayerNumberAndPieceColourMatchUp(newTileSelected)) {
                    setTileSelected(newTileSelected)
                    setTileIsSelected(true)
                    findAvailableMoves(newTileSelected)
                }
            }
        } else if (isTileSelected && !findInAvailableMoves(newTileSelected)) {
            resetTileSelectedState()
        } else if (isTileSelected && findInAvailableMoves(newTileSelected)) {
            await handleMovePiece(newTileSelected)
            resetTileSelectedState()
        }
        // if tile is selected and tile with illegal move is selected show a pop-up with illegal move warning
    }

    const checkIfPlayerNumberAndPieceColourMatchUp = (newTileSelected) => {
        return (findPieceColourFromTile(newTileSelected) === "white" && auth.username === chessBoardPlayers?.PlayerOneUsername) || (findPieceColourFromTile(newTileSelected) === "black" && auth.username === chessBoardPlayers?.PlayerTwoUsername)
    }

    const checkIfLoggedInUserIsTheActivePlayer = () => {
        return chessBoardPlayers?.ActivePlayerUsername === auth.username
    }

    const checkIfAlreadySelectedTileIsBeingSelected = (newTileSelected) => {
        return isTileSelected && newTileSelected.row === tileSelected.row && newTileSelected.column === tileSelected.column
    }

    const checkIfTileHasOwnPlayersPieceOnIt = (newTileSelected) => {
        return !isTileSelected || findPieceColourFromTile(newTileSelected) === currentPlayerColour
    }

    const resetTileSelectedState = () => {
        setTileSelected({})
        setTileIsSelected(false)
        setAvailableMoves([])
    }

    const findInAvailableMoves = (inputTile) => {
        return availableMoves.find((element) => element.row === inputTile.row && element.column === inputTile.column)
    }

    const findPieceColourFromTile = (inputTile) => {
        return chessBoard?.at(inputTile.row)?.at(inputTile.column)?.piece?.colour
    }

    const findAvailableMoves = (tileSelected) => {
        if (tileSelected) {
            setAvailableMoves(chessBoard?.at(tileSelected.row)?.at(tileSelected.column)?.piece?.legalMoves.map(({
                                                                                                                    row,
                                                                                                                    column
                                                                                                                }) => {
                return {row: row, column: column};
            }))
        }
    }

    let board = [];

    for (let j = 0; j <= verticalAxis.length - 1; j++) {
        for (const column of horizontalAxis) {
            const pieceName = getPieceType(verticalAxis[j], column);
            board.push(<Tile
                key={`${verticalAxis[j]}${column}`}
                row={verticalAxis[j]}
                column={column}
                pieceName={pieceName}
                pieceSelected={tileSelected}
                selectTileCallback={selectTileCallback}
                availableMoves={availableMoves}
                isPawnPromotionAvailable={isPawnPromotionAvailable}
                latestMove={latestMove}
                userLoggedInActivePlayer={checkIfLoggedInUserIsTheActivePlayer()}
                handlePromotePawnCallback={handlePromotePawnCallback}/>)
        }
    }

    const handleUpdateGame = async () => {
        try {
            const response = await axiosPrivate.get(BOARD_URL + "/" + chessBoardId,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            setChessBoardStates(response)
        } catch (err) {
            console.log(JSON.stringify(err));
        }
    }

    const setChessBoardStates = (response) => {
        setChessBoard(response?.data?.Squares);
        setChessBoardPlayers(response?.data?.Players)
        setChessBoardId(response?.data?.BoardId)
        setCurrentPlayerColour(response?.data?.CurrentPlayerColour)
        setIsPawnPromotionAvailable(response?.data?.PawnPromotionPending)
        setLatestMove(response?.data?.LatestMove)
    }

    const setChessBoardStatesWs = (response) => {
        setChessBoard(response?.Squares);
        setChessBoardPlayers(response?.Players)
        setChessBoardId(response?.BoardId)
        setCurrentPlayerColour(response?.CurrentPlayerColour)
        setIsPawnPromotionAvailable(response?.PawnPromotionPending)
        setLatestMove(response?.LatestMove)
    }

    const connectToWs = (chessBoardId) => {
        const WEBSOCKET_URL = 'http://localhost:8080/ws?access_token=' + `${auth?.accessToken}`;
        let sock = new SockJS(WEBSOCKET_URL);
        let stompClient = Stomp.over(sock);
        // stompClient.debug = () => {};
        sock.onopen = function () {
            console.log('open');
        }

        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);

            stompClient.subscribe("/topic/game-progress/" + chessBoardId, function (response) {
                const data = JSON.parse(response.body);
                setChessBoardStatesWs(data)
                //you can execute any function here
            });
        });
    }

    return (
        <>
            <p>Welcome to your Chessboard</p>
            <button onClick={handleStartGame}>Start game</button>
            <div id="chessboard">
                {board}
            </div>
            <form className="join-game" onSubmit={handleJoinGame}>
                <label htmlFor="BoardId">BoardId: </label>
                <input value={chessBoardId} onChange={(e) => setChessBoardId(e.target.value)} type="Board ID"
                       placeholder="Board ID" id="Board ID" name="Board ID" autoComplete="off" ref={userRef} required/>
                <button>Join Game</button>
            </form>
            <button onClick={handleUpdateGame}>Update Game</button>
        </>
    )
}