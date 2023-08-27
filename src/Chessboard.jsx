import React from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";

const BOARD_URL = "/board";

export const Chessboard = () => {
    const axiosPrivate = useAxiosPrivate();

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
            console.log(JSON.stringify(response));
        } catch (err) {
            console.log(JSON.stringify(err));
        }

    }

    return (
        <>
            <div>
                <p>Welcome to your Chessboard</p>
                <button onClick={handleStartGame}>Start game</button>
            </div>
        </>
    )
}