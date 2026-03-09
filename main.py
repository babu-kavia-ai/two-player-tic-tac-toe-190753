#!/usr/bin/env python3
"""
Two-player Tic-Tac-Toe (CLI).

This repository currently contains no game source code beyond a placeholder README.
This `main.py` serves as the entrypoint so the project is runnable immediately.

Run:
    python main.py

Rules:
- Two human players ("X" and "O") alternate turns.
- Choose a move by entering a position 1-9:
    1 | 2 | 3
    4 | 5 | 6
    7 | 8 | 9
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import List, Optional, Tuple


@dataclass(frozen=True)
class Move:
    """A move on the board."""

    player: str  # "X" or "O"
    index: int  # 0-8


class TicTacToe:
    """Core game state and rules (UI-agnostic)."""

    def __init__(self) -> None:
        self._board: List[str] = [" "] * 9
        self._current_player: str = "X"

    @property
    def current_player(self) -> str:
        """Return the player whose turn it is."""
        return self._current_player

    @property
    def board(self) -> List[str]:
        """Return a copy of the current board."""
        return list(self._board)

    def is_valid_move(self, index: int) -> bool:
        """Return True if the move can be played at `index` (0-8)."""
        if index < 0 or index >= 9:
            return False
        return self._board[index] == " "

    def play(self, index: int) -> Move:
        """Play a move for the current player at `index` (0-8).

        Raises:
            ValueError: If the move is invalid.
        """
        if not self.is_valid_move(index):
            raise ValueError("Invalid move.")
        move = Move(player=self._current_player, index=index)
        self._board[index] = self._current_player
        self._current_player = "O" if self._current_player == "X" else "X"
        return move

    def winner(self) -> Optional[str]:
        """Return 'X' or 'O' if a player has won; otherwise None."""
        lines = self._winning_lines()
        for a, b, c in lines:
            if self._board[a] != " " and self._board[a] == self._board[b] == self._board[c]:
                return self._board[a]
        return None

    def is_draw(self) -> bool:
        """Return True if the game is a draw (no moves left, no winner)."""
        return self.winner() is None and all(cell != " " for cell in self._board)

    @staticmethod
    def _winning_lines() -> List[Tuple[int, int, int]]:
        return [
            (0, 1, 2),
            (3, 4, 5),
            (6, 7, 8),
            (0, 3, 6),
            (1, 4, 7),
            (2, 5, 8),
            (0, 4, 8),
            (2, 4, 6),
        ]


def _render_board(board: List[str]) -> str:
    """Render the board with position hints for empty cells."""
    def cell(i: int) -> str:
        return board[i] if board[i] != " " else str(i + 1)

    rows = [
        f" {cell(0)} | {cell(1)} | {cell(2)} ",
        f" {cell(3)} | {cell(4)} | {cell(5)} ",
        f" {cell(6)} | {cell(7)} | {cell(8)} ",
    ]
    return "\n---+---+---\n".join(rows)


def _prompt_move(game: TicTacToe) -> int:
    """Prompt the current player for a move (returns 0-8)."""
    while True:
        raw = input(f"Player {game.current_player}, choose a position (1-9): ").strip()
        if raw.lower() in {"q", "quit", "exit"}:
            raise KeyboardInterrupt
        if not raw.isdigit():
            print("Please enter a number from 1 to 9 (or 'q' to quit).")
            continue
        pos = int(raw)
        if pos < 1 or pos > 9:
            print("Position must be between 1 and 9.")
            continue
        index = pos - 1
        if not game.is_valid_move(index):
            print("That position is already taken. Try another.")
            continue
        return index


# PUBLIC_INTERFACE
def main() -> int:
    """Program entrypoint.

    Runs an interactive two-player Tic-Tac-Toe game in the terminal.

    Returns:
        Exit status code (0 for normal exit).
    """
    print("Two-player Tic-Tac-Toe")
    print("Enter positions 1-9 as shown on the board. Type 'q' to quit.")
    print()

    game = TicTacToe()

    try:
        while True:
            print(_render_board(game.board))
            print()

            move_index = _prompt_move(game)
            game.play(move_index)

            w = game.winner()
            if w is not None:
                print()
                print(_render_board(game.board))
                print()
                print(f"Player {w} wins!")
                return 0

            if game.is_draw():
                print()
                print(_render_board(game.board))
                print()
                print("It's a draw!")
                return 0

            print()
    except KeyboardInterrupt:
        print("\nGoodbye.")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
